import type { Locale } from "@/invite/types";
import styles from "./Turn.module.css";

/**
 * Section 2: The Turn.
 *
 * The fourth wall breaks. The visitor has just been inside somebody else's
 * invitation; this is the sentence that tells them it is available to them.
 * It is the whole section. Anything added here is a sentence written instead
 * of getting them to The Mirror.
 *
 * A server component on purpose: it carries no state and no handler, so it
 * costs no JavaScript and paints with the document.
 *
 * The sample couple's names are written out rather than imported from
 * `@/lib/couple`. `SAMPLE` lives in a `"use client"` module, and reading a
 * non-component export of one from a server component fails at runtime. These
 * two names are copy here, not data.
 */

type Copy = {
  /** The line that names the sample couple. */
  made: string;
  /** The line that hands it to the visitor. */
  yours: string;
};

const COPY: Record<Locale, Copy> = {
  en: {
    made: "This one was made for Max and Lena.",
    yours: "Yours takes an hour.",
  },
  de: {
    made: "Diese hier ist für Max und Lena gemacht.",
    yours: "Eure dauert eine Stunde.",
  },
};

const HEADING_ID = "turn-heading";

export function Turn({ locale = "en" }: { locale?: Locale }) {
  const copy = COPY[locale];

  return (
    <section className={styles.turn} aria-labelledby={HEADING_ID}>
      <div className="wrap">
        {/* Paper white returns. The hairline is the cut between film and page. */}
        <hr className={`hair ${styles.rule}`} />
        <h2 id={HEADING_ID} className={`display ${styles.made}`}>
          {copy.made}
        </h2>
        <p className={`lede ${styles.yours}`}>{copy.yours}</p>
      </div>
    </section>
  );
}
