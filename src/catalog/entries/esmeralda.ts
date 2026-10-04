import type { CatalogEntry } from "@/catalog/types";

/**
 * Esmeralda.
 *
 * A reading of the source design in colour and type only: no artwork, just
 * the palette, face pairing and ornament that carry the same feeling.
 */
export const entry: CatalogEntry = {
  id: "esmeralda",
  kind: "invitation",
  draft: false,
  theme: {
    dark: true,
    fonts: "classic",
    ornament: "deco",
    surface: "none",
    motion: "veil",
    lettering: "tracked-caps",
    chrome: "framed",
    palette: {
      bg: "#0F2A21",
      surface: "#163A2E",
      ink: "#F1F5F0",
      muted: "#A9BFB3",
      accent: "#C9D3D6",
      accentSoft: "#1F4A3B",
      rule: "#3C6454",
      onAccent: "#0F2A21",
    },
  },
  copy: {
    name: "Esmeralda",
    summary: "Deep emerald velvet with silver and white, lit like a ballroom full of chandeliers.",
    metaTitle: "Esmeralda: an emerald velvet and silver wedding invitation",
    metaDescription: "A dark emerald digital wedding invitation with silver rules and white lettering, for evening weddings. Read the Esmeralda sample, then add your names.",
    palette: {
      paper: "#0F2A21",
      ink: "#F1F5F0",
      muted: "#A9BFB3",
      rule: "#3C6454",
      accent: "#C9D3D6",
    },
    opener: "veil",
    openerName: "The curtain",
    sample: { a: "Katarina", b: "Konrad", date: "2027-05-23" },
    spec: {
      paper: "Emerald velvet, near black",
      ink: "White, with silver accents",
      faces: "Playfair Display, Jost",
    },
    whatItIs: [
      "Esmeralda is the only invitation in this set that works after dark. The ground is a deep emerald that reads as velvet, the lettering is white, and the accent is a cool silver, the colour of a chandelier arm catching a candle.",
      "Frames and a deco ornament give it the formality of a theatre programme. Because the green is so dark, the thin silver rules carry a lot of the shape, and they are kept fine on purpose so that nothing feels heavy.",
    ],
    whoItSuits: [
      "A black-tie wedding in a hotel ballroom, an opera house, a library or an old club. It is for couples who want the invitation to arrive as a statement and whose evening runs well past candle-lighting.",
      "It is a strong choice for autumn and winter dates, though the emerald is rich enough to hold in May as well. Guests will read it on phones in dim rooms, and the light-on-dark setting suits that.",
    ],
    typography: [
      "Names are set in Playfair Display in tracked capitals, and its sharp contrast between thick and thin strokes shines in white against the green. The generous spacing makes the names read like lettering engraved on a plate.",
      "Supporting text uses Jost in a pale sage, sized up slightly because light text on a dark ground needs it. Every colour in the type is chosen to keep strong contrast, so nothing is lost in a dim ballroom.",
    ],
    howItOpens: [
      "The curtain. A velvet-green layer sits across the invitation and draws back from the centre, leaving the framed first page behind it. It plays like the beginning of a performance, slow enough to feel staged.",
      "The movement is a little under two seconds and does not bounce. With reduce motion switched on the curtain never plays and the invitation is simply open.",
    ],
  },
  nameDe: "Esmeralda",
};
