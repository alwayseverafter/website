import type { CatalogEntry } from "@/catalog/types";

/**
 * Rosaio.
 *
 * A blush-plaster page framed in hairlines, with crimson as the single note. Translated into colour, type and one ornament, since this renderer
 * has no image layer.
 */
export const entry: CatalogEntry = {
  id: "rosaio",
  kind: "invitation",
  draft: false,
  theme: {
    dark: false,
    fonts: "garamond",
    ornament: "leaf",
    surface: "plaster",
    motion: "veil",
    lettering: "titlecase",
    chrome: "framed",
    palette: {
      bg: "#F8E6E4",
      surface: "#FFF6F4",
      ink: "#3B1520",
      muted: "#86616A",
      accent: "#A3253F",
      accentSoft: "#F0C9CC",
      rule: "#D9A9AE",
      onAccent: "#FFF6F4",
    },
  },
  copy: {
    name: "Rosaio",
    summary: "Blush plaster, rose-wine ink and a deep crimson that nods to a full-blown rose.",
    metaTitle: "Rosaio: a rose-garden romantic wedding invitation",
    metaDescription: "A romantic digital wedding invitation in blush, rose-wine and deep crimson, framed like a pressed bloom. Read the Rosaio sample, then swap in your own names.",
    palette: {
      paper: "#F8E6E4",
      ink: "#3B1520",
      muted: "#86616A",
      rule: "#D9A9AE",
      accent: "#A3253F",
    },
    opener: "envelope",
    openerName: "The envelope",
    sample: { a: "Ximena", b: "Vicente", date: "2028-08-25" },
    spec: {
      paper: "Blush plaster",
      ink: "Rose-wine, deep crimson",
      faces: "EB Garamond, Jost",
    },
    whatItIs: [
      "Rosaio is a rose in the way an old love letter is: a little faded at the edges and heavy with meaning. The ground is a blush plaster, the ink a wine so dark it passes for black, and one deep crimson stands for the petal.",
      "Everything sits inside a hairline frame, like a bloom pressed between pages, and the leaf ornament is the one green gesture in an otherwise rose-coloured room. The source design paints its roses; this one imagines them as colour and containment.",
    ],
    whoItSuits: [
      "Couples whose idea of romance is classical: candlelight, a long dress, a poem read aloud. It suits a winter or autumn wedding in an old house just as well as a summer one in a rose garden.",
      "It also fits families who prefer a formal invitation. The framing and the old-style serif give it the dignity of printed stationery, while the pink keeps it warm rather than stiff.",
    ],
    typography: [
      "Names are set in EB Garamond in title case, with the soft, bookish rhythm of an old printed romance. The italics are lovely if you choose to use them, and the capitals sit comfortably next to the lower case.",
      "Supporting lines use a plain sans in a dusky rose-grey, small and evenly spaced. Between the two faces there is a clear order: the names are the poem, everything else is the envelope it came in.",
    ],
    howItOpens: [
      "A blush veil covers the page, then draws upward in one slow motion, as though a tissue sheet were lifted from a pressed flower. It is gentle, and it ends cleanly on the framed invitation.",
      "The sweep takes just under two seconds. With reduced motion preferred, the veil is skipped and the invitation is already open when the guest arrives.",
    ],
  },
  nameDe: "Rosaio",
};
