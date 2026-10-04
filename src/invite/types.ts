/**
 * The contract between the funnel and the invitation renderer.
 *
 * The funnel owns the left side of this seam: it collects a couple's names, a
 * date and a chosen theme. The renderer owns the right side. Keeping the
 * contract this narrow is what lets the renderer be replaced wholesale without
 * touching a single funnel section.
 */

/**
 * The eight styles the renderer shipped with. Ported from the product repo.
 */
export const BASE_THEME_IDS = [
  "atelier-blanc",
  "vicioso",
  "noir",
  "sable",
  "aurum",
  "verdure",
  "porcelain",
  "obsidian",
] as const;
export type BaseThemeId = (typeof BASE_THEME_IDS)[number];

/**
 * The catalogue styles.
 *
 * Each one is a file under `src/catalog/entries/`, and that file is the only
 * place its tokens and its copy are written. The id appears here and nowhere
 * else, so adding a style is two edits: this list and one new file.
 *
 * Save the dates carry an `std-` prefix because a save the date and an
 * invitation may share a name (both sets have a "Floral" and a "Bloom" in the
 * source we drew from) and a slug is a URL. Prefixing is what keeps two
 * different products off one page.
 */
export const CATALOG_THEME_IDS = [
  /* Invitations */
  "vitrail",
  "regalia",
  "diurne",
  "hacienda",
  "maison-dor",
  "palazzo",
  "velluto",
  "belvedere",
  "perla",
  "riviera",
  "broderie",
  "esmeralda",
  "ricamo",
  "lario",
  "giardino",
  "cygne",
  "papier",
  "regence",
  "mosaico",
  "cadence",
  "laguna",
  "savane",
  "rosaio",
  "gazette",
  "fiore",
  "amalfi",
  "marine",
  "levante",
  "verger",
  "caramelo",
  "lineal",
  "voyage",
  /* Save the dates */
  "std-tourterelle",
  "std-grattage",
  "std-palatine",
  "std-grattage-dentelle",
  "std-voile",
  "std-dentelle",
  "std-cisne",
  "std-fleuron",
  "std-revelo",
  "std-boccio",
  "std-chandelle",
  "std-oasis",
  "std-jardin",
  "std-cabana",
] as const;
export type CatalogThemeId = (typeof CATALOG_THEME_IDS)[number];

export const THEME_IDS: readonly ThemeId[] = [
  ...BASE_THEME_IDS,
  ...CATALOG_THEME_IDS,
];

/**
 * Written as a union of the two lists rather than derived from `THEME_IDS`,
 * because a spread into an array literal widens to `string[]` and would take
 * the literal union with it. The union is the thing every `Record<ThemeId, _>`
 * in the codebase relies on for its completeness check.
 */
export type ThemeId = BaseThemeId | CatalogThemeId;

/**
 * The themes that can be bought today.
 *
 * A theme is sellable only once the product can render it, and the product's
 * palettes are a different set: `PROVENANCE.md` records that the renderer's
 * architecture was ported but its palettes are new, and `atelier-blanc` is the
 * only id present on both sides. `invites.theme` in the product carries no
 * CHECK constraint, so selling one of the other seven would insert cleanly and
 * fail only when the couple opens what they paid for. That is R3 with the
 * failure moved as far from its cause as it can get.
 *
 * Widen this list in the same commit that ports the palette, never before.
 */
export const SELLABLE_THEME_IDS = ["atelier-blanc"] as const;
export type SellableThemeId = (typeof SELLABLE_THEME_IDS)[number];

export function isSellableTheme(value: string): value is SellableThemeId {
  return (SELLABLE_THEME_IDS as readonly string[]).includes(value);
}

export const OPENER_IDS = ["veil", "foil", "envelope", "direct"] as const;
export type OpenerId = (typeof OPENER_IDS)[number];

export type Locale = "en" | "de";

/** What the funnel knows about a couple. Never more than this. */
export type Couple = {
  /** First partner's given name, as typed. */
  a: string;
  /** Second partner's given name, as typed. */
  b: string;
  /** ISO 8601 calendar date, `YYYY-MM-DD`. Never a Date, never a timestamp. */
  date: string;
  theme: ThemeId;
};

/**
 * Rendering size. The renderer must not read the viewport: it is embedded in a
 * page at three different sizes and reading `vh` is what caused B2. See R1.
 */
export type InviteFit = "page" | "card" | "thumb";

/**
 * Photographs mounted into the invitation.
 *
 * Optional, and with no fallback anywhere: absent means the plate is not
 * rendered at all. That is the whole reason this can widen the seam without
 * repeating the mistake `PROVENANCE.md` records against the `tor` opener,
 * which needed a stand-in for a missing photograph and so was left behind.
 * Nothing here is invented when it is not supplied.
 *
 * The funnel does not collect these — a visitor types names and a date, not a
 * photograph — so they stay off `Couple` and sit beside it.
 */
export type InvitePhotos = {
  /** The plate above the names. Portrait or square reads best. */
  hero?: string;
  /** The plate below the countdown, closing the sheet. */
  moment?: string;
};

export type InvitePreviewProps = {
  couple: Couple;
  opener: OpenerId;
  locale: Locale;
  fit: InviteFit;
  /** Skips the opener and renders the arrived state. */
  arrived?: boolean;
  photos?: InvitePhotos;
};
