import type { CatalogEntry } from "@/catalog/types";

/** Cabana: Watercolour palms and cabana stripes. Save the date. */
export const entry: CatalogEntry = {
  id: "std-cabana",
  kind: "save-the-date",
  draft: false,
  theme: {
    dark: false,
    fonts: "geometric",
    ornament: "weave",
    surface: "none",
    motion: "fade-rise",
    lettering: "titlecase",
    chrome: "open",
    palette: {
      bg: "#F7F5EE",
      surface: "#FFFFFF",
      ink: "#1F3A4D",
      muted: "#6B8594",
      accent: "#D2674A",
      accentSoft: "#F6DDD3",
      rule: "#BFD0D6",
      onAccent: "#FFFFFF",
    },
  },
  copy: {
    name: "Cabana",
    summary: "Sun-bleached white, sea navy and one coral stripe, bright as a beach hut in July.",
    metaTitle: "Cabana: a breezy coastal save the date as a link",
    metaDescription: "A sun-bleached save the date in sea navy with a coral stripe, breezy and bright. Read the Cabana sample, then add your own two names and countdown in a minute.",
    palette: {
      paper: "#F7F5EE",
      ink: "#1F3A4D",
      muted: "#6B8594",
      rule: "#BFD0D6",
      accent: "#D2674A",
    },
    opener: "direct",
    openerName: "Direct",
    sample: { a: "Wren", b: "Tobias", date: "2029-07-10" },
    spec: {
      paper: "Sun-bleached white",
      ink: "Sea navy, coral",
      faces: "Jost",
    },
    whatItIs: [
      "Cabana is a day by the sea. The ground is sun-bleached white, the ink is the navy of deep water, and coral is the stripe of a beach hut that catches the eye at the end of the sand.",
      "It is the lightest of the save the dates in feeling. Two names, one date and a countdown sit with plenty of air around them, as if the whole message were written in the margin of a postcard.",
    ],
    whoItSuits: [
      "Couples marrying near the water, or on any holiday-feeling date, who want the first message to sound relaxed and a little playful rather than ceremonial.",
      "It works for a destination wedding and for guests who will be asked to book travel. The brightness says warm weather at a glance, which does half of the persuading.",
    ],
    typography: [
      "Everything is set in Jost, names in title case at a comfortable size. Its round, even letters feel modern and clean, with none of the formality of an old-style serif.",
      "The date and countdown are small and in a soft slate blue. A woven stripe of coral and navy at the edge stands in for the cabana awning, and it is the only pattern on the page.",
    ],
    howItOpens: [
      "There is no cover and nothing to open. The link loads straight to the save the date, and the names and date rise gently into place as the page appears.",
      "The fade is brief and runs once, which suits a message meant to be read in a glance on a phone. With reduced motion on, everything is simply in place from the first frame.",
    ],
  },
  nameDe: "Cabana",
};
