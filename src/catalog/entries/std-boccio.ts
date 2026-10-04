import type { CatalogEntry } from "@/catalog/types";

/** Boccio: Delicate florals in bloom. Save the date. */
export const entry: CatalogEntry = {
  id: "std-boccio",
  kind: "save-the-date",
  draft: false,
  theme: {
    dark: false,
    fonts: "garamond",
    ornament: "none",
    surface: "grain",
    motion: "veil",
    lettering: "titlecase",
    chrome: "open",
    palette: {
      bg: "#F5F2F8",
      surface: "#FDFBFE",
      ink: "#2E2838",
      muted: "#7B7285",
      accent: "#7B5C9E",
      accentSoft: "#E5DDEE",
      rule: "#C7BAD6",
      onAccent: "#FBF8FF",
    },
  },
  copy: {
    name: "Boccio",
    summary: "Wisteria-pale paper and a soft lilac, as though the date were just coming into bud.",
    metaTitle: "Boccio: a soft lilac save the date as a link",
    metaDescription: "A wisteria-pale save the date in soft lilac that feels like a bud about to open. Read the Boccio sample, then put your own names and countdown on it in a minute.",
    palette: {
      paper: "#F5F2F8",
      ink: "#2E2838",
      muted: "#7B7285",
      rule: "#C7BAD6",
      accent: "#7B5C9E",
    },
    opener: "veil",
    openerName: "The veil",
    sample: { a: "Saskia", b: "Otto", date: "2029-03-07" },
    spec: {
      paper: "Pale wisteria",
      ink: "Plum, lilac",
      faces: "Cormorant Garamond",
    },
    whatItIs: [
      "Boccio is the sense of a bud on the verge of opening. The paper has the faintest lilac cast, the ink is a dark plum, and a soft violet accent is the one colour that is ever allowed to bloom.",
      "Unlike a framed floral, this page has no border at all. The space around the names is open, so the feeling of flowers comes from colour and softness, and nothing is drawn to hold the date in.",
    ],
    whoItSuits: [
      "Couples with a garden or orchard wedding in view, or a spring date, who want a message that feels gentle and a little feminine without being sugary. It is the quieter way to say flowers.",
      "It also suits a celebration still undecided in its details. Because there is no frame and no motif to commit to, the lilac fits a barn, a courtyard or a city hall with equal ease.",
    ],
    typography: [
      "Cormorant Garamond carries the whole page, names in title case at a generous size, with its fine strokes and open curves doing the work that a floral illustration would do elsewhere.",
      "The date and countdown stay in the same face, smaller and in a dusty violet-grey. Using one family throughout keeps the page soft, and the only contrast is the lilac against the plum.",
    ],
    howItOpens: [
      "A pale veil lies over the page and lifts slowly from the bottom, the way a petal curls back. The names appear first, then the date, and the countdown comes in last.",
      "It takes about two seconds and runs once. Where reduced motion is on, the veil is skipped altogether and the save the date is already in bloom when the link opens.",
    ],
  },
  nameDe: "Boccio",
};
