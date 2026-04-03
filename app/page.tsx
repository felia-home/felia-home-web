import Link from "next/link";
import PropertyCard, { type Property } from "@/components/PropertyCard";

const FALLBACK_PROPERTIES: Property[] = [
  {
    id: "1",
    property_type: "NEW_HOUSE",
    title: "目黒区平町 新築戸建",
    catch_copy: "閑静な住宅街に佇む、光溢れる住まい",
    price: 12800,
    city: "目黒区",
    town: "平町2丁目",
    station_name1: "都立大学",
    station_walk1: 8,
    rooms: "4LDK",
    area_build_m2: 105.5,
    area_land_m2: 78.2,
  },
  {
    id: "2",
    property_type: "USED_HOUSE",
    title: "世田谷区上馬 中古戸建",
    catch_copy: "駅徒歩5分・整形地・リフォーム済み",
    price: 8500,
    city: "世田谷区",
    town: "上馬3丁目",
    station_name1: "三軒茶屋",
    station_walk1: 5,
    rooms: "3LDK",
    area_build_m2: 92.3,
    area_land_m2: 65.8,
  },
  {
    id: "3",
    property_type: "LAND",
    title: "渋谷区本町 土地",
    catch_copy: "建築条件なし・南向き整形地",
    price: 18000,
    city: "渋谷区",
    town: "本町4丁目",
    station_name1: "幡ヶ谷",
    station_walk1: 6,
    area_land_m2: 120.0,
  },
];

