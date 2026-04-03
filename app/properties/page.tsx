import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "物件検索",
  description: "東京都心・城南・城西エリアの土地・戸建て・マンションを検索できます。",
};

type Property = {
  id: string;
  property_number: string;
  property_type: string;
  title?: string;
  catch_copy?: string;
  price?: number;
  city?: string;
  town?: string;
  station_name1?: string;
  station_line1?: string;
  station_walk1?: number;
  rooms?: string;
  area_build_m2?: number;
  area_land_m2?: number;
  area_exclusive_m2?: number;
  building_year?: number;
  building_month?: number;
  images?: { url: string; room_type?: string }[];
  published_at?: string;
};

const TYPE_LABEL: Record<string, string> = {
  NEW_HOUSE: "新築戸建", USED_HOUSE: "中古戸建",
  MANSION: "マンション", LAND: "土地", OTHER: "その他",
};

const TYPE_COLOR: Record<string, string> = {
  NEW_HOUSE: "#c9a96e", USED_HOUSE: "#5c8a6e",
  MANSION: "#5c6e8a", LAND: "#8a7a5c", OTHER: "#706e68",
};

async function getProperties(searchParams: {
  area?: string; type?: string; price_max?: string; walk?: string; page?: string;
}) {
  try {
    const params = new URLSearchParams();
    params.set("status", "PUBLISHED");
    params.set("limit", "12");
    if (searchParams.area) params.set("city", searchParams.area);
    if (searchParams.type) params.set("property_type", searchParams.type);
    if (searchParams.price_max) params.set("price_max", searchParams.price_max);
    if (searchParams.walk) params.set("station_walk_max", searchParams.walk);
    if (searchParams.page) params.set("page", searchParams.page);

    const adminUrl = process.env.ADMIN_API_URL ?? "http://localhost:3001";
    const apiUrl = `${adminUrl}/api/properties?${params.toString()}`;
    console.log("[HP Properties] Fetching:", apiUrl);

    const res = await fetch(apiUrl, { cache: "no-store" });
    console.log("[HP Properties] Status:", res.status);

    if (!res.ok) {
      console.log("[HP Properties] Error:", res.statusText);
      return { properties: [], total: 0 };
    }

    const data = await res.json();
    console.log("[HP Properties] Count:", data.properties?.length, "Total:", data.total);
    console.log("[HP Properties] First ID:", data.properties?.[0]?.id);

    return { properties: (data.properties ?? []) as Property[], total: data.total ?? 0 };
  } catch (e: unknown) {
    console.error("[HP Properties] Exception:", e instanceof Error ? e.message : String(e));
    return { properties: [], total: 0 };
  }
}

const AREAS = ["目黒区", "世田谷区", "渋谷区", "品川区", "港区", "中野区", "杉並区", "新宿区", "文京区"];
const TYPES = [
  { value: "NEW_HOUSE", label: "新築戸建て" },
  { value: "USED_HOUSE", label: "中古戸建て" },
  { value: "MANSION", label: "マンション" },
  { value: "LAND", label: "土地" },
];
const PRICES = [3000, 5000, 7000, 10000, 15000, 20000, 30000];
const WALKS = [5, 10, 15, 20];

