// app/properties/[id]/page.tsx
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getPropertyById } from "@/lib/api";
import PropertyGallery from "@/components/property/PropertyGallery";
import LoanSimulator from "@/components/property/LoanSimulator";
import { PropertyImage } from "@/components/ui/PropertyImage";
import { AgentCard } from "@/components/property/AgentCard";
import { AreaColumnAccordion } from "@/components/property/AreaColumnAccordion";
import { FavoriteButton } from "@/components/ui/FavoriteButton";

const PROPERTY_TYPE_MAP: Record<string, string> = {
  LAND: "土地", USED_HOUSE: "中古戸建", NEW_HOUSE: "新築戸建",
  MANSION: "マンション", USED_MANSION: "中古マンション",
  NEW_MANSION: "新築マンション",
};

const EQUIPMENT_LABELS: Record<string, string> = {
  eq_autolock: "オートロック", eq_elevator: "エレベーター",
  eq_parking: "駐車場", eq_system_kitchen: "システムキッチン",
  eq_floor_heating: "床暖房", eq_walk_in_closet: "ウォークインクローゼット",
  eq_bathroom_dryer: "浴室乾燥機", eq_ac: "エアコン",
  eq_solar: "太陽光発電", eq_ev_charger: "EV充電設備",
  eq_pet_ok: "ペット可", eq_all_electric: "オール電化",
  eq_2f_washroom: "2F洗面", eq_corner: "角部屋",
  eq_top_floor: "最上階", eq_fiber_optic: "光ファイバー",
  eq_bs_cs: "BS/CS", eq_security_light: "防犯ライト",
};

