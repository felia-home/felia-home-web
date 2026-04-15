// components/sell/SellNav.tsx
"use client";

import { useState } from "react";

const NAV_ITEMS = [
  { label: "不動産売却の\n7つの強み", href: "#strengths" },
  { label: "不動産売却の流れ", href: "#flow" },
  { label: "「仲介」と\n「買取」の違い", href: "#difference" },
  { label: "よくある質問", href: "#faq" },
  { label: "諸費用", href: "#costs" },
  { label: "少しでも高くなる\nポイント", href: "#points" },
  { label: "売却査定", href: "#assessment" },
];

export function SellNav() {
  const [active, setActive] = useState<number | null>(null);
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div style={{ backgroundColor: "#efefef", borderTop: "1px solid #ddd", borderBottom: "1px solid #ddd" }}>
      <div className="container-content">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)" }}>
          {NAV_ITEMS.map((item, i, arr) => {
            const isActive = active === i;
            const isHovered = hovered === i;
            return (
              <a
                key={i}
                href={item.href}
                onClick={() => setActive(i)}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "10px 4px",
                  fontSize: "10px",
                  color: isActive ? "#5BAD52" : isHovered ? "#5BAD52" : "#555",
                  textDecoration: "none",
                  whiteSpace: "pre-line",
                  textAlign: "center",
                  lineHeight: 1.4,
                  borderRight: i < arr.length - 1 ? "1px solid #ddd" : "none",
                  borderBottom: isActive ? "3px solid #5BAD52" : "3px solid transparent",
                  backgroundColor: isActive ? "#EBF7EA" : isHovered ? "#F5FAF5" : "transparent",
                  fontWeight: isActive ? "bold" : "normal",
                  transition: "all 0.15s ease",
                  cursor: "pointer",
                }}
              >
                {item.label}
                <span style={{
                  marginTop: "3px",
                  color: isActive ? "#5BAD52" : "#aaa",
                  fontSize: "9px",
                }}>▼</span>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}
