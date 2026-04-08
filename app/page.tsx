import Link from "next/link";
import PropertyCard, { type Property } from "@/components/PropertyCard";
import HeroSlider from "@/components/HeroSlider";

export const dynamic = "force-dynamic";

async function getFeaturedProperties(): Promise<Property[]> {
  try {
    const res = await fetch(
      `${process.env.ADMIN_API_URL}/api/properties?status=PUBLISHED&limit=6&sort=published_at_desc`,
      { cache: "no-store" }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.properties ?? [];
  } catch {
    return [];
  }
}

async function getNewProperties(): Promise<Property[]> {
  try {
    const res = await fetch(
      `${process.env.ADMIN_API_URL}/api/properties?status=PUBLISHED&limit=6&sort=published_at_desc&days=30`,
      { cache: "no-store" }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.properties ?? [];
  } catch {
    return [];
  }
}

const AREAS = [
  { name: "渋谷区",   city: "渋谷区" },
  { name: "新宿区",   city: "新宿区" },
  { name: "杉並区",   city: "杉並区" },
  { name: "世田谷区", city: "世田谷区" },
  { name: "文京区",   city: "文京区" },
  { name: "豊島区",   city: "豊島区" },
  { name: "中野区",   city: "中野区" },
  { name: "目黒区",   city: "目黒区" },
  { name: "北区",     city: "北区" },
  { name: "板橋区",   city: "板橋区" },
  { name: "練馬区",   city: "練馬区" },
  { name: "品川区",   city: "品川区" },
  { name: "港区",     city: "港区" },
  { name: "大田区",   city: "大田区" },
  { name: "千代田区", city: "千代田区" },
  { name: "中央区",   city: "中央区" },
  { name: "その他",   city: "" },
];

export default async function HomePage() {
  const [featuredProperties, newProperties] = await Promise.all([
    getFeaturedProperties(),
    getNewProperties(),
  ]);

  return (
    <>
      {/* ── Hero スライダー ───────────────────────────────────────────── */}
      <HeroSlider />

      {/* ── Felia Selection（厳選物件） ──────────────────────────────── */}
      <section className="py-16 bg-white">
        <div className="container-xl">
          <div className="text-center mb-10">
            <p className="text-[#5BAD52] text-sm tracking-[0.3em] mb-2 font-light italic">
              Felia Selection
            </p>
            <h2 className="text-2xl font-bold text-[#333]">厳選物件情報</h2>
            <div className="w-12 h-px bg-[#5BAD52] mx-auto mt-3" />
          </div>

          {featuredProperties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-[#666]">
              <p className="text-lg mb-2">物件情報を準備中です</p>
              <p className="text-sm">最新の物件は物件検索ページでご確認ください。</p>
            </div>
          )}

          <div className="text-center mt-10">
            <Link
              href="/properties"
              className="inline-flex items-center gap-2 border border-[#5BAD52] text-[#5BAD52] px-8 py-3 text-sm hover:bg-[#5BAD52] hover:text-white transition-colors"
            >
              厳選物件一覧はこちら →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Recommend（エリア別） ────────────────────────────────────── */}
      <section className="py-16 bg-[#f0f7ee]">
        <div className="container-xl">
          <div className="text-center mb-10">
            <p className="text-[#5BAD52] text-sm tracking-[0.3em] mb-2 font-light italic">
              Recommend
            </p>
            <h2 className="text-2xl font-bold text-[#333]">エリア別おすすめ物件</h2>
            <div className="w-12 h-px bg-[#5BAD52] mx-auto mt-3" />
          </div>

          <div className="flex flex-wrap gap-2 justify-center">
            {AREAS.map((area) => (
              <Link
                key={area.name}
                href={area.city ? `/properties?city=${encodeURIComponent(area.city)}` : "/properties"}
                className="px-4 py-2 border border-[#5BAD52] text-[#5BAD52] text-sm hover:bg-[#5BAD52] hover:text-white transition-colors"
              >
                {area.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── New（新着物件） ──────────────────────────────────────────── */}
      <section className="py-16 bg-white">
        <div className="container-xl">
          <div className="text-center mb-10">
            <p className="text-[#5BAD52] text-sm tracking-[0.3em] mb-2 font-light italic">
              New
            </p>
            <h2 className="text-2xl font-bold text-[#333]">新着物件</h2>
            <div className="w-12 h-px bg-[#5BAD52] mx-auto mt-3" />
          </div>

          {newProperties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {newProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-[#666]">
              <p className="text-sm">新着物件を準備中です</p>
            </div>
          )}

          <div className="text-center mt-10">
            <Link
              href="/properties?sort=published_at_desc"
              className="inline-flex items-center gap-2 border border-[#5BAD52] text-[#5BAD52] px-8 py-3 text-sm hover:bg-[#5BAD52] hover:text-white transition-colors"
            >
              新着物件一覧はこちら →
            </Link>
          </div>
        </div>
      </section>

      {/* ── 物件検索フォーム ─────────────────────────────────────────── */}
      <section className="py-16 bg-[#f0f7ee]">
        <div className="container-xl">
          <div className="text-center mb-10">
            <p className="text-[#5BAD52] text-sm tracking-[0.3em] mb-2 font-light italic">
              Search
            </p>
            <h2 className="text-2xl font-bold text-[#333]">物件を探す</h2>
            <div className="w-12 h-px bg-[#5BAD52] mx-auto mt-3" />
          </div>

          {/* エリア・路線タブ（簡略版） */}
          <div className="max-w-3xl mx-auto bg-white border border-[#e0e0e0] p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <select
                className="px-4 py-3 border border-[#e0e0e0] text-sm text-[#333] focus:outline-none focus:border-[#5BAD52]"
                defaultValue=""
              >
                <option value="">エリアを選択</option>
                {AREAS.filter((a) => a.city).map((area) => (
                  <option key={area.city} value={area.city}>{area.name}</option>
                ))}
              </select>
              <select
                className="px-4 py-3 border border-[#e0e0e0] text-sm text-[#333] focus:outline-none focus:border-[#5BAD52]"
                defaultValue=""
              >
                <option value="">物件種別</option>
                <option value="NEW_HOUSE">新築戸建て</option>
                <option value="USED_HOUSE">中古戸建て</option>
                <option value="MANSION">マンション</option>
                <option value="LAND">土地</option>
              </select>
              <select
                className="px-4 py-3 border border-[#e0e0e0] text-sm text-[#333] focus:outline-none focus:border-[#5BAD52]"
                defaultValue=""
              >
                <option value="">価格帯</option>
                <option value="5000">5,000万円以下</option>
                <option value="8000">8,000万円以下</option>
                <option value="10000">1億円以下</option>
                <option value="10001">1億円以上</option>
              </select>
            </div>
            <div className="text-center">
              <Link
                href="/properties"
                className="inline-block bg-[#5BAD52] text-white px-12 py-3 text-sm font-bold hover:bg-[#3d8a3a] transition-colors"
              >
                この条件で検索する
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── 不動産購入 / 売却 サービス紹介 ─────────────────────────── */}
      <section className="py-16 bg-white">
        <div className="container-xl">
          <div className="text-center mb-10">
            <p className="text-[#5BAD52] text-sm tracking-[0.3em] mb-2 font-light italic">
              Service
            </p>
            <h2 className="text-2xl font-bold text-[#333]">サービス</h2>
            <div className="w-12 h-px bg-[#5BAD52] mx-auto mt-3" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* 購入 */}
            <div className="border border-[#e0e0e0] p-8 text-center hover:border-[#5BAD52] hover:shadow-md transition-all">
              <div className="w-16 h-16 rounded-full bg-[#f0f7ee] flex items-center justify-center mx-auto mb-4">
                <svg width="32" height="32" viewBox="0 0 48 48" fill="none">
                  <path d="M24 8L8 20h4v18h10V28h4v10h10V20h4L24 8z" fill="#5BAD52"/>
                </svg>
              </div>
              <h3 className="text-lg font-bold text-[#333] mb-3">不動産を購入する</h3>
              <p className="text-sm text-[#666] leading-relaxed mb-6">
                東京都心・城南・城西エリアの物件を豊富にご紹介。<br />
                宅建士スタッフが購入から引き渡しまでサポートします。
              </p>
              <Link
                href="/service"
                className="inline-block border border-[#5BAD52] text-[#5BAD52] px-6 py-2 text-sm hover:bg-[#5BAD52] hover:text-white transition-colors"
              >
                詳しく見る →
              </Link>
            </div>

            {/* 売却 */}
            <div className="border border-[#e0e0e0] p-8 text-center hover:border-[#5BAD52] hover:shadow-md transition-all">
              <div className="w-16 h-16 rounded-full bg-[#f0f7ee] flex items-center justify-center mx-auto mb-4">
                <svg width="32" height="32" viewBox="0 0 48 48" fill="none">
                  <rect x="8" y="14" width="32" height="22" rx="2" stroke="#5BAD52" strokeWidth="2.5"/>
                  <path d="M16 24h16M24 18v12" stroke="#5BAD52" strokeWidth="2.5" strokeLinecap="round"/>
                </svg>
              </div>
              <h3 className="text-lg font-bold text-[#333] mb-3">不動産を売却する</h3>
              <p className="text-sm text-[#666] leading-relaxed mb-6">
                地域密着の豊富な実績で、適正価格での売却をサポート。<br />
                まずは無料査定をお試しください。
              </p>
              <Link
                href="/contact"
                className="inline-block border border-[#5BAD52] text-[#5BAD52] px-6 py-2 text-sm hover:bg-[#5BAD52] hover:text-white transition-colors"
              >
                無料査定を依頼する →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── お問合せCTA ─────────────────────────────────────────────── */}
      <section className="py-14 bg-[#5BAD52]">
        <div className="container-xl text-center text-white">
          <h2 className="text-2xl font-bold mb-3">まずはお気軽にご相談ください</h2>
          <p className="text-white/85 mb-8 text-sm">
            物件探しから資金計画まで、無料でご相談を承ります。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="bg-white text-[#5BAD52] px-8 py-3 font-bold text-sm hover:bg-[#f0f7ee] transition-colors"
            >
              無料相談・お問合せ
            </Link>
            <a
              href="tel:0359818601"
              className="border-2 border-white text-white px-8 py-3 font-bold text-sm hover:bg-white/10 transition-colors"
            >
              📞 03-5981-8601
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
