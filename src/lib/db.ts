import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Tier } from "./analytics";

/**
 * The only file that talks to the database.
 *
 * Server only. It reads the service role key, so importing this from anything
 * under `src/components/**` would put that key in a browser bundle.
 *
 * Nothing throws at module load. A route that throws while being imported
 * fails as an opaque 500 with no usable message, which is the silent
 * degradation LESSONS.md R3 forbids, so configuration is read on demand and
 * missing variables come back as data for the caller to name. R12.
 */

export const DB_ENV = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "SUPABASE_SERVICE_ROLE_KEY",
] as const;

export type DbResult<T> =
  | { ok: true; data: T }
  | { ok: false; reason: "not_configured"; missing: string[] }
  | { ok: false; reason: "failed"; detail: string };

function trimmed(v: string | undefined): string {
  return typeof v === "string" ? v.trim() : "";
}

let client: SupabaseClient | null = null;

/** Read literally, never through a computed key: Next inlines NEXT_PUBLIC_* by source text. */
export function readDbConfig(): { ok: true; db: SupabaseClient } | { ok: false; missing: string[] } {
  const url = trimmed(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const key = trimmed(process.env.SUPABASE_SERVICE_ROLE_KEY);

  const missing: string[] = [];
  if (!url) missing.push("NEXT_PUBLIC_SUPABASE_URL");
  if (!key) missing.push("SUPABASE_SERVICE_ROLE_KEY");
  if (missing.length > 0) return { ok: false, missing };

  client ??= createClient(url, key, { auth: { persistSession: false } });
  return { ok: true, db: client };
}

/** Postgres unique_violation, as PostgREST reports it. Often a guarantee firing, not a fault. */
function isUniqueViolation(e: unknown): boolean {
  return typeof e === "object" && e !== null
    && (e as { code?: unknown }).code === "23505";
}

export type Locale = "en" | "de";

export type Client = {
  id: string;
  ref: string;
  email: string;
  partnerAName: string;
  partnerBName: string;
  country: string | null;
  locale: Locale;
};

export type Delivery = {
  id: string;
  clientId: string;
  productSku: string;
  productName: string;
  status: "pending" | "provisioned" | "delivered" | "refunded" | "cancelled";
  amountMinor: number;
  currency: string;
  weddingDate: string | null;
  theme: string;
  locale: Locale;
  stripeSessionId: string | null;
};

/* eslint-disable @typescript-eslint/no-explicit-any */
function toClient(r: any): Client {
  return {
    id: r.id,
    ref: r.ref,
    email: r.email,
    partnerAName: r.partner_a_name ?? "",
    partnerBName: r.partner_b_name ?? "",
    country: r.country ?? null,
    locale: r.locale ?? "en",
  };
}

function toDelivery(r: any): Delivery {
  return {
    id: r.id,
    clientId: r.client_id,
    productSku: r.products?.sku ?? r.product_sku ?? "",
    productName: r.products?.name ?? r.product_name ?? "",
    status: r.status,
    amountMinor: r.amount_minor,
    currency: r.currency,
    weddingDate: r.wedding_date ?? null,
    theme: r.theme ?? "",
    locale: r.locale ?? "en",
    stripeSessionId: r.stripe_session_id ?? null,
  };
}
/* eslint-enable @typescript-eslint/no-explicit-any */

/**
 * The client behind an email address, created if new.
 *
 * Email is the natural key and it is unique, so a second purchase attaches to
 * the same client rather than creating a twin. Names are not unique and are
 * not used to match: two couples called Max and Lena are two clients, which is
 * the whole reason identity is a uuid here.
 *
 * Names and country are refreshed on each purchase, so the row holds what the
 * client last told us rather than what they first told us.
 */
export async function upsertClient(input: {
  email: string;
  partnerAName: string;
  partnerBName: string;
  country?: string | null;
  locale: Locale;
}): Promise<DbResult<Client>> {
  const configured = readDbConfig();
  if (!configured.ok) return { ok: false, reason: "not_configured", missing: configured.missing };

  const row = {
    email: input.email,
    partner_a_name: input.partnerAName,
    partner_b_name: input.partnerBName,
    country: input.country ?? null,
    locale: input.locale,
  };

  const { data, error } = await configured.db
    .from("clients")
    .upsert(row, { onConflict: "email" })
    .select("id,ref,email,partner_a_name,partner_b_name,country,locale")
    .single();

  if (error) return { ok: false, reason: "failed", detail: error.message };
  return { ok: true, data: toClient(data) };
}

/**
 * Records one product delivered to one client. Idempotent on the Stripe
 * session, because Stripe delivers at least once and replays by hand.
 *
 * The amount comes from the payment, not from a constant in this codebase. A
 * price in the source can drift from what was actually charged; the session
 * cannot.
 */
export async function recordDelivery(input: {
  clientId: string;
  productSku: string;
  stripeSessionId: string;
  stripePaymentIntent?: string | null;
  amountMinor: number;
  currency: string;
  weddingDate: string | null;
  theme: string;
  locale: Locale;
}): Promise<DbResult<{ delivery: Delivery; created: boolean }>> {
  const configured = readDbConfig();
  if (!configured.ok) return { ok: false, reason: "not_configured", missing: configured.missing };
  const db = configured.db;

  /* Already recorded. A redelivery must not produce a second row, and must
     not send a second email, so `created` is reported rather than inferred. */
  const existing = await findDeliveryBySession(input.stripeSessionId);
  if (existing.ok && existing.data) {
    return { ok: true, data: { delivery: existing.data.delivery, created: false } };
  }

  const { data: product, error: productError } = await db
    .from("products").select("id").eq("sku", input.productSku).single();
  if (productError || !product) {
    /* A sku with no row is a deployment mismatch, not a customer problem. */
    return { ok: false, reason: "failed", detail: `unknown_product:${input.productSku}` };
  }

  const { data, error } = await db
    .from("deliveries")
    .insert({
      client_id: input.clientId,
      product_id: product.id,
      stripe_session_id: input.stripeSessionId,
      stripe_payment_intent: input.stripePaymentIntent ?? null,
      amount_minor: input.amountMinor,
      currency: input.currency.toUpperCase(),
      /*
       * pending, not provisioned. Nothing in this system renders an
       * invitation, so every purchase awaits a human regardless of tier.
       * Writing "provisioned" here would record work that has not happened,
       * and a status that lies is worse than no status column.
       */
      status: "pending",
      wedding_date: input.weddingDate,
      theme: input.theme,
      locale: input.locale,
    })
    .select("*, products(sku,name)")
    .single();

  if (error) {
    /* The unique index on stripe_session_id refused it, so a concurrent
       delivery won the race. That refusal IS the idempotency guarantee. */
    if (isUniqueViolation(error)) {
      const settled = await findDeliveryBySession(input.stripeSessionId);
      if (settled.ok && settled.data) {
        return { ok: true, data: { delivery: settled.data.delivery, created: false } };
      }
    }
    return { ok: false, reason: "failed", detail: error.message };
  }

  return { ok: true, data: { delivery: toDelivery(data), created: true } };
}

/** What a payment bought, and who bought it. Null when nothing is recorded yet. */
export async function findDeliveryBySession(
  stripeSessionId: string,
): Promise<DbResult<{ delivery: Delivery; client: Client } | null>> {
  const configured = readDbConfig();
  if (!configured.ok) return { ok: false, reason: "not_configured", missing: configured.missing };

  const { data, error } = await configured.db
    .from("deliveries")
    .select("*, products(sku,name), clients(id,ref,email,partner_a_name,partner_b_name,country,locale)")
    .eq("stripe_session_id", stripeSessionId)
    .maybeSingle();

  if (error) return { ok: false, reason: "failed", detail: error.message };
  if (!data) return { ok: true, data: null };

  return {
    ok: true,
    data: { delivery: toDelivery(data), client: toClient(data.clients) },
  };
}

/**
 * Stores a lead, or updates the one already held for that address.
 *
 * One row per address: a couple who submits twice corrects their entry rather
 * than being counted, and mailed, as two people.
 */
export async function recordLead(input: {
  email: string;
  partnerAName: string;
  partnerBName: string;
  weddingDate: string | null;
  theme: string;
  locale: Locale;
  ipHash: string | null;
  /**
   * Which tier they asked about, when they asked from The Close while checkout
   * was shut. Absent from The Mirror, which asks for a preview rather than for
   * a tier, and absent is not 'invitation': see the column's migration.
   */
  tier?: Tier | null;
}): Promise<DbResult<{ id: string }>> {
  const configured = readDbConfig();
  if (!configured.ok) return { ok: false, reason: "not_configured", missing: configured.missing };

  const { data, error } = await configured.db
    .from("leads")
    .upsert(
      {
        email: input.email,
        partner_a_name: input.partnerAName,
        partner_b_name: input.partnerBName,
        wedding_date: input.weddingDate,
        theme: input.theme,
        locale: input.locale,
        /* The moment, not a boolean. Refreshed when they ask again. */
        consent_at: new Date().toISOString(),
        ip_hash: input.ipHash,
        /*
         * Written only when there is one. An upsert writes every column it is
         * handed, so passing null here would erase the tier this address
         * already told us on its way through The Close, the one time the
         * second submission knows less than the first.
         */
        ...(input.tier ? { tier: input.tier } : {}),
      },
      { onConflict: "email" },
    )
    .select("id")
    .single();

  if (error) return { ok: false, reason: "failed", detail: error.message };
  return { ok: true, data: { id: data.id } };
}

/**
 * Marks the lead at this address as converted, if one exists.
 *
 * Best effort by design: a purchase must not fail because the lead table did.
 * The schema keeps `client_id` and `converted_at` consistent with a CHECK, so
 * both are written together or neither is.
 */
export async function linkLeadToClient(email: string, clientId: string): Promise<void> {
  const configured = readDbConfig();
  if (!configured.ok) return;

  const { error } = await configured.db
    .from("leads")
    .update({ client_id: clientId, converted_at: new Date().toISOString() })
    .eq("email", email)
    .is("client_id", null);

  if (error) console.error("[db] lead conversion not recorded", error.message);
}
