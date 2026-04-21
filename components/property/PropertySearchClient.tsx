"use client";
import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const PROPERTY_TYPES = [
  { value: "", label: "すべて", emoji: "🏠" },
  { value: "NEW_HOUSE", label: "新築戸建て", emoji: "🏡" },
  { value: "USED_HOUSE", label: "中古戸建て", emoji: "🏘️" },
  { value: "MANSION,USED_MANSION,NEW_MANSION", label: "マンション", emoji: "🏢" },
  { value: "LAND", label: "土地", emoji: "🌿" },
];

const PRICE_RANGES = [
  { label: "指定なし", min: "", max: "" },
  { label: "〜3,000万円", min: "", max: "3000" },
  { label: "3,000〜5,000万円", min: "3000", max: "5000" },
  { label: "5,000〜7,000万円", min: "5000", max: "7000" },
  { label: "7,000〜1億円", min: "7000", max: "10000" },
  { label: "1億円以上", min: "10000", max: "" },
];

const AREAS = [
  "千代田区", "中央区", "港区", "新宿区", "文京区", "台東区",
  "品川区", "目黒区", "大田区", "世田谷区", "渋谷区", "中野区",
  "杉並区", "豊島区", "北区", "荒川区", "板橋区", "練馬区",
];

const PROPERTY_TYPE_MAP: Record<string, string> = {
  LAND: "土地",
  USED_HOUSE: "中古戸建",
  NEW_HOUSE: "新築戸建",
  MANSION: "マンション",
  USED_MANSION: "中古マンション",
  NEW_MANSION: "新築マンション",
  OTHER: "その他",
};

interface Property {
  id: string;
  property_type: string;
  title: string | null;
  city: string | null;
  town: string | null;
  price: number | null;
  rooms: string | null;
  area_land_m2: number | null;
  area_build_m2: number | null;
  station_name1: string | null;
  station_walk1: number | null;
  building_year: number | null;
  images: { id: string; url: string; is_main: boolean }[];
  is_felia_selection: boolean;
  is_open_house: boolean;
}

