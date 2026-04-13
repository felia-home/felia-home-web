# 指示文 05 — Felia Selection・NEW/News・OpenHouse セクション

## 概要

Admin API からデータを取得して表示する3つのセクションと、
共通で使う PropertyCard コンポーネントを本実装する。

1. **PropertyCard** — 物件カード（スタブを本実装に差し替え）
2. **Felia Selection** — 厳選物件（2枚表示 + 左右スライド）
3. **NEW / News** — 新着物件 ＋ お知らせ（2カラム）
4. **OpenHouse / Information** — 現地販売会 ＋ お知らせ（2カラム）

**作業ディレクトリ**: `C:\Users\User\projects\felia-home-web`

---

## Step 1: components/property/PropertyCard.tsx を本実装に差し替え

既存のスタブを以下で上書きする。

```typescript
// components/property/PropertyCard.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { MapPin, Train, Maximize2, LayoutGrid } from "lucide-react";
import type { Property } from "@/lib/api";

interface PropertyCardProps {
  property: Property;
  size?: "normal" | "large";  // large: Felia Selection用
}

export function PropertyCard({ property, size = "normal" }: PropertyCardProps) {
  const [imgError, setImgError] = useState(false);
  const isLarge = size === "large";

  return (
    <Link
      href={`/properties/${property.id}`}
      className="group block bg-white rounded-lg overflow-hidden border hover:shadow-lg transition-shadow duration-300"
      style={{ borderColor: "#E5E5E5" }}
    >
      {/* 画像エリア */}
      <div
        className="relative overflow-hidden bg-gray-100"
        style={{ paddingBottom: isLarge ? "62%" : "68%" }}
      >
        {/* バッジ群 */}
        <div className="absolute top-2.5 left-2.5 z-10 flex flex-wrap gap-1.5">
          {property.isNew && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded text-white"
              style={{ backgroundColor: "#5BAD52" }}>
              NEW
            </span>
          )}
          {property.isFeatured && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded text-white"
              style={{ backgroundColor: "#E67E22" }}>
              厳選
            </span>
          )}
          {property.isOpenHouse && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded text-white"
              style={{ backgroundColor: "#E74C3C" }}>
              現地販売会
            </span>
          )}
          {property.isMembersOnly && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded text-white bg-gray-600">
              会員限定
            </span>
          )}
        </div>

        {/* 物件種別バッジ（右上） */}
        <div className="absolute top-2.5 right-2.5 z-10">
          <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-white/90 text-gray-600">
            {property.propertyType}
          </span>
        </div>

        {/* 写真 */}
        {!imgError && property.mainImage ? (
          <Image
            src={property.mainImage}
            alt={property.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes={isLarge
              ? "(max-width: 768px) 100vw, 50vw"
              : "(max-width: 768px) 50vw, 25vw"}
            onError={() => setImgError(true)}
          />
        ) : (
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ background: "linear-gradient(135deg,#e8f5e8,#c8e8c8)" }}
          >
            <span className="text-gray-400 text-xs">画像なし</span>
          </div>
        )}
      </div>

      {/* 情報エリア */}
      <div className={`p-3 ${isLarge ? "tb:p-5" : ""}`}>
        {/* 価格 */}
        <div className="flex items-baseline gap-1 mb-1.5">
          <span
            className={`font-bold ${isLarge ? "text-2xl tb:text-3xl" : "text-xl"}`}
            style={{ color: "#5BAD52" }}
          >
            {property.price.toLocaleString()}
          </span>
          <span className="text-sm text-gray-500">万円</span>
        </div>

        {/* 物件名 */}
        <p className={`font-medium text-gray-700 leading-snug mb-2
          ${isLarge ? "text-base tb:text-lg" : "text-sm"}
          line-clamp-2`}>
          {property.name}
        </p>

        {/* 詳細情報 */}
        <div className="space-y-1">
          {/* 所在地 */}
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <MapPin size={11} className="flex-shrink-0" style={{ color: "#5BAD52" }} />
            <span className="truncate">{property.address}</span>
          </div>

          {/* 最寄駅 */}
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Train size={11} className="flex-shrink-0" style={{ color: "#5BAD52" }} />
            <span className="truncate">
              {property.nearestStation} 徒歩{property.walkMinutes}分
            </span>
          </div>

          {/* 面積・間取り */}
          <div className="flex items-center gap-3 text-xs text-gray-500">
            {property.area > 0 && (
              <span className="flex items-center gap-1">
                <Maximize2 size={10} style={{ color: "#5BAD52" }} />
                {property.area}㎡
              </span>
            )}
            {property.layout && (
              <span className="flex items-center gap-1">
                <LayoutGrid size={10} style={{ color: "#5BAD52" }} />
                {property.layout}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
```

