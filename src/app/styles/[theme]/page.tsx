import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { InvitePreview } from "@/invite/InvitePreview";
import type { ThemeId } from "@/invite/types";
import {
  PRICE,
  SITE_NAME,
  THEME_COPY,
  STYLE_COUNT_LOWER,
  STYLE_NOUN,
  THEME_ORDER,
  spelledCount,
  absoluteUrl,
  formatSampleDate,
  isThemeId,
  otherThemes,
  sampleCouple,
  themePath,
} from "@/lib/seo";
import styles from "./theme.module.css";

/**
 * One page per style.
 *
 * WHY these pages carry real editorial copy rather than a heading and a
 * picture: eight near identical pages generated from one template are a doorway
 * set, and a doorway set gets all eight discounted at once. The differences
 * between the styles are real, so they are written out. Each page also carries
 * its own sample couple, so no two pages show the same names.
 */

type RouteParams = { theme: string };

/** All eight are static. There is no reason for any of them to be rendered per request. */
export function generateStaticParams(): RouteParams[] {
  return THEME_ORDER.map((theme) => ({ theme }));
}

/**
 * R3: an unknown slug is refused, never resolved to a default theme. This is
 * belt and braces with the `notFound()` calls below, and it is what keeps a
 * typo out of the index rather than serving it a soft 200.
 */
export const dynamicParams = false;

export async function generateMetadata(
  { params }: { params: Promise<RouteParams> },
): Promise<Metadata> {
  const { theme } = await params;
  if (!isThemeId(theme)) notFound();

  const copy = THEME_COPY[theme];
  const canonical = absoluteUrl(themePath(theme));

  return {
    title: copy.metaTitle,
    description: copy.metaDescription,
    keywords: [
      `${copy.name.toLowerCase()} wedding invitation`,
      "digital wedding invitation",
      "online wedding invitation",
      "wedding invitation link",
    ],
    alternates: { canonical },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      title: copy.metaTitle,
      description: copy.metaDescription,
      url: canonical,
      /*
       * og:image and twitter:image are not set here on purpose. The sibling
       * opengraph-image.tsx is file based metadata and Next merges it in, so
       * naming the image twice would be one more thing to keep in sync.
       */
    },
    twitter: {
      card: "summary_large_image",
      title: copy.metaTitle,
      description: copy.metaDescription,
    },
  };
}

function Paragraphs({ lines }: { lines: readonly string[] }) {
  return (
    <>
      {lines.map((line) => (
        <p key={line} className={styles.p}>
          {line}
        </p>
      ))}
    </>
  );
}

