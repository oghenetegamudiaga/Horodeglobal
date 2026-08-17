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
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return NextResponse.json(data || []);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error fetching blog posts";
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
      title,
      slug,
      content,
      excerpt,
      cover_image_url,
      published,
      published_at,
      read_time,
      category,
    } = body;

    if (!title || !slug) {
      return NextResponse.json(
        { error: "Title and slug are required" },
        { status: 400 }
      );
    }

    const adminSupabase = getAdminSupabase();
    const payload: any = {
      title,
      slug: slug.toLowerCase().trim().replace(/[^a-z0-9-]/g, "-"),
      content: content || "",
      excerpt: excerpt || "",
      published: published !== undefined ? published : false,
      published_at: published ? published_at || new Date().toISOString() : null,
      read_time: read_time || "5 min read",
      category: category || "Design Strategy",
    };

    if (cover_image_url) {
      payload.cover_image_url = cover_image_url;
    }

    let { data, error } = await adminSupabase
      .from("posts")
      .insert([payload])
      .select()
      .single();

    if (error && error.message?.includes("cover_image_url")) {
      delete payload.cover_image_url;
      const retry = await adminSupabase
        .from("posts")
        .insert([payload])
        .select()
        .single();
      data = retry.data;
      error = retry.error;
    }

    if (error) throw error;
    return NextResponse.json(data);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error creating blog post";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
