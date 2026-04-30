"use client";

// components/area/AreaPropertiesClient.tsx
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { PropertyImage } from "@/components/ui/PropertyImage";

interface NormalProperty {
  id: string;
  _type: "normal";
  property_type: string;
  title: string | null;
  city: string | null;
  town: string | null;
  price: number | null;
  rooms: string | null;
  area_land_m2: number | null;
  area_build_m2: number | null;
  area_exclusive_m2: number | null;
  station_name1: string | null;
  station_walk1: number | null;
  images: { url: string; is_main: boolean }[];
  is_felia_selection: boolean;
  is_open_house: boolean;
}

interface ReinsProperty {
  id: string;
  _type: "reins";
  source_type: string;
  property_type: string;
  price: number | null;
  address: string | null;
  area: string | null;
  town: string | null;
  rooms: string | null;
  area_m2: number | null;
  area_build_m2: number | null;
  area_land_m2: number | null;
  building_name: string | null;
  station_line: string | null;
  station_name: string | null;
  walk_minutes: number | null;
  built_year_text: string | null;
}

type Property = NormalProperty | ReinsProperty;

function cleanBuiltYear(text: string | null | undefined): string | null {
  if (!text) return null;
  const normalized = text.replace(/\xa0/g, " ").trim();
  if (/^\d+$/.test(normalized)) return null;
  const result = normalized.replace(/(\d+)$/, "$1月").trim();
  return result || null;
}

const PROPERTY_TYPE_MAP: Record<string, string> = {
  LAND: "土地", USED_HOUSE: "中古戸建", NEW_HOUSE: "新築戸建",
  MANSION: "マンション", USED_MANSION: "中古マンション",
  NEW_MANSION: "新築マンション",
};

const TYPE_OPTIONS = [
  { value: "", label: "すべて" },
  { value: "house", label: "戸建て" },
  { value: "mansion", label: "マンション" },
  { value: "land", label: "土地" },
];

const PRICE_OPTIONS = [
  { value: "", label: "価格上限" },
  { value: "5000", label: "〜5,000万円" },
  { value: "7000", label: "〜7,000万円" },
  { value: "10000", label: "〜1億円" },
  { value: "15000", label: "〜1.5億円" },
  { value: "20000", label: "〜2億円" },
  { value: "30000", label: "〜3億円" },
];

const ROOM_OPTIONS = [
  { value: "", label: "間取り" },
  { value: "1LDK", label: "1LDK" },
  { value: "2LDK", label: "2LDK" },
  { value: "3LDK", label: "3LDK" },
  { value: "4LDK以上", label: "4LDK以上" },
];

