import { createClient } from "@supabase/supabase-js";

// Type definitions matching database schema
export interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  category: string | null;
  content: string | null;
  cover_image_url?: string | null;
  published: boolean;
  read_time: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Service {
  id: string;
  slug: string;
  name: string;
  one_liner: string | null;
  icon: string | null;
  icon_type?: "lucide" | "custom" | null;
  image_url: string | null;
  deliverables?: string[];
  process_steps?: { title: string; description: string }[];
  related_project_ids?: string[];
  sort_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface Project {
  id: string;
  slug: string;
  name: string;
  client_name?: string | null;
  thumbnail_url: string | null;
  gallery_urls?: string[];
  service_tags: string[];
  one_liner: string | null;
  brief?: string | null;
  process_content?: Record<string, unknown> | null;
  outcome_content?: Record<string, unknown> | null;
  year?: string | null;
  featured: boolean;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface SiteContent {
  id?: string;
  key: string;
  value: any;
  updated_at?: string;
}

export interface ContactSubmission {
  id?: string;
  name: string;
  email: string;
  phone?: string | null;
  source?: string | null;
  budget_range?: string | null;
  message?: string | null;
  attachment_urls?: string[];
  service_context?: string | null;
  created_at?: string;
}

export interface SiteSettings {
  id?: string;
  phone: string;
  email: string;
  address: string;
  social_x: string;
  social_linkedin: string;
  social_instagram: string;
  social_tiktok: string;
  copyright_text: string;
  site_title: string;
  meta_description: string;
  admin_password_hash?: string | null;
  updated_at?: string;
}

export const DEFAULT_SITE_CONTENT: Record<string, any> = {
  hero_headline: "We Build Brands That Refuse to Stay Small.",
  hero_subhead: "We combine strategy, design, and technology to help ambitious businesses grow into market leaders.",
  hero_cta_text: "Book Free Consultation",
  who_we_are_headline: "We Create Solutions We Build Systems,",
  who_we_are_text: "We build digital foundations that help businesses grow with intention. From brand strategy and identity design to custom software and app development, every system we build is engineered to make your company visible, trusted, and infinitely scalable.",
  about_hero_title: "We Create Solutions, We Build Systems.",
  about_hero_subhead: "We combine strategy, design, and technology to help ambitious businesses grow into market leaders.",
  about_philosophy_title: "Building Foundations for Intention and Scale",
  about_story: "We build digital foundations that help businesses grow with intention. From brand strategy and identity design to custom software and app development, every system we build is engineered to make your company visible, trusted, and infinitely scalable.\n\nHorode was founded on a core insight: modern companies don't just need isolated logos or standalone web pages — they need integrated brand and technology systems. When strategy, visual identity, and code work in harmony, businesses move faster, communicate clearer, and command higher market value.",
  about_values: [
    {
      number: "01",
      title: "Systemic Thinking",
      description: "We build reusable design systems and modular codebase architectures rather than short-term fixes. Every asset is engineered to scale with your business.",
    },
    {
      number: "02",
      title: "Uncompromising Craftsmanship",
      description: "Every typographic detail, layout grid, micro-interaction, and backend endpoint is crafted with rigorous standards for clarity and performance.",
    },
    {
      number: "03",
      title: "Direct Collaboration",
      description: "We work side-by-side with founders and executive teams as long-term strategic partners, maintaining clear, transparent feedback loops.",
    },
    {
      number: "04",
      title: "Measurable Impact",
      description: "Design and code are means to an end — driving user trust, market positioning, and sustainable enterprise revenue growth.",
    },
  ],
  services_intro_eyebrow: "Our Services",
  services_intro_heading: "The Systems Behind Your Next Level",
  services_intro_subhead: "We combine brand strategy, user experience design, and custom technology engineering to build foundations that scale with intention.",
  services_cta_title: "Ready to Build Your System?",
  services_cta_text: "Let's discuss how our strategic design and engineering capabilities can help transform your business ideas into market leaders.",
  works_intro_eyebrow: "Our Works",
  works_intro_heading: "Selected Projects",
  works_intro_subhead: "A showcase of strategic brand design, digital products, and web/mobile application architectures built for client growth.",
  works_cta_title: "Have a Project in Mind?",
  works_cta_text: "Let's build a market-leading product or brand identity system tailored for your company.",
  blog_intro_eyebrow: "Our Journal",
  blog_intro_heading: "Articles & Insights",
  blog_intro_subhead: "Perspectives on brand positioning, user experience design, and software engineering for modern companies.",
  blog_cta_title: "Need Strategic Guidance?",
  blog_cta_text: "Let's discuss how our design strategy and engineering capabilities can transform your brand.",
  contact_eyebrow: "Contact Us",
  contact_heading: "Have a project in mind? Let's create greatness",
  contact_subheading: "What next?",
  contact_steps: [
    "We will reach out to you within one business day to discuss the next steps.",
    "If necessary, we will sign the NDA and begin the project discussion.",
    "Our team of experts will analyze your requirements and make recommendations on the best ways to bring your concept to life.",
  ],
};

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  phone: "+23480-6009-1147",
  email: "hello@horodeglobal.com",
  address: "Warri, Delta State, Nigeria",
  social_x: "https://www.x.com/horodeglobal",
  social_linkedin: "https://www.linkedin.com/company/horodeglobal",
  social_instagram: "https://www.instagram.com/horodeglobal",
  social_tiktok: "https://www.tiktok.com/@horodeglobal",
  copyright_text: "Copyright @2026 Horode",
  site_title: "Horode Design Studio",
  meta_description: "We craft brand identities, UI/UX designs, and software solutions that make your business clear, premium, and impossible to ignore.",
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// Public Supabase Client (Anon Key)
export const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseAnonKey || "placeholder-key"
);

// Admin Supabase Client (Service Role Key - Server Side Only)
export const getAdminSupabase = () => {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_URL");
  }
  return createClient(supabaseUrl, serviceRoleKey);
};

export async function getSiteContentMap(): Promise<Record<string, any>> {
  try {
    if (
      !process.env.NEXT_PUBLIC_SUPABASE_URL ||
      process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder")
    ) {
      return DEFAULT_SITE_CONTENT;
    }
    const { data, error } = await supabase.from("site_content").select("*");
    if (error || !data || data.length === 0) {
      return DEFAULT_SITE_CONTENT;
    }
    const contentMap: Record<string, any> = { ...DEFAULT_SITE_CONTENT };
    data.forEach((item: { key: string; value: any }) => {
      contentMap[item.key] = item.value;
    });
    return contentMap;
  } catch {
    return DEFAULT_SITE_CONTENT;
  }
}

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    if (
      !process.env.NEXT_PUBLIC_SUPABASE_URL ||
      process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder")
    ) {
      return DEFAULT_SITE_SETTINGS;
    }
    const { data, error } = await supabase
      .from("site_settings")
      .select("*")
      .limit(1)
      .maybeSingle();
    if (error || !data) {
      return DEFAULT_SITE_SETTINGS;
    }
    return { ...DEFAULT_SITE_SETTINGS, ...data };
  } catch {
    return DEFAULT_SITE_SETTINGS;
  }
}

