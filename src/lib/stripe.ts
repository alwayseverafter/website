import Stripe from "stripe";
import type { Tier } from "./analytics";

/**
 * Server side Stripe access, and the only place a price is decided.
 *
 * Two rules govern this file.
 *
 * A client never sends an amount. It sends a tier, which is one of two known
 * strings, and the Price ID is looked up here from the environment. A visitor
 * who edits the request body can change which of two products they are buying,
 * which is not an attack, and can change nothing else.
 *
 * Nothing throws at module load. A route file that throws while being imported
 * fails as an opaque 500 with no usable message, which is the silent
 * degradation LESSONS.md R3 forbids. Instead the config is read on demand and
 * missing variables are returned as data, so the route can name them, in words,
 * to whoever is looking at the page. R12: a placeholder announces itself.
 *
 * Server only. Importing this from a client component would pull the secret key
 * read into a browser bundle, so nothing under `src/components/**` may touch it.
 */

export type StripeConfig = {
  stripe: Stripe;
  /** Resolved server side. Never accepted from a request. */
  priceId: Record<Tier, string>;
  /** Absolute origin that Stripe returns the buyer to. */
  siteUrl: string;
};

export type StripeConfigResult =
  | { ok: true; config: StripeConfig }
  | { ok: false; missing: string[] };

/**
 * Which environment variable carries which tier's price. Exported because the
 * error path names the missing variable, and a name typed twice drifts once.
 */
export const PRICE_ENV_NAME: Record<Tier, string> = {
  invitation: "NEXT_PUBLIC_STRIPE_PRICE_INVITATION",
  commission: "NEXT_PUBLIC_STRIPE_PRICE_COMMISSION",
};

/**
 * Built once and reused. The SDK pins its own API version and its types accept
 * only that exact literal, so passing one here would buy nothing and would fail
 * typecheck on every SDK bump. The pin lives in the lockfile.
 */
let client: Stripe | null = null;

function trimmed(value: string | undefined): string {
  return typeof value === "string" ? value.trim() : "";
}

/**
 * Read literally, not through a computed key. Next inlines `NEXT_PUBLIC_*` by
 * matching the source text, so `process.env[name]` would keep working here on
 * the server while silently resolving to undefined anywhere it is bundled.
 */
function readEnv(): {
  secretKey: string;
  invitation: string;
  commission: string;
  siteUrl: string;
} {
  return {
    secretKey: trimmed(process.env.STRIPE_SECRET_KEY),
    invitation: trimmed(process.env.NEXT_PUBLIC_STRIPE_PRICE_INVITATION),
    commission: trimmed(process.env.NEXT_PUBLIC_STRIPE_PRICE_COMMISSION),
    siteUrl: trimmed(process.env.NEXT_PUBLIC_SITE_URL),
  };
}

export function readStripeConfig(): StripeConfigResult {
  const env = readEnv();
  const missing: string[] = [];

  if (!env.secretKey) missing.push("STRIPE_SECRET_KEY");
  if (!env.invitation) missing.push(PRICE_ENV_NAME.invitation);
  if (!env.commission) missing.push(PRICE_ENV_NAME.commission);

  /*
   * The return URL is baked into the Checkout Session, so a wrong origin sends
   * a paying customer somewhere that does not exist. In development localhost
   * is the only sane value and defaulting to it costs nothing. In production,
   * guessing is how a preview URL ends up in a receipt, so it is required.
   */
  const isDev = process.env.NODE_ENV === "development";
  const siteUrl = env.siteUrl || (isDev ? "http://localhost:3000" : "");
  if (!siteUrl) missing.push("NEXT_PUBLIC_SITE_URL");

  if (missing.length > 0) return { ok: false, missing };

  client ??= new Stripe(env.secretKey);

  return {
    ok: true,
    config: {
      stripe: client,
      priceId: { invitation: env.invitation, commission: env.commission },
      /* Trailing slashes would double up against the paths appended below. */
      siteUrl: siteUrl.replace(/\/+$/, ""),
    },
  };
}
