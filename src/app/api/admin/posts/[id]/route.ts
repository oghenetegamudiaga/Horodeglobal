import { NextRequest, NextResponse } from "next/server";
import { getAdminSupabase } from "@/lib/supabase";
import { getAdminSession } from "@/lib/session";
import { deleteStorageObject } from "@/lib/storage";

interface ParamsProps {
  params: Promise<{ id: string }>;
}

export async function PUT(request: NextRequest, { params }: ParamsProps) {
  try {
    const session = await getAdminSession();
    if (!session.isLoggedIn) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const adminSupabase = getAdminSupabase();

    if (body.published && !body.published_at) {
      body.published_at = new Date().toISOString();
    }

    const { data, error } = await adminSupabase
      .from("posts")
      .update(body)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error updating blog post";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: ParamsProps) {
  try {
    const session = await getAdminSession();
    if (!session.isLoggedIn) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const adminSupabase = getAdminSupabase();

    // Fetch item first to delete associated cover image file
    const { data: item } = await adminSupabase
      .from("posts")
      .select("cover_image_url")
      .eq("id", id)
      .single();

    if (item?.cover_image_url && item.cover_image_url.includes("blog-media")) {
      const fileName = item.cover_image_url.split("/blog-media/").pop();
      if (fileName) {
        await deleteStorageObject("blog-media", fileName);
      }
    }

    const { error } = await adminSupabase.from("posts").delete().eq("id", id);
    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error deleting blog post";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
