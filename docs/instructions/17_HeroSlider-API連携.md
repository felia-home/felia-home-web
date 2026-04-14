# 指示文 17 — HeroSlider API連携 + FullWidthBannerSection

## 概要

1. **HeroSlider** を Admin API `/api/hp/hero-banners` と連携する
2. **FullWidthBannerSection** を新規作成して MemberBannerSection と差し替える

**作業ディレクトリ**: `C:\Users\User\projects\felia-home-web`

---

## 絶対ルール
1. `prisma db push` 絶対禁止（customers_email_key競合）
2. スキーマ変更は手動SQL + `npx prisma generate` のみ
3. VPS・DBへの直接操作禁止
4. Tailwind CSS禁止・全インラインスタイル
5. デプロイ（git pull / pm2 restart）はAtsushiが手動実施

---

## 確認済みのAPI仕様

```
GET /api/hp/hero-banners
レスポンス: {
  "banners": [
    {
      "id": string,
      "title": string,
      "image_url": string,
      "link_url": string | null,
      "link_target": "_self" | "_blank",
      "sort_order": number
    }
  ]
}
```

---

## Step 1: lib/api.ts に HeroBanner 型と取得関数を追加

```typescript
// lib/api.ts への追記

export interface HeroBanner {
  id: string;
  title: string;
  image_url: string;
  link_url: string | null;
  link_target: "_self" | "_blank";
  sort_order: number;
}

export async function getHeroBanners(): Promise<HeroBanner[]> {
  try {
    const res = await fetchFromAdmin<{ banners: HeroBanner[] }>(
      "/api/hp/hero-banners",
      { next: { revalidate: 60 } }
    );
    return res.banners ?? [];
  } catch {
    return [];
  }
}
```

---

## Step 2: components/home/HeroSlider.tsx を更新

Server Component でAPIからバナーを取得し、
バナーありの場合はAPIデータで表示、
バナーなし（0件）の場合は `lib/heroSlides.ts` のデフォルトにフォールバックする。

`components/home/HeroSlider.tsx` を以下の内容で**全面置き換え**する：

```typescript
// components/home/HeroSlider.tsx
import { getHeroBanners } from "@/lib/api";
import { heroSlides } from "@/lib/heroSlides";
import { HeroSliderClient } from "./HeroSliderClient";

// Server Component: データ取得
export async function HeroSlider() {
  const apiBanners = await getHeroBanners();

  if (apiBanners.length > 0) {
    // API データをスライド形式に変換
    const slides = apiBanners
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((banner) => ({
        id: banner.id,
        image: banner.image_url,
        gradient: undefined,
        catchCopy: banner.title,
        subCopy: "",
        buttonLabel: undefined as string | undefined,
        buttonHref: banner.link_url ?? undefined,
        linkTarget: banner.link_target,
      }));
    return <HeroSliderClient slides={slides} />;
  }

  // フォールバック: デフォルトスライド
  const defaultSlides = heroSlides.map((s) => ({
    id: String(s.id),
    image: s.image,
    gradient: s.gradient,
    catchCopy: s.catchCopy,
    subCopy: s.subCopy,
    buttonLabel: s.buttonLabel,
    buttonHref: s.buttonHref,
    linkTarget: "_self" as const,
  }));
  return <HeroSliderClient slides={defaultSlides} />;
}
```

---

## Step 3: components/home/HeroSliderClient.tsx を新規作成

既存の HeroSlider のクライアント部分をこのファイルに移動する。

