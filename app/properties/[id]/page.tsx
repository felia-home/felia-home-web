// app/properties/[id]/page.tsx
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getPropertyDetail, getPropertyImages, getStaffDetail } from "@/lib/api";
import PropertyGallery from "@/components/property/PropertyGallery";
import LoanSimulator from "@/components/property/LoanSimulator";
import { PropertyImage } from "@/components/ui/PropertyImage";

function buildFallbackTitle(p: {
  title?: string | null;
  city?: string | null;
  town?: string | null;
  price?: number | null;
}): string {
  if (p.title) return p.title;
  const loc = [p.city, p.town].filter(Boolean).join("");
  const price = p.price != null ? ` ${p.price.toLocaleString()}万円` : "";
  return loc ? `${loc}${price}` : "物件詳細";
}

interface PageProps {
  params: { id: string };
}

const PROPERTY_TYPE_MAP: Record<string, string> = {
  LAND: "土地",
  USED_HOUSE: "中古戸建",
  NEW_HOUSE: "新築戸建",
  MANSION: "マンション",
  USED_MANSION: "中古マンション",
  NEW_MANSION: "新築マンション",
  OTHER: "その他",
};

const EQUIPMENT_MAP: Record<string, string> = {
  eq_system_kitchen: "システムキッチン",
  eq_autolock: "オートロック",
  eq_elevator: "エレベーター",
  eq_parking: "駐車場",
  eq_bike_parking: "駐輪場",
  eq_pet_ok: "ペット可",
  eq_floor_heating: "床暖房",
  eq_all_electric: "オール電化",
  eq_solar: "太陽光発電",
  eq_walk_in_closet: "ウォークインクローゼット",
  eq_washlet: "温水洗浄便座",
  eq_bathroom_dryer: "浴室乾燥機",
  eq_tv_intercom: "TVインターホン",
  eq_fiber_optic: "光ファイバー",
  eq_corner: "角部屋",
  eq_top_floor: "最上階",
  eq_reformed: "リフォーム済",
  eq_barrier_free: "バリアフリー",
  eq_ev_charger: "EV充電設備",
  eq_separate_bath_toilet: "バス・トイレ別",
  eq_counter_kitchen: "対面キッチン",
  eq_roof_balcony: "ルーフバルコニー",
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const property = await getPropertyDetail(params.id);
    if (!property) return { title: "物件詳細" };
    const typeLabel = PROPERTY_TYPE_MAP[property.property_type] ?? property.property_type;
    const baseTitle = property.title
      ?? `${[property.city, property.town].filter(Boolean).join("")} ${typeLabel}`.trim();
    return {
      title: `${baseTitle} ${property.price != null ? property.price.toLocaleString() + "万円" : "応相談"} | フェリアホーム`,
      description: `${typeLabel}｜${property.city ?? ""}${property.town ?? ""}｜${property.price != null ? property.price.toLocaleString() + "万円" : "応相談"}${property.area_build_m2 ? "｜" + property.area_build_m2 + "㎡" : ""}${property.station_name1 ? "｜" + property.station_name1 + "駅 徒歩" + property.station_walk1 + "分" : ""}`,
    };
  } catch {
    return { title: "物件詳細" };
  }
}

