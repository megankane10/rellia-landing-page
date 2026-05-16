-- Supabase Security and Rate Limiting for contact_responses
-- Run this in your Supabase SQL Editor

-- 1. Create the table if it doesn't exist
create table if not exists public.contact_responses (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  first_name text not null,
  last_name text not null,
  email text not null,
  company text,
  job_title text,
  message text not null
);

-- 2. Enable Row Level Security
alter table public.contact_responses enable row level security;

-- 3. Create a policy to allow anyone to insert (public form)
drop policy if exists "Allow public insert" on public.contact_responses;
create policy "Allow public insert"
on public.contact_responses
for insert
to anon
with check (true);

-- 4. Restrict SELECT/UPDATE/DELETE to authenticated users only (internal team)
drop policy if exists "Allow auth select" on public.contact_responses;
create policy "Allow auth select"
on public.contact_responses
for select
to authenticated
using (true);

-- 5. Rate Limiting Logic (IP-based)
-- We'll use a simple approach: check how many records with the same email 
-- were created in the last hour. While email isn't IP, it's a good proxy for form spam.
-- A more robust IP-based check requires a custom Postgres function that Supabase
-- can use to read the requester's IP.

create or replace function public.check_contact_rate_limit()
returns trigger as $$
begin
  if (
    select count(*)
    from public.contact_responses
    where email = new.email
      and created_at > now() - interval '1 hour'
  ) > 5 then
    raise exception 'Too many submissions for this email. Please try again in an hour.';
  end if;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists tr_check_contact_rate_limit on public.contact_responses;
create trigger tr_check_contact_rate_limit
before insert on public.contact_responses
for each row
execute function public.check_contact_rate_limit();
