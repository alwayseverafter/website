import type { Locale } from "@/invite/types";
import styles from "./Voices.module.css";

/**
 * Section 6, The Voices.
 *
 * It sits between The Machine and The Choice on purpose. The Machine has just
 * finished the practical argument and The Choice is about to name a price,
 * which is the moment a visitor's remaining doubts are loudest. These are the
 * doubts the page cannot answer in its own voice: a seller saying "your
 * grandmother will manage it" is a claim, and a couple saying she managed it
 * is evidence.
 *
 * Each quote is here to take one objection off the table before it is raised,
 * and they are ordered by how often the objection is the one that kills the
 * sale. The objection is never printed — naming it would hand it to a visitor
 * who had not thought of it yet.
 *
 * No stars, no photographs, no company logos. All three are the SaaS tell the
 * brand rules forbid, and a five star row is the least believable thing a
 * testimonial can wear. Hairlines and words only, matching The Machine.
 *
 * No state, no effects, no client bundle.
 */

type Voice = {
  quote: string;
  /** Who said it. The city does real work: it makes the couple locatable. */
  who: string;
};

type Copy = {
  kicker: string;
  title: string;
  voices: readonly Voice[];
};

/*
 * ---------------------------------------------------------------------------
 * SAMPLE COPY — UNVERIFIED. REPLACE BEFORE LAUNCH.
 *
 * These five couples do not exist. The quotes were written to demonstrate the
 * section and to show what each slot has to accomplish; they are not customer
 * feedback and must not be shown to buyers as though they were. Swap each one
 * for a real quote, with the couple's permission, before this page is public.
 *
 * When replacing them, keep the job each slot does rather than the wording:
 *
 *   1. "Digital will look cheap."      the objection that kills the most sales
 *   2. "Our older relatives can't."    the one raised out loud most often
 *   3. "We'll be chasing replies."     the practical fear, answered by a number
 *   4. "It will look like a template." the fear of being unremarkable
 *   5. "Is the studio tier worth it?"  the last doubt before the higher price
 *
 * The shape that does the work is understatement plus one specific detail — a
 * number, a day of the week, a single gesture. A quote that gushes reads as
 * written by the seller, because it usually was.
 * ---------------------------------------------------------------------------
 */
const COPY: Record<Locale, Copy> = {
  en: {
    kicker: "Afterwards",
    title: "Ask the people who sent one.",
    voices: [
      {
        quote:
          "I had already priced the letterpress. What changed my mind was watching my "
          + "mother open the link and go quiet for a second — she thought we had spent "
          + "more, not less.",
        who: "Johanna & Felix · Lübeck",
      },
      {
        quote:
          "My grandmother is eighty-two and has never installed an app. She opened it on "
          + "the first try, and then sent it to her sister.",
        who: "Marie & Tobias · Münster",
      },
      {
        quote:
          "Eleven days before the wedding I gave the caterer a number instead of a guess. "
          + "I did not chase a single person for it.",
        who: "Sarah & David · Hamburg",
      },
      {
        quote:
          "We looked at the templates everyone uses and could not find ourselves in any of "
          + "them. This one just looked like us, and no one else has seen it.",
        who: "Elif & Jonas · Köln",
      },
      {
        quote:
          "We sent the brief on a Monday with two photographs and a date. It was ready on "
          + "Wednesday and we changed one word.",
        who: "Clara & Anton · Wien",
      },
    ],
  },
  de: {
    kicker: "Danach",
    title: "Fragt die, die eine verschickt haben.",
    voices: [
      {
        quote:
          "Ich hatte den Buchdruck schon angefragt. Umgestimmt hat mich, wie meine Mutter "
          + "den Link öffnete und kurz still wurde — sie dachte, wir hätten mehr ausgegeben, "
          + "nicht weniger.",
        who: "Johanna & Felix · Lübeck",
      },
      {
        quote:
          "Meine Großmutter ist zweiundachtzig und hat noch nie eine App installiert. Sie "
          + "hat es beim ersten Versuch geöffnet und es dann ihrer Schwester weitergeschickt.",
        who: "Marie & Tobias · Münster",
      },
      {
        quote:
          "Elf Tage vor der Hochzeit konnte ich dem Caterer eine Zahl nennen statt einer "
          + "Schätzung. Ich musste niemandem hinterherlaufen.",
        who: "Sarah & David · Hamburg",
      },
      {
        quote:
          "Wir haben uns die Vorlagen angesehen, die alle nehmen, und uns in keiner "
          + "wiedergefunden. Diese sah einfach nach uns aus, und niemand sonst hat sie gesehen.",
        who: "Elif & Jonas · Köln",
      },
      {
        quote:
          "Wir haben das Briefing an einem Montag geschickt, mit zwei Fotos und einem Datum. "
          + "Am Mittwoch war sie fertig, und wir haben ein Wort geändert.",
        who: "Clara & Anton · Wien",
      },
    ],
  },
};

export function Voices({ locale = "en" }: { locale?: Locale }) {
  const copy = COPY[locale];

  return (
    <section id="voices" className={styles.section} aria-labelledby="voices-title">
      <div className={`wrap ${styles.grid}`}>
        <header className={styles.head}>
          <p className="kicker">{copy.kicker}</p>
          <h2 id="voices-title" className={`display ${styles.title}`}>
            {copy.title}
          </h2>
        </header>

        <div className={styles.voices}>
          {copy.voices.map((voice) => (
            /* `figure` + `figcaption` is the markup a quote and its attribution
               actually have, so a screen reader reads who said it rather than
               finding an orphaned line of text under a blockquote. */
            <figure key={voice.who} className={styles.voice}>
              <blockquote className={styles.quote}>{voice.quote}</blockquote>
              <figcaption className={styles.who}>{voice.who}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Voices;
