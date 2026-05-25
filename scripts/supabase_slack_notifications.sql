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
  heading text,
  body_lines text[],
  button_text text,
  button_url text,
  button_action_id text default 'open_admin_link'
)
returns jsonb
language sql
immutable
as $$
  select jsonb_build_object(
    'blocks',
    jsonb_build_array(
      jsonb_build_object(
        'type', 'section',
        'text', jsonb_build_object(
          'type', 'mrkdwn',
          'text', heading || E'\n' || coalesce(array_to_string(body_lines, E'\n'), '')
        )
      ),
      jsonb_build_object(
        'type', 'actions',
        'elements', jsonb_build_array(
          jsonb_build_object(
            'type', 'button',
            'text', jsonb_build_object('type', 'plain_text', 'text', button_text, 'emoji', true),
            'url', button_url,
            'action_id', button_action_id
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
  body_lines text[];
  payload jsonb;
begin
  submission_label := coalesce(
    case NEW.submission_type
      when 'investor' then 'Investor pitch notification'
      else 'Contact form'
    end,
    case OLD.submission_type
      when 'investor' then 'Investor pitch notification'
      else 'Contact form'
    end,
    'Contact form'
  );
  tab := 'contact';
  inbox_url := public.slack_admin_inbox_url(tab);

  if TG_OP = 'INSERT' then
    body_lines := array[
      '• Name: ' || NEW.first_name || ' ' || NEW.last_name,
      '• Email: ' || NEW.email,
      '• Company: ' || coalesce(NEW.company, '—'),
      '• Status: ' || coalesce(NEW.status, 'New'),
      '• ID: `' || NEW.id::text || '`'
    ];
    payload := public.slack_blocks_message(
      ':inbox_tray: *New ' || submission_label || ' submission*',
      body_lines,
      'View in dashboard',
      inbox_url,
      'view_in_dashboard'
    );
  elsif TG_OP = 'UPDATE' then
    if OLD.status is not distinct from NEW.status then
      return NEW;
    end if;
    body_lines := array[
      '• ' || NEW.first_name || ' ' || NEW.last_name || ' (' || NEW.email || ')',
      '• Status: ' || OLD.status || ' → ' || NEW.status,
      '• ID: `' || NEW.id::text || '`'
    ];
    payload := public.slack_blocks_message(
      ':arrows_counterclockwise: *' || submission_label || ' status updated*',
      body_lines,
      'View in dashboard',
      inbox_url,
      'view_in_dashboard'
    );
  elsif TG_OP = 'DELETE' then
    body_lines := array[
      '• ' || OLD.first_name || ' ' || OLD.last_name || ' (' || OLD.email || ')',
      '• Last status: ' || coalesce(OLD.status, '—'),
      '• ID: `' || OLD.id::text || '`'
    ];
    payload := public.slack_blocks_message(
      ':wastebasket: *' || submission_label || ' deleted*',
      body_lines,
      'View in dashboard',
      inbox_url,
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
  body_lines text[];
  payload jsonb;
begin
  select * into profile
  from public.company_profiles
  where id = NEW.company_profile_id;

  inbox_url := public.slack_admin_inbox_url('diagnostic');
  body_lines := array[
    '• Company: ' || coalesce(profile.company_name, '—'),
    '• Contact: ' || coalesce(profile.name, '—') || ' (' || coalesce(profile.work_email, '—') || ')',
    '• Stage: ' || coalesce(profile.stage, '—'),
    '• Status: ' || coalesce(profile.status, 'New'),
    '• Profile ID: `' || profile.id::text || '`'
  ];

  payload := public.slack_blocks_message(
    ':chart_with_upwards_trend: *New diagnostic submission*',
    body_lines,
    'View in dashboard',
    inbox_url,
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
  body_lines text[];
  payload jsonb;
begin
  inbox_url := public.slack_admin_inbox_url('diagnostic');

  if TG_OP = 'UPDATE' then
    if OLD.status is not distinct from NEW.status then
      return NEW;
    end if;
    body_lines := array[
      '• ' || coalesce(NEW.name, '—') || ' @ ' || coalesce(NEW.company_name, '—') || ' (' || coalesce(NEW.work_email, '—') || ')',
      '• Status: ' || OLD.status || ' → ' || NEW.status,
      '• Profile ID: `' || NEW.id::text || '`'
    ];
    payload := public.slack_blocks_message(
      ':arrows_counterclockwise: *Diagnostic lead status updated*',
      body_lines,
      'View in dashboard',
      inbox_url,
      'view_in_dashboard'
    );
  elsif TG_OP = 'DELETE' then
    body_lines := array[
      '• ' || coalesce(OLD.name, '—') || ' @ ' || coalesce(OLD.company_name, '—') || ' (' || coalesce(OLD.work_email, '—') || ')',
      '• Last status: ' || coalesce(OLD.status, '—'),
      '• Profile ID: `' || OLD.id::text || '`'
    ];
    payload := public.slack_blocks_message(
      ':wastebasket: *Diagnostic lead deleted*',
      body_lines,
      'View in dashboard',
      inbox_url,
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
--   '*Slack test*', array['• hello'], 'View in dashboard',
--   public.slack_admin_inbox_url('contact'), 'view_in_dashboard'
-- ));
--
-- select id, status_code, error_msg from net._http_response order by created desc limit 5;
