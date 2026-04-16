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
    <section
      style={{
        position: "relative",
        width: "100%",
        height: "clamp(300px, 56vw, 650px)",
        overflow: "hidden",
        backgroundColor: "#1a1a1a",
      }}
    >
      {/* スライド群 */}
      {slides.map((slide, index) => (
        <SlideItem
          key={slide.id}
          slide={slide}
          isActive={index === current}
          isPriority={index === 0}
        />
      ))}

      {/* 左矢印 */}
      {total > 1 && (
        <button
          onClick={() => handleManual(prev)}
          style={{
            position: "absolute",
            left: "12px",
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 20,
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            backgroundColor: "rgba(255,255,255,0.2)",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          aria-label="前のスライド"
        >
          <ChevronLeft size={20} color="white" strokeWidth={2} />
        </button>
      )}

      {/* 右矢印 */}
      {total > 1 && (
        <button
          onClick={() => handleManual(next)}
          style={{
            position: "absolute",
            right: "12px",
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 20,
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            backgroundColor: "rgba(255,255,255,0.2)",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          aria-label="次のスライド"
        >
          <ChevronRight size={20} color="white" strokeWidth={2} />
        </button>
      )}

      {/* ドットインジケーター */}
      {total > 1 && (
        <div
          style={{
            position: "absolute",
            bottom: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 20,
            display: "flex",
            gap: "8px",
          }}
        >
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => handleManual(() => goTo(index))}
              style={{
                width: index === current ? "24px" : "8px",
                height: "8px",
                borderRadius: "4px",
                border: "none",
                cursor: "pointer",
                backgroundColor:
                  index === current ? "#5BAD52" : "rgba(255,255,255,0.5)",
                transition: "all 0.3s ease",
                padding: 0,
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
  isPriority,
}: {
  slide: SlideData;
  isActive: boolean;
  isPriority: boolean;
}) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        opacity: isActive ? 1 : 0,
        transition: "opacity 0.7s ease",
      }}
    >
      {/* 背景（画像 or グラデーション） */}
      {slide.image ? (
        <Image
          src={slide.image}
          alt={slide.catchCopy.replace("\n", " ")}
          fill
          quality={100}
          style={{ objectFit: "cover", objectPosition: "center" }}
          priority={isPriority}
          sizes="100vw"
        />
      ) : (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: slide.gradient ?? "#1a1a1a",
          }}
        />
      )}

      {/* 画像全体リンク（link_url がある場合） */}
      {slide.buttonHref && (
        <Link
          href={slide.buttonHref}
          target={slide.linkTarget === "_blank" ? "_blank" : undefined}
          rel={slide.linkTarget === "_blank" ? "noopener noreferrer" : undefined}
          style={{ position: "absolute", inset: 0, zIndex: 5 }}
          aria-label={slide.catchCopy || "バナーリンク"}
        />
      )}

      {/* キャプション */}
      {(slide.catchCopy || slide.subCopy) && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            zIndex: 10,
            backgroundColor: "transparent",
          }}
        >
          <div className="container-content">
            <div
              style={{
                maxWidth: "512px",
                backgroundColor: "transparent",
                opacity: isActive ? 1 : 0,
                transform: isActive ? "translateY(0)" : "translateY(16px)",
                transition: "opacity 0.8s ease 0.2s, transform 0.8s ease 0.2s",
              }}
            >
              {slide.catchCopy && (
                <h1
                  style={{
                    color: "#fff",
                    fontFamily: "'Noto Sans JP', sans-serif",
                    fontSize: "clamp(22px, 3.5vw, 44px)",
                    fontWeight: "bold",
                    lineHeight: 1.3,
                    marginBottom: "12px",
                    textShadow: "0 1px 4px rgba(0,0,0,0.6)",
                    whiteSpace: "pre-line",
                  }}
                >
                  {slide.catchCopy}
                </h1>
              )}

              {slide.subCopy && (
                <p
                  style={{
                    color: "#fff",
                    fontSize: "clamp(13px, 1.5vw, 17px)",
                    marginBottom: "24px",
                    textShadow: "0 1px 4px rgba(0,0,0,0.6)",
                  }}
                >
                  {slide.subCopy}
                </p>
              )}

              {slide.buttonLabel && slide.buttonHref && (
                <Link
                  href={slide.buttonHref}
                  target={slide.linkTarget === "_blank" ? "_blank" : undefined}
                  rel={
                    slide.linkTarget === "_blank"
                      ? "noopener noreferrer"
                      : undefined
                  }
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "12px 24px",
                    borderRadius: "6px",
                    fontSize: "14px",
                    fontWeight: "bold",
                    color: "white",
                    backgroundColor: "#5BAD52",
                    boxShadow: "0 4px 12px rgba(91,173,82,0.4)",
                    textDecoration: "none",
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
