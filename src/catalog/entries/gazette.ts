import type { CatalogEntry } from "@/catalog/types";

/**
 * Gazette.
 *
 * Newsprint white, black rules, a single cover-story red. Translated into colour, type and one ornament, since this renderer
 * has no image layer.
 */
export const entry: CatalogEntry = {
  id: "gazette",
  kind: "invitation",
  draft: false,
  theme: {
    dark: false,
    fonts: "editorial",
    ornament: "none",
    surface: "none",
    motion: "none",
    lettering: "tracked-caps",
    chrome: "framed",
    palette: {
      bg: "#F6F6F2",
      surface: "#FFFFFF",
      ink: "#141414",
      muted: "#6A6A66",
      accent: "#C41230",
      accentSoft: "#F1D4D8",
      rule: "#1B1B1B",
      onAccent: "#FFFFFF",
    },
  },
  copy: {
    name: "Gazette",
    summary: "Newsprint white, hard black rules and one cover-story red, set like a magazine.",
    metaTitle: "Gazette: a fashion-magazine wedding invitation as a link",
    metaDescription: "A digital wedding invitation set like a fashion magazine: newsprint white, black rules and cover red. Read the Gazette sample, then put your names on the cover.",
    palette: {
      paper: "#F6F6F2",
      ink: "#141414",
      muted: "#6A6A66",
      rule: "#1B1B1B",
      accent: "#C41230",
    },
    opener: "direct",
    openerName: "Direct",
    sample: { a: "Yasmin", b: "Wolfram", date: "2028-09-07" },
    spec: {
      paper: "Newsprint white",
      ink: "Black, cover red",
      faces: "Editorial display, Jost",
    },
    whatItIs: [
      "Gazette treats the wedding as a cover story. The ground is a flat newsprint white, the ink a hard black, the rules are black as well, and one cover red appears on the date and nowhere else, like a masthead stripe.",
      "There is no ornament and no texture, because a magazine page does not need them. The framed sections behave like columns and boxed pull quotes, so that the information reads as editorial layout rather than as decoration.",
    ],
    whoItSuits: [
      "Couples with a strong sense of style who would like the invitation to look like something from a good magazine, not a wedding site. Think city venues, galleries, and rooms with concrete and good lighting.",
      "It suits a fashion-literate, quick-reading guest list. The structure is plain, the hierarchy is loud and everything is exactly where the eye expects it to be.",
    ],
    typography: [
      "Names are set in the editorial display face in spaced capitals, wide and confident, like a headline across a cover. The tracking is generous so that even long names remain legible at size.",
      "The practical lines use a small clean sans in grey, always in short and tidy blocks. The contrast between a loud headline and a quiet caption is what makes the page read as a magazine and not a form.",
    ],
    howItOpens: [
      "There is no opener. The page loads and the cover is simply there, like opening a magazine at its first spread. The decision is deliberate: editorial design does not make you wait.",
      "Because nothing moves, nothing changes with reduced motion either, and the page works on the slowest connection with the same impact.",
    ],
  },
  nameDe: "Gazette",
};
