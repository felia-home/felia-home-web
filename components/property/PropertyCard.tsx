// components/property/PropertyCard.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { MapPin, Train, Maximize2, LayoutGrid } from "lucide-react";
import type { Property } from "@/lib/api";

interface PropertyCardProps {
  property: Property;
  size?: "normal" | "large";  // large: Felia Selection用
}

export function PropertyCard({ property, size = "normal" }: PropertyCardProps) {
  const [imgError, setImgError] = useState(false);
  const isLarge = size === "large";

  return (
    <Link
      href={`/properties/${property.id}`}
      className="group block bg-white rounded-lg overflow-hidden border hover:shadow-lg transition-shadow duration-300"
      style={{ borderColor: "#E5E5E5" }}
    >
      {/* 画像エリア */}
      <div
        className="relative overflow-hidden bg-gray-100"
        style={{ paddingBottom: isLarge ? "62%" : "68%" }}
      >
        {/* バッジ群 */}
        <div className="absolute top-2.5 left-2.5 z-10 flex flex-wrap gap-1.5">
          {property.isNew && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded text-white"
              style={{ backgroundColor: "#5BAD52" }}>
              NEW
            </span>
          )}
          {property.isFeatured && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded text-white"
              style={{ backgroundColor: "#E67E22" }}>
              厳選
            </span>
          )}
          {property.isOpenHouse && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded text-white"
              style={{ backgroundColor: "#E74C3C" }}>
              現地販売会
            </span>
          )}
          {property.isMembersOnly && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded text-white bg-gray-600">
              会員限定
            </span>
          )}
        </div>

        {/* 物件種別バッジ（右上） */}
        <div className="absolute top-2.5 right-2.5 z-10">
          <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-white/90 text-gray-600">
            {property.propertyType}
          </span>
        </div>

        {/* 写真 */}
        {!imgError && property.mainImage ? (
          <Image
            src={property.mainImage}
            alt={property.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes={isLarge
              ? "(max-width: 768px) 100vw, 50vw"
              : "(max-width: 768px) 50vw, 25vw"}
            onError={() => setImgError(true)}
          />
        ) : (
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ background: "linear-gradient(135deg,#e8f5e8,#c8e8c8)" }}
          >
            <span className="text-gray-400 text-xs">画像なし</span>
          </div>
        )}
      </div>

      {/* 情報エリア */}
      <div className={`p-3 ${isLarge ? "tb:p-5" : ""}`}>
        {/* 価格 */}
        <div className="flex items-baseline gap-1 mb-1.5">
          <span
            className={`font-bold ${isLarge ? "text-2xl tb:text-3xl" : "text-xl"}`}
            style={{ color: "#5BAD52" }}
          >
            {property.price != null
              ? property.price.toLocaleString()
              : (property as any).salesPrice != null
              ? (property as any).salesPrice.toLocaleString()
              : "価格未定"}
          </span>
          {(property.price != null || (property as any).salesPrice != null) && (
            <span className="text-sm text-gray-500">万円</span>
          )}
        </div>

        {/* 物件名 */}
        <p className={`font-medium text-gray-700 leading-snug mb-2
          ${isLarge ? "text-base tb:text-lg" : "text-sm"}
          line-clamp-2`}>
          {property.name}
        </p>

        {/* 詳細情報 */}
        <div className="space-y-1">
          {/* 所在地 */}
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <MapPin size={11} className="flex-shrink-0" style={{ color: "#5BAD52" }} />
            <span className="truncate">{property.address}</span>
          </div>

          {/* 最寄駅 */}
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Train size={11} className="flex-shrink-0" style={{ color: "#5BAD52" }} />
            <span className="truncate">
              {property.nearestStation} 徒歩{property.walkMinutes}分
            </span>
          </div>

          {/* 面積・間取り */}
          <div className="flex items-center gap-3 text-xs text-gray-500">
            {property.area > 0 && (
              <span className="flex items-center gap-1">
                <Maximize2 size={10} style={{ color: "#5BAD52" }} />
                {property.area}㎡
              </span>
            )}
            {property.layout && (
              <span className="flex items-center gap-1">
                <LayoutGrid size={10} style={{ color: "#5BAD52" }} />
                {property.layout}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

// default export for backward compat with feature/[slug]/page.tsx
export default PropertyCard;
export type { Property };
