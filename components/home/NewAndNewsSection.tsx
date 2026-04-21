// components/home/NewAndNewsSection.tsx
import Link from "next/link";
import { ArrowRight, Bell } from "lucide-react";
import { getNewProperties, getPropertyNews } from "@/lib/api";
import type { Property, NewsItem } from "@/lib/api";

const PROPERTY_TYPE_MAP: Record<string, string> = {
  LAND: "土地",
  USED_HOUSE: "中古戸建",
  NEW_HOUSE: "新築戸建",
  MANSION: "マンション",
  USED_MANSION: "中古マンション",
  NEW_MANSION: "新築マンション",
  OTHER: "その他",
};

function formatPropertyDate(dateStr: string | null | undefined): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "";
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

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
              <Link href="/properties" style={{ color: "#5BAD52", fontSize: "12px", display: "flex", alignItems: "center", gap: "4px" }}>
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
  // APIはsnake_caseで返すため両方に対応
  const typeKey = property.property_type ?? property.propertyType ?? "";
  const typeLabel = PROPERTY_TYPE_MAP[typeKey] ?? (typeKey || "物件");
  const location =
    [property.city, property.town].filter(Boolean).join("") ||
    (property.address ?? "") ||
    "所在地未定";
  const floorPlan = property.rooms ?? (property as any).floor_plan ?? property.layout ?? null;
  const dateStr = property.created_at ?? property.createdAt ?? property.published_at ?? (property as any).updated_at ?? "";

  return (
    <Link
      href={`/properties/${property.id}`}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "10px 0",
        borderBottom: "1px solid #f0f0f0",
        textDecoration: "none",
        color: "inherit",
      }}
    >
      {/* 物件種別バッジ */}
      <span style={{
        fontSize: "10px",
        padding: "2px 6px",
        borderRadius: "3px",
        backgroundColor: "#e8f5e6",
        color: "#5BAD52",
        whiteSpace: "nowrap",
        flexShrink: 0,
      }}>
        {typeLabel}
      </span>

      {/* 場所 */}
      <span style={{
        fontSize: "13px",
        color: "#333",
        flex: 1,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
      }}>
        {location}
      </span>

      {/* 間取り */}
      {floorPlan && (
        <span style={{
          fontSize: "12px",
          color: "#666",
          whiteSpace: "nowrap",
          flexShrink: 0,
        }}>
          {floorPlan}
        </span>
      )}

      {/* 価格 */}
      <span style={{
        fontSize: "13px",
        fontWeight: "bold",
        color: "#5BAD52",
        whiteSpace: "nowrap",
        flexShrink: 0,
      }}>
        {property.price != null
          ? `${property.price.toLocaleString()}万円`
          : (property as any).salesPrice != null
          ? `${(property as any).salesPrice.toLocaleString()}万円`
          : "価格未定"}
      </span>

      {/* 日付 */}
      <span style={{
        fontSize: "11px",
        color: "#aaa",
        whiteSpace: "nowrap",
        flexShrink: 0,
      }}>
        {formatPropertyDate(dateStr)}
      </span>
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
