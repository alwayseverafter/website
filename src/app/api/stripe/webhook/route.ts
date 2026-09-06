import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { sendInvitationEmail } from "@/lib/delivery";
import { inviteUrl, provision, type ProvisionInput } from "@/lib/provision";
import { readWebhookConfig } from "@/lib/stripe";

/**
 * Stripe's notification that a payment succeeded, and the only place an
 * invitation is created.
 *
 * The webhook provisions and the page only reads. A page that provisioned
 * would provision twice for a customer who refreshes, and would provision not
 * at all for one who closes the tab, which is the more common of the two.
 *
 * Every failure returns a status that tells Stripe what to do next: 400 for a
 * request that will never be valid, so it stops retrying, and 500 for one that
 * might succeed later, so it does.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** The metadata `/api/checkout` writes. Read defensively: it crosses a network. */
function readMetadata(session: Stripe.Checkout.Session): ProvisionInput | null {
  const m = session.metadata ?? {};
  const email = session.customer_details?.email ?? session.customer_email ?? "";

  const required = [
    m.partnerAName, m.partnerBName, m.weddingDate, m.theme, m.tier, m.locale, email,
  ];
  if (required.some((v) => typeof v !== "string" || v.length === 0)) return null;
  if (m.tier !== "invitation" && m.tier !== "commission") return null;
  if (m.locale !== "en" && m.locale !== "de") return null;

  return {
    stripeSessionId: session.id,
    email,
    partnerAName: m.partnerAName!,
    partnerBName: m.partnerBName!,
    weddingDate: m.weddingDate!,
    theme: m.theme!,
    tier: m.tier,
    locale: m.locale,
  };
}

export async function POST(request: Request): Promise<NextResponse> {
  const configured = readWebhookConfig();
  if (!configured.ok) {
    /* Returning 500 keeps Stripe retrying, which is right: the payment is real
       and the fault is ours. R12, the missing variables are named in the log. */
    console.error("[webhook] not configured, missing:", configured.missing.join(", "));
    return NextResponse.json(
      { error: "not_configured", missing: configured.missing },
      { status: 500 },
    );
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) return NextResponse.json({ error: "unsigned" }, { status: 400 });

  /* The raw body, not the parsed one. Signature verification is over bytes. */
  const raw = await request.text();

  let event: Stripe.Event;
  try {
    event = configured.stripe.webhooks.constructEvent(
      raw, signature, configured.signingSecret,
    );
  } catch (e) {
    /* Never retryable, so 400 rather than 500. */
    console.error("[webhook] bad signature", e);
    return NextResponse.json({ error: "bad_signature" }, { status: 400 });
  }

  /* Every other event type is acknowledged and ignored. Returning an error for
     an event we did not ask for would make Stripe retry it forever. */
  if (event.type !== "checkout.session.completed") {
    return NextResponse.json({ received: true, ignored: event.type });
  }

  const session = event.data.object;

  /* A session can complete without the money arriving, for the delayed methods
     Stripe supports. Provisioning on that would give away the product. */
  if (session.payment_status === "unpaid") {
    return NextResponse.json({ received: true, ignored: "unpaid" });
  }

  const input = readMetadata(session);
  if (input === null) {
    /*
     * A paid session we cannot fulfil. Retrying will not add the missing
     * field, so this is 400 and a log loud enough to find, with the session id
     * so the payment can be located in one search. R3: it broke, say so.
     */
    console.error(
      "[webhook] paid session is missing metadata, needs a human:", session.id,
    );
    return NextResponse.json({ error: "incomplete_metadata" }, { status: 400 });
  }

  /*
   * The Commission is deliberately manual. A person reads the brief and builds
   * it, which is what the price buys and what caps it at twelve a month.
   * Provisioning a self serve invitation for it would deliver the wrong thing.
   */
  if (input.tier === "commission") {
    console.info("[webhook] commission purchased, awaiting a human:", session.id);
    return NextResponse.json({ received: true, deferred: "commission" });
  }

  const result = await provision(input);
  if (!result.ok) {
    if (result.reason === "not_configured") {
      console.error("[webhook] provisioning not configured:", result.missing.join(", "));
    } else {
      console.error("[webhook] provisioning failed for", session.id, result);
    }
    /* Retryable. The couple sees "being prepared" on /create meanwhile. */
    return NextResponse.json({ error: "provision_failed" }, { status: 500 });
  }

  /* The invitation is served by the product, not by this site. */
  const guestUrl = inviteUrl(result.invite.slug);
  const email = await sendInvitationEmail({
    to: input.email,
    locale: input.locale,
    partnerAName: input.partnerAName,
    partnerBName: input.partnerBName,
    inviteUrl: guestUrl ?? "",
    editorUrl: result.invite.editorUrl,
  });

  if (!email.ok) {
    /*
     * The invitation exists and the payment is fulfilled, so this is not a
     * failure of the webhook and must not be retried: a retry would re-send a
     * mail that may have gone out. `/create` shows both links and says the
     * email did not send, which is why they are rendered there at all.
     */
    console.error("[webhook] invitation created but email failed:", session.id, email.error);
  }

  return NextResponse.json({ received: true, inviteId: result.invite.inviteId });
}
