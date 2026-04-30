// app/api/hp/area-columns/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const area = request.nextUrl.searchParams.get("area") ?? "";
  try {
    const res = await fetch(
      `${process.env.ADMIN_API_URL}/api/hp/area-columns?area=${encodeURIComponent(area)}`,
      { cache: "no-store" }
    );
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ columns: [] });
  }
}
