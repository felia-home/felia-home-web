"use client";

import Link from "next/link";
import Image from "next/image";

interface Feature {
  id: string;
  slug: string;
  title: string;
  subTitle: string;
  image: string;
  href: string;
  order: number;
}

interface Props {
  features: Feature[];
}

export default function FeatureSection({ features }: Props) {
  if (!features || features.length === 0) return null;

  return (
    <section style={{ padding: "60px 24px", maxWidth: "1200px", margin: "0 auto" }}>
      {/* セクションヘッダー */}
      <div style={{ textAlign: "center", marginBottom: "40px" }}>
        <p style={{ fontSize: "32px", fontWeight: 800, color: "#2a7a3b", margin: 0, letterSpacing: "0.1em" }}>
          Feature
        </p>
        <p style={{ fontSize: "14px", color: "#666", margin: "4px 0 0" }}>特集</p>
        <div style={{ width: "40px", height: "3px", background: "#2a7a3b", margin: "12px auto 0" }} />
      </div>

      {/* 特集カードグリッド */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
        gap: "24px",
      }}>
        {features.map((feature) => (
          <Link
            key={feature.id}
            href={feature.href || "#"}
            style={{ display: "block", textDecoration: "none" }}
          >
            <div style={{
              position: "relative",
              width: "100%",
              aspectRatio: "16/9",
              overflow: "hidden",
              borderRadius: "12px",
              backgroundColor: "#e0e0e0",
              cursor: "pointer",
            }}>
              {feature.image && (
                <Image
                  src={feature.image}
                  alt={feature.title}
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="(max-width: 768px) 100vw, 33vw"
                  priority={false}
                />
              )}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
