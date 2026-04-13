// app/page.tsx
import { HeroSlider } from "@/components/home/HeroSlider";
import { FeliaSectionSelection } from "@/components/home/FeliaSectionSelection";
import { RecommendSection } from "@/components/home/RecommendSection";
import { NewAndNewsSection } from "@/components/home/NewAndNewsSection";
import { MemberBannerSection } from "@/components/home/MemberBannerSection";
import { TradeUpBannerSection } from "@/components/home/TradeUpBannerSection";
import { SearchSection } from "@/components/home/SearchSection";
import { OpenHouseAndInfoSection } from "@/components/home/OpenHouseAndInfoSection";
// Feature・FreeBanner は Phase 2（admin API 完成後に有効化）
// import { FeatureSection } from "@/components/home/FeatureSection";
// import { FreeBannerSection } from "@/components/home/FreeBannerSection";
import { AccessSection } from "@/components/home/AccessSection";

export default function HomePage() {
  return (
    <main className="bg-white">
      {/* 1. ヒーロースライダー */}
      <HeroSlider />

      {/* 2. 厳選物件 */}
      <FeliaSectionSelection />

      {/* 3. エリア別おすすめ */}
      <RecommendSection />

      {/* 4. 新着物件 ＋ お知らせ */}
      <NewAndNewsSection />

      {/* 5. 会員登録誘導バナー */}
      <MemberBannerSection />

      {/* 6. 物件検索（SVGマップ ＋ 路線） */}
      <SearchSection />

      {/* 7. 現地販売会 ＋ お知らせ */}
      <OpenHouseAndInfoSection />

      {/* 8. 買い替え誘導バナー */}
      <TradeUpBannerSection />

      {/* 9. 特集（Phase 2） */}
      {/* <FeatureSection /> */}

      {/* 10. フリーバナー（Phase 2） */}
      {/* <FreeBannerSection /> */}

      {/* 11. Access */}
      <AccessSection />
    </main>
  );
}
