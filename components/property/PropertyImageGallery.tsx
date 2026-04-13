// components/property/PropertyImageGallery.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";

interface PropertyImageGalleryProps {
  images: string[];
  name: string;
}

export function PropertyImageGallery({ images, name }: PropertyImageGalleryProps) {
  const [current, setCurrent] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [imgErrors, setImgErrors] = useState<Set<number>>(new Set());

  const validImages = images.filter((_, i) => !imgErrors.has(i));
  if (validImages.length === 0) {
    return (
      <div
        className="w-full rounded-xl flex items-center justify-center"
        style={{ aspectRatio: "4/3", backgroundColor: "#EBF7EA" }}
      >
        <span className="text-gray-400 text-sm">画像なし</span>
      </div>
    );
  }

  const prev = () => setCurrent((c) => (c - 1 + validImages.length) % validImages.length);
  const next = () => setCurrent((c) => (c + 1) % validImages.length);

  return (
    <>
      {/* メイン画像 */}
      <div className="relative rounded-xl overflow-hidden" style={{ aspectRatio: "4/3" }}>
        <Image
          src={validImages[current]}
          alt={`${name} - 画像${current + 1}`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 60vw"
          onError={() => setImgErrors((e) => new Set(e).add(current))}
          priority
        />

        {/* ズームボタン */}
        <button
          onClick={() => setLightboxOpen(true)}
          className="absolute top-3 right-3 w-9 h-9 rounded-lg bg-black/40 hover:bg-black/60
                     flex items-center justify-center transition-colors backdrop-blur-sm"
        >
          <ZoomIn size={16} className="text-white" />
        </button>

        {/* 枚数表示 */}
        <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg bg-black/50 backdrop-blur-sm">
          <span className="text-white text-xs font-medium">
            {current + 1} / {validImages.length}
          </span>
        </div>

        {/* 矢印（複数枚の場合のみ） */}
        {validImages.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full
                         bg-white/80 hover:bg-white flex items-center justify-center
                         transition-colors shadow-sm"
            >
              <ChevronLeft size={18} className="text-gray-700" />
            </button>
            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full
                         bg-white/80 hover:bg-white flex items-center justify-center
                         transition-colors shadow-sm"
            >
              <ChevronRight size={18} className="text-gray-700" />
            </button>
          </>
        )}
      </div>

      {/* サムネイル */}
      {validImages.length > 1 && (
        <div className="flex gap-2 mt-2 overflow-x-auto pb-1">
          {validImages.map((img, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className="flex-shrink-0 rounded-lg overflow-hidden transition-all"
              style={{
                width: "72px",
                height: "54px",
                border: i === current ? "2px solid #5BAD52" : "2px solid transparent",
                opacity: i === current ? 1 : 0.6,
              }}
            >
              <div className="relative w-full h-full">
                <Image
                  src={img}
                  alt={`サムネイル${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="72px"
                />
              </div>
            </button>
          ))}
        </div>
      )}

      {/* ライトボックス */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center
                       rounded-full bg-white/20 hover:bg-white/40 transition-colors"
            onClick={() => setLightboxOpen(false)}
          >
            <X size={20} className="text-white" />
          </button>
          <div
            className="relative max-w-[90vw] max-h-[85vh]"
            style={{ aspectRatio: "4/3", width: "min(90vw, 1200px)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={validImages[current]}
              alt={`${name} - 画像${current + 1}`}
              fill
              className="object-contain"
              sizes="90vw"
            />
          </div>
          {validImages.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); prev(); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full
                           bg-white/20 hover:bg-white/40 flex items-center justify-center"
              >
                <ChevronLeft size={22} className="text-white" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); next(); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full
                           bg-white/20 hover:bg-white/40 flex items-center justify-center"
              >
                <ChevronRight size={22} className="text-white" />
              </button>
            </>
          )}
        </div>
      )}
    </>
  );
}
