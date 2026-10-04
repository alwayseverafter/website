import type { CatalogEntry } from "@/catalog/types";

/**
 * Verger.
 *
 * An orchard in blossom: blush ground, a leaf green for the branch and a
 * pink that stays pale. The source is a bouquet of drawn flowers; this
 * renderer has no drawing layer, so the translation is a spring morning in
 * colour and one leaf glyph standing for the whole tree.
 */
export const entry: CatalogEntry = {
  id: "verger",
  kind: "invitation",
  draft: false,
  theme: {
    dark: false,
    fonts: "editorial",
    ornament: "leaf",
    surface: "none",
    motion: "fade-rise",
    lettering: "titlecase",
    chrome: "open",
    palette: {
      bg: "#FBF2EF",
      surface: "#FFF8F6",
      ink: "#33272B",
      muted: "#86707A",
      accent: "#4F7A3A",
      accentSoft: "#F2D4D8",
      rule: "#DDB9BE",
      onAccent: "#FBFFF8",
    },
  },
  copy: {
    name: "Verger",
    summary:
      "Blush petal ground, orchard leaf green, and soft pink that never turns sugary.",
    metaTitle: "Verger: an orchard-in-bloom wedding invitation link",
    metaDescription:
      "A blush digital wedding invitation with orchard leaf green and petal pink, set open and airy."
      + " Read the Verger sample, then put your own names on it.",
    palette: {
      paper: "#FBF2EF",
      ink: "#33272B",
      muted: "#86707A",
      rule: "#DDB9BE",
      accent: "#4F7A3A",
    },
    opener: "envelope",
    openerName: "The envelope",
    sample: { a: "Dorothea", b: "Benedikt", date: "2028-06-17" },
    spec: {
      paper: "Blush, petal pale",
      ink: "Plum brown, leaf green accent",
      faces: "Playfair Display, Jost",
    },
    whatItIs: [
      "Verger is the week the fruit trees flower. The ground is a blush that"
      + " leans toward white, the ink is a plum brown rather than black, and the"
      + " accent is the green of new leaves, kept darker than you expect so that"
      + " it stays readable against the pink.",
      "Nothing is boxed in. The sections are separated by space and by a leaf"
      + " glyph repeated as a quiet divider, so the page reads like a path"
      + " through rows of trees, with room on either side.",
    ],
    whoItSuits: [
      "Garden weddings, orchards, farm barns and long lunches under trees. It"
      + " suits late spring and early summer best, when the colours outside will"
      + " match the ones on the guest's phone.",
      "Couples who like flowers but not a heavy floral print will find it"
      + " restrained. The garden is suggested by colour and one glyph, so the"
      + " invitation stays calm even for a large and busy celebration.",
    ],
    typography: [
      "Names are set in an editorial serif with sharp contrast and a slight"
      + " lean toward fashion, in title case. It gives the soft palette some"
      + " bite, which stops the page from drifting into sweetness.",
      "Everything else is a light sans in a dusty plum for the secondary text."
      + " The green is used for links and the main button only, which means it"
      + " always signals something a guest can actually do.",
    ],
    howItOpens: [
      "The envelope. A blush envelope sits on the screen, the flap folds back"
      + " and the card slides up and out, as if lifted from a basket of"
      + " blossom. It is a gentle reveal and has no flourish at the end.",
      "The whole thing takes about two seconds and plays once. With reduced"
      + " motion switched on the envelope is skipped, and the card is already"
      + " standing open with every detail in its place.",
    ],
  },
  nameDe: "Verger",
};
