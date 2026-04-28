// app/api/properties/[id]/store-phone/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const res = await fetch(
      `${process.env.ADMIN_API_URL}/api/properties/${params.id}`,
      { cache: "no-store" }
    );
    const data = await res.json();
    const property = data.property ?? data;

    // 店舗電話番号 → 会社電話番号の優先順
    const phone = property.store?.phone
      ?? property.seller_contact
      ?? null;

    return NextResponse.json({ phone });
  } catch {
    return NextResponse.json({ phone: null });
  }
}
