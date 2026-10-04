import type { CatalogEntry } from "@/catalog/types";

/** Fleuron: A floral frame around your date. Save the date. */
export const entry: CatalogEntry = {
  id: "std-fleuron",
  kind: "save-the-date",
  draft: false,
  theme: {
    dark: false,
    fonts: "classic",
    ornament: "leaf",
    surface: "linen",
    motion: "fade-rise",
    lettering: "titlecase",
    chrome: "framed",
    palette: {
      bg: "#F8F1EE",
      surface: "#FFFAF8",
      ink: "#3A2230",
      muted: "#8A6F7A",
      accent: "#B5546F",
      accentSoft: "#F1D9DE",
      rule: "#D9B9C0",
      onAccent: "#FFF8F8",
    },
  },
  copy: {
    name: "Fleuron",
    summary: "Blush linen, aubergine ink and one rose, held inside a framed border of leaves.",
    metaTitle: "Fleuron: a floral-frame save the date as a link",
    metaDescription: "A blush-linen save the date with a leaf border closing in around your date. Read the Fleuron sample, then put two names and a countdown on it in a minute.",
    palette: {
      paper: "#F8F1EE",
      ink: "#3A2230",
      muted: "#8A6F7A",
      rule: "#D9B9C0",
      accent: "#B5546F",
    },
    opener: "envelope",
    openerName: "The envelope",
    sample: { a: "Pilar", b: "Mikkel", date: "2028-09-19" },
    spec: {
      paper: "Blush linen",
      ink: "Aubergine, rose",
      faces: "Cormorant Garamond, Jost",
    },
    whatItIs: [
      "Fleuron is a save the date that holds a single date in a wreath. The ground is blush linen, the ink is a deep aubergine, and the leaf border draws a frame about the middle of the page like a garland laid on a table.",
      "There is nothing else to read. Two names, one date and a countdown sit inside the frame, and the border does the work that a photograph or a venue line would do on a fuller page, which is to tell guests this is a happy thing.",
    ],
    whoItSuits: [
      "Couples announcing a date a year or more ahead, who want the first message to feel like a hand-tied bouquet rather than a notice. It is formal enough for a family that will print the real thing later.",
      "It sits well with a spring or early autumn wedding, and with any couple who want flowers in the message before the florist has been chosen. Rose and aubergine stay warm in either season.",
    ],
    typography: [
      "The names are set in Cormorant Garamond in title case, large and light, so the two of them read as one line of writing inside the frame rather than as a heading.",
      "The date and the countdown use Jost, small and in the muted aubergine. The only saturated note is the rose, which is spent on the border and on the countdown numerals and nowhere else.",
    ],
    howItOpens: [
      "An envelope closes over the frame at first. It lifts at the flap, the card slides up and settles, and the border is the first thing to land before the names fade in beneath it.",
      "The whole motion is a little over two seconds and does not repeat. With reduced motion switched on, the envelope never plays and the save the date is simply there, already open.",
    ],
  },
  nameDe: "Fleuron",
};
