import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { linkLeadToClient, recordDelivery, upsertClient } from "@/lib/db";
import { sendInvitationEmail } from "@/lib/delivery";
import { readWebhookConfig } from "@/lib/stripe";

/**
 * Stripe's notification that a payment succeeded, and the only place a client
 * and a delivery are recorded.
 *
 * The webhook records, the page reads. A page that recorded would record twice
 * for a customer who refreshes and not at all for one who closes the tab,
 * which is the more common of the two.
 *
 * Statuses are chosen for what they tell Stripe to do next: 400 for a request
 * that will never be valid, so it stops retrying, and 500 for one that might
 * succeed later, so it does.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Order = {
  email: string;
  partnerAName: string;
  partnerBName: string;
  weddingDate: string;
  theme: string;
  sku: "invitation" | "commission";
  locale: "en" | "de";
  country: string | null;
  amountMinor: number;
  currency: string;
  paymentIntent: string | null;
};

/**
 * The metadata `/api/checkout` wrote, plus what only Stripe knows.
 *
 * The amount and currency come from the session rather than from a constant in
 * this codebase: a price written in source can drift from what was actually
 * charged, and the charge is the thing that has to be recorded.
 */
function readOrder(session: Stripe.Checkout.Session): Order | null {
  const m = session.metadata ?? {};
  const email = session.customer_details?.email ?? session.customer_email ?? "";

  if ([m.partnerAName, m.partnerBName, m.weddingDate, m.theme, m.tier, m.locale, email]
    .some((v) => typeof v !== "string" || v.length === 0)) return null;
  if (m.tier !== "invitation" && m.tier !== "commission") return null;
  if (m.locale !== "en" && m.locale !== "de") return null;
  if (typeof session.amount_total !== "number" || typeof session.currency !== "string") return null;

  const country = session.customer_details?.address?.country ?? null;

  return {
    email,
    partnerAName: m.partnerAName!,
    partnerBName: m.partnerBName!,
    weddingDate: m.weddingDate!,
    theme: m.theme!,
    sku: m.tier,
    locale: m.locale,
    /* ISO 3166-1 alpha-2, which is what Stripe returns and what the column checks. */
    country: country ? country.toUpperCase() : null,
    amountMinor: session.amount_total,
    currency: session.currency.toUpperCase(),
    paymentIntent: typeof session.payment_intent === "string" ? session.payment_intent : null,
  };
}

export async function POST(request: Request): Promise<NextResponse> {
  const signature = request.headers.get("stripe-signature");
  if (!signature) return NextResponse.json({ error: "unsigned" }, { status: 400 });

  /*
   * Signature before configuration, deliberately. Checking config first told
   * any unauthenticated caller which environment variables were missing.
   */
  const configured = readWebhookConfig();
  if (!configured.ok) {
    console.error("[webhook] not configured, missing:", configured.missing.join(", "));
    return NextResponse.json({ error: "not_configured" }, { status: 500 });
  }

  /* The raw bytes, not the parsed body. Verification is over the payload. */
  const raw = await request.text();

  let event: Stripe.Event;
  try {
    event = configured.stripe.webhooks.constructEvent(raw, signature, configured.signingSecret);
  } catch (e) {
    /* Never retryable, so 400 rather than 500. */
    console.error("[webhook] bad signature", e);
    return NextResponse.json({ error: "bad_signature" }, { status: 400 });
  }

  /* Acknowledged and ignored. An error for an event we never asked for would
     make Stripe retry it forever. */
  if (event.type !== "checkout.session.completed") {
    return NextResponse.json({ received: true, ignored: event.type });
  }

  const session = event.data.object;

  /* Stripe's delayed payment methods complete a session before the money
     arrives. Recording a delivery on that would give the product away. */
  if (session.payment_status === "unpaid") {
    return NextResponse.json({ received: true, ignored: "unpaid" });
  }

  const order = readOrder(session);
  if (order === null) {
    /* A paid session we cannot fulfil. Retrying will not add the missing
       field, so 400, and a log loud enough to find with the session id. R3. */
    console.error("[webhook] paid session is missing metadata, needs a human:", session.id);
    return NextResponse.json({ error: "incomplete_metadata" }, { status: 400 });
  }

  const client = await upsertClient({
    email: order.email,
    partnerAName: order.partnerAName,
    partnerBName: order.partnerBName,
    country: order.country,
    locale: order.locale,
  });
  if (!client.ok) {
    console.error("[webhook] client not recorded for", session.id, client);
    return NextResponse.json({ error: "client_failed" }, { status: 500 });
  }

  const delivery = await recordDelivery({
    clientId: client.data.id,
    productSku: order.sku,
    stripeSessionId: session.id,
    stripePaymentIntent: order.paymentIntent,
    amountMinor: order.amountMinor,
    currency: order.currency,
    weddingDate: order.weddingDate,
    theme: order.theme,
    locale: order.locale,
  });
  if (!delivery.ok) {
    console.error("[webhook] delivery not recorded for", session.id, delivery);
    /* Retryable. The couple sees "being prepared" on /create meanwhile. */
    return NextResponse.json({ error: "delivery_failed" }, { status: 500 });
  }

  /*
   * Only the delivery that created the row sends the email.
   *
   * Stripe delivers at least once, retries every 5xx this route returns, and
   * replays events from the dashboard by hand. Recording absorbs all of that
   * because it is idempotent on the session id; sending does not.
   */
  if (!delivery.data.created) {
    return NextResponse.json({ received: true, deliveryId: delivery.data.delivery.id, emailed: false });
  }

  /* A lead who has now bought. Best effort: the purchase is already recorded
     and must not fail because the outreach list did. */
  await linkLeadToClient(order.email, client.data.id);

  const email = await sendInvitationEmail({
    to: order.email,
    locale: order.locale,
    partnerAName: order.partnerAName,
    partnerBName: order.partnerBName,
    clientRef: client.data.ref,
  });
  if (!email.ok) {
    /* The delivery exists and the payment is fulfilled, so this is not a
       failure of the webhook and must not be retried: a retry would re-send a
       mail that may have gone out. /create shows the details regardless. */
    console.error("[webhook] delivery recorded but email failed:", session.id, email.error);
  }

  return NextResponse.json({ received: true, deliveryId: delivery.data.delivery.id });
}
