import { INTL_TAG } from "./i18n";
import type { Locale } from "./types";

/**
 * Dates in, words out.
 *
 * `Couple.date` is an ISO calendar date and nothing else. Parsing it is a
 * fallible operation and this module says so in its type: R3 forbids quietly
 * turning a malformed date into `Invalid Date` and painting it, which is what
 * `new Date(x)` does. The caller must handle the failure branch, and the
 * renderer handles it by showing the fault.
 */

export type ParsedDate =
  | { readonly ok: true; readonly at: Date }
  | { readonly ok: false; readonly reason: string };

const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;

/**
 * Anchored at noon UTC and formatted in UTC throughout. A wedding date is a
 * calendar fact, not an instant: anchoring at midnight would render 14 December
 * for a guest in Los Angeles and 15 December for one in Berlin.
 */
export function parseWeddingDate(iso: string): ParsedDate {
  const match = ISO_DATE.exec(iso);
  if (match === null) {
    return {
      ok: false,
      reason: `date must be YYYY-MM-DD, received ${JSON.stringify(iso)}`,
    };
  }

  /* Capture groups are `string | undefined` under noUncheckedIndexedAccess.
     The regex guarantees they exist; the compiler cannot know that. */
  const [, y, m, d] = match;
  if (y === undefined || m === undefined || d === undefined) {
    return { ok: false, reason: `date ${JSON.stringify(iso)} did not parse` };
  }

  const year = Number(y);
  const month = Number(m);
  const day = Number(d);
  const at = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));

  /* Date.UTC rolls 2026-02-31 forward to 3 March rather than rejecting it, so
     the only way to catch an impossible day is to read the result back. */
  if (
    at.getUTCFullYear() !== year ||
    at.getUTCMonth() !== month - 1 ||
    at.getUTCDate() !== day
  ) {
    return { ok: false, reason: `${iso} is not a real calendar date` };
  }

  return { ok: true, at };
}

/** "Saturday, December 15, 2026" / "Samstag, 15. Dezember 2026". */
export function formatLong(at: Date, locale: Locale): string {
  return new Intl.DateTimeFormat(INTL_TAG[locale], {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(at);
}

/** "15.12.2026" / "12/15/2026". Used where the long form will not fit. */
export function formatShort(at: Date, locale: Locale): string {
  return new Intl.DateTimeFormat(INTL_TAG[locale], {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "UTC",
  }).format(at);
}

export type Remaining = {
  readonly days: number;
  readonly hours: number;
  readonly minutes: number;
  /** True once the date has passed. The renderer shows the day, not a countdown. */
  readonly elapsed: boolean;
};

const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

/**
 * `now` is passed in rather than read here, because the value differs between
 * the server render and the client's first paint and a component that reads the
 * clock during render hydrates mismatched. The caller supplies it from an
 * effect, after mount.
 */
export function remainingUntil(at: Date, now: number): Remaining {
  const delta = at.getTime() - now;
  if (delta <= 0) return { days: 0, hours: 0, minutes: 0, elapsed: true };
  return {
    days: Math.floor(delta / DAY),
    hours: Math.floor((delta % DAY) / HOUR),
    minutes: Math.floor((delta % HOUR) / MINUTE),
    elapsed: false,
  };
}
