// app/api/favorites/[propertyId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(
  _req: NextRequest,
  { params }: { params: { propertyId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ is_favorite: false });
  const memberId = (session.user as any).id;
  try {
    const res = await fetch(
      `${process.env.ADMIN_API_URL}/api/members/${memberId}/favorites/${params.propertyId}`,
      { cache: "no-store" }
    );
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ is_favorite: false });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { propertyId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const memberId = (session.user as any).id;
  try {
    const res = await fetch(
      `${process.env.ADMIN_API_URL}/api/members/${memberId}/favorites/${params.propertyId}`,
      { method: "DELETE" }
    );
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
