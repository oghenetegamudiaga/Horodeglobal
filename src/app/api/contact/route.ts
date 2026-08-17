import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { Resend } from "resend";
import { getAdminSupabase } from "@/lib/supabase";

const contactSchema = z.object({
  name: z.string().trim().min(1, "Full Name is required"),
  email: z.string().trim().email("Invalid email address"),
  phone: z.string().optional(),
  source: z.string().optional(),
  budget: z.string().optional(),
  message: z.string().optional(),
  service_context: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const name = formData.get("name")?.toString() || "";
    const email = formData.get("email")?.toString() || "";
    const phone = formData.get("phone")?.toString() || "";
    const source = formData.get("source")?.toString() || "";
    const budget = formData.get("budget")?.toString() || "";
    const message = formData.get("message")?.toString() || "";
    const service_context = formData.get("service_context")?.toString() || "";

    // 1. Zod Validation
    const validationResult = contactSchema.safeParse({
      name,
      email,
      phone,
      source,
      budget,
      message,
      service_context,
    });

    if (!validationResult.success) {
      const fieldErrors = validationResult.error.flatten().fieldErrors;
      const errorMessage = Object.values(fieldErrors).flat().join(", ");
      return NextResponse.json(
        { error: errorMessage || "Validation failed" },
        { status: 400 }
      );
    }

    const validated = validationResult.data;

    // 2. Validate attachments (2 files max, 5MB each)
    const rawFiles = formData.getAll("attachments");
    const files: File[] = [];

    for (const item of rawFiles) {
      if (item && typeof item === "object" && "size" in item && item.size > 0) {
        files.push(item as File);
      }
    }

    if (files.length > 2) {
      return NextResponse.json(
        { error: "Maximum 2 files allowed for attachment" },
        { status: 400 }
      );
    }

    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    for (const file of files) {
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { error: `File "${file.name}" exceeds the maximum size limit of 5MB` },
          { status: 400 }
        );
      }
    }

    // 3. Upload attachments to Supabase Storage (contact-attachments bucket)
    const supabaseAdmin = getAdminSupabase();
    const attachmentUrls: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const sanitizedOriginalName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
      const fileExt = sanitizedOriginalName.split(".").pop() || "bin";
      const fileName = `contact_${Date.now()}_${i + 1}_${Math.random().toString(36).substring(2, 7)}.${fileExt}`;

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
        .from("contact-attachments")
        .upload(fileName, buffer, {
          contentType: file.type || "application/octet-stream",
          upsert: true,
        });

      if (uploadError) {
        console.error("Attachment upload error:", uploadError);
        return NextResponse.json(
          { error: `Failed to upload attachment file: ${uploadError.message}` },
          { status: 500 }
        );
      }

      const { data: publicUrlData } = supabaseAdmin.storage
        .from("contact-attachments")
        .getPublicUrl(fileName);

      if (publicUrlData?.publicUrl) {
        attachmentUrls.push(publicUrlData.publicUrl);
      }
    }

    // 4. Insert row into contact_submissions table
    const { data: submissionRow, error: dbError } = await supabaseAdmin
      .from("contact_submissions")
      .insert([
        {
          name: validated.name,
          email: validated.email,
          phone: validated.phone || null,
          source: validated.source || null,
          budget_range: validated.budget || null,
          message: validated.message || null,
          attachment_urls: attachmentUrls,
          service_context: validated.service_context || null,
        },
      ])
      .select("*")
      .single();

    if (dbError) {
      console.error("Database error inserting contact submission:", dbError);
      return NextResponse.json(
        { error: `Database error: ${dbError.message}` },
        { status: 500 }
      );
    }

    // 5. Send notification email via Resend
    const resendApiKey = process.env.RESEND_API_KEY;
    let emailSent = false;
    let emailError: string | null = null;

    if (resendApiKey) {
      try {
        const resend = new Resend(resendApiKey);
        const htmlContent = `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <h2 style="color: #060606; border-bottom: 2px solid #e8e8ea; padding-bottom: 10px;">
              New Contact Submission - Horode Website
            </h2>
            <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
              <tr>
                <td style="padding: 8px 0; font-weight: bold; width: 160px;">Full Name:</td>
                <td style="padding: 8px 0;">${validated.name}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Email:</td>
                <td style="padding: 8px 0;"><a href="mailto:${validated.email}">${validated.email}</a></td>
              </tr>
              ${validated.phone ? `
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Phone:</td>
                <td style="padding: 8px 0;">${validated.phone}</td>
              </tr>` : ''}
              ${validated.source ? `
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">How did you hear:</td>
                <td style="padding: 8px 0;">${validated.source}</td>
              </tr>` : ''}
              ${validated.budget ? `
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Budget Range:</td>
                <td style="padding: 8px 0;">${validated.budget}</td>
              </tr>` : ''}
              ${validated.service_context ? `
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Service Context:</td>
                <td style="padding: 8px 0;">${validated.service_context}</td>
              </tr>` : ''}
            </table>

            ${validated.message ? `
            <div style="margin-top: 20px; padding: 15px; background: #f9f9fb; border-radius: 8px;">
              <h3 style="margin-top: 0; font-size: 14px; color: #555;">Message:</h3>
              <p style="white-space: pre-wrap; margin-bottom: 0;">${validated.message}</p>
            </div>` : ''}

            ${attachmentUrls.length > 0 ? `
            <div style="margin-top: 20px;">
              <h3 style="font-size: 14px; color: #555;">Attachments (${attachmentUrls.length}):</h3>
              <ul>
                ${attachmentUrls.map((url, idx) => `<li><a href="${url}" target="_blank">Attachment ${idx + 1}</a></li>`).join('')}
              </ul>
            </div>` : ''}
          </div>
        `;

        const resendRes = await resend.emails.send({
          from: "Horode Website <onboarding@resend.dev>",
          to: "hello@horodeglobal.com",
          subject: `New Contact Submission from ${validated.name}`,
          html: htmlContent,
        });

        if (resendRes.error) {
          console.error("Resend send email error:", resendRes.error);
          emailError = resendRes.error.message;
        } else {
          emailSent = true;
        }
      } catch (err: any) {
        console.error("Resend exception:", err);
        emailError = err.message || "Email dispatch failed";
      }
    } else {
      console.warn("RESEND_API_KEY is not configured in environment variables.");
    }

    return NextResponse.json({
      success: true,
      message: "Thank you! Your message has been sent successfully.",
      submission: submissionRow,
      emailSent,
      emailError,
    });
  } catch (error: any) {
    console.error("Contact API Route unexpected error:", error);
    return NextResponse.json(
      { error: error.message || "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
