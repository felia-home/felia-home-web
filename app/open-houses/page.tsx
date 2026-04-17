// app/open-houses/page.tsx
import Link from "next/link";
import { MapPin, Train, Clock, ChevronRight } from "lucide-react";
import { getOpenHouses } from "@/lib/api";
import type { OpenHouse } from "@/lib/api";

export const metadata = { title: "現地販売会情報 | フェリアホーム" };

const PROPERTY_TYPE_MAP: Record<string, string> = {
  NEW_HOUSE: "新築戸建て",
  USED_HOUSE: "中古戸建",
  MANSION: "マンション",
  LAND: "土地",
  OTHER: "その他",
};

function formatDateRange(
  start: string | null | undefined,
  end: string | null | undefined
): string {
  const fmt = (dateStr: string | null | undefined) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "";
    return `${d.getMonth() + 1}月${d.getDate()}日`;
  };
  const s = fmt(start);
  const e = fmt(end);
  if (!s && !e) return "日程未定";
  if (!e || s === e) return s;
  return `${s} 〜 ${e}`;
}

function formatTime(dateStr: string | null | undefined): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "";
  const h = String(d.getHours()).padStart(2, "0");
  const m = String(d.getMinutes()).padStart(2, "0");
  return `${h}:${m}`;
}

function formatYearMonth(
  dateStr: string | null | undefined
): { year: string; month: string } {
  if (!dateStr) return { year: "—", month: "—" };
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return { year: "—", month: "—" };
  return {
    year: String(d.getFullYear()),
    month: String(d.getMonth() + 1),
  };
}

export default async function OpenHousesPage() {
  let openHouses: OpenHouse[] = [];
  try {
    openHouses = await getOpenHouses();
  } catch {}

  return (
    <div style={{ backgroundColor: "#F8F8F8", minHeight: "100vh" }}>

      {/* ページヘッダー */}
      <div style={{ backgroundColor: "#ffffff", borderBottom: "1px solid #E5E5E5" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 16px" }}>
          {/* パンくず */}
          <nav style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "12px", color: "#aaa", marginBottom: "16px" }}>
            <Link href="/" style={{ color: "#aaa", textDecoration: "none" }}>ホーム</Link>
            <ChevronRight size={10} />
            <span style={{ color: "#555" }}>現地販売会情報</span>
          </nav>
          <span style={{
            fontFamily: "'Montserrat', sans-serif",
            fontWeight: "bold",
            fontSize: "32px",
            letterSpacing: "0.05em",
            color: "#5BAD52",
            display: "block",
            marginBottom: "4px",
          }}>
            Open House
          </span>
          <p style={{ fontSize: "13px", color: "#888", letterSpacing: "0.15em" }}>現地販売会情報</p>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 16px" }}>
        {openHouses.length === 0 ? (
          <div style={{
            backgroundColor: "#ffffff",
            borderRadius: "12px",
            border: "1px solid #E5E5E5",
            padding: "64px 24px",
            textAlign: "center",
          }}>
            <p style={{ fontSize: "15px", color: "#aaa" }}>現在、現地販売会の予定はありません。</p>
            <p style={{ fontSize: "13px", color: "#bbb", marginTop: "8px" }}>
              次回の開催情報はお知らせよりご確認ください。
            </p>
            <Link
              href="/news"
              style={{
                display: "inline-block",
                marginTop: "24px",
                padding: "10px 28px",
                backgroundColor: "#5BAD52",
                color: "#ffffff",
                borderRadius: "6px",
                fontSize: "13px",
                fontWeight: "bold",
                textDecoration: "none",
              }}
            >
              お知らせを見る
            </Link>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {openHouses.map((oh) => (
              <OpenHouseCard key={oh.id} openHouse={oh} />
            ))}
          </div>
        )}
      </div>

      {/* CTAセクション */}
      <div style={{
        backgroundColor: "#0D2818",
        padding: "56px 16px",
        marginTop: "24px",
      }}>
        <div style={{ maxWidth: "700px", margin: "0 auto", textAlign: "center" }}>
          <p style={{ fontSize: "12px", color: "rgba(245,240,232,0.5)", letterSpacing: "0.2em", marginBottom: "8px" }}>
            CONTACT
          </p>
          <p style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: "24px",
            fontWeight: "bold",
            color: "#F5F0E8",
            marginBottom: "12px",
          }}>
            現地販売会のご参加はお気軽に
          </p>
          <p style={{ fontSize: "14px", color: "rgba(245,240,232,0.7)", marginBottom: "32px", lineHeight: 1.8 }}>
            事前予約不要でご参加いただけます。<br />
            詳細についてはお電話またはフォームよりお問い合わせください。
          </p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <a
              href="tel:03XXXXXXXX"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "14px 32px",
                backgroundColor: "#5BAD52",
                color: "#ffffff",
                borderRadius: "6px",
                fontWeight: "bold",
                fontSize: "15px",
                textDecoration: "none",
              }}
            >
              電話で問い合わせる
            </a>
            <Link
              href="/inquiry"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "14px 32px",
                border: "1px solid rgba(201,168,76,0.5)",
                color: "#C9A84C",
                borderRadius: "6px",
                fontWeight: "bold",
                fontSize: "15px",
                textDecoration: "none",
              }}
            >
              メールで問い合わせる
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
}

