# Always Ever After

The funnel for alwayseverafter.com. It has one job: turn a couple who has never
heard of us into a paying customer, and hand them off to the invitation product.

- **Design spec:** `docs/superpowers/specs/2026-09-06-alwayseverafter-funnel-design.md`
- **Binding rules:** `docs/LESSONS.md`. Every rule there is a defect already
  measured in the product. Read it before writing code.

## Run

    npm install
    npm run dev
    npm run verify      # typecheck, lint, test, build

## Two things that are not negotiable

**Mobile first.** 90% or more of traffic is a phone. Every style rule is the
phone rule; desktop is the media query. Tap targets are 44 px at 320 px wide.

**No viewport units inside `src/invite/**`.** Invitations are embedded in the
page at three sizes. `vh` resolves against the window, not the frame, which is
bug B2. ESLint fails the build on it.

## Shape

    src/app/          routes
    src/components/funnel/   the eight sections of the page
    src/invite/       the invitation renderer, ported from the product
    src/lib/          couple store, analytics contract
