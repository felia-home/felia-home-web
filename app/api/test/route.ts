import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const adminUrl = process.env.ADMIN_API_URL;

  let apiResult = null;
  let apiError = null;

  try {
    const res = await fetch(`${adminUrl}/api/properties?status=PUBLISHED&limit=2`, {
      cache: "no-store",
    });
    const data = await res.json();
    apiResult = {
      status: res.status,
      count: data.properties?.length,
      total: data.total,
      firstId: data.properties?.[0]?.id,
    };
  } catch (e: unknown) {
    apiError = e instanceof Error ? e.message : String(e);
  }

  return NextResponse.json({
    ADMIN_API_URL: adminUrl,
    apiResult,
    apiError,
  });
}
