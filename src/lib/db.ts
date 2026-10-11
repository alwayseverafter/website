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

export type Locale = "en" | "de";

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
