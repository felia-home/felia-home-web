"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// 区名→URLマッピング
const WARD_HREF: Record<string, string> = {
  "千代田区": "/areas/千代田区",
  "中央区": "/areas/中央区",
  "港区": "/areas/港区",
  "新宿区": "/areas/新宿区",
  "文京区": "/areas/文京区",
  "台東区": "/areas/台東区",
  "品川区": "/areas/品川区",
  "目黒区": "/areas/目黒区",
  "大田区": "/areas/大田区",
  "世田谷区": "/areas/世田谷区",
  "渋谷区": "/areas/渋谷区",
  "中野区": "/areas/中野区",
  "杉並区": "/areas/杉並区",
  "豊島区": "/areas/豊島区",
  "北区": "/areas/北区",
  "荒川区": "/areas/荒川区",
  "板橋区": "/areas/板橋区",
  "練馬区": "/areas/練馬区",
};

// 正規化済み東京23区SVGパス（viewBox 0 0 800 600 基準）
const WARD_PATHS: {
  id: string;
  name: string;
  d: string;
  labelX: number;
  labelY: number;
  active: boolean;
}[] = [
  {
    id: "nerima", name: "練馬区", active: true, labelX: 138, labelY: 148,
    d: "M 62,176 L 80,134 L 108,118 L 140,110 L 168,124 L 178,138 L 196,130 L 210,148 L 196,162 L 178,170 L 166,158 L 148,164 L 132,180 L 112,182 Z"
  },
  {
    id: "itabashi", name: "板橋区", active: true, labelX: 248, labelY: 152,
    d: "M 178,138 L 196,130 L 210,148 L 230,142 L 248,130 L 272,132 L 290,150 L 296,168 L 278,178 L 260,174 L 248,186 L 230,180 L 210,178 L 196,162 L 178,170 L 166,158 L 178,138 Z"
  },
  {
    id: "kita", name: "北区", active: true, labelX: 352, labelY: 168,
    d: "M 296,168 L 290,150 L 308,138 L 330,130 L 352,132 L 372,128 L 390,138 L 400,150 L 398,168 L 380,178 L 360,182 L 340,178 L 320,182 L 298,180 Z"
  },
  {
    id: "arakawa", name: "荒川区", active: true, labelX: 430, labelY: 166,
    d: "M 400,150 L 420,138 L 440,132 L 460,138 L 468,152 L 458,168 L 440,174 L 420,172 L 400,168 Z"
  },
  {
    id: "toshima", name: "豊島区", active: true, labelX: 316, labelY: 214,
    d: "M 278,178 L 296,168 L 298,180 L 320,182 L 330,196 L 320,210 L 304,218 L 288,214 L 272,208 L 270,194 Z"
  },
  {
    id: "bunkyo", name: "文京区", active: true, labelX: 374, labelY: 210,
    d: "M 340,178 L 360,182 L 380,178 L 398,168 L 412,178 L 408,196 L 396,208 L 380,214 L 360,212 L 344,204 L 330,196 L 340,188 Z"
  },
  {
    id: "taito", name: "台東区", active: true, labelX: 438, labelY: 206,
    d: "M 400,168 L 420,172 L 440,174 L 458,168 L 466,182 L 460,198 L 448,210 L 430,214 L 412,210 L 408,196 L 412,178 L 400,168 Z"
  },
  {
    id: "nakano", name: "中野区", active: true, labelX: 244, labelY: 236,
    d: "M 196,210 L 216,202 L 238,198 L 258,202 L 270,214 L 264,228 L 250,238 L 232,242 L 214,238 L 200,228 Z"
  },
  {
    id: "suginami", name: "杉並区", active: true, labelX: 178, labelY: 272,
    d: "M 112,248 L 134,236 L 160,228 L 184,222 L 210,224 L 230,232 L 238,248 L 232,264 L 214,276 L 194,282 L 172,284 L 150,278 L 130,268 L 114,258 Z"
  },
  {
    id: "shinjuku", name: "新宿区", active: true, labelX: 306, labelY: 248,
    d: "M 264,210 L 280,202 L 302,196 L 324,198 L 338,210 L 340,226 L 332,240 L 316,250 L 298,256 L 280,252 L 264,242 L 258,228 Z"
  },
  {
    id: "chiyoda", name: "千代田区", active: true, labelX: 376, labelY: 256,
    d: "M 340,226 L 356,216 L 376,214 L 396,218 L 408,230 L 404,246 L 392,256 L 374,262 L 356,260 L 342,250 Z"
  },
  {
    id: "chuo", name: "中央区", active: true, labelX: 432, labelY: 268,
    d: "M 404,246 L 420,238 L 442,238 L 460,246 L 464,262 L 454,276 L 436,282 L 416,278 L 404,266 Z"
  },
  {
    id: "minato", name: "港区", active: true, labelX: 374, labelY: 308,
    d: "M 332,268 L 352,260 L 374,262 L 392,256 L 404,266 L 404,282 L 396,298 L 382,312 L 362,318 L 344,314 L 330,302 L 326,286 Z"
  },
  {
    id: "shibuya", name: "渋谷区", active: true, labelX: 302, labelY: 294,
    d: "M 268,268 L 288,258 L 308,256 L 332,268 L 326,286 L 312,298 L 294,306 L 276,302 L 262,290 Z"
  },
  {
    id: "meguro", name: "目黒区", active: true, labelX: 278, labelY: 340,
    d: "M 240,318 L 262,308 L 284,308 L 306,314 L 314,330 L 308,346 L 292,356 L 272,358 L 252,350 L 238,338 Z"
  },
  {
    id: "shinagawa", name: "品川区", active: true, labelX: 360, labelY: 344,
    d: "M 308,314 L 330,310 L 352,314 L 372,320 L 384,336 L 380,354 L 364,364 L 344,366 L 324,360 L 308,348 L 306,330 Z"
  },
  {
    id: "setagaya", name: "世田谷区", active: true, labelX: 196, labelY: 352,
    d: "M 112,312 L 136,300 L 162,292 L 186,290 L 210,298 L 230,312 L 238,330 L 230,348 L 212,360 L 190,368 L 166,368 L 142,358 L 120,342 Z"
  },
  {
    id: "ota", name: "大田区", active: true, labelX: 316, labelY: 408,
    d: "M 238,368 L 260,358 L 282,360 L 306,362 L 328,368 L 348,378 L 356,396 L 350,416 L 334,428 L 310,434 L 286,430 L 262,418 L 244,402 L 234,386 Z"
  },
];