function OpenHouseCard({ openHouse }: { openHouse: OpenHouse }) {
  const { year, month } = formatYearMonth(openHouse.open_house_start);
  const dateRange = formatDateRange(openHouse.open_house_start, openHouse.open_house_end);
  const startTime = formatTime(openHouse.open_house_start);
  const endTime = formatTime(openHouse.open_house_end);
  const timeRange =
    startTime && endTime ? `${startTime} 〜 ${endTime}` :
    startTime ? `${startTime}〜` : "";
  const typeLabel =
    openHouse.property_type
      ? PROPERTY_TYPE_MAP[openHouse.property_type] ?? openHouse.property_type
      : null;

  return (
    <Link
      href={`/properties/${openHouse.id}`}
      style={{
        display: "flex",
        gap: "16px",
        backgroundColor: "#ffffff",
        borderRadius: "12px",
        border: "1px solid #E5E5E5",
        padding: "20px",
        textDecoration: "none",
        color: "inherit",
        alignItems: "flex-start",
      }}
    >
      {/* 年月ブロック */}
      <div style={{
        flexShrink: 0,
        width: "64px",
        borderRadius: "8px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "10px 4px",
        backgroundColor: "#EBF7EA",
      }}>
        <span style={{
          fontFamily: "'Montserrat', sans-serif",
          fontWeight: "bold",
          fontSize: "11px",
          color: "#5BAD52",
          letterSpacing: "0.05em",
        }}>
          {year}
        </span>
        <span style={{
          fontFamily: "'Montserrat', sans-serif",
          fontWeight: "bold",
          fontSize: "26px",
          lineHeight: 1,
          color: "#5BAD52",
        }}>
          {month}
        </span>
        <span style={{ fontSize: "10px", color: "#5BAD52", marginTop: "2px" }}>月</span>
      </div>

      {/* 物件情報 */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", marginBottom: "6px" }}>
          {typeLabel && (
            <span style={{
              fontSize: "10px",
              fontWeight: "bold",
              padding: "2px 8px",
              borderRadius: "3px",
              backgroundColor: "#5BAD52",
              color: "#ffffff",
            }}>
              {typeLabel}
            </span>
          )}
          <p style={{
            fontSize: "15px",
            fontWeight: "bold",
            color: "#333",
            margin: 0,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}>
            {openHouse.title ?? "物件名未設定"}
          </p>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", marginBottom: "8px" }}>
          <span style={{ fontSize: "13px", color: "#555" }}>
            {dateRange}
          </span>
          {timeRange && (
            <span style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              fontSize: "12px",
              color: "#888",
            }}>
              <Clock size={11} style={{ color: "#5BAD52" }} />
              {timeRange}
            </span>
          )}
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
          {(openHouse.city || openHouse.address) && (
            <span style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              fontSize: "12px",
              color: "#888",
            }}>
              <MapPin size={11} style={{ color: "#5BAD52" }} />
              {openHouse.city ?? ""}{openHouse.address ?? ""}
            </span>
          )}
          {openHouse.station_name1 && (
            <span style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              fontSize: "12px",
              color: "#888",
            }}>
              <Train size={11} style={{ color: "#5BAD52" }} />
              {openHouse.station_name1}
              {openHouse.station_walk1 ? ` 徒歩${openHouse.station_walk1}分` : ""}
            </span>
          )}
        </div>

        {openHouse.price != null && (
          <p style={{ fontSize: "18px", fontWeight: "bold", color: "#5BAD52", marginTop: "8px" }}>
            {openHouse.price.toLocaleString()}万円
          </p>
        )}
      </div>

      <ChevronRight size={18} style={{ color: "#D1D5DB", flexShrink: 0, marginTop: "4px" }} />
    </Link>
  );
}
