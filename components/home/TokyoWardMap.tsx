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

// ── 対象17区（クリッカブル） ─────────────────────────────────
const WARDS: Ward[] = [
  {
    id: "itabashi", name: "板橋区", clickable: true,
    href: "/areas/板橋区", labelX: 192, labelY: 90,
    path: "M 108,48 L 148,42 L 198,40 L 248,43 L 268,55 L 272,75 L 268,100 L 252,118 L 230,130 L 205,136 L 178,138 L 152,130 L 130,118 L 112,98 L 105,72 Z",
  },
  {
    id: "kita", name: "北区", clickable: true,
    href: "/areas/北区", labelX: 318, labelY: 92,
    path: "M 268,55 L 305,48 L 342,44 L 372,50 L 388,65 L 390,92 L 382,115 L 360,130 L 335,138 L 308,140 L 282,132 L 268,118 L 265,92 Z",
  },
  {
    id: "nerima", name: "練馬区", clickable: true,
    href: "/areas/練馬区", labelX: 105, labelY: 180,
    path: "M 32,115 L 105,72 L 112,98 L 130,118 L 152,130 L 148,158 L 138,180 L 120,202 L 95,215 L 68,220 L 42,212 L 28,192 L 28,152 Z",
  },
  {
    id: "toshima", name: "豊島区", clickable: true,
    href: "/areas/豊島区", labelX: 262, labelY: 162,
    path: "M 205,136 L 230,130 L 252,118 L 278,124 L 302,136 L 310,158 L 302,178 L 280,188 L 256,190 L 232,182 L 215,168 L 210,148 Z",
  },
  {
    id: "bunkyo", name: "文京区", clickable: true,
    href: "/areas/文京区", labelX: 348, labelY: 168,
    path: "M 308,140 L 335,138 L 360,132 L 382,146 L 390,165 L 385,185 L 368,198 L 345,202 L 322,194 L 308,178 L 306,158 Z",
  },
  {
    id: "nakano", name: "中野区", clickable: true,
    href: "/areas/中野区", labelX: 180, labelY: 228,
    path: "M 120,202 L 138,180 L 162,168 L 188,170 L 210,180 L 220,202 L 215,228 L 198,245 L 172,252 L 145,244 L 128,228 Z",
  },
  {
    id: "shinjuku", name: "新宿区", clickable: true,
    href: "/areas/新宿区", labelX: 275, labelY: 228,
    path: "M 232,182 L 256,190 L 280,188 L 305,192 L 322,208 L 325,232 L 315,254 L 292,265 L 264,265 L 240,255 L 228,235 L 232,208 Z",
  },
  {
    id: "chiyoda", name: "千代田区", clickable: true,
    href: "/areas/千代田区", labelX: 360, labelY: 232,
    path: "M 345,202 L 368,198 L 392,210 L 400,230 L 396,254 L 378,268 L 352,268 L 332,254 L 326,232 L 332,212 Z",
  },
  {
    id: "chuo", name: "中央区", clickable: true,
    href: "/areas/中央区", labelX: 420, labelY: 262,
    path: "M 396,230 L 428,234 L 445,252 L 442,275 L 428,290 L 405,290 L 380,275 L 378,262 L 395,252 Z",
  },
  {
    id: "suginami", name: "杉並区", clickable: true,
    href: "/areas/杉並区", labelX: 105, labelY: 278,
    path: "M 38,228 L 68,220 L 95,224 L 128,234 L 145,255 L 142,285 L 125,310 L 98,322 L 65,318 L 38,300 L 30,272 Z",
  },
  {
    id: "shibuya", name: "渋谷区", clickable: true,
    href: "/areas/渋谷区", labelX: 238, labelY: 298,
    path: "M 215,268 L 240,265 L 268,270 L 285,288 L 278,315 L 258,332 L 230,335 L 208,320 L 204,295 Z",
  },
  {
    id: "minato", name: "港区", clickable: true,
    href: "/areas/港区", labelX: 362, labelY: 318,
    path: "M 352,268 L 378,268 L 402,280 L 410,305 L 406,340 L 386,358 L 358,362 L 335,345 L 328,318 L 335,288 Z",
  },
  {
    id: "setagaya", name: "世田谷区", clickable: true,
    href: "/areas/世田谷区", labelX: 108, labelY: 378,
    path: "M 35,330 L 65,320 L 98,328 L 128,345 L 148,368 L 142,405 L 122,430 L 90,438 L 56,430 L 30,408 L 28,368 Z",
  },
  {
    id: "meguro", name: "目黒区", clickable: true,
    href: "/areas/目黒区", labelX: 232, labelY: 365,
    path: "M 204,335 L 230,338 L 260,338 L 280,355 L 275,385 L 252,400 L 224,404 L 202,388 L 198,360 Z",
  },
  {
    id: "shinagawa", name: "品川区", clickable: true,
    href: "/areas/品川区", labelX: 322, labelY: 395,
    path: "M 318,362 L 348,358 L 372,368 L 382,395 L 374,428 L 352,440 L 320,440 L 296,422 L 292,395 Z",
  },
  {
    id: "ota", name: "大田区", clickable: true,
    href: "/areas/大田区", labelX: 158, labelY: 475,
    path: "M 90,440 L 125,434 L 158,440 L 188,455 L 208,478 L 218,510 L 206,538 L 168,548 L 132,540 L 100,518 L 80,490 L 80,462 Z",
  },
];

