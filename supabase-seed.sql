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
