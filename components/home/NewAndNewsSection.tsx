// components/home/NewAndNewsSection.tsx
import Link from "next/link";
import { ArrowRight, Home, Bell } from "lucide-react";
import { getNewProperties, getPropertyNews } from "@/lib/api";
import type { Property, NewsItem } from "@/lib/api";

interface NewAndNewsSectionProps {
  heading?: string | null;
  subheading?: string | null;
}

export async function NewAndNewsSection(_props: NewAndNewsSectionProps = {}) {
  let newProperties: Property[] = [];
  let newsItems: NewsItem[] = [];

  try {
    [newProperties, newsItems] = await Promise.all([
      getNewProperties(),
      getPropertyNews(5),
    ]);
  } catch {
    // Admin APIが未起動の場合はスキップ
  }

  return (
    <section style={{ backgroundColor: "#F8F8F8", padding: "48px 0" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 16px" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "48px",
        }}>

          {/* 左: 新着物件 */}
          <div>
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "24px" }}>
              <div>
                <span style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontWeight: "bold",
                  fontSize: "28px",
                  letterSpacing: "0.1em",
                  color: "#5BAD52",
                  display: "block",
                }}>
                  NEW
                </span>
                <p style={{ fontSize: "11px", color: "#aaa", letterSpacing: "0.2em", margin: "2px 0 0" }}>新着物件情報</p>
                <div style={{ marginTop: "8px", width: "32px", height: "2px", backgroundColor: "#5BAD52" }} />
              </div>
              <Link href="/properties?flag=new" style={{ color: "#5BAD52", fontSize: "12px", display: "flex", alignItems: "center", gap: "4px" }}>
                もっと見る <ArrowRight size={12} />
              </Link>
            </div>

            <div style={{ borderTop: "1px solid #E5E5E5" }}>
              {newProperties.length === 0 ? (
                <p style={{ fontSize: "13px", color: "#aaa", padding: "16px 0" }}>新着物件はありません</p>
              ) : (
                newProperties.slice(0, 5).map((p) => (
                  <NewPropertyRow key={p.id} property={p} />
                ))
              )}
            </div>
          </div>

          {/* 右: お知らせ */}
          <div>
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "24px" }}>
              <div>
                <span style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontWeight: "bold",
                  fontSize: "28px",
                  letterSpacing: "0.1em",
                  color: "#555",
                  display: "block",
                }}>
                  News
                </span>
                <p style={{ fontSize: "11px", color: "#aaa", letterSpacing: "0.2em", margin: "2px 0 0" }}>新着物件のお知らせ</p>
                <div style={{ marginTop: "8px", width: "32px", height: "2px", backgroundColor: "#ccc" }} />
              </div>
              <Link href="/news" style={{ color: "#5BAD52", fontSize: "12px", display: "flex", alignItems: "center", gap: "4px" }}>
                もっと見る <ArrowRight size={12} />
              </Link>
            </div>

            <div style={{ borderTop: "1px solid #E5E5E5" }}>
              {newsItems.length === 0 ? (
                <p style={{ fontSize: "13px", color: "#aaa", padding: "16px 0" }}>お知らせはありません</p>
              ) : (
                newsItems.map((item) => (
                  <NewsRow key={item.id} item={item} />
                ))
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

// 新着物件の1行
function NewPropertyRow({ property }: { property: Property }) {
  const rawDate = property.createdAt ?? (property as any).created_at ?? "";
  const dateObj = rawDate ? new Date(rawDate) : null;
  const date = dateObj && !isNaN(dateObj.getTime())
    ? dateObj.toLocaleDateString("ja-JP", { month: "2-digit", day: "2-digit" })
    : "";

  return (
    <Link
      href={`/properties/${property.id}`}
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "12px",
        padding: "14px 0",
        borderBottom: "1px solid #E5E5E5",
        textDecoration: "none",
        color: "inherit",
      }}
    >
      <Home size={14} style={{ color: "#5BAD52", flexShrink: 0, marginTop: "2px" }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: "13px", color: "#555", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {property.name}
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "2px" }}>
          <span style={{ fontSize: "11px", color: "#aaa" }}>{property.address}</span>
          <span style={{ fontSize: "11px", fontWeight: "600", color: "#5BAD52" }}>
            {property.price.toLocaleString()}万円
          </span>
        </div>
      </div>
      <span style={{ fontSize: "10px", color: "#ccc", flexShrink: 0 }}>{date}</span>
    </Link>
  );
}

// お知らせの1行
function NewsRow({ item }: { item: NewsItem }) {
  const rawDate = item.published_at ?? "";
  const dateObj = rawDate ? new Date(rawDate) : null;
  const date = dateObj && !isNaN(dateObj.getTime())
    ? dateObj.toLocaleDateString("ja-JP", { year: "numeric", month: "2-digit", day: "2-digit" })
    : "";

  return (
    <Link
      href={`/news/${item.id}`}
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "12px",
        padding: "14px 0",
        borderBottom: "1px solid #E5E5E5",
        textDecoration: "none",
        color: "inherit",
      }}
    >
      <Bell size={14} style={{ color: "#aaa", flexShrink: 0, marginTop: "2px" }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: "13px", color: "#555", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {item.title}
        </p>
        <span style={{ fontSize: "10px", color: "#aaa", display: "block", marginTop: "2px" }}>{item.category}</span>
      </div>
      <span style={{ fontSize: "10px", color: "#ccc", flexShrink: 0 }}>{date}</span>
    </Link>
  );
}
