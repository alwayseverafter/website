# AlwaysEverAfter: the funnel

**Date:** 2026-09-06
**Status:** design, approved in brainstorm, not yet planned
**Domain:** alwayseverafter.com

---

## 1. What this is

alwayseverafter.com is a **funnel and nothing else**. It has one job: turn a
couple who has never heard of us into a paying customer, and hand them off.

The product it sells already exists: the invitation app in
`github.com/svareed/gifting`, currently deployed single couple at
`/max-und-lena`. This document does not change that product. It specifies the
machine that sells it.

**Objective:** maximise sales of one product. Every decision below is justified
by that and by nothing else.

### The product, restated

The repo's `main` redirects the bare domain to one couple's invitation. That is
not a limitation to fix, it is the business model showing itself. This is not
software as a service. It is a **commissioned artefact**: one wedding, one link,
bought once at a moment of high emotion and high budget tolerance.

That reframing is load bearing. It is why the price is $249 and $599 rather than
$19 a month, why there is no churn to manage, and why "we take twelve
commissions a month" is an honest sentence rather than a growth hack.

### Non-goals

Explicitly out of scope, and to stay out of scope:

- No accounts, no login, no dashboard on the funnel. Those live in the product.
- No registry, no wedding website, no printed stationery, no guest messaging.
- No blog, no CMS, no live chat at launch.
- No A/B testing framework at launch. Traffic will be too thin for significance;
  building one would be measuring noise expensively.
- No pricing calculator. The price is one number. A calculator would imply
  otherwise and reintroduce the meter we are removing.

---

## 2. The offer

| | The Invitation | The Commission |
|---|---|---|
| Price | **$249** | **$599** |
| Delivery | Live in an hour, self serve | 48 hours, our studio builds it |
| Guests | Unlimited | Unlimited |
| Constraint | none | **twelve a month** |

**One flat price per wedding. Unlimited guests.**

This is the central competitive move and it deserves stating plainly. Paperless
Post charges $0.50 to $1.44 per guest. Greenvelope charges $19 to $249 by guest
count tier. Bliss and Bone charges $0.90 per recipient. Per guest pricing makes
a couple sit at a kitchen table and cut people from their wedding to save forty
dollars. It is the most emotionally wrong pricing model available in this
category, and every serious competitor uses it because their revenue
architecture depends on it.

Removing the meter is therefore both the kindest and the least copyable thing we
can do. The page must say it in those terms: **priced once, not per guest.**

The twelve a month cap on The Commission is a real constraint, because a human
builds each one. Stating a true limit is the strongest premium signal available
and costs nothing. It must never be faked, and the number must be updated when
capacity changes.

**No competitor is named on the site.** The counter positioning lives in the
absence of a meter, not in a comparison table. Quiet luxury does not punch down.

---

## 3. Brand: Atelier

The site is the frame. The invitations are the art. The funnel therefore carries
**no chromatic accent of its own**; colour enters only through the invitations
being previewed inside it. This is a constraint, not an omission, and it is what
keeps eight very different themes from fighting the chrome around them.

### Palette

| Token | Value | Use |
|---|---|---|
| `--paper` | `#FAF8F5` | page ground |
| `--card` | `#FFFFFF` | raised surfaces, style cards |
| `--ink` | `#131A26` | body and display text |
| `--ink-2` | `#4A5568` | lede, secondary |
| `--ink-3` | `#9AA1AC` | kickers, meta, captions |
| `--rule` | `#DCD8D2` | hairlines, the only separator |
| `--door` | `#0B0C0E` | the threshold, and only the threshold |

Dark mode is **not** supported at launch. A wedding invitation funnel is viewed
in daylight on a phone, and paper white is the entire point of the aesthetic. A
dark variant would be a second design system for a case nobody has asked for.

### Type

| Face | Role |
|---|---|
| **Italiana** | display. Names, headings, the wordmark, style card titles. |
| **Cormorant Garamond** | lede paragraphs, prices, the italic ampersand. Light 300. |
| **Jost** | UI only. Kickers, labels, meta, buttons. Small, tracked, uppercase. |

The wordmark is set in Italiana at `letter-spacing: .34em` with a matching
`text-indent` so optical centring survives the tracking. No logo file ships.

### Rules of the house

These are what separate this from a template, and each one is a decision the
competitors got wrong:

