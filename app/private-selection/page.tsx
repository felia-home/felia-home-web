"use client";

// app/private-selection/page.tsx
import { useEffect, useState, useMemo } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface PrivateProperty {
  id: string;
  property_no?: string | null;
  property_type?: string | null;
  is_land?: boolean;
  is_house?: boolean;
  is_mansion?: boolean;
  area?: string | null;
  town?: string | null;
  price?: number | string | null;
  price_display?: string | null;
  area_land_m2?: number | null;
  area_build_m2?: number | null;
  commission?: string | null;
  note?: string | null;
  transaction_type?: string | null;
  info_date?: string | null;
  seller_name?: string | null;
  status?: string | null;
}

function priceToNumber(p: PrivateProperty): number {
  if (p.price_display) {
    const cleaned = String(p.price_display).replace(/[^\d.]/g, "");
    const n = parseFloat(cleaned);
    if (!isNaN(n)) return n;
  }
  if (p.price != null) {
    const n = parseFloat(String(p.price).replace(/[^\d.]/g, ""));
    if (!isNaN(n)) return n;
  }
  return 0;
}

function formatPrice(p: PrivateProperty): string | null {
  if (p.price_display && String(p.price_display).trim()) {
    const pd = String(p.price_display).trim();
    if (pd.includes("万円") || pd.includes("円")) return pd;
    return `${pd}万円`;
  }
  if (p.price != null) {
    const n = Number(p.price);
    if (!isNaN(n)) return `${n.toLocaleString()}万円`;
  }
  return null;
}

function typeLabel(p: PrivateProperty): string {
  if (p.property_type) return p.property_type;
  if (p.is_mansion) return "マンション";
  if (p.is_house) return "戸建て";
  if (p.is_land) return "土地";
  return "物件";
}

const AREAS = [
  "渋谷区", "新宿区", "杉並区", "世田谷区",
  "文京区", "豊島区", "中野区", "目黒区",
  "北区", "板橋区", "練馬区", "品川区",
  "港区", "大田区", "千代田区", "中央区",
  "江東区", "墨田区",
];

