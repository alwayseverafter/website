import type { CatalogEntry } from "@/catalog/types";

/** Jardin: A garden banquet under beaded drapes. Save the date. */
export const entry: CatalogEntry = {
  id: "std-jardin",
  kind: "save-the-date",
  draft: false,
  theme: {
    dark: false,
    fonts: "editorial",
    ornament: "tile",
    surface: "linen",
    motion: "fade-rise",
    lettering: "titlecase",
    chrome: "open",
    palette: {
      bg: "#F1E9DF",
      surface: "#FAF5EC",
      ink: "#33261D",
      muted: "#85705F",
      accent: "#9A4F2E",
      accentSoft: "#EBD3C2",
      rule: "#D1B9A3",
      onAccent: "#FFF6EE",
    },
  },
  copy: {
    name: "Jardin",
    summary: "Warm linen, walnut ink and terracotta, the look of a long table under the evening trees.",
    metaTitle: "Jardin: a terracotta garden-banquet save the date link",
    metaDescription: "A warm-linen save the date in walnut and terracotta, like a long garden table at dusk. Read the Jardin sample, then add your two names and countdown in a minute.",
    palette: {
      paper: "#F1E9DF",
      ink: "#33261D",
      muted: "#85705F",
      rule: "#D1B9A3",
      accent: "#9A4F2E",
    },
    opener: "envelope",
    openerName: "The envelope",
    sample: { a: "Vera", b: "Soren", date: "2029-06-03" },
    spec: {
      paper: "Warm linen, clay",
      ink: "Walnut, terracotta",
      faces: "Italiana, Jost",
    },
    whatItIs: [
      "Jardin is a supper laid out under the trees. The ground is warm linen, the ink is walnut brown, and terracotta stands in for clay pots, bread and the last of the daylight.",
      "It keeps to the brief of a save the date and gives nothing away but a pair of names, a date and a countdown. A small tile pattern at the foot is the table runner, and nothing else is set.",
    ],
    whoItSuits: [
      "Couples planning a long lunch or dinner outdoors, in a vineyard, a farm or a walled garden, who would rather feel eating and talking than flowers.",
      "It suits a summer date and a relaxed crowd. The earth colours feel lived in, so the message sounds like an invitation to a good table rather than a formal occasion.",
    ],
    typography: [
      "Names are set in Italiana in title case, thin and elegant, which gives the earthy palette a little polish. The contrast between the fine lettering and the warm ground is deliberate.",
      "Jost carries the date and countdown, small and in a clay-grey tone. Terracotta is used for the tile row and the countdown numerals, which gives the page its single warm accent.",
    ],
    howItOpens: [
      "An envelope in the same linen rests on the page. It opens at the flap, the card rises out of it, and the names settle in first, followed by the date and the countdown.",
      "The motion is gentle and runs once, in about two seconds. If reduced motion is on, the envelope is already open when the link loads and the card is simply there.",
    ],
  },
  nameDe: "Jardin",
};