export default function PropertySearchClient() {
  const searchParams = useSearchParams();

  const [properties, setProperties] = useState<Property[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedType, setSelectedType] = useState(searchParams.get("property_type") ?? "");
  const [selectedPriceRange, setSelectedPriceRange] = useState(0);
  const [selectedArea, setSelectedArea] = useState(searchParams.get("city") ?? "");
  const [searched, setSearched] = useState(false);

  const search = useCallback(async () => {
    setLoading(true);
    setSearched(true);

    const params = new URLSearchParams();
    if (selectedType) {
      // カンマ区切りの場合は複数type
      const types = selectedType.split(",");
      types.forEach(t => params.append("property_type", t));
    }
    const pr = PRICE_RANGES[selectedPriceRange];
    if (pr.min) params.set("price_min", pr.min);
    if (pr.max) params.set("price_max", pr.max);
    if (selectedArea) params.set("city", selectedArea);
    params.set("limit", "20");

    try {
      const res = await fetch(`/api/properties/search?${params.toString()}`);
      const data = await res.json();
      setProperties(data.properties ?? []);
      setTotal(data.total ?? 0);
    } catch {
      setProperties([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [selectedType, selectedPriceRange, selectedArea]);

  // 初回ロード
  useEffect(() => {
    search();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main style={{ backgroundColor: "#f8f8f8", minHeight: "100vh" }}>

      {/* パンくず */}
      <div style={{ backgroundColor: "#fff", borderBottom: "1px solid #e8e8e8", padding: "12px 24px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", gap: "8px", fontSize: "12px", color: "#888" }}>
          <Link href="/" style={{ color: "#888", textDecoration: "none" }}>ホーム</Link>
          <span>›</span>
          <span style={{ color: "#333" }}>物件検索</span>
        </div>
      </div>

      {/* 検索エリア */}
      <div style={{ backgroundColor: "#fff", borderBottom: "2px solid #5BAD52", padding: "32px 24px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <h1 style={{ fontSize: "22px", fontWeight: "bold", color: "#333", margin: "0 0 28px", textAlign: "center" }}>
            🔍 物件を探す
          </h1>

          {/* 物件種別（大きなボタン） */}
          <div style={{ marginBottom: "24px" }}>
            <p style={{ fontSize: "13px", fontWeight: "bold", color: "#555", margin: "0 0 12px" }}>
              📋 どんな物件をお探しですか？
            </p>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              {PROPERTY_TYPES.map((type) => (
                <button
                  key={type.value}
                  onClick={() => setSelectedType(type.value)}
                  style={{
                    padding: "12px 20px",
                    borderRadius: "8px",
                    border: selectedType === type.value ? "2px solid #5BAD52" : "2px solid #e0e0e0",
                    backgroundColor: selectedType === type.value ? "#5BAD52" : "#fff",
                    color: selectedType === type.value ? "#fff" : "#555",
                    fontSize: "14px",
                    fontWeight: "bold",
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <span>{type.emoji}</span>
                  <span>{type.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 価格帯 */}
          <div style={{ marginBottom: "24px" }}>
            <p style={{ fontSize: "13px", fontWeight: "bold", color: "#555", margin: "0 0 12px" }}>
              💴 ご予算は？
            </p>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {PRICE_RANGES.map((range, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedPriceRange(i)}
                  style={{
                    padding: "10px 16px",
                    borderRadius: "6px",
                    border: selectedPriceRange === i ? "2px solid #5BAD52" : "1px solid #e0e0e0",
                    backgroundColor: selectedPriceRange === i ? "#e8f5e6" : "#fff",
                    color: selectedPriceRange === i ? "#5BAD52" : "#555",
                    fontSize: "13px",
                    fontWeight: selectedPriceRange === i ? "bold" : "normal",
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                  }}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>

          {/* エリア */}
          <div style={{ marginBottom: "28px" }}>
            <p style={{ fontSize: "13px", fontWeight: "bold", color: "#555", margin: "0 0 12px" }}>
              📍 エリアは？
            </p>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              <button
                onClick={() => setSelectedArea("")}
                style={{
                  padding: "8px 14px",
                  borderRadius: "6px",
                  border: selectedArea === "" ? "2px solid #5BAD52" : "1px solid #e0e0e0",
                  backgroundColor: selectedArea === "" ? "#e8f5e6" : "#fff",
                  color: selectedArea === "" ? "#5BAD52" : "#555",
                  fontSize: "13px",
                  fontWeight: selectedArea === "" ? "bold" : "normal",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
              >
                すべてのエリア
              </button>
              {AREAS.map((area) => (
                <button
                  key={area}
                  onClick={() => setSelectedArea(selectedArea === area ? "" : area)}
                  style={{
                    padding: "8px 14px",
                    borderRadius: "6px",
                    border: selectedArea === area ? "2px solid #5BAD52" : "1px solid #e0e0e0",
                    backgroundColor: selectedArea === area ? "#e8f5e6" : "#fff",
                    color: selectedArea === area ? "#5BAD52" : "#555",
                    fontSize: "13px",
                    fontWeight: selectedArea === area ? "bold" : "normal",
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                  }}
                >
                  {area}
                </button>
              ))}
            </div>
          </div>

          {/* 検索ボタン */}
          <div style={{ textAlign: "center" }}>
            <button
              onClick={search}
              disabled={loading}
              style={{
                padding: "16px 64px",
                backgroundColor: "#5BAD52",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                fontSize: "18px",
                fontWeight: "bold",
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.7 : 1,
                transition: "all 0.15s ease",
                boxShadow: "0 4px 16px rgba(91,173,82,0.3)",
              }}
            >
              {loading ? "検索中..." : "🔍 この条件で検索する"}
            </button>
          </div>
        </div>
      </div>

      {/* 検索結果 */}
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "32px 24px 80px" }}>

        {/* 件数表示 */}
        {searched && !loading && (
          <div style={{ marginBottom: "20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <p style={{ fontSize: "14px", color: "#555", margin: 0 }}>
              {total > 0 ? (
                <>
                  <span style={{ fontSize: "24px", fontWeight: "bold", color: "#5BAD52" }}>{total}</span>
                  <span style={{ marginLeft: "4px" }}>件の物件が見つかりました</span>
                </>
              ) : (
                "条件に合う物件が見つかりませんでした"
              )}
            </p>
          </div>
        )}

        {/* ローディング */}
        {loading && (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <div style={{
              width: "48px", height: "48px",
              border: "4px solid #e8f5e6",
              borderTop: "4px solid #5BAD52",
              borderRadius: "50%",
              animation: "spin 0.8s linear infinite",
              margin: "0 auto 16px",
            }} />
            <p style={{ color: "#888", fontSize: "14px" }}>物件を検索中...</p>
          </div>
        )}

        {/* 結果なし */}
        {!loading && searched && properties.length === 0 && (
          <div style={{
            textAlign: "center", padding: "80px 24px",
            backgroundColor: "#fff", borderRadius: "12px",
          }}>
            <p style={{ fontSize: "48px", margin: "0 0 16px" }}>🔍</p>
            <p style={{ fontSize: "18px", fontWeight: "bold", color: "#333", margin: "0 0 8px" }}>
              条件に合う物件が見つかりませんでした
            </p>
            <p style={{ fontSize: "14px", color: "#888", margin: "0 0 24px" }}>
              条件を変えて再度検索してみてください
            </p>
            <button
              onClick={() => {
                setSelectedType("");
                setSelectedPriceRange(0);
                setSelectedArea("");
              }}
              style={{
                padding: "12px 32px",
                backgroundColor: "#5BAD52",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                fontSize: "14px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              条件をリセット
            </button>
          </div>
        )}

        {/* 物件グリッド */}
        {!loading && properties.length > 0 && (
          <div className="properties-search-grid">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </main>
  );
}

function PropertyCard({ property }: { property: Property }) {
  const [hovered, setHovered] = useState(false);
  const mainImage = property.images?.find(i => i.is_main)?.url ?? property.images?.[0]?.url ?? null;
  const typeLabel = PROPERTY_TYPE_MAP[property.property_type] ?? property.property_type;
  const location = [property.city, property.town].filter(Boolean).join("") || "";

  return (
    <Link
      href={`/properties/${property.id}`}
      style={{ textDecoration: "none", color: "inherit", display: "block" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{
        backgroundColor: "#fff",
        borderRadius: "12px",
        overflow: "hidden",
        border: "1px solid #e8e8e8",
        boxShadow: hovered ? "0 8px 24px rgba(0,0,0,0.12)" : "0 2px 8px rgba(0,0,0,0.06)",
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
        transition: "all 0.2s ease",
      }}>
        {/* 画像 */}
        <div style={{ position: "relative", aspectRatio: "4/3", backgroundColor: "#f0f0f0" }}>
          {mainImage ? (
            <Image
              src={mainImage}
              alt={property.title ?? "物件"}
              fill
              quality={80}
              style={{ objectFit: "cover" }}
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          ) : (
            <div style={{
              position: "absolute", inset: 0,
              display: "flex", alignItems: "center",
              justifyContent: "center", color: "#bbb", fontSize: "13px",
            }}>
              画像なし
            </div>
          )}
          <div style={{ position: "absolute", top: "10px", left: "10px", display: "flex", gap: "4px" }}>
            <span style={{
              backgroundColor: "#5BAD52", color: "#fff",
              fontSize: "10px", padding: "2px 8px",
              borderRadius: "20px", fontWeight: "bold",
            }}>
              {typeLabel}
            </span>
            {property.is_felia_selection && (
              <span style={{
                backgroundColor: "#1a4a24", color: "#C9A84C",
                fontSize: "10px", padding: "2px 8px",
                borderRadius: "20px", fontWeight: "bold",
              }}>
                厳選
              </span>
            )}
            {property.is_open_house && (
              <span style={{
                backgroundColor: "#E67E22", color: "#fff",
                fontSize: "10px", padding: "2px 8px",
                borderRadius: "20px", fontWeight: "bold",
              }}>
                現地販売会
              </span>
            )}
          </div>
        </div>

        {/* 情報 */}
        <div style={{ padding: "14px 16px" }}>
          {property.title && (
            <p style={{
              fontSize: "13px", fontWeight: "bold", color: "#333",
              margin: "0 0 8px", lineHeight: 1.4,
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
            }}>
              {property.title}
            </p>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: "3px", marginBottom: "10px" }}>
            {location && (
              <p style={{ fontSize: "12px", color: "#666", margin: 0 }}>
                📍 {location}
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
            {property.building_year && (
              <p style={{ fontSize: "12px", color: "#666", margin: 0 }}>
                📅 {property.building_year}年築
              </p>
            )}
          </div>

          <div style={{ borderTop: "1px solid #f0f0f0", paddingTop: "10px" }}>
            {property.price != null ? (
              <p style={{ margin: 0 }}>
                <span style={{ fontSize: "20px", fontWeight: "bold", color: "#5BAD52" }}>
                  {property.price.toLocaleString()}
                </span>
                <span style={{ fontSize: "12px", color: "#5BAD52", marginLeft: "2px" }}>万円</span>
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
