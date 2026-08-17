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
      .from("projects")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error) throw error;
    return NextResponse.json(data || []);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error fetching projects";
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
    const {
      name,
      slug,
      client_name,
      one_liner,
      brief,
      service_tags,
      thumbnail_url,
      gallery_urls,
      outcome_content,
      year,
      featured,
      sort_order,
    } = body;

    if (!name || !slug) {
      return NextResponse.json(
        { error: "Name and slug are required" },
        { status: 400 }
      );
    }

    const adminSupabase = getAdminSupabase();
    const { data, error } = await adminSupabase
      .from("projects")
      .insert([
        {
          name,
          slug: slug.toLowerCase().trim().replace(/[^a-z0-9-]/g, "-"),
          client_name,
          one_liner,
          brief,
          service_tags: service_tags || [],
          thumbnail_url,
          gallery_urls: gallery_urls || [],
          outcome_content: outcome_content || null,
          year: year || "2026",
          featured: featured || false,
          sort_order: sort_order || 0,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error creating project";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