interface PageProps {
  params: { id: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const property = await getPropertyById(params.id).catch(() => null);
  if (!property) return { title: "物件詳細 | フェリアホーム" };
  const p = property as any;
  const title = p.title ?? (`${p.city ?? ""}${p.town ?? ""}` || "物件詳細");
  return {
    title: `${title} | フェリアホーム`,
    description: p.description_hp ?? p.catch_copy ?? undefined,
  };
}

export default async function PropertyDetailPage({ params }: PageProps) {
  const [property, session] = await Promise.all([
    getPropertyById(params.id).catch(() => null),
    getServerSession(authOptions),
  ]);

  if (!property) notFound();
  const p = property as any;
  const isLoggedIn = !!session?.user;

  const propLat = p.latitude ?? p.lat;
  const propLng = p.longitude ?? p.lng;

  // 近隣物件取得（admin直接呼び出しでサーバー間通信）
  let nearbyProperties: any[] = [];
  try {
    const nearbyParams = new URLSearchParams();
    if (propLat && propLng) {
      nearbyParams.set("lat", String(propLat));
      nearbyParams.set("lng", String(propLng));
    } else if (p.city) {
      nearbyParams.set("city", p.city);
    }
    nearbyParams.set("limit", "3");
    nearbyParams.set("exclude_id", p.id);
    nearbyParams.set("published_hp", "true");
    if (nearbyParams.has("lat") || nearbyParams.has("city")) {
      const res = await fetch(
        `${process.env.ADMIN_API_URL}/api/properties/nearby?${nearbyParams}`,
        { cache: "no-store" }
      );
      const data = await res.json();
      nearbyProperties = data.properties ?? [];
    }
  } catch {}

  // エリアコラム取得（駅名ベース）
  let areaColumns: any[] = [];
  try {
    const stationNames = [1, 2, 3]
      .map((i) => p[`station_name${i}`])
      .filter(Boolean);

    if (stationNames.length > 0) {
      const colResults = await Promise.all(
        stationNames.map((station) =>
          fetch(
            `${process.env.ADMIN_API_URL}/api/hp/area-columns?station=${encodeURIComponent(station)}`,
            { cache: "no-store" }
          ).then((r) => r.json()).catch(() => ({ columns: [] }))
        )
      );
      const seen = new Set<string>();
      for (const result of colResults) {
        for (const col of result.columns ?? []) {
          if (!seen.has(col.id)) {
            seen.add(col.id);
            areaColumns.push(col);
          }
        }
      }
    }
  } catch {}

  // 担当スタッフ取得
  let agent: any = null;
  const agentId = p.agent_id ?? null;
  if (agentId) {
    try {
      const res = await fetch(
        `${process.env.ADMIN_API_URL}/api/staff/${agentId}`,
        { cache: "no-store" }
      );
      const data = await res.json();
      agent = data.staff ?? null;
    } catch {}
  }

  // 周辺環境写真取得
  let envImages: any[] = [];
  try {
    const res = await fetch(
      `${process.env.ADMIN_API_URL}/api/properties/${params.id}/env-images`,
      { cache: "no-store" }
    );
    const data = await res.json();
    envImages = data.images ?? [];
  } catch {}

  const images = (p.images as any[]) ?? [];
  const typeLabel = PROPERTY_TYPE_MAP[p.property_type ?? ""] ?? "";
  const location = [p.city, p.town].filter(Boolean).join("");
  const sellingPoints: string[] = p.selling_points ?? [];

  // 沿線・駅情報を配列化（最大3件、駅名があるものだけ）
  const stations = [1, 2, 3]
    .map((i) => ({
      line: p[`station_line${i}`] ?? null,
      name: p[`station_name${i}`] ?? null,
      walk: p[`station_walk${i}`] ?? null,
    }))
    .filter((s) => s.name);

  const equipmentLabels = Object.entries(EQUIPMENT_LABELS)
    .filter(([key]) => p[key] === true)
    .map(([, label]) => label);

  const featuresList: string[] = p.features ?? [];

  const equipments = [...equipmentLabels, ...featuresList];

  const displayTitle = p.title
    ?? (location ? `${location}${p.price ? ` ${p.price.toLocaleString()}万円` : ""}` : "物件詳細");

  // 物件種別による面積表示分岐
  const propType = p.property_type ?? "";
  const isMansion = ["MANSION", "NEW_MANSION", "USED_MANSION"].includes(propType);
  const isHouse = ["USED_HOUSE", "NEW_HOUSE"].includes(propType);
  const isLand = propType === "LAND";

  const specs = [
    { label: "物件種別", value: typeLabel },
    { label: "販売価格", value: p.price != null ? `${p.price.toLocaleString()}万円` : null },
    { label: "所在地", value: location || null },
    { label: "交通", value: stations.length > 0
      ? stations.map((s) => `${s.line ? s.line + " " : ""}${s.name}駅 徒歩${s.walk}分`).join(" / ")
      : null },
    { label: "間取り", value: p.rooms ?? null },
    ...(isMansion ? [
      { label: "専有面積", value: p.area_exclusive_m2 ? `${p.area_exclusive_m2}㎡` : null },
      { label: "建物面積", value: p.area_build_m2 ? `${p.area_build_m2}㎡` : null },
    ] : []),
    ...(isHouse ? [
      { label: "建物面積", value: p.area_build_m2 ? `${p.area_build_m2}㎡` : null },
      { label: "土地面積", value: p.area_land_m2 ? `${p.area_land_m2}㎡` : null },
    ] : []),
    ...(isLand ? [
      { label: "土地面積", value: (p.area_land_m2 ?? p.area_m2) ? `${p.area_land_m2 ?? p.area_m2}㎡` : null },
    ] : []),
    ...(!isMansion && !isHouse && !isLand ? [
      { label: "土地面積", value: p.area_land_m2 ? `${p.area_land_m2}㎡` : null },
      { label: "建物面積", value: p.area_build_m2 ? `${p.area_build_m2}㎡` : null },
    ] : []),
    {
      label: "築年月",
      value: (() => {
        const year = p.building_year;
        const month = p.building_month;
        if (!year) return null;
        return month ? `${year}年${month}月` : `${year}年`;
      })(),
    },
    { label: "構造", value: p.structure ?? null },
    { label: "階数", value: p.floors_total ? `${p.floors_total}階建` : null },
    { label: "取引態様", value: p.transaction_type ?? null },
    { label: "土地権利", value: p.land_right ?? null },
    { label: "用途地域", value: p.use_zone ?? null },
    { label: "引渡し", value: p.delivery_timing ?? null },
    { label: "建ぺい率", value: p.bcr ? `${p.bcr}%` : null },
    { label: "容積率", value: p.far ? `${p.far}%` : null },
  ].filter((s) => s.value);

  const mapsKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const mapSrc = mapsKey && propLat && propLng
    ? `https://www.google.com/maps/embed/v1/place?key=${mapsKey}&q=${propLat},${propLng}&zoom=15`
    : null;

  const tourUrl = p.tour_url ?? null;

  return (
    <main style={{ backgroundColor: "#f8f8f8", minHeight: "100vh" }}>

      {/* パンくず */}
      <div style={{ backgroundColor: "#fff", borderBottom: "1px solid #e8e8e8", padding: "12px 24px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", gap: "6px", fontSize: "12px", color: "#888" }}>
          <Link href="/" style={{ color: "#888", textDecoration: "none" }}>ホーム</Link>
          <span>›</span>
          <Link href="/properties" style={{ color: "#888", textDecoration: "none" }}>物件一覧</Link>
          <span>›</span>
          <span style={{ color: "#333" }}>{displayTitle}</span>
        </div>
      </div>

      {/* ① タイトルカード */}
      <div style={{ backgroundColor: "#fff", padding: "20px 24px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "10px" }}>
            {typeLabel && (
              <span style={{ backgroundColor: "#5BAD52", color: "#fff", fontSize: "11px", padding: "3px 10px", borderRadius: "20px", fontWeight: "bold" }}>
                {typeLabel}
              </span>
            )}
            {p.is_felia_selection && (
              <span style={{ backgroundColor: "#1a4a24", color: "#C9A84C", fontSize: "11px", padding: "3px 10px", borderRadius: "20px", fontWeight: "bold" }}>
                Felia Selection
              </span>
            )}
            {p.is_open_house && (
              <span style={{ backgroundColor: "#E67E22", color: "#fff", fontSize: "11px", padding: "3px 10px", borderRadius: "20px", fontWeight: "bold" }}>
                現地販売会
              </span>
            )}
          </div>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px", margin: "0 0 6px" }}>
            <h1 style={{ fontSize: "clamp(18px, 3vw, 26px)", fontWeight: "bold", color: "#1a1a1a", margin: 0, lineHeight: 1.4, flex: 1 }}>
              {displayTitle}
            </h1>
            <FavoriteButton propertyId={p.id} size="lg" />
          </div>
          {p.catch_copy && (
            <p style={{ fontSize: "14px", color: "#5BAD52", margin: 0, fontStyle: "italic" }}>
              {p.catch_copy}
            </p>
          )}
        </div>
      </div>

      {/* ② 画像ギャラリー */}
      <div style={{ backgroundColor: "#fff" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>
          {images.length > 0 ? (
            <PropertyGallery images={images} title={displayTitle} />
          ) : (
            <div style={{ position: "relative", aspectRatio: "16/9", overflow: "hidden", backgroundColor: "#000" }}>
              <PropertyImage src={null} alt={displayTitle} seed={p.id} sizes="100vw" style={{ objectFit: "contain" }} />
            </div>
          )}
        </div>
      </div>

      {/* ③ 360度ツアー */}
      {tourUrl && (
        <div style={{ backgroundColor: "#fff", padding: "0 24px 24px" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <div style={{ borderTop: "1px solid #e8e8e8", paddingTop: "20px" }}>
              <h2 style={{ fontSize: "16px", fontWeight: "bold", color: "#333", margin: "0 0 12px", display: "flex", alignItems: "center", gap: "8px" }}>
                <span>🔭</span> 360°バーチャルツアー
              </h2>
              <div style={{ position: "relative", paddingBottom: "56.25%", height: 0, overflow: "hidden", borderRadius: "8px", border: "1px solid #e8e8e8" }}>
                <iframe
                  src={tourUrl}
                  style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: 0 }}
                  allowFullScreen
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* メインコンテンツ */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "24px 24px 80px" }}>
        <div className="property-detail-grid" style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: "32px", alignItems: "start" }}>

          {/* 左カラム */}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

            {/* ④ おすすめポイント */}
            {sellingPoints.length > 0 && (
              <div style={{ backgroundColor: "#fff", borderRadius: "12px", border: "1px solid #e8e8e8", overflow: "hidden" }}>
                <div style={{ backgroundColor: "#1a4a24", padding: "14px 20px" }}>
                  <h2 style={{ fontSize: "15px", fontWeight: "bold", color: "#fff", margin: 0 }}>
                    ⭐ この物件のおすすめポイント
                  </h2>
                </div>
                <div style={{ padding: "20px" }}>
                  <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "10px" }}>
                    {sellingPoints.map((point, i) => (
                      <li key={i} style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                        <span style={{ color: "#5BAD52", fontWeight: "bold", flexShrink: 0, marginTop: "1px" }}>✓</span>
                        <span style={{ fontSize: "14px", color: "#333", lineHeight: 1.6 }}>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* ⑤ 物件説明 */}
            {p.description_hp && (
              <div style={{ backgroundColor: "#fff", borderRadius: "12px", border: "1px solid #e8e8e8", overflow: "hidden" }}>
                <div style={{ backgroundColor: "#f8f8f8", padding: "14px 20px", borderBottom: "1px solid #e8e8e8" }}>
                  <h2 style={{ fontSize: "15px", fontWeight: "bold", color: "#333", margin: 0 }}>物件説明</h2>
                </div>
                <div style={{ padding: "20px" }}>
                  <p style={{ fontSize: "14px", color: "#444", lineHeight: 2, margin: 0, whiteSpace: "pre-wrap" }}>
                    {p.description_hp}
                  </p>
                </div>
              </div>
            )}

            {/* ⑥ 地域コラム */}
            {areaColumns.length > 0 && (
              <AreaColumnAccordion columns={areaColumns} />
            )}

            {/* ⑦ 地図 + 近隣物件 */}
            <div style={{ backgroundColor: "#fff", borderRadius: "12px", border: "1px solid #e8e8e8", overflow: "hidden" }}>
              <div style={{ backgroundColor: "#f8f8f8", padding: "14px 20px", borderBottom: "1px solid #e8e8e8" }}>
                <h2 style={{ fontSize: "15px", fontWeight: "bold", color: "#333", margin: 0 }}>地図・周辺情報</h2>
              </div>
              <div style={{ padding: "20px" }}>
                {mapSrc ? (
                  <div style={{ position: "relative", paddingBottom: "60%", height: 0, overflow: "hidden", borderRadius: "8px", marginBottom: "20px" }}>
                    <iframe
                      src={mapSrc}
                      style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: 0 }}
                      allowFullScreen loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  </div>
                ) : (
                  <div style={{ backgroundColor: "#f0f0f0", borderRadius: "8px", padding: "32px", textAlign: "center", marginBottom: "20px", color: "#aaa", fontSize: "13px" }}>
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

            {/* 周辺環境写真 */}
            {envImages.length > 0 && (
              <div style={{
                backgroundColor: "#fff",
                borderRadius: "12px",
                border: "1px solid #e8e8e8",
                overflow: "hidden",
              }}>
                <div style={{ backgroundColor: "#f8f8f8", padding: "14px 20px", borderBottom: "1px solid #e8e8e8" }}>
                  <h2 style={{ fontSize: "15px", fontWeight: "bold", color: "#333", margin: 0 }}>
                    🏪 周辺環境
                  </h2>
                </div>
                <div style={{ padding: "16px 20px" }}>
                  {(() => {
                    const FACILITY_LABELS: Record<string, string> = {
                      supermarket: "スーパー",
                      convenience: "コンビニ",
                      school: "学校",
                      hospital: "病院",
                      park: "公園",
                      station: "駅",
                      bank: "銀行",
                      restaurant: "飲食店",
                      pharmacy: "薬局",
                      gym: "スポーツ施設",
                      nursery: "保育園・幼稚園",
                    };

                    const groups: Record<string, any[]> = {};
                    envImages.forEach((img) => {
                      const type = img.facility_type ?? "other";
                      if (!groups[type]) groups[type] = [];
                      groups[type].push(img);
                    });

                    return Object.entries(groups).map(([type, imgs]) => (
                      <div key={type} style={{ marginBottom: "20px" }}>
                        <h3 style={{ fontSize: "13px", fontWeight: "bold", color: "#555", margin: "0 0 10px", display: "flex", alignItems: "center", gap: "6px" }}>
                          <span style={{ display: "inline-block", width: "4px", height: "14px", backgroundColor: "#5BAD52", borderRadius: "2px" }} />
                          {FACILITY_LABELS[type] ?? type}
                        </h3>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "10px" }}>
                          {imgs.map((img: any, i: number) => (
                            <div key={i} style={{ borderRadius: "8px", overflow: "hidden", border: "1px solid #e8e8e8" }}>
                              <div style={{ position: "relative", aspectRatio: "4/3", backgroundColor: "#f0f0f0" }}>
                                {img.url ? (
                                  <Image
                                    src={img.url}
                                    alt={img.facility_name ?? "周辺施設"}
                                    fill
                                    style={{ objectFit: "cover" }}
                                    sizes="160px"
                                  />
                                ) : (
                                  <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px" }}>
                                    🏪
                                  </div>
                                )}
                              </div>
                              <div style={{ padding: "8px 10px" }}>
                                {img.facility_name && (
                                  <p style={{ fontSize: "12px", fontWeight: "bold", color: "#333", margin: "0 0 2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                    {img.facility_name}
                                  </p>
                                )}
                                {img.walk_minutes && (
                                  <p style={{ fontSize: "11px", color: "#5BAD52", margin: "0 0 2px", fontWeight: "bold" }}>
                                    徒歩{img.walk_minutes}分
                                  </p>
                                )}
                                {img.caption && (
                                  <p style={{ fontSize: "11px", color: "#888", margin: 0, lineHeight: 1.5 }}>
                                    {img.caption}
                                  </p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ));
                  })()}
                </div>
              </div>
            )}

            {/* ⑧ 物件概要 */}
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

            {/* ⑨ 設備・特徴 */}
            {equipments.length > 0 && (
              <div style={{ backgroundColor: "#fff", borderRadius: "12px", border: "1px solid #e8e8e8", overflow: "hidden" }}>
                <div style={{ backgroundColor: "#f8f8f8", padding: "14px 20px", borderBottom: "1px solid #e8e8e8" }}>
                  <h2 style={{ fontSize: "15px", fontWeight: "bold", color: "#333", margin: 0 }}>設備・特徴</h2>
                </div>
                <div style={{ padding: "16px 20px" }}>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                    {equipments.map((eq) => (
                      <span key={eq} style={{
                        padding: "5px 12px", borderRadius: "20px",
                        backgroundColor: "#e8f5e6", color: "#2d7a3a",
                        fontSize: "12px", fontWeight: "500",
                        border: "1px solid #c8e6c9",
                      }}>
                        ✓ {eq}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 右カラム（sticky） */}
          <div style={{ position: "sticky", top: "80px", display: "flex", flexDirection: "column", gap: "16px" }}>

            {/* 価格・CTA */}
            <div style={{ backgroundColor: "#fff", borderRadius: "12px", border: "1px solid #e8e8e8", overflow: "hidden" }}>
              {/* 価格ヘッダー（濃い緑背景） */}
              {p.price != null && (
                <div style={{
                  backgroundColor: "#1a4a24",
                  padding: "20px 24px",
                  textAlign: "center",
                }}>
                  <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.6)", margin: "0 0 6px", letterSpacing: "0.1em", fontFamily: "'Montserrat', sans-serif" }}>
                    PRICE
                  </p>
                  <p style={{ margin: 0 }}>
                    <span style={{
                      fontSize: "40px",
                      fontWeight: "bold",
                      color: "#fff",
                      fontFamily: "'Montserrat', sans-serif",
                      letterSpacing: "-0.02em",
                      lineHeight: 1,
                    }}>
                      {p.price.toLocaleString()}
                    </span>
                    <span style={{ fontSize: "18px", color: "rgba(255,255,255,0.8)", marginLeft: "6px" }}>万円</span>
                  </p>
                  {p.price_negotiable && (
                    <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)", margin: "8px 0 0" }}>※価格相談可</p>
                  )}
                </div>
              )}

              {/* 沿線・駅情報 */}
              {stations.length > 0 && (
                <div style={{
                  padding: "12px 16px",
                  borderTop: "1px solid rgba(255,255,255,0.1)",
                  backgroundColor: "#1a4a24",
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px",
                }}>
                  {stations.map((s, i) => (
                    <div key={i} style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      fontSize: "12px",
                      color: "rgba(255,255,255,0.85)",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}>
                      <span style={{ fontSize: "13px", flexShrink: 0 }}>🚃</span>
                      <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>
                        {s.line && (
                          <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "11px", marginRight: "4px" }}>
                            {s.line}
                          </span>
                        )}
                        <span style={{ fontWeight: "500" }}>{s.name}駅</span>
                        <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "11px", marginLeft: "6px" }}>
                          徒歩{s.walk}分
                        </span>
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* CTAボタン */}
              <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "10px" }}>
                <Link
                  href={`/contact?type=visit&property_id=${p.id}&propertyNo=${p.property_no ?? ""}`}
                  style={{
                    display: "block", textAlign: "center", padding: "15px",
                    backgroundColor: "#5BAD52", color: "#fff",
                    borderRadius: "8px", textDecoration: "none",
                    fontWeight: "bold", fontSize: "15px",
                    boxShadow: "0 2px 8px rgba(91,173,82,0.3)",
                  }}
                >
                  🏠 来店・内覧予約
                </Link>
                <Link
                  href={`/contact?type=document&property_id=${p.id}&propertyNo=${p.property_no ?? ""}`}
                  style={{
                    display: "block", textAlign: "center", padding: "14px",
                    backgroundColor: "#fff", color: "#5BAD52",
                    borderRadius: "8px", textDecoration: "none",
                    fontWeight: "bold", fontSize: "14px",
                    border: "1.5px solid #5BAD52",
                  }}
                >
                  📄 資料請求
                </Link>
                <Link
                  href={`/contact?type=property&property_id=${p.id}`}
                  style={{
                    display: "block", textAlign: "center", padding: "12px",
                    backgroundColor: "#fff", color: "#888",
                    borderRadius: "8px", textDecoration: "none",
                    fontSize: "13px", border: "1px solid #e0e0e0",
                  }}
                >
                  ✉️ メールで問い合わせ
                </Link>
              </div>
            </div>

            {/* ローンシミュレーター */}
            {p.price != null && (
              <LoanSimulator price={p.price} />
            )}

            {/* 担当スタッフ */}
            {agent && <AgentCard agent={agent} />}
          </div>
        </div>
      </div>
    </main>
  );
}
