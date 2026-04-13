// app/page.tsx
import { HeroSlider } from "@/components/home/HeroSlider";
import { FeliaSectionSelection } from "@/components/home/FeliaSectionSelection";
import { RecommendSection } from "@/components/home/RecommendSection";
import { NewAndNewsSection } from "@/components/home/NewAndNewsSection";
import { SearchSection } from "@/components/home/SearchSection";
import { OpenHouseAndInfoSection } from "@/components/home/OpenHouseAndInfoSection";

export default function HomePage() {
  return (
    <main className="bg-white">
      <HeroSlider />
      <FeliaSectionSelection />
      <RecommendSection />
      <NewAndNewsSection />
      <SearchSection />
      <OpenHouseAndInfoSection />

      {/* 残りのセクションは後続の指示文で順次追加 */}
      <div className="container-content py-16">
        <p className="text-center text-gray-300 text-sm">
          — バナー・Access セクションは次の指示文で実装 —
        </p>
      </div>
    </main>
  );
}
