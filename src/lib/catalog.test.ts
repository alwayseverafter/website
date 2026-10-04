import { describe, expect, it } from "vitest";

import { CATALOG, CATALOG_ENTRIES, PUBLISHED_ENTRIES } from "@/catalog";
import { SOURCE_NAMES } from "@/catalog/sources";
import type { CatalogEntry } from "@/catalog/types";
import { MESSAGES } from "@/invite/i18n";
import { THEMES } from "@/invite/themes";
import { CATALOG_THEME_IDS, OPENER_IDS, THEME_IDS } from "@/invite/types";
import { PRICE, THEME_COPY, THEME_ORDER, kindOf, themesOfKind } from "@/lib/seo";

/**
 * The catalogue's acceptance suite.
 *
 * WHY it is this strict: forty-six styles were written by agents working in
 * parallel from one brief, and the failure mode of that arrangement is not a
 * crash. It is forty-six pages that typecheck, build, deploy, and read as the
 * same page with the nouns swapped. Every assertion below is a way that has
 * actually gone wrong: a palette left at the stub's black on white, two styles
 * sharing a sample couple, a meta description truncated in the SERP, a name
 * that was never actually changed from the design it was drawn from.
 *
 * A style that passes this suite is publishable. A style that does not stays
 * `draft: true`, which keeps it off the site until it is fixed.
 */

const HEX = /^#[0-9A-F]{6}$/;

/** Only finished styles are held to the editorial bar. Drafts are reported separately. */
const published = PUBLISHED_ENTRIES;

/* ── relative luminance, for the contrast floor ──────────────────────── */

