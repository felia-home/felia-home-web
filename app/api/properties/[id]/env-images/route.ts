// app/api/properties/[id]/env-images/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const res = await fetch(
      `${process.env.ADMIN_API_URL}/api/properties/${params.id}/env-images`,
      { cache: "no-store" }
    );
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ images: [] });
  }
}
