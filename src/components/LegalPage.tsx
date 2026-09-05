import Link from "next/link";
import type { Metadata } from "next";
import { LocaleSwitch } from "./LocaleSwitch";
import {
  OPERATOR,
  OPERATOR_ADDRESS_LINES,
  OPERATOR_INCOMPLETE,
  OPERATOR_MISSING,
  type OperatorField,
} from "@/lib/operator";
import {
  catalogue,
  formatDocumentDate,
  HTML_LANG,
  localeHref,
  type LegalSection,
  type Locale,
} from "@/lib/i18n";
import s from "./LegalPage.module.css";

/**
 * The shell every legal page shares.
 *
 * Three documents, one layout, so the three route files choose a document and
 * nothing else. The shell also carries the two things that must never be
 * forgotten on a legal page: the language switch, and the R12 warning that
 * shows while the operator's details are still placeholders.
 *
 * Mobile first. Legal text on a phone is the hard case, so the measure, the
 * line height and the space between paragraphs are set for 320px and only
 * loosened upwards.
 */

/** Bump when the substance changes, not when a typo is fixed. */
export const LEGAL_UPDATED = "2026-09-06";

export function LegalPage({
  locale,
  kicker,
  title,
  intro,
  children,
}: {
  locale: Locale;
  kicker: string;
  title: string;
  intro: string;
  children: React.ReactNode;
}) {
  const c = catalogue(locale);

  return (
    /* The root layout is not ours and declares lang="en". Declaring it again
       here is what makes a German page announce itself as German to a screen
       reader and to a translation engine. */
    <main className={s.page} lang={HTML_LANG[locale]}>
      <div className={s.bar}>
        <Link href={localeHref("/", locale)} className={s.brand}>
          {c.brand}
        </Link>
        <LocaleSwitch locale={locale} label={c.chrome.switchTo} />
      </div>

      <article className={s.doc}>
        <p className={s.kicker}>{kicker}</p>
        <h1 className={s.title}>{title}</h1>

        {/* Visible on purpose. A published notice that still holds bracketed
            placeholders is worse than an obviously unfinished one, because
            only the second kind gets fixed before anybody relies on it.
            docs/LESSONS.md R12. */}
        {OPERATOR_INCOMPLETE && (
          <aside className={s.warning} role="note">
            <h2 className={s.warningHeading}>{c.legal.placeholder.heading}</h2>
            <p className={s.warningBody}>{c.legal.placeholder.body}</p>
            <p className={s.warningBody}>
              {c.legal.placeholder.missing}: {OPERATOR_MISSING.map(envKey).join(", ")}
            </p>
          </aside>
        )}

        <p className={s.intro}>{intro}</p>

        {children}

        <p className={s.updated}>
          {c.legal.updated} {formatDocumentDate(LEGAL_UPDATED, locale)}
        </p>
      </article>

      <nav className={s.footer} aria-label={c.chrome.legal}>
        <Link href={localeHref("/legal/terms", locale)} className={s.footerLink}>
          {c.legal.nav.terms}
        </Link>
        <Link href={localeHref("/legal/privacy", locale)} className={s.footerLink}>
          {c.legal.nav.privacy}
        </Link>
        <Link href={localeHref("/impressum", locale)} className={s.footerLink}>
          {c.legal.nav.imprint}
        </Link>
        <Link href={localeHref("/", locale)} className={s.footerLink}>
          {c.chrome.backHome}
        </Link>
      </nav>
    </main>
  );
}

/** Prose sections: a heading and its paragraphs, separated by space alone. */
export function LegalSections({
  sections,
}: {
  sections: readonly LegalSection[];
}) {
  return (
    <>
      {sections.map((section) => (
        <section key={section.heading} className={s.section}>
          <h2 className={s.heading}>{section.heading}</h2>
          {section.body.map((paragraph) => (
            <p key={paragraph} className={s.body}>
              {paragraph}
            </p>
          ))}
        </section>
      ))}
    </>
  );
}

