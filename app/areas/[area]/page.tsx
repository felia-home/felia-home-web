// app/areas/[area]/page.tsx
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getAreaContent, areaContents } from "@/lib/areaContents";
import { getAreas } from "@/lib/api";
import { AreaPropertiesClient } from "@/components/area/AreaPropertiesClient";

interface PageProps {
  params: { area: string };
}

// ローカル画像（/public/areas/ 配下）
const LOCAL_AREA_IMAGES: Record<string, string> = {
  "渋谷区": "/areas/shibuya.jpg",
  "新宿区": "/areas/shinjuku.jpg",
  "北区":   "/areas/kita.jpg",
};

// エリアごとのグラデーション（画像なしの場合）
const AREA_GRADIENTS: Record<string, string> = {
  "千代田区": "linear-gradient(135deg, #1a3a5c 0%, #2d6a9f 100%)",
  "中央区":   "linear-gradient(135deg, #5c1a1a 0%, #9f2d2d 100%)",
  "港区":     "linear-gradient(135deg, #1a1a5c 0%, #2d2d9f 100%)",
  "新宿区":   "linear-gradient(135deg, #1a4a24 0%, #2d7a3a 100%)",
  "文京区":   "linear-gradient(135deg, #3a1a5c 0%, #6a2d9f 100%)",
  "台東区":   "linear-gradient(135deg, #5c3a1a 0%, #9f6a2d 100%)",
  "品川区":   "linear-gradient(135deg, #1a5c3a 0%, #2d9f6a 100%)",
  "目黒区":   "linear-gradient(135deg, #1a4a24 0%, #5BAD52 100%)",
  "大田区":   "linear-gradient(135deg, #1a3a5c 0%, #5BAD52 100%)",
  "世田谷区": "linear-gradient(135deg, #1a4a24 0%, #2d7a3a 100%)",
  "渋谷区":   "linear-gradient(135deg, #1a4a24 0%, #2d7a3a 100%)",
  "中野区":   "linear-gradient(135deg, #5c1a3a 0%, #9f2d6a 100%)",
  "杉並区":   "linear-gradient(135deg, #1a5c1a 0%, #2d9f2d 100%)",
  "豊島区":   "linear-gradient(135deg, #3a5c1a 0%, #6a9f2d 100%)",
  "北区":     "linear-gradient(135deg, #1a3a5c 0%, #2d6a9f 100%)",
  "荒川区":   "linear-gradient(135deg, #5c4a1a 0%, #9f7a2d 100%)",
  "板橋区":   "linear-gradient(135deg, #1a1a4a 0%, #2d2d7a 100%)",
  "練馬区":   "linear-gradient(135deg, #1a4a24 0%, #5BAD52 100%)",
};

