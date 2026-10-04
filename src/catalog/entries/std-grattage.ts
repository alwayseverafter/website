import type { CatalogEntry } from "@/catalog/types";

/**
 * Grattage.
 *
 * The scratch card, reduced to its one honest gesture: a silver layer and
 * the moment it clears. No photograph is invented, because the renderer
 * has no image layer to put one in.
 */
export const entry: CatalogEntry = {
  id: "std-grattage",
  kind: "save-the-date",
  draft: false,
  theme: {
    dark: false,
    fonts: "geometric",
    ornament: "none",
    surface: "none",
    motion: "fade-rise",
    lettering: "tracked-caps",
    chrome: "open",
    palette: {
      bg: "#EDEEF0",
      surface: "#FFFFFF",
      ink: "#1E2226",
      muted: "#6B7279",
      accent: "#8C949C",
      accentSoft: "#DEE1E4",
      rule: "#C3C8CD",
      onAccent: "#FFFFFF",
    },
  },
  copy: {
    name: "Grattage",
    summary: "Scratch silver over a cool grey ground, cleared by a band of light.",
    metaTitle: "Grattage: a scratch-panel save the date as a link",
    metaDescription: "A silver scratch-panel digital save the date. One band of light clears the foil to leave two names and a date. See the sample and send yours today.",
    palette: {
      paper: "#EDEEF0",
      ink: "#1E2226",
      muted: "#6B7279",
      rule: "#C3C8CD",
      accent: "#8C949C",
    },
    opener: "foil",
    openerName: "The foil",
    sample: { a: "Iris", b: "Gideon", date: "2028-03-02" },
    spec: {
      paper: "Cool silver grey",
      ink: "Near black, cool",
      faces: "Jost throughout",
    },
    whatItIs: [
      "Grattage is a save the date behind a silver panel. The ground is a cool grey, the panel is a lighter silver over it, and when it clears there are two names, a date and the days remaining. That is the entire content.",
      "The source design hides a photograph under the foil. This one hides nothing but the date, which is the only thing a save the date actually withholds, and it is a better joke for being true.",
    ],
    whoItSuits: [
      "Couples who find a formal save the date too solemn for something sent a year out, and who would rather their guests smile at a phone than file a card.",
      "It also suits a wedding in a modern venue, concrete or glass, where the silver and the tracked capitals will look like the building rather than against it.",
    ],
    typography: [
      "Jost throughout, uppercase and tracked wide. A geometric sans is the only face here that reads as a machined surface rather than as paper, which is what the silver panel needs to sit on.",
      "The names are set larger than everything else but at the same weight, so the hierarchy comes from size and space alone and the page holds one tone of voice.",
    ],
    howItOpens: [
      "The foil. A silver sheet covers the save the date and a single band of light travels across it, left to right, before the sheet clears and the date is behind it.",
      "It runs just under two seconds and does not bounce. On a phone set to reduce motion the band does not play and the date is simply already visible, which loses the theatre and none of the information.",
    ],
  },
  nameDe: "Grattage",
};
