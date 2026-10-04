import { describe, expect, it } from "vitest";

import { CATALOG, CATALOG_ENTRIES } from "@/catalog";
import { INTL_TAG, MESSAGES } from "@/invite/i18n";
import { THEME_IDS } from "@/invite/types";
import {
  formatMoney,
  formatPrice,
  formatWeddingDate,
  localeFromPath,
  localeHref,
} from "@/lib/i18n";
import { THEME_ORDER, themePath } from "@/lib/seo";

/**
 * German, across the catalogue.
 *
 * The funnel, the legal pages and the invitation renderer are bilingual. The
 * catalogue added forty-six styles to the renderer's reach in one change, and
 * a theme the renderer cannot name in German is a blank where a guest expects
 * a word. These tests hold that line.
 *
 * What is NOT asserted here, because it is not true: the style pages
 * themselves are English only. There is no /de/styles route and the editorial
 * copy has no German column. The last block pins that gap deliberately, so
 * the day somebody adds a German column the test fails and points at the
 * route that then has to exist.
 */

describe("every style can be named in German", () => {
  it("names all 54 themes in both columns", () => {
    for (const id of THEME_IDS) {
      const de = MESSAGES.de.themeName[id];
      const en = MESSAGES.en.themeName[id];
      expect(de, `${id} has no German name`).toBeTruthy();
      expect(en, `${id} has no English name`).toBeTruthy();
      expect(de.trim()).not.toBe("");
      expect(de).not.toMatch(/placeholder/i);
    }
  });

  it("takes the German name from the style's own file", () => {
    for (const entry of CATALOG_ENTRIES) {
      expect(
        MESSAGES.de.themeName[entry.id],
        `${entry.id} German name drifted from its entry`,
      ).toBe(entry.nameDe);
    }
  });

  /*
   * These are proper nouns and mostly identical across the two columns. That
   * is correct, not a missing translation — but if a style ever does differ,
   * the mapping above is what keeps the two in step.
   */
  it("keys both columns off the same set of ids", () => {
    expect(Object.keys(MESSAGES.de.themeName).sort())
      .toEqual(Object.keys(MESSAGES.en.themeName).sort());
  });
});

describe("the renderer speaks German", () => {
  it("has a German string for every message the invitation paints", () => {
    const de = MESSAGES.de;
    for (const key of ["kicker", "open", "preparing", "liftTheVeil",
      "scratchToReveal", "revealed", "tapToOpen", "unnamed", "theDay"] as const) {
      expect(de[key], `de.${key} is empty`).toBeTruthy();
      expect(de[key]).not.toBe(MESSAGES.en[key]);
    }
  });

  it("builds the German screen-reader name from the couple", () => {
    const label = MESSAGES.de.artefact("Lena", "Jonas");
    expect(label).toContain("Lena");
    expect(label).toContain("Jonas");
    expect(label).toContain("Hochzeitseinladung");
  });

  it("labels the countdown in German", () => {
    expect(MESSAGES.de.countdown).toEqual({
      days: "Tage",
      hours: "Stunden",
      minutes: "Minuten",
    });
  });

  it("asks Intl for the German tag", () => {
    expect(INTL_TAG.de).toBe("de-DE");
  });
});

describe("German money", () => {
  /*
   * Both locales are euro now. The figure is the same; only the way it is
   * written differs, and the German convention puts the symbol last.
   */
  it("writes the invitation price the German way", () => {
    const de = formatPrice("invitation", "de");
    expect(de).toContain("125");
    expect(de).toContain("€");
    expect(de.trimEnd().endsWith("€"), `German price should end in the symbol: ${de}`)
      .toBe(true);
  });

  it("quotes the same number in both locales", () => {
    const digits = (s: string) => s.replace(/\D/g, "");
    expect(digits(formatPrice("invitation", "de")))
      .toBe(digits(formatPrice("invitation", "en")));
  });

  it("drops the cents on a whole amount", () => {
    expect(formatMoney(12500, "de")).toContain("125");
    expect(formatMoney(12500, "de")).not.toContain("00");
  });
});

describe("German dates", () => {
  it("writes a wedding date the German way", () => {
    expect(formatWeddingDate("2027-04-17", "de")).toBe("17. April 2027");
  });

  it("formats every catalogue sample date in German without slipping a day", () => {
    for (const entry of CATALOG_ENTRIES) {
      const day = Number(entry.copy.sample.date.slice(8, 10));
      expect(
        formatWeddingDate(entry.copy.sample.date, "de"),
        `${entry.id} German sample date slipped`,
      ).toContain(`${day}.`);
    }
  });
});

describe("the German mirror", () => {
  it("round-trips the routes that have a German twin", () => {
    for (const path of ["/", "/impressum", "/legal/privacy", "/legal/terms"]) {
      const de = localeHref(path, "de");
      expect(localeFromPath(de)).toBe("de");
      expect(localeHref(de, "en")).toBe(path);
    }
  });

  it("reads a bare path as English", () => {
    expect(localeFromPath("/styles")).toBe("en");
    expect(localeFromPath("/details")).toBe("en");
  });

  /*
   * The catalogue is English only. `localeHref` would happily mint
   * /de/styles/<slug> for all forty-seven, and every one of them is a 404,
   * so nothing may render that switch on a style page until the route and
   * the German copy both exist. `LocaleSwitch` is mounted on the legal pages
   * only, which is what makes this safe today rather than by luck.
   *
   * When a German catalogue is built, the last assertion fails. That is the
   * point: it is the reminder, not an obstacle.
   */
  it("has no German catalogue yet, and nothing pretends otherwise", () => {
    for (const id of THEME_ORDER) {
      expect(localeHref(themePath(id), "de")).toBe(`/de/styles/${id}`);
    }
    expect(Object.keys(CATALOG).length).toBeGreaterThan(0);
    for (const entry of CATALOG_ENTRIES) {
      expect(
        Object.keys(entry.copy),
        `${entry.id} grew a German copy column; /de/styles now needs to exist`,
      ).not.toContain("de");
    }
  });
});
