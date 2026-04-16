# 指示文 18 — 東京区マップ SVG コンポーネント

## 概要

実際の区の形に近い東京SVGマップを作成する。
デザイン：ダークティール背景・白のラインと区名・クリッカブル。

**作業ディレクトリ**: `C:\Users\User\projects\felia-home-web`

---

## 絶対ルール
1. `prisma db push` 絶対禁止
2. スキーマ変更は手動SQL + `npx prisma generate` のみ
3. VPS・DBへの直接操作禁止
4. Tailwind CSS禁止・全インラインスタイル
5. デプロイ（git pull / pm2 restart）はAtsushiが手動実施

---

## Step 1: components/home/TokyoWardMap.tsx の作成

```typescript
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

// viewBox="0 0 500 560"
// 実際の東京区の形に近似したSVGパス（対象17区）
const WARDS: Ward[] = [
  // ── 北部 ─────────────────────────────────────────────
  {
    id: "itabashi",
    name: "板橋区",
    clickable: true,
    href: "/areas/板橋区",
    labelX: 178,
    labelY: 95,
    path: "M 120,60 L 240,55 L 255,70 L 260,110 L 245,125 L 220,130 L 200,140 L 175,135 L 150,120 L 130,105 Z",
  },
  {
    id: "kita",
    name: "北区",
    clickable: true,
    href: "/areas/北区",
    labelX: 295,
    labelY: 95,
    path: "M 255,55 L 340,50 L 355,65 L 360,100 L 345,120 L 320,130 L 295,135 L 270,125 L 260,110 L 255,70 Z",
  },
  // ── 北西部 ────────────────────────────────────────────
  {
    id: "nerima",
    name: "練馬区",
    clickable: true,
    href: "/areas/練馬区",
    labelX: 115,
    labelY: 165,
    path: "M 55,115 L 120,60 L 150,120 L 175,135 L 200,140 L 195,175 L 170,190 L 130,200 L 85,195 L 55,175 Z",
  },
  {
    id: "toshima",
    name: "豊島区",
    clickable: true,
    href: "/areas/豊島区",
    labelX: 265,
    labelY: 160,
    path: "M 220,130 L 260,110 L 295,135 L 300,160 L 280,175 L 255,178 L 230,168 L 215,150 Z",
  },
  // ── 中西部 ────────────────────────────────────────────
  {
    id: "nakano",
    name: "中野区",
    clickable: true,
    href: "/areas/中野区",
    labelX: 188,
    labelY: 215,
    path: "M 130,200 L 170,190 L 195,175 L 220,185 L 230,210 L 215,230 L 190,240 L 160,235 L 135,222 Z",
  },
  {
    id: "shinjuku",
    name: "新宿区",
    clickable: true,
    href: "/areas/新宿区",
    labelX: 270,
    labelY: 215,
    path: "M 230,168 L 255,178 L 280,175 L 305,185 L 310,215 L 295,235 L 270,245 L 245,238 L 228,218 L 230,195 Z",
  },
  {
    id: "bunkyo",
    name: "文京区",
    clickable: true,
    href: "/areas/文京区",
    labelX: 340,
    labelY: 175,
    path: "M 300,135 L 340,130 L 360,145 L 365,175 L 350,195 L 325,200 L 305,190 L 300,165 Z",
  },
  // ── 中部 ──────────────────────────────────────────────
  {
    id: "suginami",
    name: "杉並区",
    clickable: true,
    href: "/areas/杉並区",
    labelX: 115,
    labelY: 268,
    path: "M 55,230 L 135,222 L 160,235 L 165,265 L 148,290 L 110,300 L 68,288 L 52,260 Z",
  },
  {
    id: "shibuya",
    name: "渋谷区",
    clickable: true,
    href: "/areas/渋谷区",
    labelX: 228,
    labelY: 278,
    path: "M 215,238 L 245,238 L 268,248 L 275,270 L 262,292 L 238,300 L 215,290 L 205,268 Z",
  },
  {
    id: "chiyoda",
    name: "千代田区",
    clickable: true,
    href: "/areas/千代田区",
    labelX: 348,
    labelY: 235,
    path: "M 325,200 L 365,195 L 380,215 L 378,240 L 358,255 L 335,250 L 318,235 Z",
  },
  {
    id: "minato",
    name: "港区",
    clickable: true,
    href: "/areas/港区",
    labelX: 355,
    labelY: 295,
    path: "M 335,250 L 378,242 L 395,262 L 392,300 L 375,320 L 348,318 L 328,300 L 328,272 Z",
  },
  // ── 南西部 ────────────────────────────────────────────
  {
    id: "setagaya",
    name: "世田谷区",
    clickable: true,
    href: "/areas/世田谷区",
    labelX: 130,
    labelY: 345,
    path: "M 52,300 L 110,300 L 148,295 L 168,315 L 162,355 L 140,378 L 100,385 L 58,368 L 40,338 Z",
  },
  {
    id: "meguro",
    name: "目黒区",
    clickable: true,
    href: "/areas/目黒区",
    labelX: 228,
    labelY: 335,
    path: "M 205,295 L 238,300 L 262,295 L 270,318 L 258,342 L 230,352 L 205,340 L 195,318 Z",
  },
  {
    id: "shinagawa",
    name: "品川区",
    clickable: true,
    href: "/areas/品川区",
    labelX: 315,
    labelY: 355,
    path: "M 295,318 L 328,308 L 352,325 L 358,358 L 340,385 L 310,390 L 285,372 L 282,342 Z",
  },
  {
    id: "chuo",
    name: "中央区",
    clickable: true,
    href: "/areas/中央区",
    labelX: 400,
    labelY: 255,
    path: "M 378,215 L 415,218 L 422,245 L 415,270 L 395,278 L 378,265 L 378,240 Z",
  },
  // ── 南部 ──────────────────────────────────────────────
  {
    id: "ota",
    name: "大田区",
    clickable: true,
    href: "/areas/大田区",
    labelX: 170,
    labelY: 420,
    path: "M 100,390 L 165,380 L 205,368 L 225,390 L 228,428 L 210,458 L 175,468 L 135,458 L 100,435 Z",
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
```

