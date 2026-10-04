# Building a catalogue style

You are writing **one file**: `src/catalog/entries/<slug>.ts`. Nothing else.

Forty-six styles are being written in parallel from this brief. Every rule
below exists because of how that goes wrong — not because of taste.

Read `docs/LESSONS.md` first. R3 and R12 are the two that bite here.

---

## 1. What a style actually is

Always Ever After does not render pictures. The renderer paints **colour,
type, one geometric glyph, a surface texture and an opening animation**. There
is no image layer and you may not add one.

So you are not copying a design. You are **reinterpreting** it in the token
system. A source design of watercolour swans becomes a palette, a face
pairing, an ornament and an opener that carry the same feeling. If you find
yourself wanting an illustration, you have misunderstood the task.

The seven knobs, and their only legal values:

| Field | Values |
|---|---|
| `dark` | `true` / `false` — drives the reported colour scheme, nothing else |
| `fonts` | `editorial` (Italiana + Jost) · `classic` (Cormorant + Jost) · `garamond` (Cormorant throughout) · `geometric` (Jost throughout) |
| `ornament` | `diamond` · `tile` · `leaf` · `deco` · `weave` · `none` |
| `surface` | `grain` · `marble` · `linen` · `plaster` · `none` |
| `motion` | `veil` · `fade-rise` · `none` |
| `lettering` | `titlecase` (tight, italic ampersand, foil catches the light) · `tracked-caps` (airy, upright ampersand, flat ink) |
| `chrome` | `framed` (hairline boxes) · `open` (space and hairlines only) |

`chrome` is the biggest lever on how expensive the invitation looks. `open` is
the editorial treatment. Boxes are what make a page read as a web form rather
than as print, so reach for `framed` only when the source design genuinely has
frames, panes or borders in it.

**Do not invent font families.** The site loads exactly three faces (Italiana,
Cormorant Garamond, Jost). Naming anything else renders a fallback with no
warning — that is R3.

The four openers for `copy.opener`: `veil`, `foil`, `envelope`, `direct`.
`copy.openerName` is its human name: "The veil", "The foil", "The envelope",
"Direct".

---

## 2. Your assignment

Find your slug in the table in §7. It gives you:

- the design you are reinterpreting, and its page on the source site
- **your sample couple and date — use exactly these, do not invent your own**

The couple is assigned because the test suite rejects two styles sharing a
sample couple, and forty-six agents inventing names in parallel collide. The
assignment is the only thing that makes parallel work safe.

---

## 3. Scrape the source

```
WebFetch https://www.thedigitalyes.com/demo/<their-slug>
```

Ask it for: the colour palette, the typography, what imagery or ornament
appears, the overall mood, and how it opens.

If the fetch times out or returns nothing useful, **work from the one-line
description in §7** and say so in your report. Do not stall on it, and do not
invent detail you did not see.

**Write original prose.** Do not copy their sentences. Their copy is their
copyright, and duplicate text is actively bad for the SEO these pages exist to
earn. Take the *design*, write your own words about it.

**Change the name.** Your name is given in §7 and it is already different from
theirs. The test suite fails the build if a style still carries its source
name.

---

## 4. Write the file

Open `src/catalog/entries/<slug>.ts`. It is a generated stub. Replace the
whole thing, keeping `id` and `kind` exactly as generated, and set
`draft: false`.

`src/catalog/entries/vitrail.ts` is the worked example. Read it before you
start — it is the standard, not a suggestion.

### Requirements, field by field

**`draft`** — `false` when finished. While `true` the style has no URL at all:
it is out of the gallery, the sitemap and the router. That is R12, and it is
why a half-written style can never reach a visitor.

**`theme.palette`** — eight colours, `#RRGGBB`, **upper case hex**:
`bg` `surface` `ink` `muted` `accent` `accentSoft` `rule` `onAccent`.
`ink` on `bg` must clear **4.5:1** contrast (WCAG 2.2 AA). The suite computes
this; an invitation nobody can read is not a style.

