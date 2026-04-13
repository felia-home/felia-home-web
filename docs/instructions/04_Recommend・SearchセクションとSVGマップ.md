# 指示文 04 — Recommend セクション・Search セクション・SVG マップ

## 概要

トップページに2つのセクションを実装する。

1. **Recommend** — エリア別おすすめ物件（17区 × 著作権フリー画像カード）
2. **Search** — 物件検索（左: 東京都SVGクリッカブルマップ / 右: 路線テキストリンク）

**作業ディレクトリ**: `C:\Users\User\projects\felia-home-web`

---

## Step 1: 区画像のダウンロード

`public/areas/` に各区の著作権フリー画像を配置する。
以下の URL から画像をダウンロードして `public/areas/` に保存する。

```bash
# public/areas/ フォルダがなければ作成
mkdir -p public/areas
```

以下のコマンドを順番に実行して画像をダウンロードする（curl を使用）。
各 URL は Unsplash の特定フォト ID を使用した著作権フリー画像。

```bash
# 渋谷区（スクランブル交差点）
curl -L "https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=800&q=80" -o public/areas/shibuya.jpg

# 新宿区（高層ビル群）
curl -L "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80" -o public/areas/shinjuku.jpg

# 杉並区（閑静な住宅街・街路樹）
curl -L "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80" -o public/areas/suginami.jpg

# 世田谷区（住宅・緑）
curl -L "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80" -o public/areas/setagaya.jpg

# 文京区（東京ドーム周辺）
curl -L "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80" -o public/areas/bunkyo.jpg

# 豊島区（池袋）
curl -L "https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?w=800&q=80" -o public/areas/toshima.jpg

# 中野区（住宅街）
curl -L "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80" -o public/areas/nakano.jpg

# 目黒区（目黒川・桜）
curl -L "https://images.unsplash.com/photo-1522383225653-ed111181a951?w=800&q=80" -o public/areas/meguro.jpg

# 北区（赤羽・飛鳥山）
curl -L "https://images.unsplash.com/photo-1478436127897-769e1b3f0f36?w=800&q=80" -o public/areas/kita.jpg

# 板橋区（住宅・公園）
curl -L "https://images.unsplash.com/photo-1513407030348-c983a97b98d8?w=800&q=80" -o public/areas/itabashi.jpg

# 練馬区（住宅・緑）
curl -L "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&q=80" -o public/areas/nerima.jpg

# 品川区（高輪・天王洲）
curl -L "https://images.unsplash.com/photo-1553913861-c0fddf2619ee?w=800&q=80" -o public/areas/shinagawa.jpg

# 港区（東京タワー）
curl -L "https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?w=800&q=80" -o public/areas/minato.jpg

# 大田区（羽田・多摩川）
curl -L "https://images.unsplash.com/photo-1517816743773-6e0fd518b4a6?w=800&q=80" -o public/areas/ota.jpg

# 千代田区（皇居・丸の内）
curl -L "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=800&q=80" -o public/areas/chiyoda.jpg

# 中央区（銀座・日本橋）
curl -L "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800&q=80" -o public/areas/chuo.jpg

# その他エリア（東京一般）
curl -L "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80" -o public/areas/others.jpg
```

> ⚠️ ダウンロードに失敗した画像は後でグラデーション背景で代替される。
> curl がなければ `Node.js` スクリプトでダウンロードしても可。

---

## Step 2: エリアデータ定義ファイルの作成

