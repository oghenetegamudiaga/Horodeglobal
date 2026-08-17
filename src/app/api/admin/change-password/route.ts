import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getAdminSession } from "@/lib/session";
import { getAdminSupabase } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session.isLoggedIn) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { currentPassword, newPassword } = await request.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: "Both current and new passwords are required." },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: "New password must be at least 6 characters long." },
        { status: 400 }
      );
    }

    const supabaseAdmin = getAdminSupabase();
    const { data: settings } = await supabaseAdmin
      .from("site_settings")
      .select("id, admin_password_hash")
      .limit(1)
      .maybeSingle();

    let isCurrentValid = false;

    if (settings?.admin_password_hash) {
      isCurrentValid = await bcrypt.compare(
        currentPassword,
        settings.admin_password_hash
      );
    } else {
      const envPassword = process.env.ADMIN_PASSWORD || "REDACTED";
      if (envPassword.startsWith("$2a$") || envPassword.startsWith("$2b$")) {
        isCurrentValid = await bcrypt.compare(currentPassword, envPassword);
      } else {
        isCurrentValid = currentPassword === envPassword;
      }
    }

    if (!isCurrentValid) {
      return NextResponse.json(
        { error: "Current password is incorrect." },
        { status: 400 }
      );
    }

    const newHash = await bcrypt.hash(newPassword, 10);

    if (settings?.id) {
      const { error: updateErr } = await supabaseAdmin
        .from("site_settings")
        .update({ admin_password_hash: newHash, updated_at: new Date().toISOString() })
        .eq("id", settings.id);

      if (updateErr) {
        throw new Error(updateErr.message);
      }
    } else {
      const { error: insertErr } = await supabaseAdmin
        .from("site_settings")
        .insert([{ admin_password_hash: newHash }]);

      if (insertErr) {
        throw new Error(insertErr.message);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Admin password updated successfully!",
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
