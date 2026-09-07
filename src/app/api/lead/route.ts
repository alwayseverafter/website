import { NextResponse } from "next/server";
import { z } from "zod";
import { recordLead } from "@/lib/db";
import { clientIp, hashIp } from "@/lib/iphash";

/**
 * A couple who asked to be written to without buying.
 *
 * Two sections reach this. The Mirror asks once the invitation carries their
 * names, for the preview by email. The Close asks while Stripe is unconfigured,
 * where there is a tier chosen and no way to pay for it, and sends that tier
 * along; see `src/components/funnel/Close.tsx`.
 *
 * Writes straight to the database. An earlier version forwarded this to the
 * product so that this site would not hold a database key, but the product is
 * not deployed and this site now owns its own data, so the hop bought nothing
 * and cost a second deployment to keep alive.
 *
 * The address is the only new personal data this site collects, and the
 * privacy page says so.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const Body = z.object({
  email: z.email().max(320),
  partnerA: z.string().trim().max(40).default(""),
  partnerB: z.string().trim().max(40).default(""),
  weddingDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullish(),
  /*
   * Any theme the renderer knows, not just a sellable one. A visitor's stored
   * theme can predate the sellable list narrowing, and a lead's chosen style
   * is a preference rather than a purchase. Refusing it here produced a 400
   * about the address, which pointed at the wrong field entirely.
   */
  theme: z.string().trim().max(60).nullish(),
  locale: z.enum(["en", "de"]),
  /*
   * Which tier they asked about. Sent by The Close, where a visitor has
   * already chosen between the two, and absent from The Mirror, which asks for
   * a preview rather than for a tier. The two strings are the ones
   * `/api/checkout` accepts, so the tier a lead wanted and the tier a client
   * bought are one vocabulary rather than two that drift.
   */
  tier: z.enum(["invitation", "commission"]).nullish(),
  /* Required, and required to be true. A lead stored without consent is a
     lead we may not mail, which makes it worthless and a liability besides. */
  consent: z.literal(true),
  /** Never filled by a person. A filled one is a bot. */
  trap: z.string().max(200).optional(),
});

function fail(status: number, code: string, message: string, extra?: object) {
  return NextResponse.json({ error: { code, message, ...extra } }, { status });
}

export async function POST(request: Request): Promise<NextResponse> {
  const parsed = Body.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    const fields = parsed.error.issues.map((i) => i.path.join(".") || "body");
    /* Name the field. An earlier version said "that address did not look
       right" for a rejected theme, which sent people to fix a correct email. */
    return fail(400, "invalid_request",
      fields.includes("email")
        ? "That address did not look right."
        : "Something in that form did not look right.",
      { fields });
  }

  const { trap, email, partnerA, partnerB, weddingDate, theme, locale, tier } = parsed.data;

  /* Answer 200 so the bot learns nothing about why it failed. */
  if (trap) return NextResponse.json({ ok: true });

  const stored = await recordLead({
    email,
    partnerAName: partnerA,
    partnerBName: partnerB,
    weddingDate: weddingDate ?? null,
    theme: theme ?? "",
    locale,
    ipHash: hashIp(clientIp(request)),
    tier: tier ?? null,
  });

  if (!stored.ok) {
    if (stored.reason === "not_configured") {
      /* R12. Never a silent drop: someone who typed their address and pressed
         a button is told the button is not connected. */
      return fail(503, "not_configured",
        "This is not connected yet, so nothing was saved.",
        { missing: stored.missing });
    }
    console.error("[lead] not stored", stored.detail);
    return fail(502, "store_failed", "That did not save. Try again in a moment.");
  }

  return NextResponse.json({ ok: true });
}
