import type { CatalogEntry } from "@/catalog/types";

/**
 * Lineal.
 *
 * The stripped-back reading: a cool grey-stone ground, near-black ink and one
 * signal orange used as a single rule. It stays apart from the other minimal
 * style by being cool where that one is white, and by using a geometric sans
 * in title case rather than spaced capitals. No ornament, no surface, no
 * animation: the only decoration is the line.
 */
export const entry: CatalogEntry = {
  id: "lineal",
  kind: "invitation",
  draft: false,
  theme: {
    dark: false,
    fonts: "geometric",
    ornament: "none",
    surface: "none",
    motion: "none",
    lettering: "titlecase",
    chrome: "open",
    palette: {
      bg: "#ECEDEE",
      surface: "#F6F7F7",
      ink: "#1B1D20",
      muted: "#5F656B",
      accent: "#C2410C",
      accentSoft: "#E4D9D3",
      rule: "#B8BCC0",
      onAccent: "#FFFFFF",
    },
  },
  copy: {
    name: "Lineal",
    summary:
      "Cool stone grey, near-black type, and one orange line. Nothing else is added.",
    metaTitle: "Lineal: a minimal geometric wedding invitation link",
    metaDescription:
      "A fully minimal digital wedding invitation in cool stone grey with one orange line."
      + " Read the Lineal sample, then set your own names and date in a minute.",
    palette: {
      paper: "#ECEDEE",
      ink: "#1B1D20",
      muted: "#5F656B",
      rule: "#B8BCC0",
      accent: "#C2410C",
    },
    opener: "direct",
    openerName: "Straight in",
    sample: { a: "Fiona", b: "Diego", date: "2028-08-06" },
    spec: {
      paper: "Cool stone grey",
      ink: "Near black, orange rule",
      faces: "Jost",
    },
    whatItIs: [
      "Lineal removes everything that can be removed and then checks that the"
      + " invitation still works. The ground is a cool stone grey, the ink is"
      + " close to black, and the sole colour is an orange used for a rule and"
      + " for the reply button.",
      "There is no frame, no glyph, no texture and no animation. The structure"
      + " is carried by spacing and by thin grey lines, so a guest can see where"
      + " one block of information ends and the next begins.",
    ],
    whoItSuits: [
      "Couples who find most wedding stationery fussy: a gallery or a loft, a"
      + " civil ceremony, a day built around the food and the people rather than"
      + " the decor. It looks at home next to a modern venue.",
      "It is also the fastest to read. With nothing to wait for and nothing"
      + " competing with the details, a guest on a bus or in a queue gets the"
      + " date, the place and the reply link in a single glance.",
    ],
    typography: [
      "Everything is set in one geometric sans, in title case. The names are"
      + " simply larger and lighter than the rest, which is how the hierarchy is"
      + " made; there is no second face to carry the romance.",
      "Weight does the work that ornament usually does. Names are light,"
      + " labels are medium, and the details sit in a mid grey. The orange line"
      + " under the names is the only mark on the page that is not text.",
    ],
    howItOpens: [
      "Straight in. There is no cover, no veil and no envelope, so the"
      + " invitation is on screen the moment the link loads. Nothing has to be"
      + " tapped or waited for before the guest can start reading.",
      "Since there is no motion at all, the reduce-motion setting changes"
      + " nothing here. It is the same page for every guest on every device,"
      + " and it loads as quickly as a page of text can.",
    ],
  },
  nameDe: "Lineal",
};
