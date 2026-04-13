// components/home/FreeBannerSection.tsx
// Phase 2: admin側の banners テーブル・API が完成次第実装
// 現時点では app/page.tsx に組み込まない

import Link from "next/link";

interface Banner {
  id: string;
  image: string;
  href: string;
  alt: string;
}

// TODO: getBanners() を lib/api.ts に追加して差し替え
async function getBanners(): Promise<Banner[]> {
  return [];
}

export async function FreeBannerSection() {
  const banners = await getBanners();
  if (banners.length === 0) return null;

  return (
    <section className="section-padding" style={{ backgroundColor: "#F8F8F8" }}>
      <div className="container-content">
        <div className="grid grid-cols-1 tb:grid-cols-2 gap-4">
          {banners.slice(0, 4).map((banner) => (
            <Link key={banner.id} href={banner.href} className="block group">
              <div className="relative overflow-hidden rounded-lg" style={{ paddingBottom: "40%" }}>
                <div
                  className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                  style={{ backgroundImage: `url(${banner.image})` }}
                />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
