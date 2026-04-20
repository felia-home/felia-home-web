// components/home/FeliaSectionSelection.tsx
import Link from "next/link";
import { getFeaturedProperties } from "@/lib/api";
import type { Property } from "@/lib/api";
import FeliaSelecitonSlider from "./FeliaSelecitonSlider";

interface FeliaSectionSelectionProps {
  heading?: string | null;
  subheading?: string | null;
}

export async function FeliaSectionSelection({
  heading,
  subheading,
}: FeliaSectionSelectionProps = {}) {
  let properties: Property[] = [];
  try {
    properties = await getFeaturedProperties();
  } catch {
    properties = [];
  }

  return (
    <section style={{ backgroundColor: "#fff", padding: "64px 0" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>

        {/* ヘッダー */}
        <div style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          marginBottom: "36px",
          flexWrap: "wrap",
          gap: "12px",
        }}>
          <div>
            <span style={{
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: "bold",
              fontSize: "32px",
              letterSpacing: "0.05em",
              color: "#5BAD52",
              display: "block",
              lineHeight: 1,
              marginBottom: "6px",
            }}>
              {heading ?? "Felia Selection"}
            </span>
            <p style={{ fontSize: "13px", color: "#888", letterSpacing: "0.15em", margin: 0 }}>
              {subheading ?? "厳選物件情報"}
            </p>
            <div style={{
              marginTop: "10px",
              width: "32px",
              height: "3px",
              backgroundColor: "#5BAD52",
              borderRadius: "2px",
            }} />
          </div>
          <Link
            href="/felia-selection"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              fontSize: "13px",
              fontWeight: "500",
              color: "#5BAD52",
              textDecoration: "none",
            }}
          >
            一覧を見る →
          </Link>
        </div>

        <FeliaSelecitonSlider properties={properties} />
      </div>
    </section>
  );
}
