"use client";
import { useState, useEffect } from "react";
import Image from "next/image";

const IMAGES = [
  "/images/lp/houseA.png",
  "/images/lp/houseB.png",
  "/images/lp/houseC.png",
];

const C = {
  accent: "#2d5e4a",
  white: "#ffffff",
};

export default function HeroSection() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(i => (i + 1) % IMAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section style={{
      position: "relative",
      minHeight: "600px",
      overflow: "hidden",
      display: "flex",
      alignItems: "center",
    }}>
      {/* 背景画像（スライドショー） */}
      {IMAGES.map((src, i) => (
        <div
          key={src}
          style={{
            position: "absolute",
            inset: 0,
            opacity: i === current ? 1 : 0,
            transition: "opacity 1.5s ease",
            zIndex: 0,
          }}
        >
          <Image
            src={src}
            alt="高級物件イメージ"
            fill
            quality={90}
            style={{ objectFit: "cover", objectPosition: "center" }}
            sizes="100vw"
            priority={i === 0}
          />
        </div>
      ))}

      {/* 暗いオーバーレイ */}
      <div style={{
        position: "absolute",
        inset: 0,
        background: "linear-gradient(120deg, rgba(13,34,24,0.82) 0%, rgba(45,94,74,0.65) 60%, rgba(13,34,24,0.4) 100%)",
        zIndex: 1,
      }} />

      {/* コンテンツ */}
      <div style={{
        position: "relative",
        zIndex: 2,
        maxWidth: "900px",
        margin: "0 auto",
        padding: "100px 24px 80px",
        color: C.white,
        width: "100%",
      }}>
        {/* ブランド */}
        <div style={{ marginBottom: "40px" }}>
          <span style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: "18px",
            fontWeight: "300",
            letterSpacing: "0.1em",
            opacity: 0.9,
          }}>
            Felia <strong style={{ fontWeight: "700" }}>Home</strong>
          </span>
        </div>

        {/* キャッチコピー */}
        <h1 style={{
          fontFamily: "'Noto Serif JP', serif",
          fontSize: "clamp(30px, 5vw, 56px)",
          fontWeight: "600",
          lineHeight: 1.3,
          margin: "0 0 24px",
          letterSpacing: "0.02em",
          textShadow: "0 2px 20px rgba(0,0,0,0.3)",
        }}>
          市場に出る前の<br />
          物件情報を、会員様へ。
        </h1>

        <p style={{
          fontSize: "clamp(14px, 2vw, 17px)",
          lineHeight: 1.9,
          opacity: 0.85,
          margin: "0 0 56px",
          maxWidth: "520px",
          textShadow: "0 1px 8px rgba(0,0,0,0.3)",
        }}>
          フェリアホームの会員登録で、一般には公開されない
          非公開物件・未公開物件へアクセスできます。
          登録は無料、いつでも退会可能です。
        </p>

        {/* 統計 */}
        <div style={{
          display: "flex",
          gap: "48px",
          flexWrap: "wrap",
          marginBottom: "56px",
          padding: "24px 0",
          borderTop: "1px solid rgba(255,255,255,0.2)",
          borderBottom: "1px solid rgba(255,255,255,0.2)",
        }}>
          {[
            { num: "100", unit: "件+", label: "非公開物件数" },
            { num: "60", unit: "秒", label: "登録所要時間" },
            { num: "0", unit: "円", label: "会員費用" },
            { num: "18", unit: "区", label: "対応エリア" },
          ].map((s) => (
            <div key={s.label}>
              <div style={{
                fontFamily: "'Montserrat', sans-serif",
                fontSize: "clamp(28px, 4vw, 44px)",
                fontWeight: "700",
                lineHeight: 1,
                marginBottom: "4px",
              }}>
                {s.num}
                <span style={{ fontSize: "0.5em", opacity: 0.8 }}>{s.unit}</span>
              </div>
              <div style={{ fontSize: "12px", opacity: 0.6, letterSpacing: "0.05em" }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* CTAボタン */}
        <div style={{ display: "flex", gap: "16px", alignItems: "center", flexWrap: "wrap" }}>
          <a
            href="#register"
            style={{
              display: "inline-block",
              padding: "18px 48px",
              backgroundColor: C.white,
              color: C.accent,
              borderRadius: "4px",
              textDecoration: "none",
              fontWeight: "bold",
              fontSize: "16px",
              letterSpacing: "0.05em",
              boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
              transition: "transform 0.15s ease",
            }}
          >
            無料で会員登録する
          </a>
          <span style={{ fontSize: "12px", opacity: 0.6 }}>
            登録無料・いつでも退会可能
          </span>
        </div>

        {/* スライドインジケーター */}
        <div style={{
          position: "absolute",
          bottom: "24px",
          right: "24px",
          display: "flex",
          gap: "8px",
        }}>
          {IMAGES.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              style={{
                width: i === current ? "24px" : "8px",
                height: "8px",
                borderRadius: "4px",
                border: "none",
                backgroundColor: i === current ? C.white : "rgba(255,255,255,0.4)",
                cursor: "pointer",
                padding: 0,
                transition: "all 0.3s ease",
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
