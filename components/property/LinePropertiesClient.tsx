"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useAuth } from "@/app/providers";
import { PropertyImage } from "@/components/ui/PropertyImage";
import { formatLocation } from "@/lib/addressFormat";

const PROPERTY_TYPE_MAP: Record<string, string> = {
  LAND: "土地",
  USED_HOUSE: "中古戸建",
  NEW_HOUSE: "新築戸建",
  MANSION: "マンション",
  NEW_MANSION: "新築マンション",
  OTHER: "その他",
};

const PROPERTY_TYPES = [
  { value: "",            label: "すべて" },
  { value: "NEW_HOUSE",   label: "新築戸建" },
  { value: "USED_HOUSE",  label: "中古戸建" },
  { value: "MANSION",     label: "マンション" },
  { value: "NEW_MANSION", label: "新築マンション" },
  { value: "LAND",        label: "土地" },
];

const PRICE_RANGES = [
  { label: "指定なし",          min: "",      max: ""      },
  { label: "〜5,000万円",       min: "",      max: "5000"  },
  { label: "5,000万〜1億円",    min: "5000",  max: "10000" },
  { label: "1億〜2億円",        min: "10000", max: "20000" },
  { label: "2億〜3億円",        min: "20000", max: "30000" },
  { label: "3億円以上",         min: "30000", max: ""      },
];

const WALK_MAX_OPTIONS = [
  { label: "指定なし",  value: 0 },
  { label: "5分以内",   value: 5 },
  { label: "10分以内",  value: 10 },
  { label: "15分以内",  value: 15 },
];

const AREAS = [
  "千代田区", "中央区", "港区", "新宿区", "文京区", "台東区",
  "品川区", "目黒区", "大田区", "世田谷区", "渋谷区", "中野区",
  "杉並区", "豊島区", "北区", "荒川区", "板橋区", "練馬区",
];

function buildReinsTitle(p: any): string {
  if (p.source_type === "MANSION" && p.building_name) return p.building_name;
  const location = [p.area, p.town ?? p.address].filter(Boolean).join(" ");
  const type = p.property_type ?? "";
  const price = p.price != null ? ` ${p.price.toLocaleString()}万円` : "";
  return [location, type, price].filter(Boolean).join(" ") || "物件";
}

