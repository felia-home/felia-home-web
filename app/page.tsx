// app/page.tsx
export const dynamic = "force-dynamic";

import { HeroSlider } from "@/components/home/HeroSlider";
import { FeliaSectionSelection } from "@/components/home/FeliaSectionSelection";
import { RecommendSection } from "@/components/home/RecommendSection";
import { NewAndNewsSection } from "@/components/home/NewAndNewsSection";
import { FullWidthBannerSection } from "@/components/home/FullWidthBannerSection";
import { SearchSection } from "@/components/home/SearchSection";
import { OpenHouseAndInfoSection } from "@/components/home/OpenHouseAndInfoSection";
import { FeatureSection } from "@/components/home/FeatureSection";
import { FreeBannerSection } from "@/components/home/FreeBannerSection";
import { AccessSection } from "@/components/home/AccessSection";
import { getHpSections } from "@/lib/api";

export default async function HomePage() {
  const sections = await getHpSections();

  // section_keyで表示判定（API取得失敗時は全セクション表示）
  const isVisible = (key: string): boolean => {
    if (sections.length === 0) return true;
    const section = sections.find((s) => s.section_key === key);
    return section ? section.is_visible : true;
  };

  const getHeading = (key: string): string | null => {
    const section = sections.find((s) => s.section_key === key);
    return section?.heading ?? null;
  };

  const getSubheading = (key: string): string | null => {
    const section = sections.find((s) => s.section_key === key);
    return section?.subheading ?? null;
  };

  return (
    <main style={{ backgroundColor: "#ffffff" }}>
      {/* 1. ヒーロースライダー */}
      {isVisible("hero") && <HeroSlider />}

      {/* 2. 厳選物件 */}
      {isVisible("selection") && (
        <FeliaSectionSelection
          heading={getHeading("selection")}
          subheading={getSubheading("selection")}
        />
      )}

      {/* 3. エリア別おすすめ */}
      {isVisible("recommend") && (
        <RecommendSection
          heading={getHeading("recommend")}
          subheading={getSubheading("recommend")}
        />
      )}

      {/* 4. 新着物件 ＋ お知らせ */}
      {isVisible("new_news") && (
        <NewAndNewsSection
          heading={getHeading("new_news")}
          subheading={getSubheading("new_news")}
        />
      )}

      {/* 5. 会員登録誘導バナー */}
      {isVisible("full_banner") && <FullWidthBannerSection />}

      {/* 6. 物件検索（SVGマップ ＋ 路線） */}
      {isVisible("search") && <SearchSection />}

      {/* 7. 現地販売会 ＋ お知らせ */}
      {isVisible("open_house") && <OpenHouseAndInfoSection />}

      {/* 9. 特集 */}
      {isVisible("features") && (
        <FeatureSection
          heading={getHeading("features")}
          subheading={getSubheading("features")}
        />
      )}

      {/* 10. フリーバナー */}
      {isVisible("free_banner") && <FreeBannerSection />}

      {/* 11. Access */}
      {isVisible("access") && <AccessSection />}
    </main>
  );
}