export default async function PropertiesPage({
  searchParams,
}: {
  searchParams: { area?: string; type?: string; price_max?: string; walk?: string; page?: string };
}) {
  const { properties, total } = await getProperties(searchParams);
  const hasFilter = Object.values(searchParams).some(Boolean);

  return (
    <div className="bg-[#fafaf8] min-h-screen">
      {/* ページヘッダー */}
      <div className="pt-24 pb-10 bg-white border-b border-[#e8e6e0]">
        <div className="container-xl">
          <p className="text-[#c9a96e] text-xs tracking-[0.4em] mb-2 font-serif">PROPERTIES</p>
          <h1 className="font-serif text-3xl font-bold text-[#1c1b18]">物件検索</h1>
          {total > 0 && (
            <p className="text-sm text-[#706e68] mt-2">{total}件の物件が見つかりました</p>
          )}
        </div>
      </div>

      {/* 検索フィルター（スティッキー） */}
      <div className="bg-white shadow-sm sticky top-16 z-40 border-b border-[#e8e6e0]">
        <div className="container-xl py-4">
          <form className="flex flex-wrap gap-3 items-center">
            <select name="area" defaultValue={searchParams.area ?? ""}
              className="px-4 py-2.5 rounded-xl border border-[#e8e6e0] text-sm text-[#1c1b18] bg-white">
              <option value="">エリアを選択</option>
              {AREAS.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
            <select name="type" defaultValue={searchParams.type ?? ""}
              className="px-4 py-2.5 rounded-xl border border-[#e8e6e0] text-sm text-[#1c1b18] bg-white">
              <option value="">物件種別</option>
              {TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
            <select name="price_max" defaultValue={searchParams.price_max ?? ""}
              className="px-4 py-2.5 rounded-xl border border-[#e8e6e0] text-sm text-[#1c1b18] bg-white">
              <option value="">価格上限</option>
              {PRICES.map(p => <option key={p} value={p}>{p.toLocaleString()}万円以内</option>)}
            </select>
            <select name="walk" defaultValue={searchParams.walk ?? ""}
              className="px-4 py-2.5 rounded-xl border border-[#e8e6e0] text-sm text-[#1c1b18] bg-white">
              <option value="">駅徒歩</option>
              {WALKS.map(w => <option key={w} value={w}>徒歩{w}分以内</option>)}
            </select>
            <button type="submit"
              className="bg-[#1a3a2a] text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-[#2d5a3e] transition-colors">
              検索する
            </button>
            {hasFilter && (
              <Link href="/properties" className="text-sm text-[#706e68] hover:text-[#c9a96e] transition-colors">
                条件をリセット
              </Link>
            )}
          </form>
        </div>
      </div>

      {/* 物件グリッド */}
      <div className="container-xl py-12">
        {properties.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-[#e8e6e0] rounded-full flex items-center justify-center mx-auto mb-4">
              <svg width="32" height="32" viewBox="0 0 48 48" fill="none">
                <path d="M24 8L4 22h6v18h10V28h8v12h10V22h6L24 8z" fill="#706e68" fillOpacity="0.4"/>
              </svg>
            </div>
            <p className="text-[#706e68] mb-2">条件に合う物件が見つかりませんでした。</p>
            <Link href="/properties" className="text-sm text-[#c9a96e] hover:underline">
              条件をリセットして再検索
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map(property => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function PropertyCard({ property }: { property: Property }) {
  const mainImage = property.images?.find(i => i.room_type === "外観")?.url
    ?? property.images?.[0]?.url;
  const typeLabel = TYPE_LABEL[property.property_type] ?? property.property_type;
  const typeColor = TYPE_COLOR[property.property_type] ?? "#706e68";
  const isNew = property.published_at &&
    (Date.now() - new Date(property.published_at).getTime()) < 7 * 24 * 60 * 60 * 1000;
  const area = property.area_build_m2 ?? property.area_exclusive_m2 ?? property.area_land_m2;
  const buildingDate = property.building_year
    ? `${property.building_year}年${property.building_month ?? ""}月築`
    : null;

  return (
    <Link href={`/properties/${property.id}`} className="group block">
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-[#e8e6e0]">
        <div className="relative h-52 overflow-hidden">
          {mainImage ? (
            <Image
              src={mainImage}
              alt={property.title ?? "物件画像"}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, 33vw"
              unoptimized
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-[#1a3a2a] to-[#2d5a3e]">
              <svg width="40" height="40" viewBox="0 0 48 48" fill="none" className="opacity-30">
                <path d="M24 8L4 22h6v18h10V28h8v12h10V22h6L24 8z" fill="white"/>
              </svg>
              <span className="text-white/30 text-xs mt-2">写真準備中</span>
            </div>
          )}
          <div className="absolute top-3 left-3 flex gap-2">
            <span className="px-2.5 py-1 rounded-full text-white text-xs font-bold"
              style={{ background: typeColor }}>
              {typeLabel}
            </span>
            {isNew && (
              <span className="bg-[#c9a96e] text-white text-xs font-bold px-2.5 py-1 rounded-full">NEW</span>
            )}
          </div>
        </div>
        <div className="p-5">
          <div className="text-2xl font-bold text-[#c9a96e] mb-1">
            {property.price ? `${property.price.toLocaleString()}万円` : "価格応談"}
          </div>
          {property.catch_copy && (
            <p className="text-[#706e68] text-xs mb-2 font-serif line-clamp-1">{property.catch_copy}</p>
          )}
          <p className="text-sm text-[#1c1b18] font-bold mb-1 line-clamp-1">
            {property.title ?? `${property.city ?? ""}${property.town ?? ""}`}
          </p>
          {property.station_name1 && (
            <p className="text-xs text-[#706e68] mb-3">
              {property.station_line1 ? `${property.station_line1} ` : ""}{property.station_name1}駅 徒歩{property.station_walk1}分
            </p>
          )}
          <div className="flex flex-wrap gap-2 pt-3 border-t border-[#e8e6e0]">
            {property.rooms && (
              <span className="bg-[#f5f5f0] text-[#706e68] text-xs px-2 py-1 rounded">{property.rooms}</span>
            )}
            {area && (
              <span className="bg-[#f5f5f0] text-[#706e68] text-xs px-2 py-1 rounded">{area}㎡</span>
            )}
            {buildingDate && (
              <span className="bg-[#f5f5f0] text-[#706e68] text-xs px-2 py-1 rounded">{buildingDate}</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
