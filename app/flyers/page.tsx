// app/flyers/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, FileText } from "lucide-react";
import { getWebFlyers } from "@/lib/api";
import { FlyerCard } from "@/components/flyers/FlyerCard";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "WEBチラシ",
  description: "フェリアホームの最新チラシ情報をご覧いただけます。",
};

export default async function FlyersPage() {
  const flyers = await getWebFlyers();
  const sorted = [...flyers].sort((a, b) => a.sort_order - b.sort_order);

  return (
    <div style={{ backgroundColor: "#ffffff" }}>

      {/* パンくず */}
      <div style={{ backgroundColor: "#F8F8F8", padding: "8px 0" }}>
        <div className="container-content">
          <nav style={{ fontSize: "12px", color: "#999", display: "flex", alignItems: "center", gap: "4px" }}>
            <Link href="/" style={{ color: "#999", textDecoration: "none" }}>TOP</Link>
            <ChevronRight size={12} />
            <span style={{ color: "#333" }}>WEBチラシ</span>
          </nav>
        </div>
      </div>

      {/* ページヘッダー */}
      <div style={{ padding: "48px 24px 32px", textAlign: "center" }}>
        <p style={{
          fontFamily: "'Montserrat', sans-serif",
          color: "#5BAD52",
          fontSize: "13px",
          letterSpacing: "0.12em",
          fontWeight: "600",
          marginBottom: "8px",
        }}>
          WEB FLYER
        </p>
        <h1 style={{
          fontSize: "clamp(22px, 3vw, 32px)",
          fontWeight: "bold",
          color: "#1a1a1a",
          fontFamily: "'Noto Serif JP', serif",
          margin: "0 0 8px",
        }}>
          WEBチラシ
        </h1>
        <p style={{ color: "#666", fontSize: "14px" }}>
          最新のチラシ情報をご覧いただけます。
        </p>
      </div>

      {/* チラシグリッド */}
      {sorted.length === 0 ? (
        <div style={{ padding: "64px 24px", textAlign: "center", color: "#999" }}>
          <FileText size={48} style={{ color: "#E5E5E5", margin: "0 auto 16px", display: "block" }} />
          <p>現在、チラシを準備中です。</p>
        </div>
      ) : (
        <div className="flyers-grid" style={{ maxWidth: "1200px", margin: "0 auto" }}>
          {sorted.map((flyer) => (
            <FlyerCard key={flyer.id} flyer={flyer} />
          ))}
        </div>
      )}

    </div>
  );
}
