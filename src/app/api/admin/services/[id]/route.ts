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
      .from("services")
      .update(body)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error updating service";
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

    // Fetch item first to delete associated image file
    const { data: item } = await adminSupabase
      .from("services")
      .select("image_url")
      .eq("id", id)
      .single();

    if (item?.image_url && item.image_url.includes("service-media")) {
      const fileName = item.image_url.split("/service-media/").pop();
      if (fileName) {
        await deleteStorageObject("service-media", fileName);
      }
    }

    const { error } = await adminSupabase.from("services").delete().eq("id", id);
    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error deleting service";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
