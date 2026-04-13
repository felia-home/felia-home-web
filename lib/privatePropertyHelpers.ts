// lib/privatePropertyHelpers.ts
import type { PrivateProperty } from "@/lib/api";

// 物件種別の表示テキスト
export function getPropertyTypeLabel(p: PrivateProperty): string {
  if (p.property_type) return p.property_type;
  if (p.is_mansion) return "マンション";
  if (p.is_house)   return "戸建て";
  if (p.is_land)    return "土地";
  return "物件";
}

// 表示用タイトル（物件番号 + 種別 + エリア）
export function getPropertyTitle(p: PrivateProperty): string {
  const type = getPropertyTypeLabel(p);
  const location = [p.area, p.town].filter(Boolean).join(" ");
  return location ? `${location} ${type}` : `${type}（${p.property_no}）`;
}

// 価格の表示テキスト
export function getPriceDisplay(p: PrivateProperty): string {
  if (p.price_display) return p.price_display;
  if (p.price)         return `${p.price.toLocaleString()}万円`;
  return "価格応相談";
}

// 面積の表示テキスト
export function getAreaDisplay(p: PrivateProperty): string {
  const parts: string[] = [];
  if (p.area_land_m2)  parts.push(`土地 ${p.area_land_m2}㎡`);
  if (p.area_build_m2) parts.push(`建物 ${p.area_build_m2}㎡`);
  return parts.join(" / ") || "—";
}

// カードグラデーション（種別ごとに変える）
export function getCardGradient(p: PrivateProperty): string {
  if (p.is_mansion) return "linear-gradient(135deg, #0A1A2F 0%, #0D2040 100%)";
  if (p.is_house)   return "linear-gradient(135deg, #0A1A0F 0%, #0D2818 100%)";
  if (p.is_land)    return "linear-gradient(135deg, #1A140A 0%, #2A1E0D 100%)";
  return "linear-gradient(135deg, #0A1A0F 0%, #0D2818 100%)";
}
