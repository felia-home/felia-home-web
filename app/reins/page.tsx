"use client";

// app/reins/page.tsx
import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface ReinsProperty {
  id: string;
  source_type: string;
  property_type: string;
  price: number | null;
  address: string | null;
  area: string | null;
  rooms: string | null;
  area_m2: number | null;
  building_name: string | null;
  station_line: string | null;
  station_name: string | null;
  walk_minutes: number | null;
  built_year_text: string | null;
}

function PropertyPlaceholder({ type }: { type: string }) {
  if (type === "MANSION") {
    return (
      <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
        <rect width="400" height="300" fill="#1a2a3a"/>
        <rect x="60" y="60" width="280" height="200" fill="#2a3a4a" rx="4"/>
        <rect x="80" y="80" width="60" height="50" fill="#3a4a5a" rx="2"/>
        <rect x="160" y="80" width="60" height="50" fill="#3a4a5a" rx="2"/>
        <rect x="240" y="80" width="60" height="50" fill="#3a4a5a" rx="2"/>
        <rect x="80" y="150" width="60" height="50" fill="#3a4a5a" rx="2"/>
        <rect x="160" y="150" width="60" height="50" fill="#3a4a5a" rx="2"/>
        <rect x="240" y="150" width="60" height="50" fill="#4a6a8a" rx="2"/>
        <rect x="170" y="220" width="60" height="40" fill="#3a4a5a"/>
        <text x="200" y="285" textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="11" fontFamily="sans-serif">MANSION</text>
      </svg>
    );
  }
  if (type === "HOUSE") {
    return (
      <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
        <rect width="400" height="300" fill="#1a2a1a"/>
        <polygon points="200,60 340,160 60,160" fill="#2a4a2a"/>
        <rect x="80" y="160" width="240" height="120" fill="#2a3a2a"/>
        <rect x="100" y="180" width="70" height="60" fill="#3a5a3a" rx="2"/>
        <rect x="230" y="180" width="70" height="60" fill="#3a5a3a" rx="2"/>
        <rect x="165" y="200" width="70" height="80" fill="#2a4a2a"/>
        <text x="200" y="285" textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="11" fontFamily="sans-serif">HOUSE</text>
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
      <rect width="400" height="300" fill="#1a1a0a"/>
      <rect x="40" y="100" width="320" height="160" fill="#2a2a1a" rx="4"/>
      <line x1="40" y1="130" x2="360" y2="130" stroke="#3a3a2a" strokeWidth="1" strokeDasharray="8,4"/>
      <line x1="40" y1="160" x2="360" y2="160" stroke="#3a3a2a" strokeWidth="1" strokeDasharray="8,4"/>
      <line x1="40" y1="190" x2="360" y2="190" stroke="#3a3a2a" strokeWidth="1" strokeDasharray="8,4"/>
      <line x1="40" y1="220" x2="360" y2="220" stroke="#3a3a2a" strokeWidth="1" strokeDasharray="8,4"/>
      <line x1="130" y1="100" x2="130" y2="260" stroke="#3a3a2a" strokeWidth="1" strokeDasharray="8,4"/>
      <line x1="220" y1="100" x2="220" y2="260" stroke="#3a3a2a" strokeWidth="1" strokeDasharray="8,4"/>
      <line x1="310" y1="100" x2="310" y2="260" stroke="#3a3a2a" strokeWidth="1" strokeDasharray="8,4"/>
      <text x="200" y="85" textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="11" fontFamily="sans-serif">LAND</text>
    </svg>
  );
}

const AREAS = [
  "千代田区","中央区","港区","新宿区","文京区","台東区",
  "品川区","目黒区","大田区","世田谷区","渋谷区","中野区",
  "杉並区","豊島区","北区","荒川区","板橋区","練馬区",
];

export default function ReinsPage() {
  const session = useSession();
  const router = useRouter();
  const [properties, setProperties] = useState<ReinsProperty[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const [filterType, setFilterType] = useState("");
  const [filterArea, setFilterArea] = useState("");
  const [filterPriceMax, setFilterPriceMax] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const status = session?.status ?? "loading";

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/members/login?callbackUrl=/reins");
    }
  }, [status, router]);

  const fetchReins = useCallback(async (p = 1) => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filterType) params.set("source_type", filterType);
    if (filterArea) params.set("area", filterArea);
    if (filterPriceMax) params.set("price_max", filterPriceMax);
    params.set("page", String(p));
    params.set("limit", "18");

    try {
      const res = await fetch(`/api/reins?${params.toString()}`);
      const data = await res.json();
      setProperties(data.properties ?? []);
      setTotal(data.total ?? 0);
      setTotalPages(Math.ceil((data.total ?? 0) / 18));
      setPage(p);
    } catch {
      setProperties([]);
    } finally {
      setLoading(false);
    }
  }, [filterType, filterArea, filterPriceMax]);

  useEffect(() => {
    if (status !== "authenticated") return;
    fetchReins(1);
  }, [filterType, filterArea, filterPriceMax, status, fetchReins]);

  if (status === "loading" || status === "unauthenticated") {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "#888" }}>読み込み中...</p>
      </div>
    );
  }

  return (
    <main style={{ backgroundColor: "#f8f8f8", minHeight: "100vh" }}>

      {/* ヘッダー */}
      <div style={{
        background: "linear-gradient(135deg, #1a2a3a 0%, #2d4a6a 60%, #3d6a9a 100%)",
        padding: "56px 24px 40px",
        color: "#fff",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: "-60px", right: "-60px", width: "300px", height: "300px", borderRadius: "50%", backgroundColor: "rgba(255,255,255,0.03)" }} />
        <div style={{ maxWidth: "1200px", margin: "0 auto", position: "relative", zIndex: 1 }}>
          {/* パンくず */}
          <div style={{ display: "flex", gap: "6px", fontSize: "12px", color: "rgba(255,255,255,0.5)", marginBottom: "20px" }}>
            <Link href="/" style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none" }}>ホーム</Link>
            <span>›</span>
            <span style={{ color: "rgba(255,255,255,0.9)" }}>REINS物件</span>
          </div>
          <p style={{ fontSize: "11px", letterSpacing: "0.4em", color: "rgba(255,255,255,0.5)", margin: "0 0 12px", fontFamily: "'Montserrat', sans-serif", fontWeight: "600" }}>
            MEMBERS ONLY
          </p>
          <h1 style={{
            fontFamily: "'Noto Serif JP', serif",
            fontSize: "clamp(24px, 4vw, 36px)",
            fontWeight: "600", color: "#fff",
            margin: "0 0 8px",
          }}>
            REINS物件情報
          </h1>
          <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.65)", margin: 0, lineHeight: 1.8 }}>
            レインズ登録物件を会員様限定でご覧いただけます。<br />
            ご興味のある物件はお気軽にお問い合わせください。
          </p>
        </div>
      </div>

      {/* フィルター */}
      <div style={{ backgroundColor: "#fff", borderBottom: "1px solid #e8e8e8", padding: "16px 24px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", gap: "16px", flexWrap: "wrap", alignItems: "center" }}>
          <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
            <span style={{ fontSize: "12px", color: "#888", whiteSpace: "nowrap" }}>種別</span>
            <div style={{ display: "flex", gap: "4px" }}>
              {[
                { value: "", label: "すべて" },
                { value: "MANSION", label: "マンション" },
                { value: "HOUSE", label: "戸建て" },
                { value: "LAND", label: "土地" },
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setFilterType(opt.value)}
                  style={{
                    padding: "5px 12px", borderRadius: "4px",
                    border: filterType === opt.value ? "1.5px solid #2d4a6a" : "1px solid #e0e0e0",
                    backgroundColor: filterType === opt.value ? "#2d4a6a" : "#fff",
                    color: filterType === opt.value ? "#fff" : "#555",
                    fontSize: "12px", cursor: "pointer",
                    fontWeight: filterType === opt.value ? "bold" : "normal",
                    transition: "all 0.15s ease",
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
            <span style={{ fontSize: "12px", color: "#888", whiteSpace: "nowrap" }}>エリア</span>
            <select
              value={filterArea}
              onChange={(e) => setFilterArea(e.target.value)}
              style={{ padding: "6px 10px", borderRadius: "4px", border: "1px solid #e0e0e0", fontSize: "12px", color: "#333", backgroundColor: "#fff" }}
            >
              <option value="">すべて</option>
              {AREAS.map((a) => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>

          <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
            <span style={{ fontSize: "12px", color: "#888", whiteSpace: "nowrap" }}>価格上限</span>
            <select
              value={filterPriceMax}
              onChange={(e) => setFilterPriceMax(e.target.value)}
              style={{ padding: "6px 10px", borderRadius: "4px", border: "1px solid #e0e0e0", fontSize: "12px", color: "#333", backgroundColor: "#fff" }}
            >
              <option value="">指定なし</option>
              <option value="5000">5,000万円</option>
              <option value="7000">7,000万円</option>
              <option value="10000">1億円</option>
              <option value="15000">1.5億円</option>
              <option value="20000">2億円</option>
              <option value="30000">3億円</option>
            </select>
          </div>

          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ fontSize: "13px", color: "#555" }}>
              <span style={{ fontSize: "20px", fontWeight: "bold", color: "#2d4a6a" }}>{properties.length}</span>
              <span style={{ marginLeft: "2px" }}>件表示</span>
              <span style={{ fontSize: "11px", color: "#aaa", marginLeft: "6px" }}>/ 全{total.toLocaleString()}件</span>
            </span>
            {(filterType || filterArea || filterPriceMax) && (
              <button
                onClick={() => { setFilterType(""); setFilterArea(""); setFilterPriceMax(""); }}
                style={{ padding: "5px 10px", border: "1px solid #e0e0e0", borderRadius: "4px", backgroundColor: "#fff", color: "#888", fontSize: "11px", cursor: "pointer" }}
              >
                リセット
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 物件一覧 */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "28px 24px 80px" }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <div style={{ width: "40px", height: "40px", border: "3px solid #e8e8e8", borderTop: "3px solid #2d4a6a", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 16px" }} />
            <p style={{ color: "#888", fontSize: "14px" }}>レインズ物件を読み込み中...</p>
          </div>
        ) : properties.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0", backgroundColor: "#fff", borderRadius: "12px", border: "1px solid #e8e8e8" }}>
            <p style={{ fontSize: "16px", color: "#888" }}>条件に合う物件が見つかりませんでした</p>
          </div>
        ) : (
          <>
            <div className="properties-search-grid">
              {properties.map((property) => (
                <ReinsCard key={property.id} property={property} />
              ))}
            </div>

            {/* ページネーション */}
            {totalPages > 1 && (
              <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginTop: "40px" }}>
                <button
                  onClick={() => { fetchReins(page - 1); window.scrollTo(0, 0); }}
                  disabled={page <= 1}
                  style={{
                    padding: "10px 16px", border: "1px solid #e0e0e0",
                    borderRadius: "6px", backgroundColor: "#fff",
                    color: page <= 1 ? "#ccc" : "#555",
                    cursor: page <= 1 ? "not-allowed" : "pointer", fontSize: "13px",
                  }}
                >
                  ← 前へ
                </button>
                <span style={{ padding: "10px 16px", fontSize: "13px", color: "#555" }}>
                  {page} / {totalPages}ページ
                </span>
                <button
                  onClick={() => { fetchReins(page + 1); window.scrollTo(0, 0); }}
                  disabled={page >= totalPages}
                  style={{
                    padding: "10px 16px", border: "1px solid #e0e0e0",
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
        )}
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </main>
  );
}

function ReinsCard({ property }: { property: ReinsProperty }) {
  const [hovered, setHovered] = useState(false);
  const location = [property.area, property.address].filter(Boolean).join(" ");

  return (
    <Link
      href={`/contact?reins_id=${property.id}&type=reins&address=${encodeURIComponent(property.address ?? "")}`}
      style={{ textDecoration: "none", color: "inherit", display: "block" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{
        backgroundColor: "#fff",
        borderRadius: "10px",
        overflow: "hidden",
        border: "1px solid #e8e8e8",
        boxShadow: hovered ? "0 8px 24px rgba(0,0,0,0.1)" : "0 2px 8px rgba(0,0,0,0.05)",
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
        transition: "all 0.2s ease",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}>
        {/* 画像エリア */}
        <div style={{ position: "relative", aspectRatio: "4/3", backgroundColor: "#f0f0f0", flexShrink: 0, overflow: "hidden" }}>
          <PropertyPlaceholder type={property.source_type} />
          {/* バッジ */}
          <div style={{ position: "absolute", top: "10px", left: "10px", display: "flex", gap: "4px" }}>
            <span style={{
              backgroundColor: "#2d4a6a", color: "#fff",
              fontSize: "10px", padding: "3px 8px",
              borderRadius: "3px", fontWeight: "bold",
              fontFamily: "'Montserrat', sans-serif",
              letterSpacing: "0.05em",
            }}>
              REINS
            </span>
            <span style={{
              backgroundColor: "rgba(255,255,255,0.9)", color: "#2d4a6a",
              fontSize: "10px", padding: "3px 8px",
              borderRadius: "3px", fontWeight: "bold",
            }}>
              {property.property_type}
            </span>
          </div>
        </div>

        {/* 情報 */}
        <div style={{ padding: "14px 16px", flex: 1, display: "flex", flexDirection: "column" }}>
          {property.building_name && (
            <p style={{ fontSize: "14px", fontWeight: "bold", color: "#333", margin: "0 0 6px", lineHeight: 1.4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {property.building_name}
            </p>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: "4px", marginBottom: "12px", flex: 1 }}>
            {location && (
              <p style={{ fontSize: "12px", color: "#666", margin: 0 }}>📍 {location}</p>
            )}
            {property.station_name && (
              <p style={{ fontSize: "12px", color: "#666", margin: 0 }}>
                🚃 {property.station_line} {property.station_name}駅
                {property.walk_minutes && ` 徒歩${property.walk_minutes}分`}
              </p>
            )}
            {property.rooms && (
              <p style={{ fontSize: "12px", color: "#666", margin: 0 }}>🚪 {property.rooms}</p>
            )}
            {property.area_m2 && (
              <p style={{ fontSize: "12px", color: "#666", margin: 0 }}>📐 {property.area_m2}㎡</p>
            )}
            {property.built_year_text && (
              <p style={{ fontSize: "12px", color: "#666", margin: 0 }}>
                📅 {property.built_year_text.replace(/(\d+)$/, "$1月")}
              </p>
            )}
          </div>

          <div style={{ borderTop: "1px solid #f0f0f0", paddingTop: "10px", display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
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
            <span style={{ fontSize: "11px", color: "#aaa" }}>詳細・問い合わせ →</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
