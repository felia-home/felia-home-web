// components/home/FreeBannerItem.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Banner } from "@/lib/api";

export function FreeBannerItem({ banner }: { banner: Banner }) {
  const [hovered, setHovered] = useState(false);

  const inner = (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        aspectRatio: "16/9",
        backgroundColor: "#f5f5f5",
        cursor: banner.link_url ? "pointer" : "default",
        opacity: hovered ? 0.85 : 1,
        transition: "opacity 0.2s ease",
        overflow: "hidden",
        borderRadius: "4px",
      }}
    >
      <Image
        src={banner.image_url}
        alt={banner.title ?? "バナー"}
        fill
        style={{ objectFit: "contain" }}
        sizes="(max-width: 768px) 100vw, 50vw"
      />
    </div>
  );

  if (banner.link_url) {
    return (
      <Link
        href={banner.link_url}
        target={banner.link_target === "_blank" ? "_blank" : "_self"}
        rel={banner.link_target === "_blank" ? "noopener noreferrer" : undefined}
        style={{ display: "block" }}
      >
        {inner}
      </Link>
    );
  }
  return inner;
}
