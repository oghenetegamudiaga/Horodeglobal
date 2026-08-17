-- Horode Design Studio Database Schema (v2)
-- Supabase Postgres SQL

-- 1. Posts Table (Blog)
create table if not exists public.posts (
  id            uuid primary key default gen_random_uuid(),
  slug          text not null unique,
  title         text not null,
  excerpt       text,
  category      text,
  content       text,
  published     boolean default false,
  read_time     text,
  published_at  timestamptz,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

alter table public.posts enable row level security;

drop policy if exists "Public reads published posts" on public.posts;
create policy "Public reads published posts" on public.posts
  for select using (published = true);

create index if not exists posts_slug_idx on public.posts (slug);


-- 2. Services Table
create table if not exists public.services (
  id                  uuid primary key default gen_random_uuid(),
  slug                text not null unique,
  name                text not null,
  one_liner           text,
  icon                text,
  image_url           text,
  deliverables        jsonb default '[]',
  process_steps       jsonb default '[]',
  related_project_ids uuid[] default '{}',
  sort_order          int default 0,
  created_at          timestamptz default now(),
  updated_at          timestamptz default now()
);

alter table public.services enable row level security;

drop policy if exists "Public reads services" on public.services;
create policy "Public reads services" on public.services
  for select using (true);

create index if not exists services_slug_idx on public.services (slug);


-- 3. Projects Table (Works)
create table if not exists public.projects (
  id               uuid primary key default gen_random_uuid(),
  slug             text not null unique,
  name             text not null,
  client_name      text,
  thumbnail_url    text,
  gallery_urls     text[] default '{}',
  service_tags     text[] default '{}',
  one_liner        text,
  brief            text,
  process_content  jsonb,
  outcome_content  jsonb,
  year             text,
  featured         boolean default false,
  sort_order       int default 0,
  created_at       timestamptz default now(),
  updated_at       timestamptz default now()
);

alter table public.projects enable row level security;

drop policy if exists "Public reads projects" on public.projects;
create policy "Public reads projects" on public.projects
  for select using (true);

create index if not exists projects_slug_idx on public.projects (slug);
