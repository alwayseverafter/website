import type { CatalogEntry } from "@/catalog/types";

/**
 * Velluto.
 *
 * Red velvet theatre curtains. With no image layer the curtain becomes a deep
 * oxblood ground with a fine grain for the pile, a warm gilt accent for the
 * fringe, and an envelope opener standing in for the curtain going up.
 */
export const entry: CatalogEntry = {
  id: "velluto",
  kind: "invitation",
  draft: false,
  theme: {
    dark: true,
    fonts: "classic",
    ornament: "none",
    surface: "grain",
    motion: "veil",
    lettering: "titlecase",
    chrome: "open",
    palette: {
      bg: "#2A0A10",
      surface: "#3A1219",
      ink: "#F6E9DC",
      muted: "#CBA9A4",
      accent: "#E3B96B",
      accentSoft: "#4A1A22",
      rule: "#6B2C36",
      onAccent: "#2A0A10",
    },
  },
  copy: {
    name: "Velluto",
    summary: "Oxblood velvet, a gilt fringe of colour and a grain like pile, curtain up on your day.",
    metaTitle: "Velluto: a red velvet theatre wedding invitation",
    metaDescription:
      "A deep red digital wedding invitation with a velvet grain and gilt accent, made for a"
      + " grand entrance. See the Velluto sample, then put your own names on stage.",
    palette: {
      paper: "#2A0A10",
      ink: "#F6E9DC",
      muted: "#CBA9A4",
      rule: "#6B2C36",
      accent: "#E3B96B",
    },
    opener: "envelope",
    openerName: "The envelope",
    sample: { a: "Francesca", b: "Fabien", date: "2027-08-13" },
    spec: {
      paper: "Oxblood velvet, grained",
      ink: "Warm stage cream",
      faces: "Cormorant Garamond, Jost",
    },
    whatItIs: [
      "Velluto is the page just before the curtain goes up. The ground is a"
      + " deep oxblood red with a fine grain across it, the way light sits on"
      + " velvet pile, and the text glows out of it in a warm stage cream.",
      "There is no frame and no motif. The drama is in the colour alone, with"
      + " a gilt gold picking out the date the way the fringe picks out the hem"
      + " of a curtain, and generous space left around everything else.",
    ],
    whoItSuits: [
      "A theatre, an opera house, a ballroom with a stage, or any evening that"
      + " is meant to feel like a performance. It suits a couple who want guests"
      + " to feel the lights go down before the first word is read.",
      "It also suits a winter or autumn date, when a dark red page feels natural"
      + " in the hand. Couples with a strong sense of occasion and a love of"
      + " the stage will find it says so before they have to.",
    ],
    typography: [
      "Names are in Cormorant Garamond, large and light, in title case. The"
      + " fine strokes stay sharp against the dark red and the italics, used"
      + " for the dates, have the look of a printed programme.",
      "Logistics are Jost at small sizes in a dusty rose that sits behind the"
      + " cream. Between the two faces and a single gold accent, the type does"
      + " the work of a playbill without needing a single picture.",
    ],
    howItOpens: [
      "The envelope. The invitation arrives sealed against the red ground, a"
      + " tap lifts the flap and the card rises out of it, and the page beneath"
      + " carries on as the first act. It stands in for the curtain going up.",
      "It takes about two seconds and settles without a bounce. With reduce-motion"
      + " on, the envelope is skipped entirely and the card is already open,"
      + " which keeps every name, date and detail exactly where they were.",
    ],
  },
  nameDe: "Velluto",
};
