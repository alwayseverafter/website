"use client";

import { useId, useState } from "react";
import { InvitePreview } from "@/invite/InvitePreview";
import type { Couple, Locale } from "@/invite/types";
import { SAMPLE, useCouple } from "@/lib/couple";
import { track } from "@/lib/analytics";
import styles from "./Mirror.module.css";

/**
 * Section 3: The Mirror. The conversion engine.
 *
 * Two names and a date, and the invitation becomes theirs. There is no account,
 * no email field and no wall, because the wall is precisely where every
 * competitor's funnel leaks. `mirror_named` is the event the whole design is a
 * bet on, and the site's primary metric is named to purchase.
 *
 * A live preview sits inside this section rather than only above it. The
 * invitation in The Arrival re-renders too, from the same store, but on a phone
 * it is a screen and a half away and the visitor typing here would never see
 * it. The mirror has to be next to the fields or it is not a mirror.
 */

/** `<input type="date">` reports "" until every segment is filled. */
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

type Copy = {
  heading: string;
  lede: string;
  nameA: string;
  nameB: string;
  date: string;
  /** Always-visible, always-true statement of what the preview is showing. */
  showing: (a: string, b: string, date: string) => string;
  /** Appended when any shown value is not the visitor's own. R3, R12. */
  sampleNote: string;
  /** Coarse, low-cardinality text for the polite live region. */
  liveOwn: string;
  liveSample: string;
};

const COPY: Record<Locale, Copy> = {
  en: {
    heading: "Your names. Your date.",
    lede: "Type them in. The invitation becomes yours as you go. No account, no email address.",
    nameA: "One name",
    nameB: "The other name",
    date: "The date",
    showing: (a, b, date) => `Showing ${a} and ${b}, ${date}.`,
    sampleNote: "Those are the sample values, until you type your own.",
    liveOwn: "The invitation now carries your names.",
    liveSample: "The invitation is showing the sample couple.",
  },
  de: {
    heading: "Eure Namen. Euer Datum.",
    lede: "Tragt sie ein. Die Einladung wird beim Tippen zu eurer. Kein Konto, keine E-Mail-Adresse.",
    nameA: "Ein Name",
    nameB: "Der andere Name",
    date: "Das Datum",
    showing: (a, b, date) => `Gezeigt werden ${a} und ${b}, ${date}.`,
    sampleNote: "Das sind die Beispielwerte, bis ihr eigene eintragt.",
    liveOwn: "Die Einladung trägt jetzt eure Namen.",
    liveSample: "Die Einladung zeigt das Beispielpaar.",
  },
};

