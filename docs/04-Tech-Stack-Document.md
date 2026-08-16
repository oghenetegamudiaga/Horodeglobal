# Tech Stack Document (v4)
## Horode Website — Full Rebuild

**⚠️ Correction from v3:** earlier drafts assumed we were extending an existing Next.js + Supabase + iron-session repo. That repo turned out not to be the live site — the actual project is a static HTML/CSS/JS site with nothing installed. This doc now reflects a real fresh build, not an extension.

Visual design is unchanged (see `00-Design-Style-Guide.md`, pending Milestone 1's full token confirmation); this doc covers engineering choices only.

---

## 1. Recommended Framework (new — nothing currently installed)

| Layer | Choice | Why |
|---|---|---|
| Framework | **Next.js 15** (App Router) | Matches Tega's stack across every other active project (Leafology, EventFlyer, Flyer Generator) — same mental model, same deployment pattern, no new tooling to learn |
| Language | **TypeScript** | Type safety across Service/Project/Post content models and API routes |
| Styling | **Tailwind CSS v4** | Fast to theme with CSS variables for the (soon to be reconciled) brand tokens |
| Font | **Satoshi** — confirmed switch from Inter (what's live today) per Tega's decision, matching the original brief | Resolved |

**Migration approach:** port `index.html`/`styles.css` into Next.js components section-by-section, validating each against the live site visually before moving to the next, rather than a big-bang rewrite. This is Milestone 1.

## 2. Data & Backend (new — no existing database)

| Layer | Choice | Why |
|---|---|---|
| Database | **Supabase (Postgres)** | Matches Tega's stack on every other active project — one mental model across Leafology, EventFlyer, and this site |
| File storage | **Supabase Storage** | Same project, same auth — for Services/Works/Blog images |
| Auth (admin) | **iron-session** | Lightweight, matches the pattern already used successfully elsewhere in Tega's other projects — no need to introduce a heavier auth provider for a single-admin-user CMS |
| Image optimization | `next/image` (built into Next.js) | Automatic resizing/format conversion, no extra dependency needed |
| Markdown rendering (blog) | `react-markdown` + `remark-gfm` | Standard, lightweight choice for a Markdown-based blog editor |
| Email (contact form) | **Resend** | Confirmed the current form doesn't send anywhere (`script.js` just calls `preventDefault()`) — needs real delivery wired up from scratch |

## 3. Hosting & Infra

| Layer | Choice | Notes |
|---|---|---|
| Hosting | **Vercel** | Matches Tega's other projects |
| Repo | Confirm: does the static site's current repo get converted in place, or does this become a new repo pointed at the `horodeglobal.com` domain once ready? Flag before Milestone 1. |
| Domain | `horodeglobal.com` (existing) | DNS/domain unchanged — only the underlying deployment changes |

## 4. Full Dependency List (all new)

```json
{
  "dependencies": {
    "next": "^15",
    "react": "^19",
    "react-dom": "^19",
    "@supabase/supabase-js": "^2",
    "iron-session": "^8",
    "bcryptjs": "^2",
    "react-markdown": "^9",
    "remark-gfm": "^4",
    "react-hook-form": "^7",
    "zod": "^3",
    "resend": "^4"
  }
}
```

## 5. What We're Deliberately Not Adding

- No headless CMS platform (Sanity/Contentful) — Supabase + a custom admin panel matches Tega's existing pattern elsewhere
- No new storage/DAM vendor — Supabase Storage covers this at current scale
- No state management library — public pages are server-rendered; admin forms don't need global state
- No animation framework — matching the current site's clean, low-motion visual language

## 6. Environment Variables (all new — nothing currently configured)

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
ADMIN_PASSWORD=
SESSION_SECRET=
RESEND_API_KEY=
NEXT_PUBLIC_SITE_URL=
```

Since there's no existing Supabase project tied to this static site, Milestone 2 needs to either create a new Supabase project or confirm one already exists that should be reused (e.g. from another Tega project) before schema work starts.
