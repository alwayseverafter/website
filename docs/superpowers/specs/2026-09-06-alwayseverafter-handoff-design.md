# The handoff: from a paid Stripe session to an invitation that collects RSVPs

Companion to `2026-09-06-alwayseverafter-funnel-design.md`. That spec sells. This
one delivers what was sold, and stores what comes back.

## 1. The defect this closes

`src/app/api/checkout/route.ts:141` sets `success_url` to
`${siteUrl}/create?session={CHECKOUT_SESSION_ID}`.

There is no `/create` route. Every customer who pays today is redirected to a
404, having been charged. `STRIPE_WEBHOOK_SECRET` sits in `.env.example` and
nothing reads it. Nothing is provisioned, nothing is emailed, and the couple has
no way to reach a product they own.

This is the first thing to fix, ahead of the logo and ahead of lead capture,
because it is the only defect on the list that takes money and returns nothing.

## 2. What was decided, and by whom

Four decisions were taken by the operator on 2026-09-06. They are recorded here
because three of them overrule the funnel spec, and a reader of that document
needs to know it was deliberate.

| Decision | Chosen | Overrules |
|---|---|---|
| Where invite and RSVP data lives | Provision into davet's Supabase | funnel spec section 6, "No database" |
| Themes sold until the palettes are ported | `atelier-blanc` only | funnel spec section 5, eight `/styles` pages |
| Order of work | Handoff first, then logo, then leads | nothing |
| Lead capture placement | Opt in, below The Mirror, never gating | funnel spec section 4.3 is preserved, not overruled |

Logo and lead capture are **out of scope for this document**. They are bounded
changes to code that already exists and they follow this one.

## 3. Why the product's database, and not a new one

`gifting/davet` already runs the entire read and write path this feature needs,
in production, behind row level security:

| Need | Where it already lives |
|---|---|
| Invitation record | `public.invites`, `supabase/schema.sql` |
| Guest households and seat allowances | `public.guests`, with a per household token |
| Responses | `public.rsvps`, one row per household, enforced by `rsvps_one_per_guest` |
| Guest reply endpoint | `src/app/api/rsvp/route.ts`, honeypot and rate limit included |
| Response retrieval | `src/app/dashboard/[id]/rsvps/page.tsx`, `RsvpTable.tsx` |
| Guest list management | `src/components/builder/GuestList.tsx` |
| Retention | `purge_old_guest_data()`, 90 days after the last event |
| Responses are never public | RLS policy `owner_all` on `public.rsvps`, no anon select |

**The RSVP feature is therefore not built here. It is reached.** The new code is
the bridge: a webhook, a provisioning endpoint, and a page. Rebuilding the
schema in the funnel would produce a second system to keep in step with the
first, and the funnel spec's own instruction is that `davet` keeps running.

## 4. Prerequisite: restrict what can be sold

`src/invite/PROVENANCE.md` records that the renderer's architecture was ported
but its **palettes are new**. The consequence was not noticed at the time:

```
funnel  atelier-blanc  vicioso  noir  sable  aurum  verdure  porcelain  obsidian
davet   atelier-blanc  ivory-gold  onyx-champagne  emerald-brass  iznik-blue
        marble-gilt  rosewater  sand-terracotta  kasavu
        ~~~~~~~~~~~~~
        the only id present on both sides
```

`public.invites.theme` is `text not null default 'ivory-gold'` with **no CHECK
constraint**, so provisioning `"vicioso"` would insert cleanly and fail only at
render, in the product, after payment. That is R3 with the failure moved as far
from the cause as it can get, and R11 is the rule that exists to catch it.

Until the seven palettes are ported, only `atelier-blanc` is sold.

### How the restriction is expressed

A named subset, not a deletion. The renderer keeps all eight themes, because
The Mirror and The Arrival still render them and the palettes are finished work.

```ts
// src/invite/types.ts
/**
 * The themes that can be bought today. A theme is sellable only once davet can
 * render it, and davet's palettes are a different set (PROVENANCE.md). Selling
 * one it does not have would provision an invitation that renders wrong after
 * payment, which is R3 at the worst possible moment. Widen this list in the
 * same commit that ports the palette, never before.
 */
export const SELLABLE_THEME_IDS = ["atelier-blanc"] as const;
export type SellableThemeId = (typeof SELLABLE_THEME_IDS)[number];
```

Three call sites read it:

| File | Change |
|---|---|
| `src/app/api/checkout/route.ts` | `theme: z.enum(SELLABLE_THEME_IDS)`, so an edited request body cannot buy an unsellable style |
| `src/app/styles/page.tsx` | gallery lists sellable themes only |
| `src/app/styles/[theme]/page.tsx` | `generateStaticParams` returns sellable themes only |

