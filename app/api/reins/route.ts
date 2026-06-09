// app/api/reins/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  const hasSession = !!session?.user;

  // [REINS-DEBUG] 一時調査ログ（原因確定後に必ず撤去する）
  // 個人情報（メール/氏名/電話/会員ID等）は出力しない。
  console.log("[REINS-DEBUG] enter", {
    hasSession,
    q: request.nextUrl.searchParams.get("q"),
    area: request.nextUrl.searchParams.get("area"),
    source_type: request.nextUrl.searchParams.get("source_type"),
    page: request.nextUrl.searchParams.get("page"),
    limit: request.nextUrl.searchParams.get("limit"),
  });
  // [REINS-DEBUG] /enter

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

    // [REINS-DEBUG] 一時調査ログ（原因確定後に必ず撤去する）
    // 個人情報は出力しない。出力するのは件数・キー名・status のみ。
    const propsArr: unknown =
      data && typeof data === "object" ? (data as Record<string, unknown>).properties : null;
    const total =
      data && typeof data === "object" ? (data as Record<string, unknown>).total : null;
    console.log("[REINS-DEBUG] resp", {
      adminUrl: adminUrl.toString(),
      adminStatus: res.status,
      ok: res.ok,
      keys: data && typeof data === "object" ? Object.keys(data) : null,
      count: Array.isArray(propsArr) ? propsArr.length : null,
      total,
    });
    // [REINS-DEBUG] /resp

    return NextResponse.json(data);
  } catch (e) {
    // [REINS-DEBUG] 一時調査ログ
    console.log("[REINS-DEBUG] error", {
      adminUrl: adminUrl.toString(),
      error: e instanceof Error ? e.message : String(e),
    });
    // [REINS-DEBUG] /error
    return NextResponse.json({ properties: [], total: 0 }, { status: 500 });
  }
}
