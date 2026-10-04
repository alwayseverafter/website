import type { CatalogEntry } from "@/catalog/types";

/** Oasis: Beaded curtains, palms and a fountain. Save the date. */
export const entry: CatalogEntry = {
  id: "std-oasis",
  kind: "save-the-date",
  draft: false,
  theme: {
    dark: false,
    fonts: "classic",
    ornament: "deco",
    surface: "marble",
    motion: "veil",
    lettering: "tracked-caps",
    chrome: "framed",
    palette: {
      bg: "#F3EBDD",
      surface: "#FBF6EA",
      ink: "#12413F",
      muted: "#5E7F7A",
      accent: "#A3741A",
      accentSoft: "#EBD9A8",
      rule: "#CDB57A",
      onAccent: "#FFF8E8",
    },
  },
  copy: {
    name: "Oasis",
    summary: "Sandstone marble, deep fountain teal and a regal gold, like a palace courtyard at noon.",
    metaTitle: "Oasis: a regal teal and gold save the date as a link",
    metaDescription: "A sandstone-marble save the date in deep teal and gold, grand as a courtyard with a fountain. Read the Oasis sample, then add your names and countdown in a minute.",
    palette: {
      paper: "#F3EBDD",
      ink: "#12413F",
      muted: "#5E7F7A",
      rule: "#CDB57A",
      accent: "#A3741A",
    },
    opener: "veil",
    openerName: "The veil",
    sample: { a: "Ursula", b: "Rafael", date: "2029-05-21" },
    spec: {
      paper: "Sandstone, marble",
      ink: "Deep teal, gold",
      faces: "Cormorant Garamond, Jost",
    },
    whatItIs: [
      "Oasis is a palace courtyard reduced to colour. The ground is sandstone with a marble veining, the ink is a deep fountain teal, and the gold in the rule and the numerals belongs to a regal room.",
      "It is formal and a little theatrical, and it still says almost nothing. Two names, one date and a countdown stand in a framed panel, which is all the grandeur a save the date needs.",
    ],
    whoItSuits: [
      "Couples marrying somewhere warm and grand, such as a hotel with a courtyard, a palazzo or a hall with a fountain, who want the announcement to promise an occasion.",
      "It suits a black-tie guest list and an evening in summer. The teal and gold are decisive, so couples who like a clear, rich colour will find it easy to commit to.",
    ],
    typography: [
      "The names are set in tracked capitals in Cormorant Garamond with wide letter space, which gives them the air of an inscription cut above a doorway.",
      "Jost sets the date and the countdown small, in a grey teal behind the ink. A geometric deco border in gold closes the panel, and that is the only decoration on the page.",
    ],
    howItOpens: [
      "A veil of beaded light hangs across the panel, and it parts from the centre like a curtain drawn aside. The framed names are behind it, and the gold rule draws in last.",
      "The parting lasts a little under two seconds. With reduced motion on, the curtain never moves and the panel is simply showing when the link opens.",
    ],
  },
  nameDe: "Oasis",
};
