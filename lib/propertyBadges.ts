// lib/propertyBadges.ts
// 物件カードのバッジ表示用ヘルパー

/**
 * 掲載日が直近14日以内なら NEW と判定。
 */
export function isNewProperty(publishedAt?: string | Date | null): boolean {
  if (!publishedAt) return false;
  const published = new Date(publishedAt);
  if (isNaN(published.getTime())) return false;
  const now = new Date();
  const diffDays = (now.getTime() - published.getTime()) / (1000 * 60 * 60 * 24);
  return diffDays <= 14;
}

/**
 * 価格改定の判定。
 * - price_revised フラグが true ならそのまま価格改定扱い
 * - price_changed_at が直近30日以内なら価格改定扱い
 */
export function isPriceRevised(
  priceChangedAt?: string | Date | null,
  priceRevised?: boolean | null
): boolean {
  if (priceRevised) return true;
  if (!priceChangedAt) return false;
  const changed = new Date(priceChangedAt);
  if (isNaN(changed.getTime())) return false;
  const now = new Date();
  const diffDays = (now.getTime() - changed.getTime()) / (1000 * 60 * 60 * 24);
  return diffDays <= 30;
}
