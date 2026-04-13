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

  // 表示するページ番号の範囲
  const getPageNumbers = () => {
    const range: (number | "...")[] = [];
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    range.push(1);
    if (currentPage > 3) range.push("...");
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      range.push(i);
    }
    if (currentPage < totalPages - 2) range.push("...");
    range.push(totalPages);
    return range;
  };

  return (
    <div className="flex items-center justify-center gap-1.5 mt-10">
      {/* 前へ */}
      <button
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage === 1}
        className="w-9 h-9 flex items-center justify-center rounded border disabled:opacity-30
                   hover:border-felia-green transition-colors"
        style={{ borderColor: "#E5E5E5" }}
      >
        <ChevronLeft size={16} className="text-gray-600" />
      </button>

      {/* ページ番号 */}
      {getPageNumbers().map((page, i) => (
        page === "..." ? (
          <span key={`ellipsis-${i}`} className="w-9 h-9 flex items-center justify-center text-gray-400 text-sm">
            ⋯
          </span>
        ) : (
          <button
            key={page}
            onClick={() => goToPage(page)}
            className="w-9 h-9 flex items-center justify-center rounded border text-sm font-medium transition-colors"
            style={{
              borderColor: page === currentPage ? "#5BAD52" : "#E5E5E5",
              backgroundColor: page === currentPage ? "#5BAD52" : "white",
              color: page === currentPage ? "white" : "#333",
            }}
          >
            {page}
          </button>
        )
      ))}

      {/* 次へ */}
      <button
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="w-9 h-9 flex items-center justify-center rounded border disabled:opacity-30
                   hover:border-felia-green transition-colors"
        style={{ borderColor: "#E5E5E5" }}
      >
        <ChevronRight size={16} className="text-gray-600" />
      </button>
    </div>
  );
}
