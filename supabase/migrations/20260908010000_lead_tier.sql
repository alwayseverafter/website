-- Which tier a lead asked about, for the leads captured before payment opens.
--
-- The Close now asks for an address while Stripe is unconfigured, so a lead can
-- arrive already having chosen between $249 and $599. That choice is the most
-- valuable thing about the lead and there was nowhere to put it.
--
-- Nullable, and null means something: a lead from The Mirror asked for a
-- preview and named no tier at all. Defaulting that to 'invitation' would
-- invent an intent nobody expressed, and every count afterwards would be wrong
-- in the same direction.
--
-- Checked against the same two values the funnel sells, so renaming a tier
-- fails here rather than quietly accumulating rows nothing can group by. R11.

alter table public.leads
  add column if not exists tier text
    check (tier is null or tier in ('invitation', 'commission'));

-- The pre-payment outreach list: who wanted which tier, newest first, and who
-- has not bought it yet. Partial on both, so it stays the size of the people
-- worth writing to rather than of the whole table.
create index if not exists leads_by_tier
  on public.leads (tier, created_at desc)
  where tier is not null and converted_at is null;