1. **No boxes.** Separation is space and hairlines. Cards, tiles and pills are
   what make a page read as a web form rather than as print. This is the single
   biggest lever on how expensive the page looks. The one exception is the style
   card, which is a picture frame and is meant to read as one.
2. **One rule weight.** `1px solid var(--rule)`. Never two.
3. **No icons.** An icon row under a heading is a SaaS tell. Facts get words.
4. **No badges.** No "most popular", no "best value". Those are conversion
   tactics from a different price bracket and they cheapen the tier block.
5. **No shadows except one.** Style cards get
   `0 18px 40px -34px rgba(19,26,38,.5)`, which reads as a card lifting off
   paper. Nothing else casts.
6. **No em dashes**, in copy, comments or docs. This is already house style in
   the product repo and the funnel inherits it. Commas and full stops.
7. **No exclamation marks. Ever.**

### Motion

- Default transition: `600ms cubic-bezier(.4, 0, .2, 1)`.
- The door: `1500ms cubic-bezier(.7, 0, .2, 1)`. Slower than feels right on the
  first read, which is correct, because the wait is the drama.
- Nothing bounces, nothing springs, nothing overshoots.
- `prefers-reduced-motion: reduce` must skip the door animation and render the
  arrival state directly. The film is replaced by its poster frame.

### Voice

Declarative. Short. Second person. No superlatives, no adjective stacking, no
"stunning" or "magical" or "dream". The product is dramatic so the copy does not
have to be. Where a sentence could be cut, cut it.

Reference line, which sets the register for everything else:

> This one was made for Max and Lena. Yours takes an hour.

---

## 4. The funnel

One page carries the whole sequence. Its structure is the argument.

The governing constraint: **this product's value lands in eight seconds and
cannot be described in words.** Every sentence written instead of showing the
doors open is a sentence that loses money. So: compress time to wow to zero.

### 0. The Door

Full viewport. The monochrome film from `public/beispiel/tor.mp4`, paused on
frame 0, which is also the poster. The wordmark, a hairline, and one word:
**Open**.

No navigation, no headline, no value proposition, no scroll indicator for the
first three seconds. There is one hairline row at the top holding only `EN / DE`
and `Styles`, at `--ink-3`, easy to ignore.

*Job:* make the visitor click. Nothing else. Click through rate on this door is
the top of everything below it.

### 1. The Arrival

The doors part, the film plays, and the visitor lands **inside** max-und-lena's
real invitation, rendered by the real component. They scroll it the way a guest
would: names, date, the programme, the venue, the countdown.

No marketing chrome overlays this. For the length of this section the visitor is
not on a landing page, they are holding an invitation.

*Job:* the demo. This is the product, and it is doing its own selling.

### 2. The Turn

The fourth wall breaks. Paper white returns.

> **This one was made for Max and Lena.**
> Yours takes an hour.

*Job:* convert admiration into applicability. The visitor has just felt
something; this tells them it is available to them.

### 3. The Mirror

Two fields and a date. **Your names. Your date.**

On input, the invitation above re-renders and the headings on the page adopt
their names. No account, no email, no wall.

Persisted to `localStorage` so a returning visitor is greeted by their own
invitation rather than by Max and Lena's.

*Job:* **this is the conversion engine.** Once a couple sees their own names set
in Italiana with the doors opening, the sale is emotionally closed and the price
becomes a formality. Every competitor puts a signup wall before this moment.
That wall is where their funnel leaks and it is the leak we are exploiting.

The primary metric of the entire site is **named to purchase** conversion.

### 4. The Styles

Eight themes, each a live render carrying **their** names, not Max and Lena's.
Selecting one re-renders the invitation above in that theme.

Four openers compose with eight themes, so this section holds 32 distinct first
impressions built from one renderer.

*Job:* move the question from "do I want this" to "which one". A visitor
choosing between eight options they like has already decided the first question.

### 5. The Machine

What sits underneath, in four plain sentences and no icons:

- One link. It opens on any phone, with no app and no account.
- Every household gets its own link and its own number of seats.
- Replies are clamped to those seats, so the headcount is a number you can hand
  a caterer.
- Reminders count back from the reply date. Move the date and they move.

*Job:* de-risk. The emotional sale is already made; this answers the practical
objection before it is voiced, and it is the ground no Etsy video seller can
stand on, because they deliver an MP4.

### 6. The Choice

The two tiers from section 2, separated by a hairline, no badges. The Commission
carries its honest constraint: *twelve a month*.

### 7. The Close

