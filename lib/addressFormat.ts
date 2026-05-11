// lib/addressFormat.ts
// 住所表示の共通ヘルパー。
// address_display_level === 'town' の場合は address（番地・枝番）を非表示にする。

export interface AddressFields {
  city?: string | null;
  town?: string | null;
  address?: string | null;
  address_display_level?: string | null;
}

/**
 * 物件の住所表示文字列を生成する。
 * - address_display_level === "town" の場合: city + town のみ
 * - それ以外: city + town + address
 */
export function formatLocation(p: AddressFields): string {
  const parts: string[] = [];
  if (p.city) parts.push(p.city);
  if (p.town) parts.push(p.town);
  if (p.address_display_level !== "town" && p.address) {
    parts.push(p.address);
  }
  return parts.join("");
}
