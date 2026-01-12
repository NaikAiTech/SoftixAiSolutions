-- Supabase schema for Dial A Vet

create table if not exists users (
  id text primary key default gen_random_uuid(),
  createdAt timestamptz not null default now(),
  updatedAt timestamptz not null default now(),
  role text not null default 'CUSTOMER',
  phone text not null unique,
  email text,
  timezone text,
  firstName text,
  lastName text,
  animal text,
  petName text,
  concern text,
  conditions text,
  age text,
  breed text,
  sex text,
  desexed text
);

create table if not exists vet_profiles (
  id text primary key default gen_random_uuid(),
  userId text not null unique references users(id) on delete cascade,
  displayName text not null,
  phone text,
  timezone text,
  zoomUserEmail text,
  zoomMeetingNumber text,
  zoomPasscode text,
  emailAlerts boolean not null default true,
  smsAlerts boolean not null default false,
  status text not null default 'OFFLINE'
);

create table if not exists availability (
  id text primary key default gen_random_uuid(),
  vetId text not null references vet_profiles(id) on delete cascade,
  weekday int not null,
  start text not null,
  end text not null
);

create table if not exists appointments (
  id text primary key default gen_random_uuid(),
  createdAt timestamptz not null default now(),
  startTime timestamptz not null,
  durationMin int not null default 15,
  status text not null default 'SCHEDULED',
  userId text not null references users(id) on delete cascade,
  vetId text references vet_profiles(id),
  concern text,
  -- Per-booking pet details (moved from users)
  petName text,
  animal text,
  breed text,
  age text,
  conditions text,
  sex text,
  desexed text,
  notes text,
  outcome text,
  soap jsonb,
  videoRoom text,
  zoomMeetingId text,
  zoomJoinUrl text,
  zoomStartUrl text,
  zoomPassword text
);

create unique index if not exists appt_vet_time_unique on appointments(vetId, startTime);

create table if not exists memberships (
  id text primary key default gen_random_uuid(),
  userId text not null unique references users(id) on delete cascade,
  status text not null default 'ACTIVE',
  stripeSubId text,
  expiresAt timestamptz
);

create table if not exists otps (
  id text primary key default gen_random_uuid(),
  phone text not null,
  code text not null,
  expiresAt timestamptz not null,
  consumed boolean not null default false
);
create index if not exists otps_phone_code_idx on otps(phone, code);

-- Partner companies registry
create table if not exists partner_companies (
  id text primary key default gen_random_uuid(),
  name text not null unique,
  description text,
  websiteUrl text,
  defaultAccessDays int,
  codePrefix text,
  active boolean not null default true,
  createdAt timestamptz not null default now()
);

create table if not exists partner_code_batches (
  id text primary key default gen_random_uuid(),
  companyId text not null references partner_companies(id) on delete restrict,
  description text,
  accessDays int,
  expiresAt timestamptz,
  createdAt timestamptz not null default now()
);

create table if not exists partner_codes (
  id text primary key default gen_random_uuid(),
  code text not null unique,
  description text,
  accessDays int,
  expiresAt timestamptz,
  active boolean not null default true,
  batchId text references partner_code_batches(id) on delete cascade,
  createdAt timestamptz not null default now()
);

create table if not exists partner_redemptions (
  id text primary key default gen_random_uuid(),
  codeId text not null references partner_codes(id) on delete cascade,
  phone text not null,
  userId text references users(id) on delete cascade,
  createdAt timestamptz not null default now()
);
-- Enforce single-use of each code; allow multiple redemptions over time per user
create unique index if not exists partner_redemptions_code_unique on partner_redemptions(codeId);

create table if not exists sessions (
  id text primary key default gen_random_uuid(),
  userId text not null references users(id) on delete cascade,
  createdAt timestamptz not null default now(),
  expiresAt timestamptz
);

create table if not exists appt_manage_tokens (
  id text primary key default gen_random_uuid(),
  token text not null unique,
  appointmentId text not null references appointments(id) on delete cascade,
  expiresAt timestamptz not null
);

create table if not exists free_consult_tokens (
  id text primary key default gen_random_uuid(),
  email text not null,
  token text not null unique,
  source text,
  metadata jsonb,
  createdAt timestamptz not null default now(),
  expiresAt timestamptz not null default (now() + interval '7 days'),
  redeemedAt timestamptz
);

create index if not exists free_consult_tokens_email_idx on free_consult_tokens(email);

-- Global admin settings (single row with id='global')
create table if not exists admin_settings (
  id text primary key default 'global',
  systemAnnouncement text,
  defaultTimezone text,
  videoPlatform text,
  requireOtp boolean not null default true,
  allowVetAvailability boolean not null default true,
  plan_one_off_enabled boolean not null default true,
  plan_one_off_display_price int,
  plan_one_off_price_id text,
  plan_annual_enabled boolean not null default true,
  plan_annual_display_price int,
  plan_annual_price_id text,
  plan_biennial_enabled boolean not null default true,
  plan_biennial_display_price int,
  plan_biennial_price_id text
);

-- Q&A content (for AI and knowledge pages)
create table if not exists qa_items (
  id text primary key default gen_random_uuid(),
  createdAt timestamptz not null default now(),
  updatedAt timestamptz not null default now(),
  slug text unique,
  question text not null,
  answer text not null,
  tags text[] not null default '{}',
  published boolean not null default true,
  views int not null default 0
);

-- RLS: allow public read of published items only; writes via service role
alter table qa_items enable row level security;
create policy if not exists qa_items_select_published on qa_items
for select using (published = true);