export default async function ThemePage({ params }: { params: Promise<RouteParams> }) {
  const { theme: slug } = await params;
  if (!isThemeId(slug)) notFound();

  const theme: ThemeId = slug;
  const copy = THEME_COPY[theme];
  const couple = sampleCouple(theme);
  const canonical = absoluteUrl(themePath(theme));
  const funnelHref = `/?theme=${theme}&from=styles`;

  /*
   * Product plus BreadcrumbList, in one array, which application/ld+json
   * accepts. The Offer quotes The Invitation tier, because that is the price a
   * visitor arriving on this page can actually pay for this style.
   */
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Product",
      name: `${copy.name} wedding invitation`,
      description: copy.metaDescription,
      url: canonical,
      category: "Wedding invitations",
      image: [absoluteUrl(`${themePath(theme)}/opengraph-image`)],
      brand: { "@type": "Brand", name: SITE_NAME },
      offers: {
        "@type": "Offer",
        url: absoluteUrl("/"),
        price: PRICE.amount,
        priceCurrency: PRICE.currency,
        availability: "https://schema.org/InStock",
        /* One flat price per wedding, unlimited guests. No per guest tier exists. */
        eligibleQuantity: { "@type": "QuantitativeValue", value: 1, unitText: "wedding" },
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: SITE_NAME, item: absoluteUrl("/") },
        { "@type": "ListItem", position: 2, name: "Styles", item: absoluteUrl("/styles") },
        { "@type": "ListItem", position: 3, name: copy.name, item: canonical },
      ],
    },
  ];

  return (
    <main className={`wrap ${styles.page}`}>
      <script
        type="application/ld+json"
        // Serialised from literals we control, so there is no untrusted input here.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <header className={styles.top}>
        <Link href="/?from=styles" className={styles.wordmark}>
          {SITE_NAME}
        </Link>
        <Link href="/styles" className={styles.back}>
          All {STYLE_COUNT_LOWER} {STYLE_NOUN}
        </Link>
      </header>

      <hr className={styles.rule} />

      <section className={styles.intro}>
        <p className="kicker">Style</p>
        <h1 className={`display ${styles.h1}`}>{copy.name}</h1>
        <p className="lede">{copy.summary}</p>
      </section>

      <div className={styles.sample}>
        <div className={styles.frame}>
          <InvitePreview couple={couple} opener={copy.opener} locale="en" fit="page" arrived />
        </div>
      </div>
      <p className={styles.caption}>
        A complete {copy.name} invitation, set for {couple.a} and {couple.b},{" "}
        {formatSampleDate(couple.date)}
      </p>

      <div className={styles.ctaTop}>
        <Link href={funnelHref} className={styles.cta}>
          See {copy.name} with your names
        </Link>
      </div>

      <hr className="hair" />

      <article className={styles.body}>
        <h2 className={`display ${styles.h2}`}>What it is</h2>
        <Paragraphs lines={copy.whatItIs} />

        <h2 className={`display ${styles.h2}`}>Who it suits</h2>
        <Paragraphs lines={copy.whoItSuits} />

        <h2 className={`display ${styles.h2}`}>The typography</h2>
        <Paragraphs lines={copy.typography} />

        <h2 className={`display ${styles.h2}`}>How it opens</h2>
        <Paragraphs lines={copy.howItOpens} />
      </article>

      <h2 className={`display ${styles.h2}`}>The specification</h2>
      <dl className={styles.spec}>
        <div className={styles.specRow}>
          <dt className={styles.specKey}>Paper</dt>
          <dd className={styles.specValue}>{copy.spec.paper}</dd>
        </div>
        <div className={styles.specRow}>
          <dt className={styles.specKey}>Ink</dt>
          <dd className={styles.specValue}>{copy.spec.ink}</dd>
        </div>
        <div className={styles.specRow}>
          <dt className={styles.specKey}>Faces</dt>
          <dd className={styles.specValue}>{copy.spec.faces}</dd>
        </div>
        <div className={styles.specRow}>
          <dt className={styles.specKey}>Opener</dt>
          <dd className={styles.specValue}>{copy.openerName}</dd>
        </div>
        <div className={styles.specRow}>
          <dt className={styles.specKey}>Guests</dt>
          <dd className={styles.specValue}>Unlimited, at one flat price for the wedding</dd>
        </div>
      </dl>

      <hr className="hair" />

      {/*
        Rendered only when there is another style to link to. `otherThemes`
        filters THEME_ORDER, so while one style is sellable this list is empty
        and the heading would announce links that are not there.
      */}
      {otherThemes(theme).length === 0 ? null : (
        <>
      <h2 className={`display ${styles.h2}`}>
        {otherThemes(theme).length === 1
          ? "The other one"
          : `The other ${spelledCount(otherThemes(theme).length).toLowerCase()}`}
      </h2>
      <ul className={styles.others}>
        {otherThemes(theme).map((other) => {
          const o = THEME_COPY[other];
          return (
            <li key={other} className={styles.otherItem}>
              <Link href={themePath(other)} className={styles.otherLink}>
                <span className={styles.otherName}>{o.name}</span>
                <span className={styles.otherLine}>{o.summary}</span>
              </Link>
            </li>
          );
        })}
      </ul>
        </>
      )}

      <hr className="hair" />

      <section className={styles.close}>
        <h2 className={`display ${styles.h2}`}>Yours takes an hour</h2>
        <p className="lede">
          Type your two names and your date. {copy.name} re-renders as your invitation,
          on the spot, with no account and no email. Send one link to everyone you love.
        </p>
        <Link href={funnelHref} className={styles.cta}>
          Start with {copy.name}
        </Link>
        <p className={styles.fine}>Priced once, not per guest.</p>
      </section>
    </main>
  );
}