export function AreaPropertiesClient({
  areaName,
  isLoggedIn,
}: {
  areaName: string;
  isLoggedIn: boolean;
}) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const [filterType, setFilterType] = useState("");
  const [filterPriceMax, setFilterPriceMax] = useState("");
  const [filterRooms, setFilterRooms] = useState("");

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const normalParams = new URLSearchParams({ city: areaName, limit: "30" });
      const normalRes = await fetch(`/api/properties/search?${normalParams}`);
      const normalData = await normalRes.json();
      const normalProps: NormalProperty[] = (normalData.properties ?? []).map(
        (p: any) => ({ ...p, _type: "normal" })
      );

      let reinsProps: ReinsProperty[] = [];
      if (isLoggedIn) {
        try {
          const LIMIT = 500;
          // 1ページ目取得
          const firstParams = new URLSearchParams({ area: areaName, limit: String(LIMIT), page: "1" });
          const firstRes = await fetch(`/api/reins?${firstParams}`);
          const firstData = await firstRes.json();
          const totalPages = firstData.total_pages ?? Math.ceil((firstData.total ?? 0) / LIMIT);
          reinsProps = (firstData.properties ?? []).map((p: any) => ({ ...p, _type: "reins" }));

          // 2ページ目以降を並列取得
          if (totalPages > 1) {
            const pagePromises = Array.from({ length: totalPages - 1 }, (_, i) => {
              const params = new URLSearchParams({ area: areaName, limit: String(LIMIT), page: String(i + 2) });
              return fetch(`/api/reins?${params}`).then((r) => r.json());
            });
            const results = await Promise.all(pagePromises);
            results.forEach((data) => {
              reinsProps = [...reinsProps, ...(data.properties ?? []).map((p: any) => ({ ...p, _type: "reins" }))];
            });
          }
        } catch {
          reinsProps = [];
        }
      }

      const all = [...normalProps, ...reinsProps];
      setProperties(all);
      setTotal(all.length);
    } catch {
      setProperties([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [areaName, isLoggedIn]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const filtered = properties.filter((p) => {
    if (filterType) {
      if (p._type === "normal") {
        const pt = p.property_type ?? "";
        if (filterType === "house" && !["USED_HOUSE", "NEW_HOUSE"].includes(pt)) return false;
        if (filterType === "mansion" && !["MANSION", "USED_MANSION", "NEW_MANSION"].includes(pt)) return false;
        if (filterType === "land" && pt !== "LAND") return false;
      } else {
        const st = p.source_type;
        if (filterType === "house" && st !== "HOUSE") return false;
        if (filterType === "mansion" && st !== "MANSION") return false;
        if (filterType === "land" && st !== "LAND") return false;
      }
    }
    if (filterPriceMax && p.price != null) {
      if (p.price > parseInt(filterPriceMax)) return false;
    }
    if (filterRooms && p.rooms) {
      if (filterRooms === "4LDK以上") {
        const match = p.rooms.match(/(\d+)/);
        if (!match || parseInt(match[1]) < 4) return false;
      } else if (!p.rooms.includes(filterRooms)) return false;
    }
    return true;
  });

  return (
    <div>
      {/* フィルターバー */}
      <div style={{
        backgroundColor: "#fff",
        border: "1px solid #e8e8e8",
        borderRadius: "10px",
        padding: "16px 20px",
        marginBottom: "24px",
        display: "flex",
        gap: "12px",
        flexWrap: "wrap",
        alignItems: "center",
      }}>
        <div style={{ display: "flex", gap: "6px" }}>
          {TYPE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setFilterType(opt.value)}
              style={{
                padding: "6px 14px", borderRadius: "20px",
                border: filterType === opt.value ? "1.5px solid #5BAD52" : "1px solid #e0e0e0",
                backgroundColor: filterType === opt.value ? "#5BAD52" : "#fff",
                color: filterType === opt.value ? "#fff" : "#555",
                fontSize: "12px", fontWeight: filterType === opt.value ? "bold" : "normal",
                cursor: "pointer", transition: "all 0.15s ease",
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <select
          value={filterPriceMax}
          onChange={(e) => setFilterPriceMax(e.target.value)}
          style={{ padding: "7px 12px", borderRadius: "6px", border: "1px solid #e0e0e0", fontSize: "12px", color: "#333", backgroundColor: "#fff", cursor: "pointer" }}
        >
          {PRICE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>

        <select
          value={filterRooms}
          onChange={(e) => setFilterRooms(e.target.value)}
          style={{ padding: "7px 12px", borderRadius: "6px", border: "1px solid #e0e0e0", fontSize: "12px", color: "#333", backgroundColor: "#fff", cursor: "pointer" }}
        >
          {ROOM_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>

        {(filterType || filterPriceMax || filterRooms) && (
          <button
            onClick={() => { setFilterType(""); setFilterPriceMax(""); setFilterRooms(""); }}
            style={{ padding: "6px 12px", border: "1px solid #e0e0e0", borderRadius: "6px", backgroundColor: "#fff", color: "#888", fontSize: "12px", cursor: "pointer" }}
          >
            リセット
          </button>
        )}

        <div style={{ marginLeft: "auto" }}>
          <span style={{ fontSize: "13px", color: "#555" }}>
            {loading ? "読込中..." : (
              <>
                <span style={{ fontSize: "20px", fontWeight: "bold", color: "#5BAD52" }}>{filtered.length}</span>
                <span style={{ marginLeft: "2px" }}>件</span>
                {filterType || filterPriceMax || filterRooms ? (
                  <span style={{ fontSize: "11px", color: "#aaa", marginLeft: "6px" }}>/ 全{total}件</span>
                ) : null}
              </>
            )}
          </span>
        </div>
      </div>

      {/* ローディング */}
      {loading && (
        <div style={{ textAlign: "center", padding: "60px 0", color: "#888" }}>
          <div style={{ width: "36px", height: "36px", border: "3px solid #e8e8e8", borderTop: "3px solid #5BAD52", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 12px" }} />
          <p style={{ fontSize: "13px" }}>物件を読み込み中...</p>
        </div>
      )}

      {/* 空 */}
      {!loading && filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: "80px 0", backgroundColor: "#fff", borderRadius: "12px", border: "1px solid #e8e8e8" }}>
          <p style={{ fontSize: "36px", margin: "0 0 12px" }}>🏠</p>
          <p style={{ fontSize: "16px", color: "#888", margin: "0 0 8px" }}>条件に合う物件が見つかりませんでした</p>
          {(filterType || filterPriceMax || filterRooms) && (
            <button
              onClick={() => { setFilterType(""); setFilterPriceMax(""); setFilterRooms(""); }}
              style={{ marginTop: "16px", padding: "10px 24px", backgroundColor: "#5BAD52", color: "#fff", border: "none", borderRadius: "6px", fontSize: "13px", cursor: "pointer" }}
            >
              条件をリセット
            </button>
          )}
        </div>
      )}

      {/* 物件グリッド */}
      {!loading && filtered.length > 0 && (
        <div className="properties-search-grid">
          {filtered.map((p) =>
            p._type === "normal"
              ? <NormalCard key={p.id} property={p} />
              : <ReinsCard key={`reins-${p.id}`} property={p} />
          )}
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function NormalCard({ property }: { property: NormalProperty }) {
  const [hovered, setHovered] = useState(false);
  const mainImage = property.images?.find((i) => i.is_main)?.url ?? property.images?.[0]?.url ?? null;
  const typeLabel = PROPERTY_TYPE_MAP[property.property_type ?? ""] ?? "";
  const location = [property.city, property.town].filter(Boolean).join("");
  const area = property.area_build_m2 ?? property.area_exclusive_m2 ?? property.area_land_m2;

  return (
    <Link href={`/properties/${property.id}`} style={{ textDecoration: "none", color: "inherit", display: "block" }}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <div style={{
        backgroundColor: "#fff", borderRadius: "12px", overflow: "hidden",
        border: "1px solid #e8e8e8",
        boxShadow: hovered ? "0 8px 24px rgba(0,0,0,0.1)" : "0 2px 8px rgba(0,0,0,0.05)",
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
        transition: "all 0.2s ease", height: "100%", display: "flex", flexDirection: "column",
      }}>
        <div style={{ position: "relative", aspectRatio: "4/3", backgroundColor: "#f0f0f0", flexShrink: 0 }}>
          <PropertyImage
            src={mainImage}
            alt={property.title ?? "物件画像"}
            seed={property.id}
            sizes="(max-width: 768px) 100vw, 33vw"
          />
          {typeLabel && (
            <div style={{ position: "absolute", top: "10px", left: "10px" }}>
              <span style={{ backgroundColor: "#5BAD52", color: "#fff", fontSize: "10px", padding: "3px 10px", borderRadius: "20px", fontWeight: "bold" }}>{typeLabel}</span>
            </div>
          )}
        </div>
        <div style={{ padding: "14px 16px", flex: 1, display: "flex", flexDirection: "column" }}>
          {/* タイトル固定高さ（なければ空白で高さ確保） */}
          <div style={{ minHeight: "36px", marginBottom: "8px" }}>
            {property.title && (
              <p style={{
                fontSize: "13px", fontWeight: "bold", color: "#333",
                margin: 0, lineHeight: 1.4,
                overflow: "hidden", textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
              }}>
                {property.title}
              </p>
            )}
          </div>

          {/* スペック */}
          <div style={{ display: "flex", flexDirection: "column", gap: "4px", marginBottom: "12px", flex: 1 }}>
            {location && <p style={{ fontSize: "12px", color: "#666", margin: 0 }}>📍 {location}</p>}
            {property.station_name1 && (
              <p style={{ fontSize: "12px", color: "#666", margin: 0 }}>🚃 {property.station_name1}駅 徒歩{property.station_walk1}分</p>
            )}
            {property.rooms && <p style={{ fontSize: "12px", color: "#666", margin: 0 }}>🚪 {property.rooms}</p>}
            {area && <p style={{ fontSize: "12px", color: "#666", margin: 0 }}>📐 {area}㎡</p>}
          </div>

          {/* 価格（常に下端） */}
          <div style={{ borderTop: "1px solid #f0f0f0", paddingTop: "10px", marginTop: "auto" }}>
            {property.price != null ? (
              <p style={{ margin: 0 }}>
                <span style={{ fontSize: "20px", fontWeight: "bold", color: "#5BAD52" }}>{property.price.toLocaleString()}</span>
                <span style={{ fontSize: "12px", color: "#5BAD52", marginLeft: "2px" }}>万円</span>
              </p>
            ) : <p style={{ fontSize: "14px", color: "#888", margin: 0 }}>応相談</p>}
          </div>
        </div>
      </div>
    </Link>
  );
}

function ReinsCard({ property }: { property: ReinsProperty }) {
  const [hovered, setHovered] = useState(false);
  const location = [property.area, property.town ?? property.address].filter(Boolean).join(" ");
  const area = property.area_build_m2 ?? property.area_m2 ?? property.area_land_m2;

  return (
    <Link
      href={`/reins/${property.id}`}
      style={{ textDecoration: "none", color: "inherit", display: "block" }}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
    >
      <div style={{
        backgroundColor: "#fff", borderRadius: "12px", overflow: "hidden",
        border: "1px solid #e8e8e8",
        boxShadow: hovered ? "0 8px 24px rgba(0,0,0,0.1)" : "0 2px 8px rgba(0,0,0,0.05)",
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
        transition: "all 0.2s ease", height: "100%", display: "flex", flexDirection: "column",
      }}>
        <div style={{ position: "relative", aspectRatio: "4/3", backgroundColor: "#f0f0f0", flexShrink: 0 }}>
          <PropertyImage
            src={null}
            alt="物件画像"
            seed={property.id}
            sizes="(max-width: 768px) 100vw, 33vw"
          />
          <div style={{ position: "absolute", top: "10px", left: "10px", display: "flex", gap: "4px", zIndex: 1 }}>
            <span style={{ backgroundColor: "#2d4a6a", color: "#fff", fontSize: "10px", padding: "3px 8px", borderRadius: "3px", fontWeight: "bold", fontFamily: "'Montserrat', sans-serif" }}>REINS</span>
            <span style={{ backgroundColor: "rgba(255,255,255,0.9)", color: "#2d4a6a", fontSize: "10px", padding: "3px 8px", borderRadius: "3px", fontWeight: "bold" }}>{property.property_type}</span>
          </div>
        </div>
        <div style={{ padding: "14px 16px", flex: 1, display: "flex", flexDirection: "column" }}>
          {/* 建物名固定高さ */}
          <div style={{ minHeight: "36px", marginBottom: "8px" }}>
            {property.building_name && (
              <p style={{
                fontSize: "13px", fontWeight: "bold", color: "#333",
                margin: 0, lineHeight: 1.4,
                overflow: "hidden", textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
              }}>
                {property.building_name}
              </p>
            )}
          </div>

          {/* スペック */}
          <div style={{ display: "flex", flexDirection: "column", gap: "4px", marginBottom: "12px", flex: 1 }}>
            {location && <p style={{ fontSize: "12px", color: "#666", margin: 0 }}>📍 {location}</p>}
            {property.station_name && (
              <p style={{ fontSize: "12px", color: "#666", margin: 0 }}>🚃 {property.station_line} {property.station_name}駅{property.walk_minutes && ` 徒歩${property.walk_minutes}分`}</p>
            )}
            {property.rooms && <p style={{ fontSize: "12px", color: "#666", margin: 0 }}>🚪 {property.rooms}</p>}
            {area && <p style={{ fontSize: "12px", color: "#666", margin: 0 }}>📐 {area}㎡</p>}
            {cleanBuiltYear(property.built_year_text) && (
              <p style={{ fontSize: "12px", color: "#666", margin: 0 }}>📅 {cleanBuiltYear(property.built_year_text)}</p>
            )}
          </div>

          {/* 価格（常に下端） */}
          <div style={{ borderTop: "1px solid #f0f0f0", paddingTop: "10px", marginTop: "auto" }}>
            {property.price != null ? (
              <p style={{ margin: 0 }}>
                <span style={{ fontSize: "20px", fontWeight: "bold", color: "#2d4a6a" }}>{property.price.toLocaleString()}</span>
                <span style={{ fontSize: "12px", color: "#2d4a6a", marginLeft: "2px" }}>万円</span>
              </p>
            ) : <p style={{ fontSize: "14px", color: "#888", margin: 0 }}>応相談</p>}
          </div>
        </div>
      </div>
    </Link>
  );
}
