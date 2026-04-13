// components/home/FeliaSectionSelection.tsx
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { getFeaturedProperties } from "@/lib/api";
import type { Property } from "@/lib/api";
import { FeaturedSlider } from "./FeaturedSlider";

export async function FeliaSectionSelection() {
  let properties: Property[] = [];
  try {
    properties = await getFeaturedProperties();
  } catch {
    // Admin APIが未起動の場合はスキップ（開発時）
    properties = [];
  }

  return (
    <section className="section-padding bg-white">
      <div className="container-content">
        <div className="flex items-end justify-between mb-8 tb:mb-12">
          <SectionTitle en="Felia Selection" ja="厳選物件情報" align="left" />
          <Link
            href="/properties?flag=featured"
            className="hidden tb:flex items-center gap-1 text-sm font-medium hover:gap-2 transition-all"
            style={{ color: "#5BAD52" }}
          >
            一覧を見る <ArrowRight size={14} />
          </Link>
        </div>

        {properties.length === 0 ? (
          <EmptyState />
        ) : (
          <FeaturedSlider properties={properties} />
        )}

        {/* SP用「一覧を見る」 */}
        <div className="mt-6 text-center tb:hidden">
          <Link
            href="/properties?flag=featured"
            className="inline-flex items-center gap-1 text-sm font-medium"
            style={{ color: "#5BAD52" }}
          >
            一覧を見る <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}

function EmptyState() {
  return (
    <div className="grid grid-cols-1 tb:grid-cols-2 gap-4 tb:gap-6">
      {[1, 2].map((i) => (
        <div
          key={i}
          className="rounded-lg border"
          style={{
            borderColor: "#E5E5E5",
            paddingBottom: "55%",
            position: "relative",
            background: "linear-gradient(135deg,#f0f8f0,#e0f0e0)",
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-gray-400 text-sm">厳選物件は準備中です</p>
          </div>
        </div>
      ))}
    </div>
  );
}
