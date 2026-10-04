import type { CatalogEntry } from "@/catalog/types";

/**
 * Grattage Dentelle.
 *
 * The same gesture as Grattage, in the opposite material. Where that one is
 * machined silver on cool grey, this is woven thread on warm ivory, and the
 * sweep is pale rather than metallic.
 */
export const entry: CatalogEntry = {
  id: "std-grattage-dentelle",
  kind: "save-the-date",
  draft: false,
  theme: {
    dark: false,
    fonts: "classic",
    ornament: "weave",
    surface: "linen",
    motion: "fade-rise",
    lettering: "titlecase",
    chrome: "framed",
    palette: {
      bg: "#F8F5F0",
      surface: "#FFFFFF",
      ink: "#2B2723",
      muted: "#857E74",
      accent: "#A89C86",
      accentSoft: "#EBE5DA",
      rule: "#D5CDBF",
      onAccent: "#FFFDF9",
    },
  },
  copy: {
    name: "Grattage Dentelle",
    summary: "A lace-woven frame in soft ivory, cleared by a pale sweep of light.",
    metaTitle: "Grattage Dentelle: a lace scratch save the date",
    metaDescription: "A soft ivory digital save the date framed in woven lace, cleared by a pale sweep of light. See the whole sample, then put your own date on it today.",
    palette: {
      paper: "#F8F5F0",
      ink: "#2B2723",
      muted: "#857E74",
      rule: "#D5CDBF",
      accent: "#A89C86",
    },
    opener: "foil",
    openerName: "The foil",
    sample: { a: "Lena", b: "Ignacio", date: "2028-05-16" },
    spec: {
      paper: "Ivory, soft",
      ink: "Warm near black",
      faces: "Cormorant Garamond, Jost",
    },
    whatItIs: [
      "Grattage Dentelle sets the same reveal inside a lace frame. The ground is a soft ivory with a linen tooth, the frame is drawn in a woven glyph repeated along a hairline, and the sweep that clears it is pale rather than silver.",
      "It carries the same three things every save the date here carries: two names, the date, and the days between. The lace is the whole difference, and the difference is deliberate rather than decorative.",
    ],
    whoItSuits: [
      "A couple who like the reveal but not the scratch card, and who would rather the gesture arrived wrapped in something soft than in something metallic.",
      "It suits a spring or early summer date, a garden or an orangery, and a guest list that will read the lace as a reference rather than as a texture.",
    ],
    typography: [
      "Cormorant Garamond for the names in title case, with its italic ampersand, which is the one letterform on the page allowed to be ornamental.",
      "Jost carries the date and the count, small and in the warm grey, so the only things at full strength are the two names and the woven rule beneath them.",
    ],
    howItOpens: [
      "The foil, in pale ivory rather than silver. A sheet covers the save the date and one band of soft light travels across it before it clears.",
      "On this ground the sweep reads as light moving across cloth rather than across metal. Under reduced motion it does not play at all and the save the date is simply already open.",
    ],
  },
  nameDe: "Grattage Dentelle",
};