// 非アクティブ区（グレー表示）
const INACTIVE_WARDS: { id: string; name: string; d: string; labelX: number; labelY: number }[] = [
  {
    id: "sumida", name: "墨田区", labelX: 500, labelY: 220,
    d: "M 460,200 L 480,192 L 504,196 L 516,212 L 510,228 L 494,236 L 474,234 L 460,222 Z"
  },
  {
    id: "koto", name: "江東区", labelX: 510, labelY: 290,
    d: "M 460,246 L 480,240 L 504,240 L 524,250 L 530,270 L 526,296 L 510,314 L 488,320 L 468,314 L 454,298 L 454,276 L 460,262 Z"
  },
  {
    id: "adachi", name: "足立区", labelX: 420, labelY: 128,
    d: "M 380,112 L 406,106 L 432,110 L 458,118 L 476,132 L 468,148 L 448,156 L 424,154 L 400,148 L 382,136 Z"
  },
  {
    id: "katsushika", name: "葛飾区", labelX: 528, labelY: 156,
    d: "M 476,132 L 500,124 L 526,126 L 548,138 L 548,158 L 532,170 L 508,172 L 484,164 L 468,152 Z"
  },
  {
    id: "edogawa", name: "江戸川区", labelX: 564, labelY: 228,
    d: "M 524,192 L 548,186 L 572,192 L 590,210 L 588,234 L 572,250 L 548,256 L 526,250 L 512,234 L 512,212 Z"
  },
];

interface TokyoWardMapProps {
  areas?: { area_name: string; href?: string | null }[];
}

export function TokyoWardMap({ areas }: TokyoWardMapProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const router = useRouter();

  const getHref = (name: string): string => {
    if (areas) {
      const area = areas.find((a) => a.area_name === name);
      if (area?.href) return area.href;
    }
    return WARD_HREF[name] || `/areas/${encodeURIComponent(name)}`;
  };

  return (
    <div style={{ position: "relative", width: "100%" }}>
      <svg
        viewBox="50 100 580 380"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          width: "100%",
          height: "auto",
          display: "block",
          backgroundColor: "#1B3A4B",
          borderRadius: "12px",
        }}
      >
        {/* 非アクティブ区（グレー） */}
        {INACTIVE_WARDS.map((ward) => (
          <g key={ward.id}>
            <path
              d={ward.d}
              fill="rgba(255,255,255,0.08)"
              stroke="rgba(255,255,255,0.25)"
              strokeWidth="1"
            />
            <text
              x={ward.labelX}
              y={ward.labelY}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="rgba(255,255,255,0.35)"
              fontSize="9"
              fontFamily="'Noto Sans JP', sans-serif"
              style={{ pointerEvents: "none", userSelect: "none" }}
            >
              {ward.name}
            </text>
          </g>
        ))}

        {/* アクティブ区（クリッカブル） */}
        {WARD_PATHS.filter(w => w.active).map((ward) => {
          const hovered = hoveredId === ward.id;
          return (
            <g
              key={ward.id}
              style={{ cursor: "pointer" }}
              onClick={() => router.push(getHref(ward.name))}
              onMouseEnter={() => setHoveredId(ward.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <path
                d={ward.d}
                fill={hovered ? "rgba(91,173,82,0.85)" : "rgba(91,173,82,0.45)"}
                stroke={hovered ? "#7ed672" : "rgba(255,255,255,0.7)"}
                strokeWidth={hovered ? "1.5" : "1"}
                style={{ transition: "all 0.15s ease" }}
              />
              <text
                x={ward.labelX}
                y={ward.labelY}
                textAnchor="middle"
                dominantBaseline="middle"
                fill={hovered ? "#ffffff" : "rgba(255,255,255,0.95)"}
                fontSize="9.5"
                fontWeight={hovered ? "700" : "500"}
                fontFamily="'Noto Sans JP', sans-serif"
                style={{ pointerEvents: "none", userSelect: "none" }}
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
