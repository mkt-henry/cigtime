-- Optional sign-in: each anonymous browser identity that signs in is attached to
-- the Supabase Auth user, so the account keeps that browser's history.
create table if not exists account_links (
  anonymous_user_id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  linked_at timestamptz not null default now()
);

create index if not exists account_links_user_linked_idx on account_links (user_id, linked_at);

-- Server-only: route handlers use the service role, so no policies are granted.
alter table account_links enable row level security;