```typescript
// lib/areaData.ts

export interface AreaItem {
  id: string;
  name: string;         // 区名（日本語）
  image: string;        // /areas/xxx.jpg
  gradient: string;     // 画像読み込み失敗時のフォールバック
  href: string;         // 遷移先
}

export const areaGroups: AreaItem[][] = [
  // グループ1
  [
    { id: "shibuya",   name: "渋谷区", image: "/areas/shibuya.jpg",   gradient: "linear-gradient(135deg,#2d4a2d,#5BAD52)", href: "/properties?area=渋谷区" },
    { id: "shinjuku",  name: "新宿区", image: "/areas/shinjuku.jpg",  gradient: "linear-gradient(135deg,#1a2a3a,#4a6fa5)", href: "/properties?area=新宿区" },
    { id: "suginami",  name: "杉並区", image: "/areas/suginami.jpg",  gradient: "linear-gradient(135deg,#2d3a1a,#7a9a3a)", href: "/properties?area=杉並区" },
    { id: "setagaya",  name: "世田谷区",image: "/areas/setagaya.jpg", gradient: "linear-gradient(135deg,#1a3a2a,#3a8a5a)", href: "/properties?area=世田谷区" },
  ],
  // グループ2
  [
    { id: "bunkyo",    name: "文京区", image: "/areas/bunkyo.jpg",    gradient: "linear-gradient(135deg,#2a1a3a,#6a4a9a)", href: "/properties?area=文京区" },
    { id: "toshima",   name: "豊島区", image: "/areas/toshima.jpg",   gradient: "linear-gradient(135deg,#3a2a1a,#9a6a3a)", href: "/properties?area=豊島区" },
    { id: "nakano",    name: "中野区", image: "/areas/nakano.jpg",    gradient: "linear-gradient(135deg,#1a3a3a,#3a8a8a)", href: "/properties?area=中野区" },
    { id: "meguro",    name: "目黒区", image: "/areas/meguro.jpg",    gradient: "linear-gradient(135deg,#2a2a1a,#7a7a2a)", href: "/properties?area=目黒区" },
  ],
  // グループ3
  [
    { id: "kita",      name: "北区",   image: "/areas/kita.jpg",      gradient: "linear-gradient(135deg,#1a2a1a,#4a7a4a)", href: "/properties?area=北区" },
    { id: "itabashi",  name: "板橋区", image: "/areas/itabashi.jpg",  gradient: "linear-gradient(135deg,#2a1a2a,#7a4a7a)", href: "/properties?area=板橋区" },
    { id: "nerima",    name: "練馬区", image: "/areas/nerima.jpg",    gradient: "linear-gradient(135deg,#1a3a1a,#5a9a5a)", href: "/properties?area=練馬区" },
    { id: "shinagawa", name: "品川区", image: "/areas/shinagawa.jpg", gradient: "linear-gradient(135deg,#1a1a3a,#4a4a9a)", href: "/properties?area=品川区" },
  ],
  // グループ4
  [
    { id: "minato",    name: "港区",   image: "/areas/minato.jpg",    gradient: "linear-gradient(135deg,#2a1a1a,#8a3a3a)", href: "/properties?area=港区" },
    { id: "ota",       name: "大田区", image: "/areas/ota.jpg",       gradient: "linear-gradient(135deg,#1a2a3a,#3a5a7a)", href: "/properties?area=大田区" },
    { id: "chiyoda",   name: "千代田区",image: "/areas/chiyoda.jpg",  gradient: "linear-gradient(135deg,#2a2a2a,#6a6a6a)", href: "/properties?area=千代田区" },
    { id: "chuo",      name: "中央区", image: "/areas/chuo.jpg",      gradient: "linear-gradient(135deg,#2a1a2a,#7a3a6a)", href: "/properties?area=中央区" },
  ],
];

export const otherArea: AreaItem = {
  id: "others",
  name: "その他",
  image: "/areas/others.jpg",
  gradient: "linear-gradient(135deg,#2a2a2a,#5BAD52)",
  href: "/properties",
};
```

---

## Step 3: components/home/RecommendSection.tsx の作成

