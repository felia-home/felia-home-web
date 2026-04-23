// app/private-selection/[id]/page.tsx
import { getServerSession } from "next-auth";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { getPrivatePropertyById, verifyPrivateSelectionToken } from "@/lib/api";

export const metadata = {
  title: "非公開物件詳細 | フェリアホームプライベートセレクション",
  robots: { index: false, follow: false },
};

interface PageProps {
  params: { id: string };
  searchParams: { token?: string };
}

export default async function PrivatePropertyDetailPage({
  params,
  searchParams,
}: PageProps) {
  const session = await getServerSession(authOptions);
  const urlToken = searchParams.token;

  // アクセス制御
  if (!session?.user && !urlToken) {
    redirect("/members/login");
  }

  if (!session?.user && urlToken) {
    const result = await verifyPrivateSelectionToken(urlToken);
    if (!result.valid) {
      if (result.reason === "expired") redirect("/private-selection/expired");
      redirect("/members/login");
    }
  }

  const property = await getPrivatePropertyById(params.id);
  if (!property) notFound();

  // 物件種別
  const typeLabel = property.is_mansion ? "マンション" : property.is_house ? "戸建て" : property.is_land ? "土地" : "物件";
  const location = [property.area, property.town].filter(Boolean).join(" ");
  const infoDate = property.info_date ? new Date(property.info_date) : null;
  const dateLabel = infoDate && !isNaN(infoDate.getTime())
    ? `${infoDate.getFullYear()}年${infoDate.getMonth() + 1}月${infoDate.getDate()}日情報`
    : "";

  return (
    <main style={{ backgroundColor: "#f7f5f0", minHeight: "100vh" }}>

      {/* パンくず */}
      <div style={{ backgroundColor: "#0d2218", padding: "12px 24px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", display: "flex", gap: "8px", fontSize: "12px", color: "rgba(255,255,255,0.4)", alignItems: "center" }}>
          <Link href="/" style={{ color: "rgba(255,255,255,0.4)", textDecoration: "none" }}>ホーム</Link>
          <span>›</span>
          <Link href="/private-selection" style={{ color: "rgba(255,255,255,0.4)", textDecoration: "none" }}>Private Selection</Link>
          <span>›</span>
          <span style={{ color: "rgba(255,255,255,0.6)" }}>{location}</span>
        </div>
      </div>

      {/* ヒーロー */}
      <div style={{
        background: "linear-gradient(160deg, #0d2218 0%, #1a3d28 70%, #2d5e4a 100%)",
        padding: "56px 24px",
        color: "#fff",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: "-80px", right: "-80px", width: "400px", height: "400px", borderRadius: "50%", backgroundColor: "rgba(201,168,76,0.04)" }} />
        <div style={{ maxWidth: "1100px", margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", gap: "12px", marginBottom: "20px", flexWrap: "wrap" }}>
            <span style={{
              border: "1px solid #C9A84C", color: "#C9A84C",
              fontSize: "10px", padding: "4px 12px", borderRadius: "2px",
              letterSpacing: "0.15em", fontFamily: "'Montserrat', sans-serif",
            }}>
              {typeLabel.toUpperCase()}
            </span>
            <span style={{
              border: "1px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.5)",
              fontSize: "10px", padding: "4px 12px", borderRadius: "2px",
              letterSpacing: "0.1em", fontFamily: "'Montserrat', sans-serif",
            }}>
              MEMBERS ONLY
            </span>
          </div>

          <h1 style={{
            fontFamily: "'Noto Serif JP', serif",
            fontSize: "clamp(24px, 4vw, 40px)",
            fontWeight: "600", color: "#fff",
            margin: "0 0 12px", lineHeight: 1.3,
          }}>
            {location || "所在地非公開"}
          </h1>

          {property.property_no && (
            <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)", margin: "0 0 24px", fontFamily: "'Montserrat', sans-serif" }}>
              物件番号 {property.property_no}　{dateLabel}
            </p>
          )}

          {property.price != null && (
            <div>
              <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", margin: "0 0 4px", letterSpacing: "0.1em" }}>販売価格</p>
              <p style={{ margin: 0 }}>
                <span style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: "clamp(32px, 5vw, 48px)",
                  fontWeight: "700", color: "#fff",
                  letterSpacing: "-0.02em",
                }}>
                  {property.price.toLocaleString()}
                </span>
                <span style={{ fontSize: "16px", color: "rgba(255,255,255,0.6)", marginLeft: "6px" }}>万円</span>
              </p>
            </div>
          )}
        </div>
      </div>

      {/* メインコンテンツ */}
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "40px 24px 80px" }}>
        <div className="private-detail-grid" style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: "32px", alignItems: "start" }}>

          {/* 左：物件詳細 */}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

            {/* 物件概要 */}
            <div style={{
              backgroundColor: "#fff",
              borderRadius: "4px",
              border: "1px solid #e0dbd4",
              overflow: "hidden",
            }}>
              <div style={{ backgroundColor: "#0d2218", padding: "16px 24px" }}>
                <h2 style={{ fontFamily: "'Noto Serif JP', serif", fontSize: "15px", fontWeight: "600", color: "#fff", margin: 0 }}>
                  物件概要
                </h2>
              </div>
              <div>
                {[
                  { label: "物件種別", value: typeLabel },
                  { label: "所在地", value: location || "詳細はお問い合わせください" },
                  { label: "土地面積", value: property.area_land_m2 ? `${property.area_land_m2}㎡` : null },
                  { label: "販売価格", value: property.price != null ? `${property.price.toLocaleString()}万円` : "応相談" },
                  { label: "仲介手数料", value: property.commission ?? null },
                  { label: "取引態様", value: property.transaction_type ?? null },
                  { label: "売主", value: property.seller_name ?? null },
                  { label: "情報日付", value: dateLabel || null },
                ].filter(s => s.value).map((spec, i, arr) => (
                  <div
                    key={spec.label}
                    style={{
                      display: "flex",
                      borderBottom: i < arr.length - 1 ? "1px solid #f0ece6" : "none",
                    }}
                  >
                    <div style={{
                      width: "140px", flexShrink: 0,
                      padding: "14px 20px",
                      backgroundColor: "#faf8f4",
                      fontSize: "13px",
                      color: "#888",
                      fontWeight: "500",
                    }}>
                      {spec.label}
                    </div>
                    <div style={{
                      flex: 1,
                      padding: "14px 20px",
                      fontSize: "13px",
                      color: "#333",
                      lineHeight: 1.6,
                    }}>
                      {spec.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 備考 */}
            {property.note && (
              <div style={{
                backgroundColor: "#fff",
                borderRadius: "4px",
                border: "1px solid #e0dbd4",
                overflow: "hidden",
              }}>
                <div style={{ backgroundColor: "#0d2218", padding: "16px 24px" }}>
                  <h2 style={{ fontFamily: "'Noto Serif JP', serif", fontSize: "15px", fontWeight: "600", color: "#fff", margin: 0 }}>
                    備考・担当者コメント
                  </h2>
                </div>
                <div style={{ padding: "24px" }}>
                  <p style={{
                    fontSize: "14px", color: "#444",
                    lineHeight: 1.9, margin: 0,
                    whiteSpace: "pre-line",
                  }}>
                    {property.note}
                  </p>
                </div>
              </div>
            )}

            {/* 注意事項 */}
            <div style={{
              padding: "20px 24px",
              backgroundColor: "#faf8f4",
              borderRadius: "4px",
              border: "1px solid #e0dbd4",
            }}>
              <p style={{ fontSize: "12px", color: "#aaa", margin: 0, lineHeight: 1.8 }}>
                ※ 本物件情報は会員様限定の非公開情報です。第三者への転送・共有はお控えください。<br />
                ※ 掲載内容は予告なく変更・終了する場合があります。最新情報は担当者にご確認ください。
              </p>
            </div>
          </div>

          {/* 右：問い合わせCTA */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px", position: "sticky", top: "80px" }}>

            {/* メインCTA */}
            <div style={{
              backgroundColor: "#0d2218",
              borderRadius: "4px",
              padding: "28px 24px",
              color: "#fff",
            }}>
              <div style={{ width: "32px", height: "1px", backgroundColor: "#C9A84C", marginBottom: "16px" }} />
              <h3 style={{
                fontFamily: "'Noto Serif JP', serif",
                fontSize: "17px", fontWeight: "600",
                color: "#fff", margin: "0 0 8px", lineHeight: 1.5,
              }}>
                この物件について<br />お問い合わせください
              </h3>
              <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", margin: "0 0 24px", lineHeight: 1.7 }}>
                内覧・詳細資料・価格交渉など、<br />
                お気軽にご相談ください。
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <Link
                  href={`/contact?property_id=${property.id}&type=private&property_no=${property.property_no ?? ""}`}
                  style={{
                    display: "block", textAlign: "center",
                    padding: "15px",
                    backgroundColor: "#C9A84C",
                    color: "#0d2218",
                    borderRadius: "3px",
                    textDecoration: "none",
                    fontWeight: "bold",
                    fontSize: "14px",
                    letterSpacing: "0.05em",
                  }}
                >
                  メールで問い合わせる
                </Link>
                <a
                  href="tel:0357816301"
                  style={{
                    display: "block", textAlign: "center",
                    padding: "14px",
                    backgroundColor: "transparent",
                    color: "#fff",
                    borderRadius: "3px",
                    textDecoration: "none",
                    fontSize: "14px",
                    border: "1px solid rgba(255,255,255,0.25)",
                  }}
                >
                  📞 03-5781-6301
                </a>
              </div>

              <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", textAlign: "center", marginTop: "16px" }}>
                営業時間 9:30〜18:30（水・日定休）
              </p>
            </div>

            {/* 担当者 */}
            <div style={{
              backgroundColor: "#fff",
              borderRadius: "4px",
              padding: "20px 24px",
              border: "1px solid #e0dbd4",
            }}>
              <p style={{ fontSize: "11px", color: "#aaa", letterSpacing: "0.1em", margin: "0 0 12px", fontFamily: "'Montserrat', sans-serif" }}>
                CONTACT
              </p>
              <p style={{ fontSize: "13px", fontWeight: "bold", color: "#0d2218", margin: "0 0 4px" }}>
                株式会社フェリアホーム
              </p>
              <p style={{ fontSize: "12px", color: "#888", margin: "0 0 2px" }}>
                東京都渋谷区千駄ヶ谷4-16-7<br />
                北参道DTビル1階
              </p>
              <p style={{ fontSize: "12px", color: "#888", margin: 0 }}>
                東京都知事（2）第104842号
              </p>
            </div>

            {/* 一覧に戻る */}
            <Link
              href="/private-selection"
              style={{
                display: "block", textAlign: "center",
                padding: "12px",
                color: "#888",
                textDecoration: "none",
                fontSize: "13px",
                border: "1px solid #e0dbd4",
                borderRadius: "4px",
                backgroundColor: "#fff",
              }}
            >
              ← 一覧に戻る
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
