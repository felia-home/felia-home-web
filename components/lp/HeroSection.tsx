"use client";
import { useState } from "react";
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
  const [current] = useState(() => Math.floor(Math.random() * IMAGES.length));

  return (
    <section style={{
      position: "relative",
      minHeight: "600px",
      overflow: "hidden",
      display: "flex",
      alignItems: "center",
    }}>
      {/* 背景画像（ランダム1枚） */}
      <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
        <Image
          src={IMAGES[current]}
          alt="高級物件イメージ"
          fill
          quality={90}
          style={{ objectFit: "cover", objectPosition: "center" }}
          sizes="100vw"
          priority
        />
      </div>

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
            Felia <strong style={{ fontWeight: "700" }}>Home</strong> Private Selection
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

        {/* 価値提案 */}
        <div style={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          marginBottom: "56px",
          maxWidth: "520px",
        }}>
          {[
            {
              title: "非公開物件へのアクセス",
              desc: "売主様のご意向により、一般には公開されない物件情報を会員様限定でご覧いただけます。",
            },
            {
              title: "専任担当者によるご支援",
              desc: "経験豊富なスタッフが、物件探しから契約まで一貫してサポートいたします。",
            },
            {
              title: "東京都心の厳選物件のみ",
              desc: "フェリアホームが厳選した、価値ある不動産のみをご案内します。",
            },
          ].map((item) => (
            <div
              key={item.title}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "14px",
              }}
            >
              <div style={{
                width: "4px",
                height: "100%",
                minHeight: "40px",
                backgroundColor: "rgba(255,255,255,0.5)",
                borderRadius: "2px",
                flexShrink: 0,
                marginTop: "2px",
              }} />
              <div>
                <p style={{
                  fontSize: "14px",
                  fontWeight: "bold",
                  color: "#fff",
                  margin: "0 0 4px",
                  letterSpacing: "0.03em",
                }}>
                  {item.title}
                </p>
                <p style={{
                  fontSize: "13px",
                  color: "rgba(255,255,255,0.7)",
                  margin: 0,
                  lineHeight: 1.7,
                }}>
                  {item.desc}
                </p>
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
      </div>
    </section>
  );
}