Stripe Checkout. One line under the button:

> Priced once, not per guest.

---

## 5. Routes

```
/                     the funnel above, in full
/styles               gallery index                        (SEO)
/styles/[theme]       one style, live sample invitation    (SEO, 8 pages)
/commission           the $599 brief form
/create               post purchase handoff into the product
/preview              shareable personalised preview       (growth loop)
/de/...               German mirror of all of the above
/legal/terms
/legal/privacy
/impressum            required when selling into DE
```

`/styles/[theme]` exists because the single page funnel has almost no SEO
surface. Eight indexable pages, each a full sample invitation with real copy, is
the cheapest search surface available and it costs no new design.

---

## 6. Architecture

**A new, standalone Next.js app.** `davet` stays untouched and keeps running.

### Rendering

Sections 1, 3 and 4 need to render real invitations. A mocked preview would
waste the largest weapon the site has, so the funnel takes a copy of the
rendering core:

```
src/invite/
  Invite.tsx      themes.ts       Opener.tsx
  Ornament.tsx    Reveal.tsx      datetime.ts
  assets/fonts/
```

**Copied, not shared.** No monorepo, no published package. The tradeoff, stated
honestly: divergence is possible and a sync is a manual, deliberate act. That is
acceptable because the funnel needs only the read path, and a package boundary
between two apps owned by one person is ceremony that buys nothing today.

The source commit SHA is recorded in `src/invite/PROVENANCE.md` at copy time and
updated on every sync.

### Stack

- Next.js, App Router, TypeScript. Matches the product, so one mental model.
- No database. The funnel stores nothing of its own.
- Stripe Checkout, hosted. No card data touches us, and PCI scope stays at SAQ A.
- Vercel, `alwayseverafter.com`.
- Commission briefs go to email and a Stripe payment link. A form that emails a
  human is the correct amount of infrastructure for twelve a month.

### Handoff

```
Stripe Checkout
   -> webhook -> /create?session={id}
   -> capture names, date, chosen theme
   -> provision the couple's invitation in the product
   -> email the couple their link and their editor URL
```

Captured at checkout, and nowhere else:

| Field | Example | Note |
|---|---|---|
| `partnerAName` | `Max` | from The Mirror |
| `partnerBName` | `Lena` | from The Mirror |
| `weddingDate` | `2026-12-15` | ISO 8601 at rest, formatted per locale |
| `theme` | `atelier-blanc` | from The Styles |
| `tier` | `invitation` | or `commission` |
| `email` | from Stripe | delivery address for the link |
| `locale` | `en` | or `de` |

**Provisioning differs by tier, and this is what makes the delivery promises in
section 2 true.**

*The Invitation* is automated end to end, because it has to be: "live in an
hour, self serve" is not deliverable by hand. The webhook creates the invitation
in the product, seeded with the names, date and theme already chosen on the
funnel, and emails a magic link into the builder that `davet` already has
(`Builder.tsx`, `NewInvite.tsx`, `src/lib/auth.ts`). The couple lands in an
editor that is already holding their invitation, not an empty one. This is the
only piece of automation the funnel genuinely requires, and it is the one to
build first.

*The Commission* is manual, deliberately. A human reads the brief and builds it,
which is what the $599 buys and what caps it at twelve a month. A form that
emails a person is the correct amount of infrastructure at that volume, and
building a pipeline for it would be automating away the thing being sold.

### Localisation

US English is the default and the canonical experience. German is a real locale,
not a machine translation: `/de/...` with its own copy, `€` pricing, German date
formatting, and the Impressum that German law requires on every publicly
reachable page.

The toggle sits in the top hairline as `EN / DE`. It does not geolocate, it does
not auto redirect, and it does not pop a modal. Guessing a visitor's language
from their IP is the kind of cleverness that irritates the exact person we want.

---

## 7. Performance

The film is the product, so its budget is the site's budget.

| Budget | Target |
|---|---|
| Door film | under 4 MB, H.264, `yuv420p`, `+faststart`, no audio track |
| Poster | frame 0 of the finished clip, never the original still |
| LCP, 4G mobile | under 2.0s |
| Fonts | only the active theme's faces download |
| First paint without JS | the door renders from its poster |

The frame 0 rule is inherited from `docs/opener-film.md` and it is absolute: if
the poster and frame 0 differ at all, a visible flash appears on click, which is
the one defect that would undo the entire first impression.

---

## 8. Instrumentation

