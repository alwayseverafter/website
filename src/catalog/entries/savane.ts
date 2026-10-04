import type { CatalogEntry } from "@/catalog/types";

/**
 * Savane.
 *
 * A savanna-at-dusk reading. The source design paints animals and proteas; this
 * renderer has no image layer, so the translation is to the light: sun-baked
 * sand for the ground, burnt sienna for the one saturated colour, and the leaf
 * glyph standing in for a protea bract.
 */
export const entry: CatalogEntry = {
  id: "savane",
  kind: "invitation",
  draft: false,
  theme: {
    dark: false,
    fonts: "classic",
    ornament: "leaf",
    surface: "grain",
    motion: "fade-rise",
    lettering: "titlecase",
    chrome: "open",
    palette: {
      bg: "#F5E9D8",
      surface: "#FBF3E6",
      ink: "#34190F",
      muted: "#7A5A47",
      accent: "#B33F1C",
      accentSoft: "#EFD2B8",
      rule: "#D2B392",
      onAccent: "#FFF6EC",
    },
  },
  copy: {
    name: "Savane",
    summary:
      "Sun-baked sand, burnt sienna and a leaf glyph, set open like a landscape at dusk.",
    metaTitle: "Savane: a savanna-sunset wedding invitation as a link",
    metaDescription:
      "A digital wedding invitation in sand, burnt sienna and dusk light, with a leaf glyph and"
      + " an envelope opening. Read the Savane sample, then put your own names on it.",
    palette: {
      paper: "#F5E9D8",
      ink: "#34190F",
      muted: "#7A5A47",
      rule: "#D2B392",
      accent: "#B33F1C",
    },
    opener: "envelope",
    openerName: "The envelope",
    sample: { a: "Wilhelmina", b: "Ulrich", date: "2028-07-18" },
    spec: {
      paper: "Sand, with a fine grain",
      ink: "Dark umber, burnt sienna accent",
      faces: "Cormorant Garamond, Jost",
    },
    whatItIs: [
      "Savane is the hour before the sun goes down, held still. The ground is a"
      + " warm sand with a faint grain, the type is a dark umber that reads like"
      + " burnt wood, and the single saturated colour is a sienna red that turns"
      + " up on the rule, the glyph and the date.",
      "Nothing is boxed. Sections are divided by space and a hairline in a dusty"
      + " tan, so the page reads as open country rather than a form. The leaf"
      + " ornament is the only drawn shape, a nod to the protea bracts that the"
      + " source design paints by hand.",
    ],
    whoItSuits: [
      "A lodge, a game reserve, a farm with a long view, or any wedding held"
      + " outdoors in late afternoon light. It also fits a couple whose guests"
      + " are flying in from several continents and who want the invitation to"
      + " hint at where they are going.",
      "It works for a July or August date in the northern summer as comfortably"
      + " as for an austral winter one, because the palette is the colour of dry"
      + " earth and low sun, not of a particular month.",
    ],
    typography: [
      "The names are set in Cormorant Garamond in title case, large, with an"
      + " italic ampersand. The face is old-style and slightly wide in the"
      + " counters, which gives the names some warmth against the dry ground.",
      "Jost carries every practical line in a muted brown, small and evenly"
      + " spaced. One serif, one sans and one accent colour keep a warm palette"
      + " from tipping into rustic.",
    ],
    howItOpens: [
      "The envelope. The invitation arrives sealed, the flap lifts, and the page"
      + " rises out of it with a short fade. It is a familiar gesture, kept"
      + " quick enough that nobody waits for it.",
      "On a device set to reduce motion the envelope does not animate. The"
      + " invitation is shown already open, with exactly the same content and"
      + " order.",
    ],
  },
  nameDe: "Savane",
};
