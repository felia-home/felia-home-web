// app/api/private-properties/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const ADMIN_API_URL = process.env.ADMIN_API_URL ?? "http://localhost:3001";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  // Check for token-based access
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  if (!session?.user && !token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // If token provided, verify it
  if (!session?.user && token) {
    const verifyRes = await fetch(
      `${ADMIN_API_URL}/api/private-selection/verify-token`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      }
    );
    if (!verifyRes.ok) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
  }

  try {
    const res = await fetch(
      `${ADMIN_API_URL}/api/private-properties?filter=ACTIVE`,
      { cache: "no-store" }
    );
    if (!res.ok) {
      return NextResponse.json({ error: "Failed to fetch" }, { status: res.status });
    }
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
