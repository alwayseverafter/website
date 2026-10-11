import { en, type Catalogue } from "./en";
import { de } from "./de";
/* Relative rather than aliased on purpose: this module is unit tested, and the
   test runner has no `@/` alias configured. The tier names belong to the event
   contract, so they are imported from it rather than restated here. */
import type { Tier } from "../analytics";

export type { Catalogue, LegalDocument, LegalSection } from "./en";

/**
 * Localisation for the funnel.
 *
 * US English is the default and the canonical experience. German is a real
 * locale with its own copy, its own currency and its own date format, not a
 * machine translation of the English.
 */

export const LOCALES = ["en", "de"] as const;
export type Locale = (typeof LOCALES)[number];

/** US English. Everything else is a deliberate choice by the visitor. */
export const DEFAULT_LOCALE: Locale = "en";

/**
 * The catalogues, keyed by a literal union rather than by an index signature.
 *
 * This matters. `tsconfig.json` sets `noUncheckedIndexedAccess`, so a lookup
 * against `Record<string, Catalogue>` would yield `Catalogue | undefined` and
 * every call site downstream would inherit an `undefined` that cannot actually
 * occur. `Record<Locale, Catalogue>` is exhaustive by construction: adding a
 * locale to `LOCALES` fails the build here until its catalogue exists.
 */
const CATALOGUES: Record<Locale, Catalogue> = { en, de };

/** The messages for a locale. Total, so no call site needs a fallback. */
export function catalogue(locale: Locale): Catalogue {
  return CATALOGUES[locale];
}

/** BCP 47 tags. Used for the `lang` attribute and for every `Intl` call. */
export const HTML_LANG: Record<Locale, string> = {
  en: "en-US",
  de: "de-DE",
};

/** What the switch shows. Two letters, uppercase, no flags: a flag is a country. */
export const LOCALE_LABEL: Record<Locale, string> = {
  en: "EN",
  de: "DE",
};

/** The autonym, for the accessible name of each option. */
export const LOCALE_NAME: Record<Locale, string> = {
  en: "English",
  de: "Deutsch",
};

/** Narrows an untrusted string, from storage or a URL, to a Locale. */
export function parseLocale(value: string | null | undefined): Locale | null {
  if (value === null || value === undefined) return null;
  return (LOCALES as readonly string[]).includes(value)
    ? (value as Locale)
    : null;
}

/* ── money ───────────────────────────────────────────────────────────── */

export const CURRENCY: Record<Locale, string> = {
  en: "USD",
  de: "EUR",
};

/**
 * Prices in minor units, so a price is never a float and never a formatted
 * string. Nothing here is charged automatically; a price is agreed by email.
 *
 * The euro figures are parity with the dollar ones rather than a conversion.
 * That is a business decision and it is provisional: it depends on the selling
 * entity, and on German price indication law, which requires a consumer price
 * to be shown including VAT. See the open questions in the design spec.
 *
 * Written here once. Never written into a sentence in a catalogue, because a
 * hardcoded "$249" in a German paragraph is a bug that typechecks.
 */
const PRICES: Record<Locale, Record<Tier, number>> = {
  en: { invitation: 24900, commission: 59900 },
  de: { invitation: 24900, commission: 59900 },
};

/** Formats minor units as money in the locale's own currency. */
export function formatMoney(minorUnits: number, locale: Locale): string {
  return new Intl.NumberFormat(HTML_LANG[locale], {
    style: "currency",
    currency: CURRENCY[locale],
    /* Both prices are whole. A trailing ",00" is noise on a price this size. */
    minimumFractionDigits: minorUnits % 100 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(minorUnits / 100);
}

/** The price of a tier, as this locale writes it. */
export function formatPrice(tier: Tier, locale: Locale): string {
  return formatMoney(PRICES[locale][tier], locale);
}

/** The raw amount, for the checkout call and for the purchase event. */
export function priceMinorUnits(tier: Tier, locale: Locale): number {
  return PRICES[locale][tier];
}

/* ── dates ───────────────────────────────────────────────────────────── */

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

/**
 * A wedding date, written the way the locale writes one.
 *
 * Fixed to UTC on purpose. The input is a calendar date with no time in it, so
 * a browser in Los Angeles must not render 2026-12-15 as the fourteenth. Every
 * layer that touches this value, the store, the checkout and this formatter,
 * agrees that the string is the truth and the timezone is not involved.
 *
 * Throws on a malformed input rather than rendering "Invalid Date". The store
 * already validates the shape, so a bad value here is a programming error, and
 * a programming error that prints quietly is the defect R3 exists to stop.
 */
export function formatWeddingDate(iso: string, locale: Locale): string {
  if (!ISO_DATE.test(iso)) {
    throw new TypeError(`formatWeddingDate expects YYYY-MM-DD, received "${iso}"`);
  }
  const at = new Date(`${iso}T00:00:00Z`);
  if (Number.isNaN(at.getTime())) {
    throw new TypeError(`formatWeddingDate received an impossible date "${iso}"`);
  }
  return new Intl.DateTimeFormat(HTML_LANG[locale], {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(at);
}

/** A date without a day, for a document footer. */
export function formatDocumentDate(iso: string, locale: Locale): string {
  return formatWeddingDate(iso, locale);
}

/* ── routing ─────────────────────────────────────────────────────────── */

/**
 * German lives under `/de`. English has no prefix, because it is the default
 * and a canonical URL should not carry a segment that means "the usual one".
 */
const PREFIX = "/de";

/** The locale a pathname is asking for. Unprefixed means English. */
export function localeFromPath(pathname: string): Locale {
  return pathname === PREFIX || pathname.startsWith(`${PREFIX}/`)
    ? "de"
    : DEFAULT_LOCALE;
}

/** The same page, in the other locale. Used by the switch, and by any link. */
export function localeHref(pathname: string, locale: Locale): string {
  const bare =
    pathname === PREFIX
      ? "/"
      : pathname.startsWith(`${PREFIX}/`)
        ? pathname.slice(PREFIX.length)
        : pathname;
  if (locale === DEFAULT_LOCALE) return bare;
  return bare === "/" ? PREFIX : `${PREFIX}${bare}`;
}

/* ── the visitor's choice ────────────────────────────────────────────── */

/**
 * Where the choice is kept.
 *
 * Local storage rather than a cookie, so the claim in the privacy notice, that
 * this site sets no cookies, stays literally true and there is nothing to put
 * a banner in front of.
 *
 * The choice is remembered, never acted on behind the visitor's back. Nothing
 * here reads an IP address, nothing redirects, and a link that was shared in
 * one language opens in that language for whoever receives it. Guessing a
 * visitor's language from where they appear to be is the kind of cleverness
 * that irritates the exact person this site is for.
 */
export const LOCALE_STORAGE_KEY = "aea.locale";

export function readStoredLocale(): Locale | null {
  try {
    return parseLocale(window.localStorage.getItem(LOCALE_STORAGE_KEY));
  } catch {
    /* Private mode, or storage disabled. Having no memory is not an error. */
    return null;
  }
}

export function storeLocale(locale: Locale): void {
  try {
    window.localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  } catch {
    /* The navigation still happens. Only the memory of it is lost. */
  }
}
