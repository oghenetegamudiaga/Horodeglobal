import { NextRequest, NextResponse } from "next/server";
import { getAdminSupabase } from "@/lib/supabase";
import { ALLOWED_BUCKETS, ALLOWED_MIME_TYPES, MAX_FILE_SIZE, StorageBucket } from "@/lib/storage";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { bucket, filename, contentType, fileSize, slug } = body;

    // 1. Validate Bucket
    if (!bucket || !ALLOWED_BUCKETS.includes(bucket as StorageBucket)) {
      return NextResponse.json(
        { error: `Invalid bucket. Allowed buckets: ${ALLOWED_BUCKETS.join(", ")}` },
        { status: 400 }
      );
    }

    // 2. Validate MIME Type
    if (!contentType || !ALLOWED_MIME_TYPES.includes(contentType.toLowerCase())) {
      return NextResponse.json(
        { error: "Invalid file type. Allowed formats: .jpg, .jpeg, .png, .webp" },
        { status: 400 }
      );
    }

    // 3. Validate File Size (if provided by client)
    if (fileSize && fileSize > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File size exceeds 5MB limit." },
        { status: 400 }
      );
    }

    // 4. Generate collision-free filename path
    const ext = filename?.split(".").pop() || contentType.split("/")[1] || "webp";
    const cleanSlug = (slug || "upload").toLowerCase().replace(/[^a-z0-9-]/g, "-");
    const filePath = `${cleanSlug}-${Date.now()}.${ext}`;

    // 5. Generate Signed Upload URL via Supabase Admin Client
    const adminSupabase = getAdminSupabase();

    // Ensure bucket exists
    const { data: bucketData, error: bucketError } = await adminSupabase.storage.getBucket(bucket);
    if (bucketError || !bucketData) {
      await adminSupabase.storage.createBucket(bucket, {
        public: true,
        allowedMimeTypes: ALLOWED_MIME_TYPES,
        fileSizeLimit: MAX_FILE_SIZE,
      });
    }

    const { data, error } = await adminSupabase.storage
      .from(bucket)
      .createSignedUploadUrl(filePath);

    if (error || !data) {
      console.error("Error generating signed upload URL:", error);
      return NextResponse.json(
        { error: error?.message || "Failed to generate signed upload URL" },
        { status: 500 }
      );
    }

    // 6. Generate Public Read URL
    const { data: publicData } = adminSupabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return NextResponse.json({
      signedUrl: data.signedUrl,
      token: data.token,
      path: filePath,
      publicUrl: publicData.publicUrl,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
