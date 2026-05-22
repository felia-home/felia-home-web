import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getFeatures, type Feature, type Property } from "@/lib/api";
import PropertyCard from "@/components/property/PropertyCard";

async function getFeatureProperties(feature: Feature): Promise<Property[]> {
  try {
    const adminBase = process.env.ADMIN_API_URL ?? "http://localhost:3001";
    const res = await fetch(`${adminBase}/api/hp/properties`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        conditions: feature.conditions ?? {},
        sort_type: feature.sort_type ?? "newest",
        limit: feature.display_limit ?? 20,
        page: 1,
      }),
      cache: "no-store",
    });
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

  const heroImage = feature.hero_image_url ?? feature.image ?? null;

  return (
    <main style={{ backgroundColor: "#fff", minHeight: "100vh" }}>
      {heroImage && (
        <div
          style={{
            width: "100%",
            maxWidth: "1920px",
            margin: "0 auto",
            lineHeight: 0,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={heroImage}
            alt={feature.title}
            style={{
              width: "100%",
              height: "auto",
              display: "block",
            }}
          />
        </div>
      )}

      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "32px 24px",
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
