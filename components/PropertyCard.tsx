import Link from "next/link";
import Image from "next/image";

export type Property = {
  id: string;
  property_number?: string;
  property_type: string;
  title?: string;
  catch_copy?: string;
  price?: number;
  city?: string;
  town?: string;
  station_name1?: string;
  station_walk1?: number;
  rooms?: string;
  area_build_m2?: number;
  area_land_m2?: number;
  published_at?: string;
  images?: { url: string; room_type?: string; is_main?: boolean }[];
};

const TYPE_LABEL: Record<string, string> = {
  NEW_HOUSE:    "新築戸建",
  USED_HOUSE:   "中古戸建",
  MANSION:      "マンション",
  NEW_MANSION:  "新築マンション",
  LAND:         "土地",
};

const TYPE_COLOR: Record<string, string> = {
  NEW_HOUSE:   "#c9a96e",
  USED_HOUSE:  "#5c8a6e",
  MANSION:     "#5c6e8a",
  NEW_MANSION: "#7a5c8a",
  LAND:        "#8a7a5c",
};

export default function PropertyCard({ property }: { property: Property }) {
  const mainImage =
    property.images?.find((i) => i.is_main)?.url ??
    property.images?.find((i) => i.room_type === "外観")?.url ??
    property.images?.[0]?.url;

  const typeLabel = TYPE_LABEL[property.property_type] ?? property.property_type;
  const typeColor = TYPE_COLOR[property.property_type] ?? "#706e68";

  const isNew =
    property.published_at &&
    Date.now() - new Date(property.published_at).getTime() < 7 * 24 * 60 * 60 * 1000;

  return (
    <Link href={`/properties/${property.id}`} className="group block">
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
        {/* 物件画像 */}
        <div className="relative h-52 overflow-hidden">
          {mainImage ? (
            <Image
              src={mainImage}
              alt={property.title ?? "物件画像"}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              unoptimized
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-[#1a3a2a] to-[#2d5a3e]">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className="opacity-30">
                <path d="M24 8L4 22h6v18h10V28h8v12h10V22h6L24 8z" fill="white"/>
              </svg>
              <span className="text-white/30 text-xs mt-2">写真準備中</span>
            </div>
          )}
          {/* 物件種別バッジ */}
          <div
            className="absolute top-3 left-3 px-3 py-1 rounded-full text-white text-xs font-bold"
            style={{ background: typeColor }}
          >
            {typeLabel}
          </div>
          {/* 新着バッジ */}
          {isNew && (
            <div className="absolute top-3 right-3 bg-[#c9a96e] text-white text-xs font-bold px-2 py-1 rounded-full">
              NEW
            </div>
          )}
        </div>

        {/* 物件情報 */}
        <div className="p-5">
          {/* 価格 */}
          <div className="text-2xl font-bold text-[#c9a96e] mb-1">
            {property.price
              ? `${property.price.toLocaleString()}万円`
              : "価格応談"}
          </div>

          {/* キャッチコピー */}
          {property.catch_copy && (
            <p className="text-[#706e68] text-sm mb-2 font-serif line-clamp-1">
              {property.catch_copy}
            </p>
          )}

          {/* 所在地 */}
          <p className="text-sm text-[#706e68] mb-1">
            {property.city}{property.town}
          </p>

          {/* 駅情報 */}
          {property.station_name1 && (
            <p className="text-sm text-[#706e68] mb-3">
              {property.station_name1}駅 徒歩{property.station_walk1}分
            </p>
          )}

          {/* スペック */}
          <div className="flex flex-wrap items-center gap-3 text-sm text-[#1c1b18] pt-3 border-t border-[#e8e6e0]">
            {property.rooms && <span>{property.rooms}</span>}
            {property.area_build_m2 && <span>建物{property.area_build_m2}㎡</span>}
            {property.area_land_m2 && <span>土地{property.area_land_m2}㎡</span>}
          </div>
        </div>
      </div>
    </Link>
  );
}
