import type { CatalogEntry } from "@/catalog/types";

/**
 * Giardino.
 *
 * There is no image layer, so the source design's feeling is carried by
 * colour, type and one ornament rather than by artwork.
 */
export const entry: CatalogEntry = {
  id: "giardino",
  kind: "invitation",
  draft: false,
  theme: {
    dark: false,
    fonts: "classic",
    ornament: "leaf",
    surface: "plaster",
    motion: "veil",
    lettering: "titlecase",
    chrome: "open",
    palette: {
      "bg": "#F1F3EC",
      "surface": "#FAFBF6",
      "ink": "#22301F",
      "muted": "#69775F",
      "accent": "#4F7A4A",
      "accentSoft": "#DDE7D6",
      "rule": "#B7C4AE",
      "onAccent": "#F7FAF2"
    },
  },
  copy: {
    name: "Giardino",
    summary: "Pearl plaster and leaf green: a garden you find by drawing back a curtain.",
    metaTitle: "Giardino: a secret-garden wedding invitation as a link",
    metaDescription: "A pearl and leaf-green digital wedding invitation that begins behind a curtain and opens into a garden. See the Giardino sample, then add your own names.",
    palette: {
      "paper": "#F1F3EC",
      "ink": "#22301F",
      "muted": "#69775F",
      "rule": "#B7C4AE",
      "accent": "#4F7A4A"
    },
    opener: "veil",
    openerName: "The curtain",
    sample: { a: "Noemi", b: "Niall", date: "2027-08-19" },
    spec: {
      paper: "Pearl, pale plaster",
      ink: "Leaf green, deep moss",
      faces: "Classic serif, small sans",
    },
    whatItIs: [
      "Giardino is a garden you are not meant to see at first. The ground is a pale pearl plaster, soft as a wall in shade, and the only saturated colour is a leaf green that comes in at the rules and the ornament.",
      "Nothing is boxed in. Sections open onto the page the way paths open onto lawns, separated by space and a single leaf motif, so that the whole invitation reads as one place you walk through rather than a stack of panels."
    ],
    whoItSuits: [
      "Garden weddings, orangeries, walled gardens, a marquee on a lawn. Couples who like a little theatre and want guests to feel they are being let in on something before they have arrived.",
      "It also suits a spring or late-summer date where flowers will be on the tables, since the green anticipates them without competing. It is quiet enough that a bold bouquet will still be the loudest thing there."
    ],
    typography: [
      "The names are set in a classic serif, in title case, with the contrast and slight formality of a printed programme from an old theatre. Large and light, they sit comfortably against the pale plaster.",
      "Details are in a small sans in moss grey, so the serif only has to do one job. One accent colour and no frames means the typography carries the structure, and it is spaced to do so."
    ],
    howItOpens: [
      "The curtain. Two panels of pale cloth hang across the screen and draw apart from the centre, revealing the invitation behind them as if the garden were on the other side of a stage.",
      "It takes about two seconds and ends cleanly with no bounce. On a device set to reduce motion the curtain is never drawn and the invitation is simply there, complete from the first frame."
    ],
  },
  nameDe: "Giardino",
};
