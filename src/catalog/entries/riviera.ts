import type { CatalogEntry } from "@/catalog/types";

/**
 * Riviera.
 *
 * A reading of the source design in colour and type only: no artwork, just
 * the palette, face pairing and ornament that carry the same feeling.
 */
export const entry: CatalogEntry = {
  id: "riviera",
  kind: "invitation",
  draft: false,
  theme: {
    dark: false,
    fonts: "geometric",
    ornament: "none",
    surface: "none",
    motion: "fade-rise",
    lettering: "titlecase",
    chrome: "open",
    palette: {
      bg: "#EAF1F6",
      surface: "#F8FBFD",
      ink: "#14283A",
      muted: "#5B7285",
      accent: "#2C6797",
      accentSoft: "#D3E3EF",
      rule: "#A9C1D3",
      onAccent: "#FFFFFF",
    },
  },
  copy: {
    name: "Riviera",
    summary: "Porcelain blue and sea-glass white, clean lines for a morning on the Cote d'Azur.",
    metaTitle: "Riviera: a porcelain-blue seaside wedding invitation",
    metaDescription: "A porcelain-blue digital wedding invitation with clean geometric type, made for a bright coastal day. Read the Riviera sample, then put your own two names on it.",
    palette: {
      paper: "#EAF1F6",
      ink: "#14283A",
      muted: "#5B7285",
      rule: "#A9C1D3",
      accent: "#2C6797",
    },
    opener: "envelope",
    openerName: "The envelope",
    sample: { a: "Ingrid", b: "Ivo", date: "2027-03-09" },
    spec: {
      paper: "Sea-glass white, blue cast",
      ink: "Deep marine, near black",
      faces: "Jost, Cormorant Garamond",
    },
    whatItIs: [
      "Riviera is a cool, bright invitation: a white with a breath of blue in it, a marine ink that is nearly black, and one clear porcelain blue for the rules and links. It is the palette of whitewashed walls and glazed tiles seen in strong midday light.",
      "There is no ornament and no surface texture. The original is washed with watercolour; here the equivalent is empty space, which lets the blue do the work and keeps every line of text sharp against a very clean ground.",
    ],
    whoItSuits: [
      "A coastal wedding, a hotel terrace, a boat, a chapel above the sea, or any day with a lot of daylight in it. Couples who prefer a modern, uncluttered invitation will find it easy to live in.",
      "It also suits a spring or early-summer date, when the sky and water carry the same blue. Because nothing is decorative, it travels well across languages and guest lists of every age.",
    ],
    typography: [
      "The headline faces are geometric and clean, set in title case so that the names read as plain, friendly words. Their round forms echo porcelain and tile, and the letterspacing stays at a natural, relaxed setting.",
      "Cormorant Garamond appears only in the small italic touches, such as the date line, to add a note of the handwritten. Muted blue grey takes care of everything functional, and the hierarchy is carried by size alone.",
    ],
    howItOpens: [
      "The envelope. A white envelope with a pale blue lining opens on the first tap, and the card slides up from inside and settles into the open layout. The movement is light and brisk, like a letter arriving by post.",
      "Total time is about two seconds, with no bounce or overshoot. Guests using reduce motion skip the animation entirely and land directly on the invitation itself.",
    ],
  },
  nameDe: "Riviera",
};
