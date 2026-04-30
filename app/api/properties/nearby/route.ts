// app/api/properties/nearby/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const adminUrl = new URL(`${process.env.ADMIN_API_URL}/api/properties/nearby`);
  ["lat", "lng", "limit", "exclude_id", "city"].forEach((k) => {
    const v = searchParams.get(k);
    if (v) adminUrl.searchParams.set(k, v);
  });
  adminUrl.searchParams.set("published_hp", "true");
  try {
    const res = await fetch(adminUrl.toString(), { cache: "no-store" });
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ properties: [] });
  }
}
