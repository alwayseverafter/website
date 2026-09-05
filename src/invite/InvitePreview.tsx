import type { InvitePreviewProps } from "./types";
import styles from "./InvitePreview.module.css";

/**
 * PLACEHOLDER. Replaced by the ported renderer from the product repo.
 *
 * It exists so the funnel sections can be built against a stable prop contract
 * while the port happens alongside them. Its markup is throwaway; its props are
 * not. See `types.ts`.
 *
 * R1: no viewport units. Size comes from the `fit` prop and container query
 * units, because this component is rendered at three different sizes inside a
 * page and reading the viewport is exactly what caused B2.
 */
export function InvitePreview({ couple, locale, fit }: InvitePreviewProps) {
  const date = new Date(`${couple.date}T12:00:00Z`);
  const formatted = new Intl.DateTimeFormat(locale === "de" ? "de-DE" : "en-US", {
    day: "numeric", month: "long", year: "numeric", timeZone: "UTC",
  }).format(date);

  return (
    <div className={styles.frame} data-fit={fit}>
      <div className={styles.inner}>
        <p className={styles.kicker}>
          {locale === "de" ? "Gemeinsam mit ihren Familien" : "Together with their families"}
        </p>
        <p className={styles.names}>
          {couple.a} <span className={styles.amp}>&amp;</span> {couple.b}
        </p>
        <p className={styles.date}>{formatted}</p>
      </div>
    </div>
  );
}