---

## Step 2: components/home/FeliaSectionSelection.tsx の作成

Admin API から `is_featured` 物件を取得して表示。
2枚ずつ表示し、← → で次の2枚に切り替わる。

```typescript
// components/home/FeliaSectionSelection.tsx
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { PropertyCard } from "@/components/property/PropertyCard";
import { getFeaturedProperties } from "@/lib/api";
import { FeaturedSlider } from "./FeaturedSlider";

export async function FeliaSectionSelection() {
  let properties = [];
  try {
    properties = await getFeaturedProperties();
  } catch {
    // Admin APIが未起動の場合はスキップ（開発時）
    properties = [];
  }

  return (
    <section className="section-padding bg-white">
      <div className="container-content">
        <div className="flex items-end justify-between mb-8 tb:mb-12">
          <SectionTitle en="Felia Selection" ja="厳選物件情報" align="left" />
          <Link
            href="/properties?flag=featured"
            className="hidden tb:flex items-center gap-1 text-sm font-medium hover:gap-2 transition-all"
            style={{ color: "#5BAD52" }}
          >
            一覧を見る <ArrowRight size={14} />
          </Link>
        </div>

        {properties.length === 0 ? (
          <EmptyState />
        ) : (
          <FeaturedSlider properties={properties} />
        )}

        {/* SP用「一覧を見る」 */}
        <div className="mt-6 text-center tb:hidden">
          <Link
            href="/properties?flag=featured"
            className="inline-flex items-center gap-1 text-sm font-medium"
            style={{ color: "#5BAD52" }}
          >
            一覧を見る <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}

function EmptyState() {
  return (
    <div className="grid grid-cols-1 tb:grid-cols-2 gap-4 tb:gap-6">
      {[1, 2].map((i) => (
        <div
          key={i}
          className="rounded-lg border"
          style={{
            borderColor: "#E5E5E5",
            paddingBottom: "55%",
            position: "relative",
            background: "linear-gradient(135deg,#f0f8f0,#e0f0e0)",
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-gray-400 text-sm">厳選物件は準備中です</p>
          </div>
        </div>
      ))}
    </div>
  );
}
```

---

## Step 3: components/home/FeaturedSlider.tsx の作成

```typescript
// components/home/FeaturedSlider.tsx
"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PropertyCard } from "@/components/property/PropertyCard";
import type { Property } from "@/lib/api";

interface FeaturedSliderProps {
  properties: Property[];
}

export function FeaturedSlider({ properties }: FeaturedSliderProps) {
  const [page, setPage] = useState(0);
  const perPage = 2;
  const totalPages = Math.ceil(properties.length / perPage);
  const current = properties.slice(page * perPage, page * perPage + perPage);

  return (
    <div>
      {/* カードグリッド */}
      <div className="grid grid-cols-1 tb:grid-cols-2 gap-4 tb:gap-6">
        {current.map((p) => (
          <PropertyCard key={p.id} property={p} size="large" />
        ))}
      </div>

      {/* ページネーション（2件以上ある場合のみ表示） */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-6">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="w-10 h-10 rounded-full border flex items-center justify-center
                       disabled:opacity-30 hover:border-felia-green transition-colors"
            style={{ borderColor: "#E5E5E5" }}
            aria-label="前へ"
          >
            <ChevronLeft size={18} className="text-gray-600" />
          </button>

          {/* ドット */}
          <div className="flex gap-2">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                className="rounded-full transition-all duration-300"
                style={{
                  width: i === page ? "24px" : "8px",
                  height: "8px",
                  backgroundColor: i === page ? "#5BAD52" : "#D1D5DB",
                }}
                aria-label={`${i + 1}ページ目`}
              />
            ))}
          </div>

          <button
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page === totalPages - 1}
            className="w-10 h-10 rounded-full border flex items-center justify-center
                       disabled:opacity-30 hover:border-felia-green transition-colors"
            style={{ borderColor: "#E5E5E5" }}
            aria-label="次へ"
          >
            <ChevronRight size={18} className="text-gray-600" />
          </button>
        </div>
      )}
    </div>
  );
}
```

