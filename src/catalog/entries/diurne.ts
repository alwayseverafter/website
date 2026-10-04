import type { CatalogEntry } from "@/catalog/types";

/**
 * Diurne.
 *
 * Day into night. The source design moves from a daylit scene to a night one
 * (the demo page gave no detail, so this follows the brief's direction). This
 * renderer cannot animate a sky, so the translation is a single dark ground,
 * midnight blue with a low sun's gold standing for the light that remains, and
 * wide-tracked capitals that behave like a horizon line.
 */
export const entry: CatalogEntry = {
  id: "diurne",
  kind: "invitation",
  draft: false,
  theme: {
    dark: true,
    fonts: "geometric",
    ornament: "none",
    surface: "none",
    motion: "fade-rise",
    lettering: "tracked-caps",
    chrome: "open",
    palette: {
      bg: "#141B33",
      surface: "#1D2646",
      ink: "#F1EBDD",
      muted: "#A3AAC4",
      accent: "#E8B04A",
      accentSoft: "#2C3560",
      rule: "#3F4A7A",
      onAccent: "#141B33",
    },
  },
  copy: {
    name: "Diurne",
    summary: "Midnight blue with one low-sun gold, made for a ceremony that ends after dark.",
    metaTitle: "Diurne: a day-to-night wedding invitation as a link",
    metaDescription:
      "A midnight-blue digital wedding invitation with a single sun-gold accent, for a day"
      + " that runs from afternoon to evening. See the Diurne sample, then add your names.",
    palette: {
      paper: "#141B33",
      ink: "#F1EBDD",
      muted: "#A3AAC4",
      rule: "#3F4A7A",
      accent: "#E8B04A",
    },
    opener: "direct",
    openerName: "Straight in",
    sample: { a: "Beatriz", b: "Bruno", date: "2027-04-10" },
    spec: {
      paper: "Midnight blue",
      ink: "Warm ivory",
      faces: "Jost, tracked capitals",
    },
    whatItIs: [
      "Diurne is built for a wedding that changes light halfway through. The"
      + " page is a deep midnight blue, the text is a warm ivory, and the only"
      + " warm colour is a low-sun gold that turns up on the date and the rules.",
      "There is no frame and no ornament. The layout is open, with wide"
      + " margins and long gaps between sections, so reading down the page feels"
      + " a little like watching an afternoon go by and the evening arrive.",
    ],
    whoItSuits: [
      "Ceremonies at four and dinner at nine. A vineyard, a rooftop, a terrace"
      + " above a harbour: any venue where guests will arrive in daylight and leave"
      + " under lamps, and where the evening is the longer half of the day.",
      "It also suits couples who find a pale invitation a little too bright for"
      + " the party they are planning. A dark page reads as an evening already"
      + " begun, and on a phone it is easier on the eyes at night.",
    ],
    typography: [
      "Everything is set in Jost, a geometric sans with round bowls and an even"
      + " colour. The names go in tracked capitals, spaced wide enough that each"
      + " letter stands alone against the dark like a lit window.",
      "Body text is the same face at a quiet size, in a blue grey that sits"
      + " a step behind the ivory. Using one family keeps the page calm, and"
      + " the weight and spacing do the work that a second face would otherwise do.",
    ],
    howItOpens: [
      "Straight in. There is no cover to lift: the link opens on the names and"
      + " the date, and the text fades up into place from just below where it"
      + " finally rests, as if the lights were coming up on a stage.",
      "It is a short motion and it plays once. With reduced motion switched on"
      + " the text is already in place when the page loads, and a guest on a slow"
      + " connection loses nothing, because the wording is there before anything moves.",
    ],
  },
  nameDe: "Diurne",
};
