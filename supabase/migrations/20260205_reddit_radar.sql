create table if not exists reddit_sources (
  id uuid primary key,
  name text not null unique,
  enabled boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists reddit_settings (
  id uuid primary key,
  starter_set_enabled boolean default true,
  include_keywords text[] default '{}',
  exclude_keywords text[] default '{}',
  question_signals text[] default '{}',
  language_filter_nl boolean default true,
  scan_interval_mins int default 60,
  max_posts_per_run int default 50,
  max_items_per_feed int default 25,
  polite_mode boolean default true,
  jitter_seconds int default 5,
  backoff_seconds int default 30,
  model text default 'gpt-4o-mini',
  max_output_tokens int default 600,
  summary_template text,
  strict_json boolean default true,
  email_digest boolean default false,
  notification_score_threshold int default 70,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists reddit_posts (
  id uuid primary key,
  reddit_unique_key text not null unique,
  subreddit text not null,
  title text not null,
  url text not null,
  created_at timestamptz not null,
  fetched_at timestamptz not null default now(),
  snippet text,
  full_text text,
  status text not null default 'new',
  seen_at timestamptz,
  answered_at timestamptz,
  score int default 0,
  language text
);

create table if not exists reddit_summaries (
  id uuid primary key,
  post_id uuid references reddit_posts(id) on delete cascade,
  summary text,
  real_question text,
  risks text[],
  bullets text[],
  followup text[],
  model text,
  tokens_in int,
  tokens_out int,
  prompt_guard text,
  created_at timestamptz default now()
);

create table if not exists reddit_runs (
  id uuid primary key,
  started_at timestamptz not null,
  finished_at timestamptz,
  status text,
  processed_count int default 0,
  errors jsonb,
  rate_limited boolean default false
);

create index if not exists reddit_posts_status_idx on reddit_posts(status);
create index if not exists reddit_posts_created_idx on reddit_posts(created_at desc);
create index if not exists reddit_summaries_post_idx on reddit_summaries(post_id, created_at desc);