export default function LinePropertiesClient({ line }: { line: string }) {
  const { user, isLoading: authLoading } = useAuth();
  const isLoggedIn = !!user;
  const sessionLoaded = !authLoading;

  const [normalProps, setNormalProps] = useState<any[]>([]);
  const [reinsProps,  setReinsProps]  = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedType,       setSelectedType]       = useState("");
  const [selectedPriceRange, setSelectedPriceRange] = useState(0);
  const [selectedWalkMax,    setSelectedWalkMax]    = useState(0);
  const [selectedArea,       setSelectedArea]       = useState("");

  // 取得：沿線スコープは固定。価格は admin にも投げて軽くしつつ、種別/徒歩/区はクライアント側で確実に絞る
  useEffect(() => {
    if (!sessionLoaded) return;
    let cancelled = false;

    const run = async () => {
      setLoading(true);
      const pr = PRICE_RANGES[selectedPriceRange];

      // ---- 通常物件 ----
      const p = new URLSearchParams();
      p.set("line", line);
      if (pr.min) p.set("price_min", pr.min);
      if (pr.max) p.set("price_max", pr.max);
      p.set("limit", "200");
      let normal: any[] = [];
      try {
        const res = await fetch(`/api/properties/search?${p.toString()}`);
        const data = await res.json();
        normal = (data.properties ?? []).filter((x: any) => x?.published_hp !== false);
      } catch {
        normal = [];
      }

      // ---- REINS物件（会員時のみ） ----
      let reins: any[] = [];
      if (isLoggedIn) {
        try {
          const REINS_BATCH = 500;
          const REINS_MAX_PAGES = 6;
          let page = 1;
          let hasMore = true;
          while (hasMore && page <= REINS_MAX_PAGES) {
            const rp = new URLSearchParams();
            rp.set("q", line);
            if (pr.min) rp.set("price_min", pr.min);
            if (pr.max) rp.set("price_max", pr.max);
            rp.set("limit", String(REINS_BATCH));
            rp.set("page",  String(page));
            const rRes = await fetch(`/api/reins?${rp.toString()}`);
            if (!rRes.ok) break;
            const rData = await rRes.json();
            const batch: any[] = rData.properties ?? [];
            reins = [...reins, ...batch];
            const totalPagesRemote: number = rData.total_pages ?? 0;
            if ((totalPagesRemote > 0 && page >= totalPagesRemote) || batch.length < REINS_BATCH) {
              hasMore = false;
            } else {
              page++;
            }
          }
        } catch {
          reins = [];
        }
      }

      if (cancelled) return;
      setNormalProps(normal);
      setReinsProps(reins);
      setLoading(false);
    };
    run();
    return () => { cancelled = true; };
  }, [line, isLoggedIn, sessionLoaded, selectedPriceRange]);

  // ---- 表示用フィルタ（種別 / 徒歩 / 区） ----
  const filteredNormal = useMemo(() => {
    return normalProps.filter((p) => {
      // 種別
      if (selectedType) {
        const pt = (p.property_type ?? "").toString().toUpperCase();
        if (pt !== selectedType.toUpperCase()) return false;
      }
      // 徒歩
      if (selectedWalkMax > 0) {
        const walks = [p.station_walk1, p.station_walk2, p.station_walk3]
          .map((v: any) => typeof v === "number" ? v : null)
          .filter((v): v is number => v !== null);
        if (walks.length === 0) return false;
        if (Math.min(...walks) > selectedWalkMax) return false;
      }
      // 区
      if (selectedArea) {
        const city: string = p.city ?? "";
        if (city !== selectedArea) return false;
      }
      return true;
    });
  }, [normalProps, selectedType, selectedWalkMax, selectedArea]);

  const filteredReins = useMemo(() => {
    return reinsProps.filter((p) => {
      // 種別（REINS は source_type + property_type 文字列で判定）
      if (selectedType) {
        const st: string = p.source_type ?? "";
        if (selectedType === "MANSION" || selectedType === "NEW_MANSION") {
          if (st !== "MANSION") return false;
        } else if (selectedType === "LAND") {
          if (st !== "LAND") return false;
        } else if (selectedType === "NEW_HOUSE" || selectedType === "USED_HOUSE") {
          if (st !== "HOUSE") return false;
        }
      }
      // 徒歩
      if (selectedWalkMax > 0) {
        const w = typeof p.walk_minutes === "number" ? p.walk_minutes : null;
        if (w === null || w > selectedWalkMax) return false;
      }
      // 区
      if (selectedArea) {
        const a: string = p.area ?? "";
        if (a !== selectedArea) return false;
      }
      return true;
    });
  }, [reinsProps, selectedType, selectedWalkMax, selectedArea]);

  const totalCount = filteredNormal.length + filteredReins.length;

  const resetFilters = () => {
    setSelectedType("");
    setSelectedPriceRange(0);
    setSelectedWalkMax(0);
    setSelectedArea("");
  };

  return (
    <>
      {/* フィルタパネル（ページ内絞り込み） */}
      <div style={{ backgroundColor: "#fff", borderBottom: "1px solid #e8e8e8", padding: "20px 24px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>

          {/* 物件種別 */}
          <FilterRow label="物件種別">
            {PROPERTY_TYPES.map((t) => (
              <PillButton
                key={t.value || "all"}
                active={selectedType === t.value}
                onClick={() => setSelectedType(t.value)}
              >
                {t.label}
              </PillButton>
            ))}
          </FilterRow>

          {/* 価格帯 */}
          <FilterRow label="価格帯">
            {PRICE_RANGES.map((r, i) => (
              <PillButton
                key={i}
                active={selectedPriceRange === i}
                onClick={() => setSelectedPriceRange(i)}
              >
                {r.label}
              </PillButton>
            ))}
          </FilterRow>

          {/* 駅徒歩 */}
          <FilterRow label="駅徒歩">
            {WALK_MAX_OPTIONS.map((w, i) => (
              <PillButton
                key={i}
                active={selectedWalkMax === w.value}
                onClick={() => setSelectedWalkMax(w.value)}
              >
                {w.label}
              </PillButton>
            ))}
          </FilterRow>

          {/* エリア（区） */}
          <FilterRow label="エリア">
            <PillButton active={selectedArea === ""} onClick={() => setSelectedArea("")}>
              すべて
            </PillButton>
            {AREAS.map((a) => (
              <PillButton
                key={a}
                active={selectedArea === a}
                onClick={() => setSelectedArea(selectedArea === a ? "" : a)}
              >
                {a}
              </PillButton>
            ))}
          </FilterRow>

          <div style={{ display: "flex", gap: "12px", alignItems: "center", marginTop: "12px" }}>
            <button
              onClick={resetFilters}
              style={{
                padding: "10px 20px",
                backgroundColor: "#fff",
                color: "#888",
                border: "1px solid #ddd",
                borderRadius: "6px",
                fontSize: "13px",
                cursor: "pointer",
              }}
            >
              リセット
            </button>
            <span style={{ fontSize: "13px", color: "#888" }}>
              {loading ? "読み込み中..." : `${totalCount}件`}
            </span>
            {!isLoggedIn && sessionLoaded && (
              <span style={{ fontSize: "12px", color: "#aaa" }}>
                ※ 会員ログインで未公開のREINS物件も表示されます
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 物件一覧 */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px 80px" }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: "80px 0", color: "#888", fontSize: "14px" }}>
            読み込み中...
          </div>
        ) : totalCount === 0 ? (
          <div style={{
            textAlign: "center", padding: "80px 0",
            backgroundColor: "#fff", borderRadius: "12px",
            border: "1px solid #e8e8e8",
          }}>
            <p style={{ fontSize: "16px", color: "#888" }}>条件に合う物件がありません</p>
          </div>
        ) : (
          <div className="properties-search-grid">
            {filteredNormal.map((property) => (
              <NormalCard key={`n-${property.id}`} property={property} />
            ))}
            {filteredReins.map((property) => (
              <ReinsCard key={`r-${property.id}`} property={property} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

function FilterRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: "12px" }}>
      <p style={{ fontSize: "12px", color: "#888", fontWeight: "bold", margin: "0 0 6px" }}>
        {label}
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
        {children}
      </div>
    </div>
  );
}

function PillButton({
  active, onClick, children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "7px 14px",
        borderRadius: "20px",
        border: active ? "1.5px solid #5BAD52" : "1px solid #e0e0e0",
        backgroundColor: active ? "#e8f5e6" : "#fff",
        color: active ? "#3a8a32" : "#555",
        fontSize: "12px",
        fontWeight: active ? "bold" : "normal",
        cursor: "pointer",
        transition: "all 0.15s ease",
      }}
    >
      {children}
    </button>
  );
}

function NormalCard({ property }: { property: any }) {
  const mainImage = property.images?.[0]?.url ?? null;
  const typeLabel = PROPERTY_TYPE_MAP[property.property_type ?? ""] ?? "";
  const location = formatLocation(property) || "";
  const isMansion =
    property.property_type === "MANSION" || property.property_type === "NEW_MANSION";
  const isLand = property.property_type === "LAND";
  const displayArea = isMansion
    ? property.area_exclusive_m2
    : isLand
      ? property.area_land_m2
      : property.area_build_m2;
  const areaLabel = isMansion ? "専有" : isLand ? "土地" : "建物";

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
      }}>
        <div style={{ position: "relative", aspectRatio: "4/3", backgroundColor: "#f0f0f0", flexShrink: 0 }}>
          <PropertyImage
            src={mainImage}
            alt={property.title ?? "物件画像"}
            seed={property.id}
            sizes="(max-width: 768px) 100vw, 33vw"
          />
          <div style={{ position: "absolute", top: "10px", left: "10px", display: "flex", gap: "4px", flexWrap: "wrap" }}>
            {typeLabel && (
              <span style={{ backgroundColor: "#5BAD52", color: "#fff", fontSize: "10px", padding: "3px 10px", borderRadius: "20px", fontWeight: "bold" }}>
                {typeLabel}
              </span>
            )}
            {property.is_felia_selection && (
              <span style={{ backgroundColor: "#1a4a24", color: "#C9A84C", fontSize: "10px", padding: "3px 10px", borderRadius: "20px", fontWeight: "bold" }}>
                厳選
              </span>
            )}
          </div>
        </div>
        <div style={{ padding: "14px 16px", flex: 1, display: "flex", flexDirection: "column" }}>
          {property.title && (
            <p style={{
              fontSize: "13px", fontWeight: "bold", color: "#333",
              margin: "0 0 8px", lineHeight: 1.5,
              overflow: "hidden",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}>
              {property.title}
            </p>
          )}
          <div style={{ display: "flex", flexDirection: "column", gap: "4px", marginBottom: "10px", flex: 1 }}>
            {location && <p style={{ fontSize: "12px", color: "#666", margin: 0 }}>📍 {location}</p>}
            {property.station_name1 && (
              <p style={{ fontSize: "12px", color: "#666", margin: 0 }}>
                🚃 {property.station_line1 ? `${property.station_line1} ` : ""}{property.station_name1}駅{property.station_walk1 ? ` 徒歩${property.station_walk1}分` : ""}
              </p>
            )}
            {property.rooms && <p style={{ fontSize: "12px", color: "#666", margin: 0 }}>🚪 {property.rooms}</p>}
            {displayArea != null && (
              <p style={{ fontSize: "12px", color: "#666", margin: 0 }}>
                📐 {areaLabel}{displayArea}㎡
              </p>
            )}
          </div>
          <div style={{ borderTop: "1px solid #f0f0f0", paddingTop: "10px", marginTop: "auto" }}>
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

function ReinsCard({ property }: { property: any }) {
  const title = buildReinsTitle(property);
  const area =
    property.area_build_m2 ?? property.area_exclusive_m2 ?? property.area_m2 ?? property.area_land_m2 ?? null;
  const thumb: string | null =
    property.mansion_building?.exterior_images?.[0]?.url ??
    property.images?.[0]?.url ??
    property.exterior_images?.[0]?.url ??
    property.thumbnail_url ??
    null;

  return (
    <Link
      href={`/reins/${property.id}`}
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
      }}>
        <div style={{ position: "relative", aspectRatio: "4/3", flexShrink: 0 }}>
          <PropertyImage src={thumb} alt={title} seed={property.id} sizes="33vw" />
          <div style={{ position: "absolute", top: "10px", left: "10px" }}>
            <span style={{
              backgroundColor: "#2d4a6a", color: "#fff",
              fontSize: "10px", padding: "3px 8px",
              borderRadius: "3px", fontWeight: "bold",
              fontFamily: "'Montserrat', sans-serif",
            }}>
              REINS
            </span>
          </div>
          {property.property_type && (
            <div style={{ position: "absolute", top: "10px", left: "60px" }}>
              <span style={{
                backgroundColor: "rgba(255,255,255,0.9)", color: "#333",
                fontSize: "10px", padding: "3px 8px",
                borderRadius: "3px", fontWeight: "bold",
              }}>
                {property.property_type}
              </span>
            </div>
          )}
        </div>
        <div style={{ padding: "14px 16px", flex: 1, display: "flex", flexDirection: "column" }}>
          <div style={{ minHeight: "40px", marginBottom: "10px" }}>
            <p style={{
              fontSize: "13px", fontWeight: "bold", color: "#333",
              margin: 0, lineHeight: 1.5,
              overflow: "hidden",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}>
              {title}
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "4px", flex: 1, marginBottom: "10px" }}>
            {property.station_name && (
              <p style={{ fontSize: "12px", color: "#666", margin: 0 }}>
                🚃 {property.station_line ?? ""} {property.station_name}駅{property.walk_minutes ? ` 徒歩${property.walk_minutes}分` : ""}
              </p>
            )}
            {property.rooms && <p style={{ fontSize: "12px", color: "#666", margin: 0 }}>🚪 {property.rooms}</p>}
            {area != null && <p style={{ fontSize: "12px", color: "#666", margin: 0 }}>📐 {area}㎡</p>}
          </div>
          <div style={{ borderTop: "1px solid #f0f0f0", paddingTop: "10px", marginTop: "auto" }}>
            {property.price != null ? (
              <p style={{ margin: 0 }}>
                <span style={{ fontSize: "20px", fontWeight: "bold", color: "#2d4a6a" }}>
                  {property.price.toLocaleString()}
                </span>
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
