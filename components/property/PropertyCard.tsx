// components/property/PropertyCard.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Train } from "lucide-react";
import type { Property } from "@/lib/api";

interface Props {
  property: Property;
  size?: "normal" | "large";
}

const PROPERTY_TYPE_LABELS: Record<string, string> = {
  LAND: "土地",
  USED_HOUSE: "中古戸建",
  NEW_HOUSE: "新築戸建",
  MANSION: "マンション",
  USED_MANSION: "中古マンション",
  NEW_MANSION: "新築マンション",
};

function buildFallbackTitle(property: Property): string {
  const p = property as any;
  const parts: string[] = [];
  if (p.city) parts.push(p.city);
  if (p.town) parts.push(p.town);
  if (p.chome) parts.push(`${p.chome}丁目`);
  const typeLabel = PROPERTY_TYPE_LABELS[p.property_type ?? ""];
  if (typeLabel) parts.push(typeLabel);
  if (p.building_name) parts.push(p.building_name);
  else if (p.block_number) parts.push(p.block_number);
  return parts.join(" ") || "物件詳細";
}

const BADGE_COLORS: Record<string, string> = {
  new: "#2563EB",
  felia: "#1a4a24",
  openhouse: "#E67E22",
  member: "#525252",
};

export function PropertyCard({ property, size = "normal" }: Props) {
  const [imgError, setImgError] = useState(false);
  const isLarge = size === "large";

  const mainImage =
    property.images?.find((img) => img.is_main)?.url ??
    property.images?.[0]?.url ??
    null;

  const displayTitle = property.title || buildFallbackTitle(property);

  const typeLabel =
    PROPERTY_TYPE_LABELS[property.property_type ?? ""] ?? "";
  const location = [property.city, property.town].filter(Boolean).join("");

  const isMansion =
    property.property_type === "MANSION" ||
    property.property_type === "NEW_MANSION";
  const buildingName = (property as any).building_name as string | null | undefined;
  const showBuildingName = isMansion && !!buildingName;

  const isNew = (property as any).is_new ?? false;
  const isFeliaSel = (property as any).is_felia_selection ?? false;
  const isOpenHouse = (property as any).is_open_house ?? false;
  const isMember = (property as any).is_member_only ?? false;

  return (
    <Link href={`/properties/${property.id}`} className="property-card">
      {/* 画像エリア */}
      <div
        className="property-card-img-wrap"
        style={{ aspectRatio: isLarge ? "16/9" : "4/3" }}
      >
        {mainImage && !imgError ? (
          <Image
            src={mainImage}
            alt={displayTitle}
            fill
            className="property-card-img"
            sizes={
              isLarge
                ? "(max-width: 768px) 100vw, 50vw"
                : "(max-width: 768px) 50vw, 33vw"
            }
            onError={() => setImgError(true)}
          />
        ) : (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#aaa",
              fontSize: "12px",
              flexDirection: "column",
              gap: "8px",
            }}
          >
            <span style={{ fontSize: "32px" }}>🏠</span>
            <span>画像準備中</span>
          </div>
        )}

        {/* 左上バッジ群 */}
        <div
          style={{
            position: "absolute",
            top: "10px",
            left: "10px",
            zIndex: 10,
            display: "flex",
            flexWrap: "wrap",
            gap: "4px",
          }}
        >
          {isNew && (
            <span
              style={{
                fontSize: "10px",
                fontWeight: "bold",
                padding: "2px 8px",
                borderRadius: "4px",
                color: "#fff",
                backgroundColor: BADGE_COLORS.new,
              }}
            >
              NEW
            </span>
          )}
          {isFeliaSel && (
            <span
              style={{
                fontSize: "10px",
                fontWeight: "bold",
                padding: "2px 8px",
                borderRadius: "4px",
                color: "#C9A84C",
                backgroundColor: BADGE_COLORS.felia,
              }}
            >
              厳選
            </span>
          )}
          {isOpenHouse && (
            <span
              style={{
                fontSize: "10px",
                fontWeight: "bold",
                padding: "2px 8px",
                borderRadius: "4px",
                color: "#fff",
                backgroundColor: BADGE_COLORS.openhouse,
              }}
            >
              現地販売会
            </span>
          )}
          {isMember && (
            <span
              style={{
                fontSize: "10px",
                fontWeight: "bold",
                padding: "2px 8px",
                borderRadius: "4px",
                color: "#fff",
                backgroundColor: BADGE_COLORS.member,
              }}
            >
              会員限定
            </span>
          )}
        </div>

        {/* 右上：物件種別バッジ */}
        {typeLabel && (
          <div
            style={{
              position: "absolute",
              top: "10px",
              right: "10px",
              zIndex: 10,
            }}
          >
            <span
              style={{
                fontSize: "10px",
                fontWeight: "500",
                padding: "2px 8px",
                borderRadius: "4px",
                backgroundColor: "rgba(255,255,255,0.9)",
                color: "#555",
              }}
            >
              {typeLabel}
            </span>
          </div>
        )}
      </div>

      {/* 情報エリア */}
      <div className={`property-card-info${isLarge ? "--large" : ""}`}>
        {/* 価格 */}
        {property.price != null && (
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: "4px",
              marginBottom: "6px",
            }}
          >
            <span
              className={`property-card-price${isLarge ? "--large" : ""}`}
              style={{ fontWeight: "bold", color: "#5BAD52", lineHeight: 1 }}
            >
              {property.price.toLocaleString()}
            </span>
            <span style={{ fontSize: "13px", color: "#888" }}>万円</span>
          </div>
        )}

        {/* 物件名 */}
        <p
          className={`property-card-title${isLarge ? "--large" : ""}`}
          style={{
            fontWeight: "500",
            color: "#333",
            lineHeight: 1.4,
            marginBottom: "8px",
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
        >
          {displayTitle}
        </p>
        {showBuildingName && (
          <p
            style={{
              fontSize: "13px",
              color: "#555",
              margin: "2px 0 8px",
              fontWeight: 500,
            }}
          >
            {buildingName}
          </p>
        )}

        {/* 詳細情報 */}
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          {location && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
                fontSize: "12px",
                color: "#888",
              }}
            >
              <MapPin size={11} style={{ flexShrink: 0 }} />
              <span
                style={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {location}
              </span>
            </div>
          )}
          {(property as any).station_name1 && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
                fontSize: "12px",
                color: "#888",
              }}
            >
              <Train size={11} style={{ flexShrink: 0 }} />
              <span
                style={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {(property as any).station_name1}駅 徒歩
                {(property as any).station_walk1}分
              </span>
            </div>
          )}
          {((property as any).rooms ||
            (property as any).area_build_m2 ||
            (property as any).area_land_m2) && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                fontSize: "12px",
                color: "#888",
              }}
            >
              {(property as any).rooms && (
                <span>{(property as any).rooms}</span>
              )}
              {(property as any).area_build_m2 && (
                <span>{(property as any).area_build_m2}㎡</span>
              )}
              {!(property as any).area_build_m2 &&
                (property as any).area_land_m2 && (
                  <span>{(property as any).area_land_m2}㎡</span>
                )}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

// default export for backward compat with feature/[slug]/page.tsx
export default PropertyCard;
export type { Property };
