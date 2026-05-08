// components/home/OpenHouseAndInfoSection.tsx
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Info } from "lucide-react";
import { getOpenHouses, getInformationNews } from "@/lib/api";
import type { OpenHouse, NewsItem } from "@/lib/api";

const WEEKDAYS = ["日", "月", "火", "水", "木", "金", "土"];

const PROPERTY_TYPE_LABEL: Record<string, string> = {
  LAND: "土地",
  USED_HOUSE: "中古戸建",
  NEW_HOUSE: "新築戸建",
  MANSION: "マンション",
  NEW_MANSION: "新築マンション",
};

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

function formatOpenHouseDate(dateStr: string | null | undefined): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "";
  return `${d.getMonth() + 1}月${d.getDate()}日(${WEEKDAYS[d.getDay()]})`;
}

function formatTime(dateStr: string | null | undefined): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "";
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

function formatTimeRange(start: string | null | undefined, end: string | null | undefined): string {
  const s = formatTime(start);
  const e = formatTime(end);
  if (!s && !e) return "";
  if (!e) return s;
  if (!s) return e;
  return `${s}〜${e}`;
}

function getDisplayArea(oh: OpenHouse): string | null {
  const type = oh.property_type ?? "";
  const isMansion = ["MANSION", "NEW_MANSION"].includes(type);
  const isLand = type === "LAND";
  const m2 = isMansion
    ? oh.area_exclusive_m2
    : isLand
      ? oh.area_land_m2
      : oh.area_build_m2;
  if (m2 == null) return null;
  const label = isMansion ? "専有面積" : isLand ? "土地面積" : "建物面積";
  return `${label} ${Number(m2).toFixed(2)}㎡`;
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
  const dateStr = formatOpenHouseDate(openHouse.open_house_start);
  const timeRange = formatTimeRange(openHouse.open_house_start, openHouse.open_house_end);
  const typeLabel = PROPERTY_TYPE_LABEL[openHouse.property_type ?? ""] ?? "";
  const isMansion = ["MANSION", "NEW_MANSION"].includes(openHouse.property_type ?? "");

  // タイトル: マンション系は building_name 優先、それ以外は city + town
  const heading = isMansion && openHouse.building_name
    ? openHouse.building_name
    : [openHouse.city, openHouse.town].filter(Boolean).join("");

  // サブタイトル: city + town（heading と重複時は非表示）
  const subLine = [openHouse.city, openHouse.town].filter(Boolean).join("");
  const showSubLine = subLine && subLine !== heading;

  const areaText = getDisplayArea(openHouse);
  const mainImage = openHouse.images?.[0]?.url ?? null;

  // 種別 + 間取り
  const typeRoomLine = [typeLabel, openHouse.rooms].filter(Boolean).join("　");

  return (
    <Link
      href={`/properties/${openHouse.id}`}
      style={{
        background: "#fff",
        borderRadius: "12px",
        overflow: "hidden",
        boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
        display: "flex",
        flexDirection: "column",
        textDecoration: "none",
        color: "inherit",
      }}
    >
      {/* サムネイル */}
      {mainImage ? (
        <div style={{ position: "relative", width: "100%", aspectRatio: "16/10", overflow: "hidden", backgroundColor: "#f0f0f0" }}>
          <Image
            src={mainImage}
            alt={heading || "現地販売会"}
            fill
            style={{ objectFit: "cover" }}
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </div>
      ) : (
        <div style={{ width: "100%", aspectRatio: "16/10", backgroundColor: "#EBF7EA", display: "flex", alignItems: "center", justifyContent: "center", color: "#aaa", fontSize: "12px" }}>
          画像準備中
        </div>
      )}

      <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>
        {/* 開催日時 */}
        {dateStr && (
          <div>
            <span style={{
              background: "#c8a96e",
              color: "#fff",
              fontSize: "11px",
              fontWeight: 700,
              padding: "4px 10px",
              borderRadius: "4px",
              display: "inline-block",
              marginBottom: "6px",
              letterSpacing: "0.05em",
            }}>
              開催日時
            </span>
            <p style={{ fontSize: "14px", fontWeight: 600, color: "#333", margin: 0 }}>
              {dateStr}{timeRange && ` ${timeRange}`}
            </p>
          </div>
        )}

        {/* 物件情報 */}
        <div>
          {typeRoomLine && (
            <p style={{ fontSize: "12px", color: "#666", margin: "0 0 4px", letterSpacing: "0.05em" }}>
              {typeRoomLine}
            </p>
          )}
          {heading && (
            <p style={{ fontSize: "15px", fontWeight: 600, color: "#1a1a1a", margin: "0 0 4px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {heading}
            </p>
          )}
          {showSubLine && (
            <p style={{ fontSize: "12px", color: "#888", margin: "0 0 4px" }}>
              {subLine}
            </p>
          )}
          {openHouse.price != null && (
            <p style={{ fontSize: "20px", fontWeight: 700, color: "#c0392b", margin: "4px 0" }}>
              {openHouse.price.toLocaleString()}万円
            </p>
          )}
          {areaText && (
            <p style={{ fontSize: "12px", color: "#666", margin: "2px 0 0" }}>
              {areaText}
            </p>
          )}
          {openHouse.description_hp && (
            <p style={{
              fontSize: "12px",
              color: "#666",
              margin: "6px 0 0",
              lineHeight: 1.6,
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}>
              {openHouse.description_hp}
            </p>
          )}
        </div>

        {/* 詳細ボタン */}
        <span style={{
          display: "block",
          textAlign: "center",
          background: "#1a1a2e",
          color: "#fff",
          padding: "10px",
          borderRadius: "6px",
          fontSize: "13px",
          fontWeight: 600,
          marginTop: "4px",
        }}>
          詳細を見る →
        </span>
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
