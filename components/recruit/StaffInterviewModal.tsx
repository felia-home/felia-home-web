"use client";
import { useEffect } from "react";
import Image from "next/image";
import type { RecruitStaff } from "@/lib/api";

const INTERVIEW_QUESTIONS = [
  "自社の強み",
  "会社の雰囲気",
  "あれば望ましい経験や能力",
  "どのような人が向いているか",
  "仕事として楽しいエピソード",
  "これから入社する人へのメッセージ",
];

export default function StaffInterviewModal({
  staff,
  onClose,
}: {
  staff: RecruitStaff;
  onClose: () => void;
}) {
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

  const interviews = [
    staff.interview_q1,
    staff.interview_q2,
    staff.interview_q3,
    staff.interview_q4,
    staff.interview_q5,
    staff.interview_q6,
  ];

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
          maxWidth: "700px",
          maxHeight: "90vh",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* ヘッダー（スタッフ基本情報） */}
        <div style={{
          background: "linear-gradient(135deg, #2d7a3a 0%, #5BAD52 100%)",
          padding: "32px",
          color: "#fff",
          display: "flex",
          gap: "24px",
          alignItems: "flex-start",
          position: "relative",
        }}>
          {/* 閉じるボタン */}
          <button
            onClick={onClose}
            style={{
              position: "absolute",
              top: "16px",
              right: "16px",
              background: "rgba(255,255,255,0.2)",
              border: "none",
              borderRadius: "50%",
              width: "32px",
              height: "32px",
              color: "#fff",
              fontSize: "18px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ×
          </button>

          {/* 写真 */}
          <div style={{
            width: "100px",
            height: "120px",
            borderRadius: "8px",
            overflow: "hidden",
            flexShrink: 0,
            backgroundColor: "rgba(255,255,255,0.2)",
            border: "2px solid rgba(255,255,255,0.4)",
          }}>
            {staff.photo_url ? (
              <Image
                src={staff.photo_url}
                alt={staff.name}
                width={100}
                height={120}
                style={{ objectFit: "cover", width: "100%", height: "100%" }}
              />
            ) : (
              <div style={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "32px",
              }}>
                👤
              </div>
            )}
          </div>

          {/* 基本情報 */}
          <div style={{ flex: 1 }}>
            {staff.position && (
              <p style={{ fontSize: "12px", opacity: 0.8, margin: "0 0 4px" }}>
                {[staff.department, staff.position].filter(Boolean).join(" / ")}
              </p>
            )}
            <h2 style={{ fontSize: "24px", fontWeight: "bold", margin: "0 0 4px" }}>
              {staff.name}
            </h2>
            {staff.name_kana && (
              <p style={{ fontSize: "12px", opacity: 0.7, margin: "0 0 12px", letterSpacing: "0.1em" }}>
                {staff.name_kana}
              </p>
            )}
            {staff.joined_at && (
              <p style={{ fontSize: "12px", opacity: 0.8, margin: "0 0 8px" }}>
                {staff.joined_at}入社
              </p>
            )}

            {/* モットー・趣味・好きな言葉 */}
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {staff.motto && (
                <div style={{
                  backgroundColor: "rgba(255,255,255,0.15)",
                  borderRadius: "6px",
                  padding: "6px 12px",
                  fontSize: "12px",
                }}>
                  <span style={{ opacity: 0.7 }}>仕事のモットー </span>
                  <span style={{ fontWeight: "bold" }}>「{staff.motto}」</span>
                </div>
              )}
              {staff.hobby && (
                <div style={{
                  backgroundColor: "rgba(255,255,255,0.15)",
                  borderRadius: "6px",
                  padding: "6px 12px",
                  fontSize: "12px",
                }}>
                  <span style={{ opacity: 0.7 }}>趣味 </span>
                  <span style={{ fontWeight: "bold" }}>{staff.hobby}</span>
                </div>
              )}
              {staff.favorite && (
                <div style={{
                  backgroundColor: "rgba(255,255,255,0.15)",
                  borderRadius: "6px",
                  padding: "6px 12px",
                  fontSize: "12px",
                }}>
                  <span style={{ opacity: 0.7 }}>好きな言葉 </span>
                  <span style={{ fontWeight: "bold" }}>「{staff.favorite}」</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* インタビュー本文（スクロール） */}
        <div style={{ flex: 1, overflow: "auto", padding: "32px" }}>
          {/* キャッチフレーズ */}
          {staff.catchphrase && (
            <div style={{
              backgroundColor: "#f0f9ef",
              borderRadius: "8px",
              padding: "16px 20px",
              marginBottom: "28px",
              borderLeft: "4px solid #5BAD52",
            }}>
              <p style={{ fontSize: "15px", color: "#333", margin: 0, fontStyle: "italic", lineHeight: 1.7 }}>
                「{staff.catchphrase}」
              </p>
            </div>
          )}

          {/* Q&A */}
          {interviews.map((answer, i) => {
            if (!answer) return null;
            return (
              <div key={i} style={{ marginBottom: "28px" }}>
                <div style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "12px",
                  marginBottom: "10px",
                }}>
                  <span style={{
                    backgroundColor: "#5BAD52",
                    color: "#fff",
                    fontWeight: "bold",
                    fontSize: "12px",
                    padding: "3px 8px",
                    borderRadius: "4px",
                    flexShrink: 0,
                    fontFamily: "'Montserrat', sans-serif",
                  }}>
                    Q{i + 1}
                  </span>
                  <p style={{ fontSize: "14px", fontWeight: "bold", color: "#333", margin: 0, lineHeight: 1.5 }}>
                    {INTERVIEW_QUESTIONS[i]}
                  </p>
                </div>
                <div style={{ paddingLeft: "44px" }}>
                  <p style={{ fontSize: "13px", color: "#555", lineHeight: 1.9, margin: 0, whiteSpace: "pre-wrap" }}>
                    {answer}
                  </p>
                </div>
              </div>
            );
          })}

          {/* bioがあり、インタビューがない場合 */}
          {staff.bio && interviews.every(q => !q) && (
            <p style={{ fontSize: "14px", color: "#555", lineHeight: 1.9, margin: 0 }}>
              {staff.bio}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
