import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getAdminSupabase, DEFAULT_SITE_SETTINGS } from "@/lib/supabase";
import { getAdminSession } from "@/lib/session";

const SINGLETON_ID = "00000000-0000-0000-0000-000000000001";

export async function GET() {
  try {
    const session = await getAdminSession();
    if (!session.isLoggedIn) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const adminSupabase = getAdminSupabase();
    const { data, error } = await adminSupabase
      .from("site_settings")
      .select("*")
      .limit(1)
      .maybeSingle();

    if (error) throw error;

    return NextResponse.json(data ? { ...DEFAULT_SITE_SETTINGS, ...data } : DEFAULT_SITE_SETTINGS);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error fetching site settings";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session.isLoggedIn) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      phone,
      email,
      address,
      social_x,
      social_linkedin,
      social_instagram,
      social_tiktok,
      copyright_text,
      site_title,
      meta_description,
    } = body;

    const adminSupabase = getAdminSupabase();

    // Check if a row already exists
    const { data: existing } = await adminSupabase
      .from("site_settings")
      .select("id")
      .limit(1)
      .maybeSingle();

    const targetId = existing?.id || SINGLETON_ID;

    const payload = {
      id: targetId,
      phone: phone ?? DEFAULT_SITE_SETTINGS.phone,
      email: email ?? DEFAULT_SITE_SETTINGS.email,
      address: address ?? DEFAULT_SITE_SETTINGS.address,
      social_x: social_x ?? DEFAULT_SITE_SETTINGS.social_x,
      social_linkedin: social_linkedin ?? DEFAULT_SITE_SETTINGS.social_linkedin,
      social_instagram: social_instagram ?? DEFAULT_SITE_SETTINGS.social_instagram,
      social_tiktok: social_tiktok ?? DEFAULT_SITE_SETTINGS.social_tiktok,
      copyright_text: copyright_text ?? DEFAULT_SITE_SETTINGS.copyright_text,
      site_title: site_title ?? DEFAULT_SITE_SETTINGS.site_title,
      meta_description: meta_description ?? DEFAULT_SITE_SETTINGS.meta_description,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await adminSupabase
      .from("site_settings")
      .upsert([payload], { onConflict: "id" })
      .select()
      .single();

    if (error) throw error;

    // Trigger on-demand revalidation
    try {
      revalidatePath("/", "layout");
      revalidatePath("/");
      revalidatePath("/about");
    } catch (e) {
      console.warn("Revalidation warning:", e);
    }

    return NextResponse.json({ success: true, data });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error updating site settings";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
