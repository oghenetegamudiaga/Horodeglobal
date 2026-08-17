import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getAdminSupabase } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const { token, newPassword } = await request.json();

    if (!token || !newPassword) {
      return NextResponse.json(
        { error: "Token and new password are required." },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long." },
        { status: 400 }
      );
    }

    const supabaseAdmin = getAdminSupabase();

    // Verify token
    const { data: tokenRow, error: tokenErr } = await supabaseAdmin
      .from("admin_reset_tokens")
      .select("*")
      .eq("token", token)
      .eq("used", false)
      .gt("expires_at", new Date().toISOString())
      .limit(1)
      .maybeSingle();

    if (tokenErr || !tokenRow) {
      return NextResponse.json(
        { error: "Invalid or expired password reset token. Please request a new link." },
        { status: 400 }
      );
    }

    // Hash new password
    const newHash = await bcrypt.hash(newPassword, 10);

    // Update site_settings
    const { data: settings } = await supabaseAdmin
      .from("site_settings")
      .select("id")
      .limit(1)
      .maybeSingle();

    if (settings?.id) {
      await supabaseAdmin
        .from("site_settings")
        .update({ admin_password_hash: newHash, updated_at: new Date().toISOString() })
        .eq("id", settings.id);
    } else {
      await supabaseAdmin
        .from("site_settings")
        .insert([{ admin_password_hash: newHash }]);
    }

    // Mark token as used
    await supabaseAdmin
      .from("admin_reset_tokens")
      .update({ used: true })
      .eq("id", tokenRow.id);

    return NextResponse.json({
      success: true,
      message: "Your admin password has been reset successfully! You can now log in.",
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
