// app/flyers/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, Download, FileText } from "lucide-react";
import { getWebFlyers } from "@/lib/api";

export const metadata: Metadata = {
  title: "WEBチラシ",
  description: "フェリアホームの最新チラシ情報をご覧いただけます。",
};

export default async function FlyersPage() {
  const flyers = await getWebFlyers();

  return (
    <div style={{ backgroundColor: "#ffffff" }}>
      <div style={{ backgroundColor: "#F8F8F8", padding: "8px 0" }}>
        <div className="container-content">
          <nav style={{ fontSize: "12px", color: "#999", display: "flex", alignItems: "center", gap: "4px" }}>
            <Link href="/" style={{ color: "#999", textDecoration: "none" }}>TOP</Link>
            <ChevronRight size={12} />
            <span style={{ color: "#333" }}>WEBチラシ</span>
          </nav>
        </div>
      </div>

      <div className="container-content" style={{ padding: "32px 0 20px" }}>
        <h1 style={{ fontSize: "clamp(22px, 3vw, 32px)", fontWeight: "bold", color: "#1a1a1a", fontFamily: "'Noto Serif JP', serif" }}>
          WEBチラシ
        </h1>
        <p style={{ fontSize: "14px", color: "#666", marginTop: "8px" }}>
          最新のチラシ情報をご覧いただけます。
        </p>
      </div>

      <div className="container-content" style={{ paddingBottom: "64px" }}>
        {flyers.length === 0 ? (
          <div style={{ padding: "64px 0", textAlign: "center", color: "#999" }}>
            <FileText size={48} style={{ color: "#E5E5E5", margin: "0 auto 16px", display: "block" }} />
            <p>現在、チラシを準備中です。</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px" }}
            className="grid-cols-1 tb:grid-cols-2 pc:grid-cols-3">
            {flyers.map((flyer) => (
              <div key={flyer.id} style={{ border: "1px solid #E5E5E5", borderRadius: "12px", overflow: "hidden", backgroundColor: "white" }}>
                {/* チラシ表面画像 */}
                {flyer.front_image_url ? (
                  <div style={{ position: "relative", aspectRatio: "3/4" }}>
                    <Image src={flyer.front_image_url} alt={flyer.name}
                      fill style={{ objectFit: "cover" }} sizes="(max-width: 768px) 100vw, 33vw" />
                  </div>
                ) : (
                  <div style={{ aspectRatio: "3/4", backgroundColor: "#F8F8F8", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <FileText size={48} style={{ color: "#ccc" }} />
                  </div>
                )}
                <div style={{ padding: "16px" }}>
                  <p style={{ fontSize: "12px", color: "#888", marginBottom: "4px" }}>{flyer.distribute_month}</p>
                  <p style={{ fontWeight: "bold", fontSize: "14px", color: "#1a1a1a", marginBottom: "12px" }}>{flyer.name}</p>
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    {flyer.back_image_url && (
                      <a href={flyer.back_image_url} target="_blank" rel="noopener noreferrer"
                        style={{ fontSize: "12px", padding: "6px 12px", borderRadius: "6px", border: "1px solid #E5E5E5", color: "#555", textDecoration: "none" }}>
                        裏面を見る
                      </a>
                    )}
                    {flyer.pdf_url && (
                      <a href={flyer.pdf_url} target="_blank" rel="noopener noreferrer"
                        style={{ fontSize: "12px", padding: "6px 12px", borderRadius: "6px", backgroundColor: "#5BAD52", color: "white", textDecoration: "none", display: "flex", alignItems: "center", gap: "4px" }}>
                        <Download size={12} />
                        PDFダウンロード
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
