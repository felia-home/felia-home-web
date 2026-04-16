// components/flyers/FlyerModal.tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import type { WebFlyer } from "@/lib/api";

export function FlyerModal({
  flyer,
  onClose,
}: {
  flyer: WebFlyer;
  onClose: () => void;
}) {
  const [side, setSide] = useState<"front" | "back">("front");
  const hasBack = !!flyer.back_image_url;
  const currentImage =
    side === "front"
      ? flyer.front_image_url!
      : flyer.back_image_url!;

  // ESCキーで閉じる
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  // スクロール禁止
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.85)",
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      {/* モーダルコンテンツ */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: "#fff",
          borderRadius: "8px",
          overflow: "hidden",
          width: "100%",
          maxWidth: "900px",
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* ヘッダー */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 16px",
          borderBottom: "1px solid #e8e8e8",
          flexShrink: 0,
        }}>
          <div>
            {flyer.distribute_month && (
              <span style={{ fontSize: "12px", color: "#888", marginRight: "8px" }}>
                {flyer.distribute_month}
              </span>
            )}
            <span style={{ fontSize: "15px", fontWeight: "bold", color: "#333" }}>
              {flyer.name}
            </span>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              fontSize: "24px",
              cursor: "pointer",
              color: "#666",
              lineHeight: 1,
              padding: "0 4px",
            }}
          >
            ×
          </button>
        </div>

        {/* 表面・裏面タブ */}
        {hasBack && (
          <div style={{ display: "flex", borderBottom: "1px solid #e8e8e8", flexShrink: 0 }}>
            {(["front", "back"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setSide(s)}
                style={{
                  flex: 1,
                  padding: "10px",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "14px",
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

        {/* チラシ画像 */}
        <div style={{
          flex: 1,
          overflow: "auto",
          backgroundColor: "#f5f5f5",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "16px",
        }}>
          <div style={{
            position: "relative",
            width: "100%",
            aspectRatio: "1.414 / 1",
          }}>
            <Image
              src={currentImage}
              alt={flyer.name}
              fill
              quality={100}
              style={{ objectFit: "contain" }}
              sizes="900px"
            />
          </div>
        </div>

        {/* フッター */}
        <div style={{
          padding: "12px 16px",
          borderTop: "1px solid #e8e8e8",
          display: "flex",
          justifyContent: "flex-end",
          gap: "8px",
          flexShrink: 0,
        }}>
          {flyer.pdf_url && (
            <a
              href={flyer.pdf_url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                padding: "8px 20px",
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
          <button
            onClick={onClose}
            style={{
              padding: "8px 20px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              fontSize: "13px",
              cursor: "pointer",
              backgroundColor: "#fff",
              color: "#666",
            }}
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
}
