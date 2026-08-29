import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
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
    const { name, slug, one_liner, icon, icon_type, image_url, deliverables, process_steps, sort_order } = body;

    if (!name || !slug) {
      return NextResponse.json(
        { error: "Name and slug are required" },
        { status: 400 }
      );
    }

    // Server-side validation
    const validDeliverables = Array.isArray(deliverables)
      ? deliverables.map((d: any) => String(d).trim()).filter(Boolean)
      : [];

    const validProcessSteps = Array.isArray(process_steps)
      ? process_steps
          .filter((step: any) => step && typeof step === "object" && step.title)
          .map((step: any) => ({
            title: String(step.title).trim(),
            description: String(step.description || "").trim(),
          }))
      : [];

    const validIconType = icon_type === "custom" ? "custom" : "lucide";

    const adminSupabase = getAdminSupabase();
    const { data, error } = await adminSupabase
      .from("services")
      .insert([
        {
          name,
          slug: slug.toLowerCase().trim().replace(/[^a-z0-9-]/g, "-"),
          one_liner: one_liner || null,
          icon: icon || null,
          icon_type: validIconType,
          image_url: image_url || null,
          deliverables: validDeliverables,
          process_steps: validProcessSteps,
          sort_order: typeof sort_order === "number" ? sort_order : 0,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    try {
      revalidatePath("/");
      revalidatePath("/services");
      if (data?.slug) {
        revalidatePath(`/services/${data.slug}`);
      }
    } catch (e) {
      console.warn("Revalidation warning:", e);
    }

    return NextResponse.json(data);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error creating service";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
