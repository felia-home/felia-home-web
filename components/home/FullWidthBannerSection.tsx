// components/home/FullWidthBannerSection.tsx
import Image from "next/image";
import Link from "next/link";
import { getBanners } from "@/lib/api";
import type { Banner } from "@/lib/api";

export async function FullWidthBannerSection() {
  let banners: Banner[] = [];
  try {
    banners = await getBanners();
  } catch {}

  // バナーが0件の場合は何も表示しない
  if (banners.length === 0) return null;

  return (
    <section>
      {banners.map((banner) => (
        <FullWidthBanner key={banner.id} banner={banner} />
      ))}
    </section>
  );
}

function FullWidthBanner({ banner }: { banner: Banner }) {
  const inner = (
    <div className="relative w-full overflow-hidden" style={{ display: "block" }}>
      <Image
        src={banner.image}
        alt={banner.alt || "バナー"}
        width={1920}
        height={400}
        className="w-full h-auto"
        style={{ display: "block" }}
      />
    </div>
  );

  if (!banner.href) return inner;

  return (
    <Link
      href={banner.href}
      target={banner.alt === "_blank" ? "_blank" : undefined}
      rel={banner.alt === "_blank" ? "noopener noreferrer" : undefined}
    >
      {inner}
    </Link>
  );
}
