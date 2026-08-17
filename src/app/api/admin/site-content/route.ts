import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getAdminSupabase, DEFAULT_SITE_CONTENT } from "@/lib/supabase";
import { getAdminSession } from "@/lib/session";

export async function GET() {
  try {
    const session = await getAdminSession();
    if (!session.isLoggedIn) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const adminSupabase = getAdminSupabase();
    const { data, error } = await adminSupabase.from("site_content").select("*");

    if (error) throw error;

    const contentMap: Record<string, any> = { ...DEFAULT_SITE_CONTENT };
    if (data && data.length > 0) {
      data.forEach((item: { key: string; value: any }) => {
        contentMap[item.key] = item.value;
      });
    }

    return NextResponse.json(contentMap);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error fetching site content";
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
    const content = body.content || body;

    if (!content || typeof content !== "object") {
      return NextResponse.json({ error: "Invalid content payload" }, { status: 400 });
    }

    const adminSupabase = getAdminSupabase();
    const rowsToUpsert = Object.entries(content).map(([key, value]) => ({
      key,
      value,
      updated_at: new Date().toISOString(),
    }));

    const { data, error } = await adminSupabase
      .from("site_content")
      .upsert(rowsToUpsert, { onConflict: "key" })
      .select();

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
    const message = err instanceof Error ? err.message : "Error updating site content";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
