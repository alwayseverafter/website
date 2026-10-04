import type { CatalogEntry } from "@/catalog/types";

/**
 * Marine.
 *
 * A night-water reading of the nautical direction: deep navy ground, sailcloth
 * cream ink and one rope-gold accent. The source draws shells and knots; this
 * renderer draws colour and type, so the translation is to the hour after
 * sunset on a deck. The weave ornament is the rope, reduced to a braid.
 */
export const entry: CatalogEntry = {
  id: "marine",
  kind: "invitation",
  draft: false,
  theme: {
    dark: true,
    fonts: "classic",
    ornament: "weave",
    surface: "linen",
    motion: "fade-rise",
    lettering: "tracked-caps",
    chrome: "framed",
    palette: {
      bg: "#0F2342",
      surface: "#16305A",
      ink: "#F4EFE3",
      muted: "#A9B8D0",
      accent: "#D9B779",
      accentSoft: "#243F6B",
      rule: "#3A5788",
      onAccent: "#0F2342",
    },
  },
  copy: {
    name: "Marine",
    summary:
      "Deep navy water, sailcloth cream lettering, and a single braid of rope gold.",
    metaTitle: "Marine: a navy nautical wedding invitation as a link",
    metaDescription:
      "A deep navy digital wedding invitation with cream lettering and rope-gold detail."
      + " Read the full Marine sample, then swap in your own two names in a minute.",
    palette: {
      paper: "#0F2342",
      ink: "#F4EFE3",
      muted: "#A9B8D0",
      rule: "#3A5788",
      accent: "#D9B779",
    },
    opener: "envelope",
    openerName: "The envelope",
    sample: { a: "Bianca", b: "Zeno", date: "2028-04-03" },
    spec: {
      paper: "Deep navy, sailcloth texture",
      ink: "Cream, rope gold accent",
      faces: "Cormorant Garamond, Jost",
    },
    whatItIs: [
      "Marine starts at the hour the harbour lights come on. The ground is a"
      + " saturated navy rather than a pale sea blue, the lettering is the warm"
      + " cream of old sailcloth, and the one bright note is a rope gold that"
      + " appears at the rule, the glyph and the button.",
      "Because the page is dark, it behaves like a deck at night: the text sits"
      + " forward and the surface falls away behind it. A faint linen weave under"
      + " the navy keeps the large field from reading as a flat screen.",
    ],
    whoItSuits: [
      "Weddings by the water, on a quay, aboard a boat or in a club house with"
      + " brass fittings. It also suits an evening ceremony, where a dark"
      + " invitation matches the light the guests will arrive into.",
      "Couples who want a nautical feeling without anchors and stripes will like"
      + " it, because everything here is carried by colour and one braided glyph."
      + " Nothing in it is a cartoon, so it stays formal.",
    ],
    typography: [
      "Names and headings are set in tracked capitals, which gives them the"
      + " carved, spaced look of lettering on a ship's brass plate. The face is"
      + " an old-style serif with a high contrast, and the spacing does the work.",
      "Details such as times and addresses are in a plain sans, set in a pale"
      + " blue grey that sits one step back from the cream. The result is three"
      + " tones of text and one gold, which is enough hierarchy for a long page.",
    ],
    howItOpens: [
      "The envelope. The invitation arrives sealed, the flap lifts, and the"
      + " card rises out of it and settles into place. The gold of the seal is"
      + " the first thing guests see against the navy, so the reveal has a focus.",
      "It plays once and takes about two seconds. On a phone set to reduce"
      + " motion the envelope never appears and the card is simply there, with"
      + " the same words and the same buttons waiting for the guest.",
    ],
  },
  nameDe: "Marine",
};
