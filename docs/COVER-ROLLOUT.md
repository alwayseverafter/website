# Cover rollout — action items

What is left to turn `docs/COVER-BRIEFS.md` into covers on the site.

The briefs exist. No artwork does, and nothing on the site reads a cover yet,
so every item below is unstarted. Written down because the work splits across
a decision that has not been taken (item B1) and because a half-finished cover
set is the kind of thing that ships silently — R12.

Each item names how it is checked. An item with no check is not done, it is
only believed.

---

## A. Make the art

- [ ] **A1. Generate 47 covers.** Run each `Image prompt` block in
  `docs/COVER-BRIEFS.md` through an image model. One file per style, saved as
  `public/covers/<slug>.webp`, 4:5 portrait. The slug is given in each brief.
  *Check:* `ls public/covers | wc -l` is 47, and every filename matches a slug
  in `THEME_ORDER`.

- [ ] **A2. Reject the ones that broke the rules.** Every prompt forbids five
  things; generators ignore them regularly. Look for baked-in text or
  monograms, faces or figures, photographic stock, a busy centre third, and
  anything that reads as a reconstruction of an existing invitation design.
  *Check:* a human has opened all 47. Regenerate failures rather than keeping
  a near miss.

- [ ] **A3. Check each one against its own palette.** A cover whose ground
  fights `palette.paper` will sit badly under the style's own type.
  *Check:* sample the dominant colour of each file; it should be within sight
  of that style's `paper`, and the one accent should be the style's `accent`.

- [ ] **A4. Record provenance.** Which model, which date, which prompt
  revision, and the licence terms under which the output is ours. The repo
  already keeps a `PROVENANCE.md` habit for ported code; this is the same
  question for pictures, and it is the record that matters if the origin of
  the art is ever asked about.
  *Check:* the note exists and names the model and the terms.

## B. Decide before wiring (blocking)

- [ ] **B1. Covers on the gallery cards, or live invitations?**
  `src/app/styles/styles.module.css` renders each card as a live
  `InvitePreview` on purpose — its own comment says a small card would be
  "a swatch rather than a sample, and the sample is the entire argument of the
  page", and `styles/page.tsx` leads with "Every style below is a complete
  invitation, not a swatch."

  Swapping in static covers buys a large drop in page weight (47 live
  component trees today) and costs that argument. Three ways out: covers
  everywhere; covers in the gallery with the live render kept on the style
  page; or covers on the style page and live renders left alone in the
  gallery.

  Whichever is chosen, the stale comment in `styles.module.css` and the lede
  in `styles/page.tsx` are part of the change, not a follow-up.
  *Check:* the decision is written down here before any code moves.

## C. Wire them in — after A and B

- [ ] **C1. Render the covers.** `next/image` with explicit width and height,
  `loading="lazy"`, and real alt text per style. `next.config.ts` already sets
  `formats: ["image/avif", "image/webp"]`, so the 4:5 originals are served
  down-sized and re-encoded rather than as-is.
  *Check:* a cold load of `/styles` transfers less than it does today —
  measure both, do not assume.

- [ ] **C2. Write the cover path once.** A `coverPath(theme)` helper beside
  `themePath` in `src/lib/seo.ts`, not a template literal at each call site.
  *Check:* `grep -rn "public/covers" src` finds it in one file.

- [ ] **C3. Make a missing cover loud.** A style with no file must not render
  a blank frame. Either a test that fails the build, or a visible placeholder
  that says what it is — R12, and the same rule that keeps draft styles off
  the site.
  *Check:* delete one cover locally; something fails or says so in words.
  Restore it.

- [ ] **C4. Test it.** Every listed style has a cover, every cover maps to a
  listed style, and no cover is orphaned by a style being withdrawn.
  *Check:* the new test fails when a file is removed and when a style is added
  without one.

## D. Open, not urgent

- [ ] **D1. Motion.** Each brief carries a second prompt describing that
  style's opening animation. Nothing on the site would use one today — the
  openers are rendered, not filmed. Decide whether these are wanted at all
  before generating 47 of them.

- [ ] **D2. Unused component, pre-existing.**
  `src/components/funnel/Styles.tsx` and `Styles.module.css` are imported by
  nothing (`grep -rn "funnel/Styles" src` is empty). The eight-theme picker it
  implements is not in the funnel. Noted, deliberately not deleted — it is
  not this work's mess to clean up.

- [ ] **D3. Land the nav half.** PR #6 carries two things: the home-page links
  into the catalogue, which is finished and tested, and the briefs, which are
  input to everything above. Neither depends on the covers. Consider taking
  them out of draft and merging rather than holding them behind item A.
