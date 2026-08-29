# Milestones & IDE Prompts (v4)
## Horode Website — Full Rebuild

**⚠️ Correction from v3:** the previous version of this plan assumed we were extending an existing Next.js repo with a working blog/admin. Antigravity's Milestone 0 audit confirmed that repo isn't the live site — the actual project (`C:\Vibe coding\Horodeglobal`) is a static HTML/CSS/JS site with no backend. This version is rewritten accordingly: **Services, Works, the blog, the CMS/admin, and the image backend are all new builds**, ported from the static site's real design (`00-Design-Style-Guide.md`), not extensions of existing code.

Work top to bottom. Each prompt assumes the previous milestone's output already exists in the repo. One decision needed Tega's input before Milestone 1 — now resolved:
1. **Font: resolved — Satoshi.** The live site uses Inter, but Tega has confirmed the switch to Satoshi, matching the original brief. This is the one intentional visual change in the rebuild.
2. **Muted/border color reconciliation:** `styles.css` has two values for each (`#8b8b92`/`#97979d`, `#e8e8ea`/`#d4d4d7`) — Milestone 1 still needs to resolve which is used where.

---

## Milestone 0 — Branch, Audit, Docs ✅ Done

Completed by Antigravity. Branch `feat/full-rebuild` created, `/docs` folder added, repo confirmed as static HTML/CSS/JS with no backend. Confirmed: contact form doesn't send anywhere; design tokens in the docs needed correcting (now done in v4 of all docs).

---

## Milestone 1 — Scaffold Next.js & Port the Static Site Pixel-for-Pixel

**Goal:** Stand up a real Next.js app and port the existing `index.html`/`styles.css`/`script.js` into it with zero visible difference from what's live today. This is the foundation everything else builds on — get design fidelity right here before adding anything new.

**Deliverables:**
- Next.js 15 (App Router) + TypeScript + Tailwind CSS v4 scaffolded
- `/` (Home) rendering identically to the current `index.html`, verified by side-by-side comparison
- Final, reconciled design tokens (colors, font decision) written into `00-Design-Style-Guide.md` as the new source of truth
- Shared components extracted: `EyebrowLabel`, pill button (outline + filled variants), `ServiceCard`, `ProjectCard`
- Nav and Footer as shared layout components (still anchor-based for now — real routing comes in Milestone 3+)

**IDE Prompt:**
```
I've confirmed via my Milestone 0 audit that this repo is a static
HTML/CSS/JS site with no backend. We're rebuilding it as a real Next.js
app, starting with a pixel-for-pixel port of what exists today before
adding any new pages or features.

I've added the updated docs to /docs — read 00-Design-Style-Guide.md and
03-System-Design-Document.md before starting.

One confirmed decision up front: the current site uses Inter, but we are
switching to Satoshi (matches the original brand brief) as the one
intentional visual change in this rebuild. Load it via Fontshare CDN:
@import url('https://api.fontshare.com/v2/css?f[]=satoshi@900,700,500,400&display=swap');
or self-hosted via next/font/local if you'd rather avoid the external
CDN request — your call, flag which you choose and why.

1. Scaffold a new Next.js 15 app (App Router, TypeScript, Tailwind CSS
   v4) inside this repo — set it up alongside the existing static files
   for now so we can compare against them directly, then remove the
   static files once the port is verified.
2. Do a full pass over the current styles.css (all of it, not just the
   first section) and resolve the remaining open question:
   - Which muted color (#8b8b92 or #97979d) is used where, and which
     border color (#e8e8ea or #d4d4d7) is used where? Report your
     findings — are these two different intentional shades for
     different contexts, or is one dead/legacy CSS?
3. Set up Tailwind theme tokens in globals.css: the reconciled
   muted/border colors from step 2, plus Satoshi as the font (per the
   confirmed decision above). Update 00-Design-Style-Guide.md §1-2 with
   your findings.
4. Build shared components in components/ui/: EyebrowLabel (the small
   pill-shaped label above "Our Services," "Who We Are," "Our Works"),
   a Button component with outline and filled pill variants (matching
   "Book Free Consultation" vs. "Contact us" nav CTA), ServiceCard,
   ProjectCard (matching the current image-led work card with hover/tag
   chips).
5. Rebuild the Home page (app/page.tsx) using these components,
   reproducing index.html's content and layout exactly (with Satoshi in
   place of Inter): Hero, Services overview, Who We Are, Selected Works
   (Zalyx Ledger + Ravex), the contact section with its "What next?"
   3-step list and form, and the footer.
6. Build shared Nav and Footer components. Keep nav links as anchor
   hashes for now (#services, #about, #works, #contact) — we convert
   these to real routes in later milestones as those pages get built.
7. Verify: open both the old index.html and the new Next.js Home page
   side-by-side. They should match exactly except for the font swap —
   double-check the Satoshi swap hasn't broken any line-wrapping or
   spacing that was tuned for Inter's metrics. Report any layout issues
   the font change causes.

Report back your findings from step 2 (the color reconciliation) before I
approve moving to Milestone 2.
```

