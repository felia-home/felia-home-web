// components/home/FullWidthBannerSection.tsx
import Image from "next/image";
import { getBanners } from "@/lib/api";
import type { Banner } from "@/lib/api";

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
              <FullWidthBanner key={banner.id} banner={banner} />
            ))}
        </div>
      </div>
    </section>
  );
}

function FullWidthBanner({ banner }: { banner: Banner }) {
  if (!banner.image_url) return null;

  const inner = (
    <div style={{ display: "block", width: "100%", overflow: "hidden" }}>
      <Image
        src={banner.image_url}
        alt={banner.title || "バナー"}
        width={1920}
        height={400}
        style={{ display: "block", width: "100%", height: "auto" }}
      />
    </div>
  );

  if (!banner.link_url) return inner;

  return (
    <a
      href={banner.link_url}
      target={banner.link_target === "_blank" ? "_blank" : undefined}
      rel={banner.link_target === "_blank" ? "noopener noreferrer" : undefined}
      style={{
        display: "block",
        cursor: "pointer",
        textDecoration: "none",
      }}
    >
      {inner}
    </a>
  );
}
