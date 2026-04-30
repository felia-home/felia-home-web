// app/properties/[id]/page.tsx
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getPropertyById } from "@/lib/api";
import PropertyGallery from "@/components/property/PropertyGallery";
import LoanSimulator from "@/components/property/LoanSimulator";
import { PropertyImage } from "@/components/ui/PropertyImage";

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

  // 近隣物件取得（admin直接呼び出しでサーバー間通信）
  let nearbyProperties: any[] = [];
  try {
    const nearbyParams = new URLSearchParams();
    if (p.lat && p.lng) {
      nearbyParams.set("lat", String(p.lat));
      nearbyParams.set("lng", String(p.lng));
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

  // エリアコラム取得
  let areaColumns: any[] = [];
  try {
    if (p.city) {
      const res = await fetch(
        `${process.env.ADMIN_API_URL}/api/hp/area-columns?area=${encodeURIComponent(p.city)}`,
        { cache: "no-store" }
      );
      const data = await res.json();
      areaColumns = data.columns ?? [];
    }
  } catch {}

  const images = (p.images as any[]) ?? [];
  const typeLabel = PROPERTY_TYPE_MAP[p.property_type ?? ""] ?? "";
  const location = [p.city, p.town].filter(Boolean).join("");
  const sellingPoints: string[] = p.selling_points ?? [];
  const equipments = Object.entries(EQUIPMENT_LABELS)
    .filter(([key]) => p[key] === true)
    .map(([, label]) => label);

  const displayTitle = p.title
    ?? (location ? `${location}${p.price ? ` ${p.price.toLocaleString()}万円` : ""}` : "物件詳細");

  const specs = [
    { label: "物件種別", value: typeLabel },
    { label: "販売価格", value: p.price != null ? `${p.price.toLocaleString()}万円` : null },
    { label: "所在地", value: location || null },
    { label: "交通", value: p.station_name1 ? `${p.station_line1 ?? ""} ${p.station_name1}駅 徒歩${p.station_walk1}分` : null },
    { label: "間取り", value: p.rooms ?? null },
    { label: "土地面積", value: p.area_land_m2 ? `${p.area_land_m2}㎡` : null },
    { label: "建物面積", value: p.area_build_m2 ? `${p.area_build_m2}㎡` : null },
    { label: "専有面積", value: p.area_exclusive_m2 ? `${p.area_exclusive_m2}㎡` : null },
    { label: "築年", value: p.building_year ? `${p.building_year}年` : null },
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
  const mapSrc = mapsKey && p.lat && p.lng
    ? `https://www.google.com/maps/embed/v1/place?key=${mapsKey}&q=${p.lat},${p.lng}&zoom=15`
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
      <div style={{ backgroundColor: "#fff", borderBottom: "1px solid #e8e8e8", padding: "20px 24px" }}>
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
          <h1 style={{ fontSize: "clamp(18px, 3vw, 26px)", fontWeight: "bold", color: "#1a1a1a", margin: "0 0 6px", lineHeight: 1.4 }}>
            {displayTitle}
          </h1>
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
            <div style={{ position: "relative", aspectRatio: "16/9", overflow: "hidden" }}>
              <PropertyImage src={null} alt={displayTitle} seed={p.id} sizes="100vw" />
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
              <div style={{ backgroundColor: "#fff", borderRadius: "12px", border: "1px solid #e8e8e8", overflow: "hidden" }}>
                <div style={{ backgroundColor: "#f8f8f8", padding: "14px 20px", borderBottom: "1px solid #e8e8e8" }}>
                  <h2 style={{ fontSize: "15px", fontWeight: "bold", color: "#333", margin: 0 }}>
                    📍 {p.city}エリアガイド
                  </h2>
                </div>
                {areaColumns.map((col: any) => (
                  <div key={col.id} style={{ padding: "20px", borderBottom: "1px solid #f0f0f0" }}>
                    <h3 style={{ fontSize: "14px", fontWeight: "bold", color: "#333", margin: "0 0 10px" }}>{col.title}</h3>
                    <p style={{ fontSize: "13px", color: "#555", lineHeight: 1.9, margin: 0, whiteSpace: "pre-wrap" }}>
                      {col.content}
                    </p>
                  </div>
                ))}
              </div>
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
            <div style={{ backgroundColor: "#fff", borderRadius: "12px", border: "1px solid #e8e8e8", padding: "24px" }}>
              {p.price != null && (
                <div style={{ marginBottom: "16px" }}>
                  <p style={{ fontSize: "11px", color: "#aaa", margin: "0 0 4px" }}>販売価格</p>
                  <p style={{ margin: 0 }}>
                    <span style={{ fontSize: "32px", fontWeight: "bold", color: "#5BAD52", fontFamily: "'Montserrat', sans-serif" }}>
                      {p.price.toLocaleString()}
                    </span>
                    <span style={{ fontSize: "16px", color: "#5BAD52", marginLeft: "4px" }}>万円</span>
                  </p>
                </div>
              )}
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <Link
                  href={`/contact?type=visit&property_id=${p.id}&propertyNo=${p.property_no ?? ""}`}
                  style={{ display: "block", textAlign: "center", padding: "14px", backgroundColor: "#5BAD52", color: "#fff", borderRadius: "8px", textDecoration: "none", fontWeight: "bold", fontSize: "14px" }}
                >
                  🏠 来店・内覧予約
                </Link>
                <Link
                  href={`/contact?type=document&property_id=${p.id}&propertyNo=${p.property_no ?? ""}`}
                  style={{ display: "block", textAlign: "center", padding: "13px", backgroundColor: "#fff", color: "#5BAD52", borderRadius: "8px", textDecoration: "none", fontWeight: "bold", fontSize: "14px", border: "1.5px solid #5BAD52" }}
                >
                  📄 資料請求
                </Link>
                <Link
                  href={`/contact?type=property&property_id=${p.id}`}
                  style={{ display: "block", textAlign: "center", padding: "12px", backgroundColor: "#fff", color: "#888", borderRadius: "8px", textDecoration: "none", fontSize: "13px", border: "1px solid #e0e0e0" }}
                >
                  ✉️ メールで問い合わせ
                </Link>
              </div>
            </div>

            {/* ローンシミュレーター */}
            {p.price != null && (
              <LoanSimulator price={p.price} />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
