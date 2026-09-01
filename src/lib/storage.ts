import { getAdminSupabase } from "@/lib/supabase";

export const ALLOWED_BUCKETS = ["blog-media", "service-media", "project-media", "site-media"] as const;
export type StorageBucket = (typeof ALLOWED_BUCKETS)[number];

export const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/svg+xml",
];

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB limit

/**
 * Ensures the three required public Supabase Storage buckets exist.
 */
export async function ensureStorageBuckets(): Promise<void> {
  const adminSupabase = getAdminSupabase();

  for (const bucket of ALLOWED_BUCKETS) {
    const { data, error } = await adminSupabase.storage.getBucket(bucket);
    if (error || !data) {
      console.log(`Creating public storage bucket: ${bucket}...`);
      await adminSupabase.storage.createBucket(bucket, {
        public: true,
        allowedMimeTypes: ALLOWED_MIME_TYPES,
        fileSizeLimit: MAX_FILE_SIZE,
      });
    }
  }
}

/**
 * Deletes a storage object by bucket and path.
 * Used by admin deletion routes in Milestone 7 to clean up orphaned media.
 */
export async function deleteStorageObject(
  bucket: string,
  path: string
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!ALLOWED_BUCKETS.includes(bucket as StorageBucket)) {
      return { success: false, error: `Invalid bucket: ${bucket}` };
    }
    const adminSupabase = getAdminSupabase();
    const { error } = await adminSupabase.storage.from(bucket).remove([path]);

    if (error) {
      console.error(`Error deleting storage object ${bucket}/${path}:`, error.message);
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return { success: false, error: message };
  }
}
