import { describe, expect, it } from "vitest";

import sitemap from "@/app/sitemap";
import { CATALOG, CATALOG_ENTRIES } from "@/catalog";
import {
  BASE_THEME_IDS,
  CATALOG_THEME_IDS,
  SELLABLE_THEME_IDS,
  isSellableTheme,
} from "@/invite/types";
import {
  PRICE,
  THEME_COPY,
  THEME_ORDER,
  absoluteUrl,
  formatSampleDate,
  isBuyable,
  isThemeId,
  kindOf,
  otherThemes,
  priceOf,
  spelledCount,
  themePath,
  themesOfKind,
} from "@/lib/seo";

/**
 * The catalogue's routing, pricing and ordering.
 *
 * `catalog.test.ts` proves each style is well written. This proves the site
 * puts the right ones in front of a visitor, at the right price, under the
 * right URL — a different question, and the one that decides whether somebody
 * is charged for a thing we cannot deliver.
 *
 * The rules under test were all introduced when listing was decoupled from
 * selling. Before that, `THEME_ORDER` was `THEME_IDS.filter(isSellableTheme)`
 * and every assertion here was trivially true of a one-page site.
 */

/** The seven originals that are written but deliberately not sold or listed. */
const WITHHELD_BASE = BASE_THEME_IDS.filter((id) => !isSellableTheme(id));

describe("what the site lists", () => {
  it("lists every published catalogue style", () => {
    for (const entry of CATALOG_ENTRIES) {
      if (entry.draft) continue;
      expect(THEME_ORDER, `${entry.id} is finished but unlisted`).toContain(entry.id);
    }
  });

  it("lists no draft", () => {
    for (const entry of CATALOG_ENTRIES) {
      if (!entry.draft) continue;
      expect(THEME_ORDER, `${entry.id} is a draft but listed`).not.toContain(entry.id);
    }
  });

  /*
   * The seven unsold originals stay hidden. That predates this catalogue and
   * is a separate decision; pinning it here means widening it has to be
   * deliberate rather than a side effect of touching THEME_ORDER again.
   */
  it("keeps the withheld original styles out", () => {
    expect(WITHHELD_BASE.length).toBe(7);
    for (const id of WITHHELD_BASE) {
      expect(THEME_ORDER, `${id} should still be withheld`).not.toContain(id);
    }
  });

  it("lists the sellable original", () => {
    for (const id of SELLABLE_THEME_IDS) {
      expect(THEME_ORDER).toContain(id);
    }
  });

  it("lists nothing twice", () => {
    expect(new Set(THEME_ORDER).size).toBe(THEME_ORDER.length);
  });

  it("gives every listed style copy to render", () => {
    for (const id of THEME_ORDER) {
      expect(THEME_COPY[id], `${id} is listed with no copy`).toBeDefined();
    }
  });
});

describe("which product a style belongs to", () => {
  it("treats every original as an invitation", () => {
    for (const id of BASE_THEME_IDS) {
      expect(kindOf(id)).toBe("invitation");
    }
  });

  /*
   * The slug prefix is a URL convention; `kind` is the business rule. They are
   * required to agree, but the code reads `kind` — so this checks the data,
   * not the parsing.
   */
  it("agrees with the slug convention on every catalogue style", () => {
    for (const id of CATALOG_THEME_IDS) {
      const expected = id.startsWith("std-") ? "save-the-date" : "invitation";
      expect(kindOf(id), `${id} declares the wrong kind`).toBe(expected);
    }
  });

  it("sorts every listed style into exactly one product", () => {
    const invitations = themesOfKind("invitation");
    const saveTheDates = themesOfKind("save-the-date");
    expect(invitations.length + saveTheDates.length).toBe(THEME_ORDER.length);
    for (const id of invitations) expect(saveTheDates).not.toContain(id);
  });

  it("lists both products", () => {
    expect(themesOfKind("invitation").length).toBeGreaterThan(0);
    expect(themesOfKind("save-the-date").length).toBeGreaterThan(0);
  });
});

describe("price", () => {
  it("quotes each style its own product's price", () => {
    for (const id of THEME_ORDER) {
      expect(priceOf(id)).toEqual(PRICE[kindOf(id)]);
    }
  });

  it("prices a save the date below an invitation", () => {
    expect(Number(PRICE["save-the-date"].amount))
      .toBeLessThan(Number(PRICE.invitation.amount));
  });

  it("quotes one currency across the catalogue", () => {
    const currencies = new Set(THEME_ORDER.map((id) => priceOf(id).currency));
    expect(currencies).toEqual(new Set(["EUR"]));
  });
});

describe("what a visitor can actually buy", () => {
  /*
   * The whole point of separating listing from selling. A style the product
   * cannot build is shown, described and priced, and is never sold: that is
   * R3 with a receipt attached.
   */
  it("sells only what the product can build", () => {
    for (const id of THEME_ORDER) {
      expect(isBuyable(id), `${id} is buyable but not sellable`)
        .toBe(isSellableTheme(id));
    }
  });

  it("does not sell any catalogue style yet", () => {
    for (const id of CATALOG_THEME_IDS) {
      expect(isBuyable(id), `${id} became buyable without widening SELLABLE_THEME_IDS`)
        .toBe(false);
    }
  });

  it("still lists far more than it sells", () => {
    const buyable = THEME_ORDER.filter(isBuyable);
    expect(buyable.length).toBeLessThan(THEME_ORDER.length);
    expect(buyable.length).toBeGreaterThan(0);
  });
});

