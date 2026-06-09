// components/home/SearchSection.tsx
import Link from "next/link";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { TokyoWardMap } from "./TokyoWardMap";
import { Train } from "lucide-react";
import { getLines, type LineSetting } from "@/lib/api";

// admin 未登録時のフォールバック（現状のハードコード路線一覧）
// admin の AreaSetting (area_type=line) に1件でも登録が入れば DB 表示に切り替わる
const FALLBACK_LINE_GROUPS = [
  {
    group: "JR",
    lines: [
      { name: "JR山手線",       href: "/properties?line=山手線" },
      { name: "JR中央線",       href: "/properties?line=中央線" },
      { name: "JR埼京線",       href: "/properties?line=埼京線" },
      { name: "JR京浜東北線",   href: "/properties?line=京浜東北線" },
    ],
  },
  {
    group: "東急",
    lines: [
      { name: "東急東横線",     href: "/properties?line=東横線" },
      { name: "東急田園都市線", href: "/properties?line=田園都市線" },
      { name: "東急目黒線",     href: "/properties?line=目黒線" },
    ],
  },
  {
    group: "東京メトロ",
    lines: [
      { name: "銀座線",         href: "/properties?line=銀座線" },
      { name: "丸ノ内線",       href: "/properties?line=丸ノ内線" },
      { name: "半蔵門線",       href: "/properties?line=半蔵門線" },
      { name: "日比谷線",       href: "/properties?line=日比谷線" },
      { name: "東西線",         href: "/properties?line=東西線" },
      { name: "副都心線",       href: "/properties?line=副都心線" },
    ],
  },
  {
    group: "私鉄・都営",
    lines: [
      { name: "小田急小田原線", href: "/properties?line=小田原線" },
      { name: "京王線",         href: "/properties?line=京王線" },
      { name: "西武池袋線",     href: "/properties?line=西武池袋線" },
      { name: "西武新宿線",     href: "/properties?line=西武新宿線" },
      { name: "都営新宿線",     href: "/properties?line=新宿線" },
      { name: "都営三田線",     href: "/properties?line=三田線" },
      { name: "都営大江戸線",   href: "/properties?line=大江戸線" },
    ],
  },
];

export async function SearchSection() {
  let dbLines: LineSetting[] = [];
  try {
    dbLines = await getLines();
  } catch {
    dbLines = [];
  }
  const useDb = dbLines.length > 0;

  return (
    <section style={{ padding: "64px 0", backgroundColor: "#F8F8F8" }}>
      <div className="container-content">
        <SectionTitle en="Search" ja="物件検索" />

        <div
          className="grid-2col-resp"
          style={{ gap: "32px", alignItems: "start" }}
        >
          {/* 左: SVGクリッカブルマップ */}
          <div>
            <TokyoWardMap />
          </div>

          {/* 右: 路線テキストリンク */}
          <div>
            <p style={{
              fontSize: "12px", fontWeight: "bold", color: "#999",
              letterSpacing: "0.1em", marginBottom: "20px", textAlign: "center",
            }}>
              路線から探す
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {useDb ? (
                <DbLineList lines={dbLines} />
              ) : (
                FALLBACK_LINE_GROUPS.map((group) => (
                  <LineGroupBlock key={group.group} group={group} />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function DbLineList({ lines }: { lines: LineSetting[] }) {
  // DB 路線は管理側で sort_order 昇順に整列済み。
  // エリア（区）と同じく単純なフラット並び。グルーピングは持たない（admin にグループ概念がないため）。
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
        <Train size={14} style={{ color: "#5BAD52" }} />
        <span style={{
          fontSize: "11px", fontWeight: "bold", color: "#999", letterSpacing: "0.1em",
        }}>
          沿線一覧
        </span>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
        {lines.map((line) => (
          <Link
            key={line.id}
            href={line.link_url || `/properties?line=${encodeURIComponent(line.area_name)}`}
            className="line-link"
            style={{
              fontSize: "13px",
              padding: "6px 12px",
              borderRadius: "6px",
              border: "1px solid #E5E5E5",
              color: "#555",
              backgroundColor: "white",
              textDecoration: "none",
              transition: "all 0.2s ease",
            }}
          >
            {line.area_name}
          </Link>
        ))}
      </div>
    </div>
  );
}

function LineGroupBlock({
  group,
}: {
  group: { group: string; lines: { name: string; href: string }[] };
}) {
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
        <Train size={14} style={{ color: "#5BAD52" }} />
        <span style={{
          fontSize: "11px", fontWeight: "bold", color: "#999", letterSpacing: "0.1em",
        }}>
          {group.group}
        </span>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
        {group.lines.map((line) => (
          <Link
            key={line.name}
            href={line.href}
            className="line-link"
            style={{
              fontSize: "13px",
              padding: "6px 12px",
              borderRadius: "6px",
              border: "1px solid #E5E5E5",
              color: "#555",
              backgroundColor: "white",
              textDecoration: "none",
              transition: "all 0.2s ease",
            }}
          >
            {line.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
