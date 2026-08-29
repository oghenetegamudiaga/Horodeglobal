# Information Architecture Document (v3)
## Horode Website — Full Rebuild

Grounded in the real repo structure (`github.com/oghenetegamudiaga/Horode-site`), Tega's sitemap sketch, and the confirmed visual patterns in `00-Design-Style-Guide.md`. Every section below follows the existing **eyebrow label → heading → content** rhythm already used on Home — new pages don't invent new header treatments.

---

## 1. Sitemap Tree

```
Horode Website
│
├── / (Home)
│
├── /services                        [NEW]
│   └── /services/[service-slug]     [NEW]
│
├── /about                           [EXISTS — restyle]
│
├── /work                            [EXISTS — rebuild data layer]
│   └── /work/[project-slug]         [NEW]
│
├── /blog                            [EXISTS — keep as-is]
│   └── /blog/[slug]                 [EXISTS — keep as-is]
│
├── /contact                         [EXISTS — keep]
│
└── /admin                           [EXISTS — extend]
    ├── /admin/login                 [EXISTS]
    ├── /admin/posts (blog)          [EXISTS]
    ├── /admin/services              [NEW]
    └── /admin/works                 [NEW]
```

## 2. Navigation Structure

**Primary Nav:** `Home · Services · About Us · Works · Blog · Contact`
(Blog added to primary nav since it's a real, active content channel — confirm if you'd rather keep it footer-only.)

**Footer Nav:** logo, social icons (X, LinkedIn, Instagram, TikTok), contact block, legal links, copyright — matches existing `Footer.tsx`, restyled only.

## 3. Page-Level Breakdown

### 3.1 `/` — Home
Matches the current live page structure exactly — this is the confirmed baseline for design fidelity across the rest of the site.

| Block | Content | Source |
|---|---|---|
| Hero | Headline ("We Build Brands That Refuse to Stay Small"), subhead, "Book Free Consultation" CTA, illustration panel + "Trusted by 500+..." floating badge | Static copy |
| Services overview | Eyebrow "Our Services" + heading "The Systems Behind Your Next Level" + 3× Service Card | Supabase `services` (featured/ordered) |
| Who We Are | Eyebrow "Who We Are" + heading + two-column supporting paragraph | Static, links to `/about` |
| Selected Works | Eyebrow "Our Works" + heading "Selected Projects" + 2× Project Card (image-led, tag chips) | Supabase `projects` (featured = true) |
| Blog teaser | *(not on current Home — confirm if you want it added, or keep Home as-is and let `/blog` stand alone in the nav)* | Supabase `posts` |
| Contact block | "Have a project in mind? Let's creat greatness" heading, "What next?" 3-step list, form | Links to submit flow |
| Footer | Black background, logo, socials, contact info, legal links | Static |

**Note:** the current live footer copyright reads "Copyright @2026 Atuzor" — flagged in the Design Style Guide §6 as a likely leftover bug, fix during the rebuild.

### 3.2 `/services` — Services index [NEW]
Intro copy + grid of Service Cards from Supabase, ordered by `sort_order`.

### 3.3 `/services/[slug]` — Service detail [NEW]
Header, deliverables list, process steps, related projects (pulled via `related_project_ids`), CTA with service context passed to `/contact`.

### 3.4 `/about` — About [restyle existing]
Story, values, stats (matches current `about/page.tsx` structure) — content largely retained, visuals updated.

### 3.5 `/work` — Works index [rebuild]
Currently hardcoded (`projects` array inside `work/page.tsx` with `color` placeholders and "Banner coming soon"). Rebuild to pull from Supabase `projects` table, rendering real thumbnail images via `next/image`.

### 3.6 `/work/[slug]` — Project detail [NEW]
Header (name, client, service tags, year), brief, process/gallery, outcome, next/prev navigation, CTA.

### 3.7 `/blog` + `/blog/[slug]` — [keep as-is]
No structural change. `posts` table, `react-markdown` rendering, and the existing publish/draft flow stay exactly as built. Only the visual shell (Nav/Footer/typography) picks up whatever refinements come out of the redesign.

### 3.8 `/contact` — [keep as-is]
Same form fields. Confirm email delivery integration status per PRD §10.3.

### 3.9 `/admin` — [extend]
Existing: password login → dashboard → blog post list/create/edit.
New: add **Services** and **Works** as sibling sections in the same dashboard, same design pattern as the blog admin (list view, create/edit forms, delete, reorder). Each gets an image upload field (see System Design doc §5).

## 4. Content Types (CMS data model)

| Content Type | Status | Key Fields |
|---|---|---|
| **Post** (blog) | Exists | `id, title, slug, excerpt, category, content, published, read_time, published_at` |
| **Service** | New | `id, slug, name, one_liner, icon, deliverables[], process_steps[], related_project_ids[], image_url, sort_order` |
| **Project** (Works) | New | `id, slug, name, client_name, thumbnail_url, gallery_urls[], service_tags[], one_liner, brief, process_content, outcome_content, year, featured, sort_order` |

## 5. Reusable Components (existing + new)

| Component | Status |
|---|---|
| `Navbar.tsx` | Exists — restyle for new nav items (Services) |
| `Footer.tsx` | Exists — keep |
| `AdminLogoutButton.tsx` | Exists — keep |
| `ServiceCard` | New |
| `ProjectCard` (rename/extend existing work-card markup) | Rebuild — currently inline styles in `work/page.tsx`, extract to a reusable component |
| `ImageUploadField` (admin) | New — shared across Services/Works/Blog admin forms |

## 6. URL & Routing Conventions

- Lowercase, hyphenated slugs
- One level of nesting for detail pages (`/services/[slug]`, `/work/[slug]`) — matches the original sketch
- `/work` (not `/works`) retained per PRD §5 to avoid an unforced URL change

## 7. Open Items Carried from PRD

See PRD §11 — final service list, Zalyx/Ravex asset readiness, contact form email status, `/work` URL confirmation.

## 8. Design Reference

Every component named above (Service Card, Project Card, eyebrow labels, pill buttons, form fields, footer) is fully specified in `00-Design-Style-Guide.md`. Build against that doc, not fresh visual judgment.
