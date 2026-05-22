-- Add lead status workflow to contact_responses (run in Supabase SQL editor)
alter table public.contact_responses
  add column if not exists status text not null default 'New';

alter table public.contact_responses
  drop constraint if exists contact_responses_status_check;

alter table public.contact_responses
  add constraint contact_responses_status_check
  check (status in ('New', 'In Progress', 'Resolved'));