---

## Step 4: components/home/NewAndNewsSection.tsx の作成

```typescript
// components/home/NewAndNewsSection.tsx
import Link from "next/link";
import { ArrowRight, Home, Bell } from "lucide-react";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { getNewProperties, getNews } from "@/lib/api";
import type { Property, NewsItem } from "@/lib/api";

export async function NewAndNewsSection() {
  let newProperties: Property[] = [];
  let newsItems: NewsItem[] = [];

  try {
    [newProperties, newsItems] = await Promise.all([
      getNewProperties(),
      getNews(5),
    ]);
  } catch {
    // Admin APIが未起動の場合はスキップ
  }

  return (
    <section className="section-padding" style={{ backgroundColor: "#F8F8F8" }}>
      <div className="container-content">
        <div className="grid grid-cols-1 tb:grid-cols-2 gap-8 tb:gap-12">

          {/* 左: 新着物件 */}
          <div>
            <div className="flex items-end justify-between mb-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className="font-montserrat font-bold text-2xl tb:text-3xl tracking-wider"
                    style={{ color: "#5BAD52", fontFamily: "'Montserrat', sans-serif" }}
                  >
                    NEW
                  </span>
                </div>
                <p className="text-xs text-gray-400 tracking-widest">新着物件情報</p>
                <div className="mt-2 w-8 h-0.5" style={{ backgroundColor: "#5BAD52" }} />
              </div>
              <Link
                href="/properties?flag=new"
                className="text-xs flex items-center gap-1 hover:gap-2 transition-all"
                style={{ color: "#5BAD52" }}
              >
                もっと見る <ArrowRight size={12} />
              </Link>
            </div>

            <div className="space-y-0 divide-y" style={{ borderColor: "#E5E5E5" }}>
              {newProperties.length === 0 ? (
                <p className="text-sm text-gray-400 py-4">新着物件はありません</p>
              ) : (
                newProperties.slice(0, 5).map((p) => (
                  <NewPropertyRow key={p.id} property={p} />
                ))
              )}
            </div>
          </div>

          {/* セパレーター（SPでは非表示） */}
          <div
            className="hidden tb:block absolute left-1/2 -translate-x-1/2 w-px h-full"
            style={{ backgroundColor: "#E5E5E5", top: 0 }}
          />

          {/* 右: お知らせ */}
          <div>
            <div className="flex items-end justify-between mb-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className="font-montserrat font-bold text-2xl tb:text-3xl tracking-wider text-gray-700"
                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                  >
                    News
                  </span>
                </div>
                <p className="text-xs text-gray-400 tracking-widest">新着物件のお知らせ</p>
                <div className="mt-2 w-8 h-0.5 bg-gray-300" />
              </div>
              <Link
                href="/news"
                className="text-xs flex items-center gap-1 hover:gap-2 transition-all"
                style={{ color: "#5BAD52" }}
              >
                もっと見る <ArrowRight size={12} />
              </Link>
            </div>

            <div className="space-y-0 divide-y" style={{ borderColor: "#E5E5E5" }}>
              {newsItems.length === 0 ? (
                <p className="text-sm text-gray-400 py-4">お知らせはありません</p>
              ) : (
                newsItems.map((item) => (
                  <NewsRow key={item.id} item={item} />
                ))
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

// 新着物件の1行
function NewPropertyRow({ property }: { property: Property }) {
  const date = new Date(property.createdAt).toLocaleDateString("ja-JP", {
    month: "2-digit",
    day: "2-digit",
  });

  return (
    <Link
      href={`/properties/${property.id}`}
      className="flex items-start gap-3 py-3.5 hover:bg-white/60 transition-colors -mx-2 px-2 rounded group"
    >
      <Home size={14} className="flex-shrink-0 mt-0.5" style={{ color: "#5BAD52" }} />
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-700 group-hover:text-felia-green truncate leading-snug transition-colors">
          {property.name}
        </p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs text-gray-400">{property.address}</span>
          <span className="text-xs font-medium" style={{ color: "#5BAD52" }}>
            {property.price.toLocaleString()}万円
          </span>
        </div>
      </div>
      <span className="text-[10px] text-gray-300 flex-shrink-0">{date}</span>
    </Link>
  );
}

// お知らせの1行
function NewsRow({ item }: { item: NewsItem }) {
  const date = new Date(item.publishedAt).toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  return (
    <Link
      href={`/news/${item.slug}`}
      className="flex items-start gap-3 py-3.5 hover:bg-white/60 transition-colors -mx-2 px-2 rounded group"
    >
      <Bell size={14} className="flex-shrink-0 mt-0.5 text-gray-400" />
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-700 group-hover:text-felia-green truncate leading-snug transition-colors">
          {item.title}
        </p>
        <span className="text-[10px] text-gray-300 mt-0.5 block">{item.category}</span>
      </div>
      <span className="text-[10px] text-gray-300 flex-shrink-0">{date}</span>
    </Link>
  );
}
```

