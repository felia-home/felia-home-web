// app/private-selection/page.tsx
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { getPrivateProperties, verifyPrivateSelectionToken } from "@/lib/api";
import type { PrivateProperty } from "@/lib/api";

export const metadata = {
  title: "Felia Home Private Selection | フェリアホーム会員限定",
  robots: { index: false, follow: false },
};

interface PageProps {
  searchParams: { token?: string };
}

export default async function PrivateSelectionPage({ searchParams }: PageProps) {
  const session = await getServerSession(authOptions);
  const urlToken = searchParams.token;

  // アクセス制御
  let isTokenAccess = false;
  let tokenEmail = "";

  if (session?.user) {
    // ログイン済み → そのまま通す
    isTokenAccess = false;
  } else if (urlToken) {
    // トークンで検証
    const result = await verifyPrivateSelectionToken(urlToken);
    if (!result.valid) {
      if (result.reason === "expired") {
        redirect("/private-selection/expired");
      }
      redirect("/members/login?callbackUrl=/private-selection");
    }
    isTokenAccess = true;
    tokenEmail = result.email;
  } else {
    // 未ログイン・トークンなし
    redirect("/members/login?callbackUrl=/private-selection");
  }

  const properties = await getPrivateProperties();

  return (
    <div style={{ backgroundColor: "#f7f5f0", minHeight: "100vh" }}>

      {/* ページヘッダー */}
      <div style={{
        background: "linear-gradient(160deg, #0d2218 0%, #1a3d28 60%, #2d5e4a 100%)",
        padding: "80px 24px 64px",
        textAlign: "center",
        color: "#fff",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: "-60px", right: "-60px", width: "300px", height: "300px", borderRadius: "50%", backgroundColor: "rgba(201,168,76,0.05)" }} />
        <p style={{
          fontSize: "11px", letterSpacing: "0.4em",
          color: "#C9A84C", margin: "0 0 16px",
          fontFamily: "'Montserrat', sans-serif", fontWeight: "600",
        }}>
          PRIVATE SELECTION
        </p>
        <h1 style={{
          fontFamily: "'Noto Serif JP', serif",
          fontSize: "clamp(24px, 4vw, 38px)",
          fontWeight: "600", color: "#fff",
          margin: "0 0 16px", lineHeight: 1.3,
        }}>
          会員限定・非公開物件
        </h1>
        <div style={{ width: "40px", height: "1px", backgroundColor: "#C9A84C", margin: "0 auto 20px" }} />
        <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.65)", margin: 0, lineHeight: 1.8 }}>
          一般には公開されていない、フェリアホーム独自ルートの物件情報です。<br />
          詳細・内覧のご希望はお気軽にお問い合わせください。
        </p>
      </div>

      {/* 物件数 */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "24px 24px 0" }}>
        <p style={{ fontSize: "13px", color: "#888" }}>
          {properties.length}件の非公開物件
        </p>
      </div>

      {/* 物件グリッド */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "16px 24px 80px" }}>
        <div className="private-selection-grid">
          {properties.map((property) => (
            <PrivatePropertyCard key={property.id} property={property} />
          ))}
        </div>
      </div>
    </div>
  );
}

function PrivatePropertyCard({ property }: { property: PrivateProperty }) {
  const typeLabel = property.is_mansion ? "マンション" : property.is_house ? "戸建て" : property.is_land ? "土地" : "物件";
  const location = [property.area, property.town].filter(Boolean).join(" ");
  const infoDate = property.info_date ? new Date(property.info_date) : null;
  const dateLabel = infoDate && !isNaN(infoDate.getTime())
    ? `${infoDate.getFullYear()}年${infoDate.getMonth() + 1}月${infoDate.getDate()}日`
    : "";

  return (
    <Link
      href={`/private-selection/${property.id}`}
      style={{ display: "block", textDecoration: "none", color: "inherit" }}
    >
      <div style={{
        backgroundColor: "#fff",
        borderRadius: "4px",
        overflow: "hidden",
        border: "1px solid #e0dbd4",
        transition: "box-shadow 0.2s ease, transform 0.2s ease",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}>
        {/* 上部：物件種別・番号 */}
        <div style={{
          backgroundColor: "#0d2218",
          padding: "20px 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}>
          <div>
            <span style={{
              display: "inline-block",
              border: "1px solid #C9A84C",
              color: "#C9A84C",
              fontSize: "10px",
              padding: "3px 10px",
              borderRadius: "2px",
              letterSpacing: "0.1em",
              fontFamily: "'Montserrat', sans-serif",
              marginBottom: "8px",
            }}>
              {typeLabel.toUpperCase()}
            </span>
            <p style={{
              fontFamily: "'Noto Serif JP', serif",
              fontSize: "18px",
              fontWeight: "600",
              color: "#fff",
              margin: 0,
              lineHeight: 1.4,
            }}>
              {location || "所在地非公開"}
            </p>
          </div>
          {property.property_no && (
            <span style={{
              fontSize: "11px",
              color: "rgba(255,255,255,0.3)",
              fontFamily: "'Montserrat', sans-serif",
              flexShrink: 0,
              marginLeft: "12px",
            }}>
              No.{property.property_no}
            </span>
          )}
        </div>

        {/* 下部：情報 */}
        <div style={{ padding: "20px 24px", flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between", backgroundColor: "#f7f5f0" }}>
          <div>
            {/* 価格 */}
            <div style={{ marginBottom: "16px" }}>
              {property.price != null ? (
                <p style={{ margin: 0 }}>
                  <span style={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontSize: "28px",
                    fontWeight: "700",
                    color: "#0d2218",
                    letterSpacing: "-0.02em",
                  }}>
                    {property.price.toLocaleString()}
                  </span>
                  <span style={{ fontSize: "13px", color: "#666", marginLeft: "4px" }}>万円</span>
                </p>
              ) : (
                <p style={{ fontSize: "16px", color: "#888", margin: 0, fontStyle: "italic" }}>価格応相談</p>
              )}
            </div>

            {/* スペック */}
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {property.area_land_m2 && (
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
                  <span style={{ color: "#888" }}>土地面積</span>
                  <span style={{ color: "#333", fontWeight: "500" }}>{property.area_land_m2}㎡</span>
                </div>
              )}
              {property.transaction_type && (
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
                  <span style={{ color: "#888" }}>取引態様</span>
                  <span style={{ color: "#333", fontWeight: "500" }}>{property.transaction_type}</span>
                </div>
              )}
              {dateLabel && (
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
                  <span style={{ color: "#888" }}>情報日付</span>
                  <span style={{ color: "#333", fontWeight: "500" }}>{dateLabel}</span>
                </div>
              )}
            </div>
          </div>

          {/* フッター */}
          <div style={{
            marginTop: "20px",
            paddingTop: "16px",
            borderTop: "1px solid #e0dbd4",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}>
            <span style={{ fontSize: "11px", color: "#aaa" }}>詳細・内覧のお問い合わせ</span>
            <span style={{ fontSize: "12px", color: "#0d2218", fontWeight: "bold" }}>詳細を見る →</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
