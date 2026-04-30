"use client";

// app/reins/[id]/page.tsx
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { PropertyImage } from "@/components/ui/PropertyImage";

function cleanBuiltYear(text: string | null | undefined): string | null {
  if (!text) return null;
  const normalized = text.replace(/\xa0/g, " ").trim();
  if (/^\d+$/.test(normalized)) return null;
  const result = normalized.replace(/(\d+)$/, "$1月").trim();
  return result || null;
}

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
  area_build_m2: number | null;
  area_land_m2: number | null;
  area_exclusive_m2: number | null;
  building_name: string | null;
  station_line: string | null;
  station_name: string | null;
  walk_minutes: number | null;
  built_year_text: string | null;
  use_zone: string | null;
  transaction_type: string | null;
}

export default function ReinsDetailPage() {
  const session = useSession();
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [property, setProperty] = useState<ReinsProperty | null>(null);
  const [loading, setLoading] = useState(true);
  const [company, setCompany] = useState<{ phone: string; name: string } | null>(null);

  const status = session?.status ?? "loading";

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/members/login?callbackUrl=/reins");
    }
  }, [status, router]);

  useEffect(() => {
    if (status !== "authenticated") return;
    Promise.all([
      fetch(`/api/reins/${id}`).then((r) => r.json()),
      fetch("/api/company-info").then((r) => r.json()),
    ])
      .then(([propData, compData]) => {
        setProperty(propData.property ?? propData);
        setCompany(compData.company ?? null);
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
        <p style={{ fontSize: "16px", color: "#888" }}>物件が見つかりませんでした</p>
        <Link href="/reins" style={{ color: "#2d4a6a", textDecoration: "none" }}>← 一覧に戻る</Link>
      </div>
    );
  }

  const typeLabel = property.source_type === "MANSION" ? "マンション"
    : property.source_type === "HOUSE" ? "戸建て"
    : property.source_type === "LAND" ? "土地" : "物件";

  const location = [property.area, property.town ?? property.address].filter(Boolean).join(" ");
  const area = property.area_build_m2 ?? property.area_exclusive_m2 ?? property.area_m2 ?? property.area_land_m2;
  const phone = company?.phone ?? "03-5981-8601";
  const phoneTel = phone.replace(/-/g, "");

  const specs: { label: string; value: string | null }[] = [
    { label: "物件種別", value: typeLabel },
    { label: "所在地", value: location || "詳細はお問い合わせください" },
    { label: "間取り", value: property.rooms ?? null },
    { label: "面積", value: area ? `${area}㎡` : null },
    { label: "土地面積", value: property.area_land_m2 ? `${property.area_land_m2}㎡` : null },
    { label: "建物面積", value: property.area_build_m2 ? `${property.area_build_m2}㎡` : null },
    { label: "専有面積", value: property.area_exclusive_m2 ? `${property.area_exclusive_m2}㎡` : null },
    { label: "築年月", value: cleanBuiltYear(property.built_year_text) },
    { label: "最寄駅", value: property.station_name ? `${property.station_line ?? ""} ${property.station_name}駅 徒歩${property.walk_minutes ?? "?"}分` : null },
    { label: "用途地域", value: property.use_zone ?? null },
    { label: "取引態様", value: property.transaction_type ?? null },
  ].filter((s) => s.value);

  return (
    <main style={{ backgroundColor: "#f8f8f8", minHeight: "100vh" }}>

      {/* パンくず */}
      <div style={{ backgroundColor: "#fff", borderBottom: "1px solid #e8e8e8", padding: "12px 24px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", display: "flex", gap: "8px", fontSize: "12px", color: "#888" }}>
          <Link href="/" style={{ color: "#888", textDecoration: "none" }}>ホーム</Link>
          <span>›</span>
          <Link href="/reins" style={{ color: "#888", textDecoration: "none" }}>REINS物件</Link>
          <span>›</span>
          <span style={{ color: "#333" }}>{location || "物件詳細"}</span>
        </div>
      </div>

      {/* ヒーロー */}
      <div style={{
        background: "linear-gradient(160deg, #1a2a3a 0%, #2d4a6a 60%, #3d6a9a 100%)",
        padding: "48px 24px",
        color: "#fff",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", gap: "10px", marginBottom: "16px" }}>
            <span style={{
              backgroundColor: "#2d4a6a", color: "#fff",
              fontSize: "11px", padding: "4px 12px", borderRadius: "3px",
              fontWeight: "bold", fontFamily: "'Montserrat', sans-serif",
              border: "1px solid rgba(255,255,255,0.3)",
            }}>
              REINS
            </span>
            <span style={{
              backgroundColor: "rgba(255,255,255,0.15)", color: "#fff",
              fontSize: "11px", padding: "4px 12px", borderRadius: "3px",
            }}>
              {typeLabel}
            </span>
          </div>
          <h1 style={{
            fontFamily: "'Noto Serif JP', serif",
            fontSize: "clamp(22px, 4vw, 36px)",
            fontWeight: "600", color: "#fff",
            margin: "0 0 12px", lineHeight: 1.3,
          }}>
            {property.building_name ?? location ?? "物件詳細"}
          </h1>
          {property.station_name && (
            <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.7)", margin: 0 }}>
              🚃 {property.station_line} {property.station_name}駅 徒歩{property.walk_minutes}分
            </p>
          )}
          {property.price != null && (
            <div style={{ marginTop: "20px" }}>
              <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)", margin: "0 0 4px" }}>販売価格</p>
              <p style={{ margin: 0 }}>
                <span style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: "clamp(28px, 4vw, 40px)",
                  fontWeight: "700", color: "#fff",
                }}>
                  {property.price.toLocaleString()}
                </span>
                <span style={{ fontSize: "16px", color: "rgba(255,255,255,0.7)", marginLeft: "6px" }}>万円</span>
              </p>
            </div>
          )}
        </div>
      </div>

      {/* メインコンテンツ */}
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "40px 24px 80px" }}>
        <div className="private-detail-grid" style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: "32px", alignItems: "start" }}>

          {/* 左：物件概要 */}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

            {/* 画像 */}
            <div style={{ position: "relative", aspectRatio: "4/3", borderRadius: "8px", overflow: "hidden" }}>
              <PropertyImage src={null} alt="物件画像" seed={property.id} sizes="(max-width: 900px) 100vw, 700px" />
            </div>

            {/* 物件概要テーブル */}
            <div style={{
              backgroundColor: "#fff", borderRadius: "8px",
              border: "1px solid #e0dbd4", overflow: "hidden",
            }}>
              <div style={{ backgroundColor: "#2d4a6a", padding: "16px 24px" }}>
                <h2 style={{ fontFamily: "'Noto Serif JP', serif", fontSize: "15px", fontWeight: "600", color: "#fff", margin: 0 }}>
                  物件概要
                </h2>
              </div>
              <div>
                {specs.map((spec, i) => (
                  <div key={spec.label} style={{
                    display: "flex",
                    borderBottom: i < specs.length - 1 ? "1px solid #f0ece6" : "none",
                  }}>
                    <div style={{
                      width: "140px", flexShrink: 0,
                      padding: "14px 20px",
                      backgroundColor: "#faf8f4",
                      fontSize: "13px", color: "#888", fontWeight: "500",
                    }}>
                      {spec.label}
                    </div>
                    <div style={{ flex: 1, padding: "14px 20px", fontSize: "13px", color: "#333", lineHeight: 1.6 }}>
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

          {/* 右：問い合わせCTA */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px", position: "sticky", top: "80px" }}>
            <div style={{ backgroundColor: "#1a2a3a", borderRadius: "8px", padding: "28px 24px", color: "#fff" }}>
              <div style={{ width: "32px", height: "1px", backgroundColor: "#8ab4d4", marginBottom: "16px" }} />
              <h3 style={{
                fontFamily: "'Noto Serif JP', serif",
                fontSize: "17px", fontWeight: "600",
                color: "#fff", margin: "0 0 8px", lineHeight: 1.5,
              }}>
                この物件について<br />お問い合わせください
              </h3>
              <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", margin: "0 0 24px", lineHeight: 1.7 }}>
                内覧・詳細資料など、<br />お気軽にご相談ください。
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <Link
                  href={`/contact?reins_id=${property.id}&type=reins&address=${encodeURIComponent(property.address ?? "")}`}
                  style={{
                    display: "block", textAlign: "center",
                    padding: "15px",
                    backgroundColor: "#4a90b8",
                    color: "#fff",
                    borderRadius: "4px",
                    textDecoration: "none",
                    fontWeight: "bold",
                    fontSize: "14px",
                    letterSpacing: "0.05em",
                  }}
                >
                  メールで問い合わせる
                </Link>
                <a
                  href={`tel:${phoneTel}`}
                  style={{
                    display: "block", textAlign: "center",
                    padding: "14px",
                    backgroundColor: "transparent",
                    color: "#fff",
                    borderRadius: "4px",
                    textDecoration: "none",
                    fontSize: "14px",
                    border: "1px solid rgba(255,255,255,0.25)",
                  }}
                >
                  📞 {phone}
                </a>
              </div>
              <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", textAlign: "center", marginTop: "16px" }}>
                営業時間 9:30〜19:00（火・水定休）
              </p>
            </div>

            {/* 会社情報 */}
            <div style={{
              backgroundColor: "#fff", borderRadius: "8px",
              padding: "20px 24px", border: "1px solid #e0dbd4",
            }}>
              <p style={{ fontSize: "11px", color: "#aaa", letterSpacing: "0.1em", margin: "0 0 10px", fontFamily: "'Montserrat', sans-serif" }}>CONTACT</p>
              <p style={{ fontSize: "13px", fontWeight: "bold", color: "#1a2a3a", margin: "0 0 4px" }}>株式会社フェリアホーム</p>
              <p style={{ fontSize: "12px", color: "#888", margin: 0, lineHeight: 1.6 }}>
                東京都渋谷区千駄ヶ谷4-16-7<br />
                北参道DTビル1階
              </p>
            </div>

            <Link
              href="/reins"
              style={{
                display: "block", textAlign: "center",
                padding: "12px", color: "#888",
                textDecoration: "none", fontSize: "13px",
                border: "1px solid #e0dbd4", borderRadius: "6px",
                backgroundColor: "#fff",
              }}
            >
              ← 一覧に戻る
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
