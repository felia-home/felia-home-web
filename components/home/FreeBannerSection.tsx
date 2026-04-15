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

  const visible = banners
    .filter((b) => !!b.image_url)
    .sort((a, b) => a.sort_order - b.sort_order)
    .slice(0, 4);

  if (visible.length === 0) return null;

  return (
    <section style={{ backgroundColor: "#F8F8F8", padding: "40px 0" }}>
      <div className="container-content">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "16px" }}>
          {visible.map((banner) =>
            banner.link_url ? (
              <Link
                key={banner.id}
                href={banner.link_url}
                target={banner.link_target === "_blank" ? "_blank" : undefined}
                rel={banner.link_target === "_blank" ? "noopener noreferrer" : undefined}
                style={{ display: "block" }}
              >
                <div style={{ position: "relative", overflow: "hidden", borderRadius: "8px", paddingBottom: "40%" }}>
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      backgroundImage: `url(${banner.image_url})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  />
                </div>
              </Link>
            ) : (
              <div key={banner.id} style={{ position: "relative", overflow: "hidden", borderRadius: "8px", paddingBottom: "40%" }}>
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    backgroundImage: `url(${banner.image_url})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
}
