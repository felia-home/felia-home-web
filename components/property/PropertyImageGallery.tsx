// components/property/PropertyImageGallery.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ZoomIn, X } from "lucide-react";

interface GalleryImage {
  url: string;
  caption?: string | null;
}

interface Props {
  images: GalleryImage[];
}

export function PropertyImageGallery({ images }: Props) {
  const [current, setCurrent] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [imgErrors, setImgErrors] = useState<Record<number, boolean>>({});

  if (!images || images.length === 0) {
    return (
      <div
        style={{
          width: "100%",
          borderRadius: "12px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f0f0f0",
          aspectRatio: "16/9",
        }}
      >
        <span style={{ color: "#aaa", fontSize: "13px" }}>画像なし</span>
      </div>
    );
  }

  const prev = () =>
    setCurrent((i) => (i - 1 + images.length) % images.length);
  const next = () => setCurrent((i) => (i + 1) % images.length);

  return (
    <>
      {/* メイン画像 */}
      <div
        style={{
          position: "relative",
          borderRadius: "12px",
          overflow: "hidden",
          aspectRatio: "16/9",
        }}
      >
        {!imgErrors[current] ? (
          <Image
            src={images[current].url}
            alt={images[current].caption ?? `物件画像 ${current + 1}`}
            fill
            style={{ objectFit: "cover" }}
            sizes="(max-width: 768px) 100vw, 60vw"
            onError={() =>
              setImgErrors((e) => ({ ...e, [current]: true }))
            }
          />
        ) : (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#f0f0f0",
              color: "#aaa",
              fontSize: "13px",
            }}
          >
            画像を読み込めませんでした
          </div>
        )}

        {/* ズームボタン */}
        <button
          type="button"
          onClick={() => setLightboxOpen(true)}
          className="gallery-zoom-btn"
          style={{
            position: "absolute",
            top: "12px",
            right: "12px",
            width: "36px",
            height: "36px",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backdropFilter: "blur(4px)",
            WebkitBackdropFilter: "blur(4px)",
          }}
          aria-label="拡大"
        >
          <ZoomIn size={16} style={{ color: "#fff" }} />
        </button>

        {/* 枚数バッジ */}
        {images.length > 1 && (
          <div
            style={{
              position: "absolute",
              bottom: "12px",
              right: "12px",
              padding: "4px 10px",
              borderRadius: "8px",
              backgroundColor: "rgba(0,0,0,0.5)",
              backdropFilter: "blur(4px)",
              WebkitBackdropFilter: "blur(4px)",
            }}
          >
            <span
              style={{
                color: "#fff",
                fontSize: "12px",
                fontWeight: 500,
              }}
            >
              {current + 1} / {images.length}
            </span>
          </div>
        )}

        {/* 前後矢印 */}
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              className="gallery-arrow-btn"
              style={{
                position: "absolute",
                left: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
              }}
              aria-label="前の画像"
            >
              <ChevronLeft size={18} style={{ color: "#555" }} />
            </button>
            <button
              type="button"
              onClick={next}
              className="gallery-arrow-btn"
              style={{
                position: "absolute",
                right: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
              }}
              aria-label="次の画像"
            >
              <ChevronRight size={18} style={{ color: "#555" }} />
            </button>
          </>
        )}
      </div>

      {/* サムネイル列 */}
      {images.length > 1 && (
        <div
          style={{
            display: "flex",
            gap: "8px",
            marginTop: "8px",
            overflowX: "auto",
            paddingBottom: "4px",
          }}
        >
          {images.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setCurrent(i)}
              style={{
                flexShrink: 0,
                width: "72px",
                height: "54px",
                borderRadius: "8px",
                overflow: "hidden",
                border: `2px solid ${i === current ? "#5BAD52" : "transparent"}`,
                padding: 0,
                cursor: "pointer",
                transition: "border-color 0.15s ease",
                position: "relative",
                opacity: i === current ? 1 : 0.7,
              }}
              aria-label={`サムネイル ${i + 1}`}
            >
              {!imgErrors[i] ? (
                <Image
                  src={img.url}
                  alt={img.caption ?? `サムネイル ${i + 1}`}
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="72px"
                  onError={() =>
                    setImgErrors((e) => ({ ...e, [i]: true }))
                  }
                />
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    backgroundColor: "#f0f0f0",
                  }}
                />
              )}
            </button>
          ))}
        </div>
      )}

      {/* ライトボックス */}
      {lightboxOpen && (
        <div
          onClick={() => setLightboxOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 50,
            backgroundColor: "rgba(0,0,0,0.9)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* 閉じるボタン */}
          <button
            type="button"
            onClick={() => setLightboxOpen(false)}
            className="lightbox-btn"
            style={{
              position: "absolute",
              top: "16px",
              right: "16px",
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 10,
            }}
            aria-label="閉じる"
          >
            <X size={20} style={{ color: "#fff" }} />
          </button>

          {/* 画像 */}
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "relative",
              maxWidth: "90vw",
              maxHeight: "85vh",
            }}
          >
            <Image
              src={images[current].url}
              alt={images[current].caption ?? `物件画像 ${current + 1}`}
              width={1200}
              height={800}
              style={{
                objectFit: "contain",
                maxWidth: "90vw",
                maxHeight: "85vh",
                width: "auto",
                height: "auto",
              }}
            />
          </div>

          {/* ライトボックス矢印 */}
          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  prev();
                }}
                className="lightbox-btn"
                style={{
                  position: "absolute",
                  left: "16px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: "44px",
                  height: "44px",
                  borderRadius: "50%",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                aria-label="前の画像"
              >
                <ChevronLeft size={24} style={{ color: "#fff" }} />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  next();
                }}
                className="lightbox-btn"
                style={{
                  position: "absolute",
                  right: "16px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: "44px",
                  height: "44px",
                  borderRadius: "50%",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                aria-label="次の画像"
              >
                <ChevronRight size={24} style={{ color: "#fff" }} />
              </button>
            </>
          )}
        </div>
      )}
    </>
  );
}
