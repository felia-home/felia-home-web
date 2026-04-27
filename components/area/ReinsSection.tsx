"use client";

// components/area/ReinsSection.tsx
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

interface ReinsProperty {
  id: string;
  source_type: string;
  property_type: string;
  price: number | null;
  address: string | null;
  area: string | null;
  town: string | null;
  rooms: string | null;
  area_m2: number | null;
  building_name: string | null;
  station_line: string | null;
  station_name: string | null;
  walk_minutes: number | null;
  built_year_text: string | null;
}

const LIMIT = 9;

export function ReinsSection({ areaName }: { areaName: string }) {
  const [properties, setProperties] = useState<ReinsProperty[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchReins = useCallback(async (p: number) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        area: areaName,
        page: String(p),
        limit: String(LIMIT),
      });
      const res = await fetch(`/api/reins?${params.toString()}`);
      const data = await res.json();
      setProperties(data.properties ?? []);
      setTotal(data.total ?? 0);
      setTotalPages(Math.ceil((data.total ?? 0) / LIMIT));
      setPage(p);
    } catch {
      setProperties([]);
    } finally {
      setLoading(false);
    }
  }, [areaName]);

  useEffect(() => {
    fetchReins(1);
  }, [fetchReins]);

  if (loading) {
    return (
      <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "40px 0", color: "#888", fontSize: "13px" }}>
        REINS物件を読み込み中...
      </div>
    );
  }

  if (properties.length === 0) return null;

  return (
    <>
      {properties.map((property) => (
        <ReinsPropertyCard key={property.id} property={property} />
      ))}

      {/* ページネーション */}
      {totalPages > 1 && (
        <div style={{
          gridColumn: "1 / -1",
          display: "flex", justifyContent: "center",
          gap: "8px", marginTop: "32px",
          paddingTop: "24px", borderTop: "1px solid #e8e8e8",
        }}>
          <button
            onClick={() => { fetchReins(page - 1); }}
            disabled={page <= 1}
            style={{
              padding: "8px 16px", border: "1px solid #e0e0e0",
              borderRadius: "6px", backgroundColor: "#fff",
              color: page <= 1 ? "#ccc" : "#555",
              cursor: page <= 1 ? "not-allowed" : "pointer", fontSize: "13px",
            }}
          >
            ← 前へ
          </button>
          <span style={{ padding: "8px 16px", fontSize: "13px", color: "#555" }}>
            REINS {page} / {totalPages}ページ（全{total.toLocaleString()}件）
          </span>
          <button
            onClick={() => { fetchReins(page + 1); }}
            disabled={page >= totalPages}
            style={{
              padding: "8px 16px", border: "1px solid #e0e0e0",
              borderRadius: "6px", backgroundColor: "#fff",
              color: page >= totalPages ? "#ccc" : "#555",
              cursor: page >= totalPages ? "not-allowed" : "pointer", fontSize: "13px",
            }}
          >
            次へ →
          </button>
        </div>
      )}
    </>
  );
}

function ReinsPropertyCard({ property }: { property: ReinsProperty }) {
  const [hovered, setHovered] = useState(false);
  const location = [property.area, property.town ?? property.address].filter(Boolean).join(" ");
  const placeholderColors: Record<string, string> = {
    MANSION: "#1a2a3a", HOUSE: "#1a2a1a", LAND: "#1a1a0a",
  };
  const bgColor = placeholderColors[property.source_type] ?? "#1a2a3a";
  const emoji = property.source_type === "MANSION" ? "🏢" : property.source_type === "HOUSE" ? "🏡" : "🌿";

  return (
    <Link
      href={`/contact?reins_id=${property.id}&type=reins&address=${encodeURIComponent(property.address ?? "")}`}
      style={{ textDecoration: "none", color: "inherit", display: "block" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{
        backgroundColor: "#fff", borderRadius: "10px",
        overflow: "hidden", border: "1px solid #e8e8e8",
        boxShadow: hovered ? "0 8px 24px rgba(0,0,0,0.1)" : "0 2px 8px rgba(0,0,0,0.05)",
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
        transition: "all 0.2s ease",
        height: "100%", display: "flex", flexDirection: "column",
      }}>
        <div style={{ position: "relative", aspectRatio: "4/3", backgroundColor: bgColor, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontSize: "48px", opacity: 0.3 }}>{emoji}</span>
          <div style={{ position: "absolute", top: "10px", left: "10px", display: "flex", gap: "4px" }}>
            <span style={{ backgroundColor: "#2d4a6a", color: "#fff", fontSize: "10px", padding: "3px 8px", borderRadius: "3px", fontWeight: "bold", fontFamily: "'Montserrat', sans-serif" }}>REINS</span>
            <span style={{ backgroundColor: "rgba(255,255,255,0.9)", color: "#2d4a6a", fontSize: "10px", padding: "3px 8px", borderRadius: "3px", fontWeight: "bold" }}>{property.property_type}</span>
          </div>
        </div>
        <div style={{ padding: "14px 16px", flex: 1, display: "flex", flexDirection: "column" }}>
          {property.building_name && (
            <p style={{ fontSize: "13px", fontWeight: "bold", color: "#333", margin: "0 0 6px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {property.building_name}
            </p>
          )}
          <div style={{ display: "flex", flexDirection: "column", gap: "4px", marginBottom: "12px", flex: 1 }}>
            {location && <p style={{ fontSize: "12px", color: "#666", margin: 0 }}>📍 {location}</p>}
            {property.station_name && (
              <p style={{ fontSize: "12px", color: "#666", margin: 0 }}>
                🚃 {property.station_line} {property.station_name}駅{property.walk_minutes && ` 徒歩${property.walk_minutes}分`}
              </p>
            )}
            {property.rooms && <p style={{ fontSize: "12px", color: "#666", margin: 0 }}>🚪 {property.rooms}</p>}
            {property.area_m2 && <p style={{ fontSize: "12px", color: "#666", margin: 0 }}>📐 {property.area_m2}㎡</p>}
            {property.built_year_text && (
              <p style={{ fontSize: "12px", color: "#666", margin: 0 }}>
                📅 {property.built_year_text.replace(/(\d+)$/, "$1月")}
              </p>
            )}
          </div>
          <div style={{ borderTop: "1px solid #f0f0f0", paddingTop: "10px" }}>
            {property.price != null ? (
              <p style={{ margin: 0 }}>
                <span style={{ fontSize: "20px", fontWeight: "bold", color: "#2d4a6a" }}>{property.price.toLocaleString()}</span>
                <span style={{ fontSize: "12px", color: "#2d4a6a", marginLeft: "2px" }}>万円</span>
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
