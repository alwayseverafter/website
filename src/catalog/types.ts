import type { Theme } from "@/invite/themes";
import type { CatalogThemeId, Couple, OpenerId } from "@/invite/types";

/**
 * The shape of one catalogue style.
 *
 * WHY one file per style rather than one table: the copy for a style runs to
 * forty lines, and the catalogue is forty-six of them. Held in a single table
 * that is two thousand lines nobody can review, and it is a file that two
 * agents cannot edit at once. Split per style, a style is a reviewable diff
 * and the build is the thing that proves the set is complete.
 *
 * Nothing branches on an id here or anywhere downstream. A style is data.
 */

/**
 * Which product a style belongs to. The two carry different prices and
 * different promises, so the kind is declared rather than inferred from the
 * slug: a prefix is a URL convention and must not become a business rule.
 */
export type ThemeKind = "invitation" | "save-the-date";

/**
 * The colours a style page and its share image are drawn in.
 *
 * Distinct from the renderer's eight-colour `Palette`. These five are what an
 * `ImageResponse` needs, and it runs outside the document and so cannot read a
 * CSS custom property.
 */
export type ThemePalette = {
  /** Ground of the invitation itself. */
  paper: string;
  /** Text on that ground. */
  ink: string;
  /** One step back from ink. Kickers and meta. */
  muted: string;
  /** The single hairline weight, in this theme's colour. */
  rule: string;
  /** The one colour the theme is actually about. Used sparingly. */
  accent: string;
};

export type ThemeCopy = {
  /** Display name. Title case, no article. */
  name: string;
  /** One declarative line. Gallery caption and page lede. */
  summary: string;
  /** Under 60 characters of it lands in a SERP, so the style name comes first. */
  metaTitle: string;
  metaDescription: string;
  palette: ThemePalette;
  /** Which of the four openers this style ships with. */
  opener: OpenerId;
  /** Human name of that opener, for the spec list. */
  openerName: string;
  /**
   * The couple on the sample. Distinct per style, because pages showing the
   * same two names read as copies of one page, to a reader and to a crawler
   * alike. The test suite enforces that no pair repeats.
   */
  sample: Omit<Couple, "theme">;
  /** Spec list. Facts get words, never icons. */
  spec: { paper: string; ink: string; faces: string };
  whatItIs: readonly string[];
  whoItSuits: readonly string[];
  typography: readonly string[];
  howItOpens: readonly string[];
};

export type CatalogEntry = {
  readonly id: CatalogThemeId;
  readonly kind: ThemeKind;
  /**
   * True while this entry is still the generated stub.
   *
   * R12: a placeholder announces itself. A draft is kept out of the gallery,
   * out of the sitemap and out of the router, and `catalog.test.ts` reports
   * every one of them by name, so an unfinished style cannot reach a visitor
   * by being quietly indistinguishable from a finished one.
   */
  readonly draft: boolean;
  /**
   * The renderer's token bundle, less its id. The id is written once, above,
   * and the assembly in `index.ts` puts it back, so the two cannot disagree.
   */
  readonly theme: Omit<Theme, "id">;
  readonly copy: ThemeCopy;
  /** Display name in German. Often identical; a proper noun usually is. */
  readonly nameDe: string;
};
