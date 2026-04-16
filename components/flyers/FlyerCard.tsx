// components/flyers/FlyerCard.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import type { WebFlyer } from "@/lib/api";

export function FlyerCard({ flyer }: { flyer: WebFlyer }) {
  const [side, setSide] = useState<"front" | "back">("front");
  const hasBack = !!flyer.back_image_url;
  const currentImage =
    side === "front"
      ? flyer.front_image_url
      : flyer.back_image_url;

  return (
    <div style={{
      backgroundColor: "#fff",
      border: "1px solid #e8e8e8",
      borderRadius: "8px",
      overflow: "hidden",
      boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
    }}>
      {/* 表面・裏面タブ */}
      {hasBack && (
        <div style={{ display: "flex", borderBottom: "1px solid #e8e8e8" }}>
          {(["front", "back"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setSide(s)}
              style={{
                flex: 1,
                padding: "10px",
                border: "none",
                cursor: "pointer",
                fontSize: "13px",
                fontWeight: side === s ? "bold" : "normal",
                backgroundColor: side === s ? "#5BAD52" : "#f9f9f9",
                color: side === s ? "#fff" : "#666",
                transition: "all 0.2s ease",
              }}
            >
              {s === "front" ? "表面" : "裏面"}
            </button>
          ))}
        </div>
      )}

      {/* チラシ画像（A4比率 1:√2） */}
      <div style={{ position: "relative", width: "100%", aspectRatio: "1 / 1.414", backgroundColor: "#f5f5f5" }}>
        {currentImage ? (
          <Image
            src={currentImage}
            alt={flyer.name}
            fill
            quality={90}
            style={{ objectFit: "contain" }}
            sizes="(max-width: 599px) 100vw, (max-width: 1023px) 50vw, 33vw"
          />
        ) : (
          <div style={{
            position: "absolute", inset: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#ccc", fontSize: "13px",
          }}>
            画像なし
          </div>
        )}
      </div>

      {/* チラシ情報 */}
      <div style={{ padding: "16px" }}>
        {flyer.distribute_month && (
          <p style={{ fontSize: "12px", color: "#888", marginBottom: "4px" }}>
            {flyer.distribute_month}
          </p>
        )}
        <h3 style={{
          fontSize: "15px",
          fontWeight: "bold",
          color: "#333",
          marginBottom: "12px",
          lineHeight: 1.4,
        }}>
          {flyer.name}
        </h3>

        {/* PDFダウンロードボタン */}
        {flyer.pdf_url && (
          <a
            href={flyer.pdf_url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              padding: "8px 16px",
              backgroundColor: "#5BAD52",
              color: "#fff",
              borderRadius: "4px",
              fontSize: "13px",
              textDecoration: "none",
              fontWeight: "bold",
            }}
          >
            📄 PDFダウンロード
          </a>
        )}
      </div>
    </div>
  );
}
