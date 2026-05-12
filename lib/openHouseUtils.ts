// lib/openHouseUtils.ts
// 現地販売会の日付計算と表示用ヘルパー

const WEEKDAYS_JP = ["日", "月", "火", "水", "木", "金", "土"];

/**
 * 今週の月曜日を返す（日本時間基準）
 * 日曜日の場合は前週月曜日を返す
 */
export function getThisMonday(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * 月の最終日を返す
 */
export function getLastDayOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

/**
 * 現地販売会の表示日付範囲を計算する
 * @returns null の場合は表示しない（終了済み or 不正な日付）
 */
export function calcDisplayDateRange(
  startDateStr: string | null | undefined,
  endDateStr: string | null | undefined
): { from: Date; to: Date } | null {
  if (!startDateStr || !endDateStr) return null;
  const startDate = new Date(startDateStr);
  const endDate = new Date(endDateStr);
  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) return null;
  startDate.setHours(0, 0, 0, 0);
  endDate.setHours(0, 0, 0, 0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // 終了済み → 非表示
  if (today > endDate) return null;

  // 開催前 → 元の開始日〜終了日をそのまま表示
  if (today < startDate) {
    return { from: startDate, to: endDate };
  }

  // 開催中 → 動的計算
  const monday = getThisMonday(today);
  const firstOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastOfMonth = getLastDayOfMonth(today);

  const from = new Date(
    Math.max(monday.getTime(), firstOfMonth.getTime(), startDate.getTime())
  );
  const to = new Date(Math.min(lastOfMonth.getTime(), endDate.getTime()));

  return { from, to };
}

/**
 * 日付を「M月D日(曜)」形式でフォーマット
 */
export function formatDateJP(date: Date): string {
  const m = date.getMonth() + 1;
  const d = date.getDate();
  const w = WEEKDAYS_JP[date.getDay()];
  return `${m}月${d}日(${w})`;
}
