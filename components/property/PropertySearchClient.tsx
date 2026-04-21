"use client";
import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";

const PROPERTY_TYPES = [
  { value: "", label: "すべて", emoji: "🏠" },
  { value: "NEW_HOUSE", label: "新築戸建て", emoji: "🏡" },
  { value: "USED_HOUSE", label: "中古戸建て", emoji: "🏘️" },
  { value: "MANSION", label: "マンション", emoji: "🏢" },
  { value: "LAND", label: "土地", emoji: "🌿" },
];

const PRICE_RANGES = [
  { label: "指定なし",       min: "",      max: ""      },
  { label: "〜7,000万円",    min: "",      max: "7000"  },
  { label: "7,000万〜1億円", min: "7000",  max: "10000" },
  { label: "1億〜1.5億円",   min: "10000", max: "15000" },
  { label: "1.5億〜2億円",   min: "15000", max: "20000" },
  { label: "2億〜3億円",     min: "20000", max: "30000" },
  { label: "3億〜5億円",     min: "30000", max: "50000" },
  { label: "5億円以上",      min: "50000", max: ""      },
];

const CONDITIONS = [
  { value: "eq_parking",        label: "🚗 駐車場あり" },
  { value: "eq_system_kitchen", label: "🍳 システムキッチン" },
  { value: "eq_floor_heating",  label: "🔥 床暖房" },
  { value: "eq_walk_in_closet", label: "👗 ウォークインクローゼット" },
  { value: "eq_bathroom_dryer", label: "🛁 浴室乾燥機" },
  { value: "eq_autolock",       label: "🔒 オートロック" },
  { value: "eq_elevator",       label: "🛗 エレベーター" },
  { value: "eq_pet_ok",         label: "🐾 ペット可" },
  { value: "eq_corner",         label: "🏢 角部屋" },
  { value: "eq_top_floor",      label: "🌆 最上階" },
  { value: "eq_all_electric",   label: "⚡ オール電化" },
  { value: "eq_solar",          label: "☀️ 太陽光発電" },
  { value: "eq_ev_charger",     label: "🔋 EV充電設備" },
  { value: "is_open_house",     label: "🏠 現地販売会あり" },
  { value: "is_felia_selection",label: "⭐ Felia Selection" },
];

const TRAIN_LINES = [
  { group: "JR", lines: ["JR山手線", "JR中央線", "JR総武線", "JR埼京線", "JR京浜東北線", "JR横須賀線"] },
  { group: "東急", lines: ["東急東横線", "東急田園都市線", "東急目黒線", "東急大井町線", "東急池上線", "東急世田谷線"] },
  { group: "東京メトロ", lines: ["銀座線", "丸ノ内線", "日比谷線", "東西線", "千代田線", "有楽町線", "半蔵門線", "南北線", "副都心線"] },
  { group: "都営", lines: ["都営浅草線", "都営三田線", "都営新宿線", "都営大江戸線"] },
  { group: "私鉄", lines: ["小田急小田原線", "小田急多摩線", "京王線", "京王井の頭線", "西武池袋線", "西武新宿線", "東武東上線", "東武伊勢崎線"] },
];

const AREAS = [
  "千代田区","中央区","港区","新宿区","文京区","台東区",
  "品川区","目黒区","大田区","世田谷区","渋谷区","中野区",
  "杉並区","豊島区","北区","荒川区","板橋区","練馬区",
];