```typescript
// components/home/RecommendSection.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { areaGroups, otherArea, type AreaItem } from "@/lib/areaData";
import { ArrowRight } from "lucide-react";

export function RecommendSection() {
  return (
    <section className="section-padding bg-white">
      <div className="container-content">
        <SectionTitle en="Recommend" ja="エリア別おすすめ物件" />

        <div className="space-y-4">
          {/* グループ1〜4（4枚ずつ） */}
          {areaGroups.map((group, gi) => (
            <div key={gi} className="grid grid-cols-2 tb:grid-cols-4 gap-3 tb:gap-4">
              {group.map((area) => (
                <AreaCard key={area.id} area={area} />
              ))}
            </div>
          ))}

          {/* その他エリア（1枚・幅広） */}
          <div>
            <Link
              href={otherArea.href}
              className="group relative block w-full overflow-hidden rounded-lg"
              style={{ paddingBottom: "20%" }}
            >
              <div className="absolute inset-0">
                <AreaBackground area={otherArea} />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />
                <div className="absolute inset-0 flex items-center justify-center gap-3">
                  <span className="text-white font-bold text-xl tb:text-2xl tracking-widest">
                    {otherArea.name}（東京都内）
                  </span>
                  <span className="flex items-center gap-1 text-white/80 text-sm border border-white/50 rounded px-2 py-0.5">
                    view more <ArrowRight size={12} />
                  </span>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function AreaCard({ area }: { area: AreaItem }) {
  return (
    <Link
      href={area.href}
      className="group relative block overflow-hidden rounded-lg"
      style={{ paddingBottom: "70%" }}
    >
      <div className="absolute inset-0">
        {/* 背景（画像 or グラデーション） */}
        <AreaBackground area={area} />

        {/* 暗いオーバーレイ */}
        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/45 transition-colors duration-300" />

        {/* hover時の緑ボーダー */}
        <div
          className="absolute inset-0 rounded-lg border-2 border-transparent group-hover:border-felia-green transition-colors duration-300"
          style={{ borderColor: "transparent" }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#5BAD52")}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = "transparent")}
        />

        {/* テキストエリア */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-2">
          <span className="text-white font-bold tracking-widest text-center drop-shadow-md"
            style={{ fontSize: "clamp(13px, 2vw, 18px)" }}>
            {area.name}
          </span>
          <span className="mt-1.5 text-white/70 text-xs tracking-widest group-hover:text-white transition-colors">
            view more
          </span>
        </div>

        {/* 下部グリーンライン（hover時） */}
        <div
          className="absolute bottom-0 left-0 h-0.5 transition-all duration-300"
          style={{
            width: "0%",
            backgroundColor: "#5BAD52",
          }}
          ref={(el) => {
            if (el) {
              el.closest("a")?.addEventListener("mouseenter", () => {
                el.style.width = "100%";
              });
              el.closest("a")?.addEventListener("mouseleave", () => {
                el.style.width = "0%";
              });
            }
          }}
        />
      </div>
    </Link>
  );
}

function AreaBackground({ area }: { area: AreaItem }) {
  const [imgError, setImgError] = useState(false);

  if (imgError || !area.image) {
    return (
      <div
        className="absolute inset-0"
        style={{ background: area.gradient }}
      />
    );
  }

  return (
    <Image
      src={area.image}
      alt={`${area.name}のイメージ`}
      fill
      className="object-cover transition-transform duration-500 group-hover:scale-105"
      sizes="(max-width: 768px) 50vw, 25vw"
      onError={() => setImgError(true)}
    />
  );
}
```

---

## Step 4: 東京23区SVGマップデータの作成

クリッカブル対象17区と、城東エリア（グレー・非クリッカブル）を含む
簡略化した東京23区SVGを定義する。

