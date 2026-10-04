import { describe, expect, it } from "vitest";
import { en } from "./en";
import { de } from "./de";
import {
  DEFAULT_LOCALE,
  LOCALES,
  catalogue,
  formatMoney,
  formatPrice,
  formatWeddingDate,
  localeFromPath,
  localeHref,
  parseLocale,
} from "./index";

/**
 * The type system already stops a missing key at build time. These tests cover
 * what a type cannot: that the two catalogues agree at runtime, that the
 * routing helpers round trip, and that a malformed date is loud rather than
 * silently rendered as "Invalid Date". See docs/LESSONS.md R3.
 */

type Tree = Record<string, unknown>;

/** Every leaf path in an object, sorted, so two catalogues can be compared. */
function paths(value: unknown, prefix = ""): string[] {
  if (Array.isArray(value)) {
    /* Arrays hold paragraphs. Their length is the translator's business, so
       compare the fact that an array is here, not what is in it. */
    return [`${prefix}[]`];
  }
  if (typeof value !== "object" || value === null) return [prefix];
  return Object.entries(value as Tree)
    .flatMap(([k, v]) => paths(v, prefix ? `${prefix}.${k}` : k))
    .sort();
}

describe("catalogues", () => {
  it("cover every locale", () => {
    for (const locale of LOCALES) {
      expect(catalogue(locale)).toBeDefined();
    }
  });

  it("are structurally identical", () => {
    expect(paths(de)).toEqual(paths(en));
  });

  it("say different words", () => {
    expect(de.legal.privacy.title).not.toEqual(en.legal.privacy.title);
  });

  it("never write a currency symbol into a sentence", () => {
    const flat = JSON.stringify({ en, de });
    expect(flat).not.toMatch(/[$€]\s?\d/);
  });
});

describe("parseLocale", () => {
  it("accepts a known locale", () => {
    expect(parseLocale("de")).toBe("de");
  });

  it("rejects anything else", () => {
    expect(parseLocale("fr")).toBeNull();
    expect(parseLocale("")).toBeNull();
    expect(parseLocale(null)).toBeNull();
    expect(parseLocale(undefined)).toBeNull();
  });
});

describe("routing", () => {
  it("puts German under /de and leaves English bare", () => {
    expect(localeHref("/legal/terms", "de")).toBe("/de/legal/terms");
    expect(localeHref("/legal/terms", "en")).toBe("/legal/terms");
    expect(localeHref("/", "de")).toBe("/de");
    expect(localeHref("/de", "en")).toBe("/");
  });

  it("is idempotent, so a second switch does not stack prefixes", () => {
    expect(localeHref(localeHref("/impressum", "de"), "de")).toBe(
      "/de/impressum",
    );
  });

  it("reads the locale back out of a path", () => {
    expect(localeFromPath("/de/legal/privacy")).toBe("de");
    expect(localeFromPath("/de")).toBe("de");
    expect(localeFromPath("/legal/privacy")).toBe(DEFAULT_LOCALE);
    /* A route that merely starts with the letters is not the German mirror. */
    expect(localeFromPath("/details")).toBe(DEFAULT_LOCALE);
  });
});

describe("money", () => {
  /*
   * Euro in both columns. The catalogue is priced against a European market
   * and one product quoted at the same number in two currencies is two
   * different prices. Only the placement of the symbol differs by locale.
   */
  it("shows euros in both locales", () => {
    expect(formatPrice("invitation", "en")).toContain("125");
    expect(formatPrice("invitation", "en")).toContain("€");
    expect(formatPrice("invitation", "de")).toContain("125");
    expect(formatPrice("invitation", "de")).toContain("€");
  });

  it("drops the cents on a whole amount and keeps them otherwise", () => {
    expect(formatMoney(12500, "en")).toBe("€125");
    expect(formatMoney(12550, "en")).toBe("€125.50");
  });
});

describe("dates", () => {
  it("formats a calendar date per locale", () => {
    expect(formatWeddingDate("2026-12-15", "en")).toBe("December 15, 2026");
    expect(formatWeddingDate("2026-12-15", "de")).toBe("15. Dezember 2026");
  });

  it("does not shift the day for a browser west of UTC", () => {
    const original = process.env.TZ;
    process.env.TZ = "America/Los_Angeles";
    try {
      expect(formatWeddingDate("2026-12-15", "en")).toContain("15");
    } finally {
      process.env.TZ = original;
    }
  });

  it("throws rather than rendering an invalid date", () => {
    expect(() => formatWeddingDate("15/12/2026", "en")).toThrow(TypeError);
    expect(() => formatWeddingDate("2026-13-45", "en")).toThrow(TypeError);
  });
});