function channel(value: number): number {
  const c = value / 255;
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

function luminance(hex: string): number {
  const r = Number.parseInt(hex.slice(1, 3), 16);
  const g = Number.parseInt(hex.slice(3, 5), 16);
  const b = Number.parseInt(hex.slice(5, 7), 16);
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

/** WCAG 2.2 contrast ratio between two opaque colours. */
function contrast(a: string, b: string): number {
  const sorted = [luminance(a), luminance(b)].sort((x, y) => y - x);
  const hi = sorted[0] ?? 0;
  const lo = sorted[1] ?? 0;
  return (hi + 0.05) / (lo + 0.05);
}

/* ── the set ─────────────────────────────────────────────────────────── */

describe("the catalogue is complete", () => {
  it("has an entry for every declared id", () => {
    for (const id of CATALOG_THEME_IDS) {
      expect(CATALOG[id], `no entry for ${id}`).toBeDefined();
      expect(CATALOG[id].id, `${id} declares a different id`).toBe(id);
    }
    expect(CATALOG_ENTRIES).toHaveLength(CATALOG_THEME_IDS.length);
  });

  it("gives every theme id a token bundle, copy and a name in both locales", () => {
    for (const id of THEME_IDS) {
      expect(THEMES[id], `${id} has no token bundle`).toBeDefined();
      expect(THEMES[id].id, `${id} token bundle carries the wrong id`).toBe(id);
      expect(THEME_COPY[id], `${id} has no copy`).toBeDefined();
      expect(MESSAGES.en.themeName[id], `${id} has no English name`).toBeTruthy();
      expect(MESSAGES.de.themeName[id], `${id} has no German name`).toBeTruthy();
    }
  });

  it("routes only to styles that are finished", () => {
    const draftIds = new Set(
      CATALOG_ENTRIES.filter((entry) => entry.draft).map((entry) => entry.id as string),
    );
    for (const id of THEME_ORDER) {
      expect(draftIds.has(id), `${id} is a draft but is in THEME_ORDER`).toBe(false);
    }
  });

  /*
   * Not a pass/fail on the set being finished — it is expected to be partial
   * while the catalogue is filled in. It names what is outstanding so the
   * number is visible in CI rather than discovered by reading files.
   */
  it("reports how much of the catalogue is still draft", () => {
    const drafts = CATALOG_ENTRIES.filter((entry) => entry.draft).map((entry) => entry.id);
    console.info(
      `catalogue: ${published.length}/${CATALOG_ENTRIES.length} published`
      + (drafts.length > 0 ? `; drafts: ${drafts.join(", ")}` : ""),
    );
    expect(Array.isArray(drafts)).toBe(true);
  });
});

/* ── pricing ─────────────────────────────────────────────────────────── */

describe("pricing", () => {
  it("prices both products in euro, fifty under the design they reinterpret", () => {
    /* Source: thedigitalyes.com, invitations EUR 175, save the dates EUR 75. */
    expect(PRICE.invitation).toEqual({ amount: "125.00", currency: "EUR" });
    expect(PRICE["save-the-date"]).toEqual({ amount: "25.00", currency: "EUR" });
  });

  it("quotes the same number the checkout charges", async () => {
    const { priceMinorUnits } = await import("@/lib/i18n");
    for (const locale of ["en", "de"] as const) {
      expect(
        priceMinorUnits("invitation", locale),
        `${locale} invitation price disagrees with PRICE.invitation`,
      ).toBe(Math.round(Number(PRICE.invitation.amount) * 100));
    }
  });
});

/* ── every published style ───────────────────────────────────────────── */

describe.each(published.map((entry) => [entry.id, entry] as const))(
  "%s",
  (id: string, entry: CatalogEntry) => {
    const { copy, theme } = entry;

    it("is named, and not named after the design it reinterprets", () => {
      expect(copy.name.trim()).not.toBe("");
      expect(copy.name).not.toMatch(/placeholder/i);
      expect(copy.name.length).toBeLessThanOrEqual(40);

      const source = SOURCE_NAMES[id];
      expect(source, `${id} has no recorded source`).toBeTruthy();
      expect(
        copy.name.toLowerCase(),
        `${id} still carries the source name "${source}"`,
      ).not.toBe(String(source).toLowerCase());
    });

    it("carries no leftover placeholder text", () => {
      const prose = [
        copy.summary,
        copy.metaTitle,
        copy.metaDescription,
        copy.spec.paper,
        copy.spec.ink,
        copy.spec.faces,
        copy.sample.a,
        copy.sample.b,
        ...copy.whatItIs,
        ...copy.whoItSuits,
        ...copy.typography,
        ...copy.howItOpens,
      ];
      for (const line of prose) {
        expect(line, `${id} still has placeholder prose`).not.toMatch(/placeholder/i);
      }
    });

    it("fits a search result", () => {
      /* Under 60 characters of a title lands in a SERP; the name goes first. */
      expect(
        copy.metaTitle.length,
        `${id} metaTitle is ${copy.metaTitle.length} chars`,
      ).toBeLessThanOrEqual(60);
      expect(
        copy.metaTitle.startsWith(copy.name),
        `${id} metaTitle must open with the name`,
      ).toBe(true);

      /* Google truncates around 160. Under 110 wastes the slot. */
      expect(copy.metaDescription.length).toBeGreaterThanOrEqual(110);
      expect(copy.metaDescription.length).toBeLessThanOrEqual(165);

      expect(copy.summary.length).toBeGreaterThanOrEqual(30);
      expect(copy.summary.length).toBeLessThanOrEqual(120);
    });

    it("has four sections of real editorial copy", () => {
      const sections = {
        whatItIs: copy.whatItIs,
        whoItSuits: copy.whoItSuits,
        typography: copy.typography,
        howItOpens: copy.howItOpens,
      };
      for (const [name, lines] of Object.entries(sections)) {
        expect(
          lines.length,
          `${id}.${name} needs at least two paragraphs`,
        ).toBeGreaterThanOrEqual(2);
        for (const line of lines) {
          expect(
            line.length,
            `${id}.${name} has a paragraph under 80 chars`,
          ).toBeGreaterThanOrEqual(80);
        }
      }
    });

    it("declares a real opener and names it", () => {
      expect(OPENER_IDS).toContain(copy.opener);
      expect(copy.openerName.trim()).not.toBe("");
    });

    it("is drawn in valid, legible colour", () => {
      for (const [slot, value] of Object.entries(copy.palette)) {
        expect(value, `${id}.palette.${slot} is not #RRGGBB upper case`).toMatch(HEX);
      }
      for (const [slot, value] of Object.entries(theme.palette)) {
        expect(value, `${id}.theme.palette.${slot} is not #RRGGBB upper case`).toMatch(HEX);
      }

      /* WCAG 2.2 AA for body text. An invitation nobody can read is not a style. */
      expect(
        contrast(theme.palette.ink, theme.palette.bg),
        `${id}: ink on bg is below 4.5:1`,
      ).toBeGreaterThanOrEqual(4.5);
      expect(
        contrast(copy.palette.ink, copy.palette.paper),
        `${id}: share-image ink on paper is below 4.5:1`,
      ).toBeGreaterThanOrEqual(4.5);

      /* The stub's black on white passes contrast. Catch it by shape instead. */
      expect(
        `${theme.palette.bg}${theme.palette.ink}`,
        `${id} still has the stub palette`,
      ).not.toBe("#FFFFFF#000000");
    });

    it("declares its kind, and the kind its slug implies", () => {
      expect(["invitation", "save-the-date"]).toContain(entry.kind);
      expect(
        entry.kind === "save-the-date",
        `${id}: an std- slug and a kind that disagree`,
      ).toBe(id.startsWith("std-"));
      expect(kindOf(entry.id)).toBe(entry.kind);
    });

    it("has a sample couple with a real future date", () => {
      expect(copy.sample.a.trim()).not.toBe("");
      expect(copy.sample.b.trim()).not.toBe("");
      expect(copy.sample.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);

      const parsed = new Date(`${copy.sample.date}T12:00:00Z`);
      expect(Number.isNaN(parsed.getTime()), `${id} sample date is not a day`).toBe(false);
      expect(
        parsed.toISOString().slice(0, 10),
        `${id} sample date is not a calendar day`,
      ).toBe(copy.sample.date);
      expect(
        parsed.getTime(),
        `${id} sample date is in the past`,
      ).toBeGreaterThan(Date.now());
    });
  },
);

/* ── the set, taken together ─────────────────────────────────────────── */

describe("no two published styles are the same page", () => {
  it("gives every style its own name", () => {
    const names = published.map((entry) => entry.copy.name.toLowerCase());
    expect(new Set(names).size, "two styles share a name").toBe(names.length);
  });

  it("gives every style its own sample couple", () => {
    const seen = new Map<string, string>();
    for (const entry of published) {
      const pair = `${entry.copy.sample.a.toLowerCase()}+${entry.copy.sample.b.toLowerCase()}`;
      const owner = seen.get(pair);
      expect(owner, `${entry.id} reuses the sample couple of ${owner}`).toBeUndefined();
      seen.set(pair, entry.id);
    }
  });

  it("gives every style its own palette", () => {
    const seen = new Map<string, string>();
    for (const entry of published) {
      const key = Object.values(entry.theme.palette).join("");
      const owner = seen.get(key);
      expect(owner, `${entry.id} has the same palette as ${owner}`).toBeUndefined();
      seen.set(key, entry.id);
    }
  });

  it("gives every style its own summary line", () => {
    const summaries = published.map((entry) => entry.copy.summary.toLowerCase());
    expect(new Set(summaries).size, "two styles share a summary").toBe(summaries.length);
  });

  it("gives every style its own opening paragraph", () => {
    const openings = published.map((entry) => entry.copy.whatItIs[0]?.toLowerCase() ?? "");
    expect(
      new Set(openings).size,
      "two styles open with the same sentence",
    ).toBe(openings.length);
  });
});

describe("the gallery", () => {
  it("sorts every published style into exactly one product", () => {
    const invitations = themesOfKind("invitation");
    const saveTheDates = themesOfKind("save-the-date");
    expect(invitations.length + saveTheDates.length).toBe(THEME_ORDER.length);
    expect(new Set(THEME_ORDER).size, "a style is listed twice").toBe(THEME_ORDER.length);
  });
});
