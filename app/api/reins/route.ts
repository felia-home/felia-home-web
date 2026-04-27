// app/api/reins/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const memberId = (session.user as any).id;
  const searchParams = request.nextUrl.searchParams;

  const adminUrl = new URL(`${process.env.ADMIN_API_URL}/api/hp/reins`);
  adminUrl.searchParams.set("member_id", memberId);

  // クエリパラメータを転送
  ["area", "source_type", "price_min", "price_max", "q", "page", "limit"].forEach((key) => {
    const val = searchParams.get(key);
    if (val) adminUrl.searchParams.set(key, val);
  });

  try {
    const res = await fetch(adminUrl.toString(), { cache: "no-store" });
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ properties: [], total: 0 }, { status: 500 });
  }
}
