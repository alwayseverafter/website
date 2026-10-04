import type { CatalogEntry } from "@/catalog/types";

/**
 * Papier.
 *
 * There is no image layer, so the source design's feeling is carried by
 * colour, type and one ornament rather than by artwork.
 */
export const entry: CatalogEntry = {
  id: "papier",
  kind: "invitation",
  draft: false,
  theme: {
    dark: false,
    fonts: "geometric",
    ornament: "tile",
    surface: "grain",
    motion: "fade-rise",
    lettering: "titlecase",
    chrome: "framed",
    palette: {
      "bg": "#F6EEE2",
      "surface": "#FFFAF1",
      "ink": "#33261C",
      "muted": "#85705E",
      "accent": "#B4673C",
      "accentSoft": "#F0DCC8",
      "rule": "#D3BFA6",
      "onAccent": "#FFF8F0"
    },
  },
  copy: {
    name: "Papier",
    summary: "Kraft cream, terracotta and a soft paper grain, cut and folded by hand.",
    metaTitle: "Papier: a cut-paper craft wedding invitation as a link",
    metaDescription: "A warm kraft-cream and terracotta digital wedding invitation with a soft paper grain, as if cut and folded by hand. See the Papier sample, then add your names.",
    palette: {
      "paper": "#F6EEE2",
      "ink": "#33261C",
      "muted": "#85705E",
      "rule": "#D3BFA6",
      "accent": "#B4673C"
    },
    opener: "envelope",
    openerName: "The paper envelope",
    sample: { a: "Paloma", b: "Pierre", date: "2028-10-08" },
    spec: {
      paper: "Kraft cream, paper grain",
      ink: "Terracotta, deep brown",
      faces: "Geometric sans, rounded forms",
    },
    whatItIs: [
      "Papier is an invitation that looks like it was cut with scissors. The ground is a warm kraft cream with a faint grain, the accent is a baked terracotta, and the ink is a brown so dark it almost reads as black.",
      "Sections sit in framed panels, like layers of card lifted off the sheet beneath. The tile ornament is a row of small cut shapes, and it is the one decorative gesture in a design that is otherwise plain on purpose."
    ],
    whoItSuits: [
      "Couples who make things: a studio wedding, a barn, a village hall dressed with paper garlands. It is for people who would rather their invitation looked handmade than expensive.",
      "It also works for a daytime, relaxed celebration with a younger or more creative guest list. The warmth is friendly and the geometry is tidy, so it feels crafted without ever feeling fussy."
    ],
    typography: [
      "The names are set in a geometric face, in title case, with round bowls and even strokes like letters cut from a template. They read clearly at any size and keep the tone modern and approachable.",
      "Practical details are set in the same family at a small size, in a muted brown. Using one typeface throughout keeps it looking like a single sheet, and the colour does the sorting instead."
    ],
    howItOpens: [
      "The paper envelope. A kraft envelope sits on the screen and a tap folds the flap back, letting the card slide out and settle, as if you had opened it on a kitchen table.",
      "The movement takes just under two seconds and stops without bounce. With reduced motion switched on, the envelope never moves and the invitation is already out of it and open for reading."
    ],
  },
  nameDe: "Papier",
};
