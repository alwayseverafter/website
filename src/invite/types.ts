/**
 * The contract between the funnel and the invitation renderer.
 *
 * The funnel owns the left side of this seam: it collects a couple's names, a
 * date and a chosen theme. The renderer owns the right side. Keeping the
 * contract this narrow is what lets the renderer be replaced wholesale without
 * touching a single funnel section.
 */

export const THEME_IDS = [
  "atelier-blanc",
  "vicioso",
  "noir",
  "sable",
  "aurum",
  "verdure",
  "porcelain",
  "obsidian",
] as const;
export type ThemeId = (typeof THEME_IDS)[number];

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

export type InvitePreviewProps = {
  couple: Couple;
  opener: OpenerId;
  locale: Locale;
  fit: InviteFit;
  /** Skips the opener and renders the arrived state. Used by The Styles. */
  arrived?: boolean;
};
