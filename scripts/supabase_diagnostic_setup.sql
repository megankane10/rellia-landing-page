-- Supabase schema for diagnostic survey submissions
-- Run this once in your Supabase SQL Editor

-- ─── company_profiles ────────────────────────────────────────────────────────

create table if not exists public.company_profiles (
  id          uuid        default gen_random_uuid() primary key,
  created_at  timestamptz default now(),
  name        text        not null,
  work_email  text        not null,
  company_name text       not null,
  stage       text,
  description text
);

alter table public.company_profiles enable row level security;

drop policy if exists "Allow public insert" on public.company_profiles;
create policy "Allow public insert"
on public.company_profiles
for insert
to anon, authenticated
with check (true);

drop policy if exists "Allow auth select" on public.company_profiles;
create policy "Allow auth select"
on public.company_profiles
for select
to authenticated
using (true);

-- Rate limit: max 5 submissions per email per hour
create or replace function public.check_diagnostic_rate_limit()
returns trigger as $$
begin
  if (
    select count(*)
    from public.company_profiles
    where work_email = new.work_email
      and created_at > now() - interval '1 hour'
  ) >= 5 then
    raise exception 'Too many diagnostic submissions for this email. Please try again in an hour.';
  end if;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists tr_check_diagnostic_rate_limit on public.company_profiles;
create trigger tr_check_diagnostic_rate_limit
before insert on public.company_profiles
for each row
execute function public.check_diagnostic_rate_limit();

-- ─── diagnostic_responses ────────────────────────────────────────────────────

create table if not exists public.diagnostic_responses (
  id                 uuid        default gen_random_uuid() primary key,
  created_at         timestamptz default now(),
  company_profile_id uuid        not null references public.company_profiles(id) on delete cascade,
  section_scores     jsonb,      -- [{category: string, score: number}]
  raw_answers        jsonb,      -- {[sectionId]: {[qIdx]: score}}
  summary            text,
  top3_strengths     jsonb,      -- [{category, score, note}]
  top3_weaknesses    jsonb,      -- [{category, score, note, priority}]
  recommendations    jsonb,      -- [string]
  mentor_areas_needed jsonb      -- [string]
);

alter table public.diagnostic_responses enable row level security;

drop policy if exists "Allow public insert" on public.diagnostic_responses;
create policy "Allow public insert"
on public.diagnostic_responses
for insert
to anon, authenticated
with check (true);

drop policy if exists "Allow auth select" on public.diagnostic_responses;
create policy "Allow auth select"
on public.diagnostic_responses
for select
to authenticated
using (true);
