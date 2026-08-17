"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { EyebrowLabel } from "@/components/ui/EyebrowLabel";
import { Button } from "@/components/ui/Button";

function ResetPasswordFormInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams ? searchParams.get("token") || "" : "";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!token) {
      setError("Missing or invalid password reset token.");
      return;
    }

    if (!newPassword || !confirmPassword) {
      setError("Please fill out both password fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/admin/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || "Failed to reset password.");
      }

      setIsSuccess(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Reset failed";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="space-y-[24px] text-center">
        <div className="w-12 h-12 rounded-full bg-[#10b981]/10 text-[#10b981] flex items-center justify-center text-xl font-bold mx-auto">
          ✓
        </div>
        <div>
          <h2 className="text-[22px] font-bold text-[#25252a] mb-2">
            Password Reset Complete!
          </h2>
          <p className="text-[#8c8c93] text-[14px]">
            Your admin password has been updated successfully.
          </p>
        </div>
        <Button
          variant="filled"
          onClick={() => router.push("/admin/login")}
          className="w-full h-[52px] justify-center text-[15px]"
        >
          Proceed to Login
        </Button>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="text-center space-y-[20px]">
        <div className="p-[16px] bg-[#fef2f2] border border-[#fecdd3] rounded-[12px] text-[#991b1b] text-[14px]">
          ⚠️ Invalid or missing password reset token. Please request a new recovery link.
        </div>
        <Link
          href="/admin/forgot-password"
          className="text-[14px] font-semibold text-[#111111] hover:underline block"
        >
          ← Request New Recovery Link
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-[20px]">
      <div>
        <label
          htmlFor="newPassword"
          className="block text-[13px] font-semibold text-[#25252a] mb-[8px]"
        >
          New Password
        </label>
        <input
          id="newPassword"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="••••••••••••"
          required
          className="w-full h-[52px] px-[16px] border border-[var(--border)] rounded-[12px] bg-[#fafafa] text-[#25252a] text-[15px] focus:outline-none focus:border-black transition-colors"
        />
      </div>

      <div>
        <label
          htmlFor="confirmPassword"
          className="block text-[13px] font-semibold text-[#25252a] mb-[8px]"
        >
          Confirm New Password
        </label>
        <input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="••••••••••••"
          required
          className="w-full h-[52px] px-[16px] border border-[var(--border)] rounded-[12px] bg-[#fafafa] text-[#25252a] text-[15px] focus:outline-none focus:border-black transition-colors"
        />
      </div>

      {error && (
        <p className="text-[13px] text-[#e11d48] font-medium m-0">
          ⚠️ {error}
        </p>
      )}

      <Button
        variant="filled"
        type="submit"
        disabled={isLoading}
        className="w-full h-[52px] justify-center text-[15px]"
      >
        {isLoading ? "Updating Password..." : "Set New Admin Password"}
      </Button>
    </form>
  );
}

export default function AdminResetPasswordPage() {
  return (
    <main className="min-h-screen bg-[#fafafa] flex items-center justify-center p-[24px]">
      <div className="w-full max-w-[440px] bg-white border border-[var(--border)] rounded-[var(--radius-lg)] p-[48px_36px] shadow-sm max-sm:p-[32px_20px]">
        <EyebrowLabel className="mb-[20px] mx-auto flex w-max">
          Horode Studio Admin
        </EyebrowLabel>

        <h1 className="text-center text-[26px] font-bold text-[#25252a] m-0 mb-[8px]">
          Reset Password
        </h1>
        <p className="text-center text-[#8c8c93] text-[14px] m-0 mb-[32px]">
          Enter your new admin password below.
        </p>

        <Suspense
          fallback={
            <div className="animate-pulse space-y-4">
              <div className="h-12 bg-gray-100 rounded-lg"></div>
              <div className="h-12 bg-gray-100 rounded-lg"></div>
            </div>
          }
        >
          <ResetPasswordFormInner />
        </Suspense>
      </div>
    </main>
  );
}
