import type { CSSProperties } from "react";
import { THEME_IDS, type ThemeId } from "./types";

/**
 * A theme is a token bundle, not a template.
 *
 * Ported from the product repo (`src/lib/themes.ts`, see PROVENANCE.md). The
 * architecture is the valuable part and it is kept intact: adding a ninth
 * theme is a pure data change. Append an entry to `THEMES`, give it a name in
 * `i18n.ts`, and it appears in the renderer with no other edit. Nothing here
 * branches on a theme id, and nothing outside this file may.
 */

/**
 * Which pair of faces a theme is set in.
 *
 * The funnel ships exactly three faces (Italiana, Cormorant Garamond, Jost),
 * loaded once in `app/layout.tsx` per the brand spec. Every pairing below is
 * built from those three. Naming a face nobody loads would render its fallback
 * with no warning, which is R3, so the temptation to port `deco` (Cinzel) and
 * `modern` (Playfair, Outfit) verbatim is refused. Adding a face is a change
 * to the layout first and to this table second.
 */
export type FontPairing = "editorial" | "classic" | "garamond" | "geometric";

export type Ornament = "diamond" | "tile" | "leaf" | "deco" | "weave" | "none";
export type Surface = "grain" | "marble" | "linen" | "plaster" | "none";

/** How the arrived state enters. Not how the opener leaves; that is the opener's. */
export type Motion = "veil" | "fade-rise" | "none";

/**
 * How the display face is set. One named decision rather than four loose knobs,
 * because these only ever move together: a title-case serif wants a tight fit,
 * an italic ampersand and a foil sheen across the letterforms, while tracked
 * caps want air, an upright ampersand and flat ink. A theme whose accent is ink
 * rather than a metal has no foil to catch the light.
 */
export type Lettering = "titlecase" | "tracked-caps";

/**
 * Whether content sits inside framed cards or directly on the ground. "open"
 * is the editorial treatment: no boxes, no tiles, no pills, separation is
 * space and hairlines only. Boxes are what make a page read as a web form
 * rather than as print, so this is the single biggest lever on how expensive
 * an invitation looks.
 */
export type Chrome = "framed" | "open";

export type Palette = {
  readonly bg: string;
  readonly surface: string;
  readonly ink: string;
  readonly muted: string;
  readonly accent: string;
  readonly accentSoft: string;
  readonly rule: string;
  readonly onAccent: string;
};

export type Theme = {
  readonly id: ThemeId;
  /** Drives the colour scheme reported to the browser, nothing else. */
  readonly dark: boolean;
  readonly palette: Palette;
  readonly fonts: FontPairing;
  readonly ornament: Ornament;
  readonly surface: Surface;
  readonly motion: Motion;
  readonly lettering: Lettering;
  readonly chrome: Chrome;
};

const LETTERING: Record<
  Lettering,
  {
    readonly case: string;
    readonly track: string;
    readonly amp: string;
    readonly giltFill: string;
  }
> = {
  titlecase: {
    case: "none",
    track: "-0.01em",
    amp: "italic",
    /* transparent lets the gilt gradient through the glyphs. */
    giltFill: "transparent",
  },
  "tracked-caps": {
    case: "uppercase",
    track: "0.1em",
    amp: "normal",
    /* Ink accents have no metal to catch light, so the glyphs paint flat. */
    giltFill: "var(--ink)",
  },
};

/**
 * Only the active theme's families are ever painted, so the browser downloads
 * only those. Each stack ends in a real fallback rather than a bare generic, so
 * a blocked font request degrades to something with the right proportions
 * instead of to Times.
 */
export const FONT_STACKS: Record<
  FontPairing,
  { readonly display: string; readonly body: string }
> = {
  /* High-contrast Didone caps. The flagship voice. */
  editorial: {
    display: 'var(--f-italiana), "Didot", "Bodoni MT", Georgia, serif',
    body: 'var(--f-jost), "Avenir Next", system-ui, sans-serif',
  },
  /* Light old-style serif against a geometric sans. The default wedding voice. */
  classic: {
    display: 'var(--f-cormorant), "Adobe Garamond Pro", Georgia, serif',
    body: 'var(--f-jost), "Avenir Next", system-ui, sans-serif',
  },
  /* One family throughout, set light and large. Warm, bookish, low contrast. */
  garamond: {
    display: 'var(--f-cormorant), "Adobe Garamond Pro", Georgia, serif',
    body: 'var(--f-cormorant), "Adobe Garamond Pro", Georgia, serif',
  },
  /* Sans throughout, tracked. Reads modern rather than traditional. */
  geometric: {
    display: 'var(--f-jost), "Futura", "Avenir Next", system-ui, sans-serif',
    body: 'var(--f-jost), "Avenir Next", system-ui, sans-serif',
  },
};

/**
 * Keyed on the literal union, not on an index signature, so `THEMES[id]` is a
 * `Theme` rather than `Theme | undefined` under `noUncheckedIndexedAccess`, and
 * so a new id in `THEME_IDS` is a compile error here rather than a blank
 * invitation at runtime.
 */
