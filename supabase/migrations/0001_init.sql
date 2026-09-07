-- Always Ever After. Run once against a fresh Supabase project.
--
-- Three things this schema exists to guarantee:
--
--   1. Two clients with the same names are two clients. Identity is a uuid,
--      never a name, and there is deliberately no unique constraint on a name.
--   2. Every product delivered to a client is its own row, linked to the
--      client and to the product, so "everything they have bought" is one
--      indexed query rather than a join across payment records.
--   3. Leads live apart from clients until one converts, and then they link.

create extension if not exists pgcrypto;
-- citext so Max@x.com and max@x.com cannot become two clients. Case folding an
-- address in application code works right up until one call site forgets.
create extension if not exists citext;

-- Sets updated_at on write. A trigger rather than an application concern,
-- because the one path that forgets is the one that matters in an audit.
create or replace function public.touch_updated_at() returns trigger
  language plpgsql as $$
    begin
      new.updated_at = now();
      return new;
    end;
  $$;

-- Products ------------------------------------------------------------------
-- The catalogue. A row rather than a constant, so a price id is stored once
-- and referenced, instead of being read from the environment at three call
-- sites that can disagree.

create table public.products (
  id               uuid primary key default gen_random_uuid(),
  sku              text not null unique check (sku ~ '^[a-z][a-z0-9_]{1,38}$'),
  name             text not null,
  -- The Stripe Price this sells as. Null until Stripe is configured, and
  -- never the amount: Stripe owns the number, this owns the reference.
  stripe_price_id  text,
  active           boolean not null default true,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create trigger products_touch before update on public.products
  for each row execute function public.touch_updated_at();

-- Clients -------------------------------------------------------------------
-- A couple who has paid. One row per person-who-buys, many deliveries under it.

-- A short human key. A uuid is correct for machines and useless down a phone,
-- so support quotes this instead. Starts high so the first client is not
-- visibly the first client.
create sequence public.client_ref_seq start 1042;

create table public.clients (
  id              uuid primary key default gen_random_uuid(),
  ref             text not null unique
                    default 'AEA-' || lpad(nextval('public.client_ref_seq')::text, 5, '0'),
  -- The natural key. Unique, so a second purchase attaches to the same client
  -- rather than creating a twin.
  email           citext not null unique,
  -- Deliberately NOT unique, alone or together. Two couples are called Max
  -- and Lena and both are real clients.
  partner_a_name  text not null default '',
  partner_b_name  text not null default '',
  -- ISO 3166-1 alpha-2. text with a check rather than char(2), which pads.
  country         text check (country ~ '^[A-Z]{2}$'),
  locale          text not null default 'en' check (locale in ('en', 'de')),
  -- Set by anonymize_client(). A row with this set holds no personal data and
  -- exists only to keep its deliveries referentially intact.
  anonymized_at   timestamptz,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create trigger clients_touch before update on public.clients
  for each row execute function public.touch_updated_at();

create index clients_country on public.clients (country);
create index clients_created on public.clients (created_at desc);

-- Deliveries ----------------------------------------------------------------
-- One product, delivered once, to one client. The financial record.

create table public.deliveries (
  id                     uuid primary key default gen_random_uuid(),
  -- restrict, not cascade: a delivery is an accounting record and must not
  -- disappear because someone tidied a client. Erasure anonymizes the client
  -- instead, which is how Article 17 resolves against retention duty.
  client_id              uuid not null references public.clients(id) on delete restrict,
  product_id             uuid not null references public.products(id) on delete restrict,
  -- The payment. Unique, so a webhook retry or a manual replay cannot record
  -- one payment twice. Partial, because a delivery created by hand has none.
  stripe_session_id      text,
  stripe_payment_intent  text,
  -- Minor units, always. 249 dollars is 24900. Never a float, which cannot
  -- represent 0.1, and never a formatted string, which cannot be summed.
  amount_minor           integer not null check (amount_minor >= 0),
  currency               text not null check (currency ~ '^[A-Z]{3}$'),
  status                 text not null default 'pending'
                           check (status in ('pending', 'provisioned', 'delivered',
                                             'refunded', 'cancelled')),
  -- What was bought, as chosen at checkout.
  wedding_date           date,
  theme                  text not null default '',
  locale                 text not null default 'en' check (locale in ('en', 'de')),
  delivered_at           timestamptz,
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now()
);

create trigger deliveries_touch before update on public.deliveries
  for each row execute function public.touch_updated_at();

create unique index deliveries_stripe_session
  on public.deliveries (stripe_session_id) where stripe_session_id is not null;

-- "Everything this client has bought, newest first" is the query support runs
-- and the one the dashboard will run. This is that query's index.
create index deliveries_by_client on public.deliveries (client_id, created_at desc);
create index deliveries_by_product on public.deliveries (product_id);
create index deliveries_by_status on public.deliveries (status);

-- Leads ---------------------------------------------------------------------
-- Someone who named themselves and asked to be written to, without buying.
-- Kept apart from clients, and linked to one only once they convert.

create table public.leads (
  id              uuid primary key default gen_random_uuid(),
  email           citext not null unique,
  partner_a_name  text not null default '',
  partner_b_name  text not null default '',
  wedding_date    date,
  theme           text not null default '',
  locale          text not null default 'en' check (locale in ('en', 'de')),
  -- The moment consent was given, not a boolean. "Did they agree" is
  -- answerable from a timestamp; "when" is what a GDPR request asks.
  consent_at      timestamptz not null,
  -- Salted one way hash, for abuse counting. Never the address itself.
  ip_hash         text,
  -- set null, not restrict: erasing a client must not be blocked by a lead,
  -- and an orphaned lead is still a lead.
  client_id       uuid references public.clients(id) on delete set null,
  converted_at    timestamptz,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  -- The two must move together. A converted lead has a client and a client
  -- means converted, so neither can be set alone by a buggy call site.
  constraint leads_conversion_consistent
    check ((client_id is null) = (converted_at is null))
);

create trigger leads_touch before update on public.leads
  for each row execute function public.touch_updated_at();

create index leads_by_client on public.leads (client_id);
create index leads_created on public.leads (created_at desc);
-- The outreach list: everyone who has not bought. Partial, so it stays small
-- as converted leads accumulate.
create index leads_unconverted on public.leads (created_at desc) where converted_at is null;

-- Retrieval -----------------------------------------------------------------
-- One client's whole history, flattened. security_invoker so the view is
-- subject to the caller's access to the base tables rather than the owner's.

create view public.client_records with (security_invoker = true) as
  select
    c.id            as client_id,
    c.ref,
    c.email,
    c.partner_a_name,
    c.partner_b_name,
    c.country,
    c.locale,
    d.id            as delivery_id,
    p.sku           as product_sku,
    p.name          as product_name,
    d.status,
    d.amount_minor,
    d.currency,
    d.wedding_date,
    d.theme,
    d.stripe_session_id,
    d.created_at    as purchased_at,
    d.delivered_at
  from public.clients c
  left join public.deliveries d on d.client_id = c.id
  left join public.products p on p.id = d.product_id;

-- Row level security --------------------------------------------------------
-- Enabled with no policies declared, deliberately. This site has no end user
-- login, so every read and write goes through a route handler holding the
-- service role. RLS with no policy denies every other role outright, which is
-- stronger and simpler than writing permissive policies nobody audits.

alter table public.products   enable row level security;
alter table public.clients    enable row level security;
alter table public.deliveries enable row level security;
alter table public.leads      enable row level security;

-- Erasure and retention -----------------------------------------------------

-- Article 17 without destroying the accounting record. The client row stays,
-- referentially intact for its deliveries, holding nothing about a person.
create or replace function public.anonymize_client(c uuid) returns void
  language plpgsql security definer set search_path = public as $$
    begin
      delete from public.leads where client_id = c;
      update public.clients set
        email          = 'erased+' || c::text || '@invalid',
        partner_a_name = '',
        partner_b_name = '',
        anonymized_at  = now()
      where id = c;
    end;
  $$;

revoke execute on function public.anonymize_client(uuid) from anon, authenticated;

-- A lead who never became a client is deleted after twelve months. Schedule
-- with pg_cron:
--   select cron.schedule('aea-purge-leads','15 3 * * *','select public.purge_old_leads()');
create or replace function public.purge_old_leads() returns void
  language sql security definer set search_path = public as $$
    delete from public.leads
     where converted_at is null
       and created_at < now() - interval '12 months';
  $$;

revoke execute on function public.purge_old_leads() from anon, authenticated;

-- Seed ----------------------------------------------------------------------
-- The two tiers the funnel sells. stripe_price_id is filled in once the Prices
-- exist; a null there is what makes checkout report itself unconfigured.

insert into public.products (sku, name) values
  ('invitation', 'The Invitation'),
  ('commission', 'The Commission')
on conflict (sku) do nothing;
