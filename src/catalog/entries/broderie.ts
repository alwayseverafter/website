import type { CatalogEntry } from "@/catalog/types";

/**
 * Broderie.
 *
 * A reading of the source design in colour and type only: no artwork, just
 * the palette, face pairing and ornament that carry the same feeling.
 */
export const entry: CatalogEntry = {
  id: "broderie",
  kind: "invitation",
  draft: false,
  theme: {
    dark: false,
    fonts: "editorial",
    ornament: "leaf",
    surface: "none",
    motion: "fade-rise",
    lettering: "titlecase",
    chrome: "framed",
    palette: {
      bg: "#F4F1F8",
      surface: "#FDFCFF",
      ink: "#2A2433",
      muted: "#75698A",
      accent: "#5F4B93",
      accentSoft: "#E4DCF0",
      rule: "#C4B8DA",
      onAccent: "#FFFFFF",
    },
  },
  copy: {
    name: "Broderie",
    summary: "Wisteria lavender on white thread, framed like a sampler from a Provencal villa.",
    metaTitle: "Broderie: a wisteria lavender wedding invitation online",
    metaDescription: "A lavender-white digital wedding invitation stitched in wisteria violet and framed like a sampler. Read the Broderie sample, then add your own two names to it.",
    palette: {
      paper: "#F4F1F8",
      ink: "#2A2433",
      muted: "#75698A",
      rule: "#C4B8DA",
      accent: "#5F4B93",
    },
    opener: "envelope",
    openerName: "The envelope",
    sample: { a: "Johanna", b: "Jakob", date: "2027-04-16" },
    spec: {
      paper: "White, lavender-tinged",
      ink: "Aubergine, near black",
      faces: "Fraunces, Jost",
    },
    whatItIs: [
      "Broderie is white thread on white cloth, with one coloured thread added: a wisteria violet that runs through the rules and the leaf glyph. The ground has a lavender tint that is cool and light, which sets it well apart from the cream and parchment invitations around it.",
      "Every section is framed, as if worked into a sampler, and the leaf ornament is the single repeated stitch. The result is more structured than the open styles, with the formality of a piece made to be hung on a wall.",
    ],
    whoItSuits: [
      "A country house in Provence, a walled garden, a wedding with wisteria or lavender in the arrangements. It is for couples who love handwork and want an invitation with a sense of being made slowly.",
      "It suits a spring date especially well, but the cool violet does not tie it to one season. A late-summer wedding in the same garden would carry it just as comfortably.",
    ],
    typography: [
      "Names are set in Fraunces, a soft-serif editorial face with a gentle wonk in its curves. In title case at a large size it looks hand-cut, as though the letters had been appliqued, which suits the embroidery idea well.",
      "The details use Jost in a muted violet grey and stay small and tidy, as the stitching on the reverse of a good piece would. Two faces and one thread colour keep the framed layout composed.",
    ],
    howItOpens: [
      "The envelope. A lavender-lined envelope opens and the card lifts clear of it, settling into its frame. The movement is gentle, and the frame lines appear just after the card does, like a border being sewn in.",
      "It takes about two seconds in total. Guests with reduce motion enabled see no envelope at all and arrive straight at the open invitation.",
    ],
  },
  nameDe: "Broderie",
};
