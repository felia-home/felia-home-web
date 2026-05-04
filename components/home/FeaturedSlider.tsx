// components/home/FeaturedSlider.tsx
"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PropertyCard } from "@/components/property/PropertyCard";
import type { Property } from "@/lib/api";

interface FeaturedSliderProps {
  properties: Property[];
}

export function FeaturedSlider({ properties }: FeaturedSliderProps) {
  const [page, setPage] = useState(0);
  const perPage = 2;
  const totalPages = Math.ceil(properties.length / perPage);
  const current = properties.slice(page * perPage, page * perPage + perPage);

  return (
    <div>
      {/* カードグリッド */}
      <div className="featured-grid">
        {current.map((p) => (
          <PropertyCard key={p.id} property={p} size="large" />
        ))}
      </div>

      {/* ページネーション（2件以上ある場合のみ表示） */}
      {totalPages > 1 && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "16px",
            marginTop: "24px",
          }}
        >
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="slider-pagination-btn"
            aria-label="前へ"
          >
            <ChevronLeft size={18} />
          </button>

          {/* ドット */}
          <div style={{ display: "flex", gap: "8px" }}>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setPage(i)}
                className="slider-dot"
                style={{
                  width: i === page ? "24px" : "8px",
                  height: "8px",
                  backgroundColor: i === page ? "#5BAD52" : "#D1D5DB",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                }}
                aria-label={`${i + 1}ページ目`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page === totalPages - 1}
            className="slider-pagination-btn"
            aria-label="次へ"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
}