export default function PrivateSelectionPage() {
  const session = useSession();
  const status = session?.status ?? "loading";
  const router = useRouter();

  const [properties, setProperties] = useState<PrivateProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<string>("");
  const [filterArea, setFilterArea] = useState<string>("");
  const [company, setCompany] = useState<{ phone: string; name: string } | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/members/login?callbackUrl=/private-selection");
    }
  }, [status, router]);

  useEffect(() => {
    if (status !== "authenticated") return;
    fetch("/api/private-properties")
      .then((r) => r.json())
      .then((data) => {
        const arr = Array.isArray(data) ? data : data.properties ?? [];
        setProperties(arr);
      })
      .catch(() => setProperties([]))
      .finally(() => setLoading(false));
    // 会社情報取得
    fetch("/api/company-info")
      .then((r) => r.json())
      .then((d) => setCompany(d.company ?? null))
      .catch(() => null);
  }, [status]);

  const filtered = useMemo(() => {
    let list = [...properties];
    if (filterType) {
      list = list.filter((p) => {
        const tl = typeLabel(p);
        return tl === filterType;
      });
    }
    if (filterArea) {
      list = list.filter((p) =>
        [p.area, p.town].filter(Boolean).join("").includes(filterArea)
      );
    }
    list.sort((a, b) => priceToNumber(b) - priceToNumber(a));
    return list;
  }, [properties, filterType, filterArea]);

  if (status === "loading" || (status === "unauthenticated")) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#f7f5f0", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "#888", fontSize: "14px" }}>読み込み中...</p>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: "#f7f5f0", minHeight: "100vh" }}>

      {/* ページヘッダー */}
      <div style={{
        background: "linear-gradient(160deg, #0d2218 0%, #1a3d28 60%, #2d5e4a 100%)",
        padding: "80px 24px 64px",
        textAlign: "center",
        color: "#fff",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: "-60px", right: "-60px", width: "300px", height: "300px", borderRadius: "50%", backgroundColor: "rgba(201,168,76,0.05)" }} />
        <p style={{
          fontSize: "11px", letterSpacing: "0.4em",
          color: "#C9A84C", margin: "0 0 16px",
          fontFamily: "'Montserrat', sans-serif", fontWeight: "600",
        }}>
          PRIVATE SELECTION
        </p>
        <h1 style={{
          fontFamily: "'Noto Serif JP', serif",
          fontSize: "clamp(24px, 4vw, 38px)",
          fontWeight: "600", color: "#fff",
          margin: "0 0 16px", lineHeight: 1.3,
        }}>
          会員限定・非公開物件
        </h1>
        <div style={{ width: "40px", height: "1px", backgroundColor: "#C9A84C", margin: "0 auto 20px" }} />
        <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.65)", margin: 0, lineHeight: 1.8 }}>
          一般には公開されていない、フェリアホーム独自ルートの物件情報です。<br />
          詳細・内覧のご希望はお気軽にお問い合わせください。
        </p>
      </div>

      {/* フィルター */}
      <div style={{ backgroundColor: "#fff", borderBottom: "1px solid #e0dbd4" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "16px 24px", display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
          <span style={{ fontSize: "13px", color: "#888", whiteSpace: "nowrap" }}>絞り込み：</span>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            style={{
              padding: "8px 12px",
              fontSize: "13px",
              border: "1px solid #e0dbd4",
              borderRadius: "4px",
              backgroundColor: "#fff",
              color: "#333",
              cursor: "pointer",
              minWidth: "120px",
            }}
          >
            <option value="">物件種別（すべて）</option>
            <option value="土地">土地</option>
            <option value="戸建て">戸建て</option>
            <option value="マンション">マンション</option>
          </select>

          <select
            value={filterArea}
            onChange={(e) => setFilterArea(e.target.value)}
            style={{
              padding: "8px 12px",
              fontSize: "13px",
              border: "1px solid #e0dbd4",
              borderRadius: "4px",
              backgroundColor: "#fff",
              color: "#333",
              cursor: "pointer",
              minWidth: "140px",
            }}
          >
            <option value="">エリア（すべて）</option>
            {AREAS.map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>

          {(filterType || filterArea) && (
            <button
              onClick={() => { setFilterType(""); setFilterArea(""); }}
              style={{
                padding: "8px 14px",
                fontSize: "12px",
                border: "1px solid #ddd",
                borderRadius: "4px",
                backgroundColor: "transparent",
                color: "#888",
                cursor: "pointer",
              }}
            >
              リセット
            </button>
          )}

          <span style={{ marginLeft: "auto", fontSize: "13px", color: "#888" }}>
            {loading ? "読み込み中..." : `${filtered.length}件`}
          </span>
        </div>
      </div>

      {/* 物件グリッド */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px 80px" }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: "80px 0", color: "#aaa", fontSize: "14px" }}>
            物件情報を読み込み中...
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0", color: "#aaa", fontSize: "14px" }}>
            条件に合う物件が見つかりませんでした
          </div>
        ) : (
          <div className="private-selection-grid">
            {filtered.map((p) => (
              <PrivateCard key={p.id} property={p} phone={company?.phone ?? "03-5981-8601"} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function PrivateCard({ property, phone }: { property: PrivateProperty; phone: string }) {
  const phoneTel = phone.replace(/-/g, "");
  const tl = typeLabel(property);
  const location = [property.area, property.town].filter(Boolean).join(" ");
  const priceText = formatPrice(property);
  const infoDate = property.info_date ? new Date(property.info_date) : null;
  const dateLabel = infoDate && !isNaN(infoDate.getTime())
    ? `${infoDate.getFullYear()}年${infoDate.getMonth() + 1}月${infoDate.getDate()}日`
    : "";

  return (
    <div style={{
      backgroundColor: "#fff",
      borderRadius: "4px",
      overflow: "hidden",
      border: "1px solid #e0dbd4",
      display: "flex",
      flexDirection: "column",
    }}>
      {/* 上部：物件種別・番号 */}
      <div style={{
        backgroundColor: "#0d2218",
        padding: "20px 24px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
      }}>
        <div>
          <span style={{
            display: "inline-block",
            border: "1px solid #C9A84C",
            color: "#C9A84C",
            fontSize: "10px",
            padding: "3px 10px",
            borderRadius: "2px",
            letterSpacing: "0.1em",
            fontFamily: "'Montserrat', sans-serif",
            marginBottom: "8px",
          }}>
            {tl.toUpperCase()}
          </span>
          <p style={{
            fontFamily: "'Noto Serif JP', serif",
            fontSize: "18px",
            fontWeight: "600",
            color: "#fff",
            margin: 0,
            lineHeight: 1.4,
          }}>
            {location || "所在地非公開"}
          </p>
        </div>
        {property.property_no && (
          <span style={{
            fontSize: "11px",
            color: "rgba(255,255,255,0.3)",
            fontFamily: "'Montserrat', sans-serif",
            flexShrink: 0,
            marginLeft: "12px",
          }}>
            No.{property.property_no}
          </span>
        )}
      </div>

      {/* 下部：情報 + CTA */}
      <div style={{ padding: "20px 24px", flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between", backgroundColor: "#f7f5f0" }}>
        <div>
          {/* 価格 */}
          <div style={{ marginBottom: "16px" }}>
            {priceText ? (
              <p style={{ margin: 0 }}>
                <span style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: "24px",
                  fontWeight: "700",
                  color: "#0d2218",
                  letterSpacing: "-0.02em",
                }}>
                  {priceText}
                </span>
              </p>
            ) : (
              <p style={{ fontSize: "16px", color: "#888", margin: 0, fontStyle: "italic" }}>価格応相談</p>
            )}
          </div>

          {/* スペック */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {property.area_land_m2 && (
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
                <span style={{ color: "#888" }}>土地面積</span>
                <span style={{ color: "#333", fontWeight: "500" }}>{property.area_land_m2}㎡</span>
              </div>
            )}
            {property.area_build_m2 && (
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
                <span style={{ color: "#888" }}>建物面積</span>
                <span style={{ color: "#333", fontWeight: "500" }}>{property.area_build_m2}㎡</span>
              </div>
            )}
            {property.transaction_type && (
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
                <span style={{ color: "#888" }}>取引態様</span>
                <span style={{ color: "#333", fontWeight: "500" }}>{property.transaction_type}</span>
              </div>
            )}
            {dateLabel && (
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
                <span style={{ color: "#888" }}>情報日付</span>
                <span style={{ color: "#333", fontWeight: "500" }}>{dateLabel}</span>
              </div>
            )}
          </div>
        </div>

        {/* CTA */}
        <div style={{ marginTop: "20px", display: "flex", flexDirection: "column", gap: "8px" }}>
          <Link
            href={`/contact?property_id=${property.id}&type=private&property_no=${property.property_no ?? ""}`}
            style={{
              display: "block",
              textAlign: "center",
              padding: "12px",
              backgroundColor: "#0d2218",
              color: "#fff",
              borderRadius: "3px",
              textDecoration: "none",
              fontSize: "13px",
              fontWeight: "bold",
              letterSpacing: "0.05em",
            }}
          >
            メールで問い合わせる
          </Link>
          <a
            href={`tel:${phoneTel}`}
            style={{
              display: "block",
              textAlign: "center",
              padding: "10px",
              backgroundColor: "transparent",
              color: "#0d2218",
              borderRadius: "3px",
              textDecoration: "none",
              fontSize: "13px",
              border: "1px solid #c0bbb4",
            }}
          >
            📞 {phone}
          </a>
        </div>
      </div>
    </div>
  );
}
