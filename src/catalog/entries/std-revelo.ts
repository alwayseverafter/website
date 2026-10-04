import type { CatalogEntry } from "@/catalog/types";

/** Revelo: Scratch to reveal the date. Save the date. */
export const entry: CatalogEntry = {
  id: "std-revelo",
  kind: "save-the-date",
  draft: false,
  theme: {
    dark: false,
    fonts: "editorial",
    ornament: "none",
    surface: "plaster",
    motion: "none",
    lettering: "tracked-caps",
    chrome: "open",
    palette: {
      bg: "#EFEDE6",
      surface: "#F8F6F0",
      ink: "#22262B",
      muted: "#6E7378",
      accent: "#B08D3C",
      accentSoft: "#E6DCC0",
      rule: "#C9C3B2",
      onAccent: "#1F1A0E",
    },
  },
  copy: {
    name: "Revelo",
    summary: "A pale plaster page under a silver coat, ready to be rubbed away to find the date.",
    metaTitle: "Revelo: a scratch-to-reveal save the date link",
    metaDescription: "A save the date that arrives under a silver coat and gives up its date when rubbed. See the Revelo sample, then add your two names and countdown in a minute.",
    palette: {
      paper: "#EFEDE6",
      ink: "#22262B",
      muted: "#6E7378",
      rule: "#C9C3B2",
      accent: "#B08D3C",
    },
    opener: "foil",
    openerName: "The foil",
    sample: { a: "Renata", b: "Nikolai", date: "2028-10-26" },
    spec: {
      paper: "Pale plaster, silver",
      ink: "Slate, gold leaf",
      faces: "Italiana, Jost",
    },
    whatItIs: [
      "Revelo is built around a withheld date. The page is pale plaster, the lettering is slate, and a coat of silver covers the one line that matters until the guest decides to take it off.",
      "That is the entire idea, and it explains why the rest is so quiet. Two names, a countdown and a single touch of gold leaf are all that is on the page, because the surprise should be the only event.",
    ],
    whoItSuits: [
      "Couples with friends who like a game, or a family group chat where a date should arrive as a small piece of news rather than a flat announcement. It rewards a guest who is curious.",
      "It also suits a wedding that is a surprise in some way, such as a long-planned destination, because the pause before the reveal gives the news a moment to land before it is read.",
    ],
    typography: [
      "Names and date are set in Italiana, in tracked capitals with generous space between the letters, which gives the slate lettering the look of a stamped label on a scratch card.",
      "Jost carries the small lines and the countdown in the grey that sits behind the ink. Gold appears only on the freshly revealed date, so the eye is sent to the thing that was hidden.",
    ],
    howItOpens: [
      "The foil. A silver layer lies across the page and the guest wipes it away with a finger. As it clears, the date appears beneath it and the gold catches for a moment.",
      "If a guest does not want to rub, a tap clears the coat in a single sweep. With reduced motion on, the coat is already off and the date is simply showing, which is the same news without the game.",
    ],
  },
  nameDe: "Revelo",
};
