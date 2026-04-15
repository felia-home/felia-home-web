// components/home/TokyoWardMap.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Ward {
  id: string;
  name: string;
  path: string;
  labelX: number;
  labelY: number;
  clickable: boolean;
  href?: string;
}

// viewBox="0 0 470 490"
// 実際の東京区の形に近似したSVGパス（対象17区）
const WARDS: Ward[] = [
  {
    id: "itabashi", name: "板橋区", clickable: true,
    href: "/areas/板橋区", labelX: 190, labelY: 85,
    path: "M 108,52 L 145,45 L 195,42 L 242,45 L 258,52 L 268,68 L 265,95 L 252,112 L 232,122 L 205,128 L 182,130 L 158,124 L 138,112 L 118,95 L 108,75 Z",
  },
  {
    id: "kita", name: "北区", clickable: true,
    href: "/areas/北区", labelX: 315, labelY: 88,
    path: "M 258,52 L 295,48 L 332,45 L 362,50 L 375,65 L 378,88 L 370,108 L 352,122 L 328,130 L 305,132 L 280,125 L 265,110 L 265,90 L 268,68 Z",
  },
  {
    id: "nerima", name: "練馬区", clickable: true,
    href: "/areas/練馬区", labelX: 108, labelY: 178,
    path: "M 42,108 L 108,75 L 118,95 L 138,112 L 158,124 L 155,148 L 145,168 L 128,185 L 105,198 L 78,205 L 52,198 L 35,178 L 35,145 Z",
  },
  {
    id: "toshima", name: "豊島区", clickable: true,
    href: "/areas/豊島区", labelX: 265, labelY: 158,
    path: "M 205,128 L 232,122 L 252,112 L 275,118 L 295,130 L 302,150 L 295,168 L 278,178 L 255,180 L 235,172 L 218,158 L 210,142 Z",
  },
  {
    id: "bunkyo", name: "文京区", clickable: true,
    href: "/areas/文京区", labelX: 348, labelY: 160,
    path: "M 305,132 L 328,130 L 352,122 L 372,132 L 382,150 L 378,172 L 362,185 L 342,190 L 322,182 L 308,165 L 305,148 Z",
  },
  {
    id: "nakano", name: "中野区", clickable: true,
    href: "/areas/中野区", labelX: 185, labelY: 225,
    path: "M 128,185 L 145,168 L 165,158 L 188,162 L 210,172 L 218,192 L 212,215 L 195,232 L 172,238 L 148,230 L 132,212 Z",
  },
  {
    id: "shinjuku", name: "新宿区", clickable: true,
    href: "/areas/新宿区", labelX: 275, labelY: 218,
    path: "M 235,172 L 255,180 L 278,178 L 298,182 L 315,195 L 318,218 L 308,238 L 288,248 L 262,248 L 242,238 L 232,218 L 235,195 Z",
  },
  {
    id: "chiyoda", name: "千代田区", clickable: true,
    href: "/areas/千代田区", labelX: 358, labelY: 222,
    path: "M 342,190 L 368,188 L 388,200 L 395,220 L 390,242 L 372,255 L 350,255 L 332,242 L 325,222 L 330,205 Z",
  },
  {
    id: "chuo", name: "中央区", clickable: true,
    href: "/areas/中央区", labelX: 408, labelY: 262,
    path: "M 388,242 L 408,245 L 422,258 L 420,278 L 408,290 L 390,288 L 375,275 L 372,258 Z",
  },
  {
    id: "suginami", name: "杉並区", clickable: true,
    href: "/areas/杉並区", labelX: 108, labelY: 272,
    path: "M 42,245 L 78,235 L 105,228 L 132,238 L 148,258 L 145,285 L 128,305 L 102,312 L 68,305 L 42,288 L 35,265 Z",
  },
  {
    id: "shibuya", name: "渋谷区", clickable: true,
    href: "/areas/渋谷区", labelX: 232, labelY: 285,
    path: "M 212,248 L 242,248 L 265,252 L 278,268 L 272,292 L 255,308 L 232,312 L 212,298 L 205,278 Z",
  },
  {
    id: "minato", name: "港区", clickable: true,
    href: "/areas/港区", labelX: 362, labelY: 305,
    path: "M 350,258 L 375,258 L 392,268 L 400,288 L 398,318 L 382,335 L 358,338 L 338,322 L 332,300 L 338,275 Z",
  },
  {
    id: "setagaya", name: "世田谷区", clickable: true,
    href: "/areas/世田谷区", labelX: 112, labelY: 362,
    path: "M 42,318 L 68,308 L 102,318 L 128,328 L 148,348 L 145,378 L 128,402 L 98,415 L 62,408 L 38,385 L 35,352 Z",
  },
  {
    id: "meguro", name: "目黒区", clickable: true,
    href: "/areas/目黒区", labelX: 228, labelY: 345,
    path: "M 205,315 L 232,318 L 255,318 L 272,332 L 268,358 L 248,372 L 222,375 L 202,358 L 198,335 Z",
  },
  {
    id: "shinagawa", name: "品川区", clickable: true,
    href: "/areas/品川区", labelX: 318, labelY: 368,
    path: "M 315,338 L 342,335 L 365,345 L 375,368 L 368,395 L 348,408 L 318,408 L 298,390 L 295,365 Z",
  },
  {
    id: "ota", name: "大田区", clickable: true,
    href: "/areas/大田区", labelX: 168, labelY: 435,
    path: "M 98,418 L 128,415 L 155,422 L 178,432 L 198,448 L 208,472 L 198,495 L 168,505 L 135,498 L 105,478 L 88,452 L 88,432 Z",
  },
];

