// components/home/HeroSlider.tsx
import { getHeroBanners } from "@/lib/api";
import { heroSlides } from "@/lib/heroSlides";
import { HeroSliderClient } from "./HeroSliderClient";

// Server Component: データ取得
export async function HeroSlider() {
  const apiBanners = await getHeroBanners();

  if (apiBanners.length > 0) {
    // API データをスライド形式に変換
    const slides = apiBanners
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((banner) => ({
        id: banner.id,
        image: banner.image_url,
        gradient: undefined,
        catchCopy: "",
        subCopy: "",
        buttonLabel: undefined as string | undefined,
        buttonHref: banner.link_url ?? undefined,
        linkTarget: banner.link_target,
      }));
    return <HeroSliderClient slides={slides} />;
  }

  // フォールバック: デフォルトスライド
  const defaultSlides = heroSlides.map((s) => ({
    id: String(s.id),
    image: s.image,
    gradient: s.gradient,
    catchCopy: s.catchCopy,
    subCopy: s.subCopy,
    buttonLabel: s.buttonLabel,
    buttonHref: s.buttonHref,
    linkTarget: "_self" as const,
  }));
  return <HeroSliderClient slides={defaultSlides} />;
}
