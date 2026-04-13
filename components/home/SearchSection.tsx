// components/home/SearchSection.tsx
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { tokyoWards } from "@/lib/tokyoMapData";
import { Train } from "lucide-react";

const lineGroups = [
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

export function SearchSection() {
  const router = useRouter();

  return (
    <section className="section-padding" style={{ backgroundColor: "#F8F8F8" }}>
      <div className="container-content">
        <SectionTitle en="Search" ja="物件検索" />

        <div className="grid grid-cols-1 tb:grid-cols-2 gap-8 tb:gap-12 items-start">

          {/* 左: SVGクリッカブルマップ */}
          <div>
            <h3 className="text-sm font-bold text-gray-500 tracking-widest mb-4 text-center">
              エリアから探す
            </h3>
            <TokyoSVGMap onWardClick={(href) => router.push(href)} />
          </div>

          {/* 右: 路線テキストリンク */}
          <div>
            <h3 className="text-sm font-bold text-gray-500 tracking-widest mb-4 text-center">
              路線から探す
            </h3>
            <div className="space-y-5">
              {lineGroups.map((group) => (
                <div key={group.group}>
                  <div className="flex items-center gap-2 mb-2">
                    <Train size={14} style={{ color: "#5BAD52" }} />
                    <span className="text-xs font-bold text-gray-400 tracking-widest">
                      {group.group}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {group.lines.map((line) => (
                      <Link
                        key={line.name}
                        href={line.href}
                        className="text-sm px-3 py-1.5 rounded border border-gray-200 text-gray-600
                                   hover:border-felia-green hover:text-felia-green
                                   transition-colors duration-200 bg-white"
                      >
                        {line.name}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// SVGマップコンポーネント
function TokyoSVGMap({ onWardClick }: { onWardClick: (href: string) => void }) {
  return (
    <div className="relative w-full">
      <svg
        viewBox="0 0 500 430"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        style={{ maxHeight: "420px" }}
      >
        {tokyoWards.map((ward) => (
          <g key={ward.id}>
            {/* パス（区の形） */}
            <path
              d={ward.path}
              fill={ward.clickable ? "#EBF7EA" : "#EEEEEE"}
              stroke="#FFFFFF"
              strokeWidth="1.5"
              className={ward.clickable ? "cursor-pointer" : "cursor-default"}
              style={{ transition: "fill 0.2s ease" }}
              onMouseEnter={(e) => {
                if (ward.clickable) {
                  (e.target as SVGPathElement).setAttribute("fill", "#5BAD52");
                }
              }}
              onMouseLeave={(e) => {
                if (ward.clickable) {
                  (e.target as SVGPathElement).setAttribute("fill", "#EBF7EA");
                }
              }}
              onClick={() => {
                if (ward.clickable && ward.href) {
                  onWardClick(ward.href);
                }
              }}
            />

            {/* 区名ラベル */}
            <text
              x={ward.labelX}
              y={ward.labelY}
              textAnchor="middle"
              dominantBaseline="middle"
              fill={ward.clickable ? "#333333" : "#AAAAAA"}
              fontSize="7"
              fontFamily="'Noto Sans JP', sans-serif"
              fontWeight={ward.clickable ? "700" : "400"}
              style={{ pointerEvents: "none", userSelect: "none" }}
            >
              {ward.name}
            </text>
          </g>
        ))}
      </svg>

      {/* 凡例 */}
      <div className="flex items-center gap-4 mt-3 justify-center text-xs text-gray-500">
        <span className="flex items-center gap-1.5">
          <span
            className="inline-block w-3 h-3 rounded"
            style={{ backgroundColor: "#EBF7EA", border: "1px solid #5BAD52" }}
          />
          対応エリア
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded bg-gray-200" />
          対応エリア外
        </span>
      </div>
    </div>
  );
}
