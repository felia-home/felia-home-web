// components/flyers/FlyerCard.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { FlyerModal } from "./FlyerModal";
import type { WebFlyer } from "@/lib/api";

export function FlyerCard({ flyer }: { flyer: WebFlyer }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [hovered, setHovered] = useState(false);

  if (!flyer.front_image_url) return null;

  return (
    <>
      {/* カード（横向きサムネイル） */}
      <div
        onClick={() => setModalOpen(true)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          backgroundColor: "#fff",
          border: "1px solid #e8e8e8",
          borderRadius: "8px",
          overflow: "hidden",
          boxShadow: hovered
            ? "0 4px 16px rgba(0,0,0,0.12)"
            : "0 2px 8px rgba(0,0,0,0.06)",
          cursor: "pointer",
          transition: "box-shadow 0.2s ease",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* サムネイル画像（横向き） */}
        <div style={{
          position: "relative",
          width: "100%",
          aspectRatio: "1.414 / 1",
          backgroundColor: "#f5f5f5",
        }}>
          <Image
            src={flyer.front_image_url}
            alt={flyer.name}
            fill
            quality={85}
            style={{ objectFit: "cover", objectPosition: "top" }}
            sizes="(max-width: 767px) 100vw, 50vw"
          />
          {/* 拡大アイコン */}
          <div style={{
            position: "absolute",
            bottom: "8px",
            right: "8px",
            backgroundColor: "rgba(0,0,0,0.5)",
            color: "#fff",
            borderRadius: "4px",
            padding: "4px 8px",
            fontSize: "11px",
          }}>
            🔍 クリックで拡大
          </div>
          {/* 裏面あり表示 */}
          {flyer.back_image_url && (
            <div style={{
              position: "absolute",
              top: "8px",
              right: "8px",
              backgroundColor: "#5BAD52",
              color: "#fff",
              borderRadius: "4px",
              padding: "3px 8px",
              fontSize: "11px",
            }}>
              表裏あり
            </div>
          )}
        </div>

        {/* 情報 */}
        <div style={{ padding: "12px 16px" }}>
          {flyer.distribute_month && (
            <p style={{ fontSize: "12px", color: "#888", margin: "0 0 4px" }}>
              {flyer.distribute_month}
            </p>
          )}
          <p style={{
            fontSize: "14px",
            fontWeight: "bold",
            color: "#333",
            margin: 0,
            lineHeight: 1.4,
          }}>
            {flyer.name}
          </p>
        </div>
      </div>

      {/* モーダル */}
      {modalOpen && (
        <FlyerModal flyer={flyer} onClose={() => setModalOpen(false)} />
      )}
    </>
  );
}
