import Link from "next/link";
import Image from "next/image";

export type Property = {
  id: string;
  property_number?: string;
  property_type: string;
  title?: string;
  catch_copy?: string;
  ad_catch?: string;
  price?: number;
  city?: string;
  town?: string;
  station_name1?: string;
  station_walk1?: number;
  rooms?: string;
  area_build_m2?: number;
  area_land_m2?: number;
  area_exclusive_m2?: number;
  published_at?: string;
  is_open_house?: boolean;
  can_preview?: boolean;
  is_recommended?: boolean;
  images?: { url: string; room_type?: string; is_main?: boolean }[];
};

const TYPE_LABEL: Record<string, string> = {
  NEW_HOUSE:   "新築戸建",
  USED_HOUSE:  "中古戸建",
  MANSION:     "マンション",
  NEW_MANSION: "新築マンション",
  LAND:        "土地",
};

export default function PropertyCard({ property }: { property: Property }) {
  const mainImage =
    property.images?.find((i) => i.is_main)?.url ??
    property.images?.find((i) => i.room_type === "外観")?.url ??
    property.images?.[0]?.url;

  const typeLabel = TYPE_LABEL[property.property_type] ?? property.property_type;

  const isNew =
    property.published_at &&
    Date.now() - new Date(property.published_at).getTime() < 7 * 24 * 60 * 60 * 1000;

  const catchText = property.catch_copy ?? property.ad_catch;

  return (
    <Link href={`/properties/${property.id}`} className="group block">
      <div className="border border-[#e0e0e0] hover:shadow-md transition-shadow bg-white">
        {/* 物件画像 */}
        <div className="relative overflow-hidden" style={{ aspectRatio: "4/3" }}>
          {mainImage ? (
            <Image
              src={mainImage}
              alt={property.title ?? "物件画像"}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              unoptimized
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-200">
              <svg width="40" height="40" viewBox="0 0 48 48" fill="none" className="opacity-30">
                <path d="M24 8L4 22h6v18h10V28h8v12h10V22h6L24 8z" fill="#333" />
              </svg>
              <span className="text-gray-400 text-xs mt-2">写真準備中</span>
            </div>
          )}

          {/* バッジ */}
          <div className="absolute top-2 left-2 flex gap-1 flex-wrap">
            {property.is_open_house && (
              <span className="bg-[#5BAD52] text-white text-xs px-2 py-0.5 font-bold">
                現地販売会
              </span>
            )}
            {property.can_preview && (
              <span className="bg-[#5BAD52] text-white text-xs px-2 py-0.5 font-bold">
                内覧可
              </span>
            )}
            {property.is_recommended && (
              <span className="bg-white text-[#5BAD52] border border-[#5BAD52] text-xs px-2 py-0.5 font-bold">
                オススメ
              </span>
            )}
            {isNew && (
              <span className="bg-white text-[#5BAD52] border border-[#5BAD52] text-xs px-2 py-0.5 font-bold">
                NEW
              </span>
            )}
          </div>
        </div>

        {/* 物件情報 */}
        <div className="p-3">
          {/* 種別 */}
          <div className="text-xs text-[#5BAD52] mb-1 font-bold">{typeLabel}</div>

          {/* 価格 */}
          <div className="text-lg font-bold text-[#333] mb-1">
            {property.price
              ? `${property.price.toLocaleString()}万円`
              : "価格応談"}
          </div>

          {/* 所在地 */}
          <div className="text-sm text-[#666] mb-1">
            {property.city}{property.town}
          </div>

          {/* 駅情報 */}
          {property.station_name1 && (
            <div className="text-xs text-[#666] mb-2">
              {property.station_name1}駅 徒歩{property.station_walk1}分
            </div>
          )}

          {/* キャッチ・説明文 */}
          {catchText && (
            <p className="text-xs text-[#666] leading-relaxed line-clamp-2 mb-2">
              {catchText}
            </p>
          )}

          {/* スペック */}
          <div className="flex flex-wrap gap-2 text-xs text-[#666] pt-2 border-t border-[#e0e0e0]">
            {property.rooms && <span>{property.rooms}</span>}
            {property.area_build_m2 && <span>建物{property.area_build_m2}㎡</span>}
            {property.area_land_m2 && <span>土地{property.area_land_m2}㎡</span>}
            {property.area_exclusive_m2 && <span>専有{property.area_exclusive_m2}㎡</span>}
          </div>
        </div>
      </div>
    </Link>
  );
}
