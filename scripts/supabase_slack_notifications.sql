-- Slack notifications (Block Kit buttons) for form submissions + admin changes
--
-- Prerequisites: pg_net + supabase_vault enabled
--
-- Vault secrets (SQL Editor) — run each name once.
-- If you get duplicate key on secrets_name_idx, the secret already exists: use
-- vault.update_secret (see comments below), not create_secret again.
--
--   select vault.create_secret(
--     'https://hooks.slack.com/services/REPLACE/WITH/YOUR/WEBHOOK',
--     'slack_webhook_url',
--     'Slack incoming webhook'
--   );
--
--   select vault.create_secret(
--     'https://www.relliahealth.com',
--     'rellia_admin_base_url',
--     'Site origin for admin links (no trailing slash)'
--   );
--
--   select vault.create_secret(
--     '/admin/submissions',
--     'rellia_admin_inbox_path',
--     'Admin inbox route path'
--   );
--
-- Update existing secret (replace YOUR_SECRET_UUID from vault.secrets):
--   select vault.update_secret(
--     'YOUR_SECRET_UUID'::uuid,
--     'https://hooks.slack.com/services/NEW/WEBHOOK',
--     'slack_webhook_url',
--     'Slack incoming webhook'
--   );
--
-- Sanity drafts: configure a Sanity webhook (see README / .env.example) — not Postgres.
--
-- Re-run this file after edits to replace trigger functions.

create extension if not exists pg_net with schema extensions;

-- ─── URL helpers ─────────────────────────────────────────────────────────────

create or replace function public.slack_vault_secret(secret_name text)
returns text
language sql
security definer
stable
set search_path = public
as $$
  select decrypted_secret
  from vault.decrypted_secrets
  where name = secret_name
  limit 1;
$$;

create or replace function public.slack_admin_inbox_url(tab text default 'contact')
returns text
language plpgsql
security definer
stable
set search_path = public
as $$
declare
  base_url text;
  inbox_path text;
begin
  base_url := public.slack_vault_secret('rellia_admin_base_url');
  inbox_path := coalesce(nullif(public.slack_vault_secret('rellia_admin_inbox_path'), ''), '/admin/submissions');

  if inbox_path !~ '^/' then
    inbox_path := '/' || inbox_path;
  end if;

  if base_url is null or base_url = '' then
    return inbox_path || '?tab=' || tab;
  end if;

  return rtrim(base_url, '/') || inbox_path || '?tab=' || tab;
end;
$$;

-- ─── Slack Block Kit payload ─────────────────────────────────────────────────

create or replace function public.slack_blocks_message(
  title_text text,
  subtitle_text text,
  body_text text,
  button_text text,
  button_url text,
  uuid text,
  color text default '#3498DB',
  button_action_id text default 'open_admin_link'
)
returns jsonb
language sql
immutable
as $$
  select jsonb_build_object(
    'attachments',
    jsonb_build_array(
      jsonb_build_object(
        'color', color,
        'blocks', jsonb_build_array(
          jsonb_build_object(
            'type', 'section',
            'text', jsonb_build_object(
              'type', 'mrkdwn',
              'text', '*' || title_text || '*' || E'\n' || '_' || subtitle_text || '_'
            )
          ),
          jsonb_build_object(
            'type', 'divider'
          ),
          jsonb_build_object(
            'type', 'section',
            'text', jsonb_build_object(
              'type', 'mrkdwn',
              'text', body_text
            )
          ),
          jsonb_build_object(
            'type', 'actions',
            'elements', jsonb_build_array(
              jsonb_build_object(
                'type', 'button',
                'text', jsonb_build_object('type', 'plain_text', 'text', button_text, 'emoji', true),
                'url', button_url,
                'style', 'primary',
                'action_id', button_action_id
              )
            )
          )
        )
      ),
      jsonb_build_object(
        'blocks', jsonb_build_array(
          jsonb_build_object(
            'type', 'context',
            'elements', jsonb_build_array(
              jsonb_build_object(
                'type', 'mrkdwn',
                'text', 'ID: ' || uuid
              )
            )
          )
        )
      )
    )
  );
