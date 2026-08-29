# System Design Document (v4)
## Horode Website — Full Rebuild

**⚠️ Correction from v3:** this doc previously assumed we were extending an existing Next.js repo with a working blog/admin. That repo is not the live site. Confirmed via Antigravity's audit: the live site is static HTML/CSS/JS with no backend at all. This version reflects a fresh build — blog, CMS, Services, Works, and image backend are all new, ported from the static site's design (see `00-Design-Style-Guide.md`), not extended from existing code.

---

## 1. Architecture Overview

```
┌──────────────────────────────────────────────────────────────┐
│                     Vercel (Edge/CDN)                         │
│  ┌────────────────────────────────────────────────────────┐  │
│  │           Next.js 15 App (App Router) — all new         │  │
│  │  ┌────────────┐  ┌────────────┐  ┌───────────────────┐  │  │
│  │  │  Public     │  │  Admin      │  │  API Routes        │  │  │
│  │  │  routes     │  │  (iron-     │  │  (posts CRUD,       │  │  │
│  │  │  (SSG/ISR)  │  │  session,   │  │  services CRUD,     │  │  │
│  │  │             │  │  new)       │  │  works CRUD,        │  │  │
│  │  │             │  │             │  │  upload-url — all   │  │  │
│  │  │             │  │             │  │  new)               │  │  │
│  │  └────────────┘  └────────────┘  └───────────────────┘  │  │
│  └────────────────────────────────────────────────────────┘  │
└───────────────────────────┬────────────────────────────────┘
                             │
                    ┌────────┴─────────┐
                    │   Supabase (new)   │
                    │  Postgres:         │
                    │   posts (new)      │
                    │   services (new)   │
                    │   projects (new)   │
                    │  Storage:           │
                    │   blog-media (new) │
                    │   service-media(new)│
                    │   project-media(new)│
                    └────────────────────┘
```

## 2. Rendering Strategy per Route

