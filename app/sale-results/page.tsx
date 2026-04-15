// app/sale-results/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { getSaleResults } from "@/lib/api";

export const metadata: Metadata = {
  title: "売却実績",
  description: "フェリアホームの不動産売却実績をご紹介します。",
};

export default async function SaleResultsPage() {
  const results = await getSaleResults();

  return (
    <div style={{ backgroundColor: "#ffffff" }}>
      <div style={{ backgroundColor: "#F8F8F8", padding: "8px 0" }}>
        <div className="container-content">
          <nav style={{ fontSize: "12px", color: "#999", display: "flex", alignItems: "center", gap: "4px" }}>
            <Link href="/" style={{ color: "#999", textDecoration: "none" }}>TOP</Link>
            <ChevronRight size={12} />
            <span style={{ color: "#333" }}>売却実績</span>
          </nav>
        </div>
      </div>

      <div className="container-content" style={{ padding: "32px 0 20px" }}>
        <h1 style={{ fontSize: "clamp(22px, 3vw, 32px)", fontWeight: "bold", color: "#1a1a1a", fontFamily: "'Noto Serif JP', serif" }}>
          売却実績
        </h1>
      </div>

      <div className="container-content" style={{ paddingBottom: "64px" }}>
        {results.length === 0 ? (
          <div style={{ padding: "64px 0", textAlign: "center", color: "#999" }}>
            <p>現在、売却実績を準備中です。</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px" }}
            className="grid-cols-1 tb:grid-cols-2 pc:grid-cols-3">
            {results.map((result) => (
              <div key={result.id} style={{
                border: "1px solid #E5E5E5", borderRadius: "12px", overflow: "hidden",
                backgroundColor: "white",
              }}>
                {result.image_url_1 && (
                  <div style={{ position: "relative", aspectRatio: "4/3" }}>
                    <Image src={result.image_url_1} alt={`${result.area} ${result.property_type}`}
                      fill style={{ objectFit: "cover" }} sizes="(max-width: 768px) 100vw, 33vw" />
                  </div>
                )}
                <div style={{ padding: "16px" }}>
                  <div style={{ display: "flex", gap: "8px", marginBottom: "8px", flexWrap: "wrap" }}>
                    <span style={{ fontSize: "11px", padding: "2px 8px", borderRadius: "4px", backgroundColor: "#EBF7EA", color: "#5BAD52", fontWeight: "bold" }}>
                      {result.area}
                    </span>
                    <span style={{ fontSize: "11px", padding: "2px 8px", borderRadius: "4px", backgroundColor: "#F0F5F0", color: "#555" }}>
                      {result.property_type}
                    </span>
                  </div>
                  <p style={{ fontSize: "12px", color: "#888", marginBottom: "6px" }}>{result.year_month}</p>
                  {result.comment && (
                    <p style={{ fontSize: "13px", color: "#555", lineHeight: 1.7 }}>{result.comment}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={{ textAlign: "center", marginTop: "48px" }}>
          <Link href="/sell" style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            padding: "14px 40px", borderRadius: "8px",
            backgroundColor: "#5BAD52", color: "white",
            fontWeight: "bold", fontSize: "15px", textDecoration: "none",
          }}>
            売却についてもっと詳しく
          </Link>
        </div>
      </div>
    </div>
  );
}
