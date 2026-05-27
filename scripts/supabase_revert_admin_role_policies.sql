-- Revert scripts/supabase_admin_role_policies.sql
-- Restores: any signed-in Supabase user can read/update/delete admin tables.
-- Anonymous (public) users can still only INSERT via contact/diagnostic forms — not SELECT.
--
-- Run this entire file in the Supabase SQL Editor.

-- 1) Drop policies that depend on is_rellia_admin() FIRST
drop policy if exists "Allow admin select" on public.contact_responses;
drop policy if exists "Allow admin update" on public.contact_responses;
drop policy if exists "Allow admin delete" on public.contact_responses;

drop policy if exists "Allow admin select" on public.company_profiles;
drop policy if exists "Allow admin update" on public.company_profiles;
drop policy if exists "Allow admin delete" on public.company_profiles;

drop policy if exists "Allow admin select" on public.diagnostic_responses;

-- 2) Drop the helper function (no dependents left)
drop function if exists public.is_rellia_admin();

-- 3) Recreate permissive authenticated policies (dashboard users)
drop policy if exists "Allow auth select" on public.contact_responses;
create policy "Allow auth select"
on public.contact_responses
for select
to authenticated
using (true);

drop policy if exists "Allow auth update" on public.contact_responses;
create policy "Allow auth update"
on public.contact_responses
for update
to authenticated
using (true)
with check (true);

drop policy if exists "Allow auth delete" on public.contact_responses;
create policy "Allow auth delete"
on public.contact_responses
for delete
to authenticated
using (true);

drop policy if exists "Allow auth select" on public.company_profiles;
create policy "Allow auth select"
on public.company_profiles
for select
to authenticated
using (true);

drop policy if exists "Allow auth update" on public.company_profiles;
create policy "Allow auth update"
on public.company_profiles
for update
to authenticated
using (true)
with check (true);

drop policy if exists "Allow auth delete" on public.company_profiles;
create policy "Allow auth delete"
on public.company_profiles
for delete
to authenticated
using (true);

drop policy if exists "Allow auth select" on public.diagnostic_responses;
create policy "Allow auth select"
on public.diagnostic_responses
for select
to authenticated
using (true);
