// app/news/[id]/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { notFound } from "next/navigation";
import { getNewsById } from "@/lib/api";

export const revalidate = 600;

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const news = await getNewsById(params.id);
  if (!news) return { title: "お知らせが見つかりません" };
  return { title: news.title };
}

export default async function NewsDetailPage({ params }: { params: { id: string } }) {
  const news = await getNewsById(params.id);
  if (!news) notFound();

  const rawDate = news.published_at ?? "";
  const dateObj = rawDate ? new Date(rawDate) : null;
  const date = dateObj && !isNaN(dateObj.getTime())
    ? `${dateObj.getFullYear()}年${dateObj.getMonth() + 1}月${dateObj.getDate()}日`
    : "";

  return (
    <div style={{ backgroundColor: "#ffffff" }}>

      {/* パンくず */}
      <div style={{ backgroundColor: "#F8F8F8", padding: "8px 0" }}>
        <div className="container-content">
          <nav style={{ fontSize: "12px", color: "#999", display: "flex", alignItems: "center", gap: "4px" }}>
            <Link href="/" style={{ color: "#999", textDecoration: "none" }}>TOP</Link>
            <ChevronRight size={12} />
            <Link href="/news" style={{ color: "#999", textDecoration: "none" }}>お知らせ</Link>
            <ChevronRight size={12} />
            <span style={{ color: "#333", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "200px" }}>
              {news.title}
            </span>
          </nav>
        </div>
      </div>

      {/* 記事本文 */}
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "48px 24px 80px" }}>
        <div style={{
          backgroundColor: "#fff",
          border: "1px solid #E5E5E5",
          borderRadius: "8px",
          padding: "40px",
        }}>
          {/* メタ情報 */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
            {date && (
              <span style={{ fontSize: "13px", color: "#999" }}>{date}</span>
            )}
            <span style={{
              fontSize: "11px",
              padding: "2px 10px",
              borderRadius: "20px",
              backgroundColor: news.news_type === "property" ? "#EBF7EA" : "#F0F0F0",
              color: news.news_type === "property" ? "#5BAD52" : "#666",
              fontWeight: "500",
            }}>
              {news.category}
            </span>
          </div>

          <h1 style={{
            fontSize: "clamp(18px, 2.5vw, 24px)",
            fontWeight: "bold",
            color: "#1a1a1a",
            margin: "0 0 32px",
            lineHeight: 1.5,
          }}>
            {news.title}
          </h1>

          <div style={{ fontSize: "14px", color: "#333", lineHeight: 1.8, whiteSpace: "pre-line" }}>
            {(news as any).body ?? (news as any).content ?? ""}
          </div>
        </div>

        {/* 一覧へ戻る */}
        <div style={{ marginTop: "32px", textAlign: "center" }}>
          <Link
            href="/news"
            style={{
              display: "inline-block",
              border: "1px solid #5BAD52",
              color: "#5BAD52",
              padding: "10px 32px",
              borderRadius: "4px",
              fontSize: "13px",
              textDecoration: "none",
            }}
          >
            ← お知らせ一覧へ
          </Link>
        </div>
      </div>
    </div>
  );
}
