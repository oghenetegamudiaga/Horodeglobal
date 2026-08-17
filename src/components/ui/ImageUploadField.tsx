"use client";

import React, { useState } from "react";

interface ImageUploadFieldProps {
  label?: string;
  bucket: "blog-media" | "service-media" | "project-media";
  slug?: string;
  currentImageUrl?: string;
  onUpload: (publicUrl: string, path: string) => void;
  onClear?: () => void;
  className?: string;
}

export const ImageUploadField: React.FC<ImageUploadFieldProps> = ({
  label = "Upload Image",
  bucket,
  slug = "upload",
  currentImageUrl,
  onUpload,
  onClear,
  className = "",
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl || null);

  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  const maxSizeBytes = 5 * 1024 * 1024; // 5MB

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);

    // 1. Client-Side Validation
    if (!allowedTypes.includes(file.type.toLowerCase())) {
      setError("Invalid file type. Please upload a .jpg, .png, or .webp image.");
      return;
    }

    if (file.size > maxSizeBytes) {
      setError(`File size (${(file.size / (1024 * 1024)).toFixed(2)}MB) exceeds 5MB limit.`);
      return;
    }

    setIsUploading(true);
    setUploadProgress(10);

    try {
      // 2. Request Signed Upload URL from server route
      const res = await fetch("/api/admin/upload-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bucket,
          filename: file.name,
          contentType: file.type,
          fileSize: file.size,
          slug,
        }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || "Failed to generate upload URL");
      }

      setUploadProgress(40);

      // 3. Direct upload to Supabase Storage using signedUrl
      const uploadRes = await fetch(data.signedUrl, {
        method: "PUT",
        headers: {
          "Content-Type": file.type,
        },
        body: file,
      });

      if (!uploadRes.ok) {
        throw new Error("Direct upload to storage failed");
      }

      setUploadProgress(100);
      setPreviewUrl(data.publicUrl);
      onUpload(data.publicUrl, data.path);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Upload failed";
      setError(message);
    } finally {
      setIsUploading(false);
      setUploadProgress(null);
    }
  };

  const handleClearImage = () => {
    setPreviewUrl(null);
    setError(null);
    if (onClear) onClear();
  };

  return (
    <div className={`space-y-[12px] ${className}`}>
      {label && (
        <label className="block text-[13px] font-semibold text-[#25252a]">
          {label}
        </label>
      )}

      {/* Image Preview Box */}
      {previewUrl ? (
        <div className="relative group overflow-hidden border border-[var(--border)] rounded-[14px] bg-[#fafafa] p-[12px] flex items-center justify-between">
          <div className="flex items-center gap-[14px]">
            <img
              src={previewUrl}
              alt="Uploaded preview"
              className="w-[64px] h-[64px] object-cover rounded-[10px] border border-[var(--border)] shrink-0"
            />
            <div className="overflow-hidden">
              <span className="text-[12px] font-semibold text-[#25252a] block truncate max-w-[260px]">
                {previewUrl.split("/").pop()}
              </span>
              <span className="text-[11px] text-[#8c8c93]">Uploaded to {bucket}</span>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClearImage}
            className="px-[12px] py-[6px] text-[12px] font-semibold text-[#e11d48] border border-[#fecdd3] rounded-[8px] bg-white hover:bg-[#fff1f2] transition-colors"
          >
            Remove
          </button>
        </div>
      ) : (
        /* Upload Area */
        <label className="border-2 border-dashed border-[#d4d4d7] hover:border-black rounded-[14px] bg-white p-[24px] flex flex-col items-center justify-center cursor-pointer transition-colors text-center">
          <input
            type="file"
            accept=".jpg,.jpeg,.png,.webp"
            onChange={handleFileChange}
            disabled={isUploading}
            className="hidden"
          />
          <div className="w-[42px] h-[42px] rounded-full bg-[#fafafa] border border-[var(--border)] flex items-center justify-center text-[#111111] font-bold text-[18px] mb-[10px]">
            ↑
          </div>
          <span className="text-[13px] font-semibold text-[#25252a]">
            {isUploading ? "Uploading..." : "Click to select image"}
          </span>
          <span className="text-[11px] text-[#9999a0] mt-[4px]">
            JPG, PNG, or WEBP · Max 5MB
          </span>

          {/* Progress Bar */}
          {isUploading && uploadProgress !== null && (
            <div className="w-full max-w-[200px] h-[4px] bg-[#e8e8ea] rounded-full mt-[12px] overflow-hidden">
              <div
                className="h-full bg-[#111111] transition-all duration-200"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          )}
        </label>
      )}

      {/* Error Message Display */}
      {error && (
        <p className="text-[12px] text-[#e11d48] font-medium mt-[6px]">
          ⚠️ {error}
        </p>
      )}
    </div>
  );
};
