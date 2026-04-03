import Link from "next/link";
import PropertyCard, { type Property } from "@/components/PropertyCard";

// 管理システムAPIから掲載中物件を取得
async function getFeaturedProperties(): Promise<Property[]> {
  try {
    const adminUrl = process.env.ADMIN_API_URL ?? "http://localhost:3001";
    const res = await fetch(`${adminUrl}/api/properties?status=PUBLISHED`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return (data.properties ?? []).slice(0, 6);
  } catch {
    return [];
  }
}

const AREAS = [
  { name: "目黒区", slug: "meguro", count: 381 },
  { name: "世田谷区", slug: "setagaya", count: 941 },
  { name: "渋谷区", slug: "shibuya", count: 520 },
  { name: "品川区", slug: "shinagawa", count: 340 },
  { name: "港区", slug: "minato", count: 1116 },
  { name: "中野区", slug: "nakano", count: 280 },
];

const STRENGTHS = [
  {
    icon: "🏡",
    title: "地域密着20年",
    description:
      "城南・城西エリアに特化した豊富な取引実績。地域の相場感と独自の情報ネットワークを持っています。",
  },
  {
    icon: "🔑",
    title: "未公開物件多数",
    description:
      "ポータルサイトに掲載されない弊社限定物件を多数ご紹介。会員登録で全物件をご覧いただけます。",
  },
  {
    icon: "📋",
    title: "宅建士が直接対応",
    description:
      "全スタッフが宅地建物取引士の資格保有。専門知識を持つプロが購入から引き渡しまでサポートします。",
  },
  {
    icon: "🤝",
    title: "契約後も寄り添う",
    description:
      "建築打ち合わせへの同席など、引き渡しまで一貫サポート。10年後も頼れるパートナーを目指します。",
  },
];

export default async function HomePage() {
  const properties = await getFeaturedProperties();

  return (
    <>
      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <section className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden">
        {/* 背景グラデーション（画像なし時のフォールバック含む） */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/hero-bg.jpg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a3a2a]/65 via-[#1a3a2a]/45 to-[#1a3a2a]/70" />

        <div className="relative z-10 text-center text-white px-4 w-full">
          <p className="text-sm tracking-[0.3em] mb-6 text-[#c9a96e] font-serif">
            TOKYO PREMIUM REAL ESTATE
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            あなたの幸せを、
            <br />
            住まいで実現する。
          </h1>
          <p className="text-base sm:text-lg text-white/80 mb-12 max-w-xl mx-auto leading-relaxed">
            東京都心・城南・城西エリアの不動産売買専門。
            <br />
            ご家族のライフスタイルに合った、理想の住まいをご提案します。
          </p>

          {/* 簡易検索ボックス */}
          <div className="bg-white rounded-2xl p-4 max-w-2xl mx-auto shadow-2xl">
            <div className="flex gap-2 flex-col sm:flex-row">
              <select className="flex-1 px-4 py-3 rounded-xl border border-[#e8e6e0] text-[#1c1b18] text-sm font-sans">
                <option value="">エリアを選択</option>
                <option>目黒区</option>
                <option>世田谷区</option>
                <option>渋谷区</option>
                <option>品川区</option>
                <option>港区</option>
                <option>中野区</option>
                <option>杉並区</option>
              </select>
              <select className="flex-1 px-4 py-3 rounded-xl border border-[#e8e6e0] text-[#1c1b18] text-sm font-sans">
                <option value="">種別を選択</option>
                <option>新築戸建て</option>
                <option>中古戸建て</option>
                <option>マンション</option>
                <option>土地</option>
              </select>
              <Link
                href="/properties"
                className="bg-[#1a3a2a] text-white px-8 py-3 rounded-xl text-sm font-bold hover:bg-[#2d5a3e] transition-colors whitespace-nowrap"
              >
                検索
              </Link>
            </div>
          </div>
        </div>

        {/* スクロールインジケーター */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60 text-xs tracking-widest">
          <div className="flex flex-col items-center gap-2">
            <span>SCROLL</span>
            <div className="w-px h-8 bg-white/40 animate-pulse" />
          </div>
        </div>
      </section>

      {/* ── 注目物件 ────────────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="container-xl">
          <div className="text-center mb-12">
            <p className="text-[#c9a96e] text-sm tracking-[0.3em] mb-3 font-serif">
              FEATURED PROPERTIES
            </p>
            <h2 className="font-serif text-3xl font-bold text-[#1c1b18]">注目の物件</h2>
          </div>

          {properties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <div className="text-center text-[#706e68] py-12">
              <p>物件を読み込んでいます...</p>
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              href="/properties"
              className="inline-flex items-center gap-2 border border-[#1a3a2a] text-[#1a3a2a] px-8 py-3.5 rounded-full text-sm hover:bg-[#1a3a2a] hover:text-white transition-colors"
            >
              物件をもっと見る
              <span>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── エリアから探す ───────────────────────────────────────────────── */}
      <section className="py-20 bg-[#fafaf8]">
        <div className="container-xl">
          <div className="text-center mb-12">
            <p className="text-[#c9a96e] text-sm tracking-[0.3em] mb-3 font-serif">
              SEARCH BY AREA
            </p>
            <h2 className="font-serif text-3xl font-bold text-[#1c1b18]">エリアから探す</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {AREAS.map((area) => (
              <Link
                key={area.slug}
                href={`/feature/${area.slug}`}
                className="group relative h-48 rounded-2xl overflow-hidden bg-[#1a3a2a]"
              >
                <div
                  className="absolute inset-0 bg-cover bg-center opacity-50 group-hover:opacity-70 transition-opacity duration-300"
                  style={{ backgroundImage: `url('/images/areas/${area.slug}.jpg')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a3a2a]/90 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <div className="font-serif text-xl font-bold">{area.name}</div>
                  <div className="text-sm text-white/70">{area.count.toLocaleString()}件</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── 選ばれる理由 ────────────────────────────────────────────────── */}
      <section className="py-20 bg-[#1a3a2a] text-white">
        <div className="container-xl">
          <div className="text-center mb-12">
            <p className="text-[#c9a96e] text-sm tracking-[0.3em] mb-3 font-serif">
              WHY FELIA HOME
            </p>
            <h2 className="font-serif text-3xl font-bold">
              フェリアホームが選ばれる理由
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {STRENGTHS.map((s, i) => (
              <div key={i} className="text-center">
                <div className="text-4xl mb-4">{s.icon}</div>
                <h3 className="font-serif text-lg font-bold mb-3 text-[#c9a96e]">
                  {s.title}
                </h3>
                <p className="text-sm text-white/70 leading-relaxed">{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── お問合せCTA ─────────────────────────────────────────────────── */}
      <section className="py-20 bg-[#c9a96e]">
        <div className="container-xl text-center text-white">
          <h2 className="font-serif text-3xl font-bold mb-4">
            まずはお気軽にご相談ください
          </h2>
          <p className="text-white/85 mb-10 text-lg">
            物件探しから資金計画まで、無料でご相談を承ります。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="bg-white text-[#1a3a2a] px-10 py-4 rounded-full font-bold text-sm hover:bg-[#fafaf8] transition-colors"
            >
              無料相談・お問合せ
            </Link>
            <a
              href="tel:0120-000-000"
              className="border-2 border-white text-white px-10 py-4 rounded-full font-bold text-sm hover:bg-white/10 transition-colors"
            >
              📞 0120-000-000
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
