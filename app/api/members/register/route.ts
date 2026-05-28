// app/api/members/register/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const {
      email,
      password,
      name,
      name_kana,
      phone,
      desired_property_type = [],
      desired_areas         = [],
      desired_stations      = [],
      desired_budget_min,
      desired_budget_max,
      desired_rooms         = [],
      desired_move_timing,
      desired_features      = [],
      desired_note,
    } = await req.json();

    const payload = {
      email,
      password,
      name,
      name_kana,
      phone,
      desired_property_type: desired_property_type ?? [],
      desired_areas:         desired_areas         ?? [],
      desired_stations:      desired_stations      ?? [],
      desired_rooms:         desired_rooms         ?? [],
      desired_features:      desired_features      ?? [],
      desired_budget_min:    desired_budget_min    ?? null,
      desired_budget_max:    desired_budget_max    ?? null,
      desired_move_timing:   desired_move_timing   ?? null,
      desired_note:          desired_note          ?? null,
    };

    const res = await fetch(
      `${process.env.ADMIN_API_URL}/api/members/register`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        cache: "no-store",
      }
    );
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (e) {
    return NextResponse.json({ success: false, message: "サーバーエラー" }, { status: 500 });
  }
}
