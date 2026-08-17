import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getAdminSession } from "@/lib/session";

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();
    const envPassword = process.env.ADMIN_PASSWORD || "REDACTED";

    if (!password) {
      return NextResponse.json(
        { error: "Password is required" },
        { status: 400 }
      );
    }

    let isValid = false;
    if (envPassword.startsWith("$2a$") || envPassword.startsWith("$2b$")) {
      isValid = await bcrypt.compare(password, envPassword);
    } else {
      isValid = password === envPassword;
    }

    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid admin password" },
        { status: 401 }
      );
    }

    const session = await getAdminSession();
    session.isLoggedIn = true;
    await session.save();

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
