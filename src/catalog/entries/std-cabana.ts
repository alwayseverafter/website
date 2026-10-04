import type { CatalogEntry } from "@/catalog/types";

/**
 * Cabana — PLACEHOLDER.
 *
 * R12: `draft` is true, so this style is kept out of the gallery, the sitemap
 * and the router until it is written. `catalog.test.ts` names every draft that
 * is still outstanding. Fill this in per docs/CATALOG-BUILD-INSTRUCTIONS.md and
 * set `draft` to false in the same edit.
 */
export const entry: CatalogEntry = {
  id: "std-cabana",
  kind: "save-the-date",
  draft: true,
  theme: {
    dark: false,
    fonts: "classic",
    ornament: "none",
    surface: "none",
    motion: "fade-rise",
    lettering: "titlecase",
    chrome: "open",
    palette: {
      bg: "#FFFFFF",
      surface: "#FFFFFF",
      ink: "#000000",
      muted: "#666666",
      accent: "#000000",
      accentSoft: "#EEEEEE",
      rule: "#CCCCCC",
      onAccent: "#FFFFFF",
    },
  },
  copy: {
    name: "Cabana",
    summary: "Placeholder.",
    metaTitle: "Cabana",
    metaDescription: "Placeholder.",
    palette: {
      paper: "#FFFFFF",
      ink: "#000000",
      muted: "#666666",
      rule: "#CCCCCC",
      accent: "#000000",
    },
    opener: "direct",
    openerName: "Direct",
    sample: { a: "Placeholder", b: "Placeholder", date: "2027-01-01" },
    spec: { paper: "Placeholder", ink: "Placeholder", faces: "Placeholder" },
    whatItIs: ["Placeholder."],
    whoItSuits: ["Placeholder."],
    typography: ["Placeholder."],
    howItOpens: ["Placeholder."],
  },
  nameDe: "Cabana",
};
