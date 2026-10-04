import type { CatalogEntry } from "@/catalog/types";

/**
 * Cadence.
 *
 * A cheerful cream page with a single tomato-red accent, set loose and open. Translated into colour, type and one ornament, since this renderer
 * has no image layer.
 */
export const entry: CatalogEntry = {
  id: "cadence",
  kind: "invitation",
  draft: false,
  theme: {
    dark: false,
    fonts: "geometric",
    ornament: "none",
    surface: "none",
    motion: "fade-rise",
    lettering: "titlecase",
    chrome: "open",
    palette: {
      bg: "#FCF2E6",
      surface: "#FFFAF3",
      ink: "#2B2A33",
      muted: "#6E6A72",
      accent: "#D4502A",
      accentSoft: "#F8DCCB",
      rule: "#E5C8B0",
      onAccent: "#FFFAF3",
    },
  },
  copy: {
    name: "Cadence",
    summary: "Warm cream, charcoal ink and one tomato-red accent, light on its feet.",
    metaTitle: "Cadence: a playful hand-drawn style wedding invitation",
    metaDescription: "A cheerful digital wedding invitation in cream, charcoal and tomato red, made for couples who laugh easily. Read the Cadence sample, then add your own names.",
    palette: {
      paper: "#FCF2E6",
      ink: "#2B2A33",
      muted: "#6E6A72",
      rule: "#E5C8B0",
      accent: "#D4502A",
    },
    opener: "envelope",
    openerName: "The envelope",
    sample: { a: "Teresa", b: "Stefan", date: "2028-05-04" },
    spec: {
      paper: "Cream, sun-warmed",
      ink: "Charcoal, tomato red",
      faces: "Jost, round and friendly",
    },
    whatItIs: [
      "Cadence is the invitation for a couple who would rather make people smile than make them whisper. The ground is a warm cream, the ink a soft charcoal rather than black, and a single tomato red turns up on the rule and the date like a mark made with a marker pen.",
      "The source design leans on hand-drawn illustration and monograms. This renderer has no drawing layer, so the playfulness is carried by spacing, round geometric letterforms and the lack of a frame: nothing is boxed in, and each section simply arrives in its own time.",
    ],
    whoItSuits: [
      "A garden party, a long lunch, a restaurant taken over for the evening. Couples who want the invitation to sound like them at their funniest, and who would be uncomfortable with anything that looked like a certificate.",
      "It suits a relaxed guest list too, where aunts and old friends read the page on a phone between other things. The light tone gives them an easy start and the practical details stay plainly legible.",
    ],
    typography: [
      "Names are set in a geometric sans in title case, large and round, with generous leading so the two lines breathe. The shapes are simple circles and straight stems, which is as close to a hand-drawn monogram as type alone can come.",
      "Details sit in the same family at a smaller size, in the muted grey-violet. One typeface in two sizes keeps the page light, and the tomato accent is reserved for the few words that should be found first.",
    ],
    howItOpens: [
      "An envelope sits on the screen and lifts open when the guest taps it, with the page rising out of it and settling into place. It is the most familiar gesture in the catalogue, and the one that suits this style best.",
      "The whole thing takes about two seconds. For guests who have reduced motion switched on, the envelope step is skipped and the page is already showing, with nothing lost but the flourish.",
    ],
  },
  nameDe: "Cadence",
};