**`copy.palette`** — five colours for the share image, which renders outside
the document and cannot read a CSS variable: `paper` `ink` `muted` `rule`
`accent`. `ink` on `paper` must also clear 4.5:1. Normally `paper` = `bg` and
the rest match the theme.

**`copy.name`** — ≤ 40 chars. House style is one evocative word, usually
Romance-language or Latin: Atelier Blanc, Vicioso, Aurum, Verdure, Obsidian.
Yours is assigned.

**`copy.summary`** — 30–120 chars. One declarative line. No marketing verbs.

**`copy.metaTitle`** — **≤ 60 chars and it must start with the style name.**
Under 60 is what lands in a search result. Pattern:
`Vitrail: a leaded-glass wedding invitation as a link`

**`copy.metaDescription`** — **110–165 chars.** Under 110 wastes the slot,
over 165 is truncated.

**`copy.spec`** — `paper`, `ink`, `faces`. Facts in words, never icons.
`faces` must name the real families you chose, e.g. `"Cormorant Garamond, Jost"`.

**`copy.sample`** — exactly the couple and date from §7.

**The four prose sections** — `whatItIs`, `whoItSuits`, `typography`,
`howItOpens`. Each needs **at least two paragraphs, each at least 80
characters**.

Write them the way the existing ones are written: concrete, specific to this
style, no superlatives. `whoItSuits` should name an actual venue, time of day
or kind of guest list. `howItOpens` must describe the opener you actually
chose, and must mention what happens under reduced motion.

These four sections are the entire reason the pages are not a doorway set.
Forty-six pages generated from one template get all forty-six discounted
together. Say something true about *this* style that is not true of the others.

**`nameDe`** — German display name. A proper noun is usually identical.

---

## 5. Verify

```
npx vitest run src/lib/catalog.test.ts
```

Your style must pass all eight of its per-style checks plus the set-wide ones.
Then:

```
npx tsc --noEmit
```

Do **not** run `npm run verify` — the build is slow and the orchestrator runs
it once at the end for everyone.

The suite checks, across the whole set, that no two published styles share a
**name, palette, summary, opening sentence or sample couple**. If you collide,
change *yours* — never edit another style's file to make room.

---

## 6. Rules of the fan-out

- **One file. Yours.** Never touch `src/invite/types.ts`, `src/catalog/index.ts`,
  `src/catalog/sources.ts`, `src/lib/seo.ts`, `src/invite/themes.ts`,
  `src/invite/i18n.ts`, or another agent's entry. They are shared; an edit
  there is a merge conflict with up to forty-five other agents.
- **Do not commit.** The orchestrator commits the batch.
- **A hook will block your first write to a file.** It demands four facts:
  the callers, that no existing file serves the purpose, the data shape, and
  the user's instruction verbatim. State them in your message, then **retry
  the identical write** — it goes through on the retry.
- **Read the stub before overwriting it**, or the write tool refuses.
- If you cannot make a style pass, **leave `draft: true`** and say why. A
  reported gap is cheap; a bad page that ships is not.

---

## 7. Assignments

Prices are flat per product and are not yours to set: invitations €125,
save the dates €25 (both €50 under the source). They live in `lib/seo.ts`.

### Invitations — `kind: "invitation"`