$$;

create or replace function public.notify_slack(payload jsonb)
returns void
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  webhook_url text;
begin
  webhook_url := public.slack_vault_secret('slack_webhook_url');

  if webhook_url is null or webhook_url = '' then
    raise warning 'notify_slack: vault secret slack_webhook_url is missing';
    return;
  end if;

  perform net.http_post(
    url := webhook_url,
    headers := jsonb_build_object('Content-Type', 'application/json'),
    body := payload
  );
end;
$$;

revoke all on function public.notify_slack(jsonb) from public;
grant execute on function public.notify_slack(jsonb) to postgres, service_role;

-- ─── contact_responses ───────────────────────────────────────────────────────

create or replace function public.slack_notify_contact_responses()
returns trigger
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  submission_label text;
  tab text;
  inbox_url text;
  title_text text;
  subtitle_text text;
  body_text text;
  payload jsonb;
begin
  submission_label := coalesce(
    case NEW.submission_type
      when 'investor' then 'Investor Pitch'
      else 'Contact Form'
    end,
    case OLD.submission_type
      when 'investor' then 'Investor Pitch'
      else 'Contact Form'
    end,
    'Contact Form'
  );
  tab := 'contact';
  inbox_url := public.slack_admin_inbox_url(tab);

  if TG_OP = 'INSERT' then
    title_text := NEW.first_name || ' ' || NEW.last_name;
    subtitle_text := ':inbox_tray: Form Submission · ' || submission_label;
    body_text := '*Email:* ' || NEW.email || E'\n' ||
                 '*Company:* ' || coalesce(NEW.company, '—') || E'\n' ||
                 '*Status:* ' || coalesce(NEW.status, 'New');

    payload := public.slack_blocks_message(
      title_text,
      subtitle_text,
      body_text,
      'View on dashboard',
      inbox_url,
      NEW.id::text,
      '#2ECC71',
      'view_in_dashboard'
    );
  elsif TG_OP = 'UPDATE' then
    if OLD.status is not distinct from NEW.status then
      return NEW;
    end if;
    title_text := NEW.first_name || ' ' || NEW.last_name;
    subtitle_text := ':arrows_counterclockwise: Status Changed · ' || submission_label;
    body_text := '*Email:* ' || NEW.email || E'\n' ||
                 '*Status:* ' || OLD.status || ' → ' || NEW.status;

    payload := public.slack_blocks_message(
      title_text,
      subtitle_text,
      body_text,
      'View on dashboard',
      inbox_url,
      NEW.id::text,
      '#F39C12',
      'view_in_dashboard'
    );
  elsif TG_OP = 'DELETE' then
    title_text := OLD.first_name || ' ' || OLD.last_name;
    subtitle_text := ':wastebasket: Submission Deleted · ' || submission_label;
    body_text := '*Email:* ' || OLD.email || E'\n' ||
                 '*Last Status:* ' || coalesce(OLD.status, '—');

    payload := public.slack_blocks_message(
      title_text,
      subtitle_text,
      body_text,
      'View on dashboard',
      inbox_url,
      OLD.id::text,
      '#E74C3C',
      'view_in_dashboard'
    );
  end if;

  perform public.notify_slack(payload);

  if TG_OP = 'DELETE' then
    return OLD;
  end if;
  return NEW;
end;
$$;

drop trigger if exists tr_slack_contact_responses on public.contact_responses;
create trigger tr_slack_contact_responses
after insert or update or delete on public.contact_responses
for each row
execute function public.slack_notify_contact_responses();

-- ─── diagnostic_responses (completed survey) ─────────────────────────────────

