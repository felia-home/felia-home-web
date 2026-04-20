"use client";
import { useEffect } from "react";
import Image from "next/image";
import type { RecruitStaff } from "@/lib/api";

export default function StaffInterviewModal({
  staff,
  onClose,
}: {
  staff: RecruitStaff;
  onClose: () => void;
}) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.7)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          backgroundColor: "#fff",
          borderRadius: "16px",
          width: "100%",
          maxWidth: "760px",
          maxHeight: "90vh",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* ヘッダー */}
        <div style={{
          background: "linear-gradient(135deg, #2d7a3a 0%, #5BAD52 100%)",
          padding: "28px 32px",
          color: "#fff",
          display: "flex",
          gap: "20px",
          alignItems: "flex-start",
          position: "relative",
          flexShrink: 0,
        }}>
          <button
            onClick={onClose}
            style={{
              position: "absolute", top: "16px", right: "16px",
              background: "rgba(255,255,255,0.2)", border: "none",
              borderRadius: "50%", width: "32px", height: "32px",
              color: "#fff", fontSize: "18px", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            ×
          </button>

          {/* 写真 */}
          <div style={{
            width: "90px", height: "110px", borderRadius: "8px",
            overflow: "hidden", flexShrink: 0,
            backgroundColor: "rgba(255,255,255,0.2)",
            border: "2px solid rgba(255,255,255,0.4)",
          }}>
            {staff.photo_url ? (
              <Image
                src={staff.photo_url}
                alt={staff.name}
                width={90}
                height={110}
                style={{ objectFit: "cover", width: "100%", height: "100%" }}
              />
            ) : (
              <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px" }}>
                👤
              </div>
            )}
          </div>

          {/* 基本情報 */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {(staff.department || staff.position) && (
              <p style={{ fontSize: "12px", opacity: 0.8, margin: "0 0 6px" }}>
                {[staff.department, staff.position].filter(Boolean).join(" / ")}
              </p>
            )}
            <h2 style={{ fontSize: "22px", fontWeight: "bold", margin: "0 0 2px" }}>
              {staff.name}
            </h2>
            {staff.name_kana && (
              <p style={{ fontSize: "11px", opacity: 0.7, margin: "0 0 8px", letterSpacing: "0.1em" }}>
                {staff.name_kana}
              </p>
            )}
            {staff.joined_at && (
              <p style={{ fontSize: "12px", opacity: 0.85, margin: "0 0 12px" }}>
                {staff.joined_at}入社
              </p>
            )}

            {/* 趣味・好きな言葉・モットー */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {staff.hobby && (
                <div style={{ backgroundColor: "rgba(255,255,255,0.15)", borderRadius: "4px", padding: "4px 10px", fontSize: "11px" }}>
                  <span style={{ opacity: 0.7 }}>趣味 </span>
                  <span style={{ fontWeight: "500" }}>
                    {staff.hobby.length > 20 ? staff.hobby.substring(0, 20) + "…" : staff.hobby}
                  </span>
                </div>
              )}
              {staff.favorite_word && (
                <div style={{ backgroundColor: "rgba(255,255,255,0.15)", borderRadius: "4px", padding: "4px 10px", fontSize: "11px" }}>
                  <span style={{ opacity: 0.7 }}>好きな言葉 </span>
                  <span style={{ fontWeight: "500" }}>「{staff.favorite_word}」</span>
                </div>
              )}
              {staff.motto && (
                <div style={{ backgroundColor: "rgba(255,255,255,0.15)", borderRadius: "4px", padding: "4px 10px", fontSize: "11px" }}>
                  <span style={{ opacity: 0.7 }}>モットー </span>
                  <span style={{ fontWeight: "500" }}>「{staff.motto}」</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 本文（スクロール可） */}
        <div style={{ flex: 1, overflow: "auto", padding: "28px 32px" }}>

          {/* キャッチフレーズ */}
          {staff.catchphrase && (
            <div style={{
              backgroundColor: "#f0f9ef", borderRadius: "8px",
              padding: "16px 20px", marginBottom: "24px",
              borderLeft: "4px solid #5BAD52",
            }}>
              <p style={{ fontSize: "15px", color: "#333", margin: 0, fontStyle: "italic", lineHeight: 1.7 }}>
                「{staff.catchphrase}」
              </p>
            </div>
          )}

          {/* 日々大切にしていること */}
          {staff.daily_mindset && (
            <div style={{ marginBottom: "24px", padding: "16px 20px", backgroundColor: "#fafafa", borderRadius: "8px" }}>
              <p style={{ fontSize: "12px", fontWeight: "bold", color: "#5BAD52", margin: "0 0 6px" }}>
                日々大切にしていること
              </p>
              <p style={{ fontSize: "14px", color: "#444", margin: 0, lineHeight: 1.8 }}>
                {staff.daily_mindset}
              </p>
            </div>
          )}

          {/* インタビューQ&A */}
          {staff.interviews && staff.interviews.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "24px", marginBottom: "24px" }}>
              {staff.interviews.map((item, i) => (
                <div key={i}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: "10px", marginBottom: "10px" }}>
                    <span style={{
                      backgroundColor: "#5BAD52", color: "#fff",
                      fontWeight: "bold", fontSize: "11px",
                      padding: "3px 8px", borderRadius: "4px",
                      flexShrink: 0,
                      fontFamily: "'Montserrat', sans-serif",
                    }}>
                      Q{i + 1}
                    </span>
                    <p style={{ fontSize: "14px", fontWeight: "bold", color: "#333", margin: 0, lineHeight: 1.5 }}>
                      {item.question}
                    </p>
                  </div>
                  <div style={{ paddingLeft: "42px" }}>
                    <p style={{ fontSize: "13px", color: "#555", lineHeight: 1.9, margin: 0, whiteSpace: "pre-wrap" }}>
                      {item.answer}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 印象に残るお客様エピソード */}
          {staff.memorable_client && (
            <div style={{ marginBottom: "24px", padding: "16px 20px", backgroundColor: "#fafafa", borderRadius: "8px" }}>
              <p style={{ fontSize: "12px", fontWeight: "bold", color: "#5BAD52", margin: "0 0 6px" }}>
                印象に残るお客様エピソード
              </p>
              <p style={{ fontSize: "13px", color: "#555", margin: 0, lineHeight: 1.9, whiteSpace: "pre-wrap" }}>
                {staff.memorable_client}
              </p>
            </div>
          )}

          {/* 趣味（全文） */}
          {staff.hobby && (
            <div style={{ padding: "16px 20px", backgroundColor: "#fafafa", borderRadius: "8px" }}>
              <p style={{ fontSize: "12px", fontWeight: "bold", color: "#5BAD52", margin: "0 0 6px" }}>
                趣味・プライベート
              </p>
              <p style={{ fontSize: "13px", color: "#555", margin: 0, lineHeight: 1.9 }}>
                {staff.hobby}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
