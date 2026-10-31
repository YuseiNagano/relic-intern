-- ALLSTAND: Supabase スキーマ案（繋ぎ込み時の叩き台）
-- 型は src/types/index.ts と対応しています。

-- プロフィール（auth.users と 1:1）
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null,
  avatar_url text,
  avatar_color text not null default '#7c5cff',
  penlight_color text not null default '#ff3d9a',
  bio text,
  created_at timestamptz not null default now()
);

-- ライブイベント
create table public.events (
  id text primary key,
  title text not null,
  artist_name text not null,
  description text not null default '',
  genre text not null default '',
  start_at timestamptz not null,
  end_at timestamptz not null,
  status text not null check (status in ('upcoming', 'live', 'ended')),
  thumbnail_url text,
  theme_gradient text not null default 'from-fuchsia-600 via-violet-700 to-indigo-900',
  theme_colors text[] not null default '{}',
  price integer not null default 0,
  viewer_count integer not null default 0,
  tags text[] not null default '{}',
  setlist text[] not null default '{}',
  created_at timestamptz not null default now()
);

-- 参加登録（チケット）
create table public.tickets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  event_id text not null references public.events (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, event_id)
);

-- コメント（Realtime で配信）
create table public.comments (
  id uuid primary key default gen_random_uuid(),
  event_id text not null references public.events (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  body text not null check (char_length(body) between 1 and 60),
  created_at timestamptz not null default now()
);

-- リアクション集計
-- 個々のリアクションは Realtime Broadcast で流し、数秒ごとに集計値のみ保存する
create table public.reaction_stats (
  id bigint generated always as identity primary key,
  event_id text not null references public.events (id) on delete cascade,
  bucket_at timestamptz not null,           -- 集計時刻（例: 5秒単位）
  heat smallint not null,                   -- 0〜100 の熱量
  counts jsonb not null default '{}'::jsonb -- { "cheer": 120, "clap": 80, ... }
);
create index on public.reaction_stats (event_id, bucket_at);

-- 体験設定（デバイス間同期）
create table public.user_settings (
  user_id uuid primary key references public.profiles (id) on delete cascade,
  settings jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- RLS
alter table public.profiles enable row level security;
alter table public.events enable row level security;
alter table public.tickets enable row level security;
alter table public.comments enable row level security;
alter table public.reaction_stats enable row level security;
alter table public.user_settings enable row level security;

create policy "profiles are viewable by everyone" on public.profiles for select using (true);
create policy "users insert own profile" on public.profiles for insert with check (auth.uid() = id);
create policy "users update own profile" on public.profiles for update using (auth.uid() = id);

create policy "events are viewable by everyone" on public.events for select using (true);

create policy "users view own tickets" on public.tickets for select using (auth.uid() = user_id);
create policy "users create own tickets" on public.tickets for insert with check (auth.uid() = user_id);

create policy "comments are viewable by everyone" on public.comments for select using (true);
create policy "ticket holders post comments" on public.comments for insert
  with check (
    auth.uid() = user_id
    and exists (
      select 1 from public.tickets t
      where t.user_id = auth.uid() and t.event_id = comments.event_id
    )
  );

create policy "reaction stats are viewable by everyone" on public.reaction_stats for select using (true);

create policy "users manage own settings" on public.user_settings for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- コメントの Realtime 配信を有効化
alter publication supabase_realtime add table public.comments;
