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
