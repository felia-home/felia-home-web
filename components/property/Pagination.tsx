// components/property/Pagination.tsx
"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

export function Pagination({ currentPage, totalPages }: PaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    router.push(`${pathname}?${params.toString()}`);
  };

  const getPageNumbers = () => {
    const range: (number | "...")[] = [];
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    range.push(1);
    if (currentPage > 3) range.push("...");
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      range.push(i);
    }
    if (currentPage < totalPages - 2) range.push("...");
    range.push(totalPages);
    return range;
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "6px",
        marginTop: "40px",
      }}
    >
      {/* 前へ */}
      <button
        type="button"
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage === 1}
        className="slider-pagination-btn"
        style={{ width: "36px", height: "36px", borderRadius: "6px" }}
        aria-label="前へ"
      >
        <ChevronLeft size={16} />
      </button>

      {/* ページ番号 */}
      {getPageNumbers().map((page, i) =>
        page === "..." ? (
          <span
            key={`ellipsis-${i}`}
            style={{
              width: "36px",
              height: "36px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#999",
              fontSize: "14px",
            }}
          >
            ⋯
          </span>
        ) : (
          <button
            key={page}
            type="button"
            onClick={() => goToPage(page)}
            style={{
              width: "36px",
              height: "36px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "6px",
              border:
                page === currentPage
                  ? "1.5px solid #5BAD52"
                  : "1px solid #E5E5E5",
              backgroundColor: page === currentPage ? "#5BAD52" : "#fff",
              color: page === currentPage ? "#fff" : "#333",
              fontSize: "13px",
              fontWeight: page === currentPage ? "bold" : "normal",
              cursor: "pointer",
              transition: "all 0.15s ease",
            }}
          >
            {page}
          </button>
        )
      )}

      {/* 次へ */}
      <button
        type="button"
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="slider-pagination-btn"
        style={{ width: "36px", height: "36px", borderRadius: "6px" }}
        aria-label="次へ"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
