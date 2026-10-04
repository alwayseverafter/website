import type { CatalogEntry } from "@/catalog/types";

/**
 * Palatine.
 *
 * The grand register, held to save-the-date content. A frame, a gilt rule
 * and two names: the formality is in the materials rather than in extra
 * lines of text.
 */
export const entry: CatalogEntry = {
  id: "std-palatine",
  kind: "save-the-date",
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
      bg: "#14110C",
      surface: "#1D1913",
      ink: "#F0E9DA",
      muted: "#A09682",
      accent: "#C6A664",
      accentSoft: "#272118",
      rule: "#4C432F",
      onAccent: "#14110C",
    },
  },
  copy: {
    name: "Palatine",
    summary: "Warm black and old gold, framed. The most formal of the save the dates.",
    metaTitle: "Palatine: a black and gold save the date as a link",
    metaDescription: "A formal digital save the date in warm black and old gold, names in Cormorant inside a gilt frame. See the full sample and put your own date on it.",
    palette: {
      paper: "#14110C",
      ink: "#F0E9DA",
      muted: "#A09682",
      rule: "#4C432F",
      accent: "#C6A664",
    },
    opener: "veil",
    openerName: "The veil",
    sample: { a: "Juliette", b: "Hendrik", date: "2028-04-09" },
    spec: {
      paper: "Near black, warm",
      ink: "Warm ivory",
      faces: "Cormorant Garamond, Jost",
    },
    whatItIs: [
      "Palatine is the formal one. A warm near-black ground, an old gold hairline framing the whole sheet, and two names in ivory at the centre of it with the date beneath them and the count of days below that.",
      "It is the only save the date here that uses a closed frame. A border is what a formal card has, and since this product carries so few words, the frame is doing the work that a second paragraph would do elsewhere.",
    ],
    whoItSuits: [
      "A black tie wedding, an evening ceremony, a venue with a staircase in it. Couples who want the save the date to set the register of the day a year before anyone sees the invitation.",
      "It is also the right choice when the guest list is largely older, because a gilt frame on black reads as a card to that eye rather than as a web page.",
    ],
    typography: [
      "Cormorant Garamond for the names, set in tracked capitals rather than title case, because caps on a dark ground hold their shape where a light italic would close up.",
      "Jost carries the date and the countdown, small, in the warm grey that sits between the ivory and the ground. Only the names are ever at full strength.",
    ],
    howItOpens: [
      "The veil. A sheet of warm black lifts from the centre outward over about a second and a half, and the framed save the date is behind it.",
      "The pace is slower than a web animation usually is, which is the point, because the wait is the part that reads as expensive. Under reduced motion the veil does not play and the sheet is already open.",
    ],
  },
  nameDe: "Palatine",
};
