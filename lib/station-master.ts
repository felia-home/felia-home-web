// ─────────────────────────────────────────────────────────────────
// HP 用 沿線駅マスタ ─ 逆引き API
//
// 役割:
//   - 物件詳細で「駅 → その駅を通る全沿線」を表示するために使用
//   - 沿線検索（line=）で「沿線 → 全駅」→ 物件の station_name と突合し
//     ヒット拡張するために使用
//
// データ源:
//   ./station-master-data.ts （admin 側 STATION_CODE_TABLE の同一コピー）
//
// 規約:
//   - 駅名は完全一致のみ突合（過剰拡張防止のため部分一致しない）
//   - 突合キー正規化: NFKC + 空白除去 + 「ヶ↔ケ」「ヵ↔カ」吸収
//   - 突合は code フィールド不要・line+station のみ
// ─────────────────────────────────────────────────────────────────

import { STATION_CODE_TABLE } from "./station-master-data";

/** 軽度の表記揺れ吸収（admin 側と同一規約）:
 *   - 「ヶ」↔「ケ」
 *   - 「ヵ」↔「カ」
 */
function softenChars(s: string): string {
  return s.replace(/[ヶ]/g, "ケ").replace(/[ヵ]/g, "カ");
}

/** 突合用の正規化（NFKC + 全角/半角空白除去 + 揺れ吸収）。
 *  破壊的変換はしないので表示には使わない。 */
function normalizeKey(s: string): string {
  return softenChars((s ?? "").normalize("NFKC").replace(/[\s　]+/g, ""));
}

/** 駅名 → 「その駅を通る全沿線」のリスト（重複排除・原表記）。
 *  完全一致のみ（部分一致しない）。 */
export function getLinesByStation(stationName: string): string[] {
  const key = normalizeKey(stationName);
  if (!key) return [];
  const seen = new Set<string>();
  const out: string[] = [];
  for (const e of STATION_CODE_TABLE) {
    if (normalizeKey(e.station) === key) {
      if (!seen.has(e.line)) {
        seen.add(e.line);
        out.push(e.line);
      }
    }
  }
  return out;
}

/** 沿線名 → 「その沿線が通る全駅」のリスト（重複排除・原表記）。
 *  検索ヒット拡張用: 検索された沿線の全駅を物件の station_name と突合する。 */
export function getStationsByLine(lineName: string): string[] {
  const key = normalizeKey(lineName);
  if (!key) return [];
  const seen = new Set<string>();
  const out: string[] = [];
  for (const e of STATION_CODE_TABLE) {
    if (normalizeKey(e.line) === key) {
      const st = e.station ?? "";
      if (!st) continue;
      if (!seen.has(st)) {
        seen.add(st);
        out.push(st);
      }
    }
  }
  return out;
}

/** 正規化済の駅名（外部から突合用に使えるよう公開） */
export function normalizeStationName(s: string): string {
  return normalizeKey(s);
}
