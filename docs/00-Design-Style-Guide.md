# Design Style Guide
## Horode Website — Existing Visual Design (to retain)

**Purpose:** this is the single reference for how the rebuilt site should look. The rebuild changes the *structure* (Services pages, Works detail pages, CMS, blog) and the *stack* (static HTML → Next.js) — it does **not** change the *look*. Every new page/component gets built using the patterns documented here, not a fresh visual direction.

**⚠️ Correction from v1:** an earlier version of this doc used design tokens (Satoshi font, `#fefefe`/`#111111`/`#6b6b6b`/`#e5e5e5`) pulled from a separate, unused Next.js repo. That repo is **not** the live site. The actual production site (`horodeglobal.com`) is the static HTML/CSS/JS project — confirmed by Antigravity's Milestone 0 audit. This version corrects the tokens to match. §1–2 below are marked **[confirmed by Antigravity audit]** or **[pending full styles.css review]** accordingly — Milestone 1 should finish extracting exact values and update this doc as the source of truth.

Source: live homepage (`horodeglobal.com`) + Antigravity's audit of `styles.css`/`index.html`/`script.js` in the static repo.

---

## 1. Color Palette

| Token | Value | Usage | Status |
|---|---|---|---|
| Background (`--bg`) | `#ffffff` | Page background | Confirmed |
| Foreground / Headings (`--fg`, `--ink`) | `#111111` / `#060606` | Primary headings and dark elements | Confirmed |
| Text (`--text`) | `#323236` | Body copy | Confirmed |
| Primary Muted (`--muted`) | `#8b8b92` | Core muted text token (e.g. 3-step list) | Confirmed (`styles.css` audit) |
| Hero Muted | `#97979d` | Hero section copy (`.hero p`) — tuned for headline contrast | Confirmed (`styles.css` audit) |
| Solid Line / Border (`--border`) | `#e8e8ea` | Section labels, cards, chip tags, containers | Confirmed (`styles.css` audit) |
| Form Input Border (`--border-dashed`) | `#d4d4d7` | Form inputs, selects, textareas (`border: 1px dashed`) | Confirmed (`styles.css` audit) |
| Footer Background | `#000000` (true black) | Full-width footer section | Confirmed |
| Footer Text | `#ffffff` | Text on black footer | Confirmed |

## 2. Typography

- **Font: Satoshi** (sans-serif), loaded via Fontshare CDN (`@import url('https://api.fontshare.com/v2/css?f[]=satoshi@900,700,500,400&display=swap');`) in `globals.css`. Weights: 400 (body/inputs), 500 (nav/section titles), 600 (card titles/eyebrows), 700 (buttons), 900 (display headings).
- Hierarchy and letter-spacing: Display headings use `letter-spacing: normal`, bold weight, tight line height (~1.08). Body copy uses relaxed line height (~1.45–1.55). No line wrap issues were introduced by swapping from Inter to Satoshi.

## 3. Layout & Spacing

- Centered content container, generous side margins (matches the visual proportions seen on the live site)
- Section rhythm, exact spacing scale, and breakpoints: **pending full `styles.css` review**

## 4. Core UI Components

*(Component shapes/behavior below are drawn from the actual rendered screenshot of the live homepage, so the visual patterns hold — only the exact CSS values in §1–3 needed correcting. Class names like `.tega-btn` referenced below are placeholders until Milestone 1 confirms the real class names in `styles.css`.)*

### 4.1 Pill Button
- Fully rounded (`border-radius: 9999px`)
- 1.5px solid `--fg` border, transparent background, `--fg` text
- Bold (700) weight text
- Used for: primary CTAs ("Book Free Consultation"), nav CTA ("Contact us" — this one appears filled/inverted, see §4.2), form "Submit"
- Exact hover/transition behavior: **pending Milestone 1 review** of the real CSS

### 4.2 Nav CTA (filled variant)
- "Contact us" in the header nav appears as a **filled** pill (dark background, white text) — a visual emphasis variant of the same pill shape, reserved for the single highest-priority action in the nav
- Keep this filled/outline distinction meaningful: outline pill = secondary/contextual actions, filled pill = the one primary conversion action visible at all times

### 4.3 "Eyebrow" Pill Label
- Small pill-shaped tag above section headings ("Our Services," "Who We Are," "Our Works")
- Thin border, `--muted` text, small/uppercase-adjacent styling, centered above the section heading
- **This is a reusable pattern** — every new page/section (Services detail, Work detail) should use this same eyebrow-label treatment for consistency, not invent a new section-header style

### 4.4 Cards
**Service Card** (3-up grid on Home/`/services`):
- White background, `--border` 1px border, rounded corners (~16–20px)
- Padding-generous interior
- Title (bold, `--fg`) → description (`--muted`) → "Learn more ↗" link (small, bold, arrow-up-right icon)

