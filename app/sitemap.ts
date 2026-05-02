// app/sitemap.ts
import type { MetadataRoute } from "next";
import { areaContents } from "@/lib/areaContents";

const BASE_URL = "https://index.felia-home.co.jp";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "daily", priority: 1.0 },
    { url: `${BASE_URL}/search`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/properties`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/felia-selection`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/buy`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/sell`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/news`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE_URL}/recruit`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/privacy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
  ];

  // エリアページ
  const areaPages: MetadataRoute.Sitemap = Object.keys(areaContents).map((area) => ({
    url: `${BASE_URL}/areas/${encodeURIComponent(area)}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // 物件一覧
  let propertyPages: MetadataRoute.Sitemap = [];
  try {
    const res = await fetch(
      `${process.env.ADMIN_API_URL}/api/properties?published_hp=true&limit=500`,
      { cache: "no-store" }
    );
    const data = await res.json();
    propertyPages = (data.properties ?? []).map((p: any) => ({
      url: `${BASE_URL}/properties/${p.id}`,
      lastModified: new Date(p.updated_at ?? new Date()),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));
  } catch {}

  // ニュース
  let newsPages: MetadataRoute.Sitemap = [];
  try {
    const res = await fetch(
      `${process.env.ADMIN_API_URL}/api/hp/news?limit=100`,
      { cache: "no-store" }
    );
    const data = await res.json();
    newsPages = (data.news ?? []).map((n: any) => ({
      url: `${BASE_URL}/news/${n.id}`,
      lastModified: new Date(n.published_at ?? new Date()),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    }));
  } catch {}

  return [...staticPages, ...areaPages, ...propertyPages, ...newsPages];
}
