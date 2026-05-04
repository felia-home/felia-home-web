// components/home/FeatureSection.tsx
import Link from "next/link";
import Image from "next/image";
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
    <section style={{ padding: "64px 0", backgroundColor: "#fff" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>
        <SectionTitle en={heading ?? "Feature"} ja={subheading ?? "特集"} />
        <div className="feature-grid">
          {features.slice(0, 3).map((feature) => (
            <Link
              key={feature.id}
              href={feature.href}
              className="feature-card"
              style={{ paddingBottom: "65%" }}
            >
              <div style={{ position: "absolute", inset: 0 }}>
                {feature.image ? (
                  <Image
                    src={feature.image}
                    alt={feature.title}
                    fill
                    style={{ objectFit: "cover" }}
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                ) : (
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      backgroundImage: `url(${feature.image})`,
                      backgroundSize: "cover",
                    }}
                  />
                )}
                <div className="feature-overlay" />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "16px",
                    textAlign: "center",
                  }}
                >
                  <p
                    style={{
                      color: "#fff",
                      fontWeight: "bold",
                      fontSize: "17px",
                      lineHeight: 1.4,
                      margin: "0 0 4px",
                    }}
                  >
                    {feature.title}
                  </p>
                  <p
                    style={{
                      color: "rgba(255,255,255,0.7)",
                      fontSize: "13px",
                      margin: 0,
                    }}
                  >
                    {feature.subTitle}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
