import { Metadata } from "next";
import PropertyCard, { type Property } from "@/components/PropertyCard";
import Link from "next/link";

export const metadata: Metadata = {
  title: "物件検索",
  description:
    "東京都心・城南・城西エリアの不動産物件を検索。目黒区・世田谷区・渋谷区・品川区・港区の土地・戸建て・マンション。",
};

const AREAS = ["目黒区", "世田谷区", "渋谷区", "品川区", "港区", "中野区", "杉並区"];
const TYPES = [
  { value: "NEW_HOUSE",   label: "新築戸建て" },
  { value: "USED_HOUSE",  label: "中古戸建て" },
  { value: "MANSION",     label: "マンション" },
  { value: "NEW_MANSION", label: "新築マンション" },
  { value: "LAND",        label: "土地" },
];
const PRICES = [
  { value: "3000", label: "3,000万円以下" },
  { value: "5000", label: "5,000万円以下" },
  { value: "7000", label: "7,000万円以下" },
  { value: "10000", label: "1億円以下" },
  { value: "", label: "上限なし" },
];
const WALKS = [
  { value: "5", label: "徒歩5分以内" },
  { value: "10", label: "徒歩10分以内" },
  { value: "15", label: "徒歩15分以内" },
];

async function getProperties(searchParams: Record<string, string>): Promise<{
  properties: Property[];
  total: number;
}> {
  try {
    const adminUrl = process.env.ADMIN_API_URL ?? "http://localhost:3001";
    const params = new URLSearchParams();
    params.set("status", "PUBLISHED");
    if (searchParams.type)   params.set("property_type", searchParams.type);
    if (searchParams.area)   params.set("search", searchParams.area);
    if (searchParams.walk)   params.set("station_walk_max", searchParams.walk);
    if (searchParams.price)  params.set("price_max", searchParams.price);
    if (searchParams.page)   params.set("page", searchParams.page);

    const res = await fetch(`${adminUrl}/api/properties?${params}`, {
      next: { revalidate: 120 },
    });
    if (!res.ok) return { properties: [], total: 0 };
    const data = await res.json();
    return { properties: data.properties ?? [], total: data.total ?? 0 };
  } catch {
    return { properties: [], total: 0 };
  }
}

export default async function PropertiesPage({
  searchParams,
}: {
  searchParams: Record<string, string>;
}) {
  const { properties, total } = await getProperties(searchParams);

  return (
    <div className="pt-24 pb-20 bg-[#fafaf8] min-h-screen">
      <div className="container-xl">
        {/* ページヘッダー */}
        <div className="mb-8">
          <p className="text-[#c9a96e] text-xs tracking-[0.3em] mb-2 font-serif">PROPERTIES</p>
          <h1 className="font-serif text-3xl font-bold text-[#1c1b18]">物件検索</h1>
        </div>

        {/* 検索フォーム */}
        <form className="bg-white rounded-2xl p-6 shadow-sm mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-xs text-[#706e68] mb-1">エリア</label>
              <select
                name="area"
                defaultValue={searchParams.area ?? ""}
                className="w-full px-3 py-2.5 border border-[#e8e6e0] rounded-xl text-sm text-[#1c1b18]"
              >
                <option value="">すべて</option>
                {AREAS.map((a) => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-[#706e68] mb-1">物件種別</label>
              <select
                name="type"
                defaultValue={searchParams.type ?? ""}
                className="w-full px-3 py-2.5 border border-[#e8e6e0] rounded-xl text-sm text-[#1c1b18]"
              >
                <option value="">すべて</option>
                {TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-[#706e68] mb-1">価格上限</label>
              <select
                name="price"
                defaultValue={searchParams.price ?? ""}
                className="w-full px-3 py-2.5 border border-[#e8e6e0] rounded-xl text-sm text-[#1c1b18]"
              >
                <option value="">上限なし</option>
                {PRICES.map((p) => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-[#706e68] mb-1">駅徒歩</label>
              <select
                name="walk"
                defaultValue={searchParams.walk ?? ""}
                className="w-full px-3 py-2.5 border border-[#e8e6e0] rounded-xl text-sm text-[#1c1b18]"
              >
                <option value="">指定なし</option>
                {WALKS.map((w) => (
                  <option key={w.value} value={w.value}>{w.label}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-[#1a3a2a] text-white px-8 py-2.5 rounded-xl text-sm font-bold hover:bg-[#2d5a3e] transition-colors"
            >
              検索する
            </button>
          </div>
        </form>

        {/* 件数 */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-[#706e68]">
            {total > 0 ? `${total}件の物件が見つかりました` : "物件を検索してください"}
          </p>
        </div>

        {/* 物件グリッド */}
        {properties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-[#706e68]">
            <p className="text-4xl mb-4">🏠</p>
            <p className="text-lg mb-2">条件に合う物件が見つかりませんでした</p>
            <p className="text-sm">検索条件を変更してお試しください</p>
            <Link
              href="/properties"
              className="inline-block mt-6 border border-[#1a3a2a] text-[#1a3a2a] px-6 py-2.5 rounded-full text-sm hover:bg-[#1a3a2a] hover:text-white transition-colors"
            >
              条件をリセット
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