```typescript
// components/home/HeroSliderClient.tsx
"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface SlideData {
  id: string;
  image: string | null;
  gradient?: string;
  catchCopy: string;
  subCopy?: string;
  buttonLabel?: string;
  buttonHref?: string;
  linkTarget?: "_self" | "_blank";
}

interface HeroSliderClientProps {
  slides: SlideData[];
}

export function HeroSliderClient({ slides }: HeroSliderClientProps) {
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const total = slides.length;

  const goTo = useCallback(
    (index: number) => {
      if (isTransitioning) return;
      setIsTransitioning(true);
      setCurrent((index + total) % total);
      setTimeout(() => setIsTransitioning(false), 600);
    },
    [isTransitioning, total]
  );

  const next = useCallback(() => goTo(current + 1), [current, goTo]);
  const prev = useCallback(() => goTo(current - 1), [current, goTo]);

  useEffect(() => {
    timerRef.current = setInterval(next, 3000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [next]);

  const handleManual = (fn: () => void) => {
    if (timerRef.current) clearInterval(timerRef.current);
    fn();
    timerRef.current = setInterval(next, 3000);
  };

  if (total === 0) return null;

  return (
    <section className="relative w-full overflow-hidden bg-gray-900">
      {/* スライド本体 */}
      <div
        style={{
          position: "relative",
          width: "100%",
          paddingBottom: "clamp(75%, calc(75% - (75% - 31.25%) * ((100vw - 375px) / (1200px - 375px))), 31.25%)",
        }}
      >
        {slides.map((slide, index) => (
          <SlideItem
            key={slide.id}
            slide={slide}
            isActive={index === current}
          />
        ))}
      </div>

      {/* 左矢印 */}
      {total > 1 && (
        <button
          onClick={() => handleManual(prev)}
          className="absolute left-3 tb:left-6 top-1/2 -translate-y-1/2 z-20
                     w-9 h-9 tb:w-11 tb:h-11 rounded-full bg-white/20 hover:bg-white/40
                     backdrop-blur-sm flex items-center justify-center transition-colors duration-200"
          aria-label="前のスライド"
        >
          <ChevronLeft size={20} className="text-white" strokeWidth={2} />
        </button>
      )}

      {/* 右矢印 */}
      {total > 1 && (
        <button
          onClick={() => handleManual(next)}
          className="absolute right-3 tb:right-6 top-1/2 -translate-y-1/2 z-20
                     w-9 h-9 tb:w-11 tb:h-11 rounded-full bg-white/20 hover:bg-white/40
                     backdrop-blur-sm flex items-center justify-center transition-colors duration-200"
          aria-label="次のスライド"
        >
          <ChevronRight size={20} className="text-white" strokeWidth={2} />
        </button>
      )}

      {/* ドットインジケーター */}
      {total > 1 && (
        <div className="absolute bottom-4 tb:bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => handleManual(() => goTo(index))}
              className="transition-all duration-300 rounded-full"
              style={{
                width: index === current ? "24px" : "8px",
                height: "8px",
                backgroundColor:
                  index === current ? "#5BAD52" : "rgba(255,255,255,0.5)",
              }}
              aria-label={`スライド ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}