---

## Milestone 2 — Supabase Project & Schema: Posts, Services, Projects

**Goal:** Stand up the database from scratch — nothing exists yet.

**Deliverables:**
- Supabase project created (or confirmed reused from another Tega project, per Tech Stack doc §3)
- `posts`, `services`, `projects` tables created per System Design doc §4
- RLS policies applied
- Seed data: 3 confirmed services (real copy, not placeholders — resolve PRD §11.1 first), Zalyx Ledger + Ravex as projects using the exact copy from the current site

**IDE Prompt:**
```
Set up the database layer per docs/03-System-Design-Document.md section 4.

1. Confirm: are we creating a brand-new Supabase project for this site,
   or reusing an existing one from another project? [I'll answer this
   before you proceed if not already clear from my env vars.]
2. Add supabase-schema.sql to the repo containing the posts, services,
   and projects table definitions from docs/03-System-Design-Document.md
   section 4, including RLS policies (public select, posts additionally
   gated on published = true).
3. Write a seed script inserting Zalyx Ledger and Ravex into projects,
   using the exact copy from the ported Home page (title, one-liner,
   service tags) built in Milestone 1 — leave thumbnail_url and
   gallery_urls null for now, we wire images in Milestone 6.
4. Seed services with the three from the current Home page: Branding &
   Strategy, UI/UX Design, Software & App Dev — using their exact
   descriptions from the ported page.
5. Add a lib/supabase.ts with a public client (anon key) and an admin
   client (service role key, server-only), plus TypeScript interfaces
   for Post, Service, and Project matching the schema.
6. Update the Home page built in Milestone 1 to fetch Services and
   Projects from Supabase instead of hardcoded content, confirming the
   page still renders identically.
```

---

## Milestone 3 — Services Pages (real routes)

**Goal:** Turn "Services" from an anchor section into a real `/services` + `/services/[slug]` set of pages.

**Deliverables:**
- `app/services/page.tsx`
- `app/services/[slug]/page.tsx`
- Nav updated: "Services" now links to `/services` instead of `#services` (Home page keeps its own services *overview* section, which links to `/services` too)

**IDE Prompt:**
```
Build the Services pages per docs/02-Information-Architecture.md sections
3.2-3.3, using the ServiceCard and EyebrowLabel components from Milestone 1.

1. Build app/services/page.tsx: EyebrowLabel + heading, grid of
   ServiceCards fetched from Supabase ordered by sort_order, closing CTA
   to /contact.
2. Build app/services/[slug]/page.tsx as a dynamic route using
   generateStaticParams. Layout: header (name, one-liner), deliverables
   list, process steps, related projects, CTA to /contact with
   ?service=<slug> appended.
3. Update the shared Nav component so "Services" links to /services
   instead of #services. Leave About Us and Works as anchors for now —
   they get converted in later milestones.
4. Add generateMetadata() to both pages.
```

---

## Milestone 4 — About Page (real route)

**Goal:** Turn "About Us" from an anchor section into `/about`.

**Deliverables:**
- `app/about/page.tsx`
- Nav updated: "About Us" links to `/about`

**IDE Prompt:**
```
Build the About page per docs/02-Information-Architecture.md section 3.4,
using content from the current "Who We Are" section as a starting point,
expanded into a fuller page (I'll provide additional copy for values/team
if you don't have enough from the current site alone).

1. Build app/about/page.tsx: EyebrowLabel + heading, expanded brand story,
   values section, closing CTA to /works or /contact.
2. Update Nav so "About Us" links to /about instead of #about.
3. Add generateMetadata().
```

