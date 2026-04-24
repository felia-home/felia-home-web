// app/api/member/inquiry/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const memberId = (session.user as any).id;

  try {
    const res = await fetch(
      `${process.env.ADMIN_API_URL}/api/members/inquiries`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          property_no: body.property_no,
          member_id: memberId,
          type: "DOCUMENT",
        }),
        cache: "no-store",
      }
    );
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const memberId = (session.user as any).id;

  try {
    const res = await fetch(
      `${process.env.ADMIN_API_URL}/api/members/inquiries?member_id=${memberId}`,
      { cache: "no-store" }
    );
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ inquiries: [] }, { status: 500 });
  }
}
