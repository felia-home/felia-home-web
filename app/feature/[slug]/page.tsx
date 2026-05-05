import { Metadata } from "next";
import Link from "next/link";
import PropertyCard, { type Property } from "@/components/property/PropertyCard";
import { notFound } from "next/navigation";

const AREA_INFO: Record<string, { name: string; description: string; tags: string[] }> = {
  meguro: {
    name: "目黒区",
    description:
      "目黒川の桜並木や中目黒・学芸大学など人気スポットが集まる目黒区。洗練された住宅街と商業エリアが共存し、都心へのアクセスも抜群です。",
    tags: ["中目黒駅", "学芸大学駅", "目黒駅", "都立大学駅", "桜並木"],
  },
  setagaya: {
    name: "世田谷区",
    description:
      "東京23区最大の人口を誇る世田谷区。二子玉川・三軒茶屋・下北沢など個性豊かなエリアが揃い、緑が多く閑静な住宅街が広がります。",
    tags: ["二子玉川駅", "三軒茶屋駅", "下北沢駅", "成城学園前駅", "住宅街"],
  },
  shibuya: {
    name: "渋谷区",
    description:
      "渋谷・原宿・表参道・代々木公園など、トレンドの発信地が集まる渋谷区。再開発が進む渋谷周辺と代々木公園周辺の緑豊かな住宅街が魅力です。",
    tags: ["渋谷駅", "表参道駅", "代々木公園", "恵比寿駅", "再開発"],
  },
  shinagawa: {
    name: "品川区",
    description:
      "新幹線・品川駅を擁する交通の要衝。大崎・五反田のビジネスエリアと武蔵小山・西小山などの下町情緒ある住宅街が共存します。",
    tags: ["品川駅", "五反田駅", "武蔵小山駅", "大井町駅", "新幹線"],
  },
  minato: {
    name: "港区",
    description:
      "六本木・麻布・赤坂など高級住宅街が集まる港区。東京タワー、汐留エリア、品川インターシティなど多彩な顔を持つ東京随一のプレミアムエリアです。",
    tags: ["六本木駅", "麻布十番駅", "広尾駅", "白金台駅", "高級住宅街"],
  },
  nakano: {
    name: "中野区",
    description:
      "中野駅を中心に再開発が進む中野区。新宿まで電車で数分の好立地でありながら、家賃・物価が抑えめで暮らしやすいエリアとして人気が高まっています。",
    tags: ["中野駅", "東中野駅", "新宿へ数分", "再開発", "コスパ好立地"],
  },
  suginami: {
    name: "杉並区",
    description:
      "高円寺・阿佐ヶ谷・荻窪・西荻窪など個性的な商店街が続く杉並区。文化的な雰囲気と落ち着いた住宅街が融合した人気エリアです。",
    tags: ["荻窪駅", "高円寺駅", "阿佐ヶ谷駅", "西荻窪駅", "商店街"],
  },
};