// 非クリッカブル区（城東エリア等・地図上に薄く表示）
const INACTIVE_WARDS: Omit<Ward, "clickable" | "href">[] = [
  {
    id: "chuo_inactive",
    name: "",
    labelX: 0,
    labelY: 0,
    path: "M 415,218 L 445,225 L 448,255 L 430,270 L 415,270 L 422,245 Z",
  },
];

interface TokyoWardMapProps {
  areas?: { area_name: string; href?: string | null }[];
}

export function TokyoWardMap({ areas }: TokyoWardMapProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const router = useRouter();

  // areasが渡された場合、そのエリアのhrefを上書き
  const getHref = (ward: Ward): string => {
    if (areas) {
      const area = areas.find((a) => a.area_name === ward.name);
      if (area?.href) return area.href;
    }
    return ward.href || `/areas/${encodeURIComponent(ward.name)}`;
  };

  return (
    <div style={{ position: "relative", width: "100%" }}>
      <svg
        viewBox="0 0 470 490"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: "100%", height: "auto", display: "block" }}
      >
        {/* 背景 */}
        <rect width="470" height="490" fill="#1B3A4B" rx="12" />

        {/* タイトル */}
        <text
          x="20"
          y="30"
          fill="rgba(255,255,255,0.9)"
          fontSize="16"
          fontWeight="bold"
          fontFamily="'Noto Sans JP', sans-serif"
        >
          エリア
        </text>

        {/* 全エリア一覧リンク */}
        <a href="/properties" style={{ cursor: "pointer" }}>
          <text
            x="380"
            y="30"
            fill="rgba(255,255,255,0.6)"
            fontSize="11"
            fontFamily="'Noto Sans JP', sans-serif"
          >
            全エリア一覧
          </text>
          <line
            x1="440"
            y1="26"
            x2="458"
            y2="26"
            stroke="rgba(255,255,255,0.6)"
            strokeWidth="1"
          />
          <polygon
            points="456,22 462,26 456,30"
            fill="rgba(255,255,255,0.6)"
          />
        </a>

        {/* 非アクティブ区（薄く） */}
        {INACTIVE_WARDS.map((ward) => (
          <path
            key={ward.id}
            d={ward.path}
            fill="rgba(255,255,255,0.03)"
            stroke="rgba(255,255,255,0.15)"
            strokeWidth="1"
          />
        ))}

        {/* アクティブ区 */}
        {WARDS.map((ward) => {
          const isHovered = hoveredId === ward.id;
          const href = getHref(ward);
          return (
            <g
              key={ward.id}
              style={{ cursor: "pointer" }}
              onClick={() => router.push(href)}
              onMouseEnter={() => setHoveredId(ward.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <path
                d={ward.path}
                fill={
                  isHovered
                    ? "rgba(91,173,82,0.35)"
                    : "rgba(255,255,255,0.06)"
                }
                stroke={
                  isHovered
                    ? "rgba(91,173,82,0.9)"
                    : "rgba(255,255,255,0.4)"
                }
                strokeWidth={isHovered ? "1.8" : "1.2"}
                style={{ transition: "all 0.2s ease" }}
              />
              <text
                x={ward.labelX}
                y={ward.labelY}
                textAnchor="middle"
                dominantBaseline="middle"
                fill={isHovered ? "#5BAD52" : "rgba(255,255,255,0.85)"}
                fontSize="9.5"
                fontWeight={isHovered ? "700" : "400"}
                fontFamily="'Noto Sans JP', sans-serif"
                style={{
                  pointerEvents: "none",
                  userSelect: "none",
                  transition: "fill 0.2s ease",
                }}
              >
                {ward.name}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
