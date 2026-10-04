import type { CatalogEntry } from "@/catalog/types";

/**
 * Perla.
 *
 * A reading of the source design in colour and type only: no artwork, just
 * the palette, face pairing and ornament that carry the same feeling.
 */
export const entry: CatalogEntry = {
  id: "perla",
  kind: "invitation",
  draft: false,
  theme: {
    dark: false,
    fonts: "classic",
    ornament: "diamond",
    surface: "grain",
    motion: "veil",
    lettering: "tracked-caps",
    chrome: "framed",
    palette: {
      bg: "#F4EEEF",
      surface: "#FCF8F8",
      ink: "#2E2428",
      muted: "#7A6A70",
      accent: "#9A5666",
      accentSoft: "#EBDADE",
      rule: "#CDB9BF",
      onAccent: "#FFFFFF",
    },
  },
  copy: {
    name: "Perla",
    summary: "Pearl-grey blush, framed in fine lines, with the hush of swans on a Roman pond.",
    metaTitle: "Perla: a pearl and blush wedding invitation as a link",
    metaDescription: "A pearl-grey and blush digital wedding invitation, framed in fine lines and quiet as a Roman garden pond. Read the Perla sample, then add your own names.",
    palette: {
      paper: "#F4EEEF",
      ink: "#2E2428",
      muted: "#7A6A70",
      rule: "#CDB9BF",
      accent: "#9A5666",
    },
    opener: "veil",
    openerName: "The veil",
    sample: { a: "Hanne", b: "Hugo", date: "2027-10-02" },
    spec: {
      paper: "Pearl, faintly pink",
      ink: "Dusk plum, near black",
      faces: "Playfair Display, Jost",
    },
    whatItIs: [
      "Perla is the colour of the inside of a shell: a pearl ground with a trace of pink in it, framed in hairlines that behave like the stitched edge of a piece of embroidery. The accent is a dusky rose that is used sparingly, so that it reads as a bead of colour rather than a fill.",
      "Each section sits inside its frame, and the diamond glyph that separates them is the reduced form of a beaded border. A faint grain in the surface keeps the pale ground from feeling clinical, giving it the slight tooth of fine paper.",
    ],
    whoItSuits: [
      "A wedding in a city with fountains, a palazzo, a villa with a pond and a pair of swans on it. It suits couples who like formality with a soft edge, and a day that moves from ceremony to a long seated dinner.",
      "It is a good fit when the dress and flowers are pale and the room is candlelit. The invitation then matches the evening, instead of arriving in a louder colour than anything the guests will actually see.",
    ],
    typography: [
      "Names and headings are in Playfair Display, set in tracked capitals. The wide spacing gives them a monogrammed look, as if each letter had been worked individually, and it holds up beautifully at the scale of a phone screen.",
      "Details and times fall back to Jost in a soft mauve grey, in small sizes with plenty of leading. One display face, one workhorse face and a single rose accent give the framed layout its calm.",
    ],
    howItOpens: [
      "The veil. A pale sheer layer lies across the invitation and lifts slowly from the bottom, revealing the first frame behind it. It reads as a bridal veil drawn back rather than as a loading screen.",
      "It lasts a little under two seconds and fades without any bounce. If a guest has reduce motion switched on, the veil never appears and the invitation is already open.",
    ],
  },
  nameDe: "Perla",
};
