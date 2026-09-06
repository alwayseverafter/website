import { NextResponse } from "next/server";
import { z } from "zod";
import { SELLABLE_THEME_IDS } from "@/invite/types";
import { PRICE_ENV_NAME, readStripeConfig } from "@/lib/stripe";

/**
 * Creates a hosted Stripe Checkout Session and hands back its URL.
 *
 * Hosted, redirect flow: no card field ever renders on our origin, so no card
 * data touches this codebase and PCI scope stays at SAQ A. That is the whole
 * reason this route returns a URL rather than a client secret.
 *
 * The couple travels in session metadata because that metadata is what
 * provisions the invitation afterwards. The webhook reads it, creates the
 * invitation already seeded with these names, this date and this theme, and
 * emails the couple their link. Losing a field here means a human has to ask
 * for it again, which is the difference between "live in an hour" and a support
 * thread.
 */

/** Runs on Node, not the Edge: the Stripe SDK expects Node primitives. */
export const runtime = "nodejs";

/** A Checkout Session is a side effect. Nothing about it is cacheable. */
export const dynamic = "force-dynamic";

/**
 * Names are capped at 40 characters to match the funnel's own store
 * (`src/lib/couple.ts`), so a value that survived The Mirror also survives here
 * rather than being rejected at the last step before payment.
 */
const NAME_MAX = 40;

/** Stripe rejects metadata values over 500 characters. Nothing here approaches it. */
const CheckoutRequest = z.object({
  tier: z.enum(["invitation", "commission"]),
  couple: z.object({
    a: z.string().trim().min(1).max(NAME_MAX),
    b: z.string().trim().min(1).max(NAME_MAX),
    /*
     * ISO 8601 calendar date. The shape check is not enough on its own:
     * "2026-02-31" matches the pattern and is not a day, and a date that is not
     * a day breaks every reminder that counts back from it.
     */
    date: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/)
      .refine(isRealCalendarDate, { message: "not a calendar date" }),
    /*
     * Sellable themes only, not every theme the renderer knows. The preview
     * can show all eight; only the ones the product can build may be bought.
     * Checked here as well as in the UI because a request body is editable and
     * this is the last gate before money changes hands.
     */
    theme: z.enum(SELLABLE_THEME_IDS),
  }),
  locale: z.enum(["en", "de"]),
});

function isRealCalendarDate(value: string): boolean {
  /* Noon UTC, so no timezone can push the day across a boundary. */
  const parsed = new Date(`${value}T12:00:00Z`);
  if (Number.isNaN(parsed.getTime())) return false;
  /* Round trips only if the month and day were in range to begin with. */
  return parsed.toISOString().slice(0, 10) === value;
}

type ErrorCode =
  | "invalid_json"
  | "invalid_request"
  | "stripe_not_configured"
  | "stripe_error";

function fail(
  status: number,
  code: ErrorCode,
  message: string,
  detail?: Record<string, unknown>,
): NextResponse {
  /*
   * The message is written to be shown to a person standing in front of a
   * button that did not work, not to be decoded from a log. R3: if it broke,
   * say so, where it broke.
   */
  return NextResponse.json({ error: { code, message, ...detail } }, { status });
}

export async function POST(request: Request): Promise<NextResponse> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return fail(400, "invalid_json", "The request body was not valid JSON.");
  }

  const parsed = CheckoutRequest.safeParse(body);
  if (!parsed.success) {
    const fields = parsed.error.issues.map((issue) => issue.path.join(".") || "body");
    return fail(
      400,
      "invalid_request",
      "Something about this order did not look right. Go back and check the names, the date and the style.",
      { fields },
    );
  }

  const { tier, couple, locale } = parsed.data;

  const configured = readStripeConfig();
  if (!configured.ok) {
    /*
     * No fake session, no dead button, no pretending. Without keys there is no
     * checkout, and the page says which variables are missing so that whoever
     * is running it can fix it in one move. LESSONS.md R3 and R12.
     */
    return fail(
      503,
      "stripe_not_configured",
      `Checkout is not connected yet. Missing: ${configured.missing.join(", ")}.`,
      { missing: configured.missing },
    );
  }

  const { stripe, priceId, siteUrl } = configured.config;
  const price = priceId[tier];

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      /* The amount is this Price ID's amount. The client sent a tier, not a number. */
      line_items: [{ price, quantity: 1 }],
      /* Stripe's own UI, in the language the visitor was already reading. */
      locale,
      /*
       * VAT on sales into Germany is a Stripe Tax setting on the account, not
       * something to half configure here. Turning it on in code while the
       * account is not registered would produce confidently wrong receipts.
       */
      success_url: `${siteUrl}/create?session={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/#choice`,
      /* Everything the handoff needs to build the invitation without asking again. */
      metadata: {
        partnerAName: couple.a,
        partnerBName: couple.b,
        weddingDate: couple.date,
        theme: couple.theme,
        tier,
        locale,
      },
    });

    if (session.url === null) {
      /* Only happens in modes we do not use, and a null URL is not a redirect. */
      return fail(502, "stripe_error", "Stripe did not return a checkout link. Try again.");
    }

    return NextResponse.json({ url: session.url });
  } catch (error) {
    /*
     * The likeliest cause by far is a Price ID from the wrong account or mode,
     * so name the variable rather than echoing Stripe's phrasing at a couple.
     */
    console.error("[checkout] Stripe rejected the session", error);
    return fail(
      502,
      "stripe_error",
      `Stripe could not open checkout. Check that ${PRICE_ENV_NAME[tier]} is a live Price ID on the same account as STRIPE_SECRET_KEY.`,
    );
  }
}