**Project Card** (2-up grid on Home/Works):
- Full-bleed image at the top, rounded corners on the card itself (image inherits the card's rounding)
- No border — the image is the visual anchor
- Below image: project name (bold), one-line description (`--muted`), then small pill-shaped tag chips (service tags, e.g. "Branding Services," "Product Design") — same pill shape as the eyebrow label but smaller/inline
- Hover behavior on the current site: subtle overlay per the existing work-card pattern — preserve this when extracting into a reusable `ProjectCard` component (per Milestone 5 in the milestones doc)

### 4.5 Form Fields
- Rounded rectangle inputs (not pill-shaped — softer corners, ~8–12px), 1px `--border` outline, generous internal padding
- Placeholder text in `--muted`
- Dropdowns (country code, "How did you hear about us," "What is your budget") use the same input shell with a chevron icon
- Textarea (Message) matches input styling, taller
- "Attach files" row: icon + helper text ("2 Files max · 5MB each"), sits above the Submit button, not styled as a full input box
- Submit button: same pill CTA style as §4.1

### 4.6 Hero Visual Panel
- Large rounded rectangle (light grey, distinct from page background) containing an illustrative graphic (currently abstract geometric shapes suggesting a device/stairs-up motif — reads as "growth")
- Floating badge on top of the panel: small white rounded-pill card with avatar stack + "Trusted by 500+ Businesses and Startups" — a social-proof element, positioned as an overlapping card rather than inline content
- This panel + floating badge pattern is specific to the Home hero — new pages (Services, Work detail) should use simpler header treatments (per IA doc), not replicate the hero illustration

## 5. Header / Navigation

- Left: logo mark (circular "h" icon) + "horode" wordmark, lowercase, bold
- Center-right: nav links — Home, Services, About Us, Works
- Far right: filled pill "Contact us" CTA (§4.2)
- No visible sticky/scroll behavior confirmed from the static screenshot — confirm current scroll behavior in code before deciding whether to keep or add sticky nav in the rebuild

## 6. Footer

- Full-width black (`#000000`) background — the one section that inverts the palette
- Left: logo mark + "horode" wordmark in white, social icons below (X, LinkedIn, Instagram, TikTok) as circular outlined icon buttons
- Center: (currently appears empty/reserved — confirm if content is planned here, e.g. a nav column or tagline)
- Right: "Contact" heading + phone, email, location, stacked
- Bottom bar: copyright line (left) + legal links "Terms of service · Privacy policy" (right), separated from the main footer content by a subtle divider

**Note:** the screenshot Tega originally shared showed "Copyright @2026 Atuzor" in the footer — a live re-fetch of the site now shows "Copyright @2026 Horode," so this appears to have already been fixed (or was a stale cache at screenshot time). No action needed, but worth a quick visual double-check during Milestone 1.

## 7. Section Patterns Observed on Home (structural reference for other pages)

1. Hero (headline + subhead + CTA + illustration panel)
2. Services overview (eyebrow + heading + 3 Service Cards)
3. Who We Are (eyebrow + heading, two-column with supporting paragraph)
4. Selected Works (eyebrow + heading + Project Card grid)
5. Contact block ("Have a project in mind?" heading + "What next?" 3-step list on the left, form on the right)
6. Footer

New pages (Services index, Service detail, Work detail) should reuse this eyebrow → heading → content rhythm rather than introducing new header patterns per page.

## 8. Iconography

- Simple line-style icons: arrow-up-right (card links), chevrons (dropdowns), paperclip (file attach), social icons (X/LinkedIn/Instagram/TikTok) — consistent thin-stroke style throughout, no filled/duotone icons observed
- Recommend standardizing on **Lucide** icons (already Claude/Next.js-ecosystem standard, thin-stroke by default) for any new icons introduced in Services/Works pages, matching the existing weight

## 9. What NOT to Change

Per Tega's instruction, this rebuild retains the current design as closely as possible. Explicitly out of scope for this rebuild:
- Color palette (§1) — pending final confirmation in Milestone 1, but the intent is to match, not redesign
- Layout/structure of existing sections (§7)
- Card and button shapes/behavior (§4)
- Header layout (§5)
- Footer layout (§6)

**One resolved decision:** font. The original brief said "keep Satoshi," but the live site actually uses Inter. **Tega has confirmed: switch to Satoshi.** This is the one intentional visual change in this rebuild — everything else (colors, layout, cards, buttons) stays matched to what's live.

The rebuild's job is to **port this design faithfully into Next.js (with the one confirmed font swap) and extend it to new pages/content types** (Services detail, Work detail, blog, CMS/admin) — not redesign it beyond that.
