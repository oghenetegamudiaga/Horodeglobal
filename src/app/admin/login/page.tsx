"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { EyebrowLabel } from "@/components/ui/EyebrowLabel";
import { Button } from "@/components/ui/Button";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!password) {
      setError("Please enter your admin password.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || "Login failed");
      }

      router.push("/admin");
      router.refresh();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Invalid credentials";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#fafafa] flex items-center justify-center p-[24px]">
      <div className="w-full max-w-[440px] bg-white border border-[var(--border)] rounded-[var(--radius-lg)] p-[48px_36px] shadow-sm max-sm:p-[32px_20px]">
        <EyebrowLabel className="mb-[20px] mx-auto flex w-max">
          Horode Studio Admin
        </EyebrowLabel>

        <h1 className="text-center text-[28px] font-bold text-[#25252a] m-0 mb-[8px]">
          Dashboard Access
        </h1>
        <p className="text-center text-[#8c8c93] text-[14px] m-0 mb-[32px]">
          Enter your admin password to manage Services, Works, and Blog articles.
        </p>

        <form onSubmit={handleSubmit} className="space-y-[20px]">
          <div>
            <div className="flex items-center justify-between mb-[8px]">
              <label
                htmlFor="password"
                className="block text-[13px] font-semibold text-[#25252a]"
              >
                Admin Password
              </label>
              <a
                href="/admin/forgot-password"
                className="text-[12px] font-semibold text-[#8c8c93] hover:text-black transition-colors"
              >
                Forgot password?
              </a>
            </div>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
            {isLoading ? "Authenticating..." : "Log In to Dashboard"}
          </Button>
        </form>
      </div>
    </main>
  );
}
