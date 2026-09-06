import { createHash } from "node:crypto";

/**
 * A stable per-visitor key for abuse counting that is not a personal
 * identifier. Ported from the product's `src/lib/iphash.ts` so both sides
 * compute the same value for the same visitor.
 *
 * The raw address is never sent onward and never stored. The hash is salted so
 * it cannot be reversed with a rainbow table over the whole IPv4 space, which
 * an unsalted SHA-256 of an IP address trivially is.
 */
export function hashIp(ip: string | null): string | null {
  if (!ip) return null;
  const salt = process.env.RATE_LIMIT_SALT ?? "aea-unsalted-dev-only";
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex").slice(0, 32);
}

export function clientIp(req: Request): string | null {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0]?.trim() || null;
  return req.headers.get("x-real-ip");
}
