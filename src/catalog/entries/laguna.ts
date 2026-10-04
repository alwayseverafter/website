import type { CatalogEntry } from "@/catalog/types";

/**
 * Laguna.
 *
 * Water-pale ground, a clear turquoise accent, and a quiet linen weave beneath. Translated into colour, type and one ornament, since this renderer
 * has no image layer.
 */
export const entry: CatalogEntry = {
  id: "laguna",
  kind: "invitation",
  draft: false,
  theme: {
    dark: false,
    fonts: "classic",
    ornament: "leaf",
    surface: "linen",
    motion: "fade-rise",
    lettering: "titlecase",
    chrome: "open",
    palette: {
      bg: "#EAF6F3",
      surface: "#F8FDFB",
      ink: "#0F3A44",
      muted: "#52777C",
      accent: "#0E8C8F",
      accentSoft: "#CBEBE7",
      rule: "#9FCFCB",
      onAccent: "#F8FDFB",
    },
  },
  copy: {
    name: "Laguna",
    summary: "Sea-glass ground, deep lagoon ink and clear turquoise, with a palm-leaf motif.",
    metaTitle: "Laguna: a turquoise beach wedding invitation as a link",
    metaDescription: "A digital wedding invitation in sea-glass white, deep lagoon ink and clear turquoise, with a palm-leaf motif. Read the Laguna sample and make it yours in minutes.",
    palette: {
      paper: "#EAF6F3",
      ink: "#0F3A44",
      muted: "#52777C",
      rule: "#9FCFCB",
      accent: "#0E8C8F",
    },
    opener: "veil",
    openerName: "The veil",
    sample: { a: "Valentina", b: "Theo", date: "2028-06-11" },
    spec: {
      paper: "Sea-glass white",
      ink: "Deep lagoon, turquoise",
      faces: "Cormorant Garamond, Jost",
    },
    whatItIs: [
      "Laguna starts from the colour of shallow water over white sand. The ground is a pale sea-glass green, the ink a deep lagoon blue close to black, and the turquoise accent is the only saturated thing on the page, used for rules and the date.",
      "The source design shows palm trees and shells. Here the palm survives as a single leaf ornament repeated as a divider, over a faint linen texture that reads as sun-dried cloth. The page stays open, with no frame, so it feels like air and horizon.",
    ],
    whoItSuits: [
      "A wedding on a beach, a terrace over the sea, or any place where guests will arrive with sand in their shoes. It also works for couples marrying abroad, because the colour says warm water before a word is read.",
      "It is kind to a destination guest list that must read quickly and plan flights. The pale ground and strong ink stay clear in bright outdoor light on a phone, which is exactly where many will open it.",
    ],
    typography: [
      "The names are set in Cormorant Garamond in title case, light and long, which gives the page a salt-bleached elegance. The high contrast of the strokes reads like a fine pen against pale paper.",
      "Practical lines are Jost in the faded teal-grey, kept small and spaced. Because the display face is delicate, the supporting face is plain, so that times and places never compete with the names.",
    ],
    howItOpens: [
      "A pale veil lies over the invitation and lifts slowly, as a tide goes out, revealing the page beneath. Nothing flashes and nothing bounces, in keeping with the calm of the palette.",
      "It plays once, in a little under two seconds. With reduced motion on, the veil is skipped and the invitation simply appears fully formed.",
    ],
  },
  nameDe: "Laguna",
};
