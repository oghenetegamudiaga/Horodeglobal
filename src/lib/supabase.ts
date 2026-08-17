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
