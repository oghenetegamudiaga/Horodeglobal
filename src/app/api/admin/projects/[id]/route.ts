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

    const { data, error } = await adminSupabase
      .from("projects")
      .update(body)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error updating project";
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

    // Fetch item first to delete associated thumbnail & gallery files
    const { data: item } = await adminSupabase
      .from("projects")
      .select("thumbnail_url, gallery_urls")
      .eq("id", id)
      .single();

    if (item) {
      if (item.thumbnail_url && item.thumbnail_url.includes("project-media")) {
        const fileName = item.thumbnail_url.split("/project-media/").pop();
        if (fileName) {
          await deleteStorageObject("project-media", fileName);
        }
      }
      if (item.gallery_urls && Array.isArray(item.gallery_urls)) {
        for (const gUrl of item.gallery_urls) {
          if (gUrl.includes("project-media")) {
            const fileName = gUrl.split("/project-media/").pop();
            if (fileName) {
              await deleteStorageObject("project-media", fileName);
            }
          }
        }
      }
    }

    const { error } = await adminSupabase.from("projects").delete().eq("id", id);
    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error deleting project";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
