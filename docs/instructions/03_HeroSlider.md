# 指示文 03 — HeroSlider（トップページスライダー）

## 概要

トップページ最上部に表示するフルワイドの画像スライダーを実装する。
外部ライブラリは使わずReact + CSS で実装する（軽量・カスタマイズ性重視）。

**作業ディレクトリ**: `C:\Users\User\projects\felia-home-web`

---

## 仕様

| 項目 | 内容 |
|------|------|
| 切替間隔 | 3秒（自動再生） |
| トランジション | フェード（クロスフェード） |
| 操作 | 左右矢印ボタン・ドットインジケーター |
| SP対応 | アスペクト比を変更（PC: 16:5、SP: 4:3） |
| 画像なし時 | グリーングラデーションのプレースホルダー表示 |
| キャプション | スライドごとにキャッチコピー・サブテキスト・ボタンを設定可能 |

---

## Step 1: プレースホルダー画像の配置確認

`public/hero/` フォルダに画像があれば使用する。
**なければ Step 2 のグラデーション背景でそのまま進める**（Atsushi が後で画像を追加する）。

画像命名規則:
```
public/hero/slide-01.jpg
public/hero/slide-02.jpg
public/hero/slide-03.jpg
...（最大6枚）
```

---

## Step 2: スライドデータ定義ファイルの作成

```typescript
// lib/heroSlides.ts

export interface HeroSlide {
  id: number;
  image: string | null;       // null の場合はグラデーション表示
  gradient?: string;          // image が null の場合に使用
  catchCopy: string;
  subCopy: string;
  buttonLabel?: string;
  buttonHref?: string;
}

// 画像が揃ったら image パスを差し替える
// 画像が不要なスライドは image: null のまま gradient を使用
export const heroSlides: HeroSlide[] = [
  {
    id: 1,
    image: null,
    gradient: "linear-gradient(135deg, #1a3a2a 0%, #2d5a3d 40%, #5BAD52 100%)",
    catchCopy: "理想の住まいと、\n出会う場所。",
    subCopy: "東京の不動産売買はフェリアホームへ",
    buttonLabel: "物件を探す",
    buttonHref: "/search",
  },
  {
    id: 2,
    image: null,
    gradient: "linear-gradient(135deg, #1a2a3a 0%, #2d3d5a 40%, #4a6fa5 100%)",
    catchCopy: "あなたの大切な資産を、\n正直に査定します。",
    subCopy: "売却をお考えの方、まずは無料査定から",
    buttonLabel: "無料査定を依頼する",
    buttonHref: "/sell/valuation",
  },
  {
    id: 3,
    image: null,
    gradient: "linear-gradient(135deg, #2a1a1a 0%, #5a2d2d 40%, #a54a4a 100%)",
    catchCopy: "会員登録で、\n未公開物件が見られます。",
    subCopy: "厳選された非公開物件を会員限定でご紹介",
    buttonLabel: "無料会員登録",
    buttonHref: "/members/register",
  },
];
```

---

## Step 3: components/home/HeroSlider.tsx の作成