function formatDate(iso: string, locale: Locale): string {
  /* Midday UTC, formatted in UTC. A calendar date is not an instant, and
     parsing "YYYY-MM-DD" as local midnight moves it a day west of Greenwich. */
  return new Intl.DateTimeFormat(locale === "de" ? "de-DE" : "en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${iso}T12:00:00Z`));
}

export function Mirror({ locale = "en" }: { locale?: Locale }) {
  const { couple, update } = useCouple();
  const copy = COPY[locale];
  const id = useId();

  /*
   * The date needs a draft, the names do not.
   *
   * A native date input reports "" while a segment is still being filled, and
   * an empty string fails `parseCouple`, which would throw away the visitor's
   * names on the next visit as well. So the store only ever receives a complete
   * ISO date, and the field is driven by a draft.
   *
   * The draft is re-synced from the store rather than initialised once: this
   * component renders first with the server snapshot, and `useSyncExternalStore`
   * hands over the stored value only after hydration. Adjusting state during
   * render is the supported way to derive from a prop-like value; it re-renders
   * immediately and never commits the stale pass.
   */
  const [dateDraft, setDateDraft] = useState(couple.date);
  const [dateSynced, setDateSynced] = useState(couple.date);
  if (couple.date !== dateSynced) {
    setDateSynced(couple.date);
    setDateDraft(couple.date);
  }

  const typedA = couple.a.trim();
  const typedB = couple.b.trim();
  const dateComplete = ISO_DATE.test(dateDraft);

  /*
   * An empty field must never render an empty invitation or the string
   * "undefined", so the sample stands in. That is not a silent degradation
   * under R3: the status line below the fields says, in words, exactly whose
   * names are on the card.
   */
  const shown: Couple = {
    a: typedA || SAMPLE.a,
    b: typedB || SAMPLE.b,
    date: dateComplete ? dateDraft : SAMPLE.date,
    theme: couple.theme,
  };
  const usingSample = !typedA || !typedB || !dateComplete;

  function onName(field: "a" | "b", value: string) {
    update(field === "a" ? { a: value } : { b: value });
    /* The key event. Fired the first time a real name exists, not on focus and
       not on an edit that empties the field. `track` dedupes on `once`. */
    if (value.trim()) track({ name: "mirror_named" }, true);
  }

  function onDate(value: string) {
    setDateDraft(value);
    /* Only a complete date reaches storage. See the draft note above. */
    if (ISO_DATE.test(value)) update({ date: value });
  }

  return (
    <section id="mirror" className={styles.mirror} aria-labelledby={`${id}-h`}>
      <div className={`wrap ${styles.grid}`}>
        <header className={styles.head}>
          <h2 id={`${id}-h`} className={`display ${styles.h}`}>
            {copy.heading}
          </h2>
          <p className={`lede ${styles.lede}`}>{copy.lede}</p>
        </header>

        {/* Above the fields, so it stays in sight when a phone keyboard opens. */}
        <div className={styles.previewCol}>
          <div className={styles.preview}>
            <InvitePreview
              couple={shown}
              /* `arrived` skips the opener: replaying a door on every keystroke
                 would be motion sickness, and the names are the point here. */
              opener="direct"
              locale={locale}
              fit="card"
              arrived
            />
          </div>
        </div>

        {/*
          A form, so a phone offers Go rather than a bare return, and so autofill
          treats the three fields as one group. There is nothing to submit, so
          submission is stopped: the invitation is already up to date.
        */}
        <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
          <div className={styles.fields}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor={`${id}-a`}>
                {copy.nameA}
              </label>
              <input
                id={`${id}-a`}
                className={styles.input}
                type="text"
                value={couple.a}
                onChange={(e) => onName("a", e.target.value)}
                /* Matches the slice in `parseCouple`, so what persists is
                   exactly what the field shows. */
                maxLength={40}
                /* Autofill would drop a browser profile name into a field about
                   a wedding, and paint the field yellow while doing it. */
                autoComplete="off"
                autoCapitalize="words"
                spellCheck={false}
                enterKeyHint="next"
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor={`${id}-b`}>
                {copy.nameB}
              </label>
              <input
                id={`${id}-b`}
                className={styles.input}
                type="text"
                value={couple.b}
                onChange={(e) => onName("b", e.target.value)}
                maxLength={40}
                autoComplete="off"
                autoCapitalize="words"
                spellCheck={false}
                enterKeyHint="next"
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor={`${id}-date`}>
                {copy.date}
              </label>
              {/* Native, so a phone gets the OS date wheel. No min: a returning
                  visitor's date may already have passed, and flagging it
                  invalid would be the site arguing with them. */}
              <input
                id={`${id}-date`}
                className={`${styles.input} ${styles.date}`}
                type="date"
                value={dateDraft}
                onChange={(e) => onDate(e.target.value)}
              />
            </div>
          </div>

          <p className={styles.status}>
            {copy.showing(shown.a, shown.b, formatDate(shown.date, locale))}
            {usingSample ? ` ${copy.sampleNote}` : ""}
          </p>

          {/*
            The visible line above changes on every keystroke, which a screen
            reader should not read out every keystroke. This announces only the
            transition between the sample and their own invitation, so the text
            changes twice in a session rather than forty times.
          */}
          <p className={styles.srOnly} aria-live="polite">
            {usingSample ? copy.liveSample : copy.liveOwn}
          </p>
        </form>
      </div>
    </section>
  );
}
