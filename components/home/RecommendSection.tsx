// components/home/RecommendSection.tsx
import Link from "next/link";
import Image from "next/image";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { getAreas } from "@/lib/api";
import { getAreaContent } from "@/lib/areaContents";
import type { AreaSetting } from "@/lib/api";

interface RecommendSectionProps {
  heading?: string | null;
  subheading?: string | null;
}

export async function RecommendSection({ heading, subheading }: RecommendSectionProps = {}) {
  const areas = await getAreas();

  if (areas.length === 0) return null;

  // 4件ずつグループ分割
  const groups: AreaSetting[][] = [];
  for (let i = 0; i < areas.length; i += 4) {
    groups.push(areas.slice(i, i + 4));
  }

  return (
    <section style={{ padding: "64px 0", backgroundColor: "#ffffff" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>
        <SectionTitle en={heading ?? "Recommend"} ja={subheading ?? "エリア別おすすめ物件"} />
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {groups.map((group, gi) => (
            <div
              key={gi}
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(${Math.min(group.length, 4)}, 1fr)`,
                gap: "12px",
              }}
            >
              {group.map((area) => (
                <AreaCard key={area.id} area={area} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function AreaCard({ area }: { area: AreaSetting }) {
  const content = getAreaContent(area.area_name);
  const href = area.link_url || `/areas/${encodeURIComponent(area.area_name)}`;

  const gradients: Record<string, string> = {
    "渋谷区": "linear-gradient(135deg,#2d4a2d,#5BAD52)",
    "新宿区": "linear-gradient(135deg,#1a2a3a,#4a6fa5)",
    "杉並区": "linear-gradient(135deg,#2d3a1a,#7a9a3a)",
    "世田谷区": "linear-gradient(135deg,#1a3a2a,#3a8a5a)",
    "文京区": "linear-gradient(135deg,#2a1a3a,#6a4a9a)",
    "豊島区": "linear-gradient(135deg,#3a2a1a,#9a6a3a)",
    "中野区": "linear-gradient(135deg,#1a3a3a,#3a8a8a)",
    "目黒区": "linear-gradient(135deg,#2a2a1a,#7a7a2a)",
    "北区": "linear-gradient(135deg,#1a2a1a,#4a7a4a)",
    "板橋区": "linear-gradient(135deg,#2a1a2a,#7a4a7a)",
    "練馬区": "linear-gradient(135deg,#1a3a1a,#5a9a5a)",
    "品川区": "linear-gradient(135deg,#1a1a3a,#4a4a9a)",
    "港区": "linear-gradient(135deg,#2a1a1a,#8a3a3a)",
    "大田区": "linear-gradient(135deg,#1a2a3a,#3a5a7a)",
    "千代田区": "linear-gradient(135deg,#2a2a2a,#6a6a6a)",
    "中央区": "linear-gradient(135deg,#2a1a2a,#7a3a6a)",
  };
  const gradient = gradients[area.area_name] || "linear-gradient(135deg,#2a2a2a,#5BAD52)";

  return (
    <Link
      href={href}
      className="area-card"
      style={{ paddingBottom: "70%" }}
    >
      <div style={{ position: "absolute", inset: 0 }}>
        {/* 背景：画像 or グラデーション */}
        {area.image_url ? (
          <Image
            src={area.image_url}
            alt={`${area.area_name}のイメージ`}
            fill
            className="area-card-img"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        ) : (
          <div style={{ position: "absolute", inset: 0, background: gradient }} />
        )}

        {/* オーバーレイ */}
        <div className="area-card-overlay" />

        {/* 区名テキスト */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span
            style={{
              color: "white",
              fontWeight: "bold",
              fontSize: "clamp(13px, 2vw, 18px)",
              textShadow: "0 2px 4px rgba(0,0,0,0.5)",
              letterSpacing: "0.1em",
            }}
          >
            {area.area_name}
          </span>
          <span
            style={{
              color: "rgba(255,255,255,0.7)",
              fontSize: "11px",
              marginTop: "4px",
              letterSpacing: "0.1em",
            }}
          >
            view more
          </span>
        </div>

        {/* グリーンライン */}
        <div
          className="area-card-hover-line"
          style={{ position: "absolute", bottom: 0, left: 0 }}
        />
      </div>
    </Link>
  );
}
