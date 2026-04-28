import Link from "next/link";
import { getFeliaSectionProperties } from "@/lib/api";
import type { Property } from "@/lib/api";
import { PropertyImage } from "@/components/ui/PropertyImage";

export const revalidate = 60;

const PROPERTY_TYPE_MAP: Record<string, string> = {
  LAND: "土地",
  USED_HOUSE: "中古戸建",
  NEW_HOUSE: "新築戸建",
  MANSION: "マンション",
  USED_MANSION: "中古マンション",
  NEW_MANSION: "新築マンション",
  OTHER: "その他",
};

export default async function FeliaSelectionPage() {
  const properties = await getFeliaSectionProperties();

  return (
    <main style={{ backgroundColor: "#f9f9f9", minHeight: "100vh" }}>

      {/* パンくず */}
      <div style={{ backgroundColor: "#fff", borderBottom: "1px solid #e8e8e8", padding: "12px 24px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", gap: "8px", fontSize: "12px", color: "#888", alignItems: "center" }}>
          <Link href="/" style={{ color: "#888", textDecoration: "none" }}>ホーム</Link>
          <span>›</span>
          <span style={{ color: "#333", fontWeight: "500" }}>Felia Selection</span>
        </div>
      </div>

      {/* ページヘッダー */}
      <div style={{
        background: "linear-gradient(135deg, #1a4a24 0%, #2d7a3a 50%, #5BAD52 100%)",
        padding: "64px 24px",
        textAlign: "center",
        color: "#fff",
      }}>
        <p style={{
          fontSize: "12px",
          letterSpacing: "0.3em",
          opacity: 0.7,
          margin: "0 0 12px",
          fontFamily: "'Montserrat', sans-serif",
        }}>
          FELIA SELECTION
        </p>
        <h1 style={{
          fontSize: "clamp(28px, 5vw, 44px)",
          fontWeight: "bold",
          margin: "0 0 16px",
          lineHeight: 1.3,
        }}>
          Felia Selection
        </h1>
        <div style={{ width: "40px", height: "2px", backgroundColor: "rgba(255,255,255,0.5)", margin: "0 auto 20px" }} />
        <p style={{
          fontSize: "15px",
          opacity: 0.85,
          lineHeight: 1.8,
          maxWidth: "600px",
          margin: "0 auto",
        }}>
          フェリアホームが厳選した、特におすすめの物件をご紹介します。<br />
          豊富な経験と独自のネットワークから選び抜いた、価値ある不動産です。
        </p>
      </div>

      {/* 物件数 */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "24px 24px 0" }}>
        <p style={{ fontSize: "14px", color: "#888" }}>
          {properties.length}件の厳選物件
        </p>
      </div>

      {/* 物件一覧 */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "16px 24px 80px" }}>
        {properties.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0", color: "#888" }}>
            <p style={{ fontSize: "16px", marginBottom: "8px" }}>現在、掲載中の厳選物件はありません</p>
            <p style={{ fontSize: "13px" }}>新しい物件が入り次第、随時更新いたします。</p>
          </div>
        ) : (
          <div className="felia-selection-grid">
            {properties.map((property) => (
              <FeliaSelectionCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

function FeliaSelectionCard({ property }: { property: Property }) {
  const mainImage = property.images?.[0]?.url ?? null;
  const propertyTypeLabel = PROPERTY_TYPE_MAP[property.property_type ?? ""] ?? "";
  const address = [property.city, property.town].filter(Boolean).join("") || property.address || "";

  return (
    <Link
      href={`/properties/${property.id}`}
      style={{
        display: "block",
        textDecoration: "none",
        color: "inherit",
        backgroundColor: "#fff",
        borderRadius: "12px",
        overflow: "hidden",
        boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
        border: "1px solid #e8e8e8",
      }}
    >
      {/* 画像 */}
      <div style={{
        position: "relative",
        width: "100%",
        aspectRatio: "4/3",
        backgroundColor: "#f0f0f0",
      }}>
        <PropertyImage
          src={mainImage}
          alt={property.title ?? "物件画像"}
          seed={property.id}
          quality={85}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />


        {/* バッジ */}
        <div style={{
          position: "absolute", top: "12px", left: "12px",
          display: "flex", gap: "6px", flexWrap: "wrap",
        }}>
          <span style={{
            backgroundColor: "#5BAD52", color: "#fff",
            fontSize: "10px", fontWeight: "bold",
            padding: "3px 10px", borderRadius: "20px",
            fontFamily: "'Montserrat', sans-serif",
            letterSpacing: "0.05em",
          }}>
            Felia Selection
          </span>
          {property.is_open_house && (
            <span style={{
              backgroundColor: "#E67E22", color: "#fff",
              fontSize: "10px", fontWeight: "bold",
              padding: "3px 10px", borderRadius: "20px",
            }}>
              現地販売会
            </span>
          )}
        </div>
      </div>

      {/* 情報 */}
      <div style={{ padding: "16px 20px" }}>
        {/* 種別バッジ */}
        {propertyTypeLabel && (
          <span style={{
            display: "inline-block",
            fontSize: "11px", padding: "2px 8px",
            borderRadius: "4px",
            backgroundColor: "#e8f5e6", color: "#5BAD52",
            fontWeight: "bold", marginBottom: "8px",
          }}>
            {propertyTypeLabel}
          </span>
        )}

        {/* タイトル */}
        <h2 style={{
          fontSize: "15px", fontWeight: "bold",
          color: "#333", margin: "0 0 8px",
          lineHeight: 1.4,
          overflow: "hidden",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
        }}>
          {property.title ?? "物件名未設定"}
        </h2>

        {/* キャッチコピー */}
        {property.catch_copy && (
          <p style={{
            fontSize: "12px", color: "#5BAD52",
            margin: "0 0 10px", lineHeight: 1.5,
            fontStyle: "italic",
          }}>
            {property.catch_copy}
          </p>
        )}

        {/* スペック */}
        <div style={{ display: "flex", flexDirection: "column", gap: "4px", marginBottom: "14px" }}>
          {address && (
            <p style={{ fontSize: "12px", color: "#666", margin: 0 }}>
              📍 {address}
            </p>
          )}
          {property.station_name1 && (
            <p style={{ fontSize: "12px", color: "#666", margin: 0 }}>
              🚃 {property.station_name1}駅 徒歩{property.station_walk1}分
            </p>
          )}
          {property.rooms && (
            <p style={{ fontSize: "12px", color: "#666", margin: 0 }}>
              🏠 {property.rooms}
            </p>
          )}
        </div>

        {/* 価格 */}
        <div style={{
          borderTop: "1px solid #f0f0f0",
          paddingTop: "12px",
          display: "flex",
          alignItems: "baseline",
          gap: "4px",
        }}>
          {property.price != null ? (
            <>
              <span style={{ fontSize: "22px", fontWeight: "bold", color: "#5BAD52" }}>
                {property.price.toLocaleString()}
              </span>
              <span style={{ fontSize: "13px", color: "#5BAD52" }}>万円</span>
            </>
          ) : (
            <span style={{ fontSize: "15px", color: "#888" }}>応相談</span>
          )}
        </div>
      </div>
    </Link>
  );
}