| Slug | Name | Source design & demo path | Reinterpreting | Partner A | Partner B | Date |
|---|---|---|---|---|---|---|
| `vitrail` | Vitrail | Stained Glass · `/demo/stained-glass` | *done — worked example* | Margaux | Julien | 2027-04-17 |
| `regalia` | Regalia | Royal · `/demo/royal` | Classic composition, refined typography | Aurelie | Anselm | 2027-03-03 |
| `diurne` | Diurne | Day & Night · `/demo/daynight` | From day to night | Beatriz | Bruno | 2027-04-10 |
| `hacienda` | Hacienda | La Finca · `/demo/finca` | Illustrated venue style | Clara | Casimir | 2027-05-17 |
| `maison-dor` | Maison d'Or | La Maison Dorée · `/demo/maison-doree` | White florals, pearl curtains, ivory bow | Delphine | Dmitri | 2027-06-24 |
| `palazzo` | Palazzo | Majestic · `/demo/majestic` | Beaded curtains, crystal chandelier, palms | Eleni | Edoardo | 2027-07-06 |
| `velluto` | Velluto | Teatro · `/demo/teatro` | Red velvet curtains opening on your story | Francesca | Fabien | 2027-08-13 |
| `belvedere` | Belvedere | Bella Vista · `/demo/bella-vista` | Tuscan watercolour under string lights | Giulia | Gaspard | 2027-09-20 |
| `perla` | Perla | Villa Perlé · `/demo/villa-perle` | Pearl embroidery and swans in Rome | Hanne | Hugo | 2027-10-02 |
| `riviera` | Riviera | Cap Blanc · `/demo/cap-blanc` | Watercolour French Riviera | Ingrid | Ivo | 2027-03-09 |
| `broderie` | Broderie | Embroidered Garden · `/demo/embroidered-garden` | Embroidered florals, Provençal villa | Johanna | Jakob | 2027-04-16 |
| `esmeralda` | Esmeralda | Prestige · `/demo/prestige` | Green velvet, white florals, silver chandeliers | Katarina | Konrad | 2027-05-23 |
| `ricamo` | Ricamo | Eleganza · `/demo/eleganza` | Hand-embroidered romance | Lucia | Lorenzo | 2027-06-05 |
| `lario` | Lario | Bellagio · `/demo/bellagio` | Italian embroidery by the lake | Marta | Mateo | 2027-07-12 |
| `giardino` | Giardino | Secret Garden · `/demo/secret-garden` | A secret garden behind the curtain | Noemi | Niall | 2027-08-19 |
| `cygne` | Cygne | Odette · `/demo/odette` | Inspired by Swan Lake | Ottilie | Oskar | 2027-09-26 |
| `papier` | Papier | Papercraft · `/demo/papercraft` | Cut and folded paper | Paloma | Pierre | 2028-10-08 |
| `regence` | Regence | Bridgerton · `/demo/bridgerton` | Regency-era romance | Rosa | Quentin | 2028-03-15 |
| `mosaico` | Mosaico | Boho · `/demo/boho` | Hand-painted mosaic borders, suns, wildflowers | Siobhan | Raphael | 2028-04-22 |
| `cadence` | Cadence | Minimal Fun · `/demo/minimal-fun` | Hand-drawn illustrations, playful monograms | Teresa | Stefan | 2028-05-04 |
| `laguna` | Laguna | Beach · `/demo/beach` | Turquoise water, palm trees, seashells | Valentina | Theo | 2028-06-11 |
| `savane` | Savane | Africa · `/demo/africa` | Savanna sunset, hand-painted animals, proteas | Wilhelmina | Ulrich | 2028-07-18 |
| `rosaio` | Rosaio | Rosas · `/demo/rosas` | Floral romance | Ximena | Vicente | 2028-08-25 |
| `gazette` | Gazette | Editorial · `/demo/editorial` | Inspired by fashion magazines | Yasmin | Wolfram | 2028-09-07 |
| `fiore` | Fiore | Bloom · `/demo/bloom` | A floral garden in full bloom | Zofia | Xavier | 2028-10-14 |
| `amalfi` | Amalfi | Dolce Vita · `/demo/dolce-vita` | Italian romance by the Mediterranean | Amara | Yannick | 2028-03-21 |
| `marine` | Marine | Nautical Edition · `/demo/nautical` | Exclusive nautical edition | Bianca | Zeno | 2028-04-03 |
| `levante` | Levante | Mediterranean · `/demo/mediterranean-edition` | Timeless Mediterranean elegance | Cecile | Andres | 2028-05-10 |
| `verger` | Verger | Floral · `/demo/floral` | Garden in bloom | Dorothea | Benedikt | 2028-06-17 |
| `caramelo` | Caramelo | Dulce Amor · `/demo/dulce-amor` | Sweet and romantic | Esther | Cormac | 2028-07-24 |
| `lineal` | Lineal | Minimalista · `/demo/minimal` | Fully customisable, stripped back | Fiona | Diego | 2028-08-06 |
| `voyage` | Voyage | Aventureros · `/demo/aventureros` | For travelling loves | Greta | Emil | 2028-09-13 |

