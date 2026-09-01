"use client";

import React, { useState } from "react";
import Link from "next/link";
import { EyebrowLabel } from "@/components/ui/EyebrowLabel";
import { Button } from "@/components/ui/Button";

export default function AdminForgotPasswordPage() {
  const [email, setEmail] = useState("hello@horodeglobal.com");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [devResetUrl, setDevResetUrl] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setDevResetUrl(null);

    if (!email) {
      setError("Please enter your admin email address.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/admin/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || "Failed to request password reset.");
      }

      setMessage(data.message || "A reset link has been dispatched to your admin email.");
      if (data.devResetUrl) {
        setDevResetUrl(data.devResetUrl);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Request failed";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#fafafa] flex items-center justify-center p-[24px]">
      <div className="w-full max-w-[440px] bg-white border border-[var(--border)] rounded-[var(--radius-lg)] p-[48px_36px] shadow-sm max-sm:p-[32px_20px]">
        <EyebrowLabel className="mb-[20px] mx-auto">
          Admin Portal
        </EyebrowLabel>

        <h1 className="text-center text-[26px] font-bold text-[#25252a] m-0 mb-[8px]">
          Recover Password
        </h1>
        <p className="text-center text-[#8c8c93] text-[14px] m-0 mb-[32px]">
          Enter your admin email to receive a password reset link.
        </p>

        {message ? (
          <div className="space-y-[20px]">
            <div className="p-[16px] bg-[#dcfce7] border border-[#bbf7d0] rounded-[12px] text-[#166534] text-[14px] font-medium leading-relaxed">
              ✓ {message}
            </div>

            {devResetUrl && (
              <div className="p-[14px] bg-[#fef3c7] border border-[#fde68a] rounded-[10px] text-[#92400e] text-[12px]">
                <strong className="block mb-1">Development Reset Link:</strong>
                <a
                  href={devResetUrl}
                  className="font-mono text-[11px] underline break-all block"
                >
                  {devResetUrl}
                </a>
              </div>
            )}

            <div className="pt-2 text-center">
              <Link
                href="/admin/login"
                className="text-[14px] font-semibold text-[#111111] hover:underline"
              >
                ← Return to Admin Login
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-[20px]">
            <div>
              <label
                htmlFor="email"
                className="block text-[13px] font-semibold text-[#25252a] mb-[8px]"
              >
                Admin Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="hello@horodeglobal.com"
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
              {isLoading ? "Sending Link..." : "Send Password Reset Link"}
            </Button>

            <div className="text-center pt-2">
              <Link
                href="/admin/login"
                className="text-[13px] font-semibold text-[#8c8c93] hover:text-black transition-colors"
              >
                ← Back to Login
              </Link>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}
