import type { CatalogEntry } from "@/catalog/types";

/**
 * Fiore.
 *
 * A deep green night garden, with parchment lettering and one marigold glow. Translated into colour, type and one ornament, since this renderer
 * has no image layer.
 */
export const entry: CatalogEntry = {
  id: "fiore",
  kind: "invitation",
  draft: false,
  theme: {
    dark: true,
    fonts: "editorial",
    ornament: "weave",
    surface: "grain",
    motion: "fade-rise",
    lettering: "tracked-caps",
    chrome: "open",
    palette: {
      bg: "#15241C",
      surface: "#1D3227",
      ink: "#F4EBDA",
      muted: "#A7B8A5",
      accent: "#E9A93B",
      accentSoft: "#2E4A39",
      rule: "#3F5C49",
      onAccent: "#15241C",
    },
  },
  copy: {
    name: "Fiore",
    summary: "A garden at dusk: deep green ground, parchment ink and glowing marigold.",
    metaTitle: "Fiore: a garden-at-dusk wedding invitation as a link",
    metaDescription: "A dark digital wedding invitation in midnight green, parchment and marigold, like a garden lit at dusk. Read the Fiore sample, then add your own two names.",
    palette: {
      paper: "#15241C",
      ink: "#F4EBDA",
      muted: "#A7B8A5",
      rule: "#3F5C49",
      accent: "#E9A93B",
    },
    opener: "foil",
    openerName: "The foil",
    sample: { a: "Zofia", b: "Xavier", date: "2028-10-14" },
    spec: {
      paper: "Midnight garden green",
      ink: "Warm parchment, marigold",
      faces: "Editorial display, Jost",
    },
    whatItIs: [
      "Fiore takes the garden in full bloom and turns the lights down. The ground is a deep, near-black green, the lettering a warm parchment, and the colour of the flowers is reduced to a single glowing marigold, as if one lamp were lit among the beds.",
      "Where the other florals in the catalogue are pale and daylit, this one is a night garden. A woven ornament stands in for trellis and a faint grain gives the dark ground some tooth, so that it reads as velvet and not as a flat screen.",
    ],
    whoItSuits: [
      "Evening weddings, autumn dates, and gardens that are best after sunset with lanterns in the trees. Couples who love flowers but would rather not be pink about it.",
      "It is also a good fit for a guest list that will read mostly in the evening, on phones in bed. The dark ground is easy on the eyes then, and the parchment lettering stays clear against it.",
    ],
    typography: [
      "Names are set in the editorial display face in spaced capitals, in parchment on green. The wide tracking keeps the letters from clotting against a dark ground, and the capitals carry well at large size.",
      "Detail lines are a small sans in a soft sage, kept short. Marigold is kept to the date and one rule so that it behaves like the single lit window in a dark house.",
    ],
    howItOpens: [
      "A band of warm light crosses a dark sheet from left to right and the sheet clears behind it. On this palette the sweep reads as a lantern passing along a hedge.",
      "It takes just under two seconds and does not repeat. With reduced motion preferred, the sweep is skipped and the invitation is already open.",
    ],
  },
  nameDe: "Fiore",
};
