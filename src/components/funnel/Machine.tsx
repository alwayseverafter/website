import type { Locale } from "@/invite/types";
import styles from "./Machine.module.css";

/**
 * Section 5, The Machine.
 *
 * The emotional sale is already made by the time a visitor reaches this. This
 * section exists to answer the practical objection before it is voiced, and it
 * is the ground an Etsy video seller cannot stand on, because they deliver an
 * MP4 and this delivers a guest list that adds up.
 *
 * Four sentences, and nothing else. An icon row under a heading is a SaaS tell
 * and is forbidden by the brand rules, so the facts get words. No state, no
 * effects, no client bundle.
 */

type Copy = {
  kicker: string;
  title: string;
  /**
   * The four claims, in the order a doubt occurs: will it open, who gets what,
   * can I trust the number, what happens if the date moves.
   *
   * A plain array rather than a fixed tuple, matching `src/lib/i18n/en.ts`:
   * the count is the same in both locales today because the argument is the
   * same, not because a type forces it.
   */
  facts: readonly string[];
};

const COPY: Record<Locale, Copy> = {
  en: {
    kicker: "Underneath",
    title: "It runs the guest list too.",
    facts: [
      "One link. It opens on any phone, with no app and no account.",
      "Every household gets its own link and its own number of seats.",
      "Replies are clamped to those seats, so the headcount is a number you can hand a caterer.",
      "Reminders count back from the reply date. Move the date and they move.",
    ],
  },
  de: {
    kicker: "Darunter",
    title: "Sie führt auch die Gästeliste.",
    facts: [
      "Ein Link. Er öffnet sich auf jedem Handy, ohne App und ohne Konto.",
      "Jeder Haushalt bekommt seinen eigenen Link und seine eigene Anzahl Plätze.",
      "Zusagen sind auf diese Plätze begrenzt, damit die Personenzahl eine Zahl ist, die ihr dem Caterer geben könnt.",
      "Erinnerungen zählen vom Antwortdatum zurück. Verschiebt das Datum, verschieben sie sich mit.",
    ],
  },
};

export function Machine({ locale = "en" }: { locale?: Locale }) {
  const copy = COPY[locale];

  return (
    <section id="machine" className={styles.section} aria-labelledby="machine-title">
      <div className={`wrap ${styles.grid}`}>
        <header className={styles.head}>
          <p className="kicker">{copy.kicker}</p>
          <h2 id="machine-title" className={`display ${styles.title}`}>
            {copy.title}
          </h2>
        </header>

        <ul className={styles.facts}>
          {copy.facts.map((fact) => (
            <li key={fact} className={styles.fact}>
              {fact}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