```typescript
// lib/tokyoMapData.ts

export interface WardPath {
  id: string;
  name: string;
  path: string;          // SVG path d属性
  clickable: boolean;    // true=クリッカブル / false=グレーアウト
  href?: string;
  labelX: number;        // 区名ラベルのX座標
  labelY: number;        // 区名ラベルのY座標
}

// viewBox="0 0 500 480" を前提とした簡略パス
// 実際の区界を大まかに再現した手書きパス
export const tokyoWards: WardPath[] = [
  // ── クリッカブル17区 ──────────────────────────────

  // 千代田区（中心部）
  { id: "chiyoda", name: "千代田区", clickable: true, href: "/properties?area=千代田区",
    labelX: 252, labelY: 230,
    path: "M238,215 L265,210 L272,225 L268,242 L245,245 L235,235 Z" },

  // 中央区
  { id: "chuo", name: "中央区", clickable: true, href: "/properties?area=中央区",
    labelX: 285, labelY: 245,
    path: "M268,225 L290,218 L298,230 L295,250 L275,255 L268,242 Z" },

  // 港区
  { id: "minato", name: "港区", clickable: true, href: "/properties?area=港区",
    labelX: 248, labelY: 268,
    path: "M225,250 L268,242 L275,255 L270,280 L248,290 L220,278 Z" },

  // 新宿区
  { id: "shinjuku", name: "新宿区", clickable: true, href: "/properties?area=新宿区",
    labelX: 205, labelY: 228,
    path: "M185,210 L235,205 L238,215 L235,235 L215,245 L188,238 Z" },

  // 文京区
  { id: "bunkyo", name: "文京区", clickable: true, href: "/properties?area=文京区",
    labelX: 255, labelY: 200,
    path: "M238,185 L275,180 L282,195 L272,215 L265,210 L238,215 L235,200 Z" },

  // 渋谷区
  { id: "shibuya", name: "渋谷区", clickable: true, href: "/properties?area=渋谷区",
    labelX: 195, labelY: 268,
    path: "M170,255 L215,245 L220,278 L210,298 L178,295 L165,278 Z" },

  // 豊島区
  { id: "toshima", name: "豊島区", clickable: true, href: "/properties?area=豊島区",
    labelX: 212, labelY: 193,
    path: "M190,178 L238,172 L238,185 L235,200 L215,205 L188,200 Z" },

  // 中野区
  { id: "nakano", name: "中野区", clickable: true, href: "/properties?area=中野区",
    labelX: 163, labelY: 235,
    path: "M140,222 L185,218 L188,238 L178,252 L148,252 L135,240 Z" },

  // 杉並区
  { id: "suginami", name: "杉並区", clickable: true, href: "/properties?area=杉並区",
    labelX: 145, labelY: 268,
    path: "M108,255 L165,248 L170,255 L165,278 L148,290 L105,282 Z" },

  // 目黒区
  { id: "meguro", name: "目黒区", clickable: true, href: "/properties?area=目黒区",
    labelX: 210, labelY: 310,
    path: "M178,295 L225,285 L230,305 L222,325 L192,328 L172,315 Z" },

  // 品川区
  { id: "shinagawa", name: "品川区", clickable: true, href: "/properties?area=品川区",
    labelX: 255, labelY: 315,
    path: "M230,285 L275,278 L282,300 L278,328 L252,335 L230,320 L222,305 Z" },

  // 大田区
  { id: "ota", name: "大田区", clickable: true, href: "/properties?area=大田区",
    labelX: 210, labelY: 360,
    path: "M172,330 L230,325 L235,355 L228,388 L195,395 L162,375 L158,348 Z" },

  // 世田谷区
  { id: "setagaya", name: "世田谷区", clickable: true, href: "/properties?area=世田谷区",
    labelX: 148, labelY: 318,
    path: "M105,295 L172,288 L178,315 L172,330 L158,345 L105,340 L88,318 Z" },

  // 北区
  { id: "kita", name: "北区", clickable: true, href: "/properties?area=北区",
    labelX: 242, labelY: 165,
    path: "M218,145 L272,140 L278,158 L275,178 L238,182 L215,178 L212,160 Z" },

  // 板橋区
  { id: "itabashi", name: "板橋区", clickable: true, href: "/properties?area=板橋区",
    labelX: 182, labelY: 155,
    path: "M148,138 L218,132 L218,145 L212,165 L190,172 L148,165 L138,150 Z" },

  // 練馬区
  { id: "nerima", name: "練馬区", clickable: true, href: "/properties?area=練馬区",
    labelX: 148, labelY: 185,
    path: "M100,168 L190,162 L190,178 L185,200 L158,208 L100,200 Z" },

  // ── 非クリッカブル（城東エリア）─────────────────────

  // 台東区
  { id: "taito", name: "台東区", clickable: false,
    labelX: 305, labelY: 205,
    path: "M290,192 L318,188 L322,205 L315,220 L295,222 L288,210 Z" },

  // 墨田区
  { id: "sumida", name: "墨田区", clickable: false,
    labelX: 325, labelY: 228,
    path: "M310,215 L342,210 L348,228 L340,248 L318,250 L308,235 Z" },

  // 江東区
  { id: "koto", name: "江東区", clickable: false,
    labelX: 340, labelY: 270,
    path: "M310,248 L365,242 L372,268 L368,298 L335,305 L305,290 L305,262 Z" },

  // 荒川区
  { id: "arakawa", name: "荒川区", clickable: false,
    labelX: 305, labelY: 182,
    path: "M285,168 L318,162 L322,178 L318,192 L290,195 L282,182 Z" },

  // 足立区
  { id: "adachi", name: "足立区", clickable: false,
    labelX: 315, labelY: 148,
    path: "M268,128 L365,120 L372,145 L365,165 L318,168 L275,162 L265,148 Z" },

  // 葛飾区
  { id: "katsushika", name: "葛飾区", clickable: false,
    labelX: 368, labelY: 178,
    path: "M345,158 L400,152 L408,175 L400,198 L365,202 L342,188 Z" },

  // 江戸川区
  { id: "edogawa", name: "江戸川区", clickable: false,
    labelX: 390, labelY: 235,
    path: "M362,205 L415,198 L422,228 L415,262 L375,268 L358,248 L355,225 Z" },
];
```

