import type { CatalogEntry } from "@/catalog/types";

/** Chandelle: Tap to light the candles. Save the date. */
export const entry: CatalogEntry = {
  id: "std-chandelle",
  kind: "save-the-date",
  draft: false,
  theme: {
    dark: true,
    fonts: "garamond",
    ornament: "none",
    surface: "grain",
    motion: "fade-rise",
    lettering: "titlecase",
    chrome: "open",
    palette: {
      bg: "#1B1410",
      surface: "#261C16",
      ink: "#F3E6D0",
      muted: "#B39F85",
      accent: "#E3A857",
      accentSoft: "#3A2B1C",
      rule: "#5A4630",
      onAccent: "#1B1410",
    },
  },
  copy: {
    name: "Chandelle",
    summary: "A dark room, cream lettering and one flame-amber glow that brings the date up out of the shadow.",
    metaTitle: "Chandelle: a candlelit dark save the date as a link",
    metaDescription: "A dark save the date lit by a single amber glow, with your names and date rising out of the shadow. Read the Chandelle sample, then add your own in a minute.",
    palette: {
      paper: "#1B1410",
      ink: "#F3E6D0",
      muted: "#B39F85",
      rule: "#5A4630",
      accent: "#E3A857",
    },
    opener: "veil",
    openerName: "The veil",
    sample: { a: "Thea", b: "Pascal", date: "2029-04-14" },
    spec: {
      paper: "Candle-smoked brown",
      ink: "Cream, flame amber",
      faces: "Cormorant Garamond",
    },
    whatItIs: [
      "Chandelle starts in a dark room. The ground is a deep smoked brown, the lettering is the cream of old wax, and a single warm amber glow is all the light there is.",
      "A save the date should carry little, and in the dark that is easy to honour. Two names, one date and a countdown are lit in turn, and the shadow around them takes the place of every other line.",
    ],
    whoItSuits: [
      "Couples planning an evening wedding, a winter date, or a dinner by candle in an old house, who want the first message to feel cinematic and a little hushed.",
      "It also suits guests who will read it on a phone at night. A dark page is gentler on the eyes after dusk, and the amber stays readable against it without any glare.",
    ],
    typography: [
      "Names are set in Cormorant Garamond in title case, cream on brown, large enough that the thin strokes still hold. Its old-style figures make the date look written rather than printed.",
      "The countdown and small lines stay in the same face, in a muted wax tone a step behind the cream. Amber is kept for the glow and the numerals, so it never competes with the names.",
    ],
    howItOpens: [
      "A dark veil sits over the page, and a tap lights the first flame. The glow spreads outward and the names come up out of the shadow, followed by the date.",
      "The warm light grows for just under two seconds and then holds still, without flicker. With reduced motion switched on, the room is simply already lit when the link opens.",
    ],
  },
  nameDe: "Chandelle",
};
