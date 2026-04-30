"use client";

// components/property/AgentCard.tsx
import { useState } from "react";
import Image from "next/image";

interface Agent {
  id: string;
  name: string;
  photo_url?: string | null;
  position?: string | null;
  bio?: string | null;
  catchphrase?: string | null;
  specialty_areas?: string[] | null;
  specialty_types?: string[] | null;
  hobby?: string | null;
  favorite_word?: string | null;
  tel_work?: string | null;
}

export function AgentCard({ agent }: { agent: Agent }) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      {/* カード */}
      <div style={{
        backgroundColor: "#fff",
        borderRadius: "12px",
        border: "1px solid #e8e8e8",
        overflow: "hidden",
      }}>
        <div style={{ backgroundColor: "#f8f8f8", padding: "12px 20px", borderBottom: "1px solid #e8e8e8" }}>
          <p style={{ fontSize: "11px", fontWeight: "bold", color: "#888", margin: 0, letterSpacing: "0.1em", fontFamily: "'Montserrat', sans-serif" }}>
            STAFF
          </p>
        </div>
        <div style={{ padding: "16px 20px" }}>
          <div style={{ display: "flex", gap: "14px", alignItems: "flex-start", marginBottom: "14px" }}>
            <div style={{
              width: "72px", height: "72px",
              borderRadius: "50%",
              overflow: "hidden",
              flexShrink: 0,
              backgroundColor: "#f0f0f0",
              position: "relative",
            }}>
              {agent.photo_url ? (
                <Image
                  src={agent.photo_url}
                  alt={agent.name}
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="72px"
                />
              ) : (
                <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px" }}>
                  👤
                </div>
              )}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: "11px", color: "#5BAD52", margin: "0 0 2px", fontWeight: "bold" }}>担当スタッフ</p>
              <p style={{ fontSize: "16px", fontWeight: "bold", color: "#1a1a1a", margin: "0 0 2px" }}>{agent.name}</p>
              {agent.position && (
                <p style={{ fontSize: "11px", color: "#888", margin: 0 }}>{agent.position}</p>
              )}
            </div>
          </div>

          {agent.catchphrase && (
            <div style={{
              backgroundColor: "#f8f8f8",
              borderRadius: "6px",
              padding: "10px 14px",
              marginBottom: "12px",
              borderLeft: "3px solid #5BAD52",
            }}>
              <p style={{ fontSize: "12px", color: "#444", margin: 0, lineHeight: 1.7, fontStyle: "italic" }}>
                「{agent.catchphrase}」
              </p>
            </div>
          )}

          {agent.bio && (
            <p style={{
              fontSize: "12px", color: "#666", lineHeight: 1.8,
              margin: "0 0 14px",
              overflow: "hidden",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}>
              {agent.bio}
            </p>
          )}

          <button
            onClick={() => setModalOpen(true)}
            style={{
              display: "block", width: "100%",
              padding: "9px",
              border: "1px solid #e0e0e0",
              borderRadius: "6px",
              backgroundColor: "#fff",
              fontSize: "12px", color: "#5BAD52",
              cursor: "pointer",
              fontWeight: "bold",
              transition: "all 0.15s ease",
            }}
          >
            スタッフ紹介を見る ›
          </button>
        </div>
      </div>

      {/* モーダル */}
      {modalOpen && (
        <div
          style={{
            position: "fixed", inset: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 1000,
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: "20px",
          }}
          onClick={() => setModalOpen(false)}
        >
          <div
            style={{
              backgroundColor: "#fff",
              borderRadius: "16px",
              maxWidth: "480px",
              width: "100%",
              maxHeight: "85vh",
              overflow: "auto",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "16px 20px",
              borderBottom: "1px solid #e8e8e8",
              position: "sticky", top: 0, backgroundColor: "#fff", zIndex: 1,
            }}>
              <p style={{ fontSize: "14px", fontWeight: "bold", color: "#333", margin: 0 }}>担当スタッフ</p>
              <button
                onClick={() => setModalOpen(false)}
                style={{ background: "none", border: "none", fontSize: "22px", color: "#aaa", cursor: "pointer", padding: "0 4px" }}
              >
                ×
              </button>
            </div>

            <div style={{ padding: "24px 20px" }}>
              <div style={{ textAlign: "center", marginBottom: "20px" }}>
                <div style={{
                  width: "100px", height: "100px",
                  borderRadius: "50%",
                  overflow: "hidden",
                  margin: "0 auto 12px",
                  backgroundColor: "#f0f0f0",
                  position: "relative",
                }}>
                  {agent.photo_url ? (
                    <Image src={agent.photo_url} alt={agent.name} fill style={{ objectFit: "cover" }} sizes="100px" />
                  ) : (
                    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "40px" }}>👤</div>
                  )}
                </div>
                <p style={{ fontSize: "20px", fontWeight: "bold", color: "#1a1a1a", margin: "0 0 4px" }}>{agent.name}</p>
                {agent.position && <p style={{ fontSize: "12px", color: "#888", margin: 0 }}>{agent.position}</p>}
              </div>

              {agent.catchphrase && (
                <div style={{ backgroundColor: "#f0f5f2", borderRadius: "8px", padding: "14px 16px", marginBottom: "16px", borderLeft: "3px solid #5BAD52" }}>
                  <p style={{ fontSize: "13px", color: "#444", margin: 0, lineHeight: 1.7, fontStyle: "italic" }}>
                    「{agent.catchphrase}」
                  </p>
                </div>
              )}

              {agent.bio && (
                <div style={{ marginBottom: "16px" }}>
                  <p style={{ fontSize: "12px", fontWeight: "bold", color: "#5BAD52", margin: "0 0 6px", letterSpacing: "0.05em" }}>PROFILE</p>
                  <p style={{ fontSize: "13px", color: "#444", lineHeight: 1.9, margin: 0 }}>{agent.bio}</p>
                </div>
              )}

              {agent.specialty_areas && agent.specialty_areas.length > 0 && (
                <div style={{ marginBottom: "14px" }}>
                  <p style={{ fontSize: "12px", fontWeight: "bold", color: "#888", margin: "0 0 8px" }}>得意エリア</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                    {agent.specialty_areas.map((a, i) => (
                      <span key={i} style={{ padding: "3px 10px", backgroundColor: "#e8f5e6", color: "#2d7a3a", fontSize: "12px", borderRadius: "20px" }}>{a}</span>
                    ))}
                  </div>
                </div>
              )}

              {agent.specialty_types && agent.specialty_types.length > 0 && (
                <div style={{ marginBottom: "14px" }}>
                  <p style={{ fontSize: "12px", fontWeight: "bold", color: "#888", margin: "0 0 8px" }}>得意物件種別</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                    {agent.specialty_types.map((t, i) => (
                      <span key={i} style={{ padding: "3px 10px", backgroundColor: "#e8f5e6", color: "#2d7a3a", fontSize: "12px", borderRadius: "20px" }}>{t}</span>
                    ))}
                  </div>
                </div>
              )}

              {(agent.hobby || agent.favorite_word) && (
                <div style={{ borderTop: "1px solid #f0f0f0", paddingTop: "14px", display: "flex", flexDirection: "column", gap: "8px" }}>
                  {agent.hobby && (
                    <div style={{ display: "flex", gap: "12px" }}>
                      <span style={{ fontSize: "12px", color: "#888", width: "80px", flexShrink: 0 }}>趣味</span>
                      <span style={{ fontSize: "13px", color: "#333" }}>{agent.hobby}</span>
                    </div>
                  )}
                  {agent.favorite_word && (
                    <div style={{ display: "flex", gap: "12px" }}>
                      <span style={{ fontSize: "12px", color: "#888", width: "80px", flexShrink: 0 }}>好きな言葉</span>
                      <span style={{ fontSize: "13px", color: "#333" }}>{agent.favorite_word}</span>
                    </div>
                  )}
                </div>
              )}

              <button
                onClick={() => setModalOpen(false)}
                style={{
                  display: "block", width: "100%",
                  marginTop: "20px", padding: "12px",
                  backgroundColor: "#5BAD52", color: "#fff",
                  border: "none", borderRadius: "8px",
                  fontSize: "14px", fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                閉じる
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
