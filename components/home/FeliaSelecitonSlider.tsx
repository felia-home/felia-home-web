"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Property } from "@/lib/api";

const PROPERTY_TYPE_MAP: Record<string, string> = {
  LAND: "土地",
  USED_HOUSE: "中古戸建",
  NEW_HOUSE: "新築戸建",
  MANSION: "マンション",
  USED_MANSION: "中古マンション",
  NEW_MANSION: "新築マンション",
  OTHER: "その他",
};

export default function FeliaSelecitonSlider({
  properties,
}: {
  properties: Property[];
}) {
  const [current, setCurrent] = useState(0);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // 物件が切り替わったら画像インデックスをリセット
  useEffect(() => {
    setSelectedImageIndex(0);
  }, [current]);

  if (!properties || properties.length === 0) {
    return (
      <div style={{
        height: "400px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#aaa",
        fontSize: "14px",
        backgroundColor: "#f9f9f9",
        borderRadius: "12px",
      }}>
        掲載物件準備中です
      </div>
    );
  }

  const p = properties[current];
  const allImages = p.images ?? [];
  const mainImage = allImages[selectedImageIndex]?.url ?? allImages[0]?.url ?? null;
  const subImages = allImages.filter((_, i) => i !== selectedImageIndex).slice(0, 3);
  const typeLabel =
    PROPERTY_TYPE_MAP[p.property_type ?? p.propertyType ?? ""] ?? "";
  const address =
    [p.city, p.town].filter(Boolean).join("") || p.address || "";

  return (
    <div style={{ position: "relative", width: "100%" }}>

      {/* 左矢印（物件切り替え） */}
      {properties.length > 1 && (
        <button
          onClick={() => setCurrent(i => (i - 1 + properties.length) % properties.length)}
          style={{
            position: "absolute",
            left: "-20px",
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 10,
            width: "44px",
            height: "44px",
            borderRadius: "50%",
            border: "1px solid #e0e0e0",
            backgroundColor: "#fff",
            cursor: "pointer",
            fontSize: "20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#555",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          ‹
        </button>
      )}

      {/* メインカード */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "3fr 2fr",
        backgroundColor: "#fff",
        borderRadius: "16px",
        overflow: "hidden",
        boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
        minHeight: "420px",
      }}>

        {/* 左：画像エリア */}
        <div style={{
          position: "relative",
          backgroundColor: "#f5f5f5",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "420px",
          padding: "24px",
        }}>
          {mainImage ? (
            <Image
              src={mainImage}
              alt={p.title ?? "物件画像"}
              width={700}
              height={500}
              quality={90}
              style={{
                width: "100%",
                height: "auto",
                maxHeight: "480px",
                objectFit: "contain",
                display: "block",
              }}
              sizes="(max-width: 1200px) 60vw, 700px"
              priority
            />
          ) : (
            <div style={{
              width: "100%", minHeight: "300px",
              display: "flex", alignItems: "center",
              justifyContent: "center", color: "#bbb", fontSize: "13px",
            }}>
              画像なし
            </div>
          )}

          {/* Felia Selection バッジ */}
          <div style={{
            position: "absolute",
            top: "16px",
            left: "16px",
            backgroundColor: "#5BAD52",
            color: "#fff",
            padding: "4px 12px",
            borderRadius: "20px",
            fontSize: "11px",
            fontWeight: "bold",
            letterSpacing: "0.05em",
            fontFamily: "'Montserrat', sans-serif",
          }}>
            Felia Selection
          </div>

          {/* サブ画像サムネイル（下部）*/}
          {subImages.length > 0 && (
            <div style={{
              position: "absolute",
              bottom: "12px",
              right: "12px",
              display: "flex",
              gap: "6px",
            }}>
              {subImages.map((img, i) => (
                <div
                  key={img.id}
                  onClick={() => setSelectedImageIndex(
                    allImages.findIndex(a => a.id === img.id)
                  )}
                  style={{
                    position: "relative",
                    width: "56px",
                    height: "42px",
                    borderRadius: "4px",
                    overflow: "hidden",
                    border: "2px solid rgba(255,255,255,0.8)",
                    cursor: "pointer",
                  }}
                >
                  <Image
                    src={img.url}
                    alt={`サブ画像${i + 1}`}
                    fill
                    style={{ objectFit: "cover" }}
                    sizes="56px"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 右：物件情報エリア */}
        <div style={{
          padding: "32px 28px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}>
          {/* 上部情報 */}
          <div>
            {/* バッジ */}
            <div style={{ display: "flex", gap: "6px", marginBottom: "12px", flexWrap: "wrap" }}>
              {typeLabel && (
                <span style={{
                  fontSize: "11px",
                  padding: "2px 10px",
                  borderRadius: "20px",
                  backgroundColor: "#e8f5e6",
                  color: "#5BAD52",
                  fontWeight: "bold",
                }}>
                  {typeLabel}
                </span>
              )}
              {p.is_open_house && (
                <span style={{
                  fontSize: "11px",
                  padding: "2px 10px",
                  borderRadius: "20px",
                  backgroundColor: "#fff3e0",
                  color: "#E67E22",
                  fontWeight: "bold",
                }}>
                  現地販売会
                </span>
              )}
            </div>

            {/* 物件名 */}
            <h3 style={{
              fontSize: "17px",
              fontWeight: "bold",
              color: "#333",
              lineHeight: 1.5,
              margin: "0 0 8px",
            }}>
              {p.title ?? p.name ?? "物件名未設定"}
            </h3>

            {/* キャッチコピー */}
            {p.catch_copy && (
              <p style={{
                fontSize: "13px",
                color: "#5BAD52",
                lineHeight: 1.6,
                margin: "0 0 16px",
                borderLeft: "3px solid #5BAD52",
                paddingLeft: "10px",
                fontStyle: "italic",
              }}>
                {p.catch_copy}
              </p>
            )}

            {/* スペック */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "20px" }}>
              {address && (
                <div style={{ display: "flex", gap: "8px", fontSize: "13px" }}>
                  <span style={{ color: "#aaa", width: "70px", flexShrink: 0 }}>所在地</span>
                  <span style={{ color: "#333" }}>{address}</span>
                </div>
              )}
              {p.station_name1 && (
                <div style={{ display: "flex", gap: "8px", fontSize: "13px" }}>
                  <span style={{ color: "#aaa", width: "70px", flexShrink: 0 }}>最寄駅</span>
                  <span style={{ color: "#333" }}>
                    {p.station_name1}駅 徒歩{p.station_walk1}分
                  </span>
                </div>
              )}
              {p.rooms && (
                <div style={{ display: "flex", gap: "8px", fontSize: "13px" }}>
                  <span style={{ color: "#aaa", width: "70px", flexShrink: 0 }}>間取り</span>
                  <span style={{ color: "#333" }}>{p.rooms}</span>
                </div>
              )}
              {p.area_build_m2 && (
                <div style={{ display: "flex", gap: "8px", fontSize: "13px" }}>
                  <span style={{ color: "#aaa", width: "70px", flexShrink: 0 }}>建物面積</span>
                  <span style={{ color: "#333" }}>{p.area_build_m2}㎡</span>
                </div>
              )}
              {p.area_land_m2 && (
                <div style={{ display: "flex", gap: "8px", fontSize: "13px" }}>
                  <span style={{ color: "#aaa", width: "70px", flexShrink: 0 }}>土地面積</span>
                  <span style={{ color: "#333" }}>{p.area_land_m2}㎡</span>
                </div>
              )}
            </div>
          </div>

          {/* 価格・CTAエリア */}
          <div>
            <div style={{
              backgroundColor: "#f9f9f9",
              borderRadius: "8px",
              padding: "14px 16px",
              marginBottom: "16px",
            }}>
              <p style={{ fontSize: "11px", color: "#aaa", margin: "0 0 4px" }}>販売価格</p>
              <p style={{ fontSize: "26px", fontWeight: "bold", color: "#5BAD52", margin: 0, lineHeight: 1 }}>
                {p.price != null ? p.price.toLocaleString() : "応相談"}
                {p.price != null && (
                  <span style={{ fontSize: "14px", marginLeft: "4px" }}>万円</span>
                )}
              </p>
            </div>

            <Link
              href={`/properties/${p.id}`}
              style={{
                display: "block",
                textAlign: "center",
                padding: "14px",
                backgroundColor: "#5BAD52",
                color: "#fff",
                borderRadius: "8px",
                textDecoration: "none",
                fontWeight: "bold",
                fontSize: "14px",
                marginBottom: "8px",
              }}
            >
              物件詳細を見る →
            </Link>
            <Link
              href={`/contact?property_id=${p.id}&type=inquiry`}
              style={{
                display: "block",
                textAlign: "center",
                padding: "10px",
                backgroundColor: "#fff",
                color: "#5BAD52",
                borderRadius: "8px",
                textDecoration: "none",
                fontSize: "13px",
                border: "1px solid #5BAD52",
              }}
            >
              この物件に問い合わせる
            </Link>
          </div>
        </div>
      </div>

      {/* 右矢印（物件切り替え） */}
      {properties.length > 1 && (
        <button
          onClick={() => setCurrent(i => (i + 1) % properties.length)}
          style={{
            position: "absolute",
            right: "-20px",
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 10,
            width: "44px",
            height: "44px",
            borderRadius: "50%",
            border: "1px solid #e0e0e0",
            backgroundColor: "#fff",
            cursor: "pointer",
            fontSize: "20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#555",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          ›
        </button>
      )}

      {/* ドットインジケーター */}
      {properties.length > 1 && (
        <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginTop: "20px" }}>
          {properties.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              style={{
                width: i === current ? "24px" : "8px",
                height: "8px",
                borderRadius: "4px",
                border: "none",
                backgroundColor: i === current ? "#5BAD52" : "#ddd",
                cursor: "pointer",
                padding: 0,
                transition: "all 0.2s ease",
              }}
            />
          ))}
        </div>
      )}

      {/* 件数表示 */}
      {properties.length > 1 && (
        <p style={{ textAlign: "center", fontSize: "12px", color: "#aaa", marginTop: "8px" }}>
          {current + 1} / {properties.length}
        </p>
      )}
    </div>
  );
}
