import type { Tier } from "./analytics";

/**
 * The funnel's one link to the product.
 *
 * The funnel holds no Supabase credentials and no knowledge of the product's
 * schema. It holds a URL and a secret. Everything that makes an invitation
 * valid, seeding, slug collision, organisation lookup, child rows, lives in the
 * product's `src/lib/db`, so provisioning asks it rather than reimplementing
 * four invariants in a second repository.
 *
 * Nothing here throws on a missing variable. A route that throws while being
 * imported fails as an opaque 500 with no usable message, which is the silent
 * degradation R3 forbids. Config is read on demand and returned as data.
 */

export type ProvisionInput = {
  stripeSessionId: string;
  email: string;
  partnerAName: string;
  partnerBName: string;
  weddingDate: string;
  theme: string;
  tier: Tier;
  locale: "en" | "de";
};

export type Provisioned = {
  inviteId: string;
  slug: string;
  /** May be "" when the product could not mint a magic link. Never faked. */
  editorUrl: string;
  /**
   * True only on the delivery that actually created the invitation.
   *
   * Provisioning is idempotent; sending an email is not. Stripe delivers at
   * least once, retries every 5xx, and replays events from the dashboard by
   * hand, so without this a couple receives the same email twice.
   */
  created?: boolean;
  partnerAName?: string;
  partnerBName?: string;
  weddingDate?: string | null;
};

export type ProvisionResult =
  | { ok: true; invite: Provisioned }
  /** The payment is real and no invitation exists for it yet. */
  | { ok: false; reason: "not_provisioned" }
  /**
   * The product is reachable but not answering right now: a 5xx, or the
   * request never landed. Distinct from "failed" because the webhook is very
   * likely still in flight and about to succeed, so a buyer must be shown
   * "being prepared" rather than told their purchase broke.
   */
  | { ok: false; reason: "unavailable"; detail: string }
  | { ok: false; reason: "not_configured"; missing: string[] }
  | { ok: false; reason: "failed"; detail: string };

export const PROVISION_ENV = ["DAVET_PROVISION_URL", "DAVET_PROVISION_SECRET"] as const;

type Config = { url: string; secret: string };

export function readProvisionConfig(): { ok: true; config: Config } | { ok: false; missing: string[] } {
  const url = (process.env.DAVET_PROVISION_URL ?? "").trim();
  const secret = (process.env.DAVET_PROVISION_SECRET ?? "").trim();
  const missing: string[] = [];
  if (!url) missing.push("DAVET_PROVISION_URL");
  if (!secret) missing.push("DAVET_PROVISION_SECRET");
  if (missing.length > 0) return { ok: false, missing };
  return { ok: true, config: { url, secret } };
}

function isProvisioned(v: unknown): v is Provisioned {
  if (typeof v !== "object" || v === null) return false;
  const o = v as Record<string, unknown>;
  return typeof o.inviteId === "string" && o.inviteId.length > 0
    && typeof o.slug === "string" && o.slug.length > 0;
}

/** Creates the couple's invitation. Idempotent on `stripeSessionId`. */
export async function provision(input: ProvisionInput): Promise<ProvisionResult> {
  const configured = readProvisionConfig();
  if (!configured.ok) return { ok: false, reason: "not_configured", missing: configured.missing };

  let res: Response;
  try {
    res = await fetch(configured.config.url, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${configured.config.secret}`,
      },
      body: JSON.stringify(input),
      cache: "no-store",
    });
  } catch (e) {
    return { ok: false, reason: "unavailable", detail: e instanceof Error ? e.message : "network" };
  }

  const body: unknown = await res.json().catch(() => null);
  if (!res.ok) {
    const detail = typeof (body as { error?: unknown })?.error === "string"
      ? String((body as { error: string }).error)
      : `http_${res.status}`;
    /* A 5xx is the product having a moment. A 4xx is this request being wrong,
       and no amount of retrying will change it. */
    return res.status >= 500
      ? { ok: false, reason: "unavailable", detail }
      : { ok: false, reason: "failed", detail };
  }
  if (!isProvisioned(body)) {
    return { ok: false, reason: "failed", detail: "malformed_response" };
  }
  return { ok: true, invite: body };
}

/**
 * Reads what a payment already provisioned. `/create` needs this because the
 * webhook can land after the redirect does, and a 404 from the product is the
 * "being prepared" state rather than an error.
 */
export async function readProvisioned(stripeSessionId: string): Promise<ProvisionResult> {
  const configured = readProvisionConfig();
  if (!configured.ok) return { ok: false, reason: "not_configured", missing: configured.missing };

  const url = new URL(configured.config.url);
  url.searchParams.set("stripeSessionId", stripeSessionId);

  let res: Response;
  try {
    res = await fetch(url, {
      headers: { authorization: `Bearer ${configured.config.secret}` },
      cache: "no-store",
    });
  } catch (e) {
    return { ok: false, reason: "unavailable", detail: e instanceof Error ? e.message : "network" };
  }

  /* Not created yet. The webhook may still be in flight; this is not an error. */
  if (res.status === 404) return { ok: false, reason: "not_provisioned" };

  const body: unknown = await res.json().catch(() => null);

  if (!res.ok) {
    return res.status >= 500
      ? { ok: false, reason: "unavailable", detail: `http_${res.status}` }
      : { ok: false, reason: "failed", detail: `http_${res.status}` };
  }
  if (!isProvisioned(body)) {
    /* A 200 carrying something else. Reporting this as "http_200" put the
       string "The product could not be reached (http_200)" in front of a
       paying customer, which is both wrong and unreadable. */
    return { ok: false, reason: "failed", detail: "malformed_response" };
  }
  return { ok: true, invite: body };
}

/**
 * Where a published invitation is served from.
 *
 * Derived from the provisioning URL rather than configured separately, because
 * they are the same deployment: `https://product.example/api/provision` and
 * `https://product.example/max-lena`. A second variable could drift from the
 * first, and a wrong origin here is a dead link in a couple's email.
 *
 * Returns null when provisioning is unconfigured, so a caller shows nothing
 * rather than a link to "null/max-lena". R3.
 */
export function productOrigin(): string | null {
  const configured = readProvisionConfig();
  if (!configured.ok) return null;
  try {
    return new URL(configured.config.url).origin;
  } catch {
    return null;
  }
}

/** The public address of a published invitation, or null if unknowable. */
export function inviteUrl(slug: string): string | null {
  const origin = productOrigin();
  return origin === null ? null : `${origin}/${slug}`;
}
