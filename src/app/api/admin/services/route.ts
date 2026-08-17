import { NextRequest, NextResponse } from "next/server";
import { getAdminSupabase } from "@/lib/supabase";
import { getAdminSession } from "@/lib/session";

export async function GET() {
  try {
    const session = await getAdminSession();
    if (!session.isLoggedIn) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const adminSupabase = getAdminSupabase();
    const { data, error } = await adminSupabase
      .from("services")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error) throw error;
    return NextResponse.json(data || []);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error fetching services";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session.isLoggedIn) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, slug, one_liner, icon, image_url, deliverables, process_steps, sort_order } = body;

    if (!name || !slug) {
      return NextResponse.json(
        { error: "Name and slug are required" },
        { status: 400 }
      );
    }

    const adminSupabase = getAdminSupabase();
    const { data, error } = await adminSupabase
      .from("services")
      .insert([
        {
          name,
          slug: slug.toLowerCase().trim().replace(/[^a-z0-9-]/g, "-"),
          one_liner,
          icon,
          image_url,
          deliverables: deliverables || [],
          process_steps: process_steps || [],
          sort_order: sort_order || 0,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error creating service";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
