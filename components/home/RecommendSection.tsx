// components/home/RecommendSection.tsx
import Image from "next/image";
import Link from "next/link";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { getAreas } from "@/lib/api";
import type { AreaSetting } from "@/lib/api";
import { getAreaContent } from "@/lib/areaContents";

export async function RecommendSection() {
  const areas = await getAreas();

  if (areas.length === 0) return null;

  // 4件ずつグループに分割
  const groups: AreaSetting[][] = [];
  for (let i = 0; i < areas.length; i += 4) {
    groups.push(areas.slice(i, i + 4));
  }

  return (
    <section style={{ padding: "64px 0", backgroundColor: "#ffffff" }}>
      <div className="container-content">
        <SectionTitle en="Recommend" ja="エリア別おすすめ物件" />
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

  return (
    <Link
      href={href}
      style={{
        position: "relative",
        display: "block",
        overflow: "hidden",
        borderRadius: "8px",
        paddingBottom: "70%",
        textDecoration: "none",
      }}
      className="group"
    >
      <div style={{ position: "absolute", inset: 0 }}>
        {/* 背景 */}
        <AreaBackground area={area} />

        {/* 通常オーバーレイ */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.3)",
            transition: "background-color 0.3s ease",
          }}
          className="group-hover:bg-black/50"
        />

        {/* 通常テキスト */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "8px",
            transition: "opacity 0.3s ease",
          }}
          className="group-hover:opacity-0"
        >
          <span
            style={{
              color: "white",
              fontWeight: "bold",
              letterSpacing: "0.1em",
              textAlign: "center",
              fontSize: "clamp(13px, 2vw, 18px)",
              textShadow: "0 2px 4px rgba(0,0,0,0.5)",
            }}
          >
            {area.area_name}
          </span>
          <span
            style={{
              marginTop: "6px",
              color: "rgba(255,255,255,0.7)",
              fontSize: "11px",
              letterSpacing: "0.1em",
            }}
          >
            view more
          </span>
        </div>

        {/* ホバー時テキスト */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            padding: "12px",
            opacity: 0,
            transition: "opacity 0.3s ease",
          }}
          className="group-hover:opacity-100"
        >
          <p
            style={{
              color: "white",
              fontWeight: "bold",
              fontSize: "13px",
              marginBottom: "4px",
            }}
          >
            {area.area_name}
          </p>
          <p
            style={{
              color: "rgba(255,255,255,0.8)",
              fontSize: "11px",
              lineHeight: 1.5,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {content.catchCopy}
          </p>
          <div style={{ marginTop: "6px", display: "flex", flexWrap: "wrap", gap: "4px" }}>
            {content.highlights.slice(0, 2).map((h, i) => (
              <span
                key={i}
                style={{
                  fontSize: "9px",
                  padding: "2px 6px",
                  borderRadius: "4px",
                  backgroundColor: "rgba(91,173,82,0.7)",
                  color: "white",
                }}
              >
                {h.length > 12 ? h.slice(0, 12) + "…" : h}
              </span>
            ))}
          </div>
        </div>

        {/* グリーンライン */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            height: "3px",
            backgroundColor: "#5BAD52",
            width: "0%",
            transition: "width 0.5s ease",
          }}
          className="group-hover:w-full"
        />
      </div>
    </Link>
  );
}

const GRADIENTS: Record<string, string> = {
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

function AreaBackground({ area }: { area: AreaSetting }) {
  if (area.image_url) {
    return (
      <Image
        src={area.image_url}
        alt={`${area.area_name}のイメージ`}
        fill
        style={{ objectFit: "cover", transition: "transform 0.5s ease" }}
        sizes="(max-width: 768px) 50vw, 25vw"
        className="group-hover:scale-105"
      />
    );
  }

  const gradient = GRADIENTS[area.area_name] || "linear-gradient(135deg,#2a2a2a,#5BAD52)";
  return (
    <div style={{ position: "absolute", inset: 0, background: gradient }} />
  );
}
