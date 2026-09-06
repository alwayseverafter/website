/**
 * The mark.
 *
 * The brand is a wordmark set in Italiana and the design spec says no logo file
 * ships, which is right for the page: an icon beside that wordmark would be the
 * SaaS tell rule 3 of the house rules forbids. But a favicon cannot be set in
 * Italiana at 16 px, a share image needs something that is not a paragraph, and
 * an email header has no room for a tracked wordmark. Those are the only places
 * this appears. It never enters page chrome.
 *
 * WHAT it draws: a pointed arch. It reads as an A, which is the brand's letter,
 * and as a doorway, which is the first thing on the site and the whole opening
 * gesture of the product. The crossbar is both the A's bar and the threshold.
 *
 * WHY it is a stroke and not a fill: the entire design system separates with
 * one 1px hairline and nothing else. A mark drawn from that same rule belongs
 * to the system rather than being applied on top of it. At the 64 unit viewBox,
 * `strokeWidth: 2` resolves to exactly 1 px at 32 px, which is the favicon.
 *
 * Colour comes from `currentColor` so the mark inherits wherever it sits. It
 * carries no palette of its own, because the site carries no chromatic accent
 * of its own.
 */

export const MARK_VIEWBOX = "0 0 64 64";

/** The geometry, shared with `icon.svg` and the share images so it cannot drift. */
export const MARK_PATHS = {
  /** Left upright, sweeping to the apex, back down to the right upright. */
  arch: "M13 58V34C13 20 21 11 32 6c11 5 19 14 19 28v24",
  /** The bar of the A, and the lintel of the door. */
  bar: "M13 43h38",
} as const;

export function Mark({
  size = 24,
  title,
}: {
  size?: number;
  /** Omit inside a labelled element; the mark is then decorative. */
  title?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox={MARK_VIEWBOX}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      /* Butt caps and mitre joins. Round ends would soften a system whose
         only separator is a hard 1px rule. */
      strokeLinecap="butt"
      strokeLinejoin="miter"
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      /* R6. Decorative layers inside an interactive surface never take the
         pointer, and dragging an inline SVG fires pointercancel. */
      style={{ pointerEvents: "none" }}
    >
      <path d={MARK_PATHS.arch} />
      <path d={MARK_PATHS.bar} />
    </svg>
  );
}
