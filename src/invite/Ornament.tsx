import type { ReactElement, ReactNode } from "react";
import type { Ornament as OrnamentId } from "./themes";
import styles from "./invite.module.css";

/**
 * The theme's glyph, and the hairline it sits in.
 *
 * Ported from the product repo's `Ornament.tsx`. Drawn rather than loaded: five
 * small SVGs cost less than one icon font request, they take `currentColor`
 * from the theme's accent for free, and nothing here can 404.
 *
 * R6: every glyph is decorative and carries `aria-hidden`. The rule that holds
 * it is `pointer-events: none` in CSS, so a stray tap on the hairline never
 * becomes the pointer target.
 */

const PATHS: Record<Exclude<OrnamentId, "none">, ReactNode> = {
  diamond: (
    <>
      <path d="M11 2 L20 11 L11 20 L2 11 Z" fill="none" stroke="currentColor" strokeWidth="1" />
      <path d="M11 6.5 L15.5 11 L11 15.5 L6.5 11 Z" fill="currentColor" opacity=".55" />
    </>
  ),
  tile: (
    <>
      <path
        d="M11 1.5 L14 8 L20.5 11 L14 14 L11 20.5 L8 14 L1.5 11 L8 8 Z"
        fill="currentColor"
        opacity=".75"
      />
      <circle cx="11" cy="11" r="2.2" fill="none" stroke="currentColor" strokeWidth="1" />
    </>
  ),
  leaf: (
    <>
      <path
        d="M11 2 C6 7 6 15 11 20 C16 15 16 7 11 2 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
      />
      <path d="M11 3.5 V18.5" stroke="currentColor" strokeWidth=".7" />
    </>
  ),
  deco: (
    <>
      <path d="M2 11 H20" stroke="currentColor" strokeWidth=".8" />
      <path d="M11 4 L15 11 L11 18 L7 11 Z" fill="none" stroke="currentColor" strokeWidth="1" />
      <circle cx="11" cy="11" r="1.4" fill="currentColor" />
    </>
  ),
  weave: (
    <>
      <path d="M2 8 H20 M2 14 H20" stroke="currentColor" strokeWidth=".8" />
      <path d="M8 5 L14 17 M14 5 L8 17" stroke="currentColor" strokeWidth=".8" />
    </>
  ),
};

export function Ornament({
  id,
  size = 22,
}: {
  id: OrnamentId;
  size?: number;
}): ReactElement | null {
  if (id === "none") return null;
  return (
    <svg
      className={styles.glyph}
      width={size}
      height={size}
      viewBox="0 0 22 22"
      aria-hidden="true"
      focusable="false"
    >
      {PATHS[id]}
    </svg>
  );
}

/**
 * A hairline with the theme's glyph set into it.
 *
 * With no glyph there is nothing for the two halves to sit either side of, so
 * the rule becomes one uninterrupted hairline instead of a visible gap. That is
 * how atelier-blanc and noir get their editorial rule for free.
 */
export function Rule({ id, size }: { id: OrnamentId; size?: number }): ReactElement {
  if (id === "none") return <div className={styles.rulePlain} aria-hidden="true" />;
  return (
    <div className={styles.rule} aria-hidden="true">
      <Ornament id={id} size={size} />
    </div>
  );
}
