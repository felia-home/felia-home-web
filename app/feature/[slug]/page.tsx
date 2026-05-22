import { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getFeatures, type Feature, type Property } from "@/lib/api";
import PropertyCard from "@/components/property/PropertyCard";

async function getFeatureProperties(feature: Feature): Promise<Property[]> {
  try {
    const adminUrl = process.env.ADMIN_API_URL ?? "http://localhost:3001";
    const url = new URL(`${adminUrl}/api/properties`);
    url.searchParams.set("status", "PUBLISHED");
    url.searchParams.set("published_hp", "true");
    url.searchParams.set("limit", String(feature.display_limit ?? 20));

    if (feature.conditions && typeof feature.conditions === "object") {
      Object.entries(feature.conditions).forEach(([k, v]) => {
        if (v !== null && v !== undefined && v !== "") {
          url.searchParams.set(k, String(v));
        }
      });
    } else if (typeof feature.conditions === "string" && feature.conditions) {
      const params = new URLSearchParams(feature.conditions);
      params.forEach((v, k) => {
        if (v) url.searchParams.set(k, v);
      });
    }

    if (feature.sort_type) {
      url.searchParams.set("sort", feature.sort_type);
    }

    const res = await fetch(url.toString(), { cache: "no-store" });
    if (!res.ok) return [];
    const data = await res.json();
    return data.properties ?? [];
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  let features: Feature[] = [];
  try {
    features = await getFeatures();
  } catch {}
  const feature = features.find((f) => f.slug === params.slug);
  if (!feature) return { title: "特集" };
  return {
    title: feature.title,
    description: feature.subTitle || undefined,
  };
}

export default async function FeatureSlugPage({
  params,
}: {
  params: { slug: string };
}) {
  let features: Feature[] = [];
  try {
    features = await getFeatures();
  } catch {}

  const feature = features.find((f) => f.slug === params.slug);
  if (!feature) notFound();

  const properties = await getFeatureProperties(feature);

  const heroImage = feature.hero_image_url || feature.image;

  return (
    <main style={{ backgroundColor: "#fff", minHeight: "100vh" }}>
      {heroImage && (
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "400px",
            overflow: "hidden",
          }}
        >
          <Image
            src={heroImage}
            alt={feature.title}
            fill
            style={{ objectFit: "cover" }}
            priority
            sizes="100vw"
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(0,0,0,0.4)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              textAlign: "center",
              padding: "0 24px",
            }}
          >
            <h1 style={{ fontSize: "32px", fontWeight: 800, margin: 0 }}>
              {feature.title}
            </h1>
            {feature.subTitle && (
              <p
                style={{
                  fontSize: "16px",
                  margin: "12px 0 0",
                  opacity: 0.9,
                }}
              >
                {feature.subTitle}
              </p>
            )}
          </div>
        </div>
      )}

      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "48px 24px",
        }}
      >
        <h2
          style={{
            fontSize: "22px",
            fontWeight: 700,
            color: "#333",
            marginBottom: "32px",
          }}
        >
          {feature.title}の物件一覧
          <span
            style={{
              fontSize: "14px",
              color: "#888",
              fontWeight: 400,
              marginLeft: "12px",
            }}
          >
            {properties.length}件
          </span>
        </h2>

        {properties.length === 0 ? (
          <p
            style={{
              color: "#888",
              textAlign: "center",
              padding: "40px 0",
            }}
          >
            現在掲載中の物件はありません
          </p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fill, minmax(320px, 1fr))",
              gap: "24px",
            }}
          >
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
