# Open review findings

From a review of `feat/handoff-logo-leads` and `feat/funnel-provisioning`,
2026-09-06. Twelve findings were raised, eleven verified, one wrong.

The three that reach a paying customer are fixed on the branch. The seven
below are real and deliberately left, because the session that found them was
already expensive and none of them takes money and returns nothing. Each is
worth doing before this carries real traffic.

## Not fixed

**1. The seven unsellable `/styles/*` URLs hard 404.**
`src/app/styles/[theme]/page.tsx` sets `dynamicParams = false` and builds its
params from `THEME_ORDER`, now one entry. Any indexed result or shared link to
the other seven is dead rather than redirected. The restriction is temporary,
so the fix is a temporary redirect to `/styles` in `next.config.ts`, not a 410.
Note that `isThemeId` in `src/lib/seo.ts` still accepts all eight, so the
route's own guard never fires.

**2. The webhook does not re-check `theme` against `SELLABLE_THEME_IDS`.**
`readMetadata` in `src/app/api/stripe/webhook/route.ts` only checks the string
is non-empty. A Stripe Checkout Session lives about 24 hours, so someone who
opened checkout before this deploy and pays after it carries a theme that is no
longer sellable. The product refuses it with a 422, which the funnel turns into
a 500 and Stripe then retries forever. The webhook is the last gate and should
name this case rather than loop on it.

**3. `/api/lead` rejects a stale theme with a message about the address.**
The schema uses `z.enum(SELLABLE_THEME_IDS)`, but a visitor's `localStorage`
can hold any of the eight from before the narrowing. The 400 renders as "That
address did not look right", pointing at the wrong field, which is the exact
failure the checkout route's own comment says it avoids. A lead's chosen style
is data, not a purchase, so this should accept any known theme id.

**4. `RATE_LIMIT_SALT` is in no `.env.example`, so the salt is a constant.**
`src/lib/iphash.ts` falls back to `"aea-unsalted-dev-only"`. A known constant
salt over the IPv4 space is brute forceable, and the privacy copy added in the
same commit tells visitors the hash "cannot be turned back into it". Either add
the variable and document it, or fail loudly when it is absent. The copy should
not ship ahead of the property it describes.

**5. An unknown product origin still prints the guest-link sentence.**
`inviteUrl: guestUrl ?? ""` in the webhook. When `DAVET_PROVISION_URL` will not
parse, the email says "This is the link your guests will use, once you publish:"
followed by a blank line. `productOrigin`'s own documentation says a caller
should show nothing rather than a link to nowhere.

**6. Configuration is checked before the signature is verified.**
`readWebhookConfig()` runs first, so an unauthenticated caller who POSTs to
`/api/stripe/webhook` is told which environment variables are missing. Moving
the check after `constructEvent` keeps the operator-facing log and stops
answering probes.

**7. The Close's "unavailable style" copy points at a one-item gallery.**
It says "Choose a style in the gallery, then begin", and `/styles` now lists
one style. True, but thin. Worth revisiting when the palettes are ported.

## Raised and wrong

**The lead form is unsubmittable for seven of eight styles.** The stated cause
was that `src/components/funnel/Styles.tsx` still maps over `THEME_IDS`, so a
visitor can pick an unsellable style. That component is not rendered: `Funnel.tsx`
composes Door, Arrival, Turn, Mirror, Machine, Voices, Choice and Close, and the
styles section was dropped in `7342010`. The underlying defect is real by a
different route, stale `localStorage`, and is item 3 above.

## Fixed on the branch

- `/create` told every buyer their links were in an email that, with
  `RESEND_API_KEY` unset, was never sent.
- A Stripe redelivery or dashboard resend emailed the couple twice, because
  provisioning is idempotent and sending is not.
- A transient 5xx from the product rendered "You have been charged and your
  invitation has not been created" while the webhook was still in flight.
- `/styles` asserted "Eight" styles in four places while rendering one.