const PROPERTY_TYPE_MAP: Record<string, string> = {
  LAND: "土地", USED_HOUSE: "中古戸建", NEW_HOUSE: "新築戸建",
  MANSION: "マンション", USED_MANSION: "中古マンション",
  NEW_MANSION: "新築マンション", OTHER: "その他",
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
  const [properties, setProperties] = useState<Property[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  // 検索条件
  const [keyword, setKeyword] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedPriceRange, setSelectedPriceRange] = useState(0);
  const [selectedArea, setSelectedArea] = useState("");
  const [selectedLine, setSelectedLine] = useState("");
  const [conditions, setConditions] = useState<string[]>([]);

  const doSearch = useCallback(async (page = 1) => {
    setLoading(true);
    setSearched(true);
    setCurrentPage(page);

    const params = new URLSearchParams();
    if (keyword.trim()) params.set("keyword", keyword.trim());
    if (selectedType) params.set("property_type", selectedType);
    const pr = PRICE_RANGES[selectedPriceRange];
    if (pr.min) params.set("price_min", pr.min);
    if (pr.max) params.set("price_max", pr.max);
    if (selectedArea) params.set("city", selectedArea);
    // 沿線（station パラメータで部分一致検索）
    if (selectedLine) params.set("station", selectedLine);
    // こだわり条件
    conditions.forEach(cond => {
      params.set(cond, "true");
    });
    params.set("page", String(page));
    params.set("limit", "12");

    try {
      const res = await fetch(`/api/properties/search?${params.toString()}`);
      const data = await res.json();
      setProperties(data.properties ?? []);
      setTotal(data.total ?? 0);
      setTotalPages(data.total_pages ?? 0);
    } catch {
      setProperties([]);
      setTotal(0);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  }, [keyword, selectedType, selectedPriceRange, selectedArea, selectedLine, conditions]);

  // 初回
  useEffect(() => { doSearch(1); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const reset = () => {
    setKeyword("");
    setSelectedType("");
    setSelectedPriceRange(0);
    setSelectedArea("");
    setSelectedLine("");
    setConditions([]);
  };

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

      {/* ヘッダー */}
      <div style={{
        background: "linear-gradient(135deg, #1a4a24 0%, #2d7a3a 60%, #5BAD52 100%)",
        padding: "48px 24px 40px",
        textAlign: "center",
        color: "#fff",
      }}>
        <p style={{
          fontSize: "11px",
          letterSpacing: "0.3em",
          opacity: 0.7,
          margin: "0 0 12px",
          fontFamily: "'Montserrat', sans-serif",
          fontWeight: "600",
        }}>
          PROPERTY SEARCH
        </p>
        <h1 style={{
          fontSize: "clamp(26px, 4vw, 38px)",
          fontWeight: "bold",
          margin: "0 0 12px",
          lineHeight: 1.2,
        }}>
          物件検索
        </h1>
        <p style={{
          fontSize: "14px",
          opacity: 0.8,
          margin: 0,
          lineHeight: 1.7,
        }}>
          ご希望の条件を選択して物件をお探しください
        </p>
      </div>

      {/* 検索パネル */}
      <div style={{ backgroundColor: "#f8f8f8", borderBottom: "3px solid #5BAD52", padding: "32px 24px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>

          {/* キーワード検索 */}
          <div style={{ marginBottom: "24px" }}>
            <p style={{ fontSize: "13px", fontWeight: "bold", color: "#555", margin: "0 0 10px" }}>
              キーワード検索
            </p>
            <div style={{ display: "flex", gap: "8px" }}>
              <input
                type="text"
                value={keyword}
                onChange={e => setKeyword(e.target.value)}
                onKeyDown={e => e.key === "Enter" && doSearch(1)}
                placeholder="例：新宿区、四ツ谷駅、4LDK など"
                style={{
                  flex: 1,
                  padding: "12px 16px",
                  borderRadius: "8px",
                  border: "2px solid #e0e0e0",
                  fontSize: "15px",
                  outline: "none",
                  transition: "border-color 0.15s",
                }}
                onFocus={e => e.target.style.borderColor = "#5BAD52"}
                onBlur={e => e.target.style.borderColor = "#e0e0e0"}
              />
            </div>
          </div>

          {/* 物件種別 */}
          <div style={{ marginBottom: "20px" }}>
            <p style={{ fontSize: "13px", fontWeight: "bold", color: "#555", margin: "0 0 10px" }}>
              物件種別
            </p>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {PROPERTY_TYPES.map((type) => (
                <button
                  key={type.value}
                  onClick={() => setSelectedType(type.value)}
                  style={{
                    padding: "10px 18px",
                    borderRadius: "8px",
                    border: selectedType === type.value ? "2px solid #5BAD52" : "2px solid #e0e0e0",
                    backgroundColor: selectedType === type.value ? "#5BAD52" : "#fff",
                    color: selectedType === type.value ? "#fff" : "#555",
                    fontSize: "14px",
                    fontWeight: "bold",
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                    display: "flex", alignItems: "center", gap: "6px",
                  }}
                >
                  <span>{type.emoji}</span>
                  <span>{type.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 価格帯 */}
          <div style={{ marginBottom: "20px" }}>
            <p style={{ fontSize: "13px", fontWeight: "bold", color: "#555", margin: "0 0 10px" }}>
              価格帯
            </p>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {PRICE_RANGES.map((range, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedPriceRange(i)}
                  style={{
                    padding: "8px 14px",
                    borderRadius: "6px",
                    border: selectedPriceRange === i ? "2px solid #5BAD52" : "1px solid #e0e0e0",
                    backgroundColor: selectedPriceRange === i ? "#e8f5e6" : "#fff",
                    color: selectedPriceRange === i ? "#3a8a32" : "#555",
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
            <p style={{ fontSize: "13px", fontWeight: "bold", color: "#555", margin: "0 0 10px" }}>
              エリア
            </p>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              <button
                onClick={() => setSelectedArea("")}
                style={{
                  padding: "7px 14px",
                  borderRadius: "6px",
                  border: selectedArea === "" ? "2px solid #5BAD52" : "1px solid #e0e0e0",
                  backgroundColor: selectedArea === "" ? "#e8f5e6" : "#fff",
                  color: selectedArea === "" ? "#3a8a32" : "#555",
                  fontSize: "12px",
                  fontWeight: selectedArea === "" ? "bold" : "normal",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
              >
                すべて
              </button>
              {AREAS.map((area) => (
                <button
                  key={area}
                  onClick={() => setSelectedArea(selectedArea === area ? "" : area)}
                  style={{
                    padding: "7px 14px",
                    borderRadius: "6px",
                    border: selectedArea === area ? "2px solid #5BAD52" : "1px solid #e0e0e0",
                    backgroundColor: selectedArea === area ? "#e8f5e6" : "#fff",
                    color: selectedArea === area ? "#3a8a32" : "#555",
                    fontSize: "12px",
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

          {/* 沿線 */}
          <div style={{ marginBottom: "20px" }}>
            <p style={{ fontSize: "13px", fontWeight: "bold", color: "#555", margin: "0 0 10px" }}>
              沿線
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {TRAIN_LINES.map((group) => (
                <div key={group.group}>
                  <p style={{ fontSize: "11px", color: "#aaa", margin: "0 0 6px", letterSpacing: "0.05em" }}>
                    {group.group}
                  </p>
                  <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                    {group.lines.map((line) => (
                      <button
                        key={line}
                        onClick={() => setSelectedLine(selectedLine === line ? "" : line)}
                        style={{
                          padding: "6px 12px",
                          borderRadius: "4px",
                          border: selectedLine === line ? "2px solid #5BAD52" : "1px solid #e0e0e0",
                          backgroundColor: selectedLine === line ? "#e8f5e6" : "#fff",
                          color: selectedLine === line ? "#3a8a32" : "#555",
                          fontSize: "12px",
                          fontWeight: selectedLine === line ? "bold" : "normal",
                          cursor: "pointer",
                          transition: "all 0.15s ease",
                        }}
                      >
                        {line}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* こだわり条件 */}
          <div style={{ marginBottom: "28px" }}>
            <p style={{ fontSize: "13px", fontWeight: "bold", color: "#555", margin: "0 0 10px" }}>
              こだわり条件
            </p>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {CONDITIONS.map((cond) => {
                const selected = conditions.includes(cond.value);
                return (
                  <button
                    key={cond.value}
                    onClick={() => setConditions(prev =>
                      selected ? prev.filter(c => c !== cond.value) : [...prev, cond.value]
                    )}
                    style={{
                      padding: "7px 14px",
                      borderRadius: "20px",
                      border: selected ? "2px solid #5BAD52" : "1px solid #e0e0e0",
                      backgroundColor: selected ? "#e8f5e6" : "#fff",
                      color: selected ? "#3a8a32" : "#555",
                      fontSize: "12px",
                      fontWeight: selected ? "bold" : "normal",
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                    }}
                  >
                    {cond.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ボタン */}
          <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
            <button
              onClick={() => { reset(); }}
              style={{
                padding: "14px 28px",
                backgroundColor: "#fff",
                color: "#888",
                border: "1px solid #ddd",
                borderRadius: "8px",
                fontSize: "14px",
                cursor: "pointer",
              }}
            >
              リセット
            </button>
            <button
              onClick={() => doSearch(1)}
              disabled={loading}
              style={{
                padding: "14px 56px",
                backgroundColor: "#5BAD52",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                fontSize: "18px",
                fontWeight: "bold",
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.7 : 1,
                boxShadow: "0 4px 16px rgba(91,173,82,0.3)",
                transition: "all 0.15s ease",
              }}
            >
              {loading ? "検索中..." : "検索する"}
            </button>
          </div>
        </div>
      </div>

      {/* 結果エリア */}
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "28px 24px 80px" }}>

        {/* 件数 */}
        {searched && !loading && (
          <div style={{ marginBottom: "20px", display: "flex", alignItems: "center", gap: "12px" }}>
            {total > 0 ? (
              <p style={{ fontSize: "14px", color: "#555", margin: 0 }}>
                <span style={{ fontSize: "22px", fontWeight: "bold", color: "#5BAD52" }}>{total}</span>
                <span style={{ marginLeft: "4px" }}>件の物件が見つかりました</span>
                {currentPage > 1 && (
                  <span style={{ marginLeft: "8px", fontSize: "12px", color: "#aaa" }}>
                    （{currentPage}/{totalPages}ページ）
                  </span>
                )}
              </p>
            ) : (
              <p style={{ fontSize: "14px", color: "#888", margin: 0 }}>
                条件に合う物件が見つかりませんでした
              </p>
            )}
          </div>
        )}

        {/* ローディング */}
        {loading && (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <div style={{
              width: "48px", height: "48px",
              border: "4px solid #e8f5e6",
              borderTop: "4px solid #5BAD52",
              borderRadius: "50%",
              animation: "spin 0.8s linear infinite",
              margin: "0 auto 16px",
            }} />
            <p style={{ color: "#888", fontSize: "14px" }}>検索中...</p>
          </div>
        )}

        {/* 結果なし */}
        {!loading && searched && properties.length === 0 && (
          <div style={{
            textAlign: "center", padding: "80px 24px",
            backgroundColor: "#fff", borderRadius: "12px",
            border: "1px solid #e8e8e8",
          }}>
            <p style={{ fontSize: "48px", margin: "0 0 16px" }}>🔍</p>
            <p style={{ fontSize: "18px", fontWeight: "bold", color: "#333", margin: "0 0 8px" }}>
              条件に合う物件が見つかりませんでした
            </p>
            <p style={{ fontSize: "14px", color: "#888", margin: "0 0 24px" }}>
              キーワードを変えたり、条件を広げて再度お試しください
            </p>
            <button
              onClick={() => { reset(); doSearch(1); }}
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
          <>
            <div className="properties-search-grid">
              {properties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>

            {/* ページネーション */}
            {totalPages > 1 && (
              <div style={{
                display: "flex", justifyContent: "center",
                gap: "8px", marginTop: "40px", flexWrap: "wrap",
              }}>
                <button
                  onClick={() => { doSearch(currentPage - 1); window.scrollTo(0, 0); }}
                  disabled={currentPage <= 1}
                  style={{
                    padding: "10px 16px",
                    border: "1px solid #e0e0e0",
                    borderRadius: "6px",
                    backgroundColor: "#fff",
                    color: currentPage <= 1 ? "#ccc" : "#555",
                    cursor: currentPage <= 1 ? "not-allowed" : "pointer",
                    fontSize: "13px",
                  }}
                >
                  ← 前へ
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 2)
                  .map((page, i, arr) => (
                    <>
                      {i > 0 && arr[i - 1] !== page - 1 && (
                        <span key={`ellipsis-${i}`} style={{ padding: "10px 6px", color: "#aaa" }}>...</span>
                      )}
                      <button
                        key={page}
                        onClick={() => { doSearch(page); window.scrollTo(0, 0); }}
                        style={{
                          padding: "10px 14px",
                          border: currentPage === page ? "2px solid #5BAD52" : "1px solid #e0e0e0",
                          borderRadius: "6px",
                          backgroundColor: currentPage === page ? "#5BAD52" : "#fff",
                          color: currentPage === page ? "#fff" : "#555",
                          cursor: "pointer",
                          fontSize: "13px",
                          fontWeight: currentPage === page ? "bold" : "normal",
                        }}
                      >
                        {page}
                      </button>
                    </>
                  ))
                }
                <button
                  onClick={() => { doSearch(currentPage + 1); window.scrollTo(0, 0); }}
                  disabled={currentPage >= totalPages}
                  style={{
                    padding: "10px 16px",
                    border: "1px solid #e0e0e0",
                    borderRadius: "6px",
                    backgroundColor: "#fff",
                    color: currentPage >= totalPages ? "#ccc" : "#555",
                    cursor: currentPage >= totalPages ? "not-allowed" : "pointer",
                    fontSize: "13px",
                  }}
                >
                  次へ →
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
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
        transform: hovered ? "translateY(-3px)" : "translateY(0)",
        transition: "all 0.2s ease",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}>
        {/* 画像 */}
        <div style={{ position: "relative", aspectRatio: "4/3", backgroundColor: "#f0f0f0", flexShrink: 0 }}>
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
              justifyContent: "center",
              flexDirection: "column", gap: "8px",
              color: "#bbb",
            }}>
              <span style={{ fontSize: "32px" }}>🏠</span>
              <span style={{ fontSize: "12px" }}>画像なし</span>
            </div>
          )}
          <div style={{ position: "absolute", top: "10px", left: "10px", display: "flex", gap: "4px", flexWrap: "wrap" }}>
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
        <div style={{ padding: "14px 16px", flex: 1, display: "flex", flexDirection: "column" }}>
          {property.title && (
            <p style={{
              fontSize: "13px", fontWeight: "bold", color: "#333",
              margin: "0 0 8px", lineHeight: 1.4,
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
            }}>
              {property.title}
            </p>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: "3px", marginBottom: "10px", flex: 1 }}>
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
                🚪 {property.rooms}
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
