import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

type PropertyDetail = {
  id: string;
  property_number: string;
  property_type: string;
  title?: string;
  catch_copy?: string;
  description_hp?: string;
  price?: number;
  prefecture?: string;
  city?: string;
  town?: string;
  address_display?: string;
  station_name1?: string;
  station_line1?: string;
  station_walk1?: number;
  station_name2?: string;
  station_line2?: string;
  station_walk2?: number;
  station_name3?: string;
  station_line3?: string;
  station_walk3?: number;
  rooms?: string;
  area_build_m2?: number;
  area_land_m2?: number;
  area_exclusive_m2?: number;
  building_year?: number;
  building_month?: number;
  structure?: string;
  floors_total?: number;
  land_right?: string;
  use_zone_summary?: string;
  bcr_calculated?: number;
  far_calculated?: number;
  current_status?: string;
  delivery_timing?: string;
  seller_transaction_type?: string;
  equipment_list?: string[];
  elementary_school?: string;
  elementary_school_distance?: number;
  junior_high_school?: string;
  junior_high_school_distance?: number;
  published_at?: string;
  images?: { id: string; url: string; room_type?: string; caption?: string; sort_order?: number }[];
};

const TYPE_LABEL: Record<string, string> = {
  NEW_HOUSE: "新築戸建", USED_HOUSE: "中古戸建", MANSION: "マンション", LAND: "土地",
};

