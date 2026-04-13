// components/property/PropertyCard.tsx
// TODO: 後続の指示文で実装する
import Link from "next/link";

export interface Property {
  id: string;
  property_number?: string;
  title?: string;
  catch_copy?: string;
  property_type?: string;
  price: number;
  city?: string;
  address?: string;
  station_name1?: string;
  station_walk1?: number;
  area_land_m2?: number;
  area_build_m2?: number;
  area_exclusive_m2?: number;
  rooms?: string;
  building_year?: number;
  building_month?: number;
  images?: { url: string; is_main: boolean }[];
  status?: string;
}

export default function PropertyCard({ property }: { property: Property }) {
  const mainImage = property.images?.find((img) => img.is_main)?.url ?? property.images?.[0]?.url;
  const priceMan = Math.round(property.price / 10000);

  return (
    <Link
      href={`/properties/${property.id}`}
      className="block bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
    >
      {/* サムネイル */}
      <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden">
        {mainImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={mainImage}
            alt={property.catch_copy ?? property.title ?? "物件画像"}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
            画像なし
          </div>
        )}
      </div>

      {/* 情報 */}
      <div className="p-3">
        <p className="font-bold text-lg" style={{ color: "#5BAD52" }}>
          {priceMan.toLocaleString()}万円
        </p>
        <p className="text-sm text-gray-600 mt-1 line-clamp-1">
          {property.catch_copy ?? property.title ?? ""}
        </p>
        <p className="text-xs text-gray-400 mt-1">
          {property.city}{property.address}
        </p>
        {property.station_name1 && (
          <p className="text-xs text-gray-400">
            {property.station_name1}駅 徒歩{property.station_walk1}分
          </p>
        )}
      </div>
    </Link>
  );
}
