import Link from "next/link";
import {
  getNewProperties,
  getFeaturedProperties,
  getPropertiesByArea,
} from "@/lib/api";
import type { Property } from "@/lib/api";
import { PropertyImage } from "@/components/ui/PropertyImage";
import { formatLocation } from "@/lib/addressFormat";
import LinePropertiesClient from "@/components/property/LinePropertiesClient";

// searchParams を確実に反映するため毎回サーバ実行（ISR キャッシュ無効化）
export const dynamic = "force-dynamic";

const PROPERTY_TYPE_MAP: Record<string, string> = {
  LAND: "土地",
  USED_HOUSE: "中古戸建",
  NEW_HOUSE: "新築戸建",
  MANSION: "マンション",
  NEW_MANSION: "新築マンション",
  OTHER: "その他",
};

interface PageProps {
  searchParams?: {
    flag?: string;
    line?: string;
    area?: string;
    type?: string;
  };
}

export default async function PropertiesPage({ searchParams }: PageProps) {
  const flag = searchParams?.flag ?? "";
  const line = searchParams?.line ?? "";
  const area = searchParams?.area ?? "";
  const type = searchParams?.type ?? "";

  // 表示モード判定 + フィルタ取得
  let properties: Property[] = [];
  let pageTitle = "新着物件情報";
  let pageEn = "NEW ARRIVALS";
  let pageDesc = "最新の掲載物件をご紹介します";

  const isLineMode = !!line;
  if (isLineMode) {
    pageTitle = `${line}沿線の物件`;
    pageEn = "BY LINE";
    pageDesc = `${line}沿線の物件をご紹介します`;
  }

  try {
    if (isLineMode) {
      // 沿線モード: 一覧描画はクライアントコンポーネントへ委譲（REINS含む・ページ内絞り込み）
      // 件数表示用に通常物件のみここで保持しない（クライアント側で件数管理）
    } else if (area) {
      properties = await getPropertiesByArea(area);
      pageTitle = `${area}の物件`;
      pageEn = "BY AREA";
      pageDesc = `${area}エリアの物件をご紹介します`;
    } else if (flag === "featured") {
      properties = await getFeaturedProperties();
      pageTitle = "厳選物件情報";
      pageEn = "FELIA SELECTION";
      pageDesc = "フェリアホームが厳選する特別な物件";
    } else {
      properties = await getNewProperties();
    }

    // 物件種別フィルタ（任意）— クライアント側でフィルタ
    if (type) {
      properties = properties.filter((p) => p.property_type === type);
    }
  } catch {
    properties = [];
  }

  return (
    <main style={{ backgroundColor: "#f8f8f8", minHeight: "100vh" }}>

      {/* パンくず */}
      <div style={{ backgroundColor: "#fff", borderBottom: "1px solid #e8e8e8", padding: "12px 24px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", gap: "8px", fontSize: "12px", color: "#888" }}>
          <Link href="/" style={{ color: "#888", textDecoration: "none" }}>ホーム</Link>
          <span>›</span>
          <span style={{ color: "#333" }}>{pageTitle}</span>
        </div>
      </div>

      {/* ページヘッダー */}
      <div style={{
        backgroundColor: "#fff",
        borderBottom: "3px solid #5BAD52",
        padding: "40px 24px 32px",
      }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <p style={{
            fontSize: "11px",
            color: "#5BAD52",
            letterSpacing: "0.3em",
            margin: "0 0 8px",
            fontFamily: "'Montserrat', sans-serif",
            fontWeight: "600",
          }}>
            {pageEn}
          </p>
          <h1 style={{
            fontSize: "clamp(24px, 4vw, 36px)",
            fontWeight: "bold",
            color: "#1a1a1a",
            margin: "0 0 8px",
          }}>
            {pageTitle}
          </h1>
          <p style={{ fontSize: "14px", color: "#666", margin: "0 0 20px" }}>
            {pageDesc}
          </p>
          {!isLineMode && (
            <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
              <Link
                href="/search"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "10px 20px",
                  backgroundColor: "#5BAD52",
                  color: "#fff",
                  borderRadius: "6px",
                  textDecoration: "none",
                  fontSize: "13px",
                  fontWeight: "bold",
                }}
              >
                条件で絞り込む →
              </Link>
              <span style={{ fontSize: "13px", color: "#888" }}>
                {properties.length}件掲載中
              </span>
            </div>
          )}
        </div>
      </div>

      {/* 物件一覧 */}
      {isLineMode ? (
        <LinePropertiesClient line={line} />
      ) : (
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px 80px" }}>
          {properties.length === 0 ? (
            <div style={{
              textAlign: "center", padding: "80px 0",
              backgroundColor: "#fff", borderRadius: "12px",
              border: "1px solid #e8e8e8",
            }}>
              <p style={{ fontSize: "16px", color: "#888" }}>現在、掲載中の新着物件はありません</p>
            </div>
          ) : (
            <div className="properties-search-grid">
              {properties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          )}
        </div>
      )}
    </main>
  );
}

