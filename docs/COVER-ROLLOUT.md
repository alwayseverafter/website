# Covers and openers — every step, and the PRs they belong to

Two threads run through this file. One is the cover art, which does not exist
yet. The other is a correctness problem found on 2026-10-04 while checking
whether the opening-animation text in `docs/COVER-BRIEFS.md` was true. It was
not, so fixing that comes first and blocks a merge.

Steps are in order. Each says what it is, why it is not optional, how it is
checked, and which PR it lands in. An item with no check is not done, it is
only believed.

---

## Where this stands

- **PR #6** (draft, based on `worktree-digitalyes-catalog`) carries the
  home-page links into the catalogue — finished, tested — plus
  `docs/COVER-BRIEFS.md` and this file.
- **No artwork exists.** Nothing on the site reads a cover.
- **The animation blocks in `COVER-BRIEFS.md` are wrong** about the source
  designs. See below.

## The finding

`copy.howItOpens` describes one of our own four openers (`veil`, `foil`,
`envelope`, `direct`), dressed in a per-style name. Forty-six source designs
collapse onto four of ours, which is the first sign it is our taxonomy and not
an observation. Two live demos were then checked directly:

| Source design | Demo | Our style | Our opener | What it actually does |
|---|---|---|---|---|
| Stained Glass | `/demo/stained-glass` | `vitrail` | `foil` | Waits on a **DISCOVER** tap. A backlit stained-glass rose window with a monogram and a centre seam; the glass parts **sideways to both edges**, names fade-rise staggered. This is our `veil`, not `foil`. |
| Teatro | `/demo/teatro` | `velluto` | `envelope` | Waits on **"Tap to continue"**. A full-bleed red theatre curtain with pale folds. No envelope. Separately carries a **scratch-to-reveal canvas** for the date, a mechanic our renderer has no equivalent for. |

Two of two mismatched. Both are **gated on a tap**, which matters beyond these
two: our `direct` opener is used by seven styles and its copy says the
invitation "is already there" when the link opens. If the source designs all
gate, `direct` corresponds to nothing on their side.

Two practical notes for anyone automating the rest: the demo pages are
client-rendered, so the live invitation URL can only be read from the rendered
DOM and never from `curl`; and the subdomains are not uniformly named
(`13-15-stainedglass-template.thedigitalyes.com` versus
`template-teatro.thedigitalyes.com`).

---

## Step 1 — Stop the briefs claiming something untrue · PR #6 · required

- [ ] Relabel the `**Opening animation**` block in `scripts/gen-cover-briefs.ts`
  so it plainly describes *our* opener, and either drop the motion prompt or
  mark it as ours. Add a line to the file header saying the source designs'
  animations have not been observed.
  *Check:* nothing in the regenerated `COVER-BRIEFS.md` can be read as a
  description of a Digital Yes animation.

This blocks the merge. The file is already written and still unmerged, so
correcting it now costs one commit; merging first means publishing a document
that misleads the next reader.

## Step 2 — Land the nav · PR #6

- [ ] Regenerate the briefs, re-run `npm run verify`, take PR #6 out of draft,
  merge into `worktree-digitalyes-catalog`.
  *Check:* verify green; the two `/styles` links still present in the built
  `/`; base branch is correct.

The nav half depends on none of the rest. Holding it behind the artwork keeps
finished, tested work out of the product for no reason.

## Step 3 — Decide whether to audit the openers · decision, no PR

- [ ] Choose: audit all 46, or stop at the relabel from step 1.

Auditing is browser-driven at roughly four to five commands per style plus
screenshot reads — on the rate this session ran at, **$60–100**. What it buys
is a better opener assignment per style (the build brief asks for the opener
that "carries the same feeling" as the source, and two of two currently do
not) and a dated record of what was actually seen.

What it does **not** buy is new capability. The renderer has four openers and
no scratch canvas; the audit changes which of the four a style gets, never
what exists. If the answer is no, skip to step 6.

## Step 4 — Sweep the demos · PR B · only if step 3 says yes

- [ ] Script it rather than doing it by hand. For each source slug: open the
  demo page in a browser, read the iframe `src` from the live DOM, open that
  subdomain, capture the closed state, trigger the gate, capture the opened
  state, and record what moved.
  *Check:* 46 rows, each carrying the demo URL, the observation date and a
  one-line description. No row inferred from the design's name.

- [ ] Write the result to `docs/SOURCE-OPENERS.md` as observations, dated.
  *Check:* the file records behaviour only — no screenshots of their artwork
  committed, nothing that reproduces their designs. Observing what a public
  page does is research; shipping their pictures is not, and that line is the
  same one `docs/CATALOG-BUILD-INSTRUCTIONS.md` already draws.

## Step 5 — Re-assign the openers that are wrong · PR B