`/styles` drops from eight indexable pages to one. That is a real SEO cost and
it is accepted knowingly: the funnel spec calls those pages "the cheapest search
surface available", and one honest page beats eight that sell a thing the
product cannot build. Porting the palettes restores them.

## 5. The provisioning flow

```
         Stripe Checkout, payment succeeded
                        │
                        ▼
  ┌───────────────────────────────────────────────┐
  │ funnel  POST /api/stripe/webhook              │
  │   verify signature against STRIPE_WEBHOOK_SECRET
  │   accept checkout.session.completed only      │
  │   read metadata written at checkout           │
  └───────────────────────┬───────────────────────┘
                          │  shared secret, server to server
                          ▼
  ┌───────────────────────────────────────────────┐
  │ davet   POST /api/provision                   │
  │   1  find or create the auth user for the     │
  │      buyer's Stripe email                     │
  │   2  db.createInvite(ownerId, locale)         │
  │   3  compute the slug from the real names     │
  │   4  db.updateInvite(names, theme, slug)      │
  │   5  generate a magic link into the builder   │
  │   returns { inviteId, slug, editorUrl }       │
  └───────────────────────┬───────────────────────┘
                          │
                          ▼
  ┌───────────────────────────────────────────────┐
  │ funnel  send the email (Resend)               │
  │         their invitation link, their editor   │
  └───────────────────────┬───────────────────────┘
                          │
                          ▼
  ┌───────────────────────────────────────────────┐
  │ funnel  GET /create?session={id}              │
  │         reads the provisioning record,        │
  │         shows the two links on screen         │
  └───────────────────────────────────────────────┘
```

The webhook provisions. The page only reads. A page that provisioned would
provision twice for a customer who refreshes, and would provision not at all for
one who closes the tab, which is the more common of the two.

### Why an endpoint in davet, rather than the funnel writing to the tables

`db.createInvite` is not an insert. Reading `src/lib/db/supabase.ts:186`, it
seeds the invitation's default content, resolves a slug collision, writes the
child rows through `replaceChildren`, and `POST /api/invites` layers organisation
lookup and plan quota on top. Reimplementing that in the funnel would fork four
invariants across two repositories.

So the funnel holds no Supabase credentials and no schema knowledge. It holds
one URL and one secret. Adding a route to davet is additive; no existing davet
behaviour changes.

## 6. The provisioning endpoint

`gifting/davet/src/app/api/provision/route.ts`, new.

**Request**

```jsonc
{
  "stripeSessionId": "cs_live_...",   // the idempotency key
  "email":           "max@example.com",
  "partnerAName":    "Max",
  "partnerBName":    "Lena",
  "weddingDate":     "2026-12-15",     // ISO 8601 calendar date
  "theme":           "atelier-blanc",
  "tier":            "invitation",
  "locale":          "en"
}
```

**Response**

```jsonc
{ "inviteId": "uuid", "slug": "max-lena", "editorUrl": "https://.../auth/callback?..." }
```

Authenticated by `Authorization: Bearer ${PROVISION_SECRET}`, compared with a
timing safe equality. No cookie, no user session: the caller is a server.

**The same route answers `GET ?stripeSessionId=...`**, returning the record if
one exists and 404 if it does not. `/create` needs a read, and section 7's
"not yet" state is exactly that 404. One route rather than two, because the
read and the write share the key, the secret and the shape.

### 6.1 The owner has to exist first

`invites.owner_id` is `not null references auth.users(id)`. There is no
invitation without a user, so step one is the Supabase admin API:

- look up the buyer's Stripe email among existing users,
- create one if absent, with no password, email confirmed, since they have paid
  and asking them to set a password before seeing what they bought is a wall,
- `generateLink({ type: "magiclink" })` for the editor URL.

A couple who buys twice gets one account and two invitations, which is correct.

### 6.2 The slug has to be recomputed

`createInvite(ownerId, locale, opts)` takes no names. It seeds a slug from the
seed content and de-duplicates it, so without intervention every couple lands on
`max-und-lena-2`, `-3`, `-4`. `updateInvite` applies the patch it is given and
does not re-derive the slug.

Provisioning therefore calls `suggestSlug(a, b, locale)` from
`src/lib/slug.ts`, resolves collisions against `slugTaken` the same way
`createInvite` does, and passes `slug` in the patch. `slugLocked` stays `false`,
so the couple can still change their address by hand.

### 6.3 The wedding date does not have a column

`public.invites` carries no wedding date. The date lives on
`public.events.starts_at`, which is `timestamptz`, an absolute instant. The
funnel captures `weddingDate`, a calendar date, and never asks for a time of
day.

