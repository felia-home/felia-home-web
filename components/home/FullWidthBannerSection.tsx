// components/home/FullWidthBannerSection.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getBanners, type Banner } from "@/lib/api";
import { FullWidthBannerItem } from "./FullWidthBannerItem";

function isRegisterBanner(banner: Banner): boolean {
  const url = banner.link_url ?? "";
  return url.includes("/lp/register") || url.includes("/members/register");
}

export async function FullWidthBannerSection() {
  const session = await getServerSession(authOptions);
  const isLoggedIn = !!session?.user;

  let banners: Banner[] = [];
  try {
    banners = await getBanners();
  } catch {}

  const filtered = banners
    .filter((b) => !(isLoggedIn && isRegisterBanner(b)))
    .sort((a, b) => a.sort_order - b.sort_order);

  if (filtered.length === 0) return null;

  return (
    <section style={{ backgroundColor: "#F8F8F8", padding: "24px 0" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {filtered.map((banner) => (
            <FullWidthBannerItem key={banner.id} banner={banner} />
          ))}
        </div>
      </div>
    </section>
  );
}
