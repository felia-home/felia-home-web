"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// 地理的位置に合わせたグリッド配置
const WARD_GRID: {
  name: string;
  row: number;
  col: number;
  active: boolean;
}[] = [
  // 北西エリア
  { name: "練馬区",   row: 0, col: 0, active: true  },
  { name: "板橋区",   row: 0, col: 1, active: true  },
  { name: "北区",     row: 0, col: 2, active: true  },
  { name: "荒川区",   row: 0, col: 3, active: true  },
  { name: "足立区",   row: 0, col: 4, active: false },
  // 第2行
  { name: "中野区",   row: 1, col: 0, active: true  },
  { name: "豊島区",   row: 1, col: 1, active: true  },
  { name: "文京区",   row: 1, col: 2, active: true  },
  { name: "台東区",   row: 1, col: 3, active: true  },
  { name: "葛飾区",   row: 1, col: 4, active: false },
  // 第3行
  { name: "杉並区",   row: 2, col: 0, active: true  },
  { name: "新宿区",   row: 2, col: 1, active: true  },
  { name: "千代田区", row: 2, col: 2, active: true  },
  { name: "墨田区",   row: 2, col: 3, active: false },
  { name: "江戸川区", row: 2, col: 4, active: false },
  // 第4行
  { name: "世田谷区", row: 3, col: 0, active: true  },
  { name: "渋谷区",   row: 3, col: 1, active: true  },
  { name: "港区",     row: 3, col: 2, active: true  },
  { name: "中央区",   row: 3, col: 3, active: true  },
  { name: "江東区",   row: 3, col: 4, active: false },
  // 第5行
  { name: "目黒区",   row: 4, col: 0, active: true  },
  { name: "大田区",   row: 4, col: 1, active: true  },
  { name: "品川区",   row: 4, col: 2, active: true  },
];

const WARD_HREF: Record<string, string> = {
  "千代田区": "/areas/千代田区",
  "中央区": "/areas/中央区",
  "港区": "/areas/港区",
  "新宿区": "/areas/新宿区",
  "文京区": "/areas/文京区",
  "台東区": "/areas/台東区",
  "品川区": "/areas/品川区",
  "目黒区": "/areas/目黒区",
  "大田区": "/areas/大田区",
  "世田谷区": "/areas/世田谷区",
  "渋谷区": "/areas/渋谷区",
  "中野区": "/areas/中野区",
  "杉並区": "/areas/杉並区",
  "豊島区": "/areas/豊島区",
  "北区": "/areas/北区",
  "荒川区": "/areas/荒川区",
  "板橋区": "/areas/板橋区",
  "練馬区": "/areas/練馬区",
};

interface TokyoWardMapProps {
  areas?: { area_name: string; href?: string | null }[];
}

export function TokyoWardMap({ areas }: TokyoWardMapProps) {
  const [hoveredName, setHoveredName] = useState<string | null>(null);
  const router = useRouter();

  const getHref = (name: string): string => {
    if (areas) {
      const area = areas.find((a) => a.area_name === name);
      if (area?.href) return area.href;
    }
    return WARD_HREF[name] || `/areas/${encodeURIComponent(name)}`;
  };

  const maxRow = Math.max(...WARD_GRID.map(w => w.row));
  const maxCol = Math.max(...WARD_GRID.map(w => w.col));

  return (
    <div style={{
      backgroundColor: "#1B3A4B",
      borderRadius: "12px",
      padding: "20px",
      width: "100%",
    }}>
      <p style={{
        fontSize: "11px",
        color: "rgba(255,255,255,0.5)",
        letterSpacing: "0.15em",
        margin: "0 0 12px",
        textAlign: "center",
        fontFamily: "'Montserrat', sans-serif",
      }}>
        TOKYO AREA MAP
      </p>

      {/* グリッドレイアウト */}
      <div style={{
        display: "grid",
        gridTemplateColumns: `repeat(${maxCol + 1}, 1fr)`,
        gridTemplateRows: `repeat(${maxRow + 1}, 1fr)`,
        gap: "6px",
        aspectRatio: "5/4",
      }}>
        {Array.from({ length: (maxRow + 1) * (maxCol + 1) }).map((_, i) => {
          const row = Math.floor(i / (maxCol + 1));
          const col = i % (maxCol + 1);
          const ward = WARD_GRID.find(w => w.row === row && w.col === col);

          if (!ward) {
            return (
              <div key={i} style={{ gridRow: row + 1, gridColumn: col + 1 }} />
            );
          }

          const hovered = hoveredName === ward.name;

          if (!ward.active) {
            return (
              <div
                key={ward.name}
                style={{
                  gridRow: row + 1,
                  gridColumn: col + 1,
                  backgroundColor: "rgba(255,255,255,0.06)",
                  borderRadius: "6px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                <span style={{
                  fontSize: "10px",
                  color: "rgba(255,255,255,0.25)",
                  textAlign: "center",
                  lineHeight: 1.3,
                }}>
                  {ward.name}
                </span>
              </div>
            );
          }

          return (
            <div
              key={ward.name}
              onClick={() => router.push(getHref(ward.name))}
              onMouseEnter={() => setHoveredName(ward.name)}
              onMouseLeave={() => setHoveredName(null)}
              style={{
                gridRow: row + 1,
                gridColumn: col + 1,
                backgroundColor: hovered ? "rgba(91,173,82,0.9)" : "rgba(91,173,82,0.4)",
                borderRadius: "6px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: hovered ? "1.5px solid #7ed672" : "1px solid rgba(91,173,82,0.6)",
                cursor: "pointer",
                transition: "all 0.15s ease",
                transform: hovered ? "scale(1.05)" : "scale(1)",
                boxShadow: hovered ? "0 2px 12px rgba(91,173,82,0.4)" : "none",
              }}
            >
              <span style={{
                fontSize: "10px",
                color: hovered ? "#fff" : "rgba(255,255,255,0.9)",
                fontWeight: hovered ? "bold" : "500",
                textAlign: "center",
                lineHeight: 1.3,
                pointerEvents: "none",
                userSelect: "none",
              }}>
                {ward.name}
              </span>
            </div>
          );
        })}
      </div>

      {/* 凡例 */}
      <div style={{
        display: "flex",
        gap: "16px",
        marginTop: "12px",
        justifyContent: "center",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <div style={{ width: "12px", height: "12px", borderRadius: "2px", backgroundColor: "rgba(91,173,82,0.4)", border: "1px solid rgba(91,173,82,0.6)" }} />
          <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.6)" }}>対応エリア</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <div style={{ width: "12px", height: "12px", borderRadius: "2px", backgroundColor: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }} />
          <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.6)" }}>対応エリア外</span>
        </div>
      </div>
    </div>
  );
}
