import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getAdminSession } from "@/lib/session";
import { getAdminSupabase } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();

    if (!password) {
      return NextResponse.json(
        { error: "Password is required" },
        { status: 400 }
      );
    }

    let isValid = false;

    // Check DB stored hash first
    try {
      const supabaseAdmin = getAdminSupabase();
      const { data: settings } = await supabaseAdmin
        .from("site_settings")
        .select("admin_password_hash")
        .limit(1)
        .maybeSingle();

      if (settings?.admin_password_hash) {
        isValid = await bcrypt.compare(password, settings.admin_password_hash);
      }
    } catch (dbErr) {
      console.warn("Could not check DB admin_password_hash, falling back to env:", dbErr);
    }

    // Fallback to env variable if DB hash wasn't matched/present
    if (!isValid && process.env.ADMIN_PASSWORD) {
      const envPassword = process.env.ADMIN_PASSWORD;
      if (envPassword.startsWith("$2a$") || envPassword.startsWith("$2b$")) {
        isValid = await bcrypt.compare(password, envPassword);
      } else {
        isValid = password === envPassword;
      }
    }

    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid admin password" },
        { status: 401 }
      );
    }

    const session = await getAdminSession();
    session.isLoggedIn = true;
    await session.save();

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