---

## Step 5: components/home/SearchSection.tsx の作成

```typescript
// components/home/SearchSection.tsx
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { tokyoWards } from "@/lib/tokyoMapData";
import { Train } from "lucide-react";

const lineGroups = [
  {
    group: "JR",
    lines: [
      { name: "JR山手線",       href: "/properties?line=山手線" },
      { name: "JR中央線",       href: "/properties?line=中央線" },
      { name: "JR埼京線",       href: "/properties?line=埼京線" },
      { name: "JR京浜東北線",   href: "/properties?line=京浜東北線" },
    ],
  },
  {
    group: "東急",
    lines: [
      { name: "東急東横線",     href: "/properties?line=東横線" },
      { name: "東急田園都市線", href: "/properties?line=田園都市線" },
      { name: "東急目黒線",     href: "/properties?line=目黒線" },
    ],
  },
  {
    group: "東京メトロ",
    lines: [
      { name: "銀座線",         href: "/properties?line=銀座線" },
      { name: "丸ノ内線",       href: "/properties?line=丸ノ内線" },
      { name: "半蔵門線",       href: "/properties?line=半蔵門線" },
      { name: "日比谷線",       href: "/properties?line=日比谷線" },
      { name: "東西線",         href: "/properties?line=東西線" },
      { name: "副都心線",       href: "/properties?line=副都心線" },
    ],
  },
  {
    group: "私鉄・都営",
    lines: [
      { name: "小田急小田原線", href: "/properties?line=小田原線" },
      { name: "京王線",         href: "/properties?line=京王線" },
      { name: "西武池袋線",     href: "/properties?line=西武池袋線" },
      { name: "西武新宿線",     href: "/properties?line=西武新宿線" },
      { name: "都営新宿線",     href: "/properties?line=新宿線" },
      { name: "都営三田線",     href: "/properties?line=三田線" },
      { name: "都営大江戸線",   href: "/properties?line=大江戸線" },
    ],
  },
];

export function SearchSection() {
  const router = useRouter();

  return (
    <section className="section-padding" style={{ backgroundColor: "#F8F8F8" }}>
      <div className="container-content">
        <SectionTitle en="Search" ja="物件検索" />

        <div className="grid grid-cols-1 tb:grid-cols-2 gap-8 tb:gap-12 items-start">

          {/* 左: SVGクリッカブルマップ */}
          <div>
            <h3 className="text-sm font-bold text-gray-500 tracking-widest mb-4 text-center">
              エリアから探す
            </h3>
            <TokyoSVGMap onWardClick={(href) => router.push(href)} />
          </div>

          {/* 右: 路線テキストリンク */}
          <div>
            <h3 className="text-sm font-bold text-gray-500 tracking-widest mb-4 text-center">
              路線から探す
            </h3>
            <div className="space-y-5">
              {lineGroups.map((group) => (
                <div key={group.group}>
                  <div className="flex items-center gap-2 mb-2">
                    <Train size={14} style={{ color: "#5BAD52" }} />
                    <span className="text-xs font-bold text-gray-400 tracking-widest">
                      {group.group}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {group.lines.map((line) => (
                      <Link
                        key={line.name}
                        href={line.href}
                        className="text-sm px-3 py-1.5 rounded border border-gray-200 text-gray-600
                                   hover:border-felia-green hover:text-felia-green
                                   transition-colors duration-200 bg-white"
                      >
                        {line.name}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// SVGマップコンポーネント
function TokyoSVGMap({ onWardClick }: { onWardClick: (href: string) => void }) {
  return (
    <div className="relative w-full">
      <svg
        viewBox="0 0 500 430"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        style={{ maxHeight: "420px" }}
      >
        {tokyoWards.map((ward) => (
          <g key={ward.id}>
            {/* パス（区の形） */}
            <path
              d={ward.path}
              fill={ward.clickable ? "#EBF7EA" : "#EEEEEE"}
              stroke="#FFFFFF"
              strokeWidth="1.5"
              className={ward.clickable ? "cursor-pointer" : "cursor-default"}
              style={{
                transition: "fill 0.2s ease",
              }}
              onMouseEnter={(e) => {
                if (ward.clickable) {
                  (e.target as SVGPathElement).setAttribute("fill", "#5BAD52");
                }
              }}
              onMouseLeave={(e) => {
                if (ward.clickable) {
                  (e.target as SVGPathElement).setAttribute("fill", "#EBF7EA");
                }
              }}
              onClick={() => {
                if (ward.clickable && ward.href) {
                  onWardClick(ward.href);
                }
              }}
            />

            {/* 区名ラベル */}
            <text
              x={ward.labelX}
              y={ward.labelY}
              textAnchor="middle"
              dominantBaseline="middle"
              fill={ward.clickable ? "#333333" : "#AAAAAA"}
              fontSize="7"
              fontFamily="'Noto Sans JP', sans-serif"
              fontWeight={ward.clickable ? "700" : "400"}
              style={{
                pointerEvents: "none",
                userSelect: "none",
              }}
            >
              {ward.name}
            </text>
          </g>
        ))}
      </svg>

      {/* 凡例 */}
      <div className="flex items-center gap-4 mt-3 justify-center text-xs text-gray-500">
        <span className="flex items-center gap-1.5">
          <span
            className="inline-block w-3 h-3 rounded"
            style={{ backgroundColor: "#EBF7EA", border: "1px solid #5BAD52" }}
          />
          対応エリア
        </span>
        <span className="flex items-center gap-1.5">
          <span
            className="inline-block w-3 h-3 rounded bg-gray-200"
          />
          対応エリア外
        </span>
      </div>
    </div>
  );
}
```

