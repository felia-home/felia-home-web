// app/areas/[area]/page.tsx
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { getAreaContent, areaContents } from "@/lib/areaContents";
import { getProperties } from "@/lib/api";
import { PropertyCard } from "@/components/property/PropertyCard";
import { MapPin, ChevronRight } from "lucide-react";

interface PageProps {
  params: { area: string };
}

export async function generateStaticParams() {
  return Object.keys(areaContents).map((area) => ({
    area: encodeURIComponent(area),
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const areaName = decodeURIComponent(params.area);
  const content = getAreaContent(areaName);
  return {
    title: `${areaName}の不動産情報`,
    description: content.description,
    keywords: content.keywords.join(", "),
  };
}

export default async function AreaPage({ params }: PageProps) {
  const areaName = decodeURIComponent(params.area);
  const content  = getAreaContent(areaName);

  if (!areaContents[areaName]) notFound();

  let result = { properties: [] as any[], total: 0, page: 1, limit: 12, totalPages: 0 };
  try {
    result = await getProperties({ area: areaName, limit: 12 });
  } catch {}

  return (
    <div className="bg-white min-h-screen">

      {/* ヒーロー */}
      <div
        className="relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #1a3a1a 0%, #2d5a2d 50%, #5BAD52 100%)" }}
      >
        <div className="container-content py-12 tb:py-16 relative z-10">
          {/* パンくず */}
          <nav className="flex items-center gap-1.5 text-xs mb-4" style={{ color: "rgba(255,255,255,0.6)" }}>
            <Link href="/" className="hover:text-white transition-colors">ホーム</Link>
            <ChevronRight size={10} />
            <Link href="/properties" className="hover:text-white transition-colors">物件一覧</Link>
            <ChevronRight size={10} />
            <span className="text-white">{areaName}</span>
          </nav>

          <div className="flex items-start gap-3 mb-4">
            <MapPin size={28} className="flex-shrink-0 mt-1" style={{ color: "rgba(255,255,255,0.8)" }} />
            <div>
              <p className="text-xs tracking-widest mb-1" style={{ color: "rgba(255,255,255,0.6)" }}>
                AREA GUIDE
              </p>
              <h1 className="font-bold text-white" style={{ fontSize: "clamp(28px, 4vw, 48px)" }}>
                {areaName}
              </h1>
              <p className="text-white/80 mt-1" style={{ fontSize: "clamp(14px, 2vw, 18px)" }}>
                {content.catchCopy}
              </p>
            </div>
          </div>

          <p
            className="leading-relaxed max-w-2xl"
            style={{ color: "rgba(255,255,255,0.7)", fontSize: "clamp(13px, 1.6vw, 15px)" }}
          >
            {content.description}
          </p>

          {/* ハイライト */}
          <div className="flex flex-wrap gap-3 mt-5">
            {content.highlights.map((h, i) => (
              <div
                key={i}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
                style={{ backgroundColor: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)" }}
              >
                <span className="text-xs" style={{ color: "rgba(255,255,255,0.6)" }}>0{i + 1}</span>
                <span className="text-white text-xs font-medium">{h}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 物件一覧 */}
      <div className="container-content py-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-bold text-gray-800 text-xl">
            {areaName}の物件一覧
            <span className="ml-2 text-base font-normal text-gray-500">
              （{result.total}件）
            </span>
          </h2>
          <Link
            href={`/properties?area=${encodeURIComponent(areaName)}`}
            className="text-sm flex items-center gap-1 hover:gap-2 transition-all"
            style={{ color: "#5BAD52" }}
          >
            すべて見る <ChevronRight size={14} />
          </Link>
        </div>

        {result.properties.length === 0 ? (
          <div className="py-16 text-center">
            <MapPin size={40} className="mx-auto mb-3" style={{ color: "#E5E5E5" }} />
            <p className="text-gray-400">現在このエリアの物件は準備中です</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 tb:grid-cols-2 pc:grid-cols-3 gap-4 tb:gap-5">
            {result.properties.map((property: any) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
