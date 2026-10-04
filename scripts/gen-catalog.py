#!/usr/bin/env python3
"""Generate the catalogue stub files and the assembly index.

Run once, from the repo root:  python3 scripts/gen-catalog.py

It writes one stub per style under src/catalog/entries/ and rewrites
src/catalog/index.ts with an explicit import per style. It never overwrites an
entry file that already exists, so re-running it after agents have filled the
stubs in is safe and only refreshes the index.
"""

import pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
ENTRIES = ROOT / "src" / "catalog" / "entries"

# slug, our name, German name, kind, the source design this reinterprets.
# The source name is recorded only so the rename test can prove every name was
# actually changed; it is never shipped to a page.
DESIGNS = [
    ("vitrail", "Vitrail", "Vitrail", "invitation", "Stained Glass"),
    ("regalia", "Regalia", "Regalia", "invitation", "Royal"),
    ("diurne", "Diurne", "Diurne", "invitation", "Day & Night"),
    ("hacienda", "Hacienda", "Hacienda", "invitation", "La Finca"),
    ("maison-dor", "Maison d'Or", "Maison d'Or", "invitation", "La Maison Doree"),
    ("palazzo", "Palazzo", "Palazzo", "invitation", "Majestic"),
    ("velluto", "Velluto", "Velluto", "invitation", "Teatro"),
    ("belvedere", "Belvedere", "Belvedere", "invitation", "Bella Vista"),
    ("perla", "Perla", "Perla", "invitation", "Villa Perle"),
    ("riviera", "Riviera", "Riviera", "invitation", "Cap Blanc"),
    ("broderie", "Broderie", "Broderie", "invitation", "Embroidered Garden"),
    ("esmeralda", "Esmeralda", "Esmeralda", "invitation", "Prestige"),
    ("ricamo", "Ricamo", "Ricamo", "invitation", "Eleganza"),
    ("lario", "Lario", "Lario", "invitation", "Bellagio"),
    ("giardino", "Giardino", "Giardino", "invitation", "Secret Garden"),
    ("cygne", "Cygne", "Cygne", "invitation", "Odette"),
    ("papier", "Papier", "Papier", "invitation", "Papercraft"),
    ("regence", "Regence", "Regence", "invitation", "Bridgerton"),
    ("mosaico", "Mosaico", "Mosaico", "invitation", "Boho"),
    ("cadence", "Cadence", "Cadence", "invitation", "Minimal Fun"),
    ("laguna", "Laguna", "Laguna", "invitation", "Beach"),
    ("savane", "Savane", "Savane", "invitation", "Africa"),
    ("rosaio", "Rosaio", "Rosaio", "invitation", "Rosas"),
    ("gazette", "Gazette", "Gazette", "invitation", "Editorial"),
    ("fiore", "Fiore", "Fiore", "invitation", "Bloom"),
    ("amalfi", "Amalfi", "Amalfi", "invitation", "Dolce Vita"),
    ("marine", "Marine", "Marine", "invitation", "Nautical Edition"),
    ("levante", "Levante", "Levante", "invitation", "Mediterranean"),
    ("verger", "Verger", "Verger", "invitation", "Floral"),
    ("caramelo", "Caramelo", "Caramelo", "invitation", "Dulce Amor"),
    ("lineal", "Lineal", "Lineal", "invitation", "Minimalista"),
    ("voyage", "Voyage", "Voyage", "invitation", "Aventureros"),
    ("std-tourterelle", "Tourterelle", "Tourterelle", "save-the-date", "The Lovebirds"),
    ("std-grattage", "Grattage", "Grattage", "save-the-date", "Photo Scratch"),
    ("std-palatine", "Palatine", "Palatine", "save-the-date", "Majestic"),
    ("std-grattage-dentelle", "Grattage Dentelle", "Grattage Dentelle", "save-the-date", "Elegant Photo Scratch"),
    ("std-voile", "Voile", "Voile", "save-the-date", "The Soft Lace Edit"),
    ("std-dentelle", "Dentelle", "Dentelle", "save-the-date", "The Lace Edit"),
    ("std-cisne", "Cisne", "Cisne", "save-the-date", "Swans"),
    ("std-fleuron", "Fleuron", "Fleuron", "save-the-date", "Floral"),
    ("std-revelo", "Revelo", "Revelo", "save-the-date", "Interactive Scratch"),
    ("std-boccio", "Boccio", "Boccio", "save-the-date", "Bloom"),
    ("std-chandelle", "Chandelle", "Chandelle", "save-the-date", "Candlelight"),
    ("std-oasis", "Oasis", "Oasis", "save-the-date", "Oasis Royale"),
    ("std-jardin", "Jardin", "Jardin", "save-the-date", "Le Jardin"),
    ("std-cabana", "Cabana", "Cabana", "save-the-date", "Tropical"),
]

