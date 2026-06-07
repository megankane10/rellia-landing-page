-- Admin notes on form submissions (contact + diagnostic inbox)
-- Run in Supabase SQL Editor after supabase_admin_policies.sql
-- Then re-run scripts/supabase_slack_notifications.sql for note Slack alerts

alter table public.contact_responses
  add column if not exists admin_note text;

alter table public.company_profiles
  add column if not exists admin_note text;

comment on column public.contact_responses.admin_note is
  'Internal admin note for this web form submission (not shown to submitter)';

comment on column public.company_profiles.admin_note is
  'Internal admin note for this diagnostic lead (not shown to submitter)';