---

## Milestone 5 — Works Pages (real routes)

**Goal:** Turn "Works" from an anchor section with 2 hardcoded cards into `/work` + `/work/[slug]`.

**Deliverables:**
- `app/work/page.tsx`
- `app/work/[slug]/page.tsx`
- Nav updated: "Works" links to `/work`

**IDE Prompt:**
```
Build the Works pages per docs/02-Information-Architecture.md sections
3.5-3.6, using the ProjectCard component from Milestone 1 and the
projects table seeded in Milestone 2.

1. Build app/work/page.tsx: EyebrowLabel + heading, grid of ProjectCards
   fetched from Supabase ordered by sort_order.
2. Build app/work/[slug]/page.tsx: header (name, client_name,
   service_tags, year), brief, image gallery (placeholder-friendly until
   Milestone 6 wires real uploads), outcome, next/previous project
   navigation, closing CTA.
3. Update Nav so "Works" links to /work instead of #works.
4. Add generateMetadata() to both pages.

At this point the Home page's own "Selected Works" section should link
its cards to these new /work/[slug] pages instead of nowhere.
```

---

## Milestone 6 — Image Upload Backend

**Goal:** Give Tega a real way to upload images from the admin panel (built next, in Milestone 7) — this is the piece that turns placeholder thumbnails into real ones.

**Deliverables:**
- Three Supabase Storage buckets (`blog-media`, `service-media`, `project-media`), public-read RLS
- `/api/admin/upload-url` route issuing signed upload URLs
- Reusable `ImageUploadField` component
- `next.config.js` updated with `images.remotePatterns` for the Supabase Storage domain

**IDE Prompt:**
```
Build the image upload backend per docs/03-System-Design-Document.md
section 5.

1. Create three Supabase Storage buckets: blog-media, service-media,
   project-media. Public-read RLS, writes only via the service-role
   client.
2. Build app/api/admin/upload-url/route.ts (POST, will be iron-session
   protected once Milestone 7 adds auth — for now, build it assuming
   that protection is coming): validates file type (.jpg/.jpeg/.png/.webp
   only) and a 5MB max size, generates a signed upload URL via the
   Supabase service-role client, returns it plus the eventual public URL.
   Name files {slug}-{timestamp}.{ext}.
3. Build a reusable ImageUploadField component (client component): file
   picker → requests signed URL → uploads directly to Supabase Storage →
   on success calls onUpload(publicUrl). Show upload progress and clear
   errors for oversized/wrong-type files.
4. Update next.config.js images.remotePatterns for the Supabase Storage
   domain so next/image can render the results.
5. Build a shared deleteStorageObject helper (for use when Services/
   Projects/Posts get deleted in Milestone 7) so cleanup isn't a
   forgotten fast-follow.
```

---

## Milestone 7 — Admin Panel & Blog (all new)

**Goal:** Build the full admin panel from scratch — login, and CRUD for Services, Works, and Blog, all password-gated.