STUB = '''import type {{ CatalogEntry }} from "@/catalog/types";

/**
 * {name} — PLACEHOLDER.
 *
 * R12: `draft` is true, so this style is kept out of the gallery, the sitemap
 * and the router until it is written. `catalog.test.ts` names every draft that
 * is still outstanding. Fill this in per docs/CATALOG-BUILD-INSTRUCTIONS.md and
 * set `draft` to false in the same edit.
 */
export const entry: CatalogEntry = {{
  id: "{slug}",
  kind: "{kind}",
  draft: true,
  theme: {{
    dark: false,
    fonts: "classic",
    ornament: "none",
    surface: "none",
    motion: "fade-rise",
    lettering: "titlecase",
    chrome: "open",
    palette: {{
      bg: "#FFFFFF",
      surface: "#FFFFFF",
      ink: "#000000",
      muted: "#666666",
      accent: "#000000",
      accentSoft: "#EEEEEE",
      rule: "#CCCCCC",
      onAccent: "#FFFFFF",
    }},
  }},
  copy: {{
    name: "{name}",
    summary: "Placeholder.",
    metaTitle: "{name}",
    metaDescription: "Placeholder.",
    palette: {{
      paper: "#FFFFFF",
      ink: "#000000",
      muted: "#666666",
      rule: "#CCCCCC",
      accent: "#000000",
    }},
    opener: "direct",
    openerName: "Direct",
    sample: {{ a: "Placeholder", b: "Placeholder", date: "2027-01-01" }},
    spec: {{ paper: "Placeholder", ink: "Placeholder", faces: "Placeholder" }},
    whatItIs: ["Placeholder."],
    whoItSuits: ["Placeholder."],
    typography: ["Placeholder."],
    howItOpens: ["Placeholder."],
  }},
  nameDe: "{name_de}",
}};
'''

INDEX_HEAD = '''import type { CatalogEntry, ThemeKind } from "@/catalog/types";
import type { CatalogThemeId } from "@/invite/types";

/**
 * The catalogue, assembled.
 *
 * Every style is imported by name rather than globbed. A glob would resolve at
 * build time on the server and to nothing in a bundle, and it would make a
 * missing style a blank page instead of a failed build. This file is generated
 * by `scripts/gen-catalog.py`; add a style there and re-run it.
 *
 * `Record<CatalogThemeId, CatalogEntry>` is the completeness check: a slug in
 * `CATALOG_THEME_IDS` with no entry here is a type error, not a 404 found by a
 * customer.
 */

'''

INDEX_TAIL = '''
export const CATALOG: Record<CatalogThemeId, CatalogEntry> = {
__ENTRIES__
};

/** Every catalogue style, drafts included. Order follows `CATALOG_THEME_IDS`. */
export const CATALOG_ENTRIES: readonly CatalogEntry[] = Object.values(CATALOG);

/**
 * The styles a visitor may actually reach: everything that is not a draft.
 *
 * The gallery, the sitemap and `generateStaticParams` all read this, so an
 * unfinished style has no URL at all rather than a URL showing the word
 * "Placeholder". R12.
 */
export const PUBLISHED_ENTRIES: readonly CatalogEntry[] = CATALOG_ENTRIES.filter(
  (entry) => !entry.draft,
);

export function entriesOfKind(kind: ThemeKind): readonly CatalogEntry[] {
  return PUBLISHED_ENTRIES.filter((entry) => entry.kind === kind);
}
'''

SOURCES_HEAD = '''/**
 * The source design each catalogue style reinterprets.
 *
 * Test fixture only. Nothing renders this and nothing imports it outside
 * `catalog.test.ts`, where it proves that every shipped name differs from the
 * name of the design it was drawn from. Generated by `scripts/gen-catalog.py`.
 */
export const SOURCE_NAMES: Record<string, string> = {
'''


def ident(slug: str) -> str:
    """A slug as a JS identifier. `std-le-jardin` -> `stdLeJardin`."""
    head, *rest = slug.split("-")
    return head + "".join(part.capitalize() for part in rest)


def main() -> None:
    ENTRIES.mkdir(parents=True, exist_ok=True)

    created, kept = 0, 0
    for slug, name, name_de, kind, _source in DESIGNS:
        path = ENTRIES / f"{slug}.ts"
        if path.exists():
            kept += 1
            continue
        path.write_text(STUB.format(slug=slug, name=name, name_de=name_de, kind=kind))
        created += 1

    imports = "\n".join(
        f'import {{ entry as {ident(slug)} }} from "@/catalog/entries/{slug}";'
        for slug, *_ in DESIGNS
    )
    rows = "\n".join(f'  "{slug}": {ident(slug)},' for slug, *_ in DESIGNS)
    index = INDEX_HEAD + imports + "\n" + INDEX_TAIL.replace("__ENTRIES__", rows)
    (ROOT / "src" / "catalog" / "index.ts").write_text(index)

    source_rows = "\n".join(
        f'  "{slug}": "{source}",' for slug, _n, _d, _k, source in DESIGNS
    )
    (ROOT / "src" / "catalog" / "sources.ts").write_text(
        SOURCES_HEAD + source_rows + "\n};\n"
    )

    print(f"entries: {created} created, {kept} already present")
    print(f"index:   {len(DESIGNS)} styles wired")


if __name__ == "__main__":
    main()
