import type { CatalogEntry } from "@/catalog/types";

/**
 * Lario.
 *
 * There is no image layer, so the source design's feeling is carried by
 * colour, type and one ornament rather than by artwork.
 */
export const entry: CatalogEntry = {
  id: "lario",
  kind: "invitation",
  draft: false,
  theme: {
    dark: false,
    fonts: "garamond",
    ornament: "tile",
    surface: "linen",
    motion: "fade-rise",
    lettering: "titlecase",
    chrome: "framed",
    palette: {
      "bg": "#F4EFE6",
      "surface": "#FBF8F1",
      "ink": "#1F2B33",
      "muted": "#62737A",
      "accent": "#3F6E7C",
      "accentSoft": "#D9E5E6",
      "rule": "#B5C4C4",
      "onAccent": "#F8FBFB"
    },
  },
  copy: {
    name: "Lario",
    summary: "Warm linen and lake teal, framed like an arcade on the water at Como.",
    metaTitle: "Lario: an Italian lakeside wedding invitation as a link",
    metaDescription: "A linen-toned digital wedding invitation in lake teal, framed like an arcade above still water. Read the Lario sample, then put your own names on it.",
    palette: {
      "paper": "#F4EFE6",
      "ink": "#1F2B33",
      "muted": "#62737A",
      "rule": "#B5C4C4",
      "accent": "#3F6E7C"
    },
    opener: "envelope",
    openerName: "The envelope",
    sample: { a: "Marta", b: "Mateo", date: "2027-07-12" },
    spec: {
      paper: "Linen, warm cream",
      ink: "Lake teal, deep slate",
      faces: "Old-style serif, small sans",
    },
    whatItIs: [
      "Lario takes its name from the old word for Lake Como, and the page is built the way a lakeside terrace is: cream linen underfoot, a band of teal water beyond it, and deep slate for anything that needs to be read.",
      "Every section sits inside a hairline frame, and the tile ornament repeats as a quiet row of arches between them. It is the embroidery of the original idea, reduced to stitches of colour and line."
    ],
    whoItSuits: [
      "Villa weddings, lakeside terraces, a long lunch under pergolas. Couples marrying somewhere with water in view, or wishing they were, and who want the invitation to feel like early summer in Italy.",
      "It also works for a destination wedding with guests flying in, since the palette is calm and the tone is welcoming rather than formal. Nobody needs a dress code explained to them by a page this gentle."
    ],
    typography: [
      "The names are set in a garamond, in title case and generous in size. The face is old and calm, with the slightly uneven warmth of printed linen paper, so the names read like an inscription over a doorway.",
      "Details sit beneath in a small sans, in the slate grey that stays a step behind the ink. One serif, one sans, one teal accent: the discipline is what keeps the arcade feel from tipping into decoration."
    ],
    howItOpens: [
      "The envelope. A cream envelope sits in the middle of the screen and a tap lifts the flap, drawing the invitation out of it as a folded card would come out of a letter on a hotel desk.",
      "It takes a little under two seconds and settles without bounce. With reduced motion on, the envelope is skipped and the invitation is already open, with exactly the same words in the same order."
    ],
  },
  nameDe: "Lario",
};
