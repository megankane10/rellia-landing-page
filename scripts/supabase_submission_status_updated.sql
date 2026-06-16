-- Track when submission status last changed (pending-over-time sparklines)
-- Run in Supabase SQL editor

alter table public.contact_responses
  add column if not exists status_updated_at timestamptz;

alter table public.company_profiles
  add column if not exists status_updated_at timestamptz;

comment on column public.contact_responses.status_updated_at is
  'Timestamp of the last status change; used for historical pending-queue charts.';

comment on column public.company_profiles.status_updated_at is
  'Timestamp of the last status change; used for historical pending-queue charts.';
