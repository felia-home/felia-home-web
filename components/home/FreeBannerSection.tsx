// components/home/FreeBannerSection.tsx
import Link from "next/link";
import { getBanners, type Banner } from "@/lib/api";

export async function FreeBannerSection() {
  let banners: Banner[] = [];
  try {
    banners = await getBanners();
  } catch {
    // Admin API 未起動時はスキップ
  }

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
