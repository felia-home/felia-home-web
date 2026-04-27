// app/api/reins/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const memberId = (session.user as any).id;

  try {
    const res = await fetch(
      `${process.env.ADMIN_API_URL}/api/hp/reins?member_id=${memberId}`,
      { cache: "no-store" }
    );
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ properties: [], total: 0 }, { status: 500 });
  }
}
