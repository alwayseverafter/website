import type { CatalogEntry } from "@/catalog/types";

/**
 * Levante.
 *
 * A southern-coast reading: sun-warmed plaster, terracotta ink shadows and one
 * bougainvillea magenta. The source shows painted doors and flowers; this
 * renderer draws colour and a tile glyph, so the translation is to a white
 * wall in afternoon light with one flowering vine on it.
 */
export const entry: CatalogEntry = {
  id: "levante",
  kind: "invitation",
  draft: false,
  theme: {
    dark: false,
    fonts: "garamond",
    ornament: "tile",
    surface: "plaster",
    motion: "veil",
    lettering: "titlecase",
    chrome: "framed",
    palette: {
      bg: "#FBF3E6",
      surface: "#FFF9F0",
      ink: "#2B2320",
      muted: "#7A685A",
      accent: "#A6355F",
      accentSoft: "#F3D9DE",
      rule: "#D9C2A8",
      onAccent: "#FFF8F2",
    },
  },
  copy: {
    name: "Levante",
    summary:
      "Sun-warmed plaster, a bougainvillea magenta, and a tile border to frame the day.",
    metaTitle: "Levante: a sun-warmed Mediterranean wedding invitation",
    metaDescription:
      "A warm plaster-white digital wedding invitation with bougainvillea magenta and a tile motif."
      + " Read the whole Levante sample, then replace the names with your own.",
    palette: {
      paper: "#FBF3E6",
      ink: "#2B2320",
      muted: "#7A685A",
      rule: "#D9C2A8",
      accent: "#A6355F",
    },
    opener: "veil",
    openerName: "The veil",
    sample: { a: "Cecile", b: "Andres", date: "2028-05-10" },
    spec: {
      paper: "Warm plaster white",
      ink: "Deep brown, magenta accent",
      faces: "EB Garamond, Jost",
    },
    whatItIs: [
      "Levante is the east wind and the east-facing wall. The ground is a plaster"
      + " white warmed with a little yellow, the ink is a brown so dark it reads"
      + " as black only in shade, and one flower colour, a deep magenta, carries"
      + " every accent on the page.",
      "A hairline frame closes each section and a small tile glyph marks the"
      + " breaks between them. A faint plaster grain sits behind it all, so the"
      + " page feels painted onto a wall rather than lit from behind a screen.",
    ],
    whoItSuits: [
      "Weddings in the south: a terrace above the sea, a village square, a"
      + " courtyard with a fountain. Anywhere the light is strong and the walls"
      + " are white will recognise this palette at once.",
      "It also works far from the coast for couples who want warmth in a cold"
      + " month. The magenta is bright enough to feel like summer on a screen"
      + " opened in January, yet formal enough for a church service.",
    ],
    typography: [
      "Names are set in Garamond in title case, large and unhurried. It is a"
      + " humanist face with a calm colour on the page, and it suits the slower,"
      + " more classical side of a Mediterranean wedding.",
      "Practical lines are in a clean sans in the soft brown of the muted tone."
      + " Magenta is kept for the single most important action, so the guest's"
      + " eye is led to the reply button without being told to look.",
    ],
    howItOpens: [
      "The veil. A pale sheet lies across the invitation, then lifts upward as"
      + " though a breeze had caught the curtain of a doorway, and the page is"
      + " there underneath it. The movement is soft and has no sudden edge.",
      "It lasts a little under two seconds and plays once per visit. For guests"
      + " who have asked their phone to reduce motion there is no veil at all,"
      + " and the invitation is open from the first frame.",
    ],
  },
  nameDe: "Levante",
};
