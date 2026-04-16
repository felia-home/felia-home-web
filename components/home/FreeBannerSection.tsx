// components/home/FreeBannerSection.tsx
import { getFreeBanners, type Banner } from "@/lib/api";
import { FreeBannerItem } from "./FreeBannerItem";

export async function FreeBannerSection() {
  let banners: Banner[] = [];
  try {
    banners = await getFreeBanners();
  } catch {
    // Admin API 未起動時はスキップ
  }

  console.log("FreeBanners:", banners);

  const visible = banners
    .filter((b) => !!b.image_url)
    .sort((a, b) => a.sort_order - b.sort_order)
    .slice(0, 4);

  if (visible.length === 0) return null;

  return (
    <section style={{ backgroundColor: "#F8F8F8" }}>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: "24px",
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "40px 24px",
      }}>
        {visible.map((banner) => (
          <FreeBannerItem key={banner.id} banner={banner} />
        ))}
      </div>
    </section>
  );
}
