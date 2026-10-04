import type { CatalogEntry } from "@/catalog/types";

/**
 * Cygne.
 *
 * There is no image layer, so the source design's feeling is carried by
 * colour, type and one ornament rather than by artwork.
 */
export const entry: CatalogEntry = {
  id: "cygne",
  kind: "invitation",
  draft: false,
  theme: {
    dark: false,
    fonts: "editorial",
    ornament: "none",
    surface: "marble",
    motion: "fade-rise",
    lettering: "tracked-caps",
    chrome: "open",
    palette: {
      "bg": "#EEF2F6",
      "surface": "#F9FBFD",
      "ink": "#1B2838",
      "muted": "#62738A",
      "accent": "#5B7FA6",
      "accentSoft": "#D8E2EE",
      "rule": "#B3C1D2",
      "onAccent": "#F8FBFE"
    },
  },
  copy: {
    name: "Cygne",
    summary: "Dusty blue over cool marble with a silver thread, still as a moonlit lake.",
    metaTitle: "Cygne: a dusty-blue Swan Lake wedding invitation link",
    metaDescription: "A dusty blue and silver digital wedding invitation on cool marble, still as a moonlit lake. Read the Cygne sample, then put your own two names on it.",
    palette: {
      "paper": "#EEF2F6",
      "ink": "#1B2838",
      "muted": "#62738A",
      "rule": "#B3C1D2",
      "accent": "#5B7FA6"
    },
    opener: "foil",
    openerName: "The silver foil",
    sample: { a: "Ottilie", b: "Oskar", date: "2027-09-26" },
    spec: {
      paper: "Cool marble, pale blue-white",
      ink: "Dusty blue, midnight ink",
      faces: "Editorial serif, small sans",
    },
    whatItIs: [
      "Cygne is the hour before a ballet begins. The ground is a cool, pale marble with a slight blue cast, the accent is a dusty blue like lake water at dusk, and everything else is a very dark midnight ink.",
      "There are no ornaments and no frames, because stillness is the subject. The marble veining and wide margins do the work that illustration does in other designs, and the page is the quieter for it."
    ],
    whoItSuits: [
      "Winter weddings, evening ceremonies, a theatre, a ballroom or a lakeside hotel. Couples drawn to fairy tales, but the grown-up version, with moonlight in it and no glitter.",
      "It also suits a larger, more formal guest list. The tracked capitals and cool colours read as composed, so an invitation reaching older relatives and younger friends both looks like it was meant for them."
    ],
    typography: [
      "The names are set in an editorial serif in tracked capitals, with wide spacing that makes each name look like a line on a programme. The letterforms are high-contrast, which helps them hold on marble.",
      "Everything else is a small sans in a blue grey, set well apart from the names. The wide tracking is the single flourish; without ornament or frames, it is what gives the page its sense of poise."
    ],
    howItOpens: [
      "The silver foil. A sheet of pale silver covers the invitation and a thin band of light crosses it, left to right, before the sheet fades to reveal what lies beneath.",
      "It runs just under two seconds without bounce. For anyone with reduced motion enabled, the sweep does not play and the invitation is open from the start, with every word in place."
    ],
  },
  nameDe: "Cygne",
};
