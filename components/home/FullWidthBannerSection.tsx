// components/home/FullWidthBannerSection.tsx
import { getBanners, type Banner } from "@/lib/api";
import { FullWidthBannerItem } from "./FullWidthBannerItem";

export async function FullWidthBannerSection() {
  let banners: Banner[] = [];
  try {
    banners = await getBanners();
  } catch {}

  if (banners.length === 0) return null;

  return (
    <section style={{ backgroundColor: "#F8F8F8", padding: "24px 0" }}>
      <div className="container-content">
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {banners
            .sort((a, b) => a.sort_order - b.sort_order)
            .map((banner) => (
              <FullWidthBannerItem key={banner.id} banner={banner} />
            ))}
        </div>
      </div>
    </section>
  );
}
