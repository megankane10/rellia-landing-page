-- Priority modal form submissions (stored in contact_responses inbox)
-- Run in Supabase SQL Editor after scripts/supabase_setup.sql and supabase_investor_submissions.sql
--
-- Fixes: "Could not save your submission" when priority modal form posts submission_type = 'modal'

alter table public.contact_responses
  add column if not exists submission_type text not null default 'contact';

alter table public.contact_responses
  drop constraint if exists contact_responses_submission_type_check;

alter table public.contact_responses
  add constraint contact_responses_submission_type_check
  check (submission_type in ('contact', 'investor', 'modal'));

create index if not exists contact_responses_submission_type_idx
  on public.contact_responses (submission_type, created_at desc);

comment on column public.contact_responses.submission_type is
  'contact = /contact form; investor = pitch event notification; modal = priority announcement modal';