create or replace function public.slack_notify_diagnostic_insert()
returns trigger
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  profile public.company_profiles%rowtype;
  inbox_url text;
  title_text text;
  subtitle_text text;
  body_text text;
  payload jsonb;
begin
  select * into profile
  from public.company_profiles
  where id = NEW.company_profile_id;

  inbox_url := public.slack_admin_inbox_url('diagnostic');
  
  title_text := coalesce(profile.name, '—');
  subtitle_text := ':chart_with_upwards_trend: Diagnostic Report';
  body_text := '*Company:* ' || coalesce(profile.company_name, '—') || E'\n' ||
               '*Email:* ' || coalesce(profile.work_email, '—') || E'\n' ||
               '*Stage:* ' || coalesce(profile.stage, '—') || E'\n' ||
               '*Status:* ' || coalesce(profile.status, 'New');

  payload := public.slack_blocks_message(
    title_text,
    subtitle_text,
    body_text,
    'View on dashboard',
    inbox_url,
    profile.id::text,
    '#2ECC71',
    'view_in_dashboard'
  );

  perform public.notify_slack(payload);
  return NEW;
end;
$$;

drop trigger if exists tr_slack_diagnostic_insert on public.diagnostic_responses;
create trigger tr_slack_diagnostic_insert
after insert on public.diagnostic_responses
for each row
execute function public.slack_notify_diagnostic_insert();

-- ─── company_profiles (status + delete) ──────────────────────────────────────

create or replace function public.slack_notify_company_profiles()
returns trigger
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  inbox_url text;
  title_text text;
  subtitle_text text;
  body_text text;
  payload jsonb;
begin
  inbox_url := public.slack_admin_inbox_url('diagnostic');

  if TG_OP = 'UPDATE' then
    if OLD.status is not distinct from NEW.status then
      return NEW;
    end if;
    title_text := coalesce(NEW.name, '—');
    subtitle_text := ':arrows_counterclockwise: Status Changed · Diagnostic Lead';
    body_text := '*Company:* ' || coalesce(NEW.company_name, '—') || E'\n' ||
                 '*Email:* ' || coalesce(NEW.work_email, '—') || E'\n' ||
                 '*Status:* ' || OLD.status || ' → ' || NEW.status;

    payload := public.slack_blocks_message(
      title_text,
      subtitle_text,
      body_text,
      'View on dashboard',
      inbox_url,
      NEW.id::text,
      '#F39C12',
      'view_in_dashboard'
    );
  elsif TG_OP = 'DELETE' then
    title_text := coalesce(OLD.name, '—');
    subtitle_text := ':wastebasket: Lead Deleted · Diagnostic Lead';
    body_text := '*Company:* ' || coalesce(OLD.company_name, '—') || E'\n' ||
                 '*Email:* ' || coalesce(OLD.work_email, '—') || E'\n' ||
                 '*Last Status:* ' || coalesce(OLD.status, '—');

    payload := public.slack_blocks_message(
      title_text,
      subtitle_text,
      body_text,
      'View on dashboard',
      inbox_url,
      OLD.id::text,
      '#E74C3C',
      'view_in_dashboard'
    );
  else
    return NEW;
  end if;

  perform public.notify_slack(payload);

  if TG_OP = 'DELETE' then
    return OLD;
  end if;
  return NEW;
end;
$$;

drop trigger if exists tr_slack_company_profiles on public.company_profiles;
create trigger tr_slack_company_profiles
after update or delete on public.company_profiles
for each row
execute function public.slack_notify_company_profiles();

-- ─── Tests ───────────────────────────────────────────────────────────────────
-- select public.notify_slack(public.slack_blocks_message(
--   'John Doe', 'Form Submission · Contact Form', '*Email:* john@example.com',
--   'View on dashboard', public.slack_admin_inbox_url('contact'),
--   '00000000-0000-0000-0000-000000000000', '#2ECC71', 'view_in_dashboard'
-- ));
--
-- select id, status_code, error_msg from net._http_response order by created desc limit 5;
