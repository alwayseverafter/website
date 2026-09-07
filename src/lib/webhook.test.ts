import { beforeAll, describe, expect, it } from "vitest";
import Stripe from "stripe";

/**
 * The webhook's branches.
 *
 * Every path below is executed rather than reasoned about. LESSONS.md R3 says
 * a fallback that never runs in a test is a fallback nobody has verified, and
 * names the `tor` opener as the one that shipped broken for exactly that
 * reason. This route decides whether a paying customer receives anything, so
 * each of its exits gets a case.
 *
 * Stripe's own `generateTestHeaderString` signs the fixtures, so verification
 * is tested against the real implementation rather than a stub of it.
 */

const SIGNING_SECRET = "whsec_test_secret";

let POST: (req: Request) => Promise<Response>;
let stripe: Stripe;

beforeAll(async () => {
  process.env.STRIPE_SECRET_KEY = "sk_test_key";
  process.env.STRIPE_WEBHOOK_SECRET = SIGNING_SECRET;
  /* Deliberately left unset: the database is unconfigured, which is what makes
     the paid case stop at a reportable 500 instead of a network call. */
  delete process.env.NEXT_PUBLIC_SUPABASE_URL;
  delete process.env.SUPABASE_SERVICE_ROLE_KEY;

  stripe = new Stripe("sk_test_key");
  POST = (await import("../app/api/stripe/webhook/route")).POST;
});

const METADATA = {
  partnerAName: "Max",
  partnerBName: "Lena",
  weddingDate: "2026-12-15",
  theme: "atelier-blanc",
  tier: "invitation",
  locale: "en",
};

function sessionEvent(overrides: Record<string, unknown> = {}, type = "checkout.session.completed") {
  return {
    id: "evt_test",
    object: "event",
    type,
    data: {
      object: {
        id: "cs_test_abc",
        object: "checkout.session",
        payment_status: "paid",
        // The charge is read from the session, never from a constant in the
        // codebase: a price in source can drift from what was billed.
        amount_total: 24900,
        currency: "usd",
        payment_intent: "pi_test_1",
        customer_details: { email: "max@example.com" },
        metadata: { ...METADATA },
        ...overrides,
      },
    },
  };
}

function send(event: unknown, sign = true): Promise<Response> {
  const payload = JSON.stringify(event);
  const headers: Record<string, string> = { "content-type": "application/json" };
  if (sign) {
    headers["stripe-signature"] = stripe.webhooks.generateTestHeaderString({
      payload,
      secret: SIGNING_SECRET,
    });
  }
  return POST(new Request("https://aea.test/api/stripe/webhook", {
    method: "POST", headers, body: payload,
  }));
}

describe("signature verification", () => {
  it("refuses an unsigned request", async () => {
    const res = await send(sessionEvent(), false);
    expect(res.status).toBe(400);
    expect((await res.json()).error).toBe("unsigned");
  });

  it("refuses a signature that does not match the body", async () => {
    const payload = JSON.stringify(sessionEvent());
    const signature = stripe.webhooks.generateTestHeaderString({
      payload: JSON.stringify({ tampered: true }),
      secret: SIGNING_SECRET,
    });
    const res = await POST(new Request("https://aea.test/api/stripe/webhook", {
      method: "POST",
      headers: { "stripe-signature": signature },
      body: payload,
    }));
    // 400, not 500: a bad signature will never become good, so Stripe must
    // stop retrying it rather than redeliver forever.
    expect(res.status).toBe(400);
    expect((await res.json()).error).toBe("bad_signature");
  });
});

describe("events this route does not act on", () => {
  it("acknowledges an event type it does not handle", async () => {
    // Acknowledged, not rejected. An error here would make Stripe retry an
    // event we never asked for, indefinitely.
    const res = await send(sessionEvent({}, "payment_intent.succeeded"));
    expect(res.status).toBe(200);
    expect(await res.json()).toMatchObject({ ignored: "payment_intent.succeeded" });
  });

  it("does not provision a completed session that is unpaid", async () => {
    // Stripe's delayed payment methods complete the session before the money
    // arrives. Provisioning here would give the product away.
    const res = await send(sessionEvent({ payment_status: "unpaid" }));
    expect(res.status).toBe(200);
    expect(await res.json()).toMatchObject({ ignored: "unpaid" });
  });

  it("records The Commission as an order like any other", async () => {
    // An earlier version deferred this tier without recording it, because
    // provisioning a self-serve invitation for it would have delivered the
    // wrong thing. There is no provisioning now: the row is a financial
    // record, the sku says which tier, and status says a human still owes
    // work. Not recording a payment is never the right answer.
    const res = await send(sessionEvent({ metadata: { ...METADATA, tier: "commission" } }));
    expect(res.status).toBe(500);
    expect((await res.json()).error).toBe("client_failed");
  });
});

describe("a paid session that cannot be fulfilled", () => {
  it("refuses a session with no email to deliver to", async () => {
    const res = await send(sessionEvent({ customer_details: {}, customer_email: null }));
    expect(res.status).toBe(400);
    expect((await res.json()).error).toBe("incomplete_metadata");
  });

  it("refuses a session missing a metadata field", async () => {
    const withoutTheme: Record<string, string> = { ...METADATA };
    delete withoutTheme.theme;
    const res = await send(sessionEvent({ metadata: withoutTheme }));
    expect(res.status).toBe(400);
  });

  it("refuses a locale the product does not carry", async () => {
    const res = await send(sessionEvent({ metadata: { ...METADATA, locale: "fr" } }));
    expect(res.status).toBe(400);
  });

  it("falls back to customer_email when customer_details has none", async () => {
    const res = await send(sessionEvent({
      customer_details: {}, customer_email: "lena@example.com",
    }));
    // Gets past metadata reading and stops at the database, which is unset
    // here. 500 rather than 400 is the point: it is retryable.
    expect(res.status).toBe(500);
    expect((await res.json()).error).toBe("client_failed");
  });
});

describe("a database failure is retryable", () => {
  it("returns 500 so Stripe redelivers, rather than swallowing the payment", async () => {
    const res = await send(sessionEvent());
    expect(res.status).toBe(500);
    expect((await res.json()).error).toBe("client_failed");
  });
});

describe("what the route reads from the session rather than from source", () => {
  it("refuses a paid session with no amount, rather than recording a guess", async () => {
    // The alternative is inventing the figure from Choice.tsx, which can drift
    // from what Stripe actually charged. A financial record may not be a guess.
    const e = sessionEvent();
    delete (e.data.object as Record<string, unknown>).amount_total;
    const res = await send(e);
    expect(res.status).toBe(400);
    expect((await res.json()).error).toBe("incomplete_metadata");
  });

  it("refuses a paid session with no currency", async () => {
    const e = sessionEvent();
    delete (e.data.object as Record<string, unknown>).currency;
    expect((await send(e)).status).toBe(400);
  });

  it("accepts a session carrying a billing country", async () => {
    // Reaches the database, which is unconfigured here, proving the country
    // did not trip metadata reading. clients.country checks ^[A-Z]{2}$, so the
    // route uppercases what Stripe returns.
    const res = await send(sessionEvent({
      customer_details: { email: "max@example.com", address: { country: "us" } },
    }));
    expect(res.status).toBe(500);
    expect((await res.json()).error).toBe("client_failed");
  });
});
