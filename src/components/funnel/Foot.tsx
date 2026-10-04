import Link from "next/link";

import type { Locale } from "@/invite/types";
import { catalogue, localeHref } from "@/lib/i18n";
import styles from "./Foot.module.css";

/**
 * The funnel's foot. The only standing navigation on the home page.
 *
 * WHY it exists: `sitemap.ts` says legal pages "are reachable from the footer
 * and do not need ranking", and the design spec requires the Impressum on
 * every publicly reachable page once we sell into DE. The home page had no
 * footer, so on the one page that gets the traffic neither was true. It also
 * gives the gallery a second, permanent entrance for a visitor who scrolled
 * past The Catalogue without stopping.
 *
 * WHY below The Close rather than above it: The Close is the only call to
 * action on this page and nothing may compete with it. A link a visitor
 * reaches only after declining to press the button costs that button nothing.
 *
 * A server component: no state, no handler, no JavaScript.
 */

/**
 * The catalogue is English only.
 *
 * `localeHref("/styles", "de")` returns `/de/styles`, which does not exist and
 * would 404 every German visitor who pressed it. The legal pages below have a
 * real German twin each and are mapped; this one deliberately is not. R3: the
 * link that cannot be localised says so here rather than degrading into a dead
 * URL. `catalog-de.test.ts` pins the same fact from the other side.
 */
const GALLERY_HREF = "/styles";

/** The label does translate, even though the destination does not. */
const GALLERY_LABEL: Record<Locale, string> = {
  en: "The styles",
  de: "Die Stile",
};

export function Foot({ locale = "en" }: { locale?: Locale }) {
  const c = catalogue(locale);

  return (
    <footer className={styles.foot}>
      <nav className={`wrap ${styles.nav}`} aria-label={c.brand}>
        <Link href={GALLERY_HREF} className={`${styles.link} ${styles.first}`}>
          {GALLERY_LABEL[locale]}
        </Link>
        <Link href={localeHref("/legal/terms", locale)} className={styles.link}>
          {c.legal.nav.terms}
        </Link>
        <Link href={localeHref("/legal/privacy", locale)} className={styles.link}>
          {c.legal.nav.privacy}
        </Link>
        <Link href={localeHref("/impressum", locale)} className={styles.link}>
          {c.legal.nav.imprint}
        </Link>
      </nav>
    </footer>
  );
}
