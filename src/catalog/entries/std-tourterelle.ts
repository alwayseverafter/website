import type { CatalogEntry } from "@/catalog/types";

/**
 * Tourterelle.
 *
 * The quietest of the save the dates. Two birds became two names and a
 * pair of leaf glyphs; everything else was removed, which is what a save
 * the date is for.
 */
export const entry: CatalogEntry = {
  id: "std-tourterelle",
  kind: "save-the-date",
  draft: false,
  theme: {
    dark: false,
    fonts: "garamond",
    ornament: "leaf",
    surface: "linen",
    motion: "fade-rise",
    lettering: "titlecase",
    chrome: "open",
    palette: {
      bg: "#F2F1EE",
      surface: "#FFFFFF",
      ink: "#2C2A26",
      muted: "#7E7A72",
      accent: "#8F8B80",
      accentSoft: "#E4E2DB",
      rule: "#CFCCC3",
      onAccent: "#FAF9F6",
    },
  },
  copy: {
    name: "Tourterelle",
    summary: "Dove grey on warm linen, two names and a count of the days between.",
    metaTitle: "Tourterelle: a dove-grey save the date as a link",
    metaDescription: "A dove-grey digital save the date. Two names, one date and a live countdown, set in Cormorant on warm linen. See the full sample and send yours.",
    palette: {
      paper: "#F2F1EE",
      ink: "#2C2A26",
      muted: "#7E7A72",
      rule: "#CFCCC3",
      accent: "#8F8B80",
    },
    opener: "direct",
    openerName: "Direct",
    sample: { a: "Helena", b: "Florian", date: "2028-10-20" },
    spec: {
      paper: "Dove grey, warm",
      ink: "Soft black",
      faces: "Cormorant Garamond throughout",
    },
    whatItIs: [
      "Tourterelle is a save the date and nothing more. Two names, one date, and a count of the days between now and it. There is no ceremony time, no venue and no practical line, because none of that is decided yet when this goes out.",
      "The ground is a warm dove grey with a linen tooth, and the only marks on it are a hairline and a small leaf at each end of it. The restraint is the product: a save the date that tried to say more would be an invitation sent a year early.",
    ],
    whoItSuits: [
      "A couple who have set a date and booked nothing else, and who want the people they love to hold the day before anything else claims it.",
      "It suits a guest list that spans generations, because there is nothing in it to have an opinion about and nothing anyone needs to interpret.",
    ],
    typography: [
      "Cormorant Garamond throughout, set light and large for the names and small for the date. One family means no contrast to manage, which is why the page reads as calm rather than as composed.",
      "The count of days is set in the same face at the small size, in the grey that sits one step back from the ink, so the number never competes with the two names above it.",
    ],
    howItOpens: [
      "Direct. There is no cover to lift and no envelope to tear: the save the date is simply there when the link opens, which suits a message whose whole content is a single date.",
      "The names and the rule rise a few pixels as the page settles, over about half a second. On a phone set to reduce motion nothing moves and the page is already at rest.",
    ],
  },
  nameDe: "Tourterelle",
};
