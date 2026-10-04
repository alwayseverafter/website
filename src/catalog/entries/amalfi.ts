import type { CatalogEntry } from "@/catalog/types";

/**
 * Amalfi.
 *
 * Lemon-washed plaster, ceramic blue tiles and a cobalt note. Translated into colour, type and one ornament, since this renderer
 * has no image layer.
 */
export const entry: CatalogEntry = {
  id: "amalfi",
  kind: "invitation",
  draft: false,
  theme: {
    dark: false,
    fonts: "classic",
    ornament: "tile",
    surface: "plaster",
    motion: "veil",
    lettering: "titlecase",
    chrome: "framed",
    palette: {
      bg: "#FBF3D3",
      surface: "#FFFBEA",
      ink: "#17304D",
      muted: "#5F6F82",
      accent: "#1C5DA6",
      accentSoft: "#D9E6F3",
      rule: "#C9B97F",
      onAccent: "#FFFBEA",
    },
  },
  copy: {
    name: "Amalfi",
    summary: "Lemon-washed plaster, majolica navy and cobalt, with a ceramic tile motif.",
    metaTitle: "Amalfi: a Mediterranean Italian wedding invitation as a link",
    metaDescription: "A digital wedding invitation in lemon plaster, majolica navy and cobalt, with a ceramic tile motif. Read the Amalfi sample, then put your two names on the page.",
    palette: {
      paper: "#FBF3D3",
      ink: "#17304D",
      muted: "#5F6F82",
      rule: "#C9B97F",
      accent: "#1C5DA6",
    },
    opener: "envelope",
    openerName: "The envelope",
    sample: { a: "Amara", b: "Yannick", date: "2028-03-21" },
    spec: {
      paper: "Lemon plaster",
      ink: "Majolica navy, cobalt",
      faces: "Cormorant Garamond, Jost",
    },
    whatItIs: [
      "Amalfi is a cliffside town in colour. The ground is the yellow of lemon-washed plaster, the ink is a majolica navy, and the cobalt accent is the glaze on a ceramic tile, the one saturated blue on a warm wall.",
      "The tile ornament repeats as a small geometric border, and the framed sections feel like panels set into a wall. The source design shows hand-painted tiles and lemons; this renderer keeps the arrangement and the palette, and leaves the painting out.",
    ],
    whoItSuits: [
      "A wedding by the sea in the south of Italy, or anywhere you want to borrow the feeling: a terrace, a long table, evening swimming in the same day. Couples who love food, sun and old stone.",
      "It suits a mixed-age guest list, because the strong contrast between navy ink and yellow ground is easy to read in glare. The warmth also makes it a pleasant first message in a grey month.",
    ],
    typography: [
      "Names are set in Cormorant Garamond in title case, a little larger than the page would otherwise call for. Its fine strokes sit well against the plaster and feel closer to a hand-lettered shopfront than to a template.",
      "Everything else is Jost in a slate blue-grey, small and evenly spaced, so that times and places are easy to take in at a glance. The cobalt is saved for the tile and the date.",
    ],
    howItOpens: [
      "An envelope sits on a plaster-coloured screen, and a slow veil lifts away as it opens, revealing the framed page inside. It is an old gesture, done quietly, and it fits the unhurried pace of the palette.",
      "It plays once and lasts about two seconds. If the guest has reduced motion switched on, the envelope step is skipped and the invitation is open from the first frame.",
    ],
  },
  nameDe: "Amalfi",
};
