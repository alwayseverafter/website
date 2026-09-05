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

/**
 * The four claims, in the order a doubt occurs: will it open, who gets what,
 * can I trust the number, what happens if the date moves.
 */
const FACTS = [
  "One link. It opens on any phone, with no app and no account.",
  "Every household gets its own link and its own number of seats.",
  "Replies are clamped to those seats, so the headcount is a number you can hand a caterer.",
  "Reminders count back from the reply date. Move the date and they move.",
] as const;

export function Machine() {
  return (
    <section id="machine" className={styles.section} aria-labelledby="machine-title">
      <div className={`wrap ${styles.grid}`}>
        <header className={styles.head}>
          <p className="kicker">Underneath</p>
          <h2 id="machine-title" className={`display ${styles.title}`}>
            It runs the guest list too.
          </h2>
        </header>

        <ul className={styles.facts}>
          {FACTS.map((fact) => (
            <li key={fact} className={styles.fact}>
              {fact}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
