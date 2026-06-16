-- Admin dashboard presence (online-now indicators on /admin/team and overview).
-- Run in Supabase SQL Editor. Access is server-only via service role.

create table if not exists public.admin_presence (
  user_id uuid primary key,
  last_active_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists admin_presence_last_active_at_idx
  on public.admin_presence (last_active_at desc);

alter table public.admin_presence enable row level security;

comment on table public.admin_presence is 'Last-seen timestamps for admin dashboard online indicators.';