describe("cross links at the foot of a style page", () => {
  it("never links a style to itself", () => {
    for (const id of THEME_ORDER) {
      expect(otherThemes(id)).not.toContain(id);
    }
  });

  it("links only within the same product", () => {
    for (const id of THEME_ORDER) {
      for (const other of otherThemes(id)) {
        expect(kindOf(other), `${id} cross-links to a ${kindOf(other)}`).toBe(kindOf(id));
      }
    }
  });

  /*
   * Capped, because forty-six links at the foot of every page is a footer
   * sitemap: it dilutes each link it carries and reads as the same block
   * repeated forty-seven times.
   */
  it("caps the list at six", () => {
    for (const id of THEME_ORDER) {
      expect(otherThemes(id).length).toBeLessThanOrEqual(6);
    }
  });

  it("links only to pages that exist", () => {
    for (const id of THEME_ORDER) {
      for (const other of otherThemes(id)) {
        expect(THEME_ORDER).toContain(other);
      }
    }
  });
});

describe("urls", () => {
  it("gives every listed style a distinct canonical path", () => {
    const paths = THEME_ORDER.map(themePath);
    expect(new Set(paths).size).toBe(paths.length);
    for (const path of paths) expect(path).toMatch(/^\/styles\/[a-z][a-z0-9-]*$/);
  });

  it("refuses an unknown slug rather than resolving it", () => {
    expect(isThemeId("atelier-blanc")).toBe(true);
    expect(isThemeId("atelier-blank")).toBe(false);
    expect(isThemeId("")).toBe(false);
    expect(isThemeId("../etc/passwd")).toBe(false);
  });

  it("builds absolute urls against the configured origin", () => {
    expect(absoluteUrl("/styles")).toMatch(/^https?:\/\/[^/]+\/styles$/);
  });
});

describe("the sitemap", () => {
  const urls = sitemap().map((entry) => entry.url);

  it("carries the funnel and the gallery", () => {
    expect(urls).toContain(absoluteUrl("/"));
    expect(urls).toContain(absoluteUrl("/styles"));
  });

  it("carries one url per listed style and no more", () => {
    for (const id of THEME_ORDER) {
      expect(urls, `${id} is listed but absent from the sitemap`)
        .toContain(absoluteUrl(themePath(id)));
    }
    expect(urls.length).toBe(THEME_ORDER.length + 2);
  });

  it("carries no draft and no withheld style", () => {
    for (const entry of CATALOG_ENTRIES) {
      if (!entry.draft) continue;
      expect(urls).not.toContain(absoluteUrl(themePath(entry.id)));
    }
    for (const id of WITHHELD_BASE) {
      expect(urls).not.toContain(absoluteUrl(themePath(id)));
    }
  });

  it("lists nothing twice", () => {
    expect(new Set(urls).size).toBe(urls.length);
  });
});

describe("prose helpers", () => {
  /*
   * The gallery writes its count as a word. Past nine it has to fall back to
   * the numeral rather than render `undefined`, which is what an index into a
   * fixed word list does once the catalogue outgrows it.
   */
  it("spells small counts and falls back to the numeral", () => {
    expect(spelledCount(0)).toBe("No");
    expect(spelledCount(1)).toBe("One");
    expect(spelledCount(9)).toBe("Nine");
    expect(spelledCount(47)).toBe("47");
  });

  /*
   * A bare YYYY-MM-DD parses as UTC midnight and lands on the previous day
   * west of Greenwich, which would date a sample wedding a day early on half
   * the planet and on every build machine set to a US timezone.
   */
  it("formats a sample date without slipping a day", () => {
    expect(formatSampleDate("2027-04-17")).toBe("April 17, 2027");
    expect(formatSampleDate("2027-01-01")).toBe("January 1, 2027");
  });

  it("formats every sample date in the catalogue to its own day", () => {
    for (const entry of CATALOG_ENTRIES) {
      const day = Number(entry.copy.sample.date.slice(8, 10));
      expect(
        formatSampleDate(entry.copy.sample.date),
        `${entry.id} sample date slipped`,
      ).toContain(String(day));
    }
  });
});

/*
 * The redirects live in next.config.ts, outside everything else here tests,
 * and that is exactly how they shadowed the whole catalogue: forty-six pages
 * were prerendered, listed and in the sitemap, and every one of them 307'd to
 * the index in production. Nothing in the app could see it, because the rule
 * is applied by the build.
 */
describe("build redirects", () => {
  it("does not shadow a page that exists", async () => {
    const { default: config } = await import("../../next.config");
    const redirects = await config.redirects?.() ?? [];
    const shadowed = redirects
      .map((rule) => rule.source)
      .filter((source) => THEME_ORDER.some((id) => themePath(id) === source));
    expect(
      shadowed,
      `these style pages are built and listed but redirected away: ${shadowed.join(", ")}`,
    ).toEqual([]);
  });

  it("still rescues the withheld originals rather than 404ing them", async () => {
    const { default: config } = await import("../../next.config");
    const redirects = await config.redirects?.() ?? [];
    const sources = redirects.map((rule) => rule.source);
    for (const id of WITHHELD_BASE) {
      expect(sources, `${id} has no page and no redirect`).toContain(themePath(id));
    }
  });

  /*
   * 307, not 308. The restriction has a removal date, and a permanent
   * redirect is cached by every browser that sees it.
   */
  it("keeps every rescue temporary", async () => {
    const { default: config } = await import("../../next.config");
    const redirects = await config.redirects?.() ?? [];
    for (const rule of redirects) {
      expect(rule.permanent, `${rule.source} is a permanent redirect`).toBe(false);
    }
  });
});

describe("the catalogue index", () => {
  it("keys every entry by its own id", () => {
    for (const [id, entry] of Object.entries(CATALOG)) {
      expect(entry.id, `${id} is filed under the wrong key`).toBe(id);
    }
  });
});
