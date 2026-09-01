import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function analyzeEnvVar(name: string) {
  const val = process.env[name];
  if (!val) {
    return {
      present: false,
      length: 0,
      preview: "none",
      containsPlaceholder: false,
    };
  }
  const trimmed = val.trim();
  const len = trimmed.length;
  let preview = "too short";
  if (len > 8) {
    preview = `${trimmed.slice(0, 4)}...${trimmed.slice(-4)}`;
  } else if (len > 0) {
    preview = `${trimmed.slice(0, 1)}...${trimmed.slice(-1)}`;
  }
  return {
    present: len > 0,
    length: len,
    preview,
    containsPlaceholder: trimmed.toLowerCase().includes("placeholder"),
  };
}

export async function GET() {
  const targetVars = [
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    "SUPABASE_SERVICE_ROLE_KEY",
    "RESEND_API_KEY",
    "ADMIN_PASSWORD",
  ];

  const variables: Record<string, ReturnType<typeof analyzeEnvVar>> = {};
  for (const name of targetVars) {
    variables[name] = analyzeEnvVar(name);
  }

  return NextResponse.json({
    timestamp: new Date().toISOString(),
    vercelEnv: process.env.VERCEL_ENV || "not-set",
    commitSha: process.env.VERCEL_GIT_COMMIT_SHA || "not-set",
    nodeEnv: process.env.NODE_ENV || "not-set",
    variables,
  });
}
