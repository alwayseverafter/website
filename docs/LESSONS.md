# Binding rules, taken from the max-und-lena QA

Every rule below is a defect that was **measured** in the current product
(`gifting/davet/docs/handover-animation-qa.md`, 2026-09-01). They are not
style preferences. Breaking one reintroduces a bug we have already paid for.

Read this before writing code. It is enforced in review.

---

## R1. No viewport units inside anything embeddable  ·  was B2

`@keyframes petalFall` translates `118vh`. Inside the builder's phone frame the
renderer is 672 px tall while `vh` still resolves against the 900 px window, so
petals travelled **1.58x** the frame height, streaked, and clipped.

**This funnel embeds invitations inside a page in The Mirror and The Styles, so
this bug recurs by default.**

- Never write `vh`, `vw`, `svh`, `dvh` inside `src/invite/**`.
- Use container query units (`cqh`, `cqw`) or a custom property the host sets.
- The container needs `container-type: size` for `cqh`, not `inline-size`.
- ESLint has a `no-restricted-syntax` rule that fails the build on this.

## R2. No global style leaks  ·  was B4

`scroll-behavior: smooth` was set on bare `html` for the invitation's dot
navigation and leaked to `/dashboard`, `/edit/*`, `/impressum`, `/datenschutz`.

Scope every selector. Nothing in `src/invite/**` may style `html`, `body`, or a
bare element selector. Anchor on `.invite` or a CSS Module.

## R3. Never degrade silently  ·  was B1, P0

A user who chose the "tor" opener got the "veil" opener and **no error**,
because `heroImage` was unsettable and `Opener.tsx:27` fell back quietly. The
headline feature of the whole pitch worked only for seeded demo data.

- A feature that works only for demo data is not shipped, it is faked.
- If input is missing, say so where the choice was made. Do not substitute.
- Every fallback path needs a test that actually executes it. The QA doc lists
  the `tor` fallback under "Not verified" precisely because it never ran.

## R4. Gesture state lives in a ref, not in state  ·  was B5

`onMove` read `dragging` from the render closure, so the first `pointermove`
after `pointerdown` saw `false` and returned early.

Use `useRef` for anything a pointer handler reads. Keep `useState` only for what
the class name needs.

## R5. Reset every ref that is a gate, in cleanup  ·  fixed last session

`ScrollChrome` cancelled its pending `requestAnimationFrame` on cleanup but did
not reset the ref that **is** the throttle gate. React's dev double-invoke left
it non-zero and every later `onScroll` returned early, permanently.

If a ref guards work, cleanup must restore it to its initial value.

## R6. Decorative layers get `pointer-events: none`  ·  fixed last session

A 2% seam gap made an `<img>` the pointer target. Dragging an image fires
`pointercancel`, which tripped `onUp` and reset the gesture.

Every decorative layer inside an interactive surface: `pointer-events: none`.

## R7. Scope animation queries to a ref  ·  was B6

`document.getAnimations()` filtered by name on every rate step is O(all
animations on the page). Hold a ref and call
`el.getAnimations({ subtree: true })`.

## R8. `will-change` is opt-in, never standing  ·  was B8

`will-change: transform` on 28 petals held compositor memory permanently. Set it
on gesture or animation start, remove it on end.

## R9. 320 px is a first-class target  ·  was B7

Section dots were hidden below `22rem` because 30 px tap targets did not fit.
That was accepted as "by design" in a desktop-first product.

**90% or more of this site's traffic is mobile.** 320 px is not an edge case, it
is the design target. Every interactive element has a tap target of at least
44x44 px at 320 px, or it is redesigned until it does.

## R10. Print styles cover every variant  ·  was B3

`.cover` got `min-height: 0` under `@media print`; `.tor` did not, so printing
before opening the gate produced an 844 px near-blank sheet.

When a component has variants, the print block covers all of them.

## R11. Enum additions need a migration  ·  measured

Any new value in a union that reaches a database CHECK constraint needs a
matching migration. The funnel has no database, so this applies only to values
handed to the product.

## R12. Placeholders are visible, never silent

`/impressum` renders a warning banner while `NEXT_PUBLIC_OPERATOR_*` is unset,
rather than publishing `[Betreibername eintragen]`. Keep that discipline: an
unfinished thing announces itself.

---

## Testing notes inherited from the QA doc

- Playwright's browsers are not installed on this machine. Drive Chrome with the
  copy `agent-browser` ships:
  `/Users/sonus/.agent-browser/browsers/chrome-148.0.7778.167/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing`
- **Frame-accurate work must use Playwright, not agent-browser.** Each
  agent-browser command is a separate process (500 to 900 ms) and always
  overshoots a 1.5 s transition.
- Test at 320 px, 390 px and 430 px before any desktop width.