---

## Step 2: components/home/RecommendSection.tsx にマップ表示を追加

現在の4×グリッドカードとマップを**切り替えタブ式**で表示する。
または**マップのみ**の表示にする。

今回はマップをメインに、下部にエリア一覧リンクを並べるシンプルな構成にする：

```typescript
// components/home/RecommendSection.tsx の return 部分を更新

import { TokyoWardMap } from "./TokyoWardMap";

export async function RecommendSection() {
  const areas = await getAreas();

  return (
    <section style={{ padding: "64px 0", backgroundColor: "#ffffff" }}>
      <div className="container-content">
        <SectionTitle en="Recommend" ja="エリア別おすすめ物件" />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "32px",
            alignItems: "start",
          }}
          className="tb:grid-cols-2 grid-cols-1"
        >
          {/* 左: マップ */}
          <div>
            <TokyoWardMap
              areas={areas.map((a) => ({
                area_name: a.area_name,
                href: a.link_url || `/areas/${encodeURIComponent(a.area_name)}`,
              }))}
            />
          </div>

          {/* 右: エリアリンク一覧 */}
          <div>
            <p
              style={{
                fontSize: "13px",
                color: "#666",
                marginBottom: "16px",
                fontWeight: "500",
              }}
            >
              エリアを選択して物件を探す
            </p>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "8px",
              }}
            >
              {areas.length > 0
                ? areas.map((area) => (
                    <a
                      key={area.id}
                      href={
                        area.link_url ||
                        `/areas/${encodeURIComponent(area.area_name)}`
                      }
                      style={{
                        display: "inline-block",
                        padding: "8px 16px",
                        borderRadius: "24px",
                        border: "1px solid #E5E5E5",
                        fontSize: "13px",
                        color: "#333",
                        textDecoration: "none",
                        transition: "all 0.2s ease",
                        backgroundColor: "white",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = "#5BAD52";
                        e.currentTarget.style.color = "#5BAD52";
                        e.currentTarget.style.backgroundColor = "#EBF7EA";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = "#E5E5E5";
                        e.currentTarget.style.color = "#333";
                        e.currentTarget.style.backgroundColor = "white";
                      }}
                    >
                      {area.area_name}
                    </a>
                  ))
                : // フォールバック（APIが空の場合）
                  [
                    "渋谷区","新宿区","杉並区","世田谷区",
                    "文京区","豊島区","中野区","目黒区",
                    "北区","板橋区","練馬区","品川区",
                    "港区","大田区","千代田区","中央区",
                  ].map((name) => (
                    <a
                      key={name}
                      href={`/areas/${encodeURIComponent(name)}`}
                      style={{
                        display: "inline-block",
                        padding: "8px 16px",
                        borderRadius: "24px",
                        border: "1px solid #E5E5E5",
                        fontSize: "13px",
                        color: "#333",
                        textDecoration: "none",
                      }}
                    >
                      {name}
                    </a>
                  ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
```

---

## Step 3: SearchSection の既存SVGマップを TokyoWardMap に統合

`components/home/SearchSection.tsx` の `TokyoSVGMap` 内部コンポーネントを
`TokyoWardMap` に差し替える（オプション：後でやってもOK）。

---

## Step 4: SP対応

`RecommendSection` の2カラムグリッドをSPでは1カラムにする：

```typescript
// style の gridTemplateColumns を以下に変更
// SP: 1カラム、PC: 2カラム
```

SPでは `TokyoWardMap` を上、エリアリンクを下に配置。

---

## Step 5: ビルド確認・コミット

```bash
npm run build
git add -A
git commit -m "feat: add Tokyo ward SVG map to RecommendSection"
git push origin main
```

---

## 完了条件チェックリスト

- [ ] `components/home/TokyoWardMap.tsx` 作成済み
- [ ] ダークティール背景・白ライン・区名表示
- [ ] hover時にグリーンにハイライト
- [ ] クリックで `/areas/区名` に遷移
- [ ] `RecommendSection.tsx` にマップ + エリアリンクリストを表示
- [ ] `npm run build` エラーなし

---

## 次の指示文

`19_SEOAgent実装.md`