// 各スライドのレンダリング
function SlideItem({
  slide,
  isActive,
}: {
  slide: SlideData;
  isActive: boolean;
}) {
  return (
    <div
      className="absolute inset-0 transition-opacity duration-700"
      style={{ opacity: isActive ? 1 : 0 }}
    >
      {/* 背景（画像 or グラデーション） */}
      {slide.image ? (
        <Image
          src={slide.image}
          alt={slide.catchCopy.replace("\n", " ")}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
      ) : (
        <div
          className="absolute inset-0"
          style={{ background: slide.gradient }}
        />
      )}

      {/* オーバーレイ */}
      <div className="absolute inset-0 bg-black/30" />

      {/* キャプション（catchCopy または subCopy がある場合のみ表示） */}
      {(slide.catchCopy || slide.subCopy) && (
        <div className="absolute inset-0 flex items-center z-10">
          <div className="container-content">
            <div
              style={{
                maxWidth: "512px",
                opacity: isActive ? 1 : 0,
                transform: isActive ? "translateY(0)" : "translateY(16px)",
                transition: "opacity 0.8s ease 0.2s, transform 0.8s ease 0.2s",
              }}
            >
              {/* キャッチコピー */}
              {slide.catchCopy && (
                <h1
                  className="text-white font-bold leading-tight mb-3"
                  style={{
                    fontFamily: "'Noto Sans JP', sans-serif",
                    fontSize: "clamp(22px, 3.5vw, 44px)",
                    textShadow: "0 2px 8px rgba(0,0,0,0.4)",
                    whiteSpace: "pre-line",
                  }}
                >
                  {slide.catchCopy}
                </h1>
              )}

              {/* サブコピー */}
              {slide.subCopy && (
                <p
                  className="text-white/85 mb-6"
                  style={{
                    fontSize: "clamp(13px, 1.5vw, 17px)",
                    textShadow: "0 1px 4px rgba(0,0,0,0.4)",
                  }}
                >
                  {slide.subCopy}
                </p>
              )}

              {/* ボタン */}
              {slide.buttonLabel && slide.buttonHref && (
                <Link
                  href={slide.buttonHref}
                  target={slide.linkTarget === "_blank" ? "_blank" : undefined}
                  rel={slide.linkTarget === "_blank" ? "noopener noreferrer" : undefined}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded text-sm font-bold text-white transition-all duration-200 hover:scale-105"
                  style={{
                    backgroundColor: "#5BAD52",
                    boxShadow: "0 4px 12px rgba(91,173,82,0.4)",
                  }}
                >
                  {slide.buttonLabel}
                  <ChevronRight size={16} />
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
```

---

## Step 4: components/home/FullWidthBannerSection.tsx を新規作成

MemberBannerSection の代わりに使うフルワイド画像バナーセクション。

```typescript
// components/home/FullWidthBannerSection.tsx
import Image from "next/image";
import Link from "next/link";
import { getBanners } from "@/lib/api";
import type { Banner } from "@/lib/api";

export async function FullWidthBannerSection() {
  let banners: Banner[] = [];
  try {
    banners = await getBanners();
  } catch {}

  if (banners.length === 0) return null;

  return (
    <section>
      {banners.map((banner) => (
        <FullWidthBanner key={banner.id} banner={banner} />
      ))}
    </section>
  );
}

function FullWidthBanner({ banner }: { banner: Banner }) {
  const inner = (
    <div className="relative w-full overflow-hidden" style={{ display: "block" }}>
      <Image
        src={banner.image}
        alt={banner.alt || "バナー"}
        width={1920}
        height={400}
        className="w-full h-auto"
        style={{ display: "block" }}
      />
    </div>
  );

  if (!banner.href) return inner;

  return (
    <Link
      href={banner.href}
      target={banner.alt === "_blank" ? "_blank" : undefined}
      rel={banner.alt === "_blank" ? "noopener noreferrer" : undefined}
    >
      {inner}
    </Link>
  );
}
```

---

## Step 5: app/page.tsx を更新

```typescript
// 変更1: import を差し替え
// 削除: import { MemberBannerSection } from "@/components/home/MemberBannerSection";
// 追加: import { FullWidthBannerSection } from "@/components/home/FullWidthBannerSection";

// 変更2: JSX を差し替え
// 削除: <MemberBannerSection />
// 追加: <FullWidthBannerSection />
```

---

## Step 6: next.config.mjs に Cloudflare R2 ドメインを追加

API レスポンスに `r2.dev` の画像 URL が含まれているため、
`next.config.mjs` の `images.remotePatterns` に追加する。

```javascript
// next.config.mjs への追記（images.remotePatterns に追加）
{
  protocol: "https",
  hostname: "pub-893cf744fd3d496f9ceeeedf86b3c3dc.r2.dev",
},
{
  protocol: "https",
  hostname: "*.r2.dev",
},
```

---

## Step 7: 動作確認

```bash
npm run dev
```

確認項目:
- [ ] `http://localhost:3000` でHeroSliderが表示される
- [ ] admin で登録したバナー画像がスライダーに表示される
- [ ] 3秒で自動切り替えされる
- [ ] バナーが0件の場合、デフォルトスライド（`lib/heroSlides.ts`）が表示される
- [ ] `link_url` があるバナーをクリックするとリンク先に遷移する
- [ ] MemberBannerSection が消えていること
- [ ] FullWidthBannerSection の位置（SearchSection の上）にバナーが表示される
- [ ] `npm run build` エラーなし

---

## 完了条件チェックリスト

- [ ] `lib/api.ts` に `HeroBanner` 型・`getHeroBanners()` 追加
- [ ] `components/home/HeroSlider.tsx` Server Component に更新
- [ ] `components/home/HeroSliderClient.tsx` 新規作成
- [ ] `components/home/FullWidthBannerSection.tsx` 新規作成
- [ ] `app/page.tsx` MemberBannerSection → FullWidthBannerSection に差し替え
- [ ] `next.config.mjs` に r2.dev ドメイン追加
- [ ] `npm run build` エラーなし

---

## 次の指示文

`18_SEOAgent実装.md`