export default async function PropertyDetailPage({ params }: PageProps) {
  const [property, images] = await Promise.all([
    getPropertyDetail(params.id),
    getPropertyImages(params.id),
  ]);

  if (!property) notFound();

  const staff = property.agent_id ? await getStaffDetail(property.agent_id) : null;

  const typeLabel = PROPERTY_TYPE_MAP[property.property_type] ?? property.property_type;
  const displayTitle = buildFallbackTitle(property);

  // 住所表示（address_display_levelに応じてマスク）
  const displayAddress = (() => {
    const level = property.address_display_level;
    const pref = property.prefecture ?? "";
    const city = property.city ?? "";
    const town = property.town ?? "";
    const addr = property.address ?? "";
    if (level === "hidden") return `${pref}${city}`;
    if (level === "town")   return `${pref}${city}${town}`;
    return `${pref}${city}${town}${addr}`;
  })();

  // 築年数
  const buildingAge = property.building_year
    ? `${property.building_year}年${property.building_month ? property.building_month + "月" : ""}築（築${new Date().getFullYear() - property.building_year}年）`
    : null;

  // 設備（trueのもの）
  const equipments = Object.entries(EQUIPMENT_MAP)
    .filter(([key]) => (property as unknown as Record<string, unknown>)[key] === true)
    .map(([, label]) => label);

  // 物件概要テーブル行
  const specs: { label: string; value: string }[] = [
    { label: "物件種別", value: typeLabel },
    {
      label: "価格",
      value: property.price != null
        ? `${property.price.toLocaleString()}万円${property.price_negotiable ? "（応相談）" : ""}`
        : "応相談",
    },
    { label: "所在地", value: displayAddress },
    {
      label: "交通",
      value: [
        property.station_name1
          ? `${property.station_line1 ?? ""} ${property.station_name1}駅 徒歩${property.station_walk1}分`
          : null,
        property.station_name2
          ? `${property.station_line2 ?? ""} ${property.station_name2}駅 徒歩${property.station_walk2}分`
          : null,
      ]
        .filter(Boolean)
        .join(" / "),
    },
    { label: "間取り",        value: property.rooms ?? "" },
    { label: "土地面積",      value: property.area_land_m2  ? `${property.area_land_m2}㎡`  : "" },
    { label: "建物面積",      value: property.area_build_m2 ? `${property.area_build_m2}㎡` : "" },
    { label: "築年月",        value: buildingAge ?? "" },
    { label: "構造",          value: property.structure ?? "" },
    { label: "階数",          value: property.floors_total  ? `${property.floors_total}階建`  : "" },
    { label: "向き",          value: property.direction ?? "" },
    { label: "用途地域",      value: property.use_zone ?? "" },
    {
      label: "建ぺい率/容積率",
      value: property.bcr && property.far ? `${property.bcr}%／${property.far}%` : "",
    },
    { label: "土地権利", value: property.land_right ?? "" },
    {
      label: "接道",
      value:
        property.road_direction && property.road_type
          ? `${property.road_direction}側 ${property.road_type}${property.road_width ? " " + property.road_width + "m" : ""}`
          : "",
    },
    { label: "引渡し",   value: property.delivery_timing  ?? "" },
    { label: "現況",     value: property.delivery_status  ?? "" },
    { label: "取引態様", value: property.transaction_type ?? "" },
  ].filter(s => s.value.trim() !== "");

  return (
    <main style={{ backgroundColor: "#f8f8f8", minHeight: "100vh" }}>

      {/* パンくずリスト */}
      <div style={{ backgroundColor: "#fff", borderBottom: "1px solid #e8e8e8", padding: "12px 24px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", gap: "8px", fontSize: "12px", color: "#888", flexWrap: "wrap", alignItems: "center" }}>
          <Link href="/" style={{ color: "#888", textDecoration: "none" }}>ホーム</Link>
          <span>›</span>
          <Link href="/properties" style={{ color: "#888", textDecoration: "none" }}>物件一覧</Link>
          <span>›</span>
          <span style={{ color: "#333" }}>{displayTitle}</span>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "24px 24px 80px" }}>

        {/* 画像ギャラリー */}
        {images.length > 0 ? (
          <PropertyGallery images={images} title={displayTitle} />
        ) : (
          <div style={{ position: "relative", aspectRatio: "16/9", borderRadius: "12px", overflow: "hidden" }}>
            <PropertyImage
              src={null}
              alt={displayTitle}
              seed={property.id}
              sizes="(max-width: 1200px) 100vw, 800px"
            />
          </div>
        )}

        {/* メインコンテンツ */}
        <div className="property-detail-grid" style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "24px", marginTop: "24px" }}>

          {/* 左カラム */}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

            {/* タイトル・バッジ */}
            <div style={{ backgroundColor: "#fff", borderRadius: "12px", padding: "24px" }}>
              <div style={{ display: "flex", gap: "8px", marginBottom: "12px", flexWrap: "wrap" }}>
                <span style={{ fontSize: "11px", padding: "3px 10px", borderRadius: "20px", backgroundColor: "#e8f5e6", color: "#5BAD52", fontWeight: "bold" }}>
                  {typeLabel}
                </span>
                {property.is_felia_selection && (
                  <span style={{ fontSize: "11px", padding: "3px 10px", borderRadius: "20px", backgroundColor: "#5BAD52", color: "#fff", fontWeight: "bold" }}>
                    Felia Selection
                  </span>
                )}
                {property.is_open_house && (
                  <span style={{ fontSize: "11px", padding: "3px 10px", borderRadius: "20px", backgroundColor: "#E67E22", color: "#fff", fontWeight: "bold" }}>
                    現地販売会開催中
                  </span>
                )}
              </div>
              <h1 style={{ fontSize: "22px", fontWeight: "bold", color: "#333", margin: "0 0 8px", lineHeight: 1.4 }}>
                {displayTitle}
              </h1>
              {property.catch_copy && (
                <p style={{ fontSize: "14px", color: "#666", margin: 0, lineHeight: 1.6, borderLeft: "3px solid #5BAD52", paddingLeft: "12px" }}>
                  {property.catch_copy}
                </p>
              )}
            </div>

            {/* セールスポイント */}
            {property.selling_points && property.selling_points.length > 0 && (
              <div style={{ backgroundColor: "#fff", borderRadius: "12px", padding: "24px" }}>
                <h2 style={{ fontSize: "16px", fontWeight: "bold", color: "#333", margin: "0 0 16px", borderLeft: "4px solid #5BAD52", paddingLeft: "12px" }}>
                  この物件のおすすめポイント
                </h2>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {property.selling_points.map((point, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
                      <span style={{ color: "#5BAD52", fontWeight: "bold", flexShrink: 0, marginTop: "1px" }}>✓</span>
                      <span style={{ fontSize: "14px", color: "#333" }}>{point}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 物件概要 */}
            <div style={{ backgroundColor: "#fff", borderRadius: "12px", padding: "24px" }}>
              <h2 style={{ fontSize: "16px", fontWeight: "bold", color: "#333", margin: "0 0 16px", borderLeft: "4px solid #5BAD52", paddingLeft: "12px" }}>
                物件概要
              </h2>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
                <tbody>
                  {specs.map((spec, i) => (
                    <tr key={i} style={{ borderBottom: "1px solid #f0f0f0" }}>
                      <td style={{ padding: "10px 12px", color: "#888", whiteSpace: "nowrap", width: "140px", backgroundColor: "#fafafa", fontWeight: "500", fontSize: "13px" }}>
                        {spec.label}
                      </td>
                      <td style={{ padding: "10px 12px", color: "#333" }}>
                        {spec.value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 物件説明 */}
            {property.description_hp && (
              <div style={{ backgroundColor: "#fff", borderRadius: "12px", padding: "24px" }}>
                <h2 style={{ fontSize: "16px", fontWeight: "bold", color: "#333", margin: "0 0 16px", borderLeft: "4px solid #5BAD52", paddingLeft: "12px" }}>
                  物件説明
                </h2>
                <div style={{ fontSize: "14px", color: "#555", lineHeight: 1.8, whiteSpace: "pre-wrap" }}>
                  {property.description_hp}
                </div>
              </div>
            )}

            {/* 設備・特徴 */}
            {equipments.length > 0 && (
              <div style={{ backgroundColor: "#fff", borderRadius: "12px", padding: "24px" }}>
                <h2 style={{ fontSize: "16px", fontWeight: "bold", color: "#333", margin: "0 0 16px", borderLeft: "4px solid #5BAD52", paddingLeft: "12px" }}>
                  設備・特徴
                </h2>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {equipments.map((eq, i) => (
                    <span key={i} style={{
                      fontSize: "12px",
                      padding: "4px 12px",
                      borderRadius: "20px",
                      border: "1px solid #5BAD52",
                      color: "#5BAD52",
                      backgroundColor: "#f0f9ef",
                    }}>
                      {eq}
                    </span>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* 右カラム */}
          <div style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            position: "sticky",
            top: "80px",
            alignSelf: "flex-start",
          }}>

            {/* ① 価格・CTAカード */}
            <div style={{
              backgroundColor: "#fff",
              borderRadius: "12px",
              padding: "24px",
              border: "2px solid #5BAD52",
            }}>
              {/* 価格 */}
              <div style={{ marginBottom: "20px" }}>
                <p style={{ fontSize: "12px", color: "#888", margin: "0 0 4px" }}>販売価格</p>
                <p style={{ fontSize: "32px", fontWeight: "bold", color: "#5BAD52", margin: 0, lineHeight: 1 }}>
                  {property.price != null ? property.price.toLocaleString() : "応相談"}
                  {property.price != null && <span style={{ fontSize: "16px", marginLeft: "4px" }}>万円</span>}
                </p>
                {property.price_negotiable && (
                  <p style={{ fontSize: "12px", color: "#E67E22", margin: "4px 0 0" }}>※価格交渉可</p>
                )}
              </div>

              {/* CTAボタン */}
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <Link
                  href={`/contact?property_id=${property.id}&type=viewing`}
                  style={{
                    display: "block",
                    textAlign: "center",
                    padding: "14px",
                    backgroundColor: "#5BAD52",
                    color: "#fff",
                    borderRadius: "8px",
                    textDecoration: "none",
                    fontWeight: "bold",
                    fontSize: "15px",
                  }}
                >
                  🏠 来店・内覧予約
                </Link>
                <Link
                  href={`/contact?property_id=${property.id}&type=document`}
                  style={{
                    display: "block",
                    textAlign: "center",
                    padding: "14px",
                    backgroundColor: "#fff",
                    color: "#5BAD52",
                    borderRadius: "8px",
                    textDecoration: "none",
                    fontWeight: "bold",
                    fontSize: "15px",
                    border: "2px solid #5BAD52",
                  }}
                >
                  📄 資料請求
                </Link>
                <Link
                  href={`/contact?property_id=${property.id}&type=inquiry`}
                  style={{
                    display: "block",
                    textAlign: "center",
                    padding: "12px",
                    backgroundColor: "#f5f5f5",
                    color: "#555",
                    borderRadius: "8px",
                    textDecoration: "none",
                    fontSize: "13px",
                  }}
                >
                  ✉️ メールで問い合わせ
                </Link>
              </div>
              <p style={{ fontSize: "11px", color: "#aaa", textAlign: "center", margin: "12px 0 0" }}>
                お気軽にお問い合わせください
              </p>
            </div>

            {/* ローンシミュレーター */}
            {property.price != null && (
              <LoanSimulator price={property.price} />
            )}

            {/* ② 現地販売会カード（条件付き） */}
            {property.is_open_house && property.open_house_start && (
              <div style={{
                backgroundColor: "#fff9f0",
                borderRadius: "12px",
                padding: "20px",
                border: "1px solid #f5c97a",
              }}>
                <p style={{ fontSize: "13px", fontWeight: "bold", color: "#E67E22", margin: "0 0 8px" }}>
                  🏡 現地販売会 開催中
                </p>
                <p style={{ fontSize: "13px", color: "#555", margin: 0 }}>
                  {(() => {
                    const d = new Date(property.open_house_start!);
                    if (isNaN(d.getTime())) return "日程未定";
                    return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
                  })()}
                  {property.open_house_end && (() => {
                    const d = new Date(property.open_house_end);
                    if (isNaN(d.getTime())) return "";
                    return ` 〜 ${d.getMonth() + 1}月${d.getDate()}日`;
                  })()}
                </p>
              </div>
            )}

            {/* ③ 担当スタッフカード（独立） */}
            {staff && (
              <div style={{
                backgroundColor: "#fff",
                borderRadius: "12px",
                padding: "20px",
                border: "1px solid #e8e8e8",
              }}>
                <p style={{
                  fontSize: "13px",
                  fontWeight: "bold",
                  color: "#333",
                  margin: "0 0 16px",
                  borderLeft: "3px solid #5BAD52",
                  paddingLeft: "8px",
                }}>
                  担当スタッフ
                </p>
                <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                  {/* スタッフ写真 */}
                  <div style={{
                    position: "relative",
                    width: "64px",
                    height: "64px",
                    borderRadius: "50%",
                    overflow: "hidden",
                    flexShrink: 0,
                    backgroundColor: "#f0f0f0",
                  }}>
                    {staff.photo_url && (
                      <Image
                        src={staff.photo_url}
                        alt={staff.name}
                        fill
                        style={{ objectFit: "cover" }}
                        sizes="64px"
                      />
                    )}
                  </div>
                  {/* スタッフ情報 */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: "15px", fontWeight: "bold", color: "#333", margin: "0 0 2px" }}>
                      {staff.name}
                    </p>
                    <p style={{ fontSize: "12px", color: "#888", margin: "0 0 8px" }}>
                      {[staff.position, staff.store_name].filter(Boolean).join(" ／ ")}
                    </p>
                    {staff.catchphrase && (
                      <p style={{ fontSize: "12px", color: "#5BAD52", margin: "0 0 6px", fontStyle: "italic" }}>
                        「{staff.catchphrase}」
                      </p>
                    )}
                    {staff.bio && (
                      <p style={{ fontSize: "12px", color: "#555", margin: 0, lineHeight: 1.6 }}>
                        {staff.bio.length > 80 ? staff.bio.substring(0, 80) + "..." : staff.bio}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </main>
  );
}
