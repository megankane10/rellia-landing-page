-- Admin profile photo uploads (Supabase Storage)
-- Run once in Supabase SQL Editor.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'admin-avatars',
  'admin-avatars',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Admin avatars public read" on storage.objects;
create policy "Admin avatars public read"
on storage.objects for select
to public
using (bucket_id = 'admin-avatars');

drop policy if exists "Admin users upload own avatar" on storage.objects;
create policy "Admin users upload own avatar"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'admin-avatars'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "Admin users update own avatar" on storage.objects;
create policy "Admin users update own avatar"
on storage.objects for update
to authenticated
using (
  bucket_id = 'admin-avatars'
  and (storage.foldername(name))[1] = auth.uid()::text
)
with check (
  bucket_id = 'admin-avatars'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "Admin users delete own avatar" on storage.objects;
create policy "Admin users delete own avatar"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'admin-avatars'
  and (storage.foldername(name))[1] = auth.uid()::text
);