export const THEMES: Record<ThemeId, Theme> = {
  /**
   * The flagship. Paper white, editorial, open chrome: no ornament, no metal,
   * no boxes. The accent is ink rather than gold, so nothing on the page
   * competes with the names. This is the one the funnel opens on.
   */
  "atelier-blanc": {
    id: "atelier-blanc",
    dark: false,
    fonts: "editorial",
    ornament: "none",
    surface: "plaster",
    motion: "fade-rise",
    lettering: "tracked-caps",
    chrome: "open",
    palette: {
      bg: "#F1EEE9",
      surface: "#FAF8F5",
      ink: "#141312",
      muted: "#8A857D",
      accent: "#1B1917",
      accentSoft: "#E4E0D9",
      rule: "#CBC6BC",
      onAccent: "#F7F5F1",
    },
  },
  /** Carmine on blush. The one theme with an unapologetic colour. */
  vicioso: {
    id: "vicioso",
    dark: false,
    fonts: "classic",
    ornament: "deco",
    surface: "grain",
    motion: "veil",
    lettering: "titlecase",
    chrome: "framed",
    palette: {
      bg: "#FBF3EF",
      surface: "#FFFFFF",
      ink: "#331E22",
      muted: "#8A6B70",
      accent: "#9E2B3C",
      accentSoft: "#F6E0E2",
      rule: "#D9AEB2",
      onAccent: "#FFF7F6",
    },
  },
  /** Atelier's night register: the same open chrome, the ground inverted. */
  noir: {
    id: "noir",
    dark: true,
    fonts: "editorial",
    ornament: "none",
    surface: "none",
    motion: "fade-rise",
    lettering: "tracked-caps",
    chrome: "open",
    palette: {
      bg: "#101012",
      surface: "#17171A",
      ink: "#EFEDE9",
      muted: "#9A968E",
      accent: "#E8E4DC",
      accentSoft: "#232326",
      rule: "#3A3A3E",
      onAccent: "#101012",
    },
  },
  /** Sand and tobacco, woven. The warmest of the light themes. */
  sable: {
    id: "sable",
    dark: false,
    fonts: "garamond",
    ornament: "weave",
    surface: "linen",
    motion: "fade-rise",
    lettering: "titlecase",
    chrome: "framed",
    palette: {
      bg: "#FAF5EC",
      surface: "#FFFFFF",
      ink: "#33291D",
      muted: "#7E6B58",
      accent: "#A3703C",
      accentSoft: "#F1E3CE",
      rule: "#DCC5A5",
      onAccent: "#FFFBF4",
    },
  },
  /** Gilt on ivory, over marble. The traditional formal register. */
  aurum: {
    id: "aurum",
    dark: false,
    fonts: "classic",
    ornament: "diamond",
    surface: "marble",
    motion: "veil",
    lettering: "titlecase",
    chrome: "framed",
    palette: {
      bg: "#FCF9F1",
      surface: "#FFFFFF",
      ink: "#2A2520",
      muted: "#7A6E60",
      accent: "#B08D3F",
      accentSoft: "#EFE5CD",
      rule: "#D9C89A",
      onAccent: "#FFFDF7",
    },
  },
  /** Deep green and brass. Garden weddings, foliage, long tables. */
  verdure: {
    id: "verdure",
    dark: false,
    fonts: "garamond",
    ornament: "leaf",
    surface: "linen",
    motion: "fade-rise",
    lettering: "titlecase",
    chrome: "framed",
    palette: {
      bg: "#F3F6F2",
      surface: "#FFFFFF",
      ink: "#12241B",
      muted: "#5D7266",
      accent: "#0F5132",
      accentSoft: "#D8E8DE",
      rule: "#A98C4B",
      onAccent: "#F7FBF8",
    },
  },
  /** Cobalt on glaze. Cool, tiled, the only blue. */
  porcelain: {
    id: "porcelain",
    dark: false,
    fonts: "geometric",
    ornament: "tile",
    surface: "none",
    motion: "fade-rise",
    lettering: "tracked-caps",
    chrome: "framed",
    palette: {
      bg: "#F6F8FA",
      surface: "#FFFFFF",
      ink: "#16283A",
      muted: "#647C93",
      accent: "#2C5F92",
      accentSoft: "#DEE9F4",
      rule: "#BFD2E2",
      onAccent: "#FFFFFF",
    },
  },
  /** Champagne on black. The most opulent, and the far end of the range. */
  obsidian: {
    id: "obsidian",
    dark: true,
    fonts: "geometric",
    ornament: "deco",
    surface: "none",
    motion: "veil",
    lettering: "tracked-caps",
    chrome: "framed",
    palette: {
      bg: "#0B0C0E",
      surface: "#141518",
      ink: "#F1EBE1",
      muted: "#A29A8D",
      accent: "#D8BE84",
      accentSoft: "#26221B",
      rule: "#4A4335",
      onAccent: "#14120D",
    },
  },
};

/** Ordered by `THEME_IDS`, so the picker's order is the contract's order. */
export const THEME_LIST: readonly Theme[] = THEME_IDS.map((id) => THEMES[id]);

/**
 * Custom properties are not part of `CSSProperties`, and React passes them
 * through at runtime. Widening the return type here is the one place that fact
 * is stated, so no call site needs a cast and nothing needs `any`.
 */
export type ThemeVars = CSSProperties & Record<`--${string}`, string>;

export function themeVars(theme: Theme): ThemeVars {
  const stack = FONT_STACKS[theme.fonts];
  const set = LETTERING[theme.lettering];
  return {
    "--bg": theme.palette.bg,
    "--surface": theme.palette.surface,
    "--ink": theme.palette.ink,
    "--muted": theme.palette.muted,
    "--accent": theme.palette.accent,
    "--accent-soft": theme.palette.accentSoft,
    "--rule": theme.palette.rule,
    "--on-accent": theme.palette.onAccent,
    "--f-display": stack.display,
    "--f-body": stack.body,
    "--display-case": set.case,
    "--display-track": set.track,
    "--amp-style": set.amp,
    "--gilt-fill": set.giltFill,
  };
}
