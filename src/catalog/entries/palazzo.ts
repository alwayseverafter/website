import type { CatalogEntry } from "@/catalog/types";

/**
 * Palazzo.
 *
 * Beaded curtains, a crystal chandelier, palms. The source design is a grand
 * hotel ballroom; here the room becomes a deep palm green ground with brass
 * light, tiled ornament for the floor, and a foil sweep for the chandelier.
 */
export const entry: CatalogEntry = {
  id: "palazzo",
  kind: "invitation",
  draft: false,
  theme: {
    dark: true,
    fonts: "editorial",
    ornament: "tile",
    surface: "marble",
    motion: "veil",
    lettering: "tracked-caps",
    chrome: "framed",
    palette: {
      bg: "#0F2A24",
      surface: "#16372F",
      ink: "#F2EBD8",
      muted: "#A9BFB5",
      accent: "#C9A24B",
      accentSoft: "#1F473D",
      rule: "#3C6659",
      onAccent: "#0F2A24",
    },
  },
  copy: {
    name: "Palazzo",
    summary: "Palm-leaf green, brass light and tiled floors: a grand ballroom made of colour.",
    metaTitle: "Palazzo: a palm-green ballroom wedding invitation",
    metaDescription:
      "A deep green digital wedding invitation lit with brass, built for a grand room full of"
      + " palms. Step into the Palazzo sample, then swap in your names and date.",
    palette: {
      paper: "#0F2A24",
      ink: "#F2EBD8",
      muted: "#A9BFB5",
      rule: "#3C6659",
      accent: "#C9A24B",
    },
    opener: "foil",
    openerName: "The foil",
    sample: { a: "Eleni", b: "Edoardo", date: "2027-07-06" },
    spec: {
      paper: "Palm green, marbled",
      ink: "Candlelit cream",
      faces: "Playfair Display, Jost",
    },
    whatItIs: [
      "Palazzo is a ballroom described in colour. The ground is the dark green"
      + " of palm fronds in shade, the text is a candlelit cream, and the accent"
      + " is a brass gold that appears on the rules, the tiles and the date.",
      "The ornament is a tiled square pattern, a nod to the marble floor, set"
      + " inside a closed frame. Behind the text a faint marble veining catches"
      + " the light, so the page has depth without a single image on it.",
    ],
    whoItSuits: [
      "A grand hotel, a villa with a ballroom, an evening black-tie dinner with"
      + " a band and a long table under chandeliers. Palms in brass pots are"
      + " the right kind of detail for this page to repeat.",
      "It also works for a summer wedding that moves indoors after dark. Couples"
      + " who want drama but not red and gold will find the green and brass reads"
      + " as lavish while staying cool to look at.",
    ],
    typography: [
      "The names are set in Playfair Display in wide-tracked capitals, which"
      + " gives them the stately look of lettering over a hotel door. The thick"
      + " and thin strokes catch the brass accent well against the dark ground.",
      "Details are set in Jost at small sizes, in a pale green grey. Capitals"
      + " are reserved for names and headings only, so the eye has a clear"
      + " order to follow when it reads down the page.",
    ],
    howItOpens: [
      "The foil. A dark sheet fills the screen and a band of brass light sweeps"
      + " across it, like a chandelier turning, before the sheet clears and the"
      + " invitation shows underneath. On this ground the sweep reads as gilt.",
      "It lasts a little under two seconds and does not bounce. If reduce-motion"
      + " is on, nothing sweeps: the page opens already lit, with the same"
      + " names, date and venue in the same places.",
    ],
  },
  nameDe: "Palazzo",
};
