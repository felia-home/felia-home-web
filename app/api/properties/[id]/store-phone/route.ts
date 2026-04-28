// app/api/properties/[id]/store-phone/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 物件情報から store_id を取得
    const propRes = await fetch(
      `${process.env.ADMIN_API_URL}/api/properties/${params.id}`,
      { cache: "no-store" }
    );
    const propData = await propRes.json();
    const property = propData.property ?? propData;
    const storeId = property.store_id ?? property.store?.id ?? null;

    if (!storeId) {
      return NextResponse.json({ phone: null });
    }

    // 本店情報
    const companyRes = await fetch(
      `${process.env.ADMIN_API_URL}/api/hp/company`,
      { cache: "no-store" }
    );
    const companyData = await companyRes.json();

    // 支店一覧
    const branchRes = await fetch(
      `${process.env.ADMIN_API_URL}/api/hp/company-branches`,
      { cache: "no-store" }
    );
    const branchData = await branchRes.json();
    const branches = branchData.branches ?? [];

    // storeIdで支店をマッチ、なければ本店電話番号
    const matchedBranch = branches.find(
      (b: any) => b.id === storeId || b.store_id === storeId
    );

    const phone = matchedBranch?.phone ?? companyData.company?.phone ?? null;

    return NextResponse.json({ phone });
  } catch {
    return NextResponse.json({ phone: null });
  }
}
