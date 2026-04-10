import '../app/home.css'
import Link from "next/link";
import PropertyCard, { type Property } from "@/components/PropertyCard";
import HeroSlider from "@/components/HeroSlider";
import NewsSection from "@/components/home/NewsSection";
import OpenHouseSection from "@/components/home/OpenHouseSection";
import InformationSection from "@/components/home/InformationSection";
import FeatureSection from "@/components/home/FeatureSection";
import BannerSection from "@/components/home/BannerSection";
import ContactSection from "@/components/home/ContactSection";
import AccessSection from "@/components/home/AccessSection";

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
      <section className="py-16 bg-[#f0f7ee]">
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
      <section className="py-16 bg-white">
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

      {/* ── New（新着物件）+ News（お役立ち情報）横並び ─────────────── */}
      <div className="new-news-wrap">
        {/* 新着物件（左） */}
        <div style={{ padding: '20px' }}>
          <div className="section-header">
            <p className="section-label">New</p>
            <h2 className="section-title">新着物件</h2>
            <Link href="/properties?sort=published_at_desc" className="view-all-link">view more →</Link>
          </div>
          {newProperties.length > 0 ? (
            <div className="flex flex-col gap-3">
              {newProperties.slice(0, 4).map((property) => (
                <Link
                  key={property.id}
                  href={`/properties/${property.id}`}
                  className="flex gap-3 border-b border-[#eee] pb-3 text-inherit no-underline hover:text-[#5BAD52]"
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <div style={{ width: 80, height: 60, background: '#ddd', flexShrink: 0 }} />
                  <div>
                    <p style={{ fontSize: 11, color: '#5b8a6b', marginBottom: 2 }}>{property.property_type}</p>
                    <p style={{ fontSize: 13, color: '#333', lineHeight: 1.4 }}>{property.city}{property.town}</p>
                    <p style={{ fontSize: 12, color: '#666' }}>{property.price ? `${(property.price / 10000).toLocaleString()}万円` : '価格未定'}</p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="no-data">新着物件を準備中です</p>
          )}
        </div>

        {/* お役立ち情報（右） */}
        <NewsSection />
      </div>

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

      {/* ── CTA バナー群（査定・買い替え・FP・採用） ─────────────────── */}
      <BannerSection />

      {/* ── Open House + Information 横並び ──────────────────────────── */}
      <div className="openhouse-info-wrap">
        <OpenHouseSection />
        <InformationSection />
      </div>

      {/* ── Feature（特集・01/02カード・お客様の声バナー） ────────────── */}
      <FeatureSection />

      {/* ── Contact + 優良店認定 ─────────────────────────────────────── */}
      <ContactSection />

      {/* ── Access（地図×2店舗） ─────────────────────────────────────── */}
      <AccessSection />
    </>
  );
}