**Deliverables:**
- `/admin/login` — iron-session, password-based (matches `ADMIN_PASSWORD` pattern used elsewhere in Tega's projects)
- `/admin` dashboard with three sections: Services, Works, Blog
- `/blog` + `/blog/[slug]` public pages (new — didn't exist before)
- Full CRUD API routes for all three content types, each using `ImageUploadField`

**IDE Prompt:**
```
Build the admin panel and blog per docs/03-System-Design-Document.md
sections 6-7, and docs/02-Information-Architecture.md section 3.7 for the
public blog pages.

1. Build app/api/admin/login and /logout routes using iron-session,
   checking against an ADMIN_PASSWORD env var (bcrypt-hashed).
2. Build app/admin/login/page.tsx (simple password form) and an
   app/admin/(dashboard) route group protected by session middleware,
   redirecting to /login if unauthenticated.
3. Build full CRUD API routes: /api/admin/services, /api/admin/projects,
   /api/admin/posts (GET list, POST create, PUT update, DELETE — calling
   the deleteStorageObject helper from Milestone 6 on delete).
4. Build the admin dashboard UI: a shared list-view pattern reused across
   all three sections, create/edit forms using ImageUploadField for image
   fields (single image for Services, thumbnail + multi-image gallery for
   Works, cover image + Markdown editor for Blog), and reorder controls
   for Services/Works sort_order.
5. Build the public app/blog/page.tsx (list of published posts) and
   app/blog/[slug]/page.tsx (react-markdown rendering of content),
   matching the site's established design system (EyebrowLabel, card
   patterns).
6. Add a "Blog" link to the main site Nav (this is new content that
   didn't exist on the live site).
```

---

## Milestone 8 — Contact Form: Real Backend

**Goal:** Make the contact form actually work — it currently just calls `preventDefault()` and shows a static message.

**Deliverables:**
- `/api/contact` route: validates, stores submission in Supabase, sends notification email via Resend
- `contact_submissions` table
- Updated `script.js`-equivalent (now a React form handler) wired to the real endpoint
- Service-context pre-fill when arriving from a `/services/[slug]` CTA

**IDE Prompt:**
```
Build a real contact form backend per docs/03-System-Design-Document.md,
replacing the current client-side-only simulation.

1. Add a contact_submissions table (name, email, phone, source,
   budget_range, message, attachment_urls, service_context, created_at).
2. Build app/api/contact/route.ts (POST): validate with zod, upload any
   attachments to a new contact-attachments bucket (2 files max, 5MB
   each, enforced server-side), insert the row, send a notification email
   to hello@horodeglobal.com via Resend.
3. Convert the existing contact form markup into a proper React form
   (react-hook-form + zod) wired to this endpoint, replacing the
   script.js preventDefault() simulation. Keep the exact current field
   set and layout: Full Name*, Email*, Phone, How did you hear about us,
   Budget, Message, file attach.
4. If arriving via ?service=<slug> from a service page CTA (Milestone 3),
   capture that into service_context and optionally display it in the
   form.
5. Show a real success/error state after submission (replacing the
   current static "Thanks. Your request is ready to connect to a
   backend." placeholder text).
```

---

## Milestone 9 — SEO, Performance, QA, Launch

**Goal:** Harden and cut over — replace the old static site with the new Next.js app on `horodeglobal.com`.

**Deliverables:**
- `sitemap.xml` / `robots.txt` covering all dynamic slugs
- Lighthouse ≥ 90 across Performance/Accessibility/Best Practices/SEO on Home, one service page, one work page
- Full QA pass, then production cutover

**IDE Prompt:**
```
Prepare for launch.

1. Build app/sitemap.ts and app/robots.ts pulling dynamic slugs from
   services, projects, and posts tables.
2. Audit generateMetadata() coverage across every route.
3. Run a Lighthouse audit on /, a /services/[slug] page, and a
   /work/[slug] page. Fix anything below 90 — pay particular attention to
   image loading and color contrast against the final reconciled tokens
   from Milestone 1.
4. Full QA pass: every route on mobile/tablet/desktop widths; admin login
   and CRUD for Services, Works, and Blog; image upload end-to-end;
   contact form submission and email delivery; all Nav/Footer links
   resolve correctly (no leftover anchor-hash links).
5. Remove the old static HTML/CSS/JS files from the repo once the
   Next.js version is fully verified against them.
6. Confirm the Vercel production deployment is correctly pointed at
   horodeglobal.com's DNS before merging feat/full-rebuild to main.
```

---

## Milestone Sequencing Summary

| # | Milestone | Depends on | Status |
|---|---|---|---|
| 0 | Branch, audit, docs | — | ✅ Done |
| 1 | Scaffold Next.js, port static site pixel-for-pixel | 0 | Next up |
| 2 | Supabase schema: posts, services, projects | 1 | |
| 3 | Services pages | 1, 2 | |
| 4 | About page | 1 | |
| 5 | Works pages | 1, 2 | |
| 6 | Image upload backend | 2 | |
| 7 | Admin panel & blog | 2, 6 | |
| 8 | Contact form backend | 1 | |
| 9 | SEO, performance, QA, launch | 3, 5, 7, 8 | |

Milestones 3, 4, 5, and 8 can run in parallel once 1 and 2 are done. Milestone 1 is the true blocker — everything visual depends on getting the design fidelity and token reconciliation right there first.
