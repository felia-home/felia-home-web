// app/page.tsx
import { HeroSlider } from "@/components/home/HeroSlider";
import { RecommendSection } from "@/components/home/RecommendSection";
import { SearchSection } from "@/components/home/SearchSection";

export default function HomePage() {
  return (
    <main className="bg-white">
      <HeroSlider />
      <RecommendSection />
      <SearchSection />

      {/* 残りのセクションは後続の指示文で順次追加 */}
      <div className="container-content py-20">
        <p className="text-center text-gray-300 text-sm">
          — 以下のセクションは順次実装 —
        </p>
      </div>
    </main>
  );
}
