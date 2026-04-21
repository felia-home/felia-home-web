"use client";
import { useState } from "react";
import Image from "next/image";
import type { RecruitStaff } from "@/lib/api";
import StaffInterviewModal from "./StaffInterviewModal";

export default function StaffCard({ staff }: { staff: RecruitStaff }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [hovered, setHovered] = useState(false);

  return (
    <>
      <div
        onClick={() => setModalOpen(true)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          backgroundColor: "#fff",
          borderRadius: "12px",
          overflow: "hidden",
          border: "1px solid #e8e8e8",
          cursor: "pointer",
          boxShadow: hovered
            ? "0 8px 24px rgba(0,0,0,0.12)"
            : "0 2px 8px rgba(0,0,0,0.06)",
          transform: hovered ? "translateY(-4px)" : "translateY(0)",
          transition: "all 0.2s ease",
        }}
      >
        {/* 写真 */}
        <div style={{
          position: "relative",
          width: "100%",
          aspectRatio: "4/3",
          backgroundColor: "#f5f5f5",
          overflow: "hidden",
        }}>
          {staff.photo_url ? (
            <Image
              src={staff.photo_url}
              alt={staff.name}
              fill
              style={{ objectFit: "cover", objectPosition: "center top" }}
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          ) : (
            <div style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#e8f5e6",
              color: "#5BAD52",
              fontSize: "40px",
            }}>
              👤
            </div>
          )}

          {/* ホバーオーバーレイ */}
          <div style={{
            position: "absolute",
            inset: 0,
            backgroundColor: "rgba(91,173,82,0.85)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: hovered ? 1 : 0,
            transition: "opacity 0.2s ease",
          }}>
            <p style={{
              color: "#fff",
              fontSize: "14px",
              fontWeight: "bold",
              textAlign: "center",
              margin: 0,
            }}>
              インタビューを見る →
            </p>
          </div>
        </div>

        {/* 情報 */}
        <div style={{ padding: "16px" }}>
          {staff.position && (
            <p style={{ fontSize: "11px", color: "#5BAD52", margin: "0 0 4px", fontWeight: "500" }}>
              {staff.position}
            </p>
          )}
          <p style={{ fontSize: "16px", fontWeight: "bold", color: "#333", margin: "0 0 2px" }}>
            {staff.name}
          </p>
          {staff.name_kana && (
            <p style={{ fontSize: "11px", color: "#aaa", margin: "0 0 8px", letterSpacing: "0.1em" }}>
              {staff.name_kana}
            </p>
          )}
          {staff.joined_at && (
            <p style={{ fontSize: "11px", color: "#888", margin: 0 }}>
              {staff.joined_at}入社
            </p>
          )}
        </div>
      </div>

      {modalOpen && (
        <StaffInterviewModal
          staff={staff}
          onClose={() => setModalOpen(false)}
        />
      )}
    </>
  );
}