```typescript
// components/home/HeroSlider.tsx
"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { heroSlides, type HeroSlide } from "@/lib/heroSlides";

export function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const total = heroSlides.length;

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

  // 自動再生
  useEffect(() => {
    timerRef.current = setInterval(next, 3000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [next]);

  // 手動操作時はタイマーをリセット
  const handleManual = (fn: () => void) => {
    if (timerRef.current) clearInterval(timerRef.current);
    fn();
    timerRef.current = setInterval(next, 3000);
  };

  return (
    <section className="relative w-full overflow-hidden bg-gray-900">
      {/* スライド本体 */}
      <div
        className="relative w-full"
        style={{
          // PC: 16:5 / SP: 4:3
          paddingBottom: "clamp(75%, calc(75% - (75% - 31.25%) * ((100vw - 375px) / (1200px - 375px))), 31.25%)",
        }}
      >
        {heroSlides.map((slide, index) => (
          <SlideItem
            key={slide.id}
            slide={slide}
            isActive={index === current}
          />
        ))}
      </div>

      {/* 左矢印 */}
      <button
        onClick={() => handleManual(prev)}
        className="absolute left-3 tb:left-6 top-1/2 -translate-y-1/2 z-20
                   w-9 h-9 tb:w-11 tb:h-11 rounded-full bg-white/20 hover:bg-white/40
                   backdrop-blur-sm flex items-center justify-center
                   transition-colors duration-200"
        aria-label="前のスライド"
      >
        <ChevronLeft size={20} className="text-white" strokeWidth={2} />
      </button>

      {/* 右矢印 */}
      <button
        onClick={() => handleManual(next)}
        className="absolute right-3 tb:right-6 top-1/2 -translate-y-1/2 z-20
                   w-9 h-9 tb:w-11 tb:h-11 rounded-full bg-white/20 hover:bg-white/40
                   backdrop-blur-sm flex items-center justify-center
                   transition-colors duration-200"
        aria-label="次のスライド"
      >
        <ChevronRight size={20} className="text-white" strokeWidth={2} />
      </button>

      {/* ドットインジケーター */}
      <div className="absolute bottom-4 tb:bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {heroSlides.map((_, index) => (
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
    </section>
  );
}

// 各スライドのレンダリング
function SlideItem({
  slide,
  isActive,
}: {
  slide: HeroSlide;
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
          priority={true}
          sizes="100vw"
        />
      ) : (
        <div
          className="absolute inset-0"
          style={{ background: slide.gradient }}
        />
      )}

      {/* オーバーレイ（テキストの視認性向上） */}
      <div className="absolute inset-0 bg-black/30" />

      {/* キャプション */}
      {(slide.catchCopy || slide.subCopy) && (
        <div className="absolute inset-0 flex items-center z-10">
          <div className="container-content">
            <div
              className="max-w-lg"
              style={{
                opacity: isActive ? 1 : 0,
                transform: isActive ? "translateY(0)" : "translateY(16px)",
                transition: "opacity 0.8s ease 0.2s, transform 0.8s ease 0.2s",
              }}
            >
              {/* キャッチコピー */}
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

## Step 4: app/page.tsx を更新して HeroSlider を組み込む

```typescript
// app/page.tsx
import { HeroSlider } from "@/components/home/HeroSlider";

export default function HomePage() {
  return (
    <main className="bg-white">
      <HeroSlider />

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

## Step 5: 動作確認

```bash
npm run dev
```

確認項目:
1. トップページでスライダーが表示される
2. 3秒ごとにフェードで切り替わる
3. 左右矢印で手動切り替えができる
4. ドットインジケーターが現在のスライドに合わせてアニメーションする
5. PCで画面幅いっぱいに表示される（縦横比: 16:5）
6. SP（375px）では縦横比が 4:3 に近くなっている
7. コンソールエラーがないこと

---

## 完了後：Atsushiへのメモ

画像が用意できたら以下の手順で差し替え:

1. `public/hero/` に `slide-01.jpg`〜`slide-06.jpg` を配置
2. `lib/heroSlides.ts` の `image: null` を `image: "/hero/slide-01.jpg"` に変更
3. `gradient` の行は削除してOK
4. 推奨画像サイズ: **1920 × 600px**（PC）、JPEG圧縮率 80% 以下

---

## 完了条件チェックリスト

- [ ] `lib/heroSlides.ts` 作成済み
- [ ] `components/home/HeroSlider.tsx` 作成済み
- [ ] `app/page.tsx` に `<HeroSlider />` が組み込まれている
- [ ] 3秒自動再生が動作する
- [ ] 矢印・ドット操作が動作する
- [ ] SP・PC それぞれで縦横比が正しい
- [ ] `npm run build` エラーなし

---

## 次の指示文

`04_Recommend・SearchセクションとSVGマップ.md`