| Route | Strategy | Notes |
|---|---|---|
| `/` | ISR (revalidate on content change) | Ported from `index.html`; pulls featured services/projects/posts once live |
| `/services` | ISR | New (site currently has no separate Services page — it's an anchor section) |
| `/services/[slug]` | ISR + `generateStaticParams` | New |
| `/about` | Static | New — currently just an anchor section, not a route |
| `/work` | ISR | New — currently just an anchor section with 2 hardcoded projects, not a route |
| `/work/[slug]` | ISR + `generateStaticParams` | New |
| `/blog`, `/blog/[slug]` | ISR | New — blog doesn't exist on the live site today |
| `/contact` | Static shell + client-side form → real API route | Form currently exists but doesn't submit anywhere — needs real backend wiring |
| `/admin/*` | Dynamic (SSR), iron-session gated | New — no admin panel exists today |

## 3. Design Tokens & Components

Full spec lives in `00-Design-Style-Guide.md` (pending Milestone 1's final confirmation) — summarized here for engineering reference:

```css
:root {
  --bg: #ffffff;
  --ink: #060606;
  --text: #323236;
  --muted: #8b8b92; /* or #97979d — reconcile in Milestone 1 */
  --border: #e8e8ea; /* or #d4d4d7 — reconcile in Milestone 1 */
}

body {
  font-family: 'Satoshi', sans-serif; /* confirmed switch from Inter (live) per Tega's decision */
}
```

- New shared primitives needed per the style guide: eyebrow pill label, filled-pill nav CTA variant, Service Card, Project Card — all get built (not extracted, since nothing exists yet) in Milestone 1 as `components/ui/` and validated pixel-for-pixel against the live site.

## 4. Data Model (Postgres via Supabase)

### 4.1 `posts` (new — blog doesn't exist yet on the live site)
```sql
create table if not exists public.posts (
  id           uuid primary key default gen_random_uuid(),
  title        text not null,
  slug         text not null unique,
  excerpt      text,
  category     text,
  content      text,               -- Markdown
  cover_image_url text,
  published    boolean default false,
  read_time    text,
  published_at timestamptz,
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);

alter table public.posts enable row level security;
create policy "Public reads published posts" on public.posts for select using (published = true);
create index if not exists posts_slug_idx on public.posts (slug);
```

### 4.2 `services` (new)
```sql
create table if not exists public.services (
  id                  uuid primary key default gen_random_uuid(),
  slug                text not null unique,
  name                text not null,
  one_liner           text,
  icon                text,
  image_url           text,
  deliverables        jsonb default '[]',
  process_steps       jsonb default '[]',   -- [{title, description}]
  related_project_ids uuid[] default '{}',
  sort_order          int default 0,
  created_at          timestamptz default now(),
  updated_at          timestamptz default now()
);

alter table public.services enable row level security;
create policy "Public reads services" on public.services for select using (true);
create index if not exists services_slug_idx on public.services (slug);
```

### 4.3 `projects` (new — replaces the two projects hardcoded in `index.html`)
```sql
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
create policy "Public reads projects" on public.projects for select using (true);
create index if not exists projects_slug_idx on public.projects (slug);
```

All three tables are new and follow the same RLS pattern: public `select` (posts additionally gated on `published = true`), writes only via the service-role client from admin API routes.

## 5. Image Backend — Detailed Design

This directly answers "how best to handle image backend."

### 5.1 Why Supabase Storage (not Cloudinary/S3/UploadThing/etc.)
- Supabase is already Tega's default backend across every other active project — no new vendor, one mental model
- Next.js's `next/image` handles resizing/WebP/AVIF conversion and lazy loading automatically once images are served through it — no extra image-processing dependency needed
- Supabase Storage buckets are CDN-backed — sufficient for an agency portfolio site's traffic level
- Row Level Security on Storage mirrors the Postgres RLS pattern used for `services`/`projects`/`posts` — one consistent security model for the whole backend

*(If you ever outgrow this — e.g. need on-the-fly cropping presets, video, or a full DAM — Cloudinary is the natural next step. Not needed for v1.)*

### 5.2 Buckets
```
blog-media/       -- cover images + inline post images
service-media/    -- service icons/visuals
project-media/    -- Works thumbnails + galleries
```
All three: public read, writes restricted to the service-role key (same pattern as the `posts` table today).

### 5.3 Upload Flow (from the admin panel)
1. Tega selects an image in a Service/Project/Blog admin form.
2. Browser requests a **signed upload URL** from a new API route (`/api/admin/upload-url`), which runs server-side with the service-role key — the key itself never reaches the browser.
3. Browser uploads the file directly to Supabase Storage using that signed URL (fast, doesn't route the file through your Vercel function, avoids serverless body-size limits).
4. On success, the API returns the public URL, which gets saved onto the record (`image_url`, `thumbnail_url`, or appended to `gallery_urls`).
5. Public pages render via `next/image`, with the Supabase Storage domain added to `next.config.js`:
   ```js
   images: {
     remotePatterns: [
       { protocol: 'https', hostname: '<your-project-ref>.supabase.co', pathname: '/storage/v1/object/public/**' }
     ]
   }
   ```

### 5.4 Guardrails
- **File type:** restrict to `.jpg`, `.jpeg`, `.png`, `.webp` client- and server-side
- **File size:** cap at 5MB per image, enforced in the upload-url route before issuing the signed URL
- **Naming:** `{slug}-{timestamp}.{ext}` to avoid collisions and make debugging easy
- **Cleanup:** when a Service/Project is deleted, also delete its associated Storage objects (add this to the delete API route — easy to forget, easy to end up with orphaned files)

### 5.5 Gallery Handling (Works detail pages)
`projects.gallery_urls` is a simple text array — the admin form supports multiple image uploads per project, each appended to the array in upload order. No separate table needed at this scale; revisit only if galleries need per-image captions/ordering UI beyond drag-to-reorder.

## 6. API Routes (all new)

| Route | Method | Purpose |
|---|---|---|
| `/api/admin/login`, `/logout` | POST | Admin session management |
| `/api/admin/posts/*` | CRUD | Blog admin |
| `/api/admin/services/*` | CRUD | Services admin |
| `/api/admin/projects/*` | CRUD | Works admin |
| `/api/admin/upload-url` | POST | Issues signed Storage upload URLs (§5.3) |
| `/api/contact` | POST | Real email delivery — the current form doesn't send anywhere |

## 7. Admin Panel Scope (all new — no existing dashboard)

One dashboard (`/admin`), password-gated via iron-session, with three sections built together (not sequentially extended, since none exist yet):
- **Services:** list, create, edit, delete, reorder, image upload
- **Works:** list, create, edit, delete, reorder, thumbnail + gallery upload
- **Blog:** list, create/edit (Markdown), delete, publish/draft toggle, cover image upload

## 8. SEO & Metadata

- `generateMetadata()` per route, including `/services/*`, `/work/*`, and `/blog/*` — none of which exist as indexable routes today (currently all anchor sections on one page)
- `sitemap.xml` / `robots.txt` route handlers, pulling dynamic slugs from Supabase (services, projects, posts)
- OG image: default brand template; per-project override using `thumbnail_url` where available

## 9. Deployment

- New pipeline: GitHub → Vercel, preview deploys per PR, production on merge to `main`
- Confirm whether this replaces the static site's current repo/deployment, or is a new repo that eventually gets pointed at `horodeglobal.com` (flagged in Tech Stack doc §3)
- Env vars: full new set required (Tech Stack doc §6) — nothing is currently configured since there's no backend today

## 10. Risks / Watch-Outs

- **Design fidelity is the top risk** — since this is a from-scratch rebuild of a site that currently has real production traffic/branding, Milestone 1's pixel-comparison against the live site matters more than usual. Don't let "close enough" ship as "matches."
- **Reconcile the two muted/border color values** found in `styles.css` before building components — using the wrong one inconsistently will be visible
- **Font decision: resolved — Satoshi.** The live site uses Inter, but Tega confirmed the switch to Satoshi per the original brief. This is the one intentional visual change in this rebuild; verify in Milestone 1 that the swap doesn't shift line-wrapping/spacing in ways that break the ported layout.
- **RLS on Storage buckets** — easy to leave fully private or fully writable; get this right from the first bucket, not as a fix-later
- **Orphaned Storage files** on delete — build cleanup into delete routes from the start
- **`/work` vs `/works`** — the live site has no real route to preserve here (it's an anchor, not a URL), so this decision has more freedom than previously assumed — no SEO cost either way