async function getProperty(id: string): Promise<PropertyDetail | null> {
  try {
    const adminUrl = process.env.ADMIN_API_URL ?? "http://localhost:3001";
    const res = await fetch(`${adminUrl}/api/properties/${id}`, { next: { revalidate: 300 } });
    if (!res.ok) return null;
    const data = await res.json();
    return data.property ?? null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const property = await getProperty(params.id);
  if (!property) return { title: "物件が見つかりません" };
  return {
    title: property.title ?? `${property.city}${property.town} ${property.rooms ?? ""}`,
    description: property.catch_copy ?? property.description_hp?.slice(0, 120),
    openGraph: {
      images: property.images?.[0]?.url ? [property.images[0].url] : [],
    },
  };
}

export default async function PropertyDetailPage({ params }: { params: { id: string } }) {
  const property = await getProperty(params.id);
  if (!property) notFound();

  const images = [...(property.images ?? [])].sort(
    (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)
  );
  const mainImage = images.find(i => i.room_type === "外観") ?? images[0];

  const specs = [
    { label: "価格", value: property.price ? `${property.price.toLocaleString()}万円` : "価格応談" },
    { label: "所在地", value: [property.prefecture, property.city, property.town, property.address_display].filter(Boolean).join("") },
    { label: "交通", value: [
      property.station_name1 && `${property.station_line1 ?? ""} ${property.station_name1}駅 徒歩${property.station_walk1}分`,
      property.station_name2 && `${property.station_line2 ?? ""} ${property.station_name2}駅 徒歩${property.station_walk2}分`,
      property.station_name3 && `${property.station_line3 ?? ""} ${property.station_name3}駅 徒歩${property.station_walk3}分`,
    ].filter(Boolean).join("\n") || null },
    { label: "間取り", value: property.rooms },
    { label: "建物面積", value: property.area_build_m2 ? `${property.area_build_m2}㎡` : null },
    { label: "専有面積", value: property.area_exclusive_m2 ? `${property.area_exclusive_m2}㎡` : null },
    { label: "土地面積", value: property.area_land_m2 ? `${property.area_land_m2}㎡` : null },
    { label: "築年月", value: property.building_year ? `${property.building_year}年${property.building_month ?? ""}月` : null },
    { label: "構造", value: property.structure },
    { label: "階建", value: property.floors_total ? `地上${property.floors_total}階` : null },
    { label: "土地権利", value: property.land_right },
    { label: "用途地域", value: property.use_zone_summary },
    { label: "建ぺい率/容積率", value: property.bcr_calculated ? `${property.bcr_calculated}%/${property.far_calculated}%` : null },
    { label: "現況", value: property.current_status },
    { label: "引渡し時期", value: property.delivery_timing },
    { label: "取引態様", value: property.seller_transaction_type },
    { label: "物件番号", value: property.property_number },
  ].filter(s => s.value);

  return (
    <div className="bg-[#fafaf8] min-h-screen">
      {/* パンくず */}
      <div className="pt-24 pb-4 bg-white border-b border-[#e8e6e0]">
        <div className="container-xl">
          <nav className="flex items-center gap-2 text-xs text-[#706e68]">
            <Link href="/" className="hover:text-[#c9a96e] transition-colors">TOP</Link>
            <span>›</span>
            <Link href="/properties" className="hover:text-[#c9a96e] transition-colors">物件検索</Link>
            <span>›</span>
            <span className="text-[#1c1b18] line-clamp-1">
              {property.city}{property.town}
            </span>
          </nav>
        </div>
      </div>

      <div className="container-xl py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左カラム */}
          <div className="lg:col-span-2">
            {/* メイン画像 */}
            <div className="relative h-80 md:h-[480px] rounded-2xl overflow-hidden bg-[#e8e6e0] mb-4">
              {mainImage?.url ? (
                <Image
                  src={mainImage.url}
                  alt={property.title ?? "物件写真"}
                  fill
                  className="object-cover"
                  priority
                  unoptimized
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#1a3a2a] to-[#2d5a3e]">
                  <span className="text-white/30 text-sm">写真準備中</span>
                </div>
              )}
              <div className="absolute top-4 left-4 bg-[#1a3a2a] text-white text-xs font-bold px-3 py-1.5 rounded-full">
                {TYPE_LABEL[property.property_type] ?? property.property_type}
              </div>
            </div>

            {/* サブ画像 */}
            {images.length > 1 && (
              <div className="grid grid-cols-5 gap-2 mb-8">
                {images.slice(1, 5).map(img => (
                  <div key={img.id} className="relative h-20 rounded-lg overflow-hidden bg-[#e8e6e0]">
                    <Image src={img.url} alt={img.caption ?? ""} fill className="object-cover" unoptimized />
                  </div>
                ))}
                {images.length > 5 && (
                  <div className="relative h-20 rounded-lg overflow-hidden bg-[#1a3a2a] flex items-center justify-center">
                    <span className="text-white text-sm font-bold">+{images.length - 5}枚</span>
                  </div>
                )}
              </div>
            )}

            {/* タイトル・キャッチ */}
            <div className="mb-6">
              {property.catch_copy && (
                <p className="text-[#c9a96e] font-serif text-sm mb-2">{property.catch_copy}</p>
              )}
              <h1 className="font-serif text-2xl font-bold text-[#1c1b18] mb-2">
                {property.title ?? `${property.city}${property.town} ${TYPE_LABEL[property.property_type] ?? ""}`}
              </h1>
              <p className="text-sm text-[#706e68]">
                {property.prefecture}{property.city}{property.town}
                {property.address_display && ` ${property.address_display}`}
              </p>
            </div>

            {/* HP掲載文 */}
            {property.description_hp && (
              <div className="bg-white rounded-2xl p-6 border border-[#e8e6e0] mb-6">
                <h2 className="font-serif text-lg font-bold text-[#1c1b18] mb-4">物件のご紹介</h2>
                <p className="text-sm text-[#706e68] leading-relaxed whitespace-pre-line">
                  {property.description_hp}
                </p>
              </div>
            )}

            {/* 物件概要テーブル */}
            <div className="bg-white rounded-2xl border border-[#e8e6e0] overflow-hidden mb-6">
              <h2 className="font-serif text-lg font-bold text-[#1c1b18] p-6 border-b border-[#e8e6e0]">
                物件概要
              </h2>
              <table className="w-full">
                <tbody>
                  {specs.map((row, i) => (
                    <tr key={i} className={i % 2 === 0 ? "bg-[#fafaf8]" : "bg-white"}>
                      <th className="text-left text-xs font-bold text-[#706e68] p-4 w-1/3 border-b border-[#e8e6e0] align-top">
                        {row.label}
                      </th>
                      <td className="text-sm text-[#1c1b18] p-4 border-b border-[#e8e6e0] whitespace-pre-line">
                        {row.value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 設備一覧 */}
            {property.equipment_list && property.equipment_list.length > 0 && (
              <div className="bg-white rounded-2xl border border-[#e8e6e0] p-6 mb-6">
                <h2 className="font-serif text-lg font-bold text-[#1c1b18] mb-4">設備・特徴</h2>
                <div className="flex flex-wrap gap-2">
                  {property.equipment_list.map((eq, i) => (
                    <span key={i} className="bg-[#f5f5f0] text-[#706e68] text-xs px-3 py-1.5 rounded-full">
                      {eq}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* 周辺環境 */}
            {(property.elementary_school || property.junior_high_school) && (
              <div className="bg-white rounded-2xl border border-[#e8e6e0] p-6 mb-6">
                <h2 className="font-serif text-lg font-bold text-[#1c1b18] mb-4">周辺環境</h2>
                <div className="space-y-2 text-sm text-[#706e68]">
                  {property.elementary_school && (
                    <div className="flex justify-between border-b border-[#e8e6e0] pb-2">
                      <span>小学校</span>
                      <span>{property.elementary_school}（{property.elementary_school_distance}m）</span>
                    </div>
                  )}
                  {property.junior_high_school && (
                    <div className="flex justify-between">
                      <span>中学校</span>
                      <span>{property.junior_high_school}（{property.junior_high_school_distance}m）</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 法的事項 */}
            <p className="text-xs text-[#706e68] leading-relaxed">
              ※ 掲載情報は変更になる場合があります。詳細はお問合せください。<br />
              ※ 所在地は丁目まで表示しています。番地・号は来店またはお問合せ後にお知らせします。<br />
              ※ 取引態様: {property.seller_transaction_type ?? "仲介"} / 物件番号: {property.property_number}
            </p>
          </div>

          {/* 右カラム（スティッキー） */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="bg-white rounded-2xl border border-[#e8e6e0] p-6 mb-4">
                <div className="text-2xl font-bold text-[#1a3a2a] mb-1">
                  {property.price ? `${property.price.toLocaleString()}万円` : "価格応談"}
                </div>
                {property.rooms && (
                  <div className="text-sm text-[#706e68] mb-4">{property.rooms}</div>
                )}
                <Link
                  href={`/contact?property=${property.property_number}&title=${encodeURIComponent(property.title ?? "")}`}
                  className="block w-full bg-[#c9a96e] text-white text-center py-3.5 rounded-xl font-bold text-sm hover:bg-[#b8935a] transition-colors mb-3"
                >
                  この物件についてお問合せ
                </Link>
                <a
                  href="tel:03-5981-8601"
                  className="block w-full border-2 border-[#1a3a2a] text-[#1a3a2a] text-center py-3.5 rounded-xl font-bold text-sm hover:bg-[#1a3a2a] hover:text-white transition-colors"
                >
                  📞 03-5981-8601
                </a>
                <p className="text-center text-xs text-[#706e68] mt-2">
                  受付時間: 9:30〜18:30（火・水定休）
                </p>
              </div>

              <div className="bg-[#fafaf8] rounded-xl p-4 text-xs text-[#706e68] border border-[#e8e6e0]">
                <div className="flex justify-between mb-1.5">
                  <span>物件番号</span>
                  <span className="font-mono">{property.property_number}</span>
                </div>
                {property.published_at && (
                  <div className="flex justify-between">
                    <span>掲載日</span>
                    <span>{new Date(property.published_at).toLocaleDateString("ja-JP")}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10">
          <Link href="/properties"
            className="inline-flex items-center gap-2 text-sm text-[#706e68] hover:text-[#c9a96e] transition-colors">
            ← 物件一覧に戻る
          </Link>
        </div>
      </div>
    </div>
  );
}