---

## Step 5: components/home/OpenHouseAndInfoSection.tsx の作成

```typescript
// components/home/OpenHouseAndInfoSection.tsx
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Calendar, MapPin, Info } from "lucide-react";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { getOpenHouses, getNews } from "@/lib/api";
import type { OpenHouse, NewsItem } from "@/lib/api";

export async function OpenHouseAndInfoSection() {
  let openHouses: OpenHouse[] = [];
  let infoItems: NewsItem[] = [];

  try {
    [openHouses, infoItems] = await Promise.all([
      getOpenHouses(),
      getNews(5),
    ]);
  } catch {
    // Admin APIが未起動の場合はスキップ
  }

  return (
    <section className="section-padding bg-white">
      <div className="container-content">
        <div className="grid grid-cols-1 tb:grid-cols-2 gap-8 tb:gap-12">

          {/* 左: 現地販売会 */}
          <div>
            <div className="flex items-end justify-between mb-6">
              <div>
                <span
                  className="font-montserrat font-bold text-2xl tb:text-3xl tracking-wider"
                  style={{ color: "#5BAD52", fontFamily: "'Montserrat', sans-serif" }}
                >
                  Open House
                </span>
                <p className="text-xs text-gray-400 tracking-widest mt-1">現地販売会情報</p>
                <div className="mt-2 w-8 h-0.5" style={{ backgroundColor: "#5BAD52" }} />
              </div>
              <Link
                href="/open-houses"
                className="text-xs flex items-center gap-1 hover:gap-2 transition-all"
                style={{ color: "#5BAD52" }}
              >
                もっと見る <ArrowRight size={12} />
              </Link>
            </div>

            <div className="space-y-4">
              {openHouses.length === 0 ? (
                <p className="text-sm text-gray-400 py-4">現地販売会の予定はありません</p>
              ) : (
                openHouses.slice(0, 3).map((oh) => (
                  <OpenHouseCard key={oh.id} openHouse={oh} />
                ))
              )}
            </div>
          </div>

          {/* 右: お知らせ */}
          <div>
            <div className="flex items-end justify-between mb-6">
              <div>
                <span
                  className="font-montserrat font-bold text-2xl tb:text-3xl tracking-wider text-gray-700"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                >
                  Information
                </span>
                <p className="text-xs text-gray-400 tracking-widest mt-1">お知らせ</p>
                <div className="mt-2 w-8 h-0.5 bg-gray-300" />
              </div>
              <Link
                href="/news"
                className="text-xs flex items-center gap-1 hover:gap-2 transition-all"
                style={{ color: "#5BAD52" }}
              >
                もっと見る <ArrowRight size={12} />
              </Link>
            </div>

            <div className="space-y-0 divide-y" style={{ borderColor: "#E5E5E5" }}>
              {infoItems.length === 0 ? (
                <p className="text-sm text-gray-400 py-4">お知らせはありません</p>
              ) : (
                infoItems.map((item) => (
                  <InfoRow key={item.id} item={item} />
                ))
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

// 現地販売会カード
function OpenHouseCard({ openHouse }: { openHouse: OpenHouse }) {
  const dateObj = new Date(openHouse.date);
  const month = dateObj.getMonth() + 1;
  const day = dateObj.getDate();
  const weekdays = ["日", "月", "火", "水", "木", "金", "土"];
  const weekday = weekdays[dateObj.getDay()];

  return (
    <Link
      href={`/properties/${openHouse.propertyId}`}
      className="group flex gap-3 p-3 rounded-lg border hover:border-felia-green hover:shadow-sm transition-all"
      style={{ borderColor: "#E5E5E5" }}
    >
      {/* 日付ブロック */}
      <div
        className="flex-shrink-0 w-14 rounded flex flex-col items-center justify-center py-2"
        style={{ backgroundColor: "#EBF7EA" }}
      >
        <span className="font-montserrat font-bold text-xl leading-none" style={{ color: "#5BAD52" }}>
          {day}
        </span>
        <span className="text-[10px] text-gray-500 mt-0.5">
          {month}月（{weekday}）
        </span>
        <span className="text-[9px] text-gray-400 mt-0.5">
          {openHouse.startTime}〜
        </span>
      </div>

      {/* 物件情報 */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-700 group-hover:text-felia-green leading-snug truncate transition-colors">
          {openHouse.propertyName}
        </p>
        <div className="flex items-center gap-1 mt-1">
          <MapPin size={10} style={{ color: "#5BAD52" }} />
          <span className="text-xs text-gray-400 truncate">{openHouse.address}</span>
        </div>
        <div className="mt-1.5">
          <span
            className="text-[10px] font-medium px-2 py-0.5 rounded"
            style={{ backgroundColor: "#EBF7EA", color: "#5BAD52" }}
          >
            現地販売会
          </span>
        </div>
      </div>
    </Link>
  );
}

// お知らせ行
function InfoRow({ item }: { item: NewsItem }) {
  const date = new Date(item.publishedAt).toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  return (
    <Link
      href={`/news/${item.slug}`}
      className="flex items-start gap-3 py-3.5 hover:bg-gray-50 -mx-2 px-2 rounded group transition-colors"
    >
      <Info size={13} className="flex-shrink-0 mt-0.5" style={{ color: "#5BAD52" }} />
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-700 group-hover:text-felia-green truncate transition-colors">
          {item.title}
        </p>
        <span className="text-[10px] text-gray-300">{date}</span>
      </div>
    </Link>
  );
}
```

