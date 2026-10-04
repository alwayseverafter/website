import type { CatalogEntry } from "@/catalog/types";

/**
 * Caramelo.
 *
 * A confectioner's reading: warm caramel paper, burnt-sugar ink and a pale
 * cream for the icing. The source is cakes and cherubs; this renderer has no
 * artwork, so the translation is the colour of a sweet shop window and one
 * faceted glyph standing for a sugar crystal.
 */
export const entry: CatalogEntry = {
  id: "caramelo",
  kind: "invitation",
  draft: false,
  theme: {
    dark: false,
    fonts: "classic",
    ornament: "diamond",
    surface: "grain",
    motion: "fade-rise",
    lettering: "titlecase",
    chrome: "framed",
    palette: {
      bg: "#F6E7D0",
      surface: "#FFF4E3",
      ink: "#3B2417",
      muted: "#8A6548",
      accent: "#A8581C",
      accentSoft: "#EFCFA3",
      rule: "#D2AE82",
      onAccent: "#FFF6EA",
    },
  },
  copy: {
    name: "Caramelo",
    summary:
      "Warm caramel paper, burnt-sugar brown ink, and a cream that reads as icing.",
    metaTitle: "Caramelo: a caramel and sugar wedding invitation link",
    metaDescription:
      "A caramel-toned digital wedding invitation with burnt-sugar brown and cream icing tones."
      + " Read the Caramelo sample, then add your own names and date in a minute.",
    palette: {
      paper: "#F6E7D0",
      ink: "#3B2417",
      muted: "#8A6548",
      rule: "#D2AE82",
      accent: "#A8581C",
    },
    opener: "foil",
    openerName: "The foil",
    sample: { a: "Esther", b: "Cormac", date: "2028-07-24" },
    spec: {
      paper: "Caramel cream, fine grain",
      ink: "Burnt-sugar brown",
      faces: "Cormorant Garamond, Jost",
    },
    whatItIs: [
      "Caramelo is the colour of a pastry counter at four in the afternoon. The"
      + " paper is a caramel cream, the ink is brown cooked almost to bitterness,"
      + " and the accent is a deeper amber that appears wherever the page asks"
      + " the guest to do something.",
      "A fine grain sits in the paper so it feels pressed rather than printed,"
      + " and a thin frame closes each section like the edge of a gift box."
      + " A single faceted glyph, a sugar crystal, marks the breaks between them.",
    ],
    whoItSuits: [
      "Couples whose wedding has a dessert table as a centrepiece, a bakery"
      + " in the family, or a taste for warm interiors with brass and candle"
      + " light. It is a sweet palette without being a pink one.",
      "It is also kind to older guests. The contrast between brown ink and"
      + " cream paper is high, so it stays easy to read while still feeling like"
      + " a romantic keepsake and not a notice.",
    ],
    typography: [
      "Names are set in a light old-style serif at a large size, in title case,"
      + " which gives them a handwritten warmth without using script. The curves"
      + " of the face echo the swirls of piped icing on a cake.",
      "Secondary text is a plain sans in a softer brown, and amber is saved for"
      + " buttons and the date. Two faces and three tones of brown is the whole"
      + " system, so the page stays tidy however much detail the couple adds.",
    ],
    howItOpens: [
      "The foil. A shining sheet covers the page and a band of light crosses it"
      + " once before it clears, like the glaze catching light on a fresh"
      + " pastry. On this palette the sweep reads as warm gold.",
      "It runs for under two seconds and does not repeat. For guests who have"
      + " reduce motion switched on there is no sheet or sweep, and the"
      + " invitation is already open and ready to read.",
    ],
  },
  nameDe: "Caramelo",
};
