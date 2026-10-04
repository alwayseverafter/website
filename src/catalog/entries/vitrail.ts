import type { CatalogEntry } from "@/catalog/types";

/**
 * Vitrail.
 *
 * A leaded-glass reading: ivory ground, hairlines standing in for the lead,
 * and one deep glass green. The source design draws actual stained glass; this
 * renderer draws colour, type and one geometric glyph, so the translation is
 * to the structure of a leaded pane rather than to its picture. The diamond
 * ornament is that pane, reduced to its outline.
 */
export const entry: CatalogEntry = {
  id: "vitrail",
  kind: "invitation",
  draft: false,
  theme: {
    dark: false,
    fonts: "classic",
    ornament: "diamond",
    surface: "none",
    motion: "veil",
    lettering: "titlecase",
    chrome: "framed",
    palette: {
      bg: "#F7F4EC",
      surface: "#FFFDF8",
      ink: "#1C2A22",
      muted: "#6F7F72",
      accent: "#2F6B4F",
      accentSoft: "#DCE9DF",
      rule: "#A9BCAE",
      onAccent: "#F7FBF7",
    },
  },
  copy: {
    name: "Vitrail",
    summary:
      "Ivory ground, lead-line hairlines, and one deep glass green that catches the light.",
    metaTitle: "Vitrail: a leaded-glass wedding invitation as a link",
    metaDescription:
      "An ivory digital wedding invitation drawn in lead lines and deep glass green."
      + " Read the whole Vitrail sample, then put your own two names on it in a minute.",
    palette: {
      paper: "#F7F4EC",
      ink: "#1C2A22",
      muted: "#6F7F72",
      rule: "#A9BCAE",
      accent: "#2F6B4F",
    },
    opener: "foil",
    openerName: "The foil",
    sample: { a: "Margaux", b: "Julien", date: "2027-04-17" },
    spec: {
      paper: "Ivory, warm",
      ink: "Glass green, near black",
      faces: "Cormorant Garamond, Jost",
    },
    whatItIs: [
      "Vitrail is a window rather than a page. The ground is a warm ivory, the"
      + " hairlines are drawn in a grey green that reads as the lead between"
      + " panes, and the one saturated colour in the whole invitation is a deep"
      + " glass green that appears at the rule and at the glyph and nowhere else.",
      "The frame is the point. Where the open styles separate their sections with"
      + " space alone, this one closes each one inside a hairline, because a"
      + " leaded window is a set of bounded shapes and an unbounded one would not"
      + " read as glass at all.",
    ],
    whoItSuits: [
      "A church with a rose window, a chapel, a registry office in a building"
      + " older than the city around it. Couples who want the invitation to carry"
      + " some of the architecture of the day rather than none of it.",
      "It also suits a long engagement, because the green is seasonless: it is"
      + " the green of glass rather than of foliage, and it does not date the"
      + " invitation to a particular month the way a botanical would.",
    ],
    typography: [
      "The names are set in Cormorant Garamond, light and large, in title case."
      + " It is an old-style face with an open aperture, which keeps it legible"
      + " at the size the names are painted while still reading as engraved.",
      "Everything practical is Jost, small and set in the grey green that sits a"
      + " step back from the ink. Two faces, one accent colour, one weight of"
      + " hairline: the restraint is what stops a framed layout reading as a form.",
    ],
    howItOpens: [
      "The foil. A sheet covers the invitation and a single band of light travels"
      + " across it, left to right, before the sheet clears and the invitation is"
      + " behind it. On this palette the sweep reads as sun crossing glass.",
      "It runs just under two seconds and does not bounce. On a phone set to"
      + " reduce motion the sweep does not play and the invitation is simply"
      + " already open, which is the same invitation and none of the theatre.",
    ],
  },
  nameDe: "Vitrail",
};
