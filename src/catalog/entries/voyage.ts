import type { CatalogEntry } from "@/catalog/types";

/**
 * Voyage.
 *
 * An atlas reading: parchment ground, survey-green ink and a vermilion route
 * line. The source is travel illustration; this renderer has no artwork, so
 * the translation is the colour of an old map and one stepped glyph that
 * stands for a compass rose reduced to its points.
 */
export const entry: CatalogEntry = {
  id: "voyage",
  kind: "invitation",
  draft: false,
  theme: {
    dark: false,
    fonts: "classic",
    ornament: "deco",
    surface: "none",
    motion: "veil",
    lettering: "tracked-caps",
    chrome: "open",
    palette: {
      bg: "#EDE4CF",
      surface: "#F8F1E0",
      ink: "#25302B",
      muted: "#6B6F5E",
      accent: "#9B2F2A",
      accentSoft: "#E2CFB0",
      rule: "#B9AD90",
      onAccent: "#FFF8EE",
    },
  },
  copy: {
    name: "Voyage",
    summary:
      "Parchment ground, survey-green ink, and a vermilion route line across the page.",
    metaTitle: "Voyage: a map-and-horizon wedding invitation link",
    metaDescription:
      "A parchment digital wedding invitation with survey-green ink and a vermilion route line."
      + " Read the Voyage sample, then put your own two names on it in a minute.",
    palette: {
      paper: "#EDE4CF",
      ink: "#25302B",
      muted: "#6B6F5E",
      rule: "#B9AD90",
      accent: "#9B2F2A",
    },
    opener: "envelope",
    openerName: "The envelope",
    sample: { a: "Greta", b: "Emil", date: "2028-09-13" },
    spec: {
      paper: "Parchment, atlas cream",
      ink: "Survey green, vermilion route",
      faces: "Cormorant Garamond, Jost",
    },
    whatItIs: [
      "Voyage is a page that looks as if it were folded out of an atlas. The"
      + " ground is an aged parchment, the ink is a dark survey green rather"
      + " than black, and the one bright colour is a vermilion, the shade a"
      + " cartographer would use to draw a route.",
      "The layout is open, with no boxes, so the page can run on like a long"
      + " sheet. A stepped glyph in the manner of a compass rose marks the"
      + " breaks, and the vermilion appears wherever the journey continues.",
    ],
    whoItSuits: [
      "Couples who met on the road, who are marrying abroad, or whose guests"
      + " are travelling a long way to be there. A map-coloured page makes the"
      + " journey part of the invitation and not an inconvenience.",
      "It also suits a destination wedding with a weekend of plans, because the"
      + " open layout lets many small details stack down the page without ever"
      + " looking crowded or being cut into separate cards.",
    ],
    typography: [
      "Names are set in spaced capitals in a classical serif, the way a place"
      + " name is lettered across a map. The wide spacing lets long names such"
      + " as a double-barrelled surname sit comfortably on a phone screen.",
      "Practical details use a quiet sans in an olive grey, like the small"
      + " print of a legend. The vermilion is kept for the reply button and the"
      + " date, so those two always stand out against the green and cream.",
    ],
    howItOpens: [
      "The envelope. A parchment envelope sits in the middle of the screen,"
      + " opens, and the invitation unfolds from it like a map being spread on a"
      + " table. The sequence is smooth and the card stays still once it lands.",
      "It lasts about two seconds and plays once. With reduce motion turned on"
      + " the envelope is not shown and the invitation is simply open, with"
      + " the whole page ready to be scrolled from its first line.",
    ],
  },
  nameDe: "Voyage",
};
