// components/home/FullWidthBannerItem.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import type { Banner } from "@/lib/api";

export function FullWidthBannerItem({ banner }: { banner: Banner }) {
  const [hovered, setHovered] = useState(false);

  if (!banner.image_url) return null;

  const inner = (
    <div style={{ display: "block", width: "100%", overflow: "hidden" }}>
      <Image
        src={banner.image_url}
        alt={banner.title || "バナー"}
        width={1920}
        height={400}
        style={{ display: "block", width: "100%", height: "auto" }}
      />
    </div>
  );

  if (!banner.link_url) return inner;

  return (
    <a
      href={banner.link_url}
      target={banner.link_target === "_blank" ? "_blank" : "_self"}
      rel={banner.link_target === "_blank" ? "noopener noreferrer" : undefined}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "block",
        cursor: "pointer",
        textDecoration: "none",
        opacity: hovered ? 0.85 : 1,
        transition: "opacity 0.2s ease",
      }}
    >
      {inner}
    </a>
  );
}
