"use client";

// app/reins/[id]/page.tsx
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { PropertyImage } from "@/components/ui/PropertyImage";
import { FavoriteButton } from "@/components/ui/FavoriteButton";
import LoanSimulator from "@/components/property/LoanSimulator";
import PropertyGallery from "@/components/property/PropertyGallery";

function buildReinsTitle(p: any): string {
  // マンションは building_name を優先
  if (p.source_type === "MANSION" && p.building_name) {
    return p.building_name;
  }
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
  const [nearbyProperties, setNearbyProperties] = useState<any[]>([]);

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
        const p = propData.property ?? propData;
        setProperty(p);
        if (compData.company?.phone) setContactPhone(compData.company.phone);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [status, id]);

  // 近隣物件取得（property がセットされてから実行）
  useEffect(() => {
    if (!property?.id) return;
    const propLat = property.latitude ?? property.lat;
    const propLng = property.longitude ?? property.lng;
    const targetType =
      property.source_type === "MANSION"
        ? "MANSION"
        : property.source_type === "LAND"
          ? "LAND"
          : "NEW_HOUSE";

    const nearbyParams = new URLSearchParams();
    if (propLat && propLng) {
      nearbyParams.set("lat", String(propLat));
      nearbyParams.set("lng", String(propLng));
    } else if (property.area) {
      nearbyParams.set("city", property.area);
    } else {
      return;
    }
    nearbyParams.set("limit", "4");
    nearbyParams.set("exclude_id", property.id);
    nearbyParams.set("type", targetType);

    fetch(`/api/properties/nearby?${nearbyParams.toString()}`)
      .then((r) => r.json())
      .then((data) => {
        const items = (data.properties ?? []).filter(
          (np: any) => np.id !== property.id
        );
        setNearbyProperties(items.slice(0, 4));
      })
      .catch(() => {});
  }, [property]);

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
            <FavoriteButton propertyId={property.id} size="lg" />
          </div>
        </div>
      </div>

      {/* 画像ギャラリー（通常物件詳細と同じ PropertyGallery を使用） */}
      {(() => {
        // 表示画像の優先順位:
        //   1) mansion_building.exterior_images（マンション外観写真）
        //   2) property.images（「広告写真準備中」プレースホルダーは除外）
        const mansionImgs = (property.mansion_building?.exterior_images ?? []).map(
          (img: { url: string; is_primary?: boolean; caption?: string | null }, idx: number) => ({
            id: `mb-${idx}`,
            url: img.url,
            is_main: !!img.is_primary,
            order: idx,
            caption: img.caption ?? null,
          })
        );
        const ownImgs = ((property.images ?? []) as { url: string; id?: string }[])
          .filter((img) => img?.url && !img.url.toLowerCase().includes("preparation"))
          .map((img, idx: number) => ({
            id: img.id ?? `img-${idx}`,
            url: img.url,
            is_main: false,
            order: 1000 + idx,
            caption: null,
          }));
        const galleryImages = [...mansionImgs, ...ownImgs];

        return (
          <div style={{ backgroundColor: "#fff" }}>
            <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>
              {galleryImages.length > 0 ? (
                <PropertyGallery images={galleryImages} title={displayTitle} />
              ) : (
                <div style={{ position: "relative", aspectRatio: "16/9", overflow: "hidden", backgroundColor: "#111" }}>
                  <PropertyImage src={null} alt={displayTitle} seed={property.id} sizes="100vw" style={{ objectFit: "contain" }} />
                </div>
              )}
            </div>
          </div>
        );
      })()}

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

            {/* 地図・周辺情報 + 近隣物件 */}
            {(() => {
              const propLat = property.latitude ?? property.lat;
              const propLng = property.longitude ?? property.lng;
              const mapsKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
              const mapSrc =
                mapsKey && propLat && propLng
                  ? `https://www.google.com/maps/embed/v1/place?key=${mapsKey}&q=${propLat},${propLng}&zoom=15`
                  : null;

              if (!mapSrc && nearbyProperties.length === 0) return null;

              return (
                <div style={{ backgroundColor: "#fff", borderRadius: "12px", border: "1px solid #e8e8e8", overflow: "hidden" }}>
                  <div style={{ backgroundColor: "#f8f8f8", padding: "14px 20px", borderBottom: "1px solid #e8e8e8" }}>
                    <h2 style={{ fontSize: "15px", fontWeight: "bold", color: "#333", margin: 0 }}>地図・周辺情報</h2>
                  </div>
                  <div style={{ padding: "20px" }}>
                    {mapSrc ? (
                      <div style={{ position: "relative", paddingBottom: "60%", height: 0, overflow: "hidden", borderRadius: "8px", marginBottom: nearbyProperties.length > 0 ? "20px" : 0 }}>
                        <iframe
                          src={mapSrc}
                          style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: 0 }}
                          allowFullScreen
                          loading="lazy"
                          referrerPolicy="no-referrer-when-downgrade"
                        />
                      </div>
                    ) : (
                      <div style={{ backgroundColor: "#f0f0f0", borderRadius: "8px", padding: "32px", textAlign: "center", marginBottom: nearbyProperties.length > 0 ? "20px" : 0, color: "#aaa", fontSize: "13px" }}>
                        📍 {location || "地図情報準備中"}
                      </div>
                    )}

                    {nearbyProperties.length > 0 && (
                      <div>
                        <h3 style={{ fontSize: "14px", fontWeight: "bold", color: "#333", margin: "0 0 12px" }}>
                          近隣の物件
                        </h3>
                        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                          {nearbyProperties.map((np: any) => (
                            <Link
                              key={np.id}
                              href={`/properties/${np.id}`}
                              style={{ textDecoration: "none", color: "inherit" }}
                            >
                              <div style={{
                                display: "flex", gap: "12px", alignItems: "center",
                                padding: "12px", borderRadius: "8px",
                                border: "1px solid #e8e8e8", backgroundColor: "#fafafa",
                                transition: "background-color 0.15s ease",
                              }}>
                                <div style={{ width: "72px", height: "54px", borderRadius: "6px", overflow: "hidden", flexShrink: 0, position: "relative" }}>
                                  <PropertyImage
                                    src={np.images?.[0]?.url ?? null}
                                    alt={np.title ?? "物件"}
                                    seed={np.id}
                                    sizes="72px"
                                  />
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                  <p style={{ fontSize: "12px", color: "#333", fontWeight: "bold", margin: "0 0 2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                    {np.title ?? `${np.city ?? ""}${np.town ?? ""}`}
                                  </p>
                                  {np.price != null && (
                                    <p style={{ fontSize: "13px", color: "#5BAD52", fontWeight: "bold", margin: 0 }}>
                                      {np.price.toLocaleString()}万円
                                    </p>
                                  )}
                                </div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}

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
