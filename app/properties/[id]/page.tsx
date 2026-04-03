import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

type PropertyDetail = {
  id: string;
  property_type: string;
  title?: string;
  catch_copy?: string;
  description_hp?: string;
  price?: number;
  city?: string;
  town?: string;
  address?: string;
  prefecture?: string;
  station_line1?: string;
  station_name1?: string;
  station_walk1?: number;
  station_line2?: string;
  station_name2?: string;
  station_walk2?: number;
  rooms?: string;
  area_build_m2?: number;
  area_land_m2?: number;
  area_exclusive_m2?: number;
  building_year?: number;
  building_month?: number;
  structure?: string;
  floor_unit?: number;
  floors_total?: number;
  direction?: string;
  management_fee?: number;
  repair_reserve?: number;
  delivery_timing?: string;
  transaction_type?: string;
  latitude?: number;
  longitude?: number;
  property_number?: string;
  images?: { url: string; room_type?: string; is_main?: boolean }[];
};

async function getProperty(id: string): Promise<PropertyDetail | null> {
  try {
    const adminUrl = process.env.ADMIN_API_URL ?? "http://localhost:3001";
    const res = await fetch(`${adminUrl}/api/properties/${id}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.property ?? null;
  } catch {
    return null;
  }
}

const TYPE_LABEL: Record<string, string> = {
  NEW_HOUSE: "新築戸建", USED_HOUSE: "中古戸建",
  MANSION: "マンション", NEW_MANSION: "新築マンション", LAND: "土地",
};

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const property = await getProperty(params.id);
  if (!property) return { title: "物件が見つかりません" };
  return {
    title:
      property.title ??
      `${property.city}${property.town ?? ""} ${TYPE_LABEL[property.property_type] ?? "物件"}`,
    description:
      property.description_hp?.slice(0, 120) ??
      `${property.city}${property.town ?? ""}の${TYPE_LABEL[property.property_type] ?? "物件"}。${property.price ? `${property.price.toLocaleString()}万円。` : ""}`,
  };
}

export default async function PropertyDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const property = await getProperty(params.id);
  if (!property) notFound();

  const images = property.images ?? [];
  const mainImage =
    images.find((i) => i.is_main)?.url ??
    images.find((i) => i.room_type === "外観")?.url ??
    images[0]?.url;

  const buildYear = property.building_year
    ? `${property.building_year}年${property.building_month ? `${property.building_month}月` : ""}築`
    : null;

  const specs = [
    { label: "物件種別", value: TYPE_LABEL[property.property_type] ?? property.property_type },
    { label: "価格", value: property.price ? `${property.price.toLocaleString()}万円` : null },
    { label: "所在地", value: [property.prefecture, property.city, property.town, property.address].filter(Boolean).join("") },
    { label: "間取り", value: property.rooms },
    { label: "建物面積", value: property.area_build_m2 ? `${property.area_build_m2}㎡` : null },
    { label: "専有面積", value: property.area_exclusive_m2 ? `${property.area_exclusive_m2}㎡` : null },
    { label: "土地面積", value: property.area_land_m2 ? `${property.area_land_m2}㎡` : null },
    { label: "築年月", value: buildYear },
    { label: "構造", value: property.structure },
    { label: "所在階", value: property.floor_unit ? `${property.floor_unit}階` : null },
    { label: "階建", value: property.floors_total ? `地上${property.floors_total}階` : null },
    { label: "向き", value: property.direction },
    { label: "管理費", value: property.management_fee ? `${property.management_fee.toLocaleString()}円/月` : null },
    { label: "修繕積立金", value: property.repair_reserve ? `${property.repair_reserve.toLocaleString()}円/月` : null },
    { label: "引渡し", value: property.delivery_timing },
    { label: "取引態様", value: property.transaction_type },
    { label: "物件番号", value: property.property_number },
  ].filter((s) => s.value);

  return (
    <div className="pt-20 pb-20 bg-[#fafaf8] min-h-screen">
      {/* パンくずリスト */}
      <div className="container-xl py-3">
        <nav className="text-xs text-[#706e68] flex items-center gap-2">
          <Link href="/" className="hover:text-[#1a3a2a]">ホーム</Link>
          <span>/</span>
          <Link href="/properties" className="hover:text-[#1a3a2a]">物件検索</Link>
          <span>/</span>
          <span className="text-[#1c1b18]">物件詳細</span>
        </nav>
      </div>

      <div className="container-xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左カラム */}
          <div className="lg:col-span-2">
            {/* メイン画像 */}
            <div className="relative h-[400px] bg-[#e8e6e0] rounded-2xl overflow-hidden mb-4">
              {mainImage ? (
                <Image src={mainImage} alt={property.title ?? "物件画像"} fill className="object-cover" unoptimized />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-[#706e68]">
                  <span className="text-6xl">🏠</span>
                </div>
              )}
              <div className="absolute top-4 left-4 bg-[#1a3a2a] text-white text-xs px-3 py-1 rounded-full font-bold">
                {TYPE_LABEL[property.property_type] ?? property.property_type}
              </div>
            </div>

            {/* サブ画像 */}
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-2 mb-8">
                {images.slice(1, 5).map((img, i) => (
                  <div key={i} className="relative h-20 rounded-xl overflow-hidden bg-[#e8e6e0]">
                    <Image src={img.url} alt="" fill className="object-cover" unoptimized />
                  </div>
                ))}
              </div>
            )}

            {/* 物件タイトル・価格 */}
            <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
              {property.catch_copy && (
                <p className="text-[#c9a96e] text-sm font-serif mb-2">{property.catch_copy}</p>
              )}
              <h1 className="font-serif text-2xl font-bold text-[#1c1b18] mb-3">
                {property.title ?? `${property.city}${property.town ?? ""} ${TYPE_LABEL[property.property_type] ?? ""}`}
              </h1>
              <div className="text-3xl font-bold text-[#1a3a2a] mb-4">
                {property.price ? `${property.price.toLocaleString()}万円` : "価格応談"}
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-[#706e68]">
                <span>📍 {property.city}{property.town}</span>
                {property.station_name1 && (
                  <span>🚃 {property.station_name1}駅 徒歩{property.station_walk1}分</span>
                )}
                {property.rooms && <span>🏠 {property.rooms}</span>}
                {property.area_build_m2 && <span>📐 建物{property.area_build_m2}㎡</span>}
              </div>
            </div>

            {/* 物件説明 */}
            {property.description_hp && (
              <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
                <h2 className="font-serif text-lg font-bold text-[#1c1b18] mb-4">物件詳細</h2>
                <p className="text-sm text-[#1c1b18] leading-relaxed whitespace-pre-line">
                  {property.description_hp}
                </p>
              </div>
            )}

            {/* 物件スペック表 */}
            <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
              <h2 className="font-serif text-lg font-bold text-[#1c1b18] mb-4">物件情報</h2>
              <table className="w-full text-sm">
                <tbody>
                  {specs.map((spec) => (
                    <tr key={spec.label} className="border-b border-[#e8e6e0]">
                      <th className="text-left py-2.5 pr-4 w-1/3 text-[#706e68] font-normal">
                        {spec.label}
                      </th>
                      <td className="py-2.5 text-[#1c1b18]">{spec.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 地図 */}
            {property.latitude && property.longitude && (
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="font-serif text-lg font-bold text-[#1c1b18] mb-4">周辺地図</h2>
                <div className="h-64 rounded-xl overflow-hidden bg-[#e8e6e0] flex items-center justify-center text-[#706e68]">
                  <p className="text-sm">地図を表示するにはGoogle Maps APIキーが必要です</p>
                </div>
              </div>
            )}
          </div>

          {/* 右カラム：お問合せ（スティッキー） */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="bg-white rounded-2xl p-6 shadow-sm mb-4">
                <div className="text-2xl font-bold text-[#1a3a2a] mb-1">
                  {property.price ? `${property.price.toLocaleString()}万円` : "価格応談"}
                </div>
                <p className="text-xs text-[#706e68] mb-6">税込・消費税別途</p>

                <Link
                  href={`/contact?property_id=${property.id}&property_name=${encodeURIComponent(property.title ?? "")}`}
                  className="block w-full bg-[#c9a96e] text-white text-center py-4 rounded-xl font-bold text-sm hover:bg-[#b8935a] transition-colors mb-3"
                >
                  この物件について問合せる
                </Link>
                <a
                  href="tel:0120-000-000"
                  className="block w-full border-2 border-[#1a3a2a] text-[#1a3a2a] text-center py-4 rounded-xl font-bold text-sm hover:bg-[#1a3a2a] hover:text-white transition-colors"
                >
                  📞 0120-000-000
                </a>
              </div>

              <div className="bg-[#fafaf8] rounded-2xl p-5 border border-[#e8e6e0]">
                <p className="text-xs text-[#706e68] mb-3 font-bold">担当者からのメッセージ</p>
                <p className="text-sm text-[#706e68] leading-relaxed">
                  気になる点がございましたら、お気軽にお問合せください。
                  現地案内・資料送付・ローンのご相談も承ります。
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