- [ ] Update `copy.opener`, `copy.openerName` and `copy.howItOpens` in the
  entries where the observation disagrees. `vitrail` (`foil` → `veil`) and
  `velluto` (`envelope` → ?) are already known.
  *Check:* `npm test` green; every opener is still one of the four; the
  per-entry diff is reviewable one style at a time, which is why the entries
  are one file each.

- [ ] Add a test that every `openerName` resolves to a real `opener` id.
  *Check:* it fails if a name is given to an opener that does not exist.

## Step 6 — Decide: covers, or the live previews? · decision, no PR · blocking

- [ ] Choose before any code moves.

`src/app/styles/styles.module.css` renders each gallery card as a live
`InvitePreview` deliberately — its own comment says a small card would be "a
swatch rather than a sample, and the sample is the entire argument of the
page", and `styles/page.tsx` leads with "Every style below is a complete
invitation, not a swatch."

Static covers buy a large drop in page weight — 47 live component trees today
— and cost that argument. Three ways out: covers everywhere; covers in the
gallery with the live render kept on the style page; or covers on the style
page only, gallery untouched.

Whichever wins, the stale comment in `styles.module.css` and the lede in
`styles/page.tsx` are part of that change, not a follow-up.
*Check:* the decision is written into this file before step 8 starts.

## Step 7 — Make the art · PR C

- [ ] **Generate 47 covers** from the `Image prompt` blocks. One per style,
  `public/covers/<slug>.webp`, 4:5 portrait.
  *Check:* 47 files; every filename matches a slug in `THEME_ORDER`.

- [ ] **Reject the ones that broke the five rules.** Baked-in text or
  monograms, faces or figures, photographic stock, a busy centre third, or
  anything reading as a reconstruction of an existing design. Regenerate;
  do not keep a near miss.
  *Check:* a human has opened all 47.

- [ ] **Check each against its own palette.** A cover fighting `palette.paper`
  sits badly under that style's type.
  *Check:* the dominant colour is within sight of that style's `paper`, and
  the one accent is its `accent`.

- [ ] **Record provenance** — model, date, prompt revision, and the terms
  under which the output is ours. The repo already keeps that habit for
  ported code.
  *Check:* the note exists and names the model and the terms.

## Step 8 — Wire them in · PR D · after steps 6 and 7

- [ ] **Render them.** `next/image`, explicit width and height, `loading="lazy"`,
  real alt text per style. `next.config.ts` already sets AVIF and WebP, so the
  4:5 originals are re-encoded and down-sized rather than served whole.
  *Check:* a cold load of `/styles` transfers less than it does today —
  measure both, do not assume.

- [ ] **Write the path once.** A `coverPath(theme)` helper beside `themePath`
  in `src/lib/seo.ts`, not a template literal per call site.
  *Check:* `grep -rn "public/covers" src` finds it in one file.

- [ ] **Make a missing cover loud.** A style with no file must not render a
  blank frame — either the build fails or a placeholder says what it is. R12,
  the same rule that keeps draft styles off the site.
  *Check:* delete one cover locally; something fails or says so in words.

- [ ] **Test both directions.** Every listed style has a cover, every cover
  maps to a listed style.
  *Check:* the test fails when a file is removed and when a style is added
  without one.

---

## PR map

| PR | Contents | Depends on | State |
|---|---|---|---|
| **#6** | Home-page nav into `/styles`; `COVER-BRIEFS.md`; this file; the step 1 relabel | — | Open, draft. Needs step 1, then merge |
| **B** | `docs/SOURCE-OPENERS.md`; corrected `opener` / `openerName` / `howItOpens` across affected entries; the opener-name test | Step 3 saying yes | Not raised |
| **C** | 47 cover images under `public/covers/`; the provenance note | Step 7 | Not raised |
| **D** | `coverPath` helper; gallery and/or style-page rendering; missing-cover guard; tests; the copy and comment changes step 6 implies | Steps 6 and 7, PR C merged | Not raised |

PR B is separable from C and D and can be skipped entirely. C is assets only
and carries no code, so it can be reviewed and merged on its own. D is the
only one that changes how a page renders, which is why it is last and why the
decision in step 6 has to be settled before it opens.

## Open, not urgent

- [ ] **Motion assets.** Each brief carries a second prompt for that style's
  opening animation. Nothing on the site would use one — the openers are
  rendered, not filmed — and after the finding above those prompts describe
  our openers anyway. Decide whether they are wanted before generating 47.

- [ ] **Unused component, pre-existing.** `src/components/funnel/Styles.tsx`
  and `Styles.module.css` are imported by nothing (`grep -rn "funnel/Styles" src`
  is empty). The eight-theme picker it implements is not in the funnel. Noted,
  deliberately not deleted — not this work's mess to clean up.
