"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

const SLIDES = [
  {
    title: "フェリアホーム千駄ヶ谷本店",
    subtitle: "東京都心の新着物件をご紹介",
    en: "Sendagaya head office",
    bg: "linear-gradient(135deg, #1a3a25 0%, #2d5a3d 50%, #1a3a25 100%)",
  },
  {
    title: "城南・城西エリア専門",
    subtitle: "目黒・世田谷・渋谷・港区に特化",
    en: "Premium real estate in Tokyo",
    bg: "linear-gradient(135deg, #1a2a3a 0%, #2d3d5a 50%, #1a2a3a 100%)",
  },
  {
    title: "未公開物件多数掲載",
    subtitle: "会員登録で全物件をご覧いただけます",
    en: "Exclusive listings for members",
    bg: "linear-gradient(135deg, #2a1a1a 0%, #5a2d2d 50%, #2a1a1a 100%)",
  },
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const slide = SLIDES[current];

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{ height: "calc(100vh - 70px)" }}
    >
      {/* スライド背景（画像がないため、グラデーション） */}
      {SLIDES.map((s, i) => (
        <div
          key={i}
          className="absolute inset-0 transition-opacity duration-1000"
          style={{
            background: s.bg,
            opacity: i === current ? 1 : 0,
          }}
        />
      ))}

      {/* 波形グリーンオーバーレイ */}
      <div className="absolute bottom-0 left-0 right-0 z-10">
        <svg
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
          className="w-full"
          style={{ height: "120px" }}
        >
          <path
            d="M0,60 C360,120 1080,0 1440,60 L1440,120 L0,120 Z"
            fill="rgba(91,173,82,0.35)"
          />
        </svg>
      </div>

      {/* スライドテキスト */}
      <div className="absolute inset-0 flex flex-col justify-end z-20 pb-36 px-8 lg:px-16">
        <p className="text-white/60 text-sm mb-1">
          {slide.title}　{slide.subtitle}
        </p>
        <p
          className="text-white text-4xl lg:text-6xl font-light italic"
          style={{ fontFamily: "'Dancing Script', cursive, sans-serif", letterSpacing: "0.02em" }}
        >
          {slide.en}
        </p>
      </div>

      {/* 会員登録バナー（右下） */}
      <div
        className="absolute bottom-8 right-8 z-30 text-white p-6 w-64"
        style={{ background: "#1a3a2a" }}
      >
        <div className="text-xs tracking-widest mb-1 text-center">無 料 会 員 登 録</div>
        <div className="text-xs text-center italic mb-1 text-white/60">
          Sign up to become a member
        </div>
        <div className="text-xs text-center text-white/50 mb-3 leading-relaxed">
          未公開物件多数公開中<br />
          豊富な情報を取り揃えております
        </div>
        <div className="w-6 h-px bg-[#c9a96e] mx-auto mb-3" />
        <Link
          href="/register"
          className="block text-center border border-[#c9a96e] text-[#c9a96e] text-xs py-2 hover:bg-[#c9a96e] hover:text-white transition-colors tracking-widest"
        >
          登 録 は こ ち ら ▶
        </Link>
      </div>

      {/* ドットインジケーター */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-30">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className="w-3 h-3 rounded-full transition-colors"
            style={{ background: i === current ? "#5BAD52" : "rgba(255,255,255,0.4)" }}
            aria-label={`スライド${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
