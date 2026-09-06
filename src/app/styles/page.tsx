import type { Metadata } from "next";
import Link from "next/link";

import { InvitePreview } from "@/invite/InvitePreview";
import {
  absoluteUrl,
  SITE_NAME,
  STYLE_COUNT,
  STYLE_NOUN,
  THEME_COPY,
  THEME_ORDER,
  sampleCouple,
  themePath,
} from "@/lib/seo";
import styles from "./styles.module.css";

/**
 * The gallery index.
 *
 * WHY it exists: the funnel is one page and a single page ranks for a single
 * intent. This is the hub that gives the eight style pages an internal link
 * each, and it is the page that "digital wedding invitation styles" can land
 * on. It is fully static, has no client component in it, and ships no
 * JavaScript of its own.
 */

const TITLE = `${STYLE_COUNT} wedding invitation ${STYLE_NOUN}, one flat price`;
const DESCRIPTION =
  `${STYLE_COUNT} digital wedding invitation ${STYLE_NOUN} you can read in full, not a swatch.`
  + " One price per wedding, unlimited guests.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: absoluteUrl("/styles") },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: TITLE,
    description: DESCRIPTION,
    url: absoluteUrl("/styles"),
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

export default function StylesPage() {
  /*
   * ItemList rather than CollectionPage. A crawler that understands this gets
   * the eight member URLs in the order a reader sees them, which is the only
   * thing structured data can usefully add to an index page.
   */
  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Wedding invitation styles",
    numberOfItems: THEME_ORDER.length,
    itemListElement: THEME_ORDER.map((theme, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: THEME_COPY[theme].name,
      url: absoluteUrl(themePath(theme)),
    })),
  };

  return (
    <main className={`wrap ${styles.page}`}>
      <script
        type="application/ld+json"
        // Serialised from a literal we control, so there is no untrusted input here.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }}
      />

      <header className={styles.top}>
        <Link href="/?from=styles" className={styles.wordmark}>
          {SITE_NAME}
        </Link>
      </header>

      <hr className={styles.rule} />

      <section className={styles.intro}>
        <p className="kicker">The styles</p>
        <h1 className={`display ${styles.h1}`}>
          {THEME_ORDER.length === 1
            ? "One way to say the same two names"
            : `${STYLE_COUNT} ways to say the same two names`}
        </h1>
        <p className="lede">
          Every style below is a complete invitation, not a swatch. Open one and read it.
          The one you choose changes the paper, the ink, the face the names are set in and
          the way the invitation opens on a guest&rsquo;s phone. It does not change the price.
        </p>
        <p className={styles.count}>
          {STYLE_COUNT} {STYLE_NOUN}, four openers, one flat price per wedding
        </p>
      </section>

      <ul className={styles.grid}>
        {THEME_ORDER.map((theme) => {
          const copy = THEME_COPY[theme];
          return (
            <li key={theme}>
              <Link href={themePath(theme)} className={styles.card}>
                <span className={styles.frame}>
                  <InvitePreview
                    couple={sampleCouple(theme)}
                    opener={copy.opener}
                    locale="en"
                    fit="thumb"
                    arrived
                  />
                </span>
                <h2 className={styles.cardName}>{copy.name}</h2>
                <span className={styles.cardLine}>{copy.summary}</span>
                <span className={styles.cardMeta}>{copy.openerName}</span>
              </Link>
            </li>
          );
        })}
      </ul>

      <hr className="hair" />

      <section className={styles.close}>
        <h2 className={`display ${styles.h2}`}>Put your own names on it</h2>
        <p className="lede">
          The samples carry other people&rsquo;s names. Type yours once and every style on
          this page re-renders as your invitation, with no account and no email.
        </p>
        <Link href="/?from=styles" className={styles.cta}>
          See it with your names
        </Link>
        <p className={styles.fine}>Priced once, not per guest.</p>
      </section>
    </main>
  );
}
