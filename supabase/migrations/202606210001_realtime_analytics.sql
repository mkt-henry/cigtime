create table if not exists analytics_events (
  id bigint generated always as identity primary key,
  anonymous_user_id text not null,
  event_name text not null check (event_name in (
    'landing_view', 'rooms_view', 'room_entered', 'session_started',
    'first_message_sent', 'message_sent', 'reaction_sent',
    'reaction_received', 'session_completed', 'session_restarted'
  )),
  room_slug text,
  session_id uuid references sessions(id) on delete set null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists sessions_anonymous_started_idx on sessions (anonymous_user_id, started_at desc);
create index if not exists sessions_room_status_started_idx on sessions (room_id, status, started_at desc);
create index if not exists messages_room_created_idx on messages (room_id, created_at desc)
  where is_deleted = false and is_reported_hidden = false;
create index if not exists reactions_message_created_idx on reactions (message_id, created_at desc);
create index if not exists reports_message_status_idx on reports (message_id, status);
create index if not exists analytics_events_user_created_idx on analytics_events (anonymous_user_id, created_at desc);
create index if not exists analytics_events_name_created_idx on analytics_events (event_name, created_at desc);

alter table messages enable row level security;
alter table reactions enable row level security;
alter table sessions enable row level security;
alter table reports enable row level security;
alter table analytics_events enable row level security;

drop policy if exists "public can read visible messages" on messages;
create policy "public can read visible messages" on messages for select
  using (is_deleted = false and is_reported_hidden = false);
drop policy if exists "public can read reactions" on reactions;
create policy "public can read reactions" on reactions for select using (true);

do $$
begin
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'messages') then
    alter publication supabase_realtime add table messages;
  end if;
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'reactions') then
    alter publication supabase_realtime add table reactions;
  end if;
end $$;

create or replace function purge_expired_messages(retention_hours integer default 24)
returns integer language plpgsql security definer set search_path = public as $$
declare deleted_count integer;
begin
  delete from messages where created_at < now() - make_interval(hours => greatest(retention_hours, 1));
  get diagnostics deleted_count = row_count;
  return deleted_count;
end;
$$;

create or replace function get_daily_active_users(days_back integer default 7)
returns table(day date, dau bigint) language sql security definer set search_path = public as $$
  select (created_at at time zone 'Asia/Seoul')::date as day,
    count(distinct anonymous_user_id)::bigint as dau
  from analytics_events
  where created_at >= now() - make_interval(days => greatest(least(days_back, 30), 1))
    and event_name not in ('landing_view', 'rooms_view')
  group by 1 order by 1;
$$;

revoke execute on function purge_expired_messages(integer) from public, anon, authenticated;
revoke execute on function get_daily_active_users(integer) from public, anon, authenticated;
grant execute on function purge_expired_messages(integer) to service_role;
grant execute on function get_daily_active_users(integer) to service_role;
