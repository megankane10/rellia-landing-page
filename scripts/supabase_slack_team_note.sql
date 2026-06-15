-- Slack notifications when someone publishes a team quick note on /admin/team.
--
-- Prerequisites:
--   1. scripts/supabase_admin_team_board.sql (admin_team_board table)
--   2. scripts/supabase_slack_notifications.sql (notify_slack, slack_blocks_message, Vault secrets)
--
-- Uses the same incoming webhook as form submissions (#website-inbox).
-- Re-run this file after edits to replace trigger functions.

-- ─── Admin team page URL ─────────────────────────────────────────────────────

create or replace function public.slack_admin_team_url()
returns text
language plpgsql
security definer
stable
set search_path = public
as $$
declare
  base_url text;
begin
  base_url := public.slack_vault_secret('rellia_admin_base_url');

  if base_url is null or base_url = '' then
    return '/admin/team';
  end if;

  return rtrim(base_url, '/') || '/admin/team';
end;
$$;

-- ─── Format note blocks (text, stickers, image URLs) ─────────────────────────

create or replace function public.slack_format_team_note_blocks(blocks jsonb)
returns text
language plpgsql
immutable
as $$
declare
  block jsonb;
  block_type text;
  result text := '';
begin
  if blocks is null or jsonb_typeof(blocks) <> 'array' or jsonb_array_length(blocks) = 0 then
    return '_Empty note_';
  end if;

  for block in select value from jsonb_array_elements(blocks) as t(value)
  loop
    block_type := block->>'type';

    if block_type = 'text' then
      if coalesce(nullif(trim(block->>'text'), ''), '') <> '' then
        result := result || trim(block->>'text') || E'\n';
      end if;
    elsif block_type = 'sticker' then
      result := result || coalesce(block->>'emoji', '') || ' ';
    elsif block_type = 'image' then
      result := result || E'\n' || coalesce(nullif(trim(block->>'url'), ''), '(image)') || E'\n';
    end if;
  end loop;

  return coalesce(nullif(trim(result), ''), '_Empty note_');
end;
$$;

create or replace function public.slack_team_note_has_content(blocks jsonb)
returns boolean
language plpgsql
immutable
as $$
declare
  block jsonb;
  block_type text;
begin
  if blocks is null or jsonb_typeof(blocks) <> 'array' or jsonb_array_length(blocks) = 0 then
    return false;
  end if;

  for block in select value from jsonb_array_elements(blocks) as t(value)
  loop
    block_type := block->>'type';

    if block_type = 'text' and coalesce(nullif(trim(block->>'text'), ''), '') <> '' then
      return true;
    end if;

    if block_type = 'sticker' and coalesce(nullif(trim(block->>'emoji'), ''), '') <> '' then
      return true;
    end if;

    if block_type = 'image' and coalesce(nullif(trim(block->>'url'), ''), '') <> '' then
      return true;
    end if;
  end loop;

  return false;
end;
$$;

-- ─── Trigger: admin_team_board publish / update ──────────────────────────────

create or replace function public.slack_notify_admin_team_board()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  payload jsonb;
  body_text text;
  subtitle text;
begin
  if not public.slack_team_note_has_content(NEW.blocks) then
    return NEW;
  end if;

  if TG_OP = 'UPDATE' and NEW.blocks is not distinct from OLD.blocks then
    return NEW;
  end if;

  body_text := public.slack_format_team_note_blocks(NEW.blocks);
  body_text := public.slack_append_field(body_text, 'Posted by', coalesce(nullif(trim(NEW.published_by_name), ''), 'Team member'));

  if NEW.published_at is not null then
    body_text := public.slack_append_field(
      body_text,
      'Published',
      to_char(NEW.published_at at time zone 'UTC', 'Mon DD, YYYY · HH12:MI AM') || ' UTC'
    );
  end if;

  subtitle := 'Admin dashboard · *Quick notes to the team*';

  payload := public.slack_blocks_message(
    '📣 Team quick note',
    subtitle,
    body_text,
    'Open team page',
    public.slack_admin_team_url(),
    coalesce(NEW.id, 'default'),
    public.slack_event_color('note'),
    'open_admin_team_note'
  );

  perform public.notify_slack(payload);
  return NEW;
end;
$$;

drop trigger if exists tr_slack_admin_team_board on public.admin_team_board;
create trigger tr_slack_admin_team_board
after insert or update of blocks, published_by_name, published_at on public.admin_team_board
for each row
execute function public.slack_notify_admin_team_board();

-- Smoke test (optional — posts to Slack if webhook is configured):
-- update public.admin_team_board
-- set blocks = jsonb_build_array(jsonb_build_object('type', 'text', 'text', 'Slack team-note test')),
--     published_by_name = 'SQL test',
--     published_at = now(),
--     updated_at = now()
-- where id = 'default';
