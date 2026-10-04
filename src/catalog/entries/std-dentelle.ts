import type { CatalogEntry } from "@/catalog/types";

/**
 * Dentelle.
 *
 * The editorial lace: the sharpest of the three, and the only one with a
 * seal. Italiana in tracked capitals against one saturated wax red is what
 * separates it from Voile, which is the same material played soft.
 */
export const entry: CatalogEntry = {
  id: "std-dentelle",
  kind: "save-the-date",
  draft: false,
  theme: {
    dark: false,
    fonts: "editorial",
    ornament: "diamond",
    surface: "linen",
    motion: "veil",
    lettering: "tracked-caps",
    chrome: "framed",
    palette: {
      bg: "#F4F1EA",
      surface: "#FFFFFF",
      ink: "#241F1C",
      muted: "#7C756C",
      accent: "#7E2B2B",
      accentSoft: "#EADFD8",
      rule: "#CFC5B6",
      onAccent: "#FFF8F5",
    },
  },
  copy: {
    name: "Dentelle",
    summary: "Ivory linen, tracked capitals, and one wax red seal holding it shut.",
    metaTitle: "Dentelle: a wax seal save the date as a link",
    metaDescription: "An editorial digital save the date on ivory linen, tracked capitals and one wax red seal. See the whole sample, then put your own date on it today.",
    palette: {
      paper: "#F4F1EA",
      ink: "#241F1C",
      muted: "#7C756C",
      rule: "#CFC5B6",
      accent: "#7E2B2B",
    },
    opener: "envelope",
    openerName: "The envelope",
    sample: { a: "Nadia", b: "Kasper", date: "2028-07-05" },
    spec: {
      paper: "Ivory linen",
      ink: "Near black, warm",
      faces: "Italiana, Jost",
    },
    whatItIs: [
      "Dentelle is the editorial one. Ivory linen ground, names in tracked capitals, a framed sheet, and a single wax red diamond where a seal would sit on a physical card.",
      "The red is the only saturated colour and it appears once. Everything else is ink, ground and a hairline, which is what keeps a framed layout from reading as a form rather than as stationery.",
    ],
    whoItSuits: [
      "A couple who want the save the date to look like print rather than like a message, and a wedding whose invitation will be formal when it follows.",
      "It carries a long guest list well, because tracked capitals stay legible at the small sizes a forwarded screenshot ends up being read at.",
    ],
    typography: [
      "Italiana for the names, a high contrast display face whose thin strokes read like an engraved plate, set here in capitals and tracked wide so the hairlines have air around them.",
      "Jost takes the date and the countdown, small and in the warm grey. Two faces, three sizes, one weight of rule, and one spot of red.",
    ],
    howItOpens: [
      "The envelope. A folded sheet unseals and opens outward, and the framed save the date is inside it, which is the gesture the wax seal is promising.",
      "It runs a little under two seconds. On a phone set to reduce motion the envelope does not animate and the save the date is simply already unfolded.",
    ],
  },
  nameDe: "Dentelle",
};
