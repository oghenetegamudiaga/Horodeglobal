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
  cover_image_url text,
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
  icon_type           text default 'lucide',
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


-- 4. Site Content Table (Key-Value Content Store)
create table if not exists public.site_content (
  id            uuid primary key default gen_random_uuid(),
  key           text not null unique,
  value         jsonb,
  updated_at    timestamptz default now()
);

alter table public.site_content enable row level security;

drop policy if exists "Public reads site_content" on public.site_content;
create policy "Public reads site_content" on public.site_content
  for select using (true);

create index if not exists site_content_key_idx on public.site_content (key);


-- 5. Site Settings Table (Global Settings)
create table if not exists public.site_settings (
  id                  uuid primary key default gen_random_uuid(),
  phone               text,
  email               text,
  address             text,
  social_x            text,
  social_linkedin     text,
  social_instagram    text,
  social_tiktok       text,
  copyright_text      text,
  site_title          text,
  meta_description    text,
  admin_password_hash text,
  updated_at          timestamptz default now()
);

alter table public.site_settings enable row level security;

drop policy if exists "Public reads site_settings" on public.site_settings;
create policy "Public reads site_settings" on public.site_settings
  for select using (true);


-- 6. Contact Submissions Table
create table if not exists public.contact_submissions (
  id               uuid primary key default gen_random_uuid(),
  name             text not null,
  email            text not null,
  phone            text,
  source           text,
  budget_range     text,
  message          text,
  attachment_urls  text[] default '{}',
  service_context  text,
  created_at       timestamptz default now()
);

alter table public.contact_submissions enable row level security;

drop policy if exists "Public inserts contact submissions" on public.contact_submissions;
create policy "Public inserts contact submissions" on public.contact_submissions
  for insert with check (true);


-- 7. Contact Attachments Storage Bucket Setup
insert into storage.buckets (id, name, public)
values ('contact-attachments', 'contact-attachments', true)
on conflict (id) do nothing;

drop policy if exists "Public uploads contact attachments" on storage.objects;
create policy "Public uploads contact attachments" on storage.objects
  for insert with check (bucket_id = 'contact-attachments');


-- 8. Admin Password Reset Tokens Table
create table if not exists public.admin_reset_tokens (
  id          uuid primary key default gen_random_uuid(),
  token       text not null unique,
  expires_at  timestamptz not null,
  used        boolean default false,
  created_at  timestamptz default now()
);

alter table public.admin_reset_tokens enable row level security;



