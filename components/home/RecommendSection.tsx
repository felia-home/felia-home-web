// components/home/RecommendSection.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { areaGroups, otherArea, type AreaItem } from "@/lib/areaData";
import { getAreaContent } from "@/lib/areaContents";
import { ArrowRight } from "lucide-react";

export function RecommendSection() {
  return (
    <section className="section-padding bg-white">
      <div className="container-content">
        <SectionTitle en="Recommend" ja="エリア別おすすめ物件" />

        <div className="space-y-4">
          {/* グループ1〜4（4枚ずつ） */}
          {areaGroups.map((group, gi) => (
            <div key={gi} className="grid grid-cols-2 tb:grid-cols-4 gap-3 tb:gap-4">
              {group.map((area) => (
                <AreaCard key={area.id} area={area} />
              ))}
            </div>
          ))}

          {/* その他エリア（1枚・幅広） */}
          <div>
            <Link
              href={otherArea.href}
              className="group relative block w-full overflow-hidden rounded-lg"
              style={{ paddingBottom: "20%" }}
            >
              <div className="absolute inset-0">
                <AreaBackground area={otherArea} />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />
                <div className="absolute inset-0 flex items-center justify-center gap-3">
                  <span className="text-white font-bold text-xl tb:text-2xl tracking-widest">
                    {otherArea.name}（東京都内）
                  </span>
                  <span className="flex items-center gap-1 text-white/80 text-sm border border-white/50 rounded px-2 py-0.5">
                    view more <ArrowRight size={12} />
                  </span>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function AreaCard({ area }: { area: AreaItem }) {
  const content = getAreaContent(area.name);

  return (
    <Link
      href={area.href}
      className="group relative block overflow-hidden rounded-lg"
      style={{ paddingBottom: "70%" }}
    >
      <div className="absolute inset-0">
        <AreaBackground area={area} />

        {/* 通常オーバーレイ */}
        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/60 transition-colors duration-300" />

        {/* 通常表示テキスト */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-2
                        group-hover:opacity-0 transition-opacity duration-300">
          <span
            className="text-white font-bold tracking-widest text-center drop-shadow-md"
            style={{ fontSize: "clamp(13px, 2vw, 18px)" }}
          >
            {area.name}
          </span>
          <span className="mt-1.5 text-white/70 text-xs tracking-widest">
            view more
          </span>
        </div>

        {/* ホバー時：説明文オーバーレイ */}
        <div className="absolute inset-0 flex flex-col justify-end p-3
                        opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <p className="text-white font-bold text-sm mb-1 leading-snug">
            {area.name}
          </p>
          <p className="text-white/80 text-[11px] leading-relaxed line-clamp-3">
            {content.catchCopy}
          </p>
          <div className="mt-2 flex flex-wrap gap-1">
            {content.highlights.slice(0, 2).map((h, i) => (
              <span
                key={i}
                className="text-[9px] px-1.5 py-0.5 rounded"
                style={{ backgroundColor: "rgba(91,173,82,0.7)", color: "white" }}
              >
                {h.length > 12 ? h.slice(0, 12) + "…" : h}
              </span>
            ))}
          </div>
        </div>

        {/* 下部グリーンライン */}
        <div
          className="absolute bottom-0 left-0 h-0.5 transition-all duration-500 w-0 group-hover:w-full"
          style={{ backgroundColor: "#5BAD52" }}
        />
      </div>
    </Link>
  );
}

function AreaBackground({ area }: { area: AreaItem }) {
  const [imgError, setImgError] = useState(false);

  if (imgError || !area.image) {
    return (
      <div
        className="absolute inset-0"
        style={{ background: area.gradient }}
      />
    );
  }

  return (
    <Image
      src={area.image}
      alt={`${area.name}のイメージ`}
      fill
      className="object-cover transition-transform duration-500 group-hover:scale-105"
      sizes="(max-width: 768px) 50vw, 25vw"
      onError={() => setImgError(true)}
    />
  );
}