async function getAreaProperties(areaName: string): Promise<{ properties: Property[]; total: number }> {
  try {
    const adminUrl = process.env.ADMIN_API_URL ?? "http://localhost:3001";
    const params = new URLSearchParams({ status: "PUBLISHED", search: areaName, published_hp: "true" });
    const res = await fetch(`${adminUrl}/api/properties?${params}`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return { properties: [], total: 0 };
    const data = await res.json();
    return { properties: data.properties ?? [], total: data.total ?? 0 };
  } catch {
    return { properties: [], total: 0 };
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const area = AREA_INFO[params.slug];
  if (!area) return { title: "エリア情報" };
  return {
    title: `${area.name}の物件`,
    description: area.description,
  };
}

export default async function FeaturePage({ params }: { params: { slug: string } }) {
  const area = AREA_INFO[params.slug];
  if (!area) notFound();

  const { properties, total } = await getAreaProperties(area.name);

  return (
    <main
      style={{
        backgroundColor: "#fafaf8",
        minHeight: "100vh",
        paddingTop: "80px",
        paddingBottom: "80px",
      }}
    >
      {/* エリアヒーロー */}
      <div
        style={{
          position: "relative",
          height: "256px",
          backgroundColor: "#1a3a2a",
          marginBottom: "48px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url('/images/areas/${params.slug}.jpg')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.4,
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to bottom, transparent, rgba(26,58,42,0.8))",
          }}
        />
        <div
          className="container-xl"
          style={{
            position: "relative",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            paddingBottom: "32px",
          }}
        >
          <nav
            style={{
              fontSize: "12px",
              color: "rgba(255,255,255,0.6)",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "12px",
            }}
          >
            <Link href="/" className="crumb-link-white">
              ホーム
            </Link>
            <span>/</span>
            <Link href="/properties" className="crumb-link-white">
              物件検索
            </Link>
            <span>/</span>
            <span style={{ color: "#fff" }}>{area.name}</span>
          </nav>
          <h1
            style={{
              fontFamily: "'Noto Serif JP', serif",
              fontSize: "clamp(22px, 4vw, 36px)",
              fontWeight: "bold",
              color: "#fff",
              margin: 0,
            }}
          >
            {area.name}の物件
          </h1>
        </div>
      </div>

      <div className="container-xl">
        {/* エリア説明 */}
        <div
          style={{
            backgroundColor: "#fff",
            borderRadius: "16px",
            padding: "32px",
            boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
            marginBottom: "40px",
          }}
        >
          <p
            style={{
              fontSize: "14px",
              color: "#706e68",
              lineHeight: 1.8,
              marginBottom: "16px",
            }}
          >
            {area.description}
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {area.tags.map((tag) => (
              <span
                key={tag}
                style={{
                  fontSize: "12px",
                  backgroundColor: "#e8f0eb",
                  color: "#1a3a2a",
                  padding: "4px 12px",
                  borderRadius: "9999px",
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* 物件一覧 */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "24px",
          }}
        >
          <h2
            style={{
              fontFamily: "'Noto Serif JP', serif",
              fontSize: "20px",
              fontWeight: "bold",
              color: "#1c1b18",
              margin: 0,
            }}
          >
            {area.name}の掲載物件
          </h2>
          <p style={{ fontSize: "14px", color: "#706e68", margin: 0 }}>
            {total}件
          </p>
        </div>

        {properties.length > 0 ? (
          <>
            <div
              className="grid-3col-resp"
              style={{ gap: "24px", marginBottom: "40px" }}
            >
              {properties.map((p) => (
                <PropertyCard key={p.id} property={p} />
              ))}
            </div>
            <div style={{ textAlign: "center" }}>
              <Link
                href={`/properties?area=${encodeURIComponent(area.name)}`}
                className="btn-darkgreen-outline"
                style={{
                  display: "inline-block",
                  border: "1px solid #1a3a2a",
                  color: "#1a3a2a",
                  padding: "12px 32px",
                  borderRadius: "9999px",
                  fontSize: "14px",
                  textDecoration: "none",
                }}
              >
                {area.name}の物件をすべて見る
              </Link>
            </div>
          </>
        ) : (
          <div
            style={{
              textAlign: "center",
              padding: "64px 0",
              color: "#706e68",
            }}
          >
            <p style={{ fontSize: "18px", marginBottom: "8px" }}>
              現在掲載中の物件はありません
            </p>
            <p style={{ fontSize: "14px", marginBottom: "24px" }}>
              新着情報はお問合せにてお気軽にご確認ください
            </p>
            <Link
              href="/contact"
              className="btn-gold-fill"
              style={{
                display: "inline-block",
                backgroundColor: "#c9a96e",
                color: "#fff",
                padding: "12px 32px",
                borderRadius: "9999px",
                fontSize: "14px",
                fontWeight: "bold",
                textDecoration: "none",
              }}
            >
              お問合せはこちら
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
