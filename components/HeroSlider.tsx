"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

const SLIDES = [
  {
    image: "https://felia-home.co.jp/assets/images/top/kv_01.jpg?240806",
    ja: "厳選物件情報",
    sub: "フェリアホームが厳選してオススメする最優良物件をご紹介",
    en: "Felia  Selection",
  },
  {
    image: "https://felia-home.co.jp/assets/images/top/kv_02.jpg?240806",
    ja: "フェリアホーム千駄ヶ谷本店",
    sub: "東京都心の新着物件をご紹介",
    en: "Sendagaya head office",
  },
  {
    image: "https://felia-home.co.jp/assets/images/top/kv_03.jpg?240806",
    ja: "買い替えについて",
    sub: "物件の買い替えをお考えの方へ",
    en: "Replacement",
  },
  {
    image: "https://felia-home.co.jp/assets/images/top/kv_04.jpg?240806",
    ja: "未公開物件多数掲載",
    sub: "会員登録で全物件をご覧いただけます",
    en: "Exclusive listings for members",
  },
  {
    image: "https://felia-home.co.jp/assets/images/top/kv_05.jpg?240806",
    ja: "城南・城西エリア専門",
    sub: "目黒・世田谷・渋谷・港区に特化",
    en: "Premium real estate in Tokyo",
  },
  {
    image: "https://felia-home.co.jp/assets/images/top/kv_06.jpg",
    ja: "フェリアホーム",
    sub: "東京都心・城南・城西の不動産",
    en: "Felia Home",
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

  return (
    <div className="relative w-full overflow-hidden" style={{ height: "calc(100vh - 70px)" }}>
      {/* スライド */}
      {SLIDES.map((slide, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            i === current ? "opacity-100" : "opacity-0"
          }`}
        >
          {/* 背景画像 */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={slide.image}
            alt={slide.ja}
            className="w-full h-full object-cover"
          />

          {/* グリーンオーバーレイ + 上下波形マスク */}
          <div className="absolute inset-0" style={{ background: "rgba(91,173,82,0.35)" }}>
            {/* 上部の白波形 */}
            <svg
              className="absolute top-0 w-full"
              viewBox="0 0 1440 100"
              preserveAspectRatio="none"
              style={{ height: "100px" }}
            >
              <path d="M0,0 L1440,0 L1440,40 C1080,100 360,0 0,60 Z" fill="white" />
            </svg>
            {/* 下部の白波形 */}
            <svg
              className="absolute bottom-0 w-full"
              viewBox="0 0 1440 100"
              preserveAspectRatio="none"
              style={{ height: "100px" }}
            >
              <path d="M0,60 C360,0 1080,100 1440,40 L1440,100 L0,100 Z" fill="white" />
            </svg>
          </div>

          {/* キャプションテキスト（左下） */}
          <div className="absolute bottom-28 left-8 right-64 z-10">
            <p className="text-white text-sm mb-2 tracking-wider">
              {slide.ja}　{slide.sub}
            </p>
            <p
              className="text-white text-4xl md:text-6xl"
              style={{
                fontFamily: "'Dancing Script', 'Playfair Display', cursive",
                fontWeight: 400,
                lineHeight: 1.2,
              }}
            >
              {slide.en}
            </p>
          </div>
        </div>
      ))}

      {/* view more リンク（右下・スライダー内） */}
      <Link
        href="/properties"
        className="absolute bottom-32 right-8 text-white text-sm italic tracking-wider flex items-center gap-2 z-20"
      >
        view more ▶
      </Link>

      {/* 会員登録バナー（右下） */}
      <div
        className="absolute bottom-0 right-0 text-white p-6 w-72 z-20"
        style={{ background: "#1a3a2a" }}
      >
        <div className="text-center mb-3">
          <div className="text-sm tracking-[0.3em] mb-1">無 料 会 員 登 録</div>
          <div className="text-xs italic text-gray-300 mb-2">Sign up to become a member</div>
          <div className="text-xs text-gray-400 leading-relaxed mb-3">
            未公開物件６，０００件以上公開中<br />
            豊富な情報を取り揃えております
          </div>
          <div className="w-8 h-px bg-[#c9a96e] mx-auto mb-3" />
          <Link
            href="/register"
            className="block border border-[#c9a96e] text-[#c9a96e] text-sm py-2.5 px-4 hover:bg-[#c9a96e] hover:text-white transition-colors tracking-[0.15em]"
          >
            登 録 は こ ち ら か ら ▶
          </Link>
        </div>
        <div className="text-right mt-3">
          <span className="text-xs text-gray-500">fh felia home</span>
        </div>
      </div>

      {/* ドットインジケーター */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-20">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-3 h-3 rounded-full transition-colors ${
              i === current ? "bg-[#5BAD52]" : "bg-white/60"
            }`}
            aria-label={`スライド${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
