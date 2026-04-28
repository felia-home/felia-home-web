// components/home/FreeBannerSection.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getFreeBanners, type Banner } from "@/lib/api";
import { FreeBannerItem } from "./FreeBannerItem";

function isRegisterBanner(banner: Banner): boolean {
  const url = banner.link_url ?? "";
  return url.includes("/lp/register") || url.includes("/members/register");
}

export async function FreeBannerSection() {
  const session = await getServerSession(authOptions);
  const isLoggedIn = !!session?.user;

  let banners: Banner[] = [];
  try {
    banners = await getFreeBanners();
  } catch {}

  const visible = banners
    .filter((b) => !!b.image_url)
    .filter((b) => !(isLoggedIn && isRegisterBanner(b)))
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
