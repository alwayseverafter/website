import type { CatalogEntry } from "@/catalog/types";

/**
 * Mosaico.
 *
 * There is no image layer, so the source design's feeling is carried by
 * colour, type and one ornament rather than by artwork.
 */
export const entry: CatalogEntry = {
  id: "mosaico",
  kind: "invitation",
  draft: false,
  theme: {
    dark: false,
    fonts: "geometric",
    ornament: "weave",
    surface: "plaster",
    motion: "fade-rise",
    lettering: "titlecase",
    chrome: "open",
    palette: {
      "bg": "#F8EEDC",
      "surface": "#FFF8EA",
      "ink": "#3B2418",
      "muted": "#8A6A55",
      "accent": "#C2542D",
      "accentSoft": "#F4D9BF",
      "rule": "#DDBF9A",
      "onAccent": "#FFF7EC"
    },
  },
  copy: {
    name: "Mosaico",
    summary: "Sun-baked plaster, terracotta and saffron, bordered like a hand-laid mosaic.",
    metaTitle: "Mosaico: a boho mosaic wedding invitation as a link",
    metaDescription: "A sun-baked plaster and terracotta digital wedding invitation bordered like a hand-laid mosaic. See the Mosaico sample, then put your own names on it.",
    palette: {
      "paper": "#F8EEDC",
      "ink": "#3B2418",
      "muted": "#8A6A55",
      "rule": "#DDBF9A",
      "accent": "#C2542D"
    },
    opener: "direct",
    openerName: "Straight in",
    sample: { a: "Siobhan", b: "Raphael", date: "2028-04-22" },
    spec: {
      paper: "Sun-baked plaster, saffron",
      ink: "Terracotta, dark umber",
      faces: "Geometric sans, open forms",
    },
    whatItIs: [
      "Mosaico is a wall in full sun. The ground is a warm saffron-tinted plaster, the accent is a strong terracotta, and the ink is a dark umber, so that the page feels baked and lived in.",
      "The weave ornament repeats in a row of small interlocking marks, like tesserae set in a border, and the layout is open so the colour and the border can breathe. It is a boho invitation with a spine."
    ],
    whoItSuits: [
      "Outdoor weddings in warm weather: a finca, a desert venue, a beach, a field of wildflowers. Couples who want their guests in linen and the invitation to look as if it had been left in the sun.",
      "It also suits a relaxed, personal ceremony with a long guest note, because the open layout gives writing plenty of space and the warm tones make long reading comfortable."
    ],
    typography: [
      "The names are set in a geometric face, in title case, with open round forms and an easy rhythm. It is friendly rather than formal, and holds up well against the warm plaster.",
      "Smaller text uses the same family in a muted clay brown, set with generous leading. A single typeface and one border keep the page from becoming busy, which is the real risk with bohemian styles."
    ],
    howItOpens: [
      "Straight in. There is no cover and no envelope: the invitation is on screen the moment the link opens, with the border and the names already in place, and the page fades up gently over the plaster.",
      "The fade takes under a second. With reduced motion on, even that is skipped. Nothing stands between a guest and the date, which suits an invitation that wants to feel like a warm hello."
    ],
  },
  nameDe: "Mosaico",
};