async function getFeaturedProperties(): Promise<Property[]> {
  try {
    const adminUrl = process.env.ADMIN_API_URL ?? "http://localhost:3001";
    const res = await fetch(`${adminUrl}/api/properties?status=PUBLISHED`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return FALLBACK_PROPERTIES;
    const data = await res.json();
    const props = (data.properties ?? []).slice(0, 6);
    return props.length > 0 ? props : FALLBACK_PROPERTIES;
  } catch {
    return FALLBACK_PROPERTIES;
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
    icon: (
      <svg width="40" height="40" viewBox="0 0 48 48" fill="none" className="mx-auto">
        <path d="M24 10L8 22h4v16h10v-10h4v10h10V22h4L24 10z" fill="#c9a96e"/>
      </svg>
    ),
    title: "地域密着20年",
    description:
      "城南・城西エリアに特化した豊富な取引実績。地域の相場感と独自の情報ネットワークを持っています。",
  },
  {
    icon: (
      <svg width="40" height="40" viewBox="0 0 48 48" fill="none" className="mx-auto">
        <rect x="10" y="20" width="28" height="20" rx="2" stroke="#c9a96e" strokeWidth="2.5"/>
        <path d="M18 20v-4a6 6 0 0 1 12 0v4" stroke="#c9a96e" strokeWidth="2.5"/>
        <circle cx="24" cy="31" r="3" fill="#c9a96e"/>
      </svg>
    ),
    title: "未公開物件多数",
    description:
      "ポータルサイトに掲載されない弊社限定物件を多数ご紹介。会員登録で全物件をご覧いただけます。",
  },
  {
    icon: (
      <svg width="40" height="40" viewBox="0 0 48 48" fill="none" className="mx-auto">
        <rect x="10" y="14" width="28" height="22" rx="2" stroke="#c9a96e" strokeWidth="2.5"/>
        <path d="M16 22h16M16 28h10" stroke="#c9a96e" strokeWidth="2.5" strokeLinecap="round"/>
        <path d="M24 8v6" stroke="#c9a96e" strokeWidth="2.5" strokeLinecap="round"/>
      </svg>
    ),
    title: "宅建士が直接対応",
    description:
      "全スタッフが宅地建物取引士の資格保有。専門知識を持つプロが購入から引き渡しまでサポートします。",
  },
  {
    icon: (
      <svg width="40" height="40" viewBox="0 0 48 48" fill="none" className="mx-auto">
        <path d="M16 20c0-4.4 3.6-8 8-8s8 3.6 8 8" stroke="#c9a96e" strokeWidth="2.5"/>
        <path d="M10 34c0-6 6-10 14-10s14 4 14 10" stroke="#c9a96e" strokeWidth="2.5" strokeLinecap="round"/>
        <path d="M34 26l4 4-4 4" stroke="#c9a96e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
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
        {/* 背景グラデーション */}
        <div className="absolute inset-0" style={{
          background: "linear-gradient(135deg, #0d2418 0%, #1a3a2a 40%, #234d38 70%, #1a3a2a 100%)",
        }} />

        {/* 装飾パターン */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23c9a96e' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />

        {/* ゴールドのトップライン */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#c9a96e] to-transparent" />

        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <p className="text-xs tracking-[0.4em] mb-8 text-[#c9a96e] font-serif uppercase">
            Tokyo Premium Real Estate
          </p>
          <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold mb-8 leading-tight">
            あなたの幸せを、
            <br />
            <span className="text-[#c9a96e]">住まい</span>で実現する。
          </h1>
          <p className="text-base sm:text-lg text-white/70 mb-14 leading-relaxed">
            東京都心・城南・城西エリアの不動産売買専門。
            <br className="hidden sm:block" />
            ご家族のライフスタイルに合った、理想の住まいをご提案します。
          </p>

          {/* 検索ボックス */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-2 max-w-2xl mx-auto border border-white/20">
            <div className="flex gap-2">
              <select className="flex-1 px-4 py-3.5 rounded-xl bg-white text-[#1c1b18] text-sm border-0 focus:ring-2 focus:ring-[#c9a96e] focus:outline-none">
                <option value="">エリアを選択</option>
                <option value="meguro">目黒区</option>
                <option value="setagaya">世田谷区</option>
                <option value="shibuya">渋谷区</option>
                <option value="shinagawa">品川区</option>
                <option value="minato">港区</option>
                <option value="nakano">中野区</option>
                <option value="suginami">杉並区</option>
              </select>
              <select className="flex-1 px-4 py-3.5 rounded-xl bg-white text-[#1c1b18] text-sm border-0 focus:ring-2 focus:ring-[#c9a96e] focus:outline-none">
                <option value="">種別を選択</option>
                <option value="NEW_HOUSE">新築戸建て</option>
                <option value="USED_HOUSE">中古戸建て</option>
                <option value="MANSION">マンション</option>
                <option value="LAND">土地</option>
              </select>
              <Link
                href="/properties"
                className="bg-[#c9a96e] text-white px-8 py-3.5 rounded-xl text-sm font-bold hover:bg-[#b8935a] transition-colors whitespace-nowrap"
              >
                検索する
              </Link>
            </div>
          </div>
        </div>

        {/* スクロールインジケーター */}
        <div className="absolute bottom-28 left-1/2 -translate-x-1/2 text-white/40 text-[10px] tracking-[0.3em] flex flex-col items-center gap-2">
          <span>SCROLL</span>
          <div className="w-px h-6 bg-gradient-to-b from-white/40 to-transparent" />
        </div>

        {/* 統計数字バー */}
        <div className="absolute bottom-0 left-0 right-0 bg-black/30 backdrop-blur-sm border-t border-white/10">
          <div className="max-w-4xl mx-auto px-4 py-5">
            <div className="grid grid-cols-3 gap-4 text-white text-center">
              <div>
                <div className="font-serif text-3xl font-bold text-[#c9a96e]">20+</div>
                <div className="text-xs text-white/60 mt-1 tracking-wider">年の実績</div>
              </div>
              <div className="border-x border-white/20">
                <div className="font-serif text-3xl font-bold text-[#c9a96e]">1,000+</div>
                <div className="text-xs text-white/60 mt-1 tracking-wider">成約実績</div>
              </div>
              <div>
                <div className="font-serif text-3xl font-bold text-[#c9a96e]">全員</div>
                <div className="text-xs text-white/60 mt-1 tracking-wider">宅建士有資格</div>
              </div>
            </div>
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>

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
                className="group relative h-52 rounded-2xl overflow-hidden block"
              >
                {/* グラデーション背景 */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#1a3a2a] to-[#2d5a3e] group-hover:from-[#234d38] group-hover:to-[#3d7a52] transition-all duration-500" />

                {/* 装飾パターン */}
                <div className="absolute inset-0 opacity-5" style={{
                  backgroundImage: "radial-gradient(circle at 70% 30%, #c9a96e 1px, transparent 1px)",
                  backgroundSize: "20px 20px",
                }} />

                <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                  <div className="font-serif text-3xl font-bold mb-2 group-hover:scale-110 transition-transform duration-300">
                    {area.name}
                  </div>
                  <div className="text-xs text-white/50 tracking-wider">{area.name} REAL ESTATE</div>
                  <div className="mt-4 bg-[#c9a96e]/20 border border-[#c9a96e]/40 rounded-full px-4 py-1 text-xs text-[#c9a96e]">
                    {area.count.toLocaleString()}件掲載中
                  </div>
                </div>

                {/* ホバー時アクセントライン */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#c9a96e] scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── 選ばれる理由 ────────────────────────────────────────────────── */}
      <section className="py-20 bg-[#1a3a2a] text-white">
        <div className="container-xl">
          <div className="text-center mb-16">
            <p className="text-[#c9a96e] text-sm tracking-[0.3em] mb-3 font-serif">
              WHY FELIA HOME
            </p>
            <h2 className="font-serif text-3xl font-bold">
              フェリアホームが選ばれる理由
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {STRENGTHS.map((s, i) => (
              <div key={i} className="relative text-center group">
                {/* 番号バッジ */}
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#c9a96e]/20 border border-[#c9a96e]/40 flex items-center justify-center">
                  <span className="text-[#c9a96e] text-xs font-serif font-bold">0{i + 1}</span>
                </div>

                <div className="pt-6 mb-4">{s.icon}</div>
                <h3 className="font-serif text-lg font-bold mb-3 text-[#c9a96e]">
                  {s.title}
                </h3>
                <p className="text-sm text-white/60 leading-relaxed max-w-[200px] mx-auto">{s.description}</p>
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
