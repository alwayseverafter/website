import type { CatalogEntry } from "@/catalog/types";

/**
 * Voile.
 *
 * The soft lace reading, and the open counterpart to Dentelle. No frame, no
 * seal, no metal: separation is space and one lilac hairline. It is the
 * lightest page in the catalogue.
 */
export const entry: CatalogEntry = {
  id: "std-voile",
  kind: "save-the-date",
  draft: false,
  theme: {
    dark: false,
    fonts: "garamond",
    ornament: "weave",
    surface: "plaster",
    motion: "fade-rise",
    lettering: "titlecase",
    chrome: "open",
    palette: {
      bg: "#FAF7F7",
      surface: "#FFFFFF",
      ink: "#35303A",
      muted: "#8B8490",
      accent: "#BCA9C4",
      accentSoft: "#EDE5F0",
      rule: "#DBD2DE",
      onAccent: "#FFFCFE",
    },
  },
  copy: {
    name: "Voile",
    summary: "The palest blush, a soft lilac hairline, and no frame anywhere.",
    metaTitle: "Voile: a soft lace save the date as a link",
    metaDescription: "The palest digital save the date, in blush white with a soft lilac hairline and no frame at all. See the full sample and put your own date on it.",
    palette: {
      paper: "#FAF7F7",
      ink: "#35303A",
      muted: "#8B8490",
      rule: "#DBD2DE",
      accent: "#BCA9C4",
    },
    opener: "veil",
    openerName: "The veil",
    sample: { a: "Mirela", b: "Joaquin", date: "2028-06-23" },
    spec: {
      paper: "Palest blush white",
      ink: "Soft aubergine",
      faces: "Cormorant Garamond throughout",
    },
    whatItIs: [
      "Voile is the softest of the three lace styles and the only one with no frame. The ground is the palest blush white over a plaster surface, and the single mark is a lilac hairline carrying a woven glyph at its centre.",
      "Two names, the date, the days remaining. Where Dentelle closes its content inside a border and Grattage Dentelle hides it behind a sweep, this one leaves everything in the open and relies on space to do the separating.",
    ],
    whoItSuits: [
      "A morning ceremony, a room with a lot of daylight in it, a couple who find even a hairline frame too much structure for something sent this far ahead.",
      "It is also the calmest option when the save the date will be read mostly on phones in passing, because there is nothing in it that needs a second look.",
    ],
    typography: [
      "Cormorant Garamond throughout, set light. One family at three sizes, which is the least typographic structure any style here uses, and the reason the page reads as a breath rather than as a card.",
      "The soft aubergine ink is warmer than black and keeps the palest ground from looking like an unstyled page. The lilac appears only at the hairline.",
    ],
    howItOpens: [
      "The veil. A sheet of blush white lifts from the centre outward over about a second and a half, which on this palette reads as fabric rather than as paper.",
      "Nothing bounces and nothing sparkles. On a phone set to reduce motion the veil does not play and the save the date is simply already open, which is the same page without the pause.",
    ],
  },
  nameDe: "Voile",
};
