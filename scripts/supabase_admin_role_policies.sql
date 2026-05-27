-- OPTIONAL: Restrict admin tables to users with JWT app_metadata.role = 'admin'.
-- Run in Supabase SQL Editor after supabase_setup.sql, supabase_diagnostic_setup.sql, and supabase_admin_policies.sql.
-- To undo, run scripts/supabase_revert_admin_role_policies.sql
--
-- Existing admin users: set role in Dashboard → Authentication → Users → user → App metadata:
--   { "role": "admin" }
-- New users created via /api/admin/signup receive this role automatically when using the updated server.

create or replace function public.is_rellia_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin',
    false
  );
$$;

revoke all on function public.is_rellia_admin() from public;
grant execute on function public.is_rellia_admin() to authenticated;

-- contact_responses
drop policy if exists "Allow auth select" on public.contact_responses;
create policy "Allow admin select"
on public.contact_responses
for select
to authenticated
using (public.is_rellia_admin());

drop policy if exists "Allow auth update" on public.contact_responses;
create policy "Allow admin update"
on public.contact_responses
for update
to authenticated
using (public.is_rellia_admin())
with check (public.is_rellia_admin());

drop policy if exists "Allow auth delete" on public.contact_responses;
create policy "Allow admin delete"
on public.contact_responses
for delete
to authenticated
using (public.is_rellia_admin());

-- company_profiles
drop policy if exists "Allow auth select" on public.company_profiles;
create policy "Allow admin select"
on public.company_profiles
for select
to authenticated
using (public.is_rellia_admin());

drop policy if exists "Allow auth update" on public.company_profiles;
create policy "Allow admin update"
on public.company_profiles
for update
to authenticated
using (public.is_rellia_admin())
with check (public.is_rellia_admin());

drop policy if exists "Allow auth delete" on public.company_profiles;
create policy "Allow admin delete"
on public.company_profiles
for delete
to authenticated
using (public.is_rellia_admin());

-- diagnostic_responses
drop policy if exists "Allow auth select" on public.diagnostic_responses;
create policy "Allow admin select"
on public.diagnostic_responses
for select
to authenticated
using (public.is_rellia_admin());
