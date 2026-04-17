// components/home/OpenHouseAndInfoSection.tsx
import Link from "next/link";
import { ArrowRight, MapPin, Info } from "lucide-react";
import { getOpenHouses, getInformationNews } from "@/lib/api";
import type { OpenHouse, NewsItem } from "@/lib/api";

function formatInfoDate(dateStr: string | null | undefined): string {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "";
    return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")}`;
  } catch {
    return "";
  }
}

function formatYearMonth(dateStr: string | null | undefined): { year: string; month: string } {
  if (!dateStr) return { year: "—", month: "—" };
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return { year: "—", month: "—" };
  return { year: String(d.getFullYear()), month: String(d.getMonth() + 1) };
}

function formatDateRange(start: string | null | undefined, end: string | null | undefined): string {
  const fmt = (dateStr: string | null | undefined) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "";
    return `${d.getMonth() + 1}/${d.getDate()}`;
  };
  const s = fmt(start);
  const e = fmt(end);
  if (!s && !e) return "日程未定";
  if (!e) return s;
  return `${s} 〜 ${e}`;
}

export async function OpenHouseAndInfoSection() {
  let openHouses: OpenHouse[] = [];
  let infoItems: NewsItem[] = [];

  try {
    [openHouses, infoItems] = await Promise.all([
      getOpenHouses(),
      getInformationNews(5),
    ]);
  } catch {
    // Admin APIが未起動の場合はスキップ
  }

  return (
    <section style={{ backgroundColor: "#ffffff", padding: "48px 0" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 16px" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "48px",
        }}>

          {/* 左: 現地販売会 */}
          <div>
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "24px" }}>
              <div>
                <span style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontWeight: "bold",
                  fontSize: "24px",
                  letterSpacing: "0.05em",
                  color: "#5BAD52",
                  display: "block",
                }}>
                  Open House
                </span>
                <p style={{ fontSize: "11px", color: "#aaa", letterSpacing: "0.2em", margin: "4px 0 0" }}>現地販売会情報</p>
                <div style={{ marginTop: "8px", width: "32px", height: "2px", backgroundColor: "#5BAD52" }} />
              </div>
              <Link href="/open-houses" style={{ color: "#5BAD52", fontSize: "12px", display: "flex", alignItems: "center", gap: "4px" }}>
                もっと見る <ArrowRight size={12} />
              </Link>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {openHouses.length === 0 ? (
                <p style={{ fontSize: "13px", color: "#aaa", padding: "16px 0" }}>現地販売会の予定はありません</p>
              ) : (
                openHouses.slice(0, 3).map((oh) => (
                  <OpenHouseCard key={oh.id} openHouse={oh} />
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
                  fontSize: "24px",
                  letterSpacing: "0.05em",
                  color: "#555",
                  display: "block",
                }}>
                  Information
                </span>
                <p style={{ fontSize: "11px", color: "#aaa", letterSpacing: "0.2em", margin: "4px 0 0" }}>お知らせ</p>
                <div style={{ marginTop: "8px", width: "32px", height: "2px", backgroundColor: "#ccc" }} />
              </div>
              <Link href="/news" style={{ color: "#5BAD52", fontSize: "12px", display: "flex", alignItems: "center", gap: "4px" }}>
                もっと見る <ArrowRight size={12} />
              </Link>
            </div>

            <div style={{ borderTop: "1px solid #E5E5E5" }}>
              {infoItems.length === 0 ? (
                <p style={{ fontSize: "13px", color: "#aaa", padding: "16px 0" }}>お知らせはありません</p>
              ) : (
                infoItems.map((item) => (
                  <InfoRow key={item.id} item={item} />
                ))
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

// 現地販売会カード
function OpenHouseCard({ openHouse }: { openHouse: OpenHouse }) {
  const { year, month } = formatYearMonth(openHouse.open_house_start);
  const dateRange = formatDateRange(openHouse.open_house_start, openHouse.open_house_end);

  return (
    <Link
      href={`/properties/${openHouse.id}`}
      style={{
        display: "flex",
        gap: "12px",
        padding: "12px",
        borderRadius: "8px",
        border: "1px solid #E5E5E5",
        textDecoration: "none",
        color: "inherit",
      }}
    >
      {/* 年月ブロック */}
      <div style={{
        flexShrink: 0,
        width: "60px",
        borderRadius: "4px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "8px 4px",
        backgroundColor: "#EBF7EA",
      }}>
        <span style={{
          fontFamily: "'Montserrat', sans-serif",
          fontWeight: "bold",
          fontSize: "22px",
          lineHeight: 1,
          color: "#5BAD52",
        }}>
          {year}
        </span>
        <span style={{ fontSize: "12px", color: "#666", marginTop: "4px" }}>
          {month}月
        </span>
      </div>

      {/* 物件情報 */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: "13px", fontWeight: "500", color: "#333", margin: "0 0 4px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {openHouse.title ?? "物件名未設定"}
        </p>
        <p style={{ fontSize: "13px", color: "#555", margin: "0 0 4px" }}>
          {dateRange}
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <MapPin size={10} style={{ color: "#5BAD52" }} />
          <span style={{ fontSize: "11px", color: "#aaa", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {openHouse.city ?? ""}{openHouse.address ?? ""}
          </span>
        </div>
      </div>
    </Link>
  );
}

// お知らせ行
function InfoRow({ item }: { item: NewsItem }) {
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
      <Info size={13} style={{ color: "#5BAD52", flexShrink: 0, marginTop: "2px" }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: "13px", color: "#555", margin: "0 0 2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {item.title}
        </p>
        <span style={{ fontSize: "10px", color: "#aaa" }}>{formatInfoDate(item.published_at)}</span>
      </div>
    </Link>
  );
}