### Save the dates — `kind: "save-the-date"`

A save the date is not a small invitation. It carries two names, one date and
a countdown, and nothing else — no ceremony time, no venue, no practical
lines. Write `whatItIs` accordingly: the restraint is the product.

| Slug | Name | Source design & demo path | Reinterpreting | Partner A | Partner B | Date |
|---|---|---|---|---|---|---|
| `std-tourterelle` | Tourterelle | The Lovebirds · `/save-the-date/the-lovebirds` | Two lovebirds, soft florals, gentle countdown | Helena | Florian | 2028-10-20 |
| `std-grattage` | Grattage | Photo Scratch · `/save-the-date/photo-scratch` | A photo revealed by scratching | Iris | Gideon | 2028-03-02 |
| `std-palatine` | Palatine | Majestic · `/save-the-date/majestic` | Grand, refined, unmistakably majestic | Juliette | Hendrik | 2028-04-09 |
| `std-grattage-dentelle` | Grattage Dentelle | Elegant Photo Scratch · `/save-the-date/elegant-photo-scratch` | Lace-framed photo revealed by scratching | Lena | Ignacio | 2028-05-16 |
| `std-voile` | Voile | The Soft Lace Edit · `/save-the-date/soft-lace-edit` | Soft, delicate lace with a gentle reveal | Mirela | Joaquin | 2028-06-23 |
| `std-dentelle` | Dentelle | The Lace Edit · `/save-the-date/lace-edit` | Wax seal on lace, timeless and editorial | Nadia | Kasper | 2028-07-05 |
| `std-cisne` | Cisne | Swans · `/save-the-date/cisnes` | Watercolour swans and a live countdown | Olivia | Leon | 2028-08-12 |
| `std-fleuron` | Fleuron | Floral · `/save-the-date/floral` | A floral frame around your date | Pilar | Mikkel | 2028-09-19 |
| `std-revelo` | Revelo | Interactive Scratch · `/save-the-date/interactive-scratch` | Scratch to reveal the date | Renata | Nikolai | 2028-10-26 |
| `std-boccio` | Boccio | Bloom · `/save-the-date/bloom` | Delicate florals in bloom | Saskia | Otto | 2029-03-07 |
| `std-chandelle` | Chandelle | Candlelight · `/save-the-date/candlelight` | Tap to light the candles | Thea | Pascal | 2029-04-14 |
| `std-oasis` | Oasis | Oasis Royale · `/save-the-date/oasis-royale` | Beaded curtains, palms and a fountain | Ursula | Rafael | 2029-05-21 |
| `std-jardin` | Jardin | Le Jardin · `/save-the-date/le-jardin` | A garden banquet under beaded drapes | Vera | Soren | 2029-06-03 |
| `std-cabana` | Cabana | Tropical · `/save-the-date/tropical` | Watercolour palms and cabana stripes | Wren | Tobias | 2029-07-10 |

---

## 8. Pre-merge checklist — for the human, not the agents

- [ ] **Stripe Prices still hold the old amount.** `lib/i18n` now shows €125
      for the invitation tier, but the charge comes from the Price named by
      `NEXT_PUBLIC_STRIPE_PRICE_INVITATION`, which this repository cannot
      read. Update it in Stripe, or the page and the receipt disagree.
- [ ] **Currency changed USD → EUR for the English locale.** Confirm that is
      wanted for US-facing traffic.
- [ ] Decide whether the seven original non-sellable styles (`vicioso`,
      `noir`, `sable`, `aurum`, `verdure`, `porcelain`, `obsidian`) should
      now be listed too. They are finished and written, and the catalogue
      policy that lists unbuyable styles would cover them. Left out of this
      change deliberately — it is a separate decision.
- [ ] `src/components/funnel/Styles.tsx` is **unreferenced** — nothing
      imports it. Pre-existing, not introduced here. Worth a look.
