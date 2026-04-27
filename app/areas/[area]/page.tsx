// app/areas/[area]/page.tsx
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getAreaContent, areaContents } from "@/lib/areaContents";
import { getProperties, getAreas } from "@/lib/api";
import type { Property } from "@/lib/api";

interface PageProps {
  params: { area: string };
}

const PROPERTY_TYPE_MAP: Record<string, string> = {
  LAND: "土地", USED_HOUSE: "中古戸建", NEW_HOUSE: "新築戸建",
  MANSION: "マンション", USED_MANSION: "中古マンション",
  NEW_MANSION: "新築マンション", OTHER: "その他",
};

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

  // 物件取得（areaパラメータで区名フィルター）
  let properties: Property[] = [];
  let total = 0;
  try {
    const result = await getProperties({ city: areaName, limit: 9 });
    properties = result.properties ?? [];
    total = result.total ?? 0;
  } catch {}

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

  // ログイン会員のみREINS物件取得
  const session = await getServerSession(authOptions);
  const isLoggedIn = !!session?.user;
  const memberId = (session?.user as any)?.id ?? null;

  let reinsProperties: any[] = [];
  if (isLoggedIn && memberId) {
    try {
      const res = await fetch(
        `${process.env.ADMIN_API_URL}/api/hp/reins?member_id=${memberId}&area=${encodeURIComponent(areaName)}`,
        { cache: "no-store" }
      );
      const data = await res.json();
      const all = data.properties ?? [];
      // areaパラメータが効かない場合に備えてエリア名でフィルター
      reinsProperties = all.filter((p: any) => !p.area || p.area.includes(areaName));
    } catch {}
  }

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
        {/* 背景画像 */}
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

        {/* コンテンツ */}
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

          {/* ハイライトバッジ */}
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
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 24px 80px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
          <h2 style={{ fontSize: "20px", fontWeight: "bold", color: "#333", margin: 0 }}>
            {areaName}の物件一覧
            <span style={{ marginLeft: "8px", fontSize: "14px", fontWeight: "normal", color: "#888" }}>
              （{total}件）
            </span>
          </h2>
          {total > 9 && (
            <Link
              href={`/search?city=${encodeURIComponent(areaName)}`}
              style={{ fontSize: "13px", color: "#5BAD52", textDecoration: "none" }}
            >
              すべて見る →
            </Link>
          )}
        </div>

        {properties.length === 0 ? (
          <div style={{
            textAlign: "center", padding: "80px 0",
            backgroundColor: "#fff", borderRadius: "12px",
            border: "1px solid #e8e8e8",
          }}>
            <p style={{ fontSize: "40px", margin: "0 0 16px" }}>🏠</p>
            <p style={{ fontSize: "16px", color: "#888", margin: "0 0 8px" }}>
              現在このエリアの物件は準備中です
            </p>
            <p style={{ fontSize: "13px", color: "#aaa", margin: "0 0 24px" }}>
              新着物件が入り次第、随時更新いたします。
            </p>
            <Link
              href="/search"
              style={{
                display: "inline-block", padding: "12px 28px",
                backgroundColor: "#5BAD52", color: "#fff",
                borderRadius: "6px", textDecoration: "none",
                fontSize: "14px", fontWeight: "bold",
              }}
            >
              他のエリアで探す
            </Link>
          </div>
        ) : (
          <>
            <div className="properties-search-grid">
              {properties.map((property) => (
                <AreaPropertyCard key={property.id} property={property} />
              ))}
            </div>
            {total > 9 && (
              <div style={{ textAlign: "center", marginTop: "40px" }}>
                <Link
                  href={`/search?city=${encodeURIComponent(areaName)}`}
                  style={{
                    display: "inline-block", padding: "14px 40px",
                    backgroundColor: "#5BAD52", color: "#fff",
                    borderRadius: "6px", textDecoration: "none",
                    fontWeight: "bold", fontSize: "14px",
                  }}
                >
                  {areaName}の物件をすべて見る（{total}件）
                </Link>
              </div>
            )}
          </>
        )}

        {/* REINS物件（ログイン時のみ） */}
        {isLoggedIn && reinsProperties.length > 0 && (
          <div style={{ marginTop: "48px" }}>
            <div style={{
              display: "flex", alignItems: "center",
              gap: "12px", marginBottom: "20px",
            }}>
              <h2 style={{ fontSize: "20px", fontWeight: "bold", color: "#333", margin: 0 }}>
                {areaName}のREINS物件
                <span style={{ marginLeft: "8px", fontSize: "14px", fontWeight: "normal", color: "#888" }}>
                  （{reinsProperties.length}件）
                </span>
              </h2>
              <span style={{
                backgroundColor: "#2d4a6a", color: "#fff",
                fontSize: "10px", padding: "3px 8px",
                borderRadius: "3px", fontWeight: "bold",
                fontFamily: "'Montserrat', sans-serif",
              }}>
                MEMBERS ONLY
              </span>
            </div>
            <div className="properties-search-grid">
              {reinsProperties.map((property: any) => (
                <ReinsPropertyCard key={property.id} property={property} />
              ))}
            </div>
            <div style={{ textAlign: "center", marginTop: "20px" }}>
              <Link
                href="/reins"
                style={{
                  display: "inline-block", padding: "12px 28px",
                  border: "1px solid #2d4a6a", color: "#2d4a6a",
                  borderRadius: "6px", textDecoration: "none",
                  fontSize: "13px", fontWeight: "bold",
                }}
              >
                REINS物件をすべて見る →
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

function ReinsPropertyCard({ property }: { property: any }) {
  const location = [property.area, property.address].filter(Boolean).join(" ");

  const placeholderColors: Record<string, string> = {
    MANSION: "#1a2a3a",
    HOUSE: "#1a2a1a",
    LAND: "#1a1a0a",
  };
  const bgColor = placeholderColors[property.source_type] ?? "#1a2a3a";

  return (
    <Link
      href={`/contact?reins_id=${property.id}&type=reins&address=${encodeURIComponent(property.address ?? "")}`}
      style={{ textDecoration: "none", color: "inherit", display: "block" }}
    >
      <div style={{
        backgroundColor: "#fff", borderRadius: "10px",
        overflow: "hidden", border: "1px solid #e8e8e8",
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        height: "100%", display: "flex", flexDirection: "column",
      }}>
        {/* プレースホルダー画像 */}
        <div style={{
          position: "relative", aspectRatio: "4/3",
          backgroundColor: bgColor, flexShrink: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <span style={{ fontSize: "48px", opacity: 0.3 }}>
            {property.source_type === "MANSION" ? "🏢" : property.source_type === "HOUSE" ? "🏡" : "🌿"}
          </span>
          <div style={{ position: "absolute", top: "10px", left: "10px", display: "flex", gap: "4px" }}>
            <span style={{
              backgroundColor: "#2d4a6a", color: "#fff",
              fontSize: "10px", padding: "3px 8px",
              borderRadius: "3px", fontWeight: "bold",
              fontFamily: "'Montserrat', sans-serif",
            }}>
              REINS
            </span>
            <span style={{
              backgroundColor: "rgba(255,255,255,0.9)", color: "#2d4a6a",
              fontSize: "10px", padding: "3px 8px", borderRadius: "3px", fontWeight: "bold",
            }}>
              {property.property_type}
            </span>
          </div>
        </div>

        {/* 情報 */}
        <div style={{ padding: "14px 16px", flex: 1, display: "flex", flexDirection: "column" }}>
          {property.building_name && (
            <p style={{ fontSize: "13px", fontWeight: "bold", color: "#333", margin: "0 0 6px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {property.building_name}
            </p>
          )}
          <div style={{ display: "flex", flexDirection: "column", gap: "4px", marginBottom: "12px", flex: 1 }}>
            {location && <p style={{ fontSize: "12px", color: "#666", margin: 0 }}>📍 {location}</p>}
            {property.station_name && (
              <p style={{ fontSize: "12px", color: "#666", margin: 0 }}>
                🚃 {property.station_line} {property.station_name}駅
                {property.walk_minutes && ` 徒歩${property.walk_minutes}分`}
              </p>
            )}
            {property.rooms && <p style={{ fontSize: "12px", color: "#666", margin: 0 }}>🚪 {property.rooms}</p>}
            {property.area_m2 && <p style={{ fontSize: "12px", color: "#666", margin: 0 }}>📐 {property.area_m2}㎡</p>}
          </div>
          <div style={{ borderTop: "1px solid #f0f0f0", paddingTop: "10px" }}>
            {property.price != null ? (
              <p style={{ margin: 0 }}>
                <span style={{ fontSize: "20px", fontWeight: "bold", color: "#2d4a6a" }}>
                  {property.price.toLocaleString()}
                </span>
                <span style={{ fontSize: "12px", color: "#2d4a6a", marginLeft: "2px" }}>万円</span>
              </p>
            ) : (
              <p style={{ fontSize: "14px", color: "#888", margin: 0 }}>応相談</p>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

function AreaPropertyCard({ property }: { property: Property }) {
  const mainImage = (property.images as any)?.[0]?.url ?? property.mainImage ?? null;
  const typeLabel = PROPERTY_TYPE_MAP[property.property_type ?? ""] ?? "";
  const location = [property.city, property.town].filter(Boolean).join("");

  return (
    <Link href={`/properties/${property.id}`} style={{ textDecoration: "none", color: "inherit", display: "block" }}>
      <div style={{
        backgroundColor: "#fff", borderRadius: "12px",
        overflow: "hidden", border: "1px solid #e8e8e8",
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        height: "100%", display: "flex", flexDirection: "column",
      }}>
        <div style={{ position: "relative", aspectRatio: "4/3", backgroundColor: "#f0f0f0", flexShrink: 0 }}>
          {mainImage ? (
            <Image src={mainImage} alt={property.title ?? "物件"} fill quality={80}
              style={{ objectFit: "cover" }} sizes="(max-width: 768px) 100vw, 33vw" />
          ) : (
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", color: "#bbb", flexDirection: "column", gap: "8px" }}>
              <span style={{ fontSize: "32px" }}>🏠</span>
              <span style={{ fontSize: "12px" }}>画像準備中</span>
            </div>
          )}
          {typeLabel && (
            <div style={{ position: "absolute", top: "10px", left: "10px" }}>
              <span style={{ backgroundColor: "#5BAD52", color: "#fff", fontSize: "10px", padding: "3px 10px", borderRadius: "20px", fontWeight: "bold" }}>
                {typeLabel}
              </span>
            </div>
          )}
        </div>
        <div style={{ padding: "14px 16px", flex: 1, display: "flex", flexDirection: "column" }}>
          {property.title && (
            <p style={{ fontSize: "13px", fontWeight: "bold", color: "#333", margin: "0 0 8px", lineHeight: 1.4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {property.title}
            </p>
          )}
          <div style={{ display: "flex", flexDirection: "column", gap: "4px", marginBottom: "12px", flex: 1 }}>
            {location && <p style={{ fontSize: "12px", color: "#666", margin: 0 }}>📍 {location}</p>}
            {property.station_name1 && (
              <p style={{ fontSize: "12px", color: "#666", margin: 0 }}>
                🚃 {property.station_name1}駅 徒歩{property.station_walk1}分
              </p>
            )}
            {property.rooms && (
              <p style={{ fontSize: "12px", color: "#666", margin: 0 }}>🚪 {property.rooms}</p>
            )}
          </div>
          <div style={{ borderTop: "1px solid #f0f0f0", paddingTop: "10px" }}>
            {property.price != null ? (
              <p style={{ margin: 0 }}>
                <span style={{ fontSize: "20px", fontWeight: "bold", color: "#5BAD52" }}>
                  {property.price.toLocaleString()}
                </span>
                <span style={{ fontSize: "12px", color: "#5BAD52", marginLeft: "2px" }}>万円</span>
              </p>
            ) : (
              <p style={{ fontSize: "14px", color: "#888", margin: 0 }}>応相談</p>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
