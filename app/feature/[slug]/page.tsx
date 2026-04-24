import { Metadata } from "next";
import Link from "next/link";
import PropertyCard, { type Property } from "@/components/property/PropertyCard";
import { notFound } from "next/navigation";

const AREA_INFO: Record<string, { name: string; description: string; tags: string[] }> = {
  meguro: {
    name: "目黒区",
    description:
      "目黒川の桜並木や中目黒・学芸大学など人気スポットが集まる目黒区。洗練された住宅街と商業エリアが共存し、都心へのアクセスも抜群です。",
    tags: ["中目黒駅", "学芸大学駅", "目黒駅", "都立大学駅", "桜並木"],
  },
  setagaya: {
    name: "世田谷区",
    description:
      "東京23区最大の人口を誇る世田谷区。二子玉川・三軒茶屋・下北沢など個性豊かなエリアが揃い、緑が多く閑静な住宅街が広がります。",
    tags: ["二子玉川駅", "三軒茶屋駅", "下北沢駅", "成城学園前駅", "住宅街"],
  },
  shibuya: {
    name: "渋谷区",
    description:
      "渋谷・原宿・表参道・代々木公園など、トレンドの発信地が集まる渋谷区。再開発が進む渋谷周辺と代々木公園周辺の緑豊かな住宅街が魅力です。",
    tags: ["渋谷駅", "表参道駅", "代々木公園", "恵比寿駅", "再開発"],
  },
  shinagawa: {
    name: "品川区",
    description:
      "新幹線・品川駅を擁する交通の要衝。大崎・五反田のビジネスエリアと武蔵小山・西小山などの下町情緒ある住宅街が共存します。",
    tags: ["品川駅", "五反田駅", "武蔵小山駅", "大井町駅", "新幹線"],
  },
  minato: {
    name: "港区",
    description:
      "六本木・麻布・赤坂など高級住宅街が集まる港区。東京タワー、汐留エリア、品川インターシティなど多彩な顔を持つ東京随一のプレミアムエリアです。",
    tags: ["六本木駅", "麻布十番駅", "広尾駅", "白金台駅", "高級住宅街"],
  },
  nakano: {
    name: "中野区",
    description:
      "中野駅を中心に再開発が進む中野区。新宿まで電車で数分の好立地でありながら、家賃・物価が抑えめで暮らしやすいエリアとして人気が高まっています。",
    tags: ["中野駅", "東中野駅", "新宿へ数分", "再開発", "コスパ好立地"],
  },
  suginami: {
    name: "杉並区",
    description:
      "高円寺・阿佐ヶ谷・荻窪・西荻窪など個性的な商店街が続く杉並区。文化的な雰囲気と落ち着いた住宅街が融合した人気エリアです。",
    tags: ["荻窪駅", "高円寺駅", "阿佐ヶ谷駅", "西荻窪駅", "商店街"],
  },
};

async function getAreaProperties(areaName: string): Promise<{ properties: Property[]; total: number }> {
  try {
    const adminUrl = process.env.ADMIN_API_URL ?? "http://localhost:3001";
    const params = new URLSearchParams({ status: "PUBLISHED", search: areaName, published_hp: "true" });
    const res = await fetch(`${adminUrl}/api/properties?${params}`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return { properties: [], total: 0 };
    const data = await res.json();
    return { properties: data.properties ?? [], total: data.total ?? 0 };
  } catch {
    return { properties: [], total: 0 };
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const area = AREA_INFO[params.slug];
  if (!area) return { title: "エリア情報" };
  return {
    title: `${area.name}の物件`,
    description: area.description,
  };
}

export default async function FeaturePage({ params }: { params: { slug: string } }) {
  const area = AREA_INFO[params.slug];
  if (!area) notFound();

  const { properties, total } = await getAreaProperties(area.name);

  return (
    <div className="pt-20 pb-20 bg-[#fafaf8] min-h-screen">
      {/* エリアヒーロー */}
      <div className="relative h-64 bg-[#1a3a2a] mb-12 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{ backgroundImage: `url('/images/areas/${params.slug}.jpg')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#1a3a2a]/80" />
        <div className="relative h-full flex flex-col justify-end container-xl pb-8">
          <nav className="text-xs text-white/60 flex items-center gap-2 mb-3">
            <Link href="/" className="hover:text-white">ホーム</Link>
            <span>/</span>
            <Link href="/properties" className="hover:text-white">物件検索</Link>
            <span>/</span>
            <span className="text-white">{area.name}</span>
          </nav>
          <h1 className="font-serif text-3xl font-bold text-white">{area.name}の物件</h1>
        </div>
      </div>

      <div className="container-xl">
        {/* エリア説明 */}
        <div className="bg-white rounded-2xl p-8 shadow-sm mb-10">
          <p className="text-sm text-[#706e68] leading-relaxed mb-4">{area.description}</p>
          <div className="flex flex-wrap gap-2">
            {area.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs bg-[#e8f0eb] text-[#1a3a2a] px-3 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* 物件一覧 */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-serif text-xl font-bold text-[#1c1b18]">
            {area.name}の掲載物件
          </h2>
          <p className="text-sm text-[#706e68]">{total}件</p>
        </div>

        {properties.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
              {properties.map((p) => (
                <PropertyCard key={p.id} property={p} />
              ))}
            </div>
            <div className="text-center">
              <Link
                href={`/properties?area=${encodeURIComponent(area.name)}`}
                className="inline-block border border-[#1a3a2a] text-[#1a3a2a] px-8 py-3 rounded-full text-sm hover:bg-[#1a3a2a] hover:text-white transition-colors"
              >
                {area.name}の物件をすべて見る
              </Link>
            </div>
          </>
        ) : (
          <div className="text-center py-16 text-[#706e68]">
            <p className="text-lg mb-2">現在掲載中の物件はありません</p>
            <p className="text-sm mb-6">新着情報はお問合せにてお気軽にご確認ください</p>
            <Link
              href="/contact"
              className="inline-block bg-[#c9a96e] text-white px-8 py-3 rounded-full text-sm font-bold hover:bg-[#b8935a] transition-colors"
            >
              お問合せはこちら
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
