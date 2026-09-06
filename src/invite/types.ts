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
