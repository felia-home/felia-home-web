"use client";
import { useState } from "react";
import Image from "next/image";
import type { PropertyImage } from "@/lib/api";

export default function PropertyGallery({
  images,
  title,
}: {
  images: PropertyImage[];
  title: string;
}) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);

  if (images.length === 0) {
    return (
      <div style={{
        height: "400px",
        backgroundColor: "#f0f0f0",
        borderRadius: "12px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#aaa",
        fontSize: "14px",
      }}>
        画像準備中
      </div>
    );
  }

  return (
    <>
      {/* メイン画像 */}
      <div style={{ position: "relative", borderRadius: "12px", overflow: "hidden" }}>
        <div
          onClick={() => setModalOpen(true)}
          style={{ position: "relative", width: "100%", aspectRatio: "16/9", cursor: "zoom-in", backgroundColor: "#f0f0f0" }}
        >
          <Image
            src={images[selectedIndex].url}
            alt={`${title} - 画像${selectedIndex + 1}`}
            fill
            quality={90}
            style={{ objectFit: "cover" }}
            sizes="(max-width: 1200px) 100vw, 800px"
            priority
          />
          <div style={{
            position: "absolute",
            bottom: "12px",
            right: "12px",
            backgroundColor: "rgba(0,0,0,0.5)",
            color: "#fff",
            padding: "4px 10px",
            borderRadius: "4px",
            fontSize: "12px",
            zIndex: 2,
          }}>
            {selectedIndex + 1} / {images.length}
          </div>

          {/* キャプション */}
          {images[selectedIndex].caption && (
            <div style={{
              position: "absolute",
              bottom: 0, left: 0, right: 0,
              padding: "20px 16px 12px",
              background: "linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 100%)",
              zIndex: 2,
              pointerEvents: "none",
            }}>
              <p style={{
                fontSize: "13px",
                color: "#fff",
                margin: 0,
                textShadow: "0 1px 4px rgba(0,0,0,0.5)",
                lineHeight: 1.5,
              }}>
                {images[selectedIndex].caption}
              </p>
            </div>
          )}
        </div>

        {/* 前後ボタン */}
        {images.length > 1 && (
          <>
            <button
              onClick={() => setSelectedIndex(i => (i - 1 + images.length) % images.length)}
              style={{
                position: "absolute",
                left: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                backgroundColor: "rgba(255,255,255,0.9)",
                border: "none",
                borderRadius: "50%",
                width: "40px",
                height: "40px",
                cursor: "pointer",
                fontSize: "18px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
              }}
            >
              ‹
            </button>
            <button
              onClick={() => setSelectedIndex(i => (i + 1) % images.length)}
              style={{
                position: "absolute",
                right: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                backgroundColor: "rgba(255,255,255,0.9)",
                border: "none",
                borderRadius: "50%",
                width: "40px",
                height: "40px",
                cursor: "pointer",
                fontSize: "18px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
              }}
            >
              ›
            </button>
          </>
        )}
      </div>

      {/* サムネイル */}
      {images.length > 1 && (
        <div style={{
          display: "flex",
          gap: "8px",
          marginTop: "8px",
          overflowX: "auto",
          paddingBottom: "4px",
        }}>
          {images.map((img, i) => (
            <div
              key={img.id}
              onClick={() => setSelectedIndex(i)}
              style={{
                position: "relative",
                width: "80px",
                height: "60px",
                flexShrink: 0,
                borderRadius: "6px",
                overflow: "hidden",
                cursor: "pointer",
                border: i === selectedIndex ? "2px solid #5BAD52" : "2px solid transparent",
                opacity: i === selectedIndex ? 1 : 0.7,
                transition: "opacity 0.2s, border 0.2s",
              }}
            >
              <Image
                src={img.url}
                alt={`サムネイル${i + 1}`}
                fill
                style={{ objectFit: "cover" }}
                sizes="80px"
              />
            </div>
          ))}
        </div>
      )}

      {/* モーダル */}
      {modalOpen && (
        <div
          onClick={() => setModalOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.9)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{ position: "relative", width: "90vw", maxWidth: "1000px", aspectRatio: "16/9" }}
          >
            <Image
              src={images[selectedIndex].url}
              alt={title}
              fill
              quality={100}
              style={{ objectFit: "contain" }}
              sizes="90vw"
            />
            <button
              onClick={() => setModalOpen(false)}
              style={{
                position: "absolute",
                top: "-40px",
                right: 0,
                background: "none",
                border: "none",
                color: "#fff",
                fontSize: "32px",
                cursor: "pointer",
              }}
            >
              ×
            </button>
            {images.length > 1 && (
              <>
                <button
                  onClick={() => setSelectedIndex(i => (i - 1 + images.length) % images.length)}
                  style={{
                    position: "absolute",
                    left: "-50px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    color: "#fff",
                    fontSize: "40px",
                    cursor: "pointer",
                  }}
                >
                  ‹
                </button>
                <button
                  onClick={() => setSelectedIndex(i => (i + 1) % images.length)}
                  style={{
                    position: "absolute",
                    right: "-50px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    color: "#fff",
                    fontSize: "40px",
                    cursor: "pointer",
                  }}
                >
                  ›
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
