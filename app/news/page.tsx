// app/news/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { getAllNews } from "@/lib/api";
import type { NewsItem } from "@/lib/api";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "お知らせ",
  description: "フェリアホームからのお知らせ・新着情報をご覧いただけます。",
};

function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "";
  return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")}`;
}

export default async function NewsPage() {
  const allNews = await getAllNews();

  console.log("allNews:", JSON.stringify(allNews.slice(0, 3)));

  const propertyNews = allNews.filter((n) => n.news_type === "property");
  const informationNews = allNews.filter((n) => n.news_type === "information");

  return (
    <div style={{ backgroundColor: "#ffffff" }}>

      {/* パンくず */}
      <div style={{ backgroundColor: "#F8F8F8", padding: "8px 0" }}>
        <div className="container-content">
          <nav style={{ fontSize: "12px", color: "#999", display: "flex", alignItems: "center", gap: "4px" }}>
            <Link href="/" style={{ color: "#999", textDecoration: "none" }}>TOP</Link>
            <ChevronRight size={12} />
            <span style={{ color: "#333" }}>お知らせ</span>
          </nav>
        </div>
      </div>

      {/* ページヘッダー */}
      <div style={{
        padding: "60px 24px 40px",
        textAlign: "center",
        backgroundColor: "#f9f9f9",
        borderBottom: "1px solid #e8e8e8",
      }}>
        <p style={{
          color: "#5BAD52",
          fontSize: "13px",
          letterSpacing: "0.1em",
          margin: "0 0 8px",
          fontFamily: "'Montserrat', sans-serif",
          fontWeight: "600",
        }}>
          NEWS
        </p>
        <h1 style={{
          fontSize: "clamp(24px, 4vw, 36px)",
          fontWeight: "bold",
          color: "#333",
          margin: "0 0 8px",
        }}>
          お知らせ
        </h1>
        <p style={{ color: "#888", fontSize: "14px", margin: 0 }}>
          フェリアホームからの最新情報をご覧いただけます。
        </p>
      </div>

      <main style={{ maxWidth: "800px", margin: "0 auto", padding: "40px 24px 80px" }}>

        {/* 新着物件のお知らせ */}
        {propertyNews.length > 0 && (
          <section style={{ marginBottom: "48px" }}>
            <h2 style={{
              fontSize: "18px",
              fontWeight: "bold",
              color: "#333",
              borderLeft: "4px solid #5BAD52",
              paddingLeft: "12px",
              marginBottom: "16px",
              margin: "0 0 16px",
            }}>
              新着物件のお知らせ
            </h2>
            {propertyNews.map((item) => (
              <NewsRow key={item.id} item={item} />
            ))}
          </section>
        )}

        {/* 会社からのお知らせ */}
        {informationNews.length > 0 && (
          <section>
            <h2 style={{
              fontSize: "18px",
              fontWeight: "bold",
              color: "#333",
              borderLeft: "4px solid #5BAD52",
              paddingLeft: "12px",
              margin: "0 0 16px",
            }}>
              会社からのお知らせ
            </h2>
            {informationNews.map((item) => (
              <NewsRow key={item.id} item={item} />
            ))}
          </section>
        )}

        {/* 全件0の場合 */}
        {allNews.length === 0 && (
          <p style={{ textAlign: "center", color: "#888", padding: "60px 0" }}>
            現在、お知らせはありません。
          </p>
        )}

      </main>
    </div>
  );
}

function NewsRow({ item }: { item: NewsItem }) {
  return (
    <Link
      href={`/news/${item.id}`}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "16px",
        padding: "16px 20px",
        backgroundColor: "#fff",
        border: "1px solid #e8e8e8",
        borderRadius: "8px",
        textDecoration: "none",
        color: "inherit",
        marginBottom: "8px",
      }}
    >
      <span style={{ fontSize: "13px", color: "#888", whiteSpace: "nowrap", flexShrink: 0 }}>
        {formatDate(item.published_at)}
      </span>
      <span style={{
        fontSize: "11px",
        padding: "2px 8px",
        borderRadius: "3px",
        backgroundColor: item.news_type === "property" ? "#e8f5e6" : "#e8f0ff",
        color: item.news_type === "property" ? "#5BAD52" : "#4466cc",
        whiteSpace: "nowrap",
        flexShrink: 0,
      }}>
        {item.news_type === "property" ? "物件情報" : "お知らせ"}
      </span>
      <span style={{ fontSize: "14px", color: "#333", flex: 1 }}>
        {item.title}
      </span>
    </Link>
  );
}
