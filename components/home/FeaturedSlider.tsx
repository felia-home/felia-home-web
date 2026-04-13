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
      <div className="grid grid-cols-1 tb:grid-cols-2 gap-4 tb:gap-6">
        {current.map((p) => (
          <PropertyCard key={p.id} property={p} size="large" />
        ))}
      </div>

      {/* ページネーション（2件以上ある場合のみ表示） */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-6">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="w-10 h-10 rounded-full border flex items-center justify-center
                       disabled:opacity-30 hover:border-felia-green transition-colors"
            style={{ borderColor: "#E5E5E5" }}
            aria-label="前へ"
          >
            <ChevronLeft size={18} className="text-gray-600" />
          </button>

          {/* ドット */}
          <div className="flex gap-2">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                className="rounded-full transition-all duration-300"
                style={{
                  width: i === page ? "24px" : "8px",
                  height: "8px",
                  backgroundColor: i === page ? "#5BAD52" : "#D1D5DB",
                }}
                aria-label={`${i + 1}ページ目`}
              />
            ))}
          </div>

          <button
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page === totalPages - 1}
            className="w-10 h-10 rounded-full border flex items-center justify-center
                       disabled:opacity-30 hover:border-felia-green transition-colors"
            style={{ borderColor: "#E5E5E5" }}
            aria-label="次へ"
          >
            <ChevronRight size={18} className="text-gray-600" />
          </button>
        </div>
      )}
    </div>
  );
}