function PropertyCard({ property }: { property: Property }) {
  const mainImage = (property.images as any)?.[0]?.url ?? null;
  const typeLabel = PROPERTY_TYPE_MAP[property.property_type ?? ""] ?? "";
  const location = formatLocation(property) || "";

  const formatDate = (dateStr: string | null | undefined) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "";
    return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
  };

  const dateStr = property.created_at ?? property.createdAt ?? "";

  return (
    <Link
      href={`/properties/${property.id}`}
      style={{ textDecoration: "none", color: "inherit", display: "block" }}
    >
      <div style={{
        backgroundColor: "#fff",
        borderRadius: "12px",
        overflow: "hidden",
        border: "1px solid #e8e8e8",
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "box-shadow 0.2s ease, transform 0.2s ease",
      }}>
        {/* 画像 */}
        <div style={{ position: "relative", aspectRatio: "4/3", backgroundColor: "#f0f0f0", flexShrink: 0 }}>
          <PropertyImage
            src={mainImage}
            alt={property.title ?? "物件画像"}
            seed={property.id}
            sizes="(max-width: 768px) 100vw, 33vw"
          />

          <div style={{ position: "absolute", top: "10px", left: "10px", display: "flex", gap: "4px" }}>
            {typeLabel && (
              <span style={{
                backgroundColor: "#5BAD52", color: "#fff",
                fontSize: "10px", padding: "3px 10px",
                borderRadius: "20px", fontWeight: "bold",
              }}>
                {typeLabel}
              </span>
            )}
            {(property as any).is_felia_selection && (
              <span style={{
                backgroundColor: "#1a4a24", color: "#C9A84C",
                fontSize: "10px", padding: "3px 10px",
                borderRadius: "20px", fontWeight: "bold",
              }}>
                厳選
              </span>
            )}
            {(property as any).is_open_house && (
              <span style={{
                backgroundColor: "#E67E22", color: "#fff",
                fontSize: "10px", padding: "3px 10px",
                borderRadius: "20px", fontWeight: "bold",
              }}>
                現地販売会
              </span>
            )}
          </div>
          {dateStr && (
            <div style={{
              position: "absolute", bottom: "10px", right: "10px",
              backgroundColor: "rgba(0,0,0,0.55)",
              color: "#fff", fontSize: "10px",
              padding: "3px 8px", borderRadius: "4px",
            }}>
              {formatDate(dateStr)}
            </div>
          )}
        </div>

        {/* 情報 */}
        <div style={{ padding: "16px", flex: 1, display: "flex", flexDirection: "column" }}>
          {property.title && (
            <p style={{
              fontSize: "14px", fontWeight: "bold", color: "#333",
              margin: "0 0 10px", lineHeight: 1.5,
              overflow: "hidden", textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}>
              {property.title}
            </p>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: "4px", marginBottom: "12px", flex: 1 }}>
            {location && (
              <p style={{ fontSize: "12px", color: "#666", margin: 0 }}>
                📍 {location}
              </p>
            )}
            {(property as any).station_name1 && (
              <p style={{ fontSize: "12px", color: "#666", margin: 0 }}>
                🚃 {(property as any).station_line1 ? `${(property as any).station_line1} ` : ""}{(property as any).station_name1}駅{(property as any).station_walk1 ? ` 徒歩${(property as any).station_walk1}分` : ""}
              </p>
            )}
            {(property as any).rooms && (
              <p style={{ fontSize: "12px", color: "#666", margin: 0 }}>
                🚪 {(property as any).rooms}
              </p>
            )}
            {(() => {
              const pt = (property as any).property_type as string | null | undefined;
              const isMansion = pt === "MANSION" || pt === "NEW_MANSION";
              const isLand = pt === "LAND";
              const displayArea = isMansion
                ? (property as any).area_exclusive_m2
                : isLand
                  ? (property as any).area_land_m2
                  : (property as any).area_build_m2;
              const label = isMansion ? "専有" : isLand ? "土地" : "建物";
              if (displayArea == null) return null;
              return (
                <p style={{ fontSize: "12px", color: "#666", margin: 0 }}>
                  📐 {label}{displayArea}㎡
                </p>
              );
            })()}
          </div>

          <div style={{ borderTop: "1px solid #f0f0f0", paddingTop: "12px" }}>
            {property.price != null ? (
              <p style={{ margin: 0 }}>
                <span style={{ fontSize: "22px", fontWeight: "bold", color: "#5BAD52" }}>
                  {property.price.toLocaleString()}
                </span>
                <span style={{ fontSize: "13px", color: "#5BAD52", marginLeft: "2px" }}>万円</span>
              </p>
            ) : (
              <p style={{ fontSize: "14px", color: "#888", margin: 0 }}>応相談</p>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