---

## Step 6: app/page.tsx を更新

```typescript
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
```

---

## Step 7: 動作確認

```bash
npm run dev
```

確認項目:
1. **Recommend セクション**
   - 4グループ × 4枚のカードが表示される
   - 画像が読み込めた区は写真、失敗した区はグラデーションが表示される
   - カードをホバーすると暗くなり "view more" が明るくなる
   - クリックで `/properties?area=区名` に遷移する
   - 最下部に「その他（東京都内）」の横長カードが表示される

2. **Search セクション**
   - 左カラムにSVGの東京マップが表示される
   - 17区（薄緑）は hover で濃い緑になる
   - 城東エリア（グレー）は hover しても変化しない
   - 区をクリックすると `/properties?area=区名` に遷移する
   - 右カラムに路線タグが4グループ表示される
   - 路線タグをクリックすると `/properties?line=路線名` に遷移する

3. SP（375px）で崩れないこと
4. `npm run build` エラーなし

---

## 完了条件チェックリスト

- [ ] `public/areas/` に17枚以上の画像が配置されている（一部失敗してもOK）
- [ ] `lib/areaData.ts` 作成済み
- [ ] `lib/tokyoMapData.ts` 作成済み
- [ ] `components/home/RecommendSection.tsx` 作成済み
- [ ] `components/home/SearchSection.tsx` 作成済み
- [ ] `app/page.tsx` に両セクションが組み込まれている
- [ ] RecommendカードのHoverが動作する
- [ ] SVGマップの17区がクリッカブル（薄緑 → 濃緑）
- [ ] 城東エリアがグレーアウト
- [ ] `npm run build` エラーなし

---

## 次の指示文

`05_Felia-Selection・NEW-News・OpenHouseセクション.md`