**Provisioning does not invent one, and does not make the column nullable
either.** Inventing 15:00 would put a wrong time in front of every guest and
start a countdown to it. Relaxing `starts_at` would push a null into davet's
countdown, `src/lib/reminders.ts` and `remindersDue`, which is a large change to
a working product in service of a funnel feature.

Neither is necessary, because **an invitation with no events is already a
supported state in davet**, guarded at every call site:

| Site | Guard |
|---|---|
| `src/components/invite/Invite.tsx:54`, `:181` | renders the section only when `events.length` |
| `src/app/[slug]/page.tsx:17`, `opengraph-image.tsx:81`, `preview/[id]/page.tsx:21` | ternary on `events[0]` |
| `src/lib/db/supabase.ts:133` | `if (invite.events.length)` before insert |
| `src/components/builder/Builder.tsx:113` | an explicit blocker for the empty case |

So provisioning creates the invitation with **no events**, and the couple's
first task in the builder is to add the ceremony with its time. That is not a
gap the funnel leaves behind: `Builder.tsx:108` already computes named blockers
and `:127` already withholds publishing until every event has a venue, so the
couple lands on a builder that says which piece is missing and where it lives.
The behaviour we want was already built for a different reason.

The date they typed is still carried, in a new `invites.wedding_date` column, so
the ceremony form opens with their date already in it. They confirm a time, they
do not re-enter a date. That keeps the promise `Choice.tsx` makes on the way in:
"Your names, your date and your style are already in place when you arrive."

**The call sequence**

```ts
// blank: true keeps the structure and drops the worked example's words, so a
// paying couple never sees Amir and Leyla's venues (src/lib/seed.ts:6).
const invite = await db.createInvite(ownerId, locale, { blank: true });

// events: [] reaches replaceChildren and clears the seeded rows. Passing it is
// what produces the empty-events state above; omitting it would leave seeded
// dates nobody chose.
await db.updateInvite(invite.id, ownerId, {
  partnerAName, partnerBName, theme, slug, weddingDate, events: [],
});
```

### 6.4 Idempotency

Stripe retries a webhook that does not return 2xx, and will deliver the same
event more than once regardless. Two deliveries must not create two
invitations for one payment.

`stripe_session_id` is stored on the invitation, `unique`. Provisioning inserts
and treats a unique violation as success, returning the existing row. The key is
the payment, so the guarantee holds across retries, redeploys and manual replays
from the Stripe dashboard.

## 7. The `/create` page

`src/app/create/page.tsx`, new. A server component, `dynamic = "force-dynamic"`.

It reads the session id from the query string, asks davet for the provisioning
record belonging to it, and renders one of three states. There is no fourth
state and no silent one:

| State | What the couple sees |
|---|---|
| Provisioned | Their names, their date, a link to their invitation and a link to their editor. The same two links the email carries, so the tab is enough and the email is a backup. |
| Not yet | "Your payment went through. Your invitation is being prepared." with a polite live region and a refresh, because a webhook can arrive after the redirect. |
| Failed | What failed, in words, and the address to write to, with the session id shown so support can find the payment in one search. Never a generic apology. |

The third state is the one that matters. R3 and R12: a customer who paid and
whose provisioning failed must be told, on the page, that it failed and that
their money is accounted for. Showing them a spinner forever is the failure this
project has already paid for once.

## 8. Migrations

R11: any value reaching a database constraint needs a migration.

`gifting/davet/supabase/migrations/0004_funnel_handoff.sql`, new:

```sql
-- The Stripe payment that created this invitation. Unique, so a webhook
-- retry cannot provision a second invitation for one payment.
alter table public.invites add column stripe_session_id text;
create unique index invites_stripe_session
  on public.invites (stripe_session_id) where stripe_session_id is not null;

-- The calendar date the couple typed on the funnel. events.starts_at remains
-- the only source of truth for the instant, and stays not null; this column
-- exists so the ceremony form opens with their date already in it, before
-- anyone has chosen a time of day. See section 6.3.
alter table public.invites add column wedding_date date;
```

Two columns, one index, no constraint relaxed and no existing column altered.
An earlier draft of this document dropped `not null` from `events.starts_at`;
section 6.3 records why that turned out to be unnecessary.

Checked against the existing constraints, no other migration is required:

| Column | Constraint | Funnel values | Verdict |
|---|---|---|---|
| `invites.locale` | `in ('en','de','tr')` | `en`, `de` | subset, safe |
| `invites.opener` | `in ('veil','foil','envelope','direct','tor')` | `veil`, `foil`, `envelope`, `direct` | subset, safe |
| `invites.theme` | none | `atelier-blanc` only, per section 4 | safe by restriction |
| `invites.tradition` | `in ('islamic','christian','secular')` | not sent, default applies | safe |

