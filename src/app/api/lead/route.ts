import { NextResponse } from "next/server";
import { z } from "zod";
import { SELLABLE_THEME_IDS } from "@/invite/types";
import { clientIp, hashIp } from "@/lib/iphash";
import { productOrigin, readProvisionConfig } from "@/lib/provision";

/**
 * A couple who named themselves in The Mirror and asked for their preview by
 * email, without buying yet.
 *
 * This forwards to the product rather than writing anywhere itself, for the
 * same reason provisioning does: the funnel holds no database credentials.
 * Giving the marketing site a service role key for one table would be a much
 * larger thing to hold than a lead form is worth.
 *
 * The address is the only new personal data this site collects, and the
 * privacy page says so in the same commit that added this route.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const Body = z.object({
  email: z.email().max(320),
  partnerA: z.string().trim().max(40).default(""),
  partnerB: z.string().trim().max(40).default(""),
  weddingDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullish(),
  theme: z.enum(SELLABLE_THEME_IDS).nullish(),
  locale: z.enum(["en", "de"]),
  /**
   * Consent is required, and it is required to be true. A lead stored without
   * it is a lead we may not mail, which makes it worth nothing and a liability
   * besides.
   */
  consent: z.literal(true),
  /** Never filled by a person. A filled one is a bot. */
  trap: z.string().max(200).optional(),
});

export async function POST(request: Request): Promise<NextResponse> {
  const parsed = Body.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { error: { code: "invalid_request", message: "That address did not look right." } },
      { status: 400 },
    );
  }
  const { trap } = parsed.data;
  /* Consent is validated, not forwarded: the product stores the moment it was
     given, and a boolean that is always true carries no information. */
  const lead = {
    email: parsed.data.email,
    partnerA: parsed.data.partnerA,
    partnerB: parsed.data.partnerB,
    weddingDate: parsed.data.weddingDate ?? null,
    theme: parsed.data.theme ?? "",
    locale: parsed.data.locale,
  };

  /* Answer 200 so the bot learns nothing about why it failed. */
  if (trap) return NextResponse.json({ ok: true });

  const configured = readProvisionConfig();
  if (!configured.ok) {
    /*
     * R12. No silent drop: a visitor who typed their address and pressed a
     * button is told the button is not connected, rather than being thanked
     * for something that did not happen.
     */
    return NextResponse.json(
      {
        error: {
          code: "not_configured",
          message: "This is not connected yet, so nothing was saved. Nothing was sent anywhere.",
          missing: configured.missing,
        },
      },
      { status: 503 },
    );
  }

  /*
   * Built from the product's origin, not by editing the provisioning path. A
   * string replace would silently no-op on an unexpected URL shape and post a
   * lead at the provisioning endpoint, which would fail as "store_failed" and
   * send whoever is debugging it to the wrong file.
   */
  const origin = productOrigin();
  if (origin === null) {
    return NextResponse.json(
      { error: { code: "not_configured", message: "This is not connected yet, so nothing was saved." } },
      { status: 503 },
    );
  }
  const url = new URL("/api/lead", origin);

  let res: Response;
  try {
    res = await fetch(url, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${configured.config.secret}`,
      },
      body: JSON.stringify({
        ...lead,
        consentAt: new Date().toISOString(),
        ipHash: hashIp(clientIp(request)),
      }),
      cache: "no-store",
    });
  } catch {
    return NextResponse.json(
      { error: { code: "unreachable", message: "That did not save. Try again in a moment." } },
      { status: 502 },
    );
  }

  if (res.status === 429) {
    return NextResponse.json(
      { error: { code: "rate_limited", message: "That is a lot of tries. Wait a minute and try again." } },
      { status: 429 },
    );
  }
  if (!res.ok) {
    console.error("[lead] product rejected the lead", res.status);
    return NextResponse.json(
      { error: { code: "store_failed", message: "That did not save. Try again in a moment." } },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
