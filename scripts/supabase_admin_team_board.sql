-- Team bulletin board on /admin/team (one shared note + emoji reactions).
-- Run in Supabase SQL Editor. Access is server-only via service role.

create table if not exists public.admin_team_board (
  id text primary key default 'default' check (id = 'default'),
  blocks jsonb not null default '[]'::jsonb,
  published_by_id uuid,
  published_by_name text,
  published_at timestamptz,
  updated_at timestamptz not null default now()
);

create table if not exists public.admin_team_note_reactions (
  id uuid primary key default gen_random_uuid(),
  board_id text not null default 'default' references public.admin_team_board (id) on delete cascade,
  user_id uuid not null,
  user_name text,
  emoji text not null,
  created_at timestamptz not null default now(),
  unique (board_id, user_id, emoji)
);

insert into public.admin_team_board (id)
values ('default')
on conflict (id) do nothing;

alter table public.admin_team_board enable row level security;
alter table public.admin_team_note_reactions enable row level security;

comment on table public.admin_team_board is 'Singleton team bulletin note for admin dashboard.';
comment on table public.admin_team_note_reactions is 'Emoji reactions on the admin team bulletin note.';