Both changes are additive. Nothing in davet reads either column yet, so the
migration is safe to apply before the code that uses it, and davet keeps
running unchanged until the provisioning route is deployed.

## 9. Failure modes, and what each one says

No silent path. Each row is a real branch with a message written for the person
it reaches.

| Failure | Webhook | The couple |
|---|---|---|
| Signature invalid | 400, no processing | nothing, this is not a real customer |
| davet unreachable | 500, so Stripe retries | `/create` shows "being prepared" and keeps the payment visible |
| Provisioning throws | 500, logged with the session id | `/create` names the failure and the address to write to |
| Email fails, invite created | 200, the payment is provisioned | `/create` shows both links, and says the email did not send |
| Replay of a handled event | 200, returns the existing invitation | the same two links as the first time |

The fourth row is why the links render on the page rather than only in the
email. `EMAIL_CONFIGURED` in `src/lib/email.ts` is already a reportable state in
davet rather than a crash, and the same discipline applies here.

## 10. Environment

Funnel, added to `.env.example`:

```
DAVET_PROVISION_URL=https://davet.example/api/provision
DAVET_PROVISION_SECRET=
RESEND_API_KEY=
DELIVERY_FROM=
```

davet, added to `.env.example`:

```
PROVISION_SECRET=
```

`readStripeConfig` in `src/lib/stripe.ts` is the pattern for all of these:
nothing throws at module load, missing variables come back as data, and the
route names them. A funnel with no `DAVET_PROVISION_SECRET` must refuse to take
money rather than take it and fail to deliver, so `/api/checkout` grows the same
check it already performs for Stripe keys.

## 11. Testing

Vitest is configured in both repositories.

**Unit**
- Signature verification rejects a tampered body.
- `checkout.session.completed` is handled; other event types are ignored.
- Two deliveries of one session id produce one invitation.
- Slug derivation, including a collision and a German umlaut through `GERMAN`.
- Zod rejects an unsellable theme, a malformed date, and `2026-02-31`.
- Every failure branch in section 9 returns its own status and message. R3's
  standing complaint is that fallback paths ship untested, so each one gets a
  test that executes it.

**Integration**, against a local Supabase
- Provision from a fixture session, then read the invitation back as its owner.
- A provisioned invitation has zero events, carries `wedding_date`, and renders
  at `/[slug]` without throwing. Section 6.3 rests on that guard holding, and R3
  is explicit that a path nobody executes is a path nobody has verified.
- Post an RSVP through davet's existing `/api/rsvp` and read it at
  `/dashboard/[id]/rsvps`, closing the loop this document exists to close.
- An anonymous select against `public.rsvps` returns nothing, proving RLS holds
  for a row created by this path.

**Manual**, once
- `stripe listen --forward-to localhost:3000/api/stripe/webhook` with a test
  card, all the way to a rendered invitation.

## 12. Success criteria

1. A test card payment produces an invitation seeded with the couple's names,
   their date and `atelier-blanc`, reachable by the couple within one minute.
   It has no events, and the builder names the missing ceremony as a blocker.
2. `/create` renders all three of its states, each provoked deliberately.
3. A guest submits an RSVP and the couple sees it at `/dashboard/[id]/rsvps`.
4. Replaying the webhook from the Stripe dashboard creates nothing new.
5. No unsellable theme can reach checkout, including from an edited body.
6. `npm run verify` passes in both repositories.

## 13. Open questions

1. **Where davet is deployed.** `DAVET_PROVISION_URL` needs a real origin, and
   whether the couple's editor lives on that domain or on a subdomain of
   `alwayseverafter.com` is question 3 in the funnel spec, still open.
2. **The Commission tier.** Section 5 provisions The Invitation. The funnel spec
   says The Commission is deliberately manual, so its webhook branch should
   notify a human and not provision. Confirm that is still the intent.
3. **Whether the seven palettes get ported.** Section 4 is a restriction with a
   removal date, not a permanent state. Porting them is a data change in davet's
   `themes.ts` and restores `/styles` to eight pages.

## 14. Provenance

- Funnel spec: `docs/superpowers/specs/2026-09-06-alwayseverafter-funnel-design.md`.
- Product working copy: `/Users/sonus/soz_temp/gifting/davet`, schema read at
  `supabase/schema.sql` and `supabase/migrations/0001` through `0003`.
- Renderer copy provenance: `src/invite/PROVENANCE.md`, source commit
  `8f497f2efe49242c4fd01ece9f265b212313d6c2`.
- Decisions in section 2 taken by the operator, 2026-09-06.
