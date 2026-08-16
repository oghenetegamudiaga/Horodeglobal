# Product Requirements Document (PRD)
## Horode Website — Full Rebuild (v3)

**Prepared for:** Horode Design Studio (Oghenetega Mudiaga)
**Status:** Draft v3.0 — supersedes v2.0
**Source of truth:** live repo `github.com/oghenetegamudiaga/Horode-site` + `00-Design-Style-Guide.md`

---

## 1. What Changed Since v2.0

- **Design direction locked:** this is a **structural rebuild that retains the current visual design exactly** — not a visual redesign. Confirmed against the live homepage screenshot and documented in `00-Design-Style-Guide.md`.
- "Full redesign" in earlier drafts is now understood to mean *"fully rebuild the site's architecture, CMS, and content model"* — the look, feel, colors, fonts, buttons, and card patterns stay as they are today.
- All new pages (Services, Work detail) and restyled pages (Blog, Contact if touched) must be built using the components and patterns in `00-Design-Style-Guide.md`, not new visual choices.

## 2. What Changed Since v1.0 (carried forward)

- Confirmed scope explicitly includes a **CMS** and a **blog** (the blog already exists in the repo — it's a *keep and extend*, not a rebuild).
- Pulled real design tokens from the live repo (`src/app/globals.css`) — confirmed again visually against the homepage screenshot.
- Pulled the real current route list from the repo (the repo is already a multi-page Next.js 14 app, just missing Services and full Works detail pages).
- Added an explicit image-handling plan (§8) since Tega will be uploading images directly.

## 3. Current State (verified from repo)

| Item | Current value |
|---|---|
| Framework | Next.js 14.2.3, App Router, React 18, TypeScript |
| Styling | Tailwind CSS + custom CSS in `globals.css` |
| Font | Satoshi, loaded via Fontshare `@import` |
| Colors | `--bg:#fefefe` `--fg:#111111` `--muted:#6b6b6b` `--border:#e5e5e5` |
| Database | Supabase — one table (`posts`, for the blog) |
| Auth | iron-session, password-based admin (`ADMIN_PASSWORD` env var) |
| Existing routes | `/`, `/about`, `/work`, `/blog`, `/blog/[slug]`, `/contact`, `/admin`, `/admin/login`, `/admin/new`, `/admin/edit/[id]` |
| Existing admin capability | Full CRUD for blog posts only (Markdown editor, publish/draft toggle) |
| Known gap | `/work` page has **hardcoded** project data with "Banner coming soon" placeholders — no Supabase table, no image upload path |
| Dependencies already installed | `@supabase/supabase-js`, `iron-session`, `bcryptjs`, `react-markdown`, `remark-gfm`, `sharp`, `gray-matter` |

## 4. Goals of the Rebuild

| Goal | Success Signal |
|---|---|
| Rebuild the site around the confirmed IA (Landing → Home / Services / About Us / Works) | New `/services` + `/services/[slug]` routes live; `/work` rebuilt to be data-driven |
| Extend the CMS to cover Services and Works, not just blog | Admin panel manages Services, Works, and Blog from one dashboard |
| Give Tega a real image upload path | No more "Banner coming soon" — images upload from the admin panel to Supabase Storage and render via `next/image` |
| **Preserve the current visual design exactly — pixel-level, not just brand-level** | Every new/rebuilt page matches `00-Design-Style-Guide.md`: same tokens, same pill buttons, same card patterns, same eyebrow labels, same footer. A side-by-side of old vs. new Home should look unchanged. |
| Keep the blog as-is functionally, restyle only if needed | No breaking changes to `posts` table or the Markdown editing flow |

## 5. Non-Goals (Out of Scope for v1 of the rebuild)

- E-commerce / payments
- Client login portal or project dashboards
- Multi-language support
- Migrating off Supabase/iron-session to a third-party CMS (Sanity, Contentful, etc.) — the existing pattern is extended, not replaced
- Native mobile app

## 6. Confirmed Sitemap

```
/ (Home)
/services
  /services/[service-slug]
/about
/work                              ← keep existing route (already indexed); label "Works" in nav
  /work/[project-slug]
/blog                              ← existing, keep
  /blog/[slug]                    ← existing, keep
/contact                           ← existing, keep
/admin/*                           ← existing, extended (see §7)
```

**Note on `/work` vs `/works`:** your sitemap sketch says "Works," but the live repo already uses `/work` (singular) and it's a real, potentially-indexed URL. Recommendation: keep `/work` as the URL, use "Works" only as the nav label — avoids an unnecessary redirect/SEO reset in a full redesign that's already changing a lot at once. Flag if you'd rather rename.

## 7. Functional Requirements by Page

### 7.1 Home (`/`)
Rebuilt per the confirmed IA: hero, services overview (pulling live Service records), About teaser, featured Works (pulling live Project records), blog teaser (already exists — keep), closing CTA.

### 7.2 Services (`/services`)
New. Index page listing all services as cards, each linking to a detail page.

### 7.3 Service Detail (`/services/[slug]`)
New. Name, promise, deliverables, process, related work, CTA (pre-filled with service context on the contact form).

### 7.4 About (`/about`)
Restyle existing page to match the redesign's visual system; content largely retained.

### 7.5 Works (`/work` + `/work/[slug]`)
Rebuilt to be Supabase-backed instead of hardcoded. Index page: grid of project cards with real images (replacing "Banner coming soon"). Detail page: brief, process, outcome, image gallery.

### 7.6 Blog (`/blog` + `/blog/[slug]`)
**Keep as-is functionally.** Restyle to match the new design system if the visual language shifts, but the `posts` table, Markdown editor, and publish flow are not being rebuilt.

### 7.7 Contact (`/contact`)
Keep existing form and fields. Confirm whether email delivery is wired up yet (README notes it currently simulates submission — Resend/Formspree/EmailJS were suggested but not confirmed implemented).

### 7.8 Admin (`/admin/*`)
Extend the existing dashboard with two new sections — **Services** and **Works** — using the same iron-session-gated pattern as the blog admin. Add an image upload control to all three content types (Services, Works, Blog).

## 8. CMS Requirements

- Single admin dashboard (`/admin`) covering **Blog** (existing), **Services** (new), **Works** (new)
- Each content type: list view, create, edit, delete, publish/draft toggle where relevant, reorder (for Services/Works display order)
- Image upload built into the Services and Works forms (see §8)
- No new auth system — reuse iron-session + `ADMIN_PASSWORD`

## 9. Image Handling (what you asked about)

**Recommendation: Supabase Storage, uploaded directly from the admin panel, served through `next/image`.**

Why this over alternatives:
- You already have a Supabase project wired in (`SUPABASE_SERVICE_ROLE_KEY` is already an env var) — no new service, no new billing relationship
- `sharp` is already a dependency, which Next.js uses automatically for on-the-fly image optimization — you get resizing/format conversion (WebP/AVIF) for free once images are served via `next/image`
- Supabase Storage gives you public buckets with CDN-backed delivery, which is enough at this scale (no need for a dedicated DAM/Cloudinary yet)

**How it should work end-to-end:**
1. In the admin panel, when creating/editing a Service, Project, or Blog post, an image upload field lets Tega pick a file from his computer.
2. The file uploads directly from the browser to a Supabase Storage bucket (using a signed upload URL generated server-side — keeps the service role key off the client).
3. The public URL gets saved on the record (`services.image_url`, `projects.thumbnail_url` / `projects.gallery_urls`, `posts.cover_image_url`).
4. Public pages render the image via `next/image`, pointed at the Supabase Storage domain (added to `next.config.js` `images.remotePatterns`).

**Bucket structure:**
```
project-media/       → Works thumbnails + gallery images
service-media/       → Service icons/visuals
blog-media/          → Blog cover images + inline post images
```

**Guardrails to build in:**
- File type restriction (jpg/png/webp only)
- Max file size (e.g. 5MB) enforced both client- and server-side
- Filename collision handling (prefix with slug + timestamp, e.g. `zalyx-ledger-1723459200.webp`)

This is This is detailed further in the System Design doc §5 and built out in Milestone 6.

## 10. Success Metrics (post-launch)

- Time from "have a new project to showcase" to "it's live on `/work`" — should drop from a code deploy to a 2-minute admin panel task
- Contact form submissions per month (baseline vs. post-launch), split by which service page they originated from
- Organic search performance on `/services/*` and `/work/*` (new indexable URLs)

## 11. Open Items Still Needing Your Input

1. Final service list and copy for each (deliverables, process steps)
2. Whether Zalyx Ledger / Ravex get real photography/screens now, or the redesign ships with better-styled placeholders while you gather assets
3. Confirm contact form email delivery status — is it wired to anything yet, or still simulated per the README?
4. Confirm `/work` vs `/works` URL decision (§6)

## 12. Related Documents

- `00-Design-Style-Guide.md`
- `02-Information-Architecture.md`
- `03-System-Design-Document.md`
- `04-Tech-Stack-Document.md`
- `05-Milestones-and-IDE-Prompts.md`
