// components/home/FeatureSection.tsx
import Link from "next/link";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { getFeatures, type Feature } from "@/lib/api";

interface FeatureSectionProps {
  heading?: string | null;
  subheading?: string | null;
}

export async function FeatureSection({ heading, subheading }: FeatureSectionProps = {}) {
  let features: Feature[] = [];
  try {
    features = await getFeatures();
  } catch {
    // Admin API 未起動時はスキップ
  }

  if (features.length === 0) return null;

  return (
    <section className="section-padding bg-white">
      <div className="container-content">
        <SectionTitle en={heading ?? "Feature"} ja={subheading ?? "特集"} />
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
