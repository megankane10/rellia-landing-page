-- Admin workflow: status updates and deletes for contact + diagnostic submissions
-- Run in Supabase SQL Editor after supabase_setup.sql and supabase_diagnostic_setup.sql
-- Then run supabase_admin_role_policies.sql so only JWT app_metadata.role = 'admin' can read/update/delete.

-- Contact status (if not already applied)
alter table public.contact_responses
  add column if not exists status text not null default 'New';

alter table public.contact_responses
  drop constraint if exists contact_responses_status_check;

alter table public.contact_responses
  add constraint contact_responses_status_check
  check (status in ('New', 'In Progress', 'Resolved'));

-- Diagnostic lead status
alter table public.company_profiles
  add column if not exists status text not null default 'New';

alter table public.company_profiles
  drop constraint if exists company_profiles_status_check;

alter table public.company_profiles
  add constraint company_profiles_status_check
  check (status in ('New', 'In Progress', 'Resolved'));

-- contact_responses: authenticated update + delete
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

-- company_profiles: authenticated update + delete
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
