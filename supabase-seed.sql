-- Horode Design Studio Seed Script (Services & Projects)
-- Supabase Postgres SQL

-- Seed Services
insert into public.services (slug, name, one_liner, sort_order)
values
  (
    'branding-strategy',
    'Branding & Strategy',
    'We craft brand identities and positioning systems that make your business clear, premium, and impossible to ignore.',
    1
  ),
  (
    'ui-ux-design',
    'UI/UX Design',
    'We bring expertise in all stages of design, from research to polished prototypes.',
    2
  ),
  (
    'software-app-dev',
    'Software & App Dev',
    'We build scalable websites, web apps, and mobile applications tailored precisely to your business goals.',
    3
  )
on conflict (slug) do update set
  name = excluded.name,
  one_liner = excluded.one_liner,
  sort_order = excluded.sort_order;

-- Seed Projects (Selected Works)
insert into public.projects (slug, name, one_liner, service_tags, thumbnail_url, featured, sort_order)
values
  (
    'zalyx-ledger',
    'Zalyx Ledger',
    'Zalyx Ledger help African business owners manage and track their business records seamlessly.',
    array['Branding Services', 'Product Design', 'Social Media Design'],
    '/assets/zalyx-ledger.png',
    true,
    1
  ),
  (
    'ravex',
    'Ravex',
    'A fintech product that help users easily pay utility bills',
    array['Branding Services', 'Social Media Design'],
    '/assets/ravex.png',
    true,
    2
  )
on conflict (slug) do update set
  name = excluded.name,
  one_liner = excluded.one_liner,
  service_tags = excluded.service_tags,
  thumbnail_url = excluded.thumbnail_url,
  featured = excluded.featured,
  sort_order = excluded.sort_order;

-- Seed Site Content
insert into public.site_content (key, value)
values
  ('hero_headline', '"We Build Brands That Refuse to Stay Small."'::jsonb),
  ('hero_subhead', '"We combine strategy, design, and technology to help ambitious businesses grow into market leaders."'::jsonb),
  ('hero_cta_text', '"Book Free Consultation"'::jsonb),
  ('who_we_are_headline', '"We Create Solutions We Build Systems,"'::jsonb),
  ('who_we_are_text', '"We build digital foundations that help businesses grow with intention. From brand strategy and identity design to custom software and app development, every system we build is engineered to make your company visible, trusted, and infinitely scalable."'::jsonb),
  ('about_hero_title', '"We Create Solutions, We Build Systems."'::jsonb),
  ('about_hero_subhead', '"We combine strategy, design, and technology to help ambitious businesses grow into market leaders."'::jsonb),
  ('about_philosophy_title', '"Building Foundations for Intention and Scale"'::jsonb),
  ('about_story', '"We build digital foundations that help businesses grow with intention. From brand strategy and identity design to custom software and app development, every system we build is engineered to make your company visible, trusted, and infinitely scalable.\n\nHorode was founded on a core insight: modern companies don''t just need isolated logos or standalone web pages — they need integrated brand and technology systems. When strategy, visual identity, and code work in harmony, businesses move faster, communicate clearer, and command higher market value."'::jsonb),
  ('about_values', '[
    {"number": "01", "title": "Systemic Thinking", "description": "We build reusable design systems and modular codebase architectures rather than short-term fixes. Every asset is engineered to scale with your business."},
    {"number": "02", "title": "Uncompromising Craftsmanship", "description": "Every typographic detail, layout grid, micro-interaction, and backend endpoint is crafted with rigorous standards for clarity and performance."},
    {"number": "03", "title": "Direct Collaboration", "description": "We work side-by-side with founders and executive teams as long-term strategic partners, maintaining clear, transparent feedback loops."},
    {"number": "04", "title": "Measurable Impact", "description": "Design and code are means to an end — driving user trust, market positioning, and sustainable enterprise revenue growth."}
  ]'::jsonb)
on conflict (key) do update set
  value = excluded.value,
  updated_at = now();

-- Seed Site Settings
insert into public.site_settings (id, phone, email, address, social_x, social_linkedin, social_instagram, social_tiktok, copyright_text, site_title, meta_description)
values
  (
    '00000000-0000-0000-0000-000000000001',
    '+23480-6009-1147',
    'hello@horodeglobal.com',
    'Warri, Delta State, Nigeria',
    'https://www.x.com/horodeglobal',
    'https://www.linkedin.com/company/horodeglobal',
    'https://www.instagram.com/horodeglobal',
    'https://www.tiktok.com/@horodeglobal',
    'Copyright @2026 Horode',
    'Horode Design Studio',
    'We craft brand identities, UI/UX designs, and software solutions that make your business clear, premium, and impossible to ignore.'
  )
on conflict (id) do update set
  phone = excluded.phone,
  email = excluded.email,
  address = excluded.address,
  social_x = excluded.social_x,
  social_linkedin = excluded.social_linkedin,
  social_instagram = excluded.social_instagram,
  social_tiktok = excluded.social_tiktok,
  copyright_text = excluded.copyright_text,
  site_title = excluded.site_title,
  meta_description = excluded.meta_description,
  updated_at = now();

