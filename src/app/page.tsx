/**
 * The funnel. One page carries the whole sequence, and its structure is the
 * argument. See docs/superpowers/specs/2026-09-06-alwayseverafter-funnel-design.md
 *
 * Sections are assembled here and owned individually, so they can be built and
 * reviewed independently.
 */
export default function Home() {
  return (
    <main>
      {/* 0 Door · 1 Arrival · 2 Turn · 3 Mirror · 4 Styles · 5 Machine · 6 Choice · 7 Close */}
      <p className="wrap" style={{ paddingBlock: "4rem" }}>
        Scaffold. Sections land here.
      </p>
    </main>
  );
}
