// app/sell/results/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, User, FileText } from "lucide-react";
import { getSaleResults, type SaleResult } from "@/lib/api";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "売却実績",
  description: "フェリアホームが成約をサポートした売却実績をご紹介します。",
};

const PROPERTY_TYPE_LABELS: Record<string, string> = {
  "土地": "土地",
  "戸建て": "戸建て",
  "マンション": "マンション",
  "その他": "その他",
};

function SaleResultCard({ result }: { result: SaleResult }) {
  const saleDate = `${result.sale_year}年${result.sale_month ? result.sale_month + "月" : ""}成約`;
  const location = `${result.area_ward} ${result.area_town}`;
  const typeLabel = PROPERTY_TYPE_LABELS[result.property_type] ?? result.property_type;

  return (
    <div style={{
      border: "1px solid #e8e8e8",
      borderRadius: "8px",
      overflow: "hidden",
      backgroundColor: "#fff",
    }}>
      {/* 間取り図エリア */}
      <div style={{ position: "relative", aspectRatio: "4/3", backgroundColor: "#f5f5f5" }}>
        {result.floor_plan_image_url ? (
          <Image
            src={result.floor_plan_image_url}
            alt={`${location} 間取り図`}
            fill
            style={{ objectFit: "contain" }}
            sizes="(max-width: 479px) 100vw, (max-width: 767px) 50vw, 33vw"
          />
        ) : (
          <div style={{
            position: "absolute", inset: 0,
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            gap: "8px",
          }}>
            <FileText size={32} style={{ color: "#ccc" }} />
            <span style={{ fontSize: "12px", color: "#bbb" }}>間取り図なし</span>
          </div>
        )}
      </div>

      {/* 情報エリア */}
      <div style={{ padding: "16px" }}>
        {/* 物件種別バッジ */}
        <span style={{
          display: "inline-block",
          backgroundColor: "#e8f5e6",
          color: "#5BAD52",
          borderRadius: "4px",
          padding: "2px 8px",
          fontSize: "12px",
          fontWeight: "bold",
        }}>
          {typeLabel}
        </span>

        {/* 売却時期 */}
        <p style={{ fontSize: "14px", color: "#666", marginTop: "8px" }}>
          {saleDate}
        </p>

        {/* 場所 */}
        <p style={{ fontSize: "15px", fontWeight: "bold", color: "#333", marginTop: "4px" }}>
          {location}
        </p>

        {/* コメント */}
        {result.comment && (
          <p style={{ fontSize: "13px", color: "#555", marginTop: "8px", lineHeight: 1.6 }}>
            {result.comment}
          </p>
        )}

        {/* 担当営業 */}
        {result.staff && (
          <div style={{
            borderTop: "1px solid #f0f0f0",
            marginTop: "12px",
            paddingTop: "12px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}>
            {result.staff.photo_url ? (
              <div style={{ position: "relative", width: "32px", height: "32px", borderRadius: "50%", overflow: "hidden", flexShrink: 0 }}>
                <Image
                  src={result.staff.photo_url}
                  alt={result.staff.name}
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="32px"
                />
              </div>
            ) : (
              <div style={{
                width: "32px", height: "32px", borderRadius: "50%",
                backgroundColor: "#e0e0e0",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}>
                <User size={16} style={{ color: "#999" }} />
              </div>
            )}
            <span style={{ fontSize: "13px", color: "#333" }}>
              担当：{result.staff.name}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default async function SellResultsPage() {
  const results = await getSaleResults();
  const sorted = [...results].sort((a, b) => a.sort_order - b.sort_order);

  return (
    <div style={{ backgroundColor: "#ffffff" }}>

      {/* パンくず */}
      <div style={{ backgroundColor: "#F8F8F8", padding: "8px 0" }}>
        <div className="container-content">
          <nav style={{ fontSize: "12px", color: "#999", display: "flex", alignItems: "center", gap: "4px" }}>
            <Link href="/" style={{ color: "#999", textDecoration: "none" }}>TOP</Link>
            <ChevronRight size={12} />
            <Link href="/sell" style={{ color: "#999", textDecoration: "none" }}>不動産売却について</Link>
            <ChevronRight size={12} />
            <span style={{ color: "#333" }}>売却実績</span>
          </nav>
        </div>
      </div>

      {/* ページヘッダー */}
      <div style={{ backgroundColor: "#F0F5F0", padding: "48px 0 40px" }}>
        <div className="container-content" style={{ textAlign: "center" }}>
          <p style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: "clamp(28px, 5vw, 48px)",
            fontWeight: "800",
            color: "#5BAD52",
            letterSpacing: "0.05em",
            lineHeight: 1,
            marginBottom: "8px",
          }}>
            Sales Performance
          </p>
          <h1 style={{
            fontSize: "clamp(20px, 2.5vw, 28px)",
            fontWeight: "bold",
            color: "#1a1a1a",
            fontFamily: "'Noto Serif JP', serif",
          }}>
            売却実績
          </h1>
        </div>
      </div>

      {/* リード文 */}
      <div className="container-content" style={{ padding: "40px 0 32px", textAlign: "center" }}>
        <p style={{ fontSize: "14px", color: "#666", lineHeight: 1.9 }}>
          フェリアホームがこれまでに成約をサポートした売却実績の一部をご紹介します。<br />
          エリアや物件種別など、お客様のご参考にしていただければ幸いです。
        </p>
      </div>

      {/* 実績カード一覧 */}
      {sorted.length === 0 ? (
        <div style={{ padding: "64px 24px", textAlign: "center", color: "#999" }}>
          <FileText size={48} style={{ color: "#E5E5E5", margin: "0 auto 16px", display: "block" }} />
          <p>現在、売却実績の掲載準備中です。</p>
        </div>
      ) : (
        <div className="sale-results-grid">
          {sorted.map((result) => (
            <SaleResultCard key={result.id} result={result} />
          ))}
        </div>
      )}

      {/* 査定CTA */}
      <div style={{ backgroundColor: "#F0F5F0", padding: "48px 0" }}>
        <div className="container-content" style={{ textAlign: "center" }}>
          <p style={{ fontSize: "15px", fontWeight: "bold", color: "#1a1a1a", marginBottom: "8px" }}>
            不動産の売却をお考えですか？
          </p>
          <p style={{ fontSize: "13px", color: "#666", marginBottom: "24px" }}>
            まずはお気軽に無料査定をご依頼ください
          </p>
          <Link
            href="/sell/valuation"
            style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              padding: "14px 40px", borderRadius: "8px",
              backgroundColor: "#5BAD52", color: "white",
              fontWeight: "bold", fontSize: "14px", textDecoration: "none",
            }}
          >
            無料売却査定を依頼する
          </Link>
        </div>
      </div>

    </div>
  );
}
