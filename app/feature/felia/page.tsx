import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "弊社限定物件",
  description: "フェリアホームだけが持つ未公開・限定物件をご紹介。ポータルサイトに掲載されない希少物件が多数あります。",
};

export const dynamic = "force-dynamic";

type PrivateProperty = {
  id: string;
  property_type?: string;
  area?: string;
  price?: number;
  price_display?: string;
  rooms?: string;
  area_land_m2?: number;
  area_build_m2?: number;
  station_name?: string;
  station_walk?: number;
  description?: string;
  is_active: boolean;
};

async function getPrivateProperties() {
  try {
    const res = await fetch(
      `${process.env.ADMIN_API_URL}/api/private-properties?is_active=true`,
      { cache: "no-store" }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return (data.properties ?? data ?? []) as PrivateProperty[];
  } catch {
    return [];
  }
}

export default async function FeliaSectionPage() {
  const properties = await getPrivateProperties();

  return (
    <div className="bg-[#fafaf8] min-h-screen">
      {/* ヒーローセクション */}
      <section className="pt-24 pb-16 bg-[#1a3a2a] text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23c9a96e'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/svg%3E")`,
        }} />
        <div className="container-xl relative z-10 text-center">
          <p className="text-[#c9a96e] text-xs tracking-[0.4em] mb-4 font-serif">FELIA SELECTION</p>
          <h1 className="font-serif text-4xl lg:text-5xl font-bold mb-6">
            弊社限定物件
          </h1>
          <p className="text-white/70 max-w-2xl mx-auto leading-relaxed">
            ポータルサイトには掲載されない、フェリアホームだけが持つ
            未公開・限定物件をご紹介します。
            <br />
            売主様から直接お預かりした希少な物件が多数ございます。
          </p>
        </div>
      </section>

      {/* 説明セクション */}
      <section className="py-12 bg-white border-b border-[#e8e6e0]">
        <div className="container-xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {[
              {
                title: "未公開物件",
                desc: "売主様のご要望により、一般には公開していない物件をご紹介します。",
                icon: (
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#c9a96e" strokeWidth="1.5">
                    <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/>
                  </svg>
                ),
              },
              {
                title: "情報が早い",
                desc: "売却を検討中の段階から情報をいただき、いち早くご紹介できます。",
                icon: (
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#c9a96e" strokeWidth="1.5">
                    <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
                  </svg>
                ),
              },
              {
                title: "直接交渉",
                desc: "売主様と直接ご縁をつなぎ、柔軟な条件交渉をサポートします。",
                icon: (
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#c9a96e" strokeWidth="1.5">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                  </svg>
                ),
              },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="w-16 h-16 bg-[#faf6ee] rounded-2xl flex items-center justify-center mb-4">
                  {item.icon}
                </div>
                <h3 className="font-serif text-lg font-bold text-[#1a3a2a] mb-2">{item.title}</h3>
                <p className="text-sm text-[#706e68] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 物件一覧 */}
      <section className="py-16">
        <div className="container-xl">
          {properties.length === 0 ? (
            <div className="text-center py-20">
              <div className="bg-white rounded-2xl border border-[#e8e6e0] p-12 max-w-xl mx-auto">
                <div className="w-20 h-20 bg-[#faf6ee] rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#c9a96e" strokeWidth="1.5">
                    <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/>
                  </svg>
                </div>
                <h2 className="font-serif text-2xl font-bold mb-4">現在、限定物件を準備中です</h2>
                <p className="text-[#706e68] text-sm leading-relaxed mb-8">
                  弊社限定物件は随時更新しております。
                  最新情報はお問合せまたはLINEでお気軽にご連絡ください。
                </p>
                <Link
                  href="/contact"
                  className="inline-block bg-[#c9a96e] text-white px-8 py-3.5 rounded-full font-bold text-sm hover:bg-[#b8935a] transition-colors"
                >
                  限定物件についてお問合せ
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-8">
                <h2 className="font-serif text-2xl font-bold">
                  限定物件一覧
                  <span className="text-sm font-normal text-[#706e68] ml-3">{properties.length}件</span>
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {properties.map((property) => (
                  <div key={property.id} className="bg-white rounded-2xl border border-[#e8e6e0] overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="bg-[#1a3a2a] px-5 py-3 flex items-center justify-between">
                      <span className="text-[#c9a96e] text-xs font-bold tracking-wider">
                        {property.property_type ?? "物件"}
                      </span>
                      <span className="bg-[#c9a96e]/20 text-[#c9a96e] text-xs px-2 py-0.5 rounded-full">
                        限定公開
                      </span>
                    </div>

                    <div className="p-5">
                      <div className="text-2xl font-bold text-[#1a3a2a] mb-3">
                        {property.price_display ?? (property.price ? `${property.price.toLocaleString()}万円` : "価格応談")}
                      </div>

                      {property.area && (
                        <p className="text-sm text-[#706e68] mb-2 flex items-center gap-1.5">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                          </svg>
                          {property.area}
                        </p>
                      )}

                      {property.station_name && (
                        <p className="text-sm text-[#706e68] mb-3 flex items-center gap-1.5">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/><path d="M2 13h20"/>
                          </svg>
                          {property.station_name}駅 徒歩{property.station_walk}分
                        </p>
                      )}

                      <div className="flex flex-wrap gap-2 mb-4">
                        {property.rooms && (
                          <span className="bg-[#f5f5f0] text-xs text-[#706e68] px-2.5 py-1 rounded">
                            {property.rooms}
                          </span>
                        )}
                        {property.area_build_m2 && (
                          <span className="bg-[#f5f5f0] text-xs text-[#706e68] px-2.5 py-1 rounded">
                            建物{property.area_build_m2}㎡
                          </span>
                        )}
                        {property.area_land_m2 && (
                          <span className="bg-[#f5f5f0] text-xs text-[#706e68] px-2.5 py-1 rounded">
                            土地{property.area_land_m2}㎡
                          </span>
                        )}
                      </div>

                      {property.description && (
                        <p className="text-xs text-[#706e68] leading-relaxed mb-4 line-clamp-2">
                          {property.description}
                        </p>
                      )}

                      <Link
                        href="/contact"
                        className="block w-full text-center bg-[#1a3a2a] text-white py-2.5 rounded-xl text-sm font-bold hover:bg-[#2d5a3e] transition-colors"
                      >
                        詳細を問合せる
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#c9a96e]">
        <div className="container-xl text-center text-white">
          <h2 className="font-serif text-2xl font-bold mb-3">
            ご希望の物件が見つからない場合も、お気軽にご相談ください
          </h2>
          <p className="text-white/80 text-sm mb-8">
            非公開情報を含む、多数の物件情報をご用意しております。
          </p>
          <Link
            href="/contact"
            className="inline-block bg-white text-[#1a3a2a] px-10 py-3.5 rounded-full font-bold text-sm hover:bg-[#fafaf8] transition-colors"
          >
            無料でご相談する
          </Link>
        </div>
      </section>
    </div>
  );
}
