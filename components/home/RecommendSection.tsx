// components/home/RecommendSection.tsx
import { SectionTitle } from "@/components/ui/SectionTitle";
import { getAreas } from "@/lib/api";
import { TokyoWardMap } from "./TokyoWardMap";
import { AreaLinkListClient } from "./AreaLinkListClient";

export async function RecommendSection() {
  const areas = await getAreas();

  const areaLinks = areas.map((a) => ({
    id: a.id,
    area_name: a.area_name,
    href: a.link_url || `/areas/${encodeURIComponent(a.area_name)}`,
  }));

  const mapAreas = areas.map((a) => ({
    area_name: a.area_name,
    href: a.link_url || `/areas/${encodeURIComponent(a.area_name)}`,
  }));

  return (
    <section style={{ padding: "64px 0", backgroundColor: "#ffffff" }}>
      <div className="container-content">
        <SectionTitle en="Recommend" ja="エリア別おすすめ物件" />

        {/* SP: 1カラム / PC: 2カラム */}
        <div className="grid grid-cols-1 tb:grid-cols-2" style={{ gap: "32px", alignItems: "start" }}>
          {/* 左: SVGマップ */}
          <div>
            <TokyoWardMap areas={mapAreas} />
          </div>

          {/* 右: エリアリンク一覧 */}
          <div>
            <AreaLinkListClient areas={areaLinks} />
          </div>
        </div>
      </div>
    </section>
  );
}
