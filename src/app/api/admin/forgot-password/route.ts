import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { Resend } from "resend";
import { getAdminSupabase, DEFAULT_SITE_SETTINGS } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { error: "Valid email address is required." },
        { status: 400 }
      );
    }

    const supabaseAdmin = getAdminSupabase();

    // Check configured admin email
    let configuredEmail = DEFAULT_SITE_SETTINGS.email;
    try {
      const { data: settings } = await supabaseAdmin
        .from("site_settings")
        .select("email")
        .limit(1)
        .maybeSingle();

      if (settings?.email) {
        configuredEmail = settings.email;
      }
    } catch {
      // use default
    }

    // Generate secure random token
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1 hour

    // Store token in Supabase
    try {
      await supabaseAdmin.from("admin_reset_tokens").insert([
        {
          token,
          expires_at: expiresAt,
          used: false,
        },
      ]);
    } catch (dbErr) {
      console.error("Failed to insert admin_reset_token:", dbErr);
    }

    const origin = request.nextUrl.origin || "http://localhost:3000";
    const resetUrl = `${origin}/admin/reset-password?token=${token}`;

    const resendApiKey = process.env.RESEND_API_KEY;
    let emailSent = false;

    if (resendApiKey) {
      try {
        const resend = new Resend(resendApiKey);
        await resend.emails.send({
          from: "Horode Admin <onboarding@resend.dev>",
          to: configuredEmail,
          subject: "Reset Your Admin Password - Horode Design Studio",
          html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 500px; margin: 0 auto; padding: 20px;">
              <h2 style="color: #060606;">Admin Password Reset Request</h2>
              <p>You requested a password reset for your Horode Studio Admin dashboard.</p>
              <p>Click the button below to reset your password. This link will expire in 1 hour.</p>
              <div style="margin: 25px 0;">
                <a href="${resetUrl}" style="background-color: #060606; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                  Reset Admin Password
                </a>
              </div>
              <p style="font-size: 13px; color: #888;">If you did not request this, you can safely ignore this email.</p>
              <p style="font-size: 12px; color: #aaa; word-break: break-all;">Link: ${resetUrl}</p>
            </div>
          `,
        });
        emailSent = true;
      } catch (emailErr) {
        console.error("Resend send error:", emailErr);
      }
    } else {
      console.warn("RESEND_API_KEY not configured. Password Reset Link:", resetUrl);
    }

    return NextResponse.json({
      success: true,
      message:
        "If the email matches our admin record, a recovery password reset link has been dispatched.",
      emailSent,
      // Provide resetUrl in response if in local dev without Resend key for easy testing
      devResetUrl: !resendApiKey ? resetUrl : undefined,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
