// app/api/views/property/[id]/route.ts — admin への閲覧計測ビーコン中継
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 元クライアントの IP / UA を admin 側に伝搬する（admin の session_key 計算に使われる）
    const xff = req.headers.get("x-forwarded-for") ?? "";
    const realIp = req.headers.get("x-real-ip") ?? "";
    const ua = req.headers.get("user-agent") ?? "";

    const res = await fetch(
      `${process.env.ADMIN_API_URL}/api/hp/views/property/${params.id}`,
      {
        method:  "POST",
        headers: {
          "Content-Type":     "application/json",
          ...(xff    ? { "x-forwarded-for": xff }    : {}),
          ...(realIp ? { "x-real-ip":       realIp } : {}),
          ...(ua     ? { "user-agent":      ua }     : {}),
        },
        cache: "no-store",
      }
    );
    const data = await res.json().catch(() => ({ counted: false }));
    return NextResponse.json(data, { status: 200 });
  } catch {
    return NextResponse.json({ counted: false });
  }
}
