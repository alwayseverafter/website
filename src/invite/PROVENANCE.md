# Provenance of `src/invite/`

The rendering core is **copied, not shared** (spec section 6). No monorepo, no
published package. Divergence is possible and a sync is a manual, deliberate
act. This file records what was copied and from where, and it is updated on
every sync.

| | |
|---|---|
| Source repo | `github.com/svareed/gifting`, working copy `/Users/sonus/soz_temp/gifting/davet` |
| Source commit | `8f497f2efe49242c4fd01ece9f265b212313d6c2` |
| Copied on | 2026-09-06 |

## What was taken

| Here | From | Note |
|---|---|---|
| `themes.ts` | `src/lib/themes.ts` | Architecture kept intact. Palettes are new. |
| `Ornament.tsx` | `src/components/invite/Ornament.tsx` | Paths verbatim, styling moved into the module. |
| `Reveal.tsx` | `src/components/invite/Reveal.tsx` | Rewritten for R8. |
| `Opener.tsx` | `src/components/invite/Opener.tsx` | `veil`, `foil`, `envelope` reworked. |
| `invite.module.css` | `src/app/globals.css` | The parts that styled the invitation only. |

## What was deliberately not taken

- **The `tor` opener.** It needs a photograph and a film, neither of which is in
  the funnel's prop contract. Porting it would have meant a fallback for a
  missing `heroImage`, which is precisely the shape of B1. The funnel's fourth
  opener is `direct`, which is the honest absence of a cover.
- **The `deco` (Cinzel) and `modern` (Playfair, Outfit) font pairings.** The
  funnel loads three faces. A theme naming a face nobody loads renders its
  fallback with no warning, which is R3. Pairings here are built from Italiana,
  Cormorant Garamond and Jost only.
- **`Blossom.tsx`, `Countdown.tsx`, `Forms.tsx`, `ScrollChrome.tsx`,
  `Invite.tsx`.** The funnel renders the read path of a cover, not the whole
  invitation: it has names, a date and a theme, and nothing else. Rendering a
  programme, a venue or an RSVP form would mean inventing data.
- **All global styles.** Everything is in a CSS Module (R2). The source's
  `position: fixed` surface textures became `absolute`, because `fixed` escapes
  an embedded frame.
- **All viewport units.** The source's `100dvh` cover and `118vh` petal fall are
  what R1 exists to prevent.
