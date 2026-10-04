import Link from "next/link";
import type { Locale } from "@/invite/types";
import styles from "./Gallery.module.css";

/**
 * The link into the catalogue.
 *
 * WHY it exists: /styles and its style pages are the entire organic surface of
 * this business, and until this section shipped the home page did not link to
 * any of them. The highest-authority page on the site pointed at nothing, so
 * the hub was an orphan to a crawler and invisible to a visitor who had just
 * met one style and wanted to see the rest.
 *
 * WHY here, after The Mirror: the visitor has just put their own names on an
 * invitation, which is the moment the question changes from "do I want this"
 * to "which one". Earlier would interrupt the conversion engine; later would
 * sit behind The Choice, where the only thing left to do is buy.
 *
 * A server component. It holds no state and no handler, so it costs no
 * JavaScript and paints with the document.
 */

type Copy = {
  kicker: string;
  /** The count is passed in rather than written, so it cannot go stale. */
  heading: (count: string) => string;
  lede: string;
  cta: string;
};

const COPY: Record<Locale, Copy> = {
  en: {
    kicker: "The catalogue",
    heading: (count) => `${count} of them.`,
    lede:
      "You have seen one. Every other is a complete invitation you can open and"
      + " read end to end, not a swatch on a colour card.",
    cta: "See every style",
  },
  de: {
    kicker: "Der Katalog",
    heading: (count) => `${count} davon.`,
    lede:
      "Ihr habt einen gesehen. Jeder andere ist eine vollständige Einladung zum"
      + " Öffnen und Lesen, kein Farbmuster.",
    cta: "Alle Stile ansehen",
  },
};

const HEADING_ID = "gallery-heading";

export type GalleryProps = {
  locale?: Locale;
  /**
   * How many styles the gallery lists, already spelled.
   *
   * Passed down from the page rather than read from `@/lib/seo` here, and that
   * is load bearing: `seo.ts` pulls in `@/catalog`, which is forty-six entry
   * modules of editorial copy. Importing it from inside the client boundary
   * would ship every one of them to the browser to render a single number.
   */
  count: string;
};

/**
 * The catalogue is English only. `localeHref` would happily mint `/de/styles`
 * and every German visitor would meet a 404, so this link is the bare path in
 * both locales while the label translates. See `catalog-de.test.ts`, which
 * pins the same fact from the other side.
 */
const GALLERY_HREF = "/styles";

export function Gallery({ locale = "en", count }: GalleryProps) {
  const copy = COPY[locale];

  return (
    <section id="gallery" className={styles.gallery} aria-labelledby={HEADING_ID}>
      <div className="wrap">
        <p className={`kicker ${styles.kicker}`}>{copy.kicker}</p>
        <h2 id={HEADING_ID} className={`display ${styles.h}`}>
          {copy.heading(count)}
        </h2>
        <p className={`lede ${styles.lede}`}>{copy.lede}</p>
        <Link href={GALLERY_HREF} className={styles.cta}>
          {copy.cta}
        </Link>
      </div>
    </section>
  );
}
