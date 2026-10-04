import type { CatalogEntry } from "@/catalog/types";

/**
 * Cisne.
 *
 * Swans on water, taken as the water rather than the birds. The companion
 * invitation Cygne keeps the blue and the silver; this one goes green and
 * drops the ornament entirely, so the two never read as one page.
 */
export const entry: CatalogEntry = {
  id: "std-cisne",
  kind: "save-the-date",
  draft: false,
  theme: {
    dark: false,
    fonts: "garamond",
    ornament: "none",
    surface: "marble",
    motion: "fade-rise",
    lettering: "titlecase",
    chrome: "open",
    palette: {
      bg: "#F1F5F3",
      surface: "#FFFFFF",
      ink: "#1D2A26",
      muted: "#667C74",
      accent: "#6E9A8E",
      accentSoft: "#DDE9E4",
      rule: "#C0D2CA",
      onAccent: "#FFFFFF",
    },
  },
  copy: {
    name: "Cisne",
    summary: "Still green water, no ornament at all, and a countdown that keeps moving.",
    metaTitle: "Cisne: a still-water save the date as a link",
    metaDescription: "A still-water digital save the date in green and white, with no ornament and a live countdown. See the full sample and put your own date on it.",
    palette: {
      paper: "#F1F5F3",
      ink: "#1D2A26",
      muted: "#667C74",
      rule: "#C0D2CA",
      accent: "#6E9A8E",
    },
    opener: "direct",
    openerName: "Direct",
    sample: { a: "Olivia", b: "Leon", date: "2028-08-12" },
    spec: {
      paper: "Still water green",
      ink: "Deep water green",
      faces: "Cormorant Garamond throughout",
    },
    whatItIs: [
      "Cisne is drawn from still water rather than from what is on it. The ground is a pale green white over a marble surface, the ink is a deep water green, and there is no ornament anywhere on the page.",
      "What moves is the countdown. It is the only live thing in the style, and on a ground this quiet a number changing once a day is enough to make the page feel like it is waiting with you.",
    ],
    whoItSuits: [
      "A lakeside or riverside wedding, a late summer date, and couples who want something cooler than cream without going to a true blue.",
      "It also suits a long engagement, because a green this desaturated does not date the message to a season the way a botanical or a bright blue would.",
    ],
    typography: [
      "Cormorant Garamond throughout, set light and large. With no ornament on the page the letterforms are the only drawing, so the face carries more of the style here than anywhere else in the catalogue.",
      "The date and the countdown sit in the mid green that stands one step back from the ink, which keeps the two names as the only thing at full strength.",
    ],
    howItOpens: [
      "Direct. No cover, no envelope, no sweep: the save the date is there when the link opens, which matches a style whose argument is that nothing is in the way.",
      "The names and the date rise a few pixels as the page settles, over about half a second. Under reduced motion nothing moves and the page is already at rest.",
    ],
  },
  nameDe: "Cisne",
};
