"use client";

import { useEffect, useRef } from "react";
import { InvitePreview } from "@/invite/InvitePreview";
import type { Locale } from "@/invite/types";
import { track } from "@/lib/analytics";
import { useCouple } from "@/lib/couple";
import styles from "./Arrival.module.css";

/**
 * 1. The Arrival.
 *
 * The door has opened and the visitor is inside a real invitation, rendered by
 * the real component. They scroll it the way a guest would.
 *
 * No marketing chrome overlays this. For the length of this section the visitor
 * is not on a landing page, they are holding an invitation, and every sentence
 * written here instead of showing them one is a sentence that loses money.
 *
 * The couple comes from the store rather than from a prop, so that when The
 * Mirror is typed into further down the page this invitation re-renders with
 * the visitor's own names. Until then it is Max and Lena's, which is the
 * sample, not a fallback: the names are always somebody's real ones and the
 * page never has to pretend otherwise.
 */

/** The four marks that report how far down the invitation a visitor read. */
const DEPTHS = [25, 50, 75, 100] as const;

export type ArrivalProps = {
  locale?: Locale;
};

export function Arrival({ locale = "en" }: ArrivalProps) {
  const { couple } = useCouple();
  const rootRef = useRef<HTMLElement | null>(null);

  /**
   * Depth by intersection rather than by scroll. A scroll listener would need a
   * requestAnimationFrame gate, and a gate ref left non-zero by React's dev
   * double-invoke is exactly what disabled scrolling permanently last time
   * (R5). An observer has no gate to leave stale: `disconnect` is the whole
   * cleanup.
   */
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const marks = root.querySelectorAll<HTMLElement>("[data-depth]");
    if (marks.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const depth = DEPTHS.find((d) => String(d) === entry.target.getAttribute("data-depth"));
        if (depth === undefined) continue;
        /*
         * `once` in the analytics module keys on the event name, so it would
         * swallow every depth after the first. The observer dedupes instead:
         * each mark reports once and is then dropped.
         */
        track({ name: "arrival_depth", depth });
        observer.unobserve(entry.target);
      }
    });

    for (const mark of marks) observer.observe(mark);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={rootRef}
      id="arrival"
      className={styles.root}
      /* The door moves focus here when it closes, so the keyboard follows. */
      tabIndex={-1}
      aria-label="The invitation"
    >
      <div className={styles.stage}>
        <InvitePreview
          couple={couple}
          /*
           * The film was the opener. By the time this renders the visitor has
           * already come through the door, so the invitation must not ask them
           * to open a second one.
           */
          opener="direct"
          locale={locale}
          fit="page"
          arrived
        />
      </div>

      {DEPTHS.map((depth) => (
        /* R6. Measurement only, and never the pointer target. */
        <span key={depth} className={styles.mark} data-depth={depth} aria-hidden="true" />
      ))}
    </section>
  );
}

export default Arrival;
