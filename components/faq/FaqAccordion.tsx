// components/faq/FaqAccordion.tsx
"use client";

import { useState } from "react";

interface FaqItem {
  q: string;
  a: string;
}

interface FaqGroup {
  category: string;
  items: FaqItem[];
}

export function FaqAccordion({ groups }: { groups: FaqGroup[] }) {
  const [openKey, setOpenKey] = useState<string | null>(null);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "48px" }}>
      {groups.map((group) => (
        <div key={group.category}>
          {/* カテゴリタイトル */}
          <div style={{
            display: "flex", alignItems: "center", gap: "12px",
            marginBottom: "16px",
          }}>
            <div style={{ width: "4px", height: "20px", backgroundColor: "#5BAD52", borderRadius: "2px" }} />
            <h2 style={{ fontSize: "16px", fontWeight: "bold", color: "#1a1a1a" }}>
              {group.category}
            </h2>
          </div>

          {/* FAQ一覧 */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {group.items.map((item, i) => {
              const key = `${group.category}-${i}`;
              const isOpen = openKey === key;
              return (
                <div
                  key={key}
                  style={{
                    border: "1px solid",
                    borderColor: isOpen ? "#5BAD52" : "#E5E5E5",
                    borderRadius: "8px",
                    overflow: "hidden",
                    transition: "border-color 0.2s ease",
                  }}
                >
                  {/* Q行 */}
                  <button
                    onClick={() => setOpenKey(isOpen ? null : key)}
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      gap: "16px",
                      padding: "18px 20px",
                      backgroundColor: isOpen ? "#EBF7EA" : "white",
                      border: "none",
                      cursor: "pointer",
                      textAlign: "left",
                      transition: "background-color 0.2s ease",
                    }}
                  >
                    {/* Q バッジ */}
                    <span style={{
                      flexShrink: 0,
                      width: "28px",
                      height: "28px",
                      borderRadius: "50%",
                      backgroundColor: "#5BAD52",
                      color: "white",
                      fontSize: "13px",
                      fontWeight: "bold",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: "'Montserrat', sans-serif",
                    }}>
                      Q
                    </span>
                    <span style={{
                      flex: 1,
                      fontSize: "14px",
                      fontWeight: "500",
                      color: "#1a1a1a",
                      lineHeight: 1.6,
                    }}>
                      {item.q}
                    </span>
                    {/* ＋／－ */}
                    <span style={{
                      flexShrink: 0,
                      width: "28px",
                      height: "28px",
                      borderRadius: "50%",
                      backgroundColor: isOpen ? "#5BAD52" : "#F0F0F0",
                      color: isOpen ? "white" : "#888",
                      fontSize: "18px",
                      fontWeight: "bold",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      lineHeight: 1,
                      transition: "all 0.2s ease",
                    }}>
                      {isOpen ? "−" : "+"}
                    </span>
                  </button>

                  {/* A行 */}
                  {isOpen && (
                    <div style={{
                      display: "flex",
                      gap: "16px",
                      padding: "16px 20px 20px",
                      backgroundColor: "#FAFFF9",
                      borderTop: "1px solid #E5E5E5",
                    }}>
                      <span style={{
                        flexShrink: 0,
                        width: "28px",
                        height: "28px",
                        borderRadius: "50%",
                        backgroundColor: "#4a8a8a",
                        color: "white",
                        fontSize: "13px",
                        fontWeight: "bold",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontFamily: "'Montserrat', sans-serif",
                        marginTop: "2px",
                      }}>
                        A
                      </span>
                      <p style={{
                        fontSize: "14px",
                        color: "#555",
                        lineHeight: 1.9,
                        flex: 1,
                        whiteSpace: "pre-line",
                      }}>
                        {item.a}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
