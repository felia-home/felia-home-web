// app/page.tsx
export const dynamic = "force-dynamic";

import React from "react";
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
import { getHpSections, type HpSection } from "@/lib/api";

// sections APIが失敗した場合のデフォルト順序（全表示）
const DEFAULT_SECTIONS: HpSection[] = [
  { section_key: "hero",        is_visible: true, sort_order: 1,  heading: null, subheading: null, label: "" },
  { section_key: "selection",   is_visible: true, sort_order: 2,  heading: null, subheading: null, label: "" },
  { section_key: "recommend",   is_visible: true, sort_order: 3,  heading: null, subheading: null, label: "" },
  { section_key: "news",    is_visible: true, sort_order: 4,  heading: null, subheading: null, label: "" },
  { section_key: "full_banner", is_visible: true, sort_order: 5,  heading: null, subheading: null, label: "" },
  { section_key: "search",      is_visible: true, sort_order: 6,  heading: null, subheading: null, label: "" },
  { section_key: "open_house",  is_visible: true, sort_order: 7,  heading: null, subheading: null, label: "" },
  { section_key: "features",    is_visible: true, sort_order: 8,  heading: null, subheading: null, label: "" },
  { section_key: "free_banner", is_visible: true, sort_order: 9,  heading: null, subheading: null, label: "" },
  { section_key: "access",      is_visible: true, sort_order: 10, heading: null, subheading: null, label: "" },
];

function getHeading(sections: HpSection[], key: string): string | null {
  return sections.find((s) => s.section_key === key)?.heading ?? null;
}

function getSubheading(sections: HpSection[], key: string): string | null {
  return sections.find((s) => s.section_key === key)?.subheading ?? null;
}

export default async function HomePage() {
  const fetched = await getHpSections();
  // API失敗（空配列）時はデフォルト順序にフォールバック
  const sectionList = fetched.length > 0 ? fetched : DEFAULT_SECTIONS;

  // section_key → コンポーネントのマップ（各コンポーネントが内部でデータ取得）
  const sectionComponents: Record<string, React.ReactNode> = {
    hero: <HeroSlider />,
    selection: (
      <FeliaSectionSelection
        heading={getHeading(sectionList, "selection")}
        subheading={getSubheading(sectionList, "selection")}
      />
    ),
    recommend: (
      <RecommendSection
        heading={getHeading(sectionList, "recommend")}
        subheading={getSubheading(sectionList, "recommend")}
      />
    ),
    news: (
      <NewAndNewsSection
        heading={getHeading(sectionList, "news")}
        subheading={getSubheading(sectionList, "news")}
      />
    ),
    full_banner: <FullWidthBannerSection />,
    search: <SearchSection />,
    open_house: <OpenHouseAndInfoSection />,
    features: (
      <FeatureSection
        heading={getHeading(sectionList, "features")}
        subheading={getSubheading(sectionList, "features")}
      />
    ),
    free_banner: <FreeBannerSection />,
    access: <AccessSection />,
  };

  return (
    <main style={{ backgroundColor: "#ffffff" }}>
      {sectionList
        .filter((s) => s.is_visible)
        .sort((a, b) => a.sort_order - b.sort_order)
        .map((s) => (
          <React.Fragment key={s.section_key}>
            {sectionComponents[s.section_key] ?? null}
          </React.Fragment>
        ))}
    </main>
  );
}
