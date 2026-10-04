import type { CatalogEntry } from "@/catalog/types";

/**
 * Maison d'Or.
 *
 * White florals, pearl curtains and an ivory bow. The source design is a
 * floral mansion drawn in white; without an image layer the translation is
 * pearl and ivory tones, a marble-cool surface, and one pale gold that stands
 * for the gilding on the house.
 */
export const entry: CatalogEntry = {
  id: "maison-dor",
  kind: "invitation",
  draft: false,
  theme: {
    dark: false,
    fonts: "editorial",
    ornament: "leaf",
    surface: "marble",
    motion: "veil",
    lettering: "titlecase",
    chrome: "framed",
    palette: {
      bg: "#FBF9F4",
      surface: "#FFFFFF",
      ink: "#2B2A28",
      muted: "#7D7A72",
      accent: "#A98A4B",
      accentSoft: "#F1EBDD",
      rule: "#D9D2C0",
      onAccent: "#FFFFFF",
    },
  },
  copy: {
    name: "Maison d'Or",
    summary: "Pearl white, soft marble veining and a thread of pale gold, quietly romantic.",
    metaTitle: "Maison d'Or: a pearl and white-floral wedding invitation",
    metaDescription:
      "A pearl-white digital wedding invitation with pale gold and a leaf motif, soft as a"
      + " garden in June. View the Maison d'Or sample, then set your own names on it.",
    palette: {
      paper: "#FBF9F4",
      ink: "#2B2A28",
      muted: "#7D7A72",
      rule: "#D9D2C0",
      accent: "#A98A4B",
    },
    opener: "veil",
    openerName: "The veil",
    sample: { a: "Delphine", b: "Dmitri", date: "2027-06-24" },
    spec: {
      paper: "Pearl white, marble",
      ink: "Warm charcoal",
      faces: "Playfair Display, Jost",
    },
    whatItIs: [
      "Maison d'Or is the white-on-white invitation. The page is the colour"
      + " of a pearl rather than of paper, a fine marble veining runs behind"
      + " the text, and the single note of colour is a pale gold taken from the"
      + " gilt on an old house.",
      "A leaf motif sits at the head of each section, drawn in the finest rule"
      + " the renderer can manage. The frame around the page is hairline thin,"
      + " so that the whole thing reads as light and a little airy, never heavy.",
    ],
    whoItSuits: [
      "A garden wedding in early summer, a conservatory, a country house with"
      + " white roses on every table. It suits a day that is bright and romantic"
      + " and quietly expensive, with the florist doing most of the talking.",
      "It works well for couples who like their photographs pale. If the dress is"
      + " ivory, the flowers are white and the linen is cream, this page will sit"
      + " in the same palette as everything else the guests are about to see.",
    ],
    typography: [
      "Names are set in Playfair Display, a high-contrast editorial serif whose"
      + " hairlines are very fine against its thick strokes. At display size in"
      + " title case it has the look of a fashion masthead, which is the intention.",
      "Everything functional is Jost in small sizes and a warm grey. Because the"
      + " colour is so restrained, the contrast between the thick and thin"
      + " strokes of the serif is the main decoration on the page.",
    ],
    howItOpens: [
      "The veil. A pale sheet covers the page, and as the guest taps it lifts"
      + " away upward like a curtain being drawn, leaving the names and the"
      + " date behind it. On a pearl palette it feels like a gauze rather than a wipe.",
      "It runs for about two seconds and does not bounce. On a phone with"
      + " reduce-motion switched on the veil never plays and the invitation is"
      + " open from the first frame, with nothing missing from it.",
    ],
  },
  nameDe: "Maison d'Or",
};
