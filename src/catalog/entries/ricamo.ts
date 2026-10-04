import type { CatalogEntry } from "@/catalog/types";

/**
 * Ricamo.
 *
 * A reading of the source design in colour and type only: no artwork, just
 * the palette, face pairing and ornament that carry the same feeling.
 */
export const entry: CatalogEntry = {
  id: "ricamo",
  kind: "invitation",
  draft: false,
  theme: {
    dark: false,
    fonts: "garamond",
    ornament: "weave",
    surface: "linen",
    motion: "veil",
    lettering: "titlecase",
    chrome: "open",
    palette: {
      bg: "#EFE6D6",
      surface: "#F8F2E6",
      ink: "#33291F",
      muted: "#7A6A55",
      accent: "#8B5236",
      accentSoft: "#E6D7BF",
      rule: "#C9B79A",
      onAccent: "#FFFAF2",
    },
  },
  copy: {
    name: "Ricamo",
    summary: "Oatmeal linen and a single thread of terracotta, romance stitched by hand.",
    metaTitle: "Ricamo: a hand-embroidered linen wedding invitation",
    metaDescription: "An oatmeal-linen digital wedding invitation with one terracotta thread through it, like hand-stitched cloth. Read the Ricamo sample, then add your own names.",
    palette: {
      paper: "#EFE6D6",
      ink: "#33291F",
      muted: "#7A6A55",
      rule: "#C9B79A",
      accent: "#8B5236",
    },
    opener: "foil",
    openerName: "The foil",
    sample: { a: "Lucia", b: "Lorenzo", date: "2027-06-05" },
    spec: {
      paper: "Oatmeal linen",
      ink: "Walnut, near black",
      faces: "Cormorant Garamond, Jost",
    },
    whatItIs: [
      "Ricamo is the colour and feel of undyed linen: a deeper oatmeal ground than the cream styles, with a visible weave in the surface and a warm walnut ink. The one colour that stands out is a terracotta, like a red thread pulled through the cloth.",
      "The layout is open and a woven ornament repeats the cross-stitch. It is a warm invitation, closer to a tablecloth than a sheet of paper, and the surface texture is what stops the oatmeal reading as plain beige.",
    ],
    whoItSuits: [
      "A farmhouse wedding, a long table under a pergola, a family-run venue where the linens are part of the day. It is for couples who value things made by hand and want the page to feel handled.",
      "It suits late spring and early summer, when the terracotta picks up pots, bricks and the first warm evenings. It is also forgiving of photography, since oatmeal sits well next to almost any bridal palette.",
    ],
    typography: [
      "The names are in Cormorant Garamond, in title case with a slightly larger size than the body. Its old-style forms have the look of a signature in ink and pair easily with textured ground.",
      "Details are in Jost in a soft brown grey. The weave of the surface would make heavy type feel busy, so everything stays light in weight, with plenty of line spacing to let the linen breathe.",
    ],
    howItOpens: [
      "The foil. A band of warm light crosses the linen from left to right as a thin sheet clears, and the invitation appears beneath it. It looks like a lamp passing over cloth rather than an effect added on top.",
      "It lasts about two seconds and has no bounce. For guests who prefer reduced motion, the sweep is skipped and the invitation is open from the first frame.",
    ],
  },
  nameDe: "Ricamo",
};
