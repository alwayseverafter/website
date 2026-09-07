# Open review findings

From a review of the funnel branch, 2026-09-06, revisited 2026-09-07 after the
funnel took ownership of its own database and the davet handoff was dropped.

## Fixed

- `/create` told every buyer their links were in an email that, with
  `RESEND_API_KEY` unset, was never sent.
- A Stripe redelivery or dashboard resend emailed the couple twice, because
  recording is idempotent and sending is not.
- A transient failure rendered "You have been charged and your order has not
  been recorded" while the webhook was still in flight.
- `/styles` asserted "Eight" styles in four places while rendering one.
- **`/api/lead` rejected a stale theme with a message about the address.** The
  schema now accepts any theme the renderer knows, and the 400 names the field
  that was actually wrong.
- **`RATE_LIMIT_SALT` was in no `.env.example`,** so the salt fell back to a
  known constant while the privacy page claimed the hash was salted. Now
  documented, with the reason.
- **Configuration was checked before the signature,** so an unauthenticated
  caller learned which environment variables were missing. Signature first now.
- **An unknown product origin printed an empty guest link.** Moot: there is no
  guest link, because nothing renders an invitation yet and the email no longer
  claims otherwise.

## Still open

**1. The seven unsellable `/styles/*` URLs hard 404.**
`src/app/styles/[theme]/page.tsx` sets `dynamicParams = false` and builds its
params from `THEME_ORDER`, now one entry. Any indexed result or shared link to
the other seven is dead rather than redirected. The restriction is temporary,
so the fix is a temporary redirect to `/styles` in `next.config.ts`, not a 410.
Note that `isThemeId` in `src/lib/seo.ts` still accepts all eight, so the
route's own guard never fires.

**2. The webhook does not re-check `theme` against `SELLABLE_THEME_IDS`.**
`readOrder` only checks the string is non-empty. A Stripe Checkout Session
lives about 24 hours, so someone who opened checkout before a narrowing and
pays after it carries a theme that is no longer sold. It is recorded as bought.
Lower severity now that nothing auto-renders from that value, but the delivery
row would still name a style you do not sell.

**3. The Close's "unavailable style" copy points at a one-item gallery.**
It says "Choose a style in the gallery, then begin", and `/styles` lists one
style. True, but thin. Worth revisiting when more themes are sellable.

## Raised and wrong

**The lead form is unsubmittable for seven of eight styles.** The stated cause
was that `src/components/funnel/Styles.tsx` still maps over `THEME_IDS`, so a
visitor can pick an unsellable style. That component is not rendered:
`Funnel.tsx` composes Door, Arrival, Turn, Mirror, Machine, Voices, Choice and
Close, and the styles section was dropped in `7342010`. The underlying defect
was real by a different route, stale `localStorage`, and is now fixed.
