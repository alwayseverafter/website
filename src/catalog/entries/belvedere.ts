import type { CatalogEntry } from "@/catalog/types";

/**
 * Belvedere.
 *
 * A reading of the source design in colour and type only: no artwork, just
 * the palette, face pairing and ornament that carry the same feeling.
 */
export const entry: CatalogEntry = {
  id: "belvedere",
  kind: "invitation",
  draft: false,
  theme: {
    dark: false,
    fonts: "garamond",
    ornament: "leaf",
    surface: "plaster",
    motion: "fade-rise",
    lettering: "titlecase",
    chrome: "open",
    palette: {
      bg: "#F1F0DE",
      surface: "#FAF9EC",
      ink: "#2B3020",
      muted: "#66694F",
      accent: "#6F7420",
      accentSoft: "#E3E4C4",
      rule: "#BDBF98",
      onAccent: "#FFFFF4",
    },
  },
  copy: {
    name: "Belvedere",
    summary: "Sunlit olive and soft plaster, a Tuscan terrace at golden hour under string lights.",
    metaTitle: "Belvedere: a Tuscan terrace wedding invitation online",
    metaDescription: "A Tuscan-watercolour digital wedding invitation in olive and warm plaster, lit like a terrace at dusk. Read the Belvedere sample, then add your own two names.",
    palette: {
      paper: "#F1F0DE",
      ink: "#2B3020",
      muted: "#66694F",
      rule: "#BDBF98",
      accent: "#6F7420",
    },
    opener: "envelope",
    openerName: "The envelope",
    sample: { a: "Giulia", b: "Gaspard", date: "2027-09-20" },
    spec: {
      paper: "Plaster, sage-tinged",
      ink: "Olive, near black",
      faces: "Cormorant Garamond, Jost",
    },
    whatItIs: [
      "Belvedere takes its cue from a terrace above a valley, where the afternoon has gone gold and someone has just switched on the string lights. The ground is a pale, sage-tinged plaster rather than cream, and the single colour that carries it is a deep olive that shows up at the rules and the small leaf glyph.",
      "The layout stays open. Nothing is boxed in; sections are separated by air and a short leaf rule, the way tables on a terrace are separated by lawn, and the soft grain of the plaster surface stands in for the washes of watercolour the original reaches for.",
    ],
    whoItSuits: [
      "An Italian villa, a hillside agriturismo, an olive grove, any wedding that begins in the late afternoon and runs well into the evening. It suits couples who want the invitation to feel like warm air rather than formality.",
      "It also works for destination weddings, because the olive and plaster palette reads as place without naming one. Guests flying in from elsewhere get a sense of the setting before they have booked a single train.",
    ],
    typography: [
      "The names are set in Cormorant Garamond in title case, generous in size and light in weight, with the long old-style ascenders that suit a name such as Giulia or Gaspard. Garamond forms feel written rather than printed, which is the register a garden party wants.",
      "Practical details are set in Jost, small and in a muted olive grey that sits one step back from the ink. The contrast between the two faces is the only ornament the typography needs, and it keeps long guest information easy to scan on a phone.",
    ],
    howItOpens: [
      "The envelope. A cream envelope sits on the screen, its flap lifts, and the card rises out of it into the open layout. Nothing spins or bounces; the movement is the slow, unhurried lift of someone drawing a card from its sleeve.",
      "The whole sequence takes about two seconds. For guests who have asked their phone to reduce motion, the envelope step is skipped and the invitation is simply there, complete and legible from the first frame.",
    ],
  },
  nameDe: "Belvedere",
};
