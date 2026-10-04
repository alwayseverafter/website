import type { CatalogEntry } from "@/catalog/types";

/**
 * Hacienda.
 *
 * A rustic estate. The source design draws the venue itself as an illustration;
 * there is no image layer here, so the estate becomes a palette of baked clay,
 * whitewash and olive, a plaster ground, and the woven ornament standing in
 * for wattle, matting and cloth.
 */
export const entry: CatalogEntry = {
  id: "hacienda",
  kind: "invitation",
  draft: false,
  theme: {
    dark: false,
    fonts: "garamond",
    ornament: "weave",
    surface: "plaster",
    motion: "fade-rise",
    lettering: "titlecase",
    chrome: "open",
    palette: {
      bg: "#F3E8D8",
      surface: "#FBF4E8",
      ink: "#3A2A1E",
      muted: "#7A6652",
      accent: "#B4572F",
      accentSoft: "#F0D9C4",
      rule: "#CDB596",
      onAccent: "#FFF8F0",
    },
  },
  copy: {
    name: "Hacienda",
    summary: "Whitewash plaster, baked terracotta and walnut ink, for a day on a country estate.",
    metaTitle: "Hacienda: a rustic estate wedding invitation as a link",
    metaDescription:
      "A warm digital wedding invitation in terracotta and plaster, drawn for a country estate."
      + " Open the Hacienda sample, then swap in your own names and venue in a minute.",
    palette: {
      paper: "#F3E8D8",
      ink: "#3A2A1E",
      muted: "#7A6652",
      rule: "#CDB596",
      accent: "#B4572F",
    },
    opener: "envelope",
    openerName: "The envelope",
    sample: { a: "Clara", b: "Casimir", date: "2027-05-17" },
    spec: {
      paper: "Plaster, sun-warmed",
      ink: "Walnut brown",
      faces: "EB Garamond, Jost",
    },
    whatItIs: [
      "Hacienda is an invitation for a wedding held on land. The ground is a"
      + " sun-warmed plaster with a slight mottle, the text is walnut brown, and"
      + " the accent is the orange-red of fired clay, used sparingly on the names.",
      "The ornament is a small woven band, the kind of pattern you find on"
      + " matting and table linen. It repeats quietly between sections and gives"
      + " the page a handmade edge without trying to draw a building.",
    ],
    whoItSuits: [
      "A finca, a farmhouse, a vineyard courtyard, a walled garden. Anywhere the"
      + " guest list will be eating long tables outdoors and the dress code is"
      + " linen and good shoes rather than black tie.",
      "It is also a kind choice for a multi-day gathering. The earthy palette"
      + " carries across a welcome dinner, a ceremony and a Sunday lunch without"
      + " any of them looking dressed for a different wedding.",
    ],
    typography: [
      "Names and headings are set in EB Garamond, an old-style face with the"
      + " slightly uneven warmth of metal type pressed into paper. In title case"
      + " at display size it feels written rather than manufactured.",
      "Practical details are Jost, small, in a dusty brown a step lighter than"
      + " the ink. The contrast between the two is gentle on purpose: a rustic page"
      + " should look cared for, not styled.",
    ],
    howItOpens: [
      "The envelope. A plain envelope sits on the plaster ground; a tap opens"
      + " the flap and the card slides up and out, then settles in place and the"
      + " page continues below it as an ordinary scroll.",
      "It is a quiet opening of around two seconds with no bounce. Guests who"
      + " have reduce-motion switched on go straight to the card, which holds"
      + " the same names, date and directions as the full version.",
    ],
  },
  nameDe: "Hacienda",
};
