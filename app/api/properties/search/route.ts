import { NextRequest, NextResponse } from "next/server";
import { getStationsByLine, normalizeStationName } from "@/lib/station-master";

// ─────────────────────────────────────────────────────────────────
// HP 物件検索プロキシ
//
//   - admin の /api/properties?published_hp=true... へ転送するのが基本
//   - line= が指定された場合、admin の station_line1/2/3 contains 突合
//     だけでなく、駅マスタ逆引きで「その沿線を通る全駅」を station_name で
//     持つ物件もヒット拡張する
//     例: 池袋(山手線で登録) の物件 → 丸ノ内線 検索でもヒット
//   - 拡張時は admin に同パラメータで 2 回呼び（1: 直接突合 / 2: line= 抜きで広域）、
//     広域側を駅マスタの該当駅リストで JS フィルタしてマージ・重複排除
//   - 拡張に該当しない line（マスタ未収録）は従来通り直接突合のみ
// ─────────────────────────────────────────────────────────────────

const BROAD_LIMIT = 500;   // line=拡張時に admin からまとめて取得する上限

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const adminBase = `${process.env.ADMIN_API_URL}/api/properties`;
  const line = searchParams.get("line") ?? "";

  // ───── 拡張対象でない場合: 従来どおりそのまま転送 ─────
  if (!line) {
    return passthrough(adminBase, searchParams);
  }

  // ───── 沿線マスタから駅リストを取得（完全一致のみ） ─────
  const stations = getStationsByLine(line);
  if (stations.length === 0) {
    // マスタ未収録 → 従来どおり直接突合のみ
    return passthrough(adminBase, searchParams);
  }

  try {
    // ── (1) 直接突合: 既存どおり line= を admin に投げる ──
    const directUrl = new URL(adminBase);
    directUrl.searchParams.set("published_hp", "true");
    searchParams.forEach((v, k) => directUrl.searchParams.set(k, v));
    const directRes = await fetch(directUrl.toString(), { cache: "no-store" });
    const directData = directRes.ok ? await directRes.json() : { properties: [] };
    const directProps: any[] = Array.isArray(directData.properties) ? directData.properties : [];

    // ── (2) 広域取得: 同条件で line= を外して取得 → station_name 突合で拡張 ──
    const broadUrl = new URL(adminBase);
    broadUrl.searchParams.set("published_hp", "true");
    searchParams.forEach((v, k) => { if (k !== "line") broadUrl.searchParams.set(k, v); });
    // 既存の limit より大きい広域上限を強制（指定 limit が大きい場合はそのまま）
    const userLimit = Number(searchParams.get("limit") ?? "");
    if (!Number.isFinite(userLimit) || userLimit < BROAD_LIMIT) {
      broadUrl.searchParams.set("limit", String(BROAD_LIMIT));
    }
    const broadRes = await fetch(broadUrl.toString(), { cache: "no-store" });
    const broadData = broadRes.ok ? await broadRes.json() : { properties: [] };
    const broadProps: any[] = Array.isArray(broadData.properties) ? broadData.properties : [];

    // 駅名 → 正規化済 Set（突合は IN 相当・N+1 なし）
    const stationSet = new Set(stations.map(normalizeStationName));

    // 広域側から「station_name のいずれかが沿線の駅に一致」する物件を抽出
    const stationMatches = broadProps.filter((p) => {
      const ns = [p?.station_name1, p?.station_name2, p?.station_name3]
        .filter(Boolean)
        .map((s: any) => normalizeStationName(String(s)));
      return ns.some((n) => stationSet.has(n));
    });

    // ── (3) マージ & 重複排除（id ベース） ──
    const seen = new Set<string>();
    const merged: any[] = [];
    for (const arr of [directProps, stationMatches]) {
      for (const p of arr) {
        const id = p?.id ?? p?._id ?? "";
        if (!id || seen.has(id)) continue;
        seen.add(id);
        merged.push(p);
      }
    }

    return NextResponse.json({
      properties: merged,
      total:       merged.length,
      total_pages: 1,
      // デバッグ補助（クライアントは無視可）
      _line_expansion: {
        line,
        station_count:    stations.length,
        direct_count:     directProps.length,
        station_match_count: stationMatches.length,
        merged_count:     merged.length,
      },
    });
  } catch {
    return NextResponse.json({ properties: [], total: 0, total_pages: 0 }, { status: 500 });
  }
}

async function passthrough(adminBase: string, searchParams: URLSearchParams) {
  const adminUrl = new URL(adminBase);
  adminUrl.searchParams.set("published_hp", "true");
  searchParams.forEach((value, key) => adminUrl.searchParams.set(key, value));
  try {
    const res = await fetch(adminUrl.toString(), { cache: "no-store" });
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ properties: [], total: 0, total_pages: 0 }, { status: 500 });
  }
}
