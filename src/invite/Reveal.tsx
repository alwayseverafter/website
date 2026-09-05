"use client";

import { useEffect, useRef, useState, type ReactElement, type ReactNode } from "react";
import type { Motion } from "./themes";
import { useReducedMotion, useWillChange } from "./motion";
import styles from "./invite.module.css";

/**
 * The arrived state entering.
 *
 * Ported from the product repo's `Reveal.tsx`. Scroll-driven CSS animations
 * only reached Safari 26, so the trigger is an IntersectionObserver. Which
 * animation runs is the theme's `motion` token, not a prop, so the eight themes
 * differ in how they arrive as well as in what they look like.
 *
 * R8: `will-change` is armed when the transition starts and removed when it
 * ends, never left standing in the stylesheet.
 */
export function Reveal({
  motion,
  children,
}: {
  motion: Motion;
  children: ReactNode;
}): ReactElement {
  const ref = useRef<HTMLDivElement>(null);
  const [intersected, setIntersected] = useState(false);
  const reduced = useReducedMotion();
  const { arm, disarm } = useWillChange();

  /* Derived, not synchronised. A theme that arrives without ceremony, and a
     visitor who has asked their system for less movement, are both already in
     the arrived state on the very first paint: there is no frame in which the
     content is hidden waiting for an effect to say so. */
  const shown = intersected || reduced || motion === "none";

  useEffect(() => {
    /* Nothing to watch for. The derivation above has already shown it. */
    if (reduced || motion === "none") return;

    const el = ref.current;
    if (el === null) return;

    if (typeof IntersectionObserver === "undefined") {
      /* No observer means no trigger, and an invitation that never appears is
         worse than one that appears without ceremony. A task rather than a
         straight call, so the fallback still enters on its own frame. */
      const id = setTimeout(() => setIntersected(true), 0);
      return () => clearTimeout(id);
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          arm(el, "opacity, transform");
          setIntersected(true);
          io.disconnect();
        }
      },
      /* No `root`: the frame may or may not be the scroller, and the document
         viewport is the one ancestor guaranteed to contain both cases. */
      { rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);

    return () => {
      /* The observer is a one-shot gate, so cleanup both disconnects it and
         puts the compositor hint back (R5, R8). `el` is captured here rather
         than read from the ref, which by cleanup time may point elsewhere. */
      io.disconnect();
      disarm(el);
    };
  }, [reduced, motion, arm, disarm]);

  return (
    <div
      ref={ref}
      className={styles.reveal}
      data-motion={motion}
      data-shown={shown}
      onTransitionEnd={() => disarm(ref.current)}
    >
      {children}
    </div>
  );
}
