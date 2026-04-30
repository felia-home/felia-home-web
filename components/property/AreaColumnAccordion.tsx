"use client";

// components/property/AreaColumnAccordion.tsx
import { useState } from "react";

interface AreaColumn {
  id: string;
  title: string;
  content: string;
  station?: string | null;
  line?: string | null;
}

export function AreaColumnAccordion({ columns }: { columns: AreaColumn[] }) {
  const [openIds, setOpenIds] = useState<Set<string>>(new Set());

  if (columns.length === 0) return null;

  const toggle = (id: string) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div style={{
      backgroundColor: "#fff",
      borderRadius: "12px",
      border: "1px solid #e8e8e8",
      overflow: "hidden",
    }}>
      {/* ヘッダー */}
      <div style={{ backgroundColor: "#f8f8f8", padding: "14px 20px", borderBottom: "1px solid #e8e8e8" }}>
        <h2 style={{ fontSize: "15px", fontWeight: "bold", color: "#333", margin: 0 }}>
          📍 エリアガイド
        </h2>
      </div>

      {columns.map((col, i) => {
        const isOpen = openIds.has(col.id);
        return (
          <div key={col.id} style={{ borderBottom: i < columns.length - 1 ? "1px solid #f0f0f0" : "none" }}>
            <button
              onClick={() => toggle(col.id)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
                padding: "16px 20px",
                backgroundColor: "transparent",
                border: "none",
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              <div>
                <p style={{ fontSize: "14px", fontWeight: "bold", color: "#333", margin: 0 }}>
                  {col.title}
                </p>
                {(col.station || col.line) && (
                  <p style={{ fontSize: "11px", color: "#5BAD52", margin: "2px 0 0" }}>
                    {[col.line, col.station ? `${col.station}駅` : null].filter(Boolean).join(" ")}
                  </p>
                )}
              </div>
              <span style={{
                fontSize: "20px", color: "#aaa",
                transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.2s ease",
                display: "inline-block",
                flexShrink: 0,
                marginLeft: "12px",
              }}>
                ›
              </span>
            </button>

            {isOpen && (
              <div style={{
                padding: "0 20px 20px",
                animation: "fadeIn 0.2s ease",
              }}>
                <p style={{
                  fontSize: "13px", color: "#555",
                  lineHeight: 2, margin: 0,
                  whiteSpace: "pre-wrap",
                }}>
                  {col.content}
                </p>
              </div>
            )}
          </div>
        );
      })}

      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  );
}
