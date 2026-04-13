// components/home/FeatureSection.tsx
// Phase 2: admin側の features テーブル・API が完成次第実装
// 現時点では app/page.tsx に組み込まない

import Link from "next/link";
import { SectionTitle } from "@/components/ui/SectionTitle";

interface Feature {
  id: string;
  slug: string;
  title: string;
  subTitle: string;
  image: string;
  href: string;
}

// TODO: getFeatures() を lib/api.ts に追加して差し替え
async function getFeatures(): Promise<Feature[]> {
  return [];
}

export async function FeatureSection() {
  const features = await getFeatures();
  if (features.length === 0) return null;

  return (
    <section className="section-padding bg-white">
      <div className="container-content">
        <SectionTitle en="Feature" ja="特集" />
        <div className="grid grid-cols-1 tb:grid-cols-3 gap-4 tb:gap-6">
          {features.slice(0, 3).map((feature) => (
            <Link
              key={feature.id}
              href={feature.href}
              className="group relative block overflow-hidden rounded-lg"
              style={{ paddingBottom: "65%" }}
            >
              <div className="absolute inset-0">
                <div
                  className="absolute inset-0"
                  style={{ backgroundImage: `url(${feature.image})`, backgroundSize: "cover" }}
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                  <p className="text-white font-bold text-lg leading-snug">{feature.title}</p>
                  <p className="text-white/70 text-sm mt-1">{feature.subTitle}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
