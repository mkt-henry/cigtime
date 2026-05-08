create table if not exists rooms (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text,
  placeholder text,
  is_silent boolean default false,
  sort_order integer default 0,
  is_active boolean default true,
  created_at timestamptz default now()
);

create table if not exists ritual_objects (
  id uuid primary key default gen_random_uuid(),
  key text unique not null,
  name text not null,
  category text not null,
  animation_type text not null,
  default_duration_sec integer default 180,
  is_active boolean default true,
  created_at timestamptz default now()
);

create table if not exists sessions (
  id uuid primary key default gen_random_uuid(),
  anonymous_user_id text not null,
  nickname text not null,
  room_id uuid references rooms(id),
  object_id uuid references ritual_objects(id),
  started_at timestamptz default now(),
  ends_at timestamptz,
  duration_sec integer default 180,
  status text default 'active'
);

create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  room_id uuid references rooms(id),
  session_id uuid references sessions(id),
  anonymous_user_id text not null,
  nickname text not null,
  body text not null,
  is_deleted boolean default false,
  is_reported_hidden boolean default false,
  created_at timestamptz default now()
);

create table if not exists reactions (
  id uuid primary key default gen_random_uuid(),
  message_id uuid references messages(id) on delete cascade,
  anonymous_user_id text not null,
  reaction_type text not null,
  created_at timestamptz default now(),
  unique(message_id, anonymous_user_id)
);

create table if not exists reports (
  id uuid primary key default gen_random_uuid(),
  message_id uuid references messages(id),
  reporter_anonymous_user_id text not null,
  reported_anonymous_user_id text,
  reason text not null,
  status text default 'pending',
  created_at timestamptz default now()
);
