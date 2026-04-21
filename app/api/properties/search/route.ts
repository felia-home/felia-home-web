import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const adminUrl = new URL(`${process.env.ADMIN_API_URL}/api/properties`);

  // パラメータをそのまま転送
  searchParams.forEach((value, key) => {
    adminUrl.searchParams.set(key, value);
  });

  try {
    const res = await fetch(adminUrl.toString(), { cache: "no-store" });
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ properties: [], total: 0 }, { status: 500 });
  }
}
