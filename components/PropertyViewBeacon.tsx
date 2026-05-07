"use client";
import { useEffect } from "react";

/**
 * 物件詳細ページの閲覧を計測するビーコン。
 * マウント時に1回だけ HP-内部の /api/views/property/[id] を POST する。
 * （HP内部APIから admin 側 /api/hp/views/property/[id] へ中継される）
 */
export default function PropertyViewBeacon({ propertyId }: { propertyId: string }) {
  useEffect(() => {
    if (!propertyId) return;
    fetch(`/api/views/property/${propertyId}`, { method: "POST" }).catch(() => {});
  }, [propertyId]);

  return null;
}