export async function generateStaticParams() {
  return Object.keys(areaContents).map((area) => ({
    area: encodeURIComponent(area),
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const areaName = decodeURIComponent(params.area);
  const content = getAreaContent(areaName);
  return {
    title: `${areaName}の不動産・物件情報 | フェリアホーム`,
    description: content.description,
  };
}

export default async function AreaPage({ params }: PageProps) {
  const areaName = decodeURIComponent(params.area);
  const content = getAreaContent(areaName);

  if (!areaContents[areaName]) notFound();

  // admin APIのエリア画像URL取得
  let adminImageUrl: string | null = null;
  try {
    const res = await getAreas();
    const areas = Array.isArray(res) ? res : (res as any)?.areas ?? [];
    const areaData = areas.find((a: any) =>
      a.area_name === areaName || a.name === areaName
    );
    adminImageUrl = areaData?.image_url ?? null;
  } catch {}

  // ログイン会員判定（物件取得はClient Component側で実施）
  const session = await getServerSession(authOptions);
  const isLoggedIn = !!session?.user;

  // 画像優先順位: admin API > ローカル > グラデーション
  const heroImageUrl = adminImageUrl ?? LOCAL_AREA_IMAGES[areaName] ?? null;
  const heroGradient = AREA_GRADIENTS[areaName] ?? "linear-gradient(135deg, #1a4a24 0%, #2d7a3a 100%)";

  return (
    <main style={{ backgroundColor: "#f8f8f8", minHeight: "100vh" }}>

      {/* ヒーロー */}
      <div style={{
        position: "relative",
        height: "400px",
        overflow: "hidden",
        background: heroImageUrl ? undefined : heroGradient,
      }}>
        {heroImageUrl && (
          <>
            <Image
              src={heroImageUrl}
              alt={`${areaName}のイメージ`}
              fill
              quality={85}
              style={{ objectFit: "cover", objectPosition: "center" }}
              sizes="100vw"
              priority
            />
            <div style={{
              position: "absolute", inset: 0,
              background: "linear-gradient(to bottom, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.5) 60%, rgba(0,0,0,0.65) 100%)",
            }} />
          </>
        )}

        {!heroImageUrl && (
          <div style={{ position: "absolute", inset: 0, backgroundColor: "rgba(0,0,0,0.2)" }} />
        )}

        <div style={{
          position: "relative", zIndex: 1,
          maxWidth: "1200px", margin: "0 auto",
          padding: "0 24px",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          paddingBottom: "48px",
        }}>
          {/* パンくず */}
          <div style={{
            display: "flex", alignItems: "center", gap: "6px",
            marginBottom: "20px", fontSize: "12px",
            color: "rgba(255,255,255,0.55)",
          }}>
            <Link href="/" style={{ color: "rgba(255,255,255,0.55)", textDecoration: "none" }}>ホーム</Link>
            <span>›</span>
            <Link href="/search" style={{ color: "rgba(255,255,255,0.55)", textDecoration: "none" }}>物件検索</Link>
            <span>›</span>
            <span style={{ color: "rgba(255,255,255,0.9)" }}>{areaName}</span>
          </div>

          <p style={{
            fontSize: "11px", letterSpacing: "0.3em",
            color: "rgba(255,255,255,0.6)", margin: "0 0 10px",
            fontFamily: "'Montserrat', sans-serif", fontWeight: "600",
          }}>
            AREA GUIDE
          </p>

          <h1 style={{
            fontSize: "clamp(36px, 6vw, 60px)",
            fontWeight: "bold", color: "#fff",
            margin: "0 0 10px", lineHeight: 1.15,
            fontFamily: "'Noto Serif JP', serif",
            textShadow: "0 2px 16px rgba(0,0,0,0.3)",
          }}>
            {areaName}
          </h1>

          {content.catchCopy && (
            <p style={{
              fontSize: "16px", color: "rgba(255,255,255,0.85)",
              margin: "0 0 20px", textShadow: "0 1px 8px rgba(0,0,0,0.3)",
            }}>
              {content.catchCopy}
            </p>
          )}

          {content.highlights && content.highlights.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {content.highlights.map((h: string, i: number) => (
                <div key={i} style={{
                  display: "flex", alignItems: "center", gap: "6px",
                  padding: "5px 12px",
                  backgroundColor: "rgba(255,255,255,0.12)",
                  border: "1px solid rgba(255,255,255,0.25)",
                  borderRadius: "20px",
                }}>
                  <span style={{ fontSize: "10px", color: "#5BAD52", fontFamily: "'Montserrat', sans-serif", fontWeight: "600" }}>0{i + 1}</span>
                  <span style={{ fontSize: "12px", color: "#fff", fontWeight: "500" }}>{h}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* エリア説明 */}
      {content.description && (
        <div style={{ backgroundColor: "#fff", borderBottom: "1px solid #e8e8e8" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "28px 24px" }}>
            <p style={{ fontSize: "14px", color: "#555", lineHeight: 1.9, margin: 0, maxWidth: "800px" }}>
              {content.description}
            </p>
          </div>
        </div>
      )}

      {/* 物件一覧 */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px 80px" }}>
        <h2 style={{ fontSize: "20px", fontWeight: "bold", color: "#333", margin: "0 0 20px" }}>
          {areaName}の物件一覧
        </h2>
        <AreaPropertiesClient areaName={areaName} isLoggedIn={isLoggedIn} />
      </div>
    </main>
  );
}
