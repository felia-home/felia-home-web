// app/api/hp/area-columns/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const adminUrl = new URL(`${process.env.ADMIN_API_URL}/api/hp/area-columns`);

  // area / station / line パラメータを全て転送
  ["area", "station", "line"].forEach((key) => {
    const val = searchParams.get(key);
    if (val) adminUrl.searchParams.set(key, val);
  });

  try {
    const res = await fetch(adminUrl.toString(), { cache: "no-store" });
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ columns: [] });
  }
}
