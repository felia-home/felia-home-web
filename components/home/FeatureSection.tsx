"use client";

import { useState } from "react";
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

function FeatureCard({ feature }: { feature: Feature }) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      href={feature.href || "#"}
      style={{ display: "block", textDecoration: "none" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: "16/9",
          overflow: "hidden",
          borderRadius: "12px",
          backgroundColor: "#f0f0f0",
          transform: hovered ? "translateY(-4px)" : "translateY(0)",
          boxShadow: hovered
            ? "0 12px 32px rgba(0,0,0,0.2)"
            : "0 2px 8px rgba(0,0,0,0.08)",
          transition: "transform 0.25s ease, box-shadow 0.25s ease",
          cursor: "pointer",
        }}
      >
        {feature.image && (
          <Image
            src={feature.image}
            alt={feature.title}
            fill
            style={{
              objectFit: "cover",
            }}
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        )}

        <div
          style={{
            position: "absolute",
            inset: 0,
            background: hovered ? "rgba(0,0,0,0.15)" : "rgba(0,0,0,0)",
            transition: "background 0.25s ease",
          }}
        />
      </div>
    </Link>
  );
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
          <FeatureCard key={feature.id} feature={feature} />
        ))}
      </div>
    </section>
  );
}