---

## Step 6: app/page.tsx を更新（全セクション組み込み）

```typescript
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
```

---

## Step 7: 動作確認

```bash
npm run dev
```

確認項目:
1. **PropertyCard**
   - 旧スタブが新実装に差し替わりビルドエラーがないこと
   - バッジ（NEW/厳選/現地販売会/会員限定）が表示される

2. **Felia Selection**
   - Admin APIが起動していない場合「厳選物件は準備中です」が表示される
   - Admin APIが起動している場合、物件カード（large サイズ）が2枚表示される
   - 3件以上あれば ← → ボタンが現れ、次の2件に切り替わる

3. **NEW / News**
   - APIなしの場合「新着物件はありません」「お知らせはありません」が表示される
   - 2カラム均等で左右対称に表示される

4. **OpenHouse / Information**
   - 現地販売会カードに「日付ブロック（緑背景）＋物件名＋住所」が表示される

5. `npm run build` エラーなし

---

## 完了条件チェックリスト

- [ ] `components/property/PropertyCard.tsx` が本実装に差し替わっている
- [ ] `components/home/FeliaSectionSelection.tsx` 作成済み（Server Component）
- [ ] `components/home/FeaturedSlider.tsx` 作成済み（Client Component）
- [ ] `components/home/NewAndNewsSection.tsx` 作成済み（Server Component）
- [ ] `components/home/OpenHouseAndInfoSection.tsx` 作成済み（Server Component）
- [ ] `app/page.tsx` に全セクション組み込み済み
- [ ] Admin API 未起動時にエラーでなく「準備中」表示になる
- [ ] `npm run build` エラーなし

---

## 次の指示文

`06_バナーセクション・Accessセクション・トップページ完成.md`