// ── 城東エリア（非クリッカブル・薄く表示） ──────────────────
const INACTIVE_WARDS: Omit<Ward, "clickable" | "href">[] = [
  {
    id: "adachi", name: "足立区",
    labelX: 452, labelY: 92,
    path: "M 390,50 L 432,44 L 472,42 L 510,48 L 525,65 L 522,98 L 505,122 L 478,135 L 448,140 L 415,134 L 388,118 L 382,95 Z",
  },
  {
    id: "arakawa", name: "荒川区",
    labelX: 415, labelY: 162,
    path: "M 382,140 L 415,135 L 440,142 L 448,162 L 438,182 L 412,188 L 385,180 L 375,162 Z",
  },
  {
    id: "taito", name: "台東区",
    labelX: 418, labelY: 225,
    path: "M 392,200 L 420,196 L 442,205 L 448,228 L 440,248 L 418,254 L 396,248 L 386,228 Z",
  },
  {
    id: "sumida", name: "墨田区",
    labelX: 472, labelY: 212,
    path: "M 442,175 L 472,170 L 498,178 L 508,202 L 502,232 L 475,242 L 448,235 L 435,218 Z",
  },
  {
    id: "katsushika", name: "葛飾区",
    labelX: 530, labelY: 98,
    path: "M 510,48 L 548,44 L 568,58 L 568,95 L 550,122 L 520,135 L 495,130 L 478,110 L 480,80 Z",
  },
  {
    id: "koto", name: "江東区",
    labelX: 485, labelY: 298,
    path: "M 448,240 L 478,245 L 512,252 L 530,272 L 528,315 L 510,342 L 482,352 L 452,345 L 430,322 L 425,290 L 432,262 Z",
  },
  {
    id: "edogawa", name: "江戸川区",
    labelX: 542, labelY: 215,
    path: "M 525,135 L 558,130 L 572,148 L 570,198 L 555,245 L 532,268 L 512,268 L 500,245 L 505,205 L 520,168 Z",
  },
];

interface TokyoWardMapProps {
  areas?: { area_name: string; href?: string | null }[];
}

export function TokyoWardMap({ areas }: TokyoWardMapProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const router = useRouter();

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
        viewBox="0 0 570 560"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: "100%", height: "auto", display: "block" }}
      >
        {/* 背景 */}
        <rect width="570" height="560" fill="#1B3A4B" rx="12" />

        {/* タイトル */}
        <text
          x="20" y="28"
          fill="rgba(255,255,255,0.9)"
          fontSize="15" fontWeight="bold"
          fontFamily="'Noto Sans JP', sans-serif"
        >
          エリアから探す
        </text>

        {/* 全エリア一覧リンク */}
        <a href="/properties" style={{ cursor: "pointer" }}>
          <text
            x="458" y="28"
            fill="rgba(255,255,255,0.55)"
            fontSize="10"
            fontFamily="'Noto Sans JP', sans-serif"
          >
            全エリア一覧 ›
          </text>
        </a>

        {/* 城東エリア（非アクティブ） */}
        {INACTIVE_WARDS.map((ward) => (
          <g key={ward.id}>
            <path
              d={ward.path}
              fill="rgba(255,255,255,0.03)"
              stroke="rgba(255,255,255,0.12)"
              strokeWidth="1"
            />
            {ward.name && (
              <text
                x={ward.labelX} y={ward.labelY}
                textAnchor="middle" dominantBaseline="middle"
                fill="rgba(255,255,255,0.22)"
                fontSize="8"
                fontFamily="'Noto Sans JP', sans-serif"
                style={{ pointerEvents: "none", userSelect: "none" }}
              >
                {ward.name}
              </text>
            )}
          </g>
        ))}

        {/* 対象17区（アクティブ） */}
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
                fill={isHovered ? "rgba(91,173,82,0.35)" : "rgba(91,173,82,0.12)"}
                stroke={isHovered ? "rgba(91,173,82,0.9)" : "rgba(255,255,255,0.45)"}
                strokeWidth={isHovered ? "1.8" : "1.2"}
                style={{ transition: "all 0.2s ease" }}
              />
              <text
                x={ward.labelX} y={ward.labelY}
                textAnchor="middle" dominantBaseline="middle"
                fill={isHovered ? "#7FD476" : "rgba(255,255,255,0.9)"}
                fontSize="9"
                fontWeight={isHovered ? "700" : "500"}
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

        {/* 凡例 */}
        <rect x="20" y="532" width="10" height="10" rx="2"
          fill="rgba(91,173,82,0.35)" stroke="rgba(91,173,82,0.8)" strokeWidth="1" />
        <text x="34" y="541" fill="rgba(255,255,255,0.55)" fontSize="9"
          fontFamily="'Noto Sans JP', sans-serif" dominantBaseline="middle">
          対応エリア
        </text>
        <rect x="110" y="532" width="10" height="10" rx="2"
          fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
        <text x="124" y="541" fill="rgba(255,255,255,0.35)" fontSize="9"
          fontFamily="'Noto Sans JP', sans-serif" dominantBaseline="middle">
          対応エリア外
        </text>
      </svg>
    </div>
  );
}
