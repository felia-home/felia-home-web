"use client";

// app/reins/[id]/page.tsx
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { PropertyImage } from "@/components/ui/PropertyImage";
import LoanSimulator from "@/components/property/LoanSimulator";

function buildReinsTitle(p: any): string {
  const location = [p.area, p.town ?? p.address].filter(Boolean).join(" ");
  const type = p.property_type ?? "";
  const price = p.price != null ? ` ${p.price.toLocaleString()}万円` : "";
  return [location, type, price].filter(Boolean).join(" ") || "物件詳細";
}

function cleanBuiltYear(text: string | null | undefined): string | null {
  if (!text) return null;
  const normalized = text.replace(/\xa0/g, " ").trim();
  if (/^\d+$/.test(normalized)) return null;
  return normalized.replace(/(\d+)$/, "$1月").trim() || null;
}

export default function ReinsDetailPage() {
  const session = useSession();
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [contactPhone, setContactPhone] = useState("03-5981-8601");

  const status = session?.status ?? "loading";

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push(`/members/login?callbackUrl=/reins/${id}`);
    }
  }, [status, router, id]);

  useEffect(() => {
    if (status !== "authenticated") return;
    Promise.all([
      fetch(`/api/reins/${id}`).then((r) => r.json()),
      fetch("/api/company-info").then((r) => r.json()),
    ])
      .then(([propData, compData]) => {
        setProperty(propData.property ?? propData);
        if (compData.company?.phone) setContactPhone(compData.company.phone);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [status, id]);

  if (status === "loading" || status === "unauthenticated" || loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "#888" }}>読み込み中...</p>
      </div>
    );
  }

  if (!property || !property.id) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "16px" }}>
        <p style={{ color: "#888" }}>物件が見つかりませんでした</p>
        <Link href="/search" style={{ color: "#5BAD52", textDecoration: "none" }}>← 物件検索に戻る</Link>
      </div>
    );
  }

  const displayTitle = buildReinsTitle(property);
  const location = [property.area, property.town ?? property.address].filter(Boolean).join(" ");
  const area = property.area_build_m2 ?? property.area_exclusive_m2 ?? property.area_m2 ?? property.area_land_m2;

  const specs: { label: string; value: string | null }[] = [
    { label: "物件種別", value: property.property_type ?? null },
    { label: "販売価格", value: property.price != null ? `${property.price.toLocaleString()}万円` : null },
    { label: "所在地", value: location || null },
    { label: "最寄駅", value: property.station_name ? `${property.station_line ?? ""} ${property.station_name}駅 徒歩${property.walk_minutes ?? "?"}分` : null },
    { label: "間取り", value: property.rooms ?? null },
    { label: "面積", value: area ? `${area}㎡` : null },
    { label: "土地面積", value: property.area_land_m2 ? `${property.area_land_m2}㎡` : null },
    { label: "建物面積", value: property.area_build_m2 ? `${property.area_build_m2}㎡` : null },
    { label: "専有面積", value: property.area_exclusive_m2 ? `${property.area_exclusive_m2}㎡` : null },
    { label: "築年月", value: cleanBuiltYear(property.built_year_text) },
    { label: "用途地域", value: property.use_zone ?? null },
    { label: "取引態様", value: property.transaction_type ?? null },
  ].filter((s) => s.value);

  return (
    <main style={{ backgroundColor: "#f8f8f8", minHeight: "100vh" }}>

      {/* パンくず */}
      <div style={{ backgroundColor: "#fff", borderBottom: "1px solid #e8e8e8", padding: "12px 24px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", gap: "6px", fontSize: "12px", color: "#888" }}>
          <Link href="/" style={{ color: "#888", textDecoration: "none" }}>ホーム</Link>
          <span>›</span>
          <Link href="/search" style={{ color: "#888", textDecoration: "none" }}>物件検索</Link>
          <span>›</span>
          <span style={{ color: "#333" }}>{displayTitle}</span>
        </div>
      </div>

      {/* タイトルカード */}
      <div style={{ backgroundColor: "#fff", padding: "20px 24px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ display: "flex", gap: "8px", marginBottom: "10px", flexWrap: "wrap" }}>
            <span style={{
              backgroundColor: "#2d4a6a", color: "#fff",
              fontSize: "11px", padding: "3px 10px", borderRadius: "20px", fontWeight: "bold",
              fontFamily: "'Montserrat', sans-serif",
            }}>REINS</span>
            {property.property_type && (
              <span style={{ backgroundColor: "#e8f5e6", color: "#2d7a3a", fontSize: "11px", padding: "3px 10px", borderRadius: "20px", fontWeight: "bold" }}>
                {property.property_type}
              </span>
            )}
          </div>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px" }}>
            <h1 style={{ fontSize: "clamp(18px, 3vw, 26px)", fontWeight: "bold", color: "#1a1a1a", margin: 0, lineHeight: 1.4, flex: 1 }}>
              {displayTitle}
            </h1>
          </div>
        </div>
      </div>

      {/* 画像 */}
      <div style={{ backgroundColor: "#fff" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>
          <div style={{ position: "relative", aspectRatio: "16/9", overflow: "hidden" }}>
            <PropertyImage src={null} alt={displayTitle} seed={property.id} sizes="100vw" />
          </div>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "24px 24px 80px" }}>
        <div className="property-detail-grid" style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: "32px", alignItems: "start" }}>

          {/* 左カラム */}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

            {/* 物件概要 */}
            <div style={{ backgroundColor: "#fff", borderRadius: "12px", border: "1px solid #e8e8e8", overflow: "hidden" }}>
              <div style={{ backgroundColor: "#f8f8f8", padding: "14px 20px", borderBottom: "1px solid #e8e8e8" }}>
                <h2 style={{ fontSize: "15px", fontWeight: "bold", color: "#333", margin: 0 }}>物件概要</h2>
              </div>
              <div>
                {specs.map((spec, i) => (
                  <div key={spec.label} style={{ display: "flex", borderBottom: i < specs.length - 1 ? "1px solid #f0f0f0" : "none" }}>
                    <div style={{ width: "120px", flexShrink: 0, padding: "12px 16px", backgroundColor: "#fafafa", fontSize: "12px", color: "#888", fontWeight: "500" }}>
                      {spec.label}
                    </div>
                    <div style={{ flex: 1, padding: "12px 16px", fontSize: "13px", color: "#333" }}>
                      {spec.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 注意事項 */}
            <div style={{ padding: "16px 20px", backgroundColor: "#faf8f4", borderRadius: "8px", border: "1px solid #e0dbd4" }}>
              <p style={{ fontSize: "12px", color: "#aaa", margin: 0, lineHeight: 1.8 }}>
                ※ 本物件情報はレインズ登録物件の会員限定情報です。<br />
                ※ 掲載内容は予告なく変更・終了する場合があります。最新情報は担当者にご確認ください。
              </p>
            </div>
          </div>

          {/* 右カラム */}
          <div style={{ position: "sticky", top: "80px", display: "flex", flexDirection: "column", gap: "16px" }}>

            {/* 価格・CTA */}
            <div style={{ backgroundColor: "#fff", borderRadius: "12px", border: "1px solid #e8e8e8", overflow: "hidden" }}>
              {property.price != null && (
                <div style={{ backgroundColor: "#1a2a3a", padding: "20px 24px", textAlign: "center" }}>
                  <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)", margin: "0 0 6px", letterSpacing: "0.1em", fontFamily: "'Montserrat', sans-serif" }}>PRICE</p>
                  <p style={{ margin: 0 }}>
                    <span style={{ fontSize: "40px", fontWeight: "bold", color: "#fff", fontFamily: "'Montserrat', sans-serif", lineHeight: 1 }}>
                      {property.price.toLocaleString()}
                    </span>
                    <span style={{ fontSize: "18px", color: "rgba(255,255,255,0.8)", marginLeft: "6px" }}>万円</span>
                  </p>
                </div>
              )}
              <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "10px" }}>
                <Link
                  href={`/contact?type=visit&reins_id=${property.id}`}
                  style={{ display: "block", textAlign: "center", padding: "15px", backgroundColor: "#5BAD52", color: "#fff", borderRadius: "8px", textDecoration: "none", fontWeight: "bold", fontSize: "15px" }}
                >
                  🏠 来店・内覧予約
                </Link>
                <Link
                  href={`/contact?type=document&reins_id=${property.id}`}
                  style={{ display: "block", textAlign: "center", padding: "14px", backgroundColor: "#fff", color: "#5BAD52", borderRadius: "8px", textDecoration: "none", fontWeight: "bold", fontSize: "14px", border: "1.5px solid #5BAD52" }}
                >
                  📄 資料請求
                </Link>
                <Link
                  href={`/contact?type=reins&reins_id=${property.id}`}
                  style={{ display: "block", textAlign: "center", padding: "12px", backgroundColor: "#fff", color: "#888", borderRadius: "8px", textDecoration: "none", fontSize: "13px", border: "1px solid #e0e0e0" }}
                >
                  ✉️ メールで問い合わせ
                </Link>
                <a
                  href={`tel:${contactPhone.replace(/-/g, "")}`}
                  style={{ display: "block", textAlign: "center", padding: "12px", backgroundColor: "#fff", color: "#555", borderRadius: "8px", textDecoration: "none", fontSize: "14px", border: "1px solid #e0e0e0", fontWeight: "bold" }}
                >
                  📞 {contactPhone}
                </a>
              </div>
            </div>

            {/* ローンシミュレーター */}
            {property.price != null && <LoanSimulator price={property.price} />}
          </div>
        </div>
      </div>
    </main>
  );
}
