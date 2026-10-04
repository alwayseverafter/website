import type { CatalogEntry } from "@/catalog/types";

/**
 * Regence.
 *
 * There is no image layer, so the source design's feeling is carried by
 * colour, type and one ornament rather than by artwork.
 */
export const entry: CatalogEntry = {
  id: "regence",
  kind: "invitation",
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
      "bg": "#F5ECEA",
      "surface": "#FFF9F6",
      "ink": "#3A2530",
      "muted": "#82666F",
      "accent": "#B08A4A",
      "accentSoft": "#F1E2D4",
      "rule": "#D8C0BA",
      "onAccent": "#FFFBF3"
    },
  },
  copy: {
    name: "Regence",
    summary: "Powdered rose and gilt on pale marble, in the manner of a Regency drawing room.",
    metaTitle: "Regence: a Regency-era romance wedding invitation link",
    metaDescription: "A powdered-rose and gilt digital wedding invitation on pale marble, in the manner of a Regency drawing room. See the Regence sample and add your names.",
    palette: {
      "paper": "#F5ECEA",
      "ink": "#3A2530",
      "muted": "#82666F",
      "rule": "#D8C0BA",
      "accent": "#B08A4A"
    },
    opener: "foil",
    openerName: "The gilt foil",
    sample: { a: "Rosa", b: "Quentin", date: "2028-03-15" },
    spec: {
      paper: "Pale marble, powdered rose",
      ink: "Antique gilt, deep plum ink",
      faces: "Classic serif, tracked capitals",
    },
    whatItIs: [
      "Regence is a drawing room with the candles lit. The ground is a powdered rose over pale marble, the accent is a muted antique gold, and the ink is a deep plum, so the page feels warm rather than stark.",
      "Each section is framed, as a portrait is, and the deco ornament adds a small row of repeated lines that suggests a cornice. The effect is period, but tidy enough to be read on a phone."
    ],
    whoItSuits: [
      "Country houses, assembly rooms, a ball after the ceremony. Couples who love costume drama and want the invitation to set up a certain kind of evening, with dancing in it.",
      "It is also a good fit for a spring wedding with a formal guest list, since the rose and gold are flattering and the tracked capitals carry a sense of occasion without being stiff."
    ],
    typography: [
      "The names are set in a classic serif in tracked capitals, widely spaced like an engraved calling card. The serif has the crisp contrast of period printing and stays sharp on marble.",
      "Everything else is a small, muted plum sans at a distance from the names, so the gilt rules are the only decoration. Capitals, serif and gold: three decisions, repeated until they feel like etiquette."
    ],
    howItOpens: [
      "The gilt foil. A sheet of pale gold covers the invitation, and a band of light passes across it before the sheet lifts away, like a candle moving along a mirror.",
      "It lasts just under two seconds and ends without bounce. When reduced motion is on, the foil is skipped and the invitation is open straight away, with the same words and the same order."
    ],
  },
  nameDe: "Regence",
};
