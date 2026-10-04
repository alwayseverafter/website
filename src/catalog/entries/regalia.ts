import type { CatalogEntry } from "@/catalog/types";

/**
 * Regalia.
 *
 * A classic composition in royal violet on warm cream. The source design is a
 * conventional, formal layout with refined type; the translation keeps the
 * composition formal and lets one court colour carry the rank.
 */
export const entry: CatalogEntry = {
  id: "regalia",
  kind: "invitation",
  draft: false,
  theme: {
    dark: false,
    fonts: "classic",
    ornament: "deco",
    surface: "linen",
    motion: "fade-rise",
    lettering: "titlecase",
    chrome: "framed",
    palette: {
      bg: "#F5EFE2",
      surface: "#FFFBF2",
      ink: "#241A33",
      muted: "#6B6078",
      accent: "#5A2D82",
      accentSoft: "#E6DCEE",
      rule: "#C2B3CF",
      onAccent: "#FBF7FF",
    },
  },
  copy: {
    name: "Regalia",
    summary: "Cream linen, a formal frame and one court violet for a ceremony with rank.",
    metaTitle: "Regalia: a formal violet wedding invitation as a link",
    metaDescription:
      "A classic digital wedding invitation in cream and court violet, with a formal frame."
      + " Read the Regalia sample from the envelope down, then put your own names on it.",
    palette: {
      paper: "#F5EFE2",
      ink: "#241A33",
      muted: "#6B6078",
      rule: "#C2B3CF",
      accent: "#5A2D82",
    },
    opener: "envelope",
    openerName: "The envelope",
    sample: { a: "Aurelie", b: "Anselm", date: "2027-03-03" },
    spec: {
      paper: "Cream, linen weave",
      ink: "Aubergine, near black",
      faces: "Cormorant Garamond, Jost",
    },
    whatItIs: [
      "Regalia is the invitation you would expect a very formal family to send,"
      + " carried over to the phone without losing its manners. The page is a warm"
      + " cream with a faint linen weave, the text sits in a centred column, and"
      + " the whole thing is held inside a hairline frame.",
      "Colour is rationed. A single deep violet marks the names, the rules and"
      + " the small deco corner, and everything else is aubergine ink on cream."
      + " The effect is rank by restraint: nothing glitters, and nothing needs to.",
    ],
    whoItSuits: [
      "Couples hosting a ceremony with a programme, a dress code and a seating"
      + " plan. Cathedral weddings, hotel ballrooms, family-hosted receptions where"
      + " the older generation will open the link and expect to be addressed properly.",
      "It also suits anyone who wants the invitation to feel conventional on"
      + " purpose. If your day follows the traditional order of service, this"
      + " layout follows the same order and keeps every detail where guests look for it.",
    ],
    typography: [
      "The names are set in Cormorant Garamond at a generous size, in title case."
      + " It is a high-contrast serif with long, careful terminals, and at display"
      + " size it reads like copperplate without the flourishes that make copperplate tiring.",
      "Dates, places and times are Jost in small sizes, in a muted violet grey."
      + " The pairing is deliberately plain: one expressive face for the people,"
      + " one neutral face for the logistics, and nothing in between.",
    ],
    howItOpens: [
      "The envelope. The invitation arrives as a sealed envelope on the cream"
      + " ground; a tap lifts the flap and the card rises out and settles into"
      + " the framed page. It reads as paper being handled, not as an effect.",
      "The motion takes about two seconds and then stays out of the way. With"
      + " reduced motion set on the phone the envelope is skipped and the card"
      + " is simply already there, with exactly the same wording on it.",
    ],
  },
  nameDe: "Regalia",
};
