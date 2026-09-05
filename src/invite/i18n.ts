import type { Locale, ThemeId } from "./types";

/**
 * Every string the renderer can paint, in both locales.
 *
 * German is a real locale, not a machine translation (spec section 6), so the
 * German column is written rather than derived. Keyed on `Locale` as a
 * `Record`, so a third locale is a compile error here before it is a missing
 * word on a customer's invitation.
 */
export type Messages = {
  /** The line above the names. */
  readonly kicker: string;
  /** Screen-reader name for the whole artefact, given the couple. */
  readonly artefact: (a: string, b: string) => string;
  readonly open: string;
  readonly preparing: string;
  readonly liftTheVeil: string;
  readonly scratchToReveal: string;
  readonly revealed: string;
  readonly tapToOpen: string;
  /** Shown in place of a name the couple has not typed yet. */
  readonly unnamed: string;
  readonly countdown: {
    readonly days: string;
    readonly hours: string;
    readonly minutes: string;
  };
  readonly theDay: string;
  readonly themeName: Record<ThemeId, string>;
};

const EN: Messages = {
  kicker: "Together with their families",
  artefact: (a, b) => `Wedding invitation for ${a} and ${b}`,
  open: "Open",
  preparing: "Preparing",
  liftTheVeil: "Lift the veil",
  scratchToReveal: "Scratch to reveal",
  revealed: "The date",
  tapToOpen: "Tap to open",
  unnamed: "Your name",
  countdown: { days: "Days", hours: "Hours", minutes: "Minutes" },
  theDay: "Today",
  themeName: {
    "atelier-blanc": "Atelier Blanc",
    vicioso: "Vicioso",
    noir: "Noir",
    sable: "Sable",
    aurum: "Aurum",
    verdure: "Verdure",
    porcelain: "Porcelain",
    obsidian: "Obsidian",
  },
};

const DE: Messages = {
  kicker: "Gemeinsam mit ihren Familien",
  artefact: (a, b) => `Hochzeitseinladung für ${a} und ${b}`,
  open: "Öffnen",
  preparing: "Wird vorbereitet",
  liftTheVeil: "Schleier heben",
  scratchToReveal: "Freirubbeln",
  revealed: "Das Datum",
  tapToOpen: "Zum Öffnen tippen",
  unnamed: "Euer Name",
  countdown: { days: "Tage", hours: "Stunden", minutes: "Minuten" },
  theDay: "Heute",
  themeName: {
    "atelier-blanc": "Atelier Blanc",
    vicioso: "Vicioso",
    noir: "Noir",
    sable: "Sable",
    aurum: "Aurum",
    verdure: "Verdure",
    porcelain: "Porcelain",
    obsidian: "Obsidian",
  },
};

export const MESSAGES: Record<Locale, Messages> = { en: EN, de: DE };

/** The BCP 47 tag `Intl` is asked for, per locale. */
export const INTL_TAG: Record<Locale, string> = { en: "en-US", de: "de-DE" };
