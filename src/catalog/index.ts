import type { CatalogEntry, ThemeKind } from "@/catalog/types";
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

import { entry as vitrail } from "@/catalog/entries/vitrail";
import { entry as regalia } from "@/catalog/entries/regalia";
import { entry as diurne } from "@/catalog/entries/diurne";
import { entry as hacienda } from "@/catalog/entries/hacienda";
import { entry as maisonDor } from "@/catalog/entries/maison-dor";
import { entry as palazzo } from "@/catalog/entries/palazzo";
import { entry as velluto } from "@/catalog/entries/velluto";
import { entry as belvedere } from "@/catalog/entries/belvedere";
import { entry as perla } from "@/catalog/entries/perla";
import { entry as riviera } from "@/catalog/entries/riviera";
import { entry as broderie } from "@/catalog/entries/broderie";
import { entry as esmeralda } from "@/catalog/entries/esmeralda";
import { entry as ricamo } from "@/catalog/entries/ricamo";
import { entry as lario } from "@/catalog/entries/lario";
import { entry as giardino } from "@/catalog/entries/giardino";
import { entry as cygne } from "@/catalog/entries/cygne";
import { entry as papier } from "@/catalog/entries/papier";
import { entry as regence } from "@/catalog/entries/regence";
import { entry as mosaico } from "@/catalog/entries/mosaico";
import { entry as cadence } from "@/catalog/entries/cadence";
import { entry as laguna } from "@/catalog/entries/laguna";
import { entry as savane } from "@/catalog/entries/savane";
import { entry as rosaio } from "@/catalog/entries/rosaio";
import { entry as gazette } from "@/catalog/entries/gazette";
import { entry as fiore } from "@/catalog/entries/fiore";
import { entry as amalfi } from "@/catalog/entries/amalfi";
import { entry as marine } from "@/catalog/entries/marine";
import { entry as levante } from "@/catalog/entries/levante";
import { entry as verger } from "@/catalog/entries/verger";
import { entry as caramelo } from "@/catalog/entries/caramelo";
import { entry as lineal } from "@/catalog/entries/lineal";
import { entry as voyage } from "@/catalog/entries/voyage";
import { entry as stdTourterelle } from "@/catalog/entries/std-tourterelle";
import { entry as stdGrattage } from "@/catalog/entries/std-grattage";
import { entry as stdPalatine } from "@/catalog/entries/std-palatine";
import { entry as stdGrattageDentelle } from "@/catalog/entries/std-grattage-dentelle";
import { entry as stdVoile } from "@/catalog/entries/std-voile";
import { entry as stdDentelle } from "@/catalog/entries/std-dentelle";
import { entry as stdCisne } from "@/catalog/entries/std-cisne";
import { entry as stdFleuron } from "@/catalog/entries/std-fleuron";
import { entry as stdRevelo } from "@/catalog/entries/std-revelo";
import { entry as stdBoccio } from "@/catalog/entries/std-boccio";
import { entry as stdChandelle } from "@/catalog/entries/std-chandelle";
import { entry as stdOasis } from "@/catalog/entries/std-oasis";
import { entry as stdJardin } from "@/catalog/entries/std-jardin";
import { entry as stdCabana } from "@/catalog/entries/std-cabana";

export const CATALOG: Record<CatalogThemeId, CatalogEntry> = {
  "vitrail": vitrail,
  "regalia": regalia,
  "diurne": diurne,
  "hacienda": hacienda,
  "maison-dor": maisonDor,
  "palazzo": palazzo,
  "velluto": velluto,
  "belvedere": belvedere,
  "perla": perla,
  "riviera": riviera,
  "broderie": broderie,
  "esmeralda": esmeralda,
  "ricamo": ricamo,
  "lario": lario,
  "giardino": giardino,
  "cygne": cygne,
  "papier": papier,
  "regence": regence,
  "mosaico": mosaico,
  "cadence": cadence,
  "laguna": laguna,
  "savane": savane,
  "rosaio": rosaio,
  "gazette": gazette,
  "fiore": fiore,
  "amalfi": amalfi,
  "marine": marine,
  "levante": levante,
  "verger": verger,
  "caramelo": caramelo,
  "lineal": lineal,
  "voyage": voyage,
  "std-tourterelle": stdTourterelle,
  "std-grattage": stdGrattage,
  "std-palatine": stdPalatine,
  "std-grattage-dentelle": stdGrattageDentelle,
  "std-voile": stdVoile,
  "std-dentelle": stdDentelle,
  "std-cisne": stdCisne,
  "std-fleuron": stdFleuron,
  "std-revelo": stdRevelo,
  "std-boccio": stdBoccio,
  "std-chandelle": stdChandelle,
  "std-oasis": stdOasis,
  "std-jardin": stdJardin,
  "std-cabana": stdCabana,
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