/**
 * Labelled facts, for the Impressum. A definition list rather than a table,
 * because it is a set of labelled values and not a grid, and because a table
 * at 320px has nowhere to go.
 */
export function LegalRows({
  rows,
}: {
  rows: readonly { label: string; values: readonly string[] }[];
}) {
  return (
    <dl className={s.rows}>
      {rows.map((row) => (
        <div key={row.label} className={s.row}>
          <dt className={s.rowLabel}>{row.label}</dt>
          <dd className={s.rowValue}>
            {row.values.map((value) => (
              <span key={value} className={s.rowLine}>
                {value}
              </span>
            ))}
          </dd>
        </div>
      ))}
    </dl>
  );
}

/*
 * The three documents.
 *
 * They live here rather than in the route files so that the English route and
 * the German one under /de are the same page rendered with a different locale,
 * and cannot drift apart by being edited separately.
 */

export function TermsDocument({ locale }: { locale: Locale }) {
  const doc = catalogue(locale).legal.terms;
  return (
    <LegalPage
      locale={locale}
      kicker={doc.kicker}
      title={doc.title}
      intro={doc.intro}
    >
      <LegalSections sections={doc.sections} />
    </LegalPage>
  );
}

export function PrivacyDocument({ locale }: { locale: Locale }) {
  const doc = catalogue(locale).legal.privacy;
  return (
    <LegalPage
      locale={locale}
      kicker={doc.kicker}
      title={doc.title}
      intro={doc.intro}
    >
      <LegalSections sections={doc.sections} />
    </LegalPage>
  );
}

export function ImprintDocument({ locale }: { locale: Locale }) {
  const doc = catalogue(locale).legal.imprint;
  const l = doc.labels;

  /* The operator's own details are data, never copy: they are read from the
     environment and printed as given. Only the labels are translated. */
  const rows = [
    { label: l.provider, values: OPERATOR_ADDRESS_LINES },
    { label: l.represented, values: [OPERATOR.represented] },
    {
      label: l.contact,
      values: [`${l.email}: ${OPERATOR.email}`, `${l.phone}: ${OPERATOR.phone}`],
    },
    { label: l.vatId, values: [OPERATOR.vatId] },
    { label: l.contentResponsible, values: OPERATOR_ADDRESS_LINES },
    { label: l.hosting, values: [OPERATOR.hostingRegion] },
  ];

  return (
    <LegalPage
      locale={locale}
      kicker={doc.kicker}
      title={doc.title}
      intro={doc.intro}
    >
      <LegalRows rows={rows} />
      <LegalSections sections={doc.sections} />
    </LegalPage>
  );
}

/** The environment variable a missing operator field comes from. */
function envKey(field: OperatorField): string {
  const map: Record<OperatorField, string> = {
    name: "NEXT_PUBLIC_OPERATOR_NAME",
    street: "NEXT_PUBLIC_OPERATOR_STREET",
    city: "NEXT_PUBLIC_OPERATOR_CITY",
    country: "NEXT_PUBLIC_OPERATOR_COUNTRY",
    represented: "NEXT_PUBLIC_OPERATOR_REPRESENTED",
    email: "NEXT_PUBLIC_OPERATOR_EMAIL",
    phone: "NEXT_PUBLIC_OPERATOR_PHONE",
    vatId: "NEXT_PUBLIC_OPERATOR_VAT_ID",
    hostingRegion: "NEXT_PUBLIC_HOSTING_REGION",
  };
  return map[field];
}

/**
 * Legal pages are a duty, not a landing page. They should never outrank the
 * funnel, so they are followed but not indexed, and each one names its twin in
 * the other language.
 */
export function legalMetadata(title: string, path: string): Metadata {
  return {
    title,
    robots: { index: false, follow: true },
    alternates: {
      canonical: path,
      languages: {
        "en-US": localeHref(path, "en"),
        "de-DE": localeHref(path, "de"),
      },
    },
  };
}
