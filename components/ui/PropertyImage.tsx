"use client";

// components/ui/PropertyImage.tsx
import Image from "next/image";
import { useMemo } from "react";

const PLACEHOLDERS = [
  "/images/no-image/placeholder-1.jpg",
  "/images/no-image/placeholder-2.jpg",
  "/images/no-image/placeholder-3.jpg",
  "/images/no-image/placeholder-4.jpg",
  "/images/no-image/placeholder-5.jpg",
  "/images/no-image/placeholder-6.jpg",
  "/images/no-image/placeholder-7.jpg",
  "/images/no-image/placeholder-8.jpg",
];

interface PropertyImageProps {
  src?: string | null;
  alt?: string;
  sizes?: string;
  quality?: number;
  seed?: string;
}

export function PropertyImage({
  src,
  alt = "物件画像",
  sizes = "33vw",
  quality = 80,
  seed,
}: PropertyImageProps) {
  const placeholderSrc = useMemo(() => {
    if (seed) {
      const index = seed.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) % PLACEHOLDERS.length;
      return PLACEHOLDERS[index];
    }
    return PLACEHOLDERS[Math.floor(Math.random() * PLACEHOLDERS.length)];
  }, [seed]);

  const imageSrc = src ?? placeholderSrc;

  return (
    <Image
      src={imageSrc}
      alt={alt}
      fill
      quality={quality}
      style={{ objectFit: "cover", objectPosition: "center" }}
      sizes={sizes}
    />
  );
}