The objective is sales, so the funnel must be measurable end to end. Events, in
order:

```
door_shown  ->  door_opened  ->  arrival_depth{25,50,75,100}
            ->  mirror_named            <- THE key event
            ->  style_selected{theme}
            ->  tiers_viewed
            ->  checkout_started{tier}
            ->  purchase{tier, amount}
            ->  commission_enquiry
```

**Primary metric:** `mirror_named -> purchase`.

**Primary hypothesis:** naming predicts buying more strongly than any other
signal on the page. If it holds, everything above The Mirror should be optimised
to drive naming, and everything below it to remove friction. If it does not
hold, the funnel's core premise is wrong and this document needs revising before
anything else is built.

**Secondary:** `door_shown -> door_opened`. If visitors will not click a door
with one word on it, the whole cinematic premise is unproven and section 0 needs
a fallback with a conventional headline.

Privacy: a cookieless, first party analytics tool. No Meta pixel, no session
recording. A wedding is not a browsing session to be surveilled, and a cookie
banner would be the first thing a visitor saw on a page whose entire argument is
restraint.

---

## 9. Distribution

The site converts traffic; it does not create it. Since the objective is sales,
the sources belong in this document.

1. **The guest loop.** Every published invitation is seen by roughly 140 people
   who are, by definition, attending weddings. A single hairline and the wordmark
   in Italiana at the foot of every invitation, linking to `/?from=invite`.
   Roughly 140 pre-qualified impressions per sale, at zero acquisition cost. This
   is the highest leverage asset the business has and it compounds with every
   sale.
2. **Partner sharing.** After The Mirror: *send this to your partner*, producing
   `/preview?n=...`. Couples decide together, always. This doubles named visitor
   reach for free and it is the most natural share in the category.
3. **Search.** Eight `/styles/[theme]` pages, plus long tail on digital wedding
   invitation intent.
4. **Short form video.** The 9:16 door film is already the correct format for
   Reels, TikTok and Pinterest. The ad is the product, unedited.
5. **Planners and photographers.** They resell the invitation alongside the
   shoot. 20 percent referral on The Commission. The product repo already
   anticipated this constituency.

---

## 10. Legal

- US terms and privacy policy, plain language.
- German Impressum under §5 DDG, required on every publicly reachable page once
  we sell into DE. The product repo already treats a missing Impressum as an
  abmahnfähig offence and the funnel inherits that seriousness.
- Selling entity, VAT and OSS registration are unresolved. See open questions.
- Refund policy stated at checkout. Proposal: full refund before the invitation
  is published, none after, because publication is the delivery.

---

## 11. Success criteria

This design is working if:

1. A visitor sees a real invitation, in motion, within three seconds of landing.
2. A visitor can see their own names in their own invitation without giving us
   anything.
3. The page never states a price per guest, in any context.
4. `mirror_named -> purchase` is measurable from day one.
5. Every published invitation links back here.
6. The page holds no box, no icon row, no badge and no exclamation mark.

---

## 12. Open questions

Business, not craft. None of these block the prototype, all of them block launch.

1. **Selling entity.** US LLC or German entity? This determines Stripe setup,
   whether prices carry VAT, and whether OSS registration is needed for EU sales.
2. **Fulfilment of The Commission.** Who builds the twelve? If it is you, twelve
   is the honest cap. If it is a contractor, the cap and the margin both change.
3. **Couple domains.** Does each wedding get `maxandlena.alwayseverafter.com`, a
   path, or their own domain? This affects the product, not the funnel, but it is
   a thing the checkout has to promise.
4. **The film.** Is `tor.mp4` the funnel's door, or does the funnel need its own
   film that is not tied to one couple's theme?
5. **Price validation.** $249 and $599 are reasoned, not tested. The stationery
   average is $518 against a $33,000 wedding, so both sit defensibly, but the
   first fifty sales are the real test.
6. **Refund policy.** Confirm the proposal in section 10.

---

## 13. Provenance

- Product repo: `github.com/svareed/gifting`, `main`, at
  `2026-09-01 Point the bare domain at the invitation for the single-couple deploy`.
- Brand direction chosen from a three way comparison, 2026-09-06. Atelier
  selected over Gilded and Editorial.
- Competitive research, 2026-09-06: Paperless Post, Greenvelope, Minted, Zola,
  WithJoy, The Knot, Bliss and Bone, RSVPify, Evite, and the Etsy and Motion
  Stamp video invite segment.
