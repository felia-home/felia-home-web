"use client";

// app/private-selection/page.tsx
import { useEffect, useState, useMemo } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface PrivateProperty {
  id: string;
  property_no?: string | null;
  property_type?: string | null;
  is_land?: boolean;
  is_house?: boolean;
  is_mansion?: boolean;
  area?: string | null;
  town?: string | null;
  price?: number | string | null;
  price_display?: string | null;
  area_land_m2?: number | null;
  area_build_m2?: number | null;
  commission?: string | null;
  note?: string | null;
  transaction_type?: string | null;
  info_date?: string | null;
  seller_name?: string | null;
  status?: string | null;
}

function priceToNumber(p: PrivateProperty): number {
  if (p.price_display) {
    const cleaned = String(p.price_display).replace(/[^\d.]/g, "");
    const n = parseFloat(cleaned);
    if (!isNaN(n)) return n;
  }
  if (p.price != null) {
    const n = parseFloat(String(p.price).replace(/[^\d.]/g, ""));
    if (!isNaN(n)) return n;
  }
  return 0;
}

function formatPriceNum(p: PrivateProperty): string {
  if (p.price_display && String(p.price_display).trim()) {
    const pd = String(p.price_display).trim();
    return pd.replace(/万円$/, "").trim();
  }
  if (p.price != null && Number(p.price) > 0) {
    return Number(p.price).toLocaleString();
  }
  return "価格応相談";
}

function needsManEn(p: PrivateProperty): boolean {
  if (p.price_display) {
    const pd = String(p.price_display).trim();
    if (pd.match(/億|円|未定|応相談|価格/)) return false;
    return true;
  }
  return p.price != null && Number(p.price) > 0;
}

function typeLabel(p: PrivateProperty): string {
  if (p.property_type) return p.property_type;
  if (p.is_mansion) return "マンション";
  if (p.is_house) return "戸建て";
  if (p.is_land) return "土地";
  return "物件";
}

function typeColors(p: PrivateProperty): { bg: string; badge: string; line: string } {
  if (p.is_mansion) return { bg: "#2a1a3a", badge: "#c4a8d4", line: "#9b6bb5" };
  if (p.is_house)   return { bg: "#1a2a3a", badge: "#8ab4d4", line: "#4a90b8" };
  return                   { bg: "#1a3a2a", badge: "#C9A84C", line: "#C9A84C" };
}

const TYPE_FILTER_BG: Record<string, string> = {
  "": "#0d2218",
  "土地": "#1a3a2a",
  "戸建て": "#1a2a3a",
  "マンション": "#2a1a3a",
};

const AREAS = [
  "渋谷区", "新宿区", "杉並区", "世田谷区",
  "文京区", "豊島区", "中野区", "目黒区",
  "北区", "板橋区", "練馬区", "品川区",
  "港区", "大田区", "千代田区", "中央区",
  "江東区", "墨田区",
];

export default function PrivateSelectionPage() {
  const session = useSession();
  const status = session?.status ?? "loading";
  const router = useRouter();

  const [properties, setProperties] = useState<PrivateProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<string>("");
  const [filterArea, setFilterArea] = useState<string>("");
  const [requestedNos, setRequestedNos] = useState<Set<string>>(new Set());
  const [confirmModal, setConfirmModal] = useState<{ property: PrivateProperty } | null>(null);
  const [requesting, setRequesting] = useState(false);
  const [requestResult, setRequestResult] = useState<"success" | "already" | "error" | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/members/login?callbackUrl=/private-selection");
    }
  }, [status, router]);

  useEffect(() => {
    if (status !== "authenticated") return;

    // 物件一覧取得
    fetch("/api/private-properties")
      .then((r) => r.json())
      .then((data) => {
        const arr = Array.isArray(data) ? data : data.properties ?? [];
        setProperties(arr);
      })
      .catch(() => setProperties([]))
      .finally(() => setLoading(false));

    // 資料請求済み一覧取得
    fetch("/api/member/inquiry")
      .then((r) => r.json())
      .then((d) => {
        const nos = new Set<string>(
          Array.from((d.inquiries ?? []).map((i: any) => String(i.property_ref)))
        );
        setRequestedNos(nos);
      })
      .catch(() => null);
  }, [status]);

  const handleInquiry = async (property: PrivateProperty) => {
    setRequesting(true);
    setRequestResult(null);
    try {
      const res = await fetch("/api/member/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ property_no: property.property_no }),
      });
      const data = await res.json();
      if (data.already_requested) {
        setRequestResult("already");
      } else if (data.success) {
        setRequestResult("success");
        setRequestedNos((prev) => new Set(Array.from(prev).concat(String(property.property_no))));
      } else {
        setRequestResult("error");
      }
    } catch {
      setRequestResult("error");
    } finally {
      setRequesting(false);
    }
  };

  const filtered = useMemo(() => {
    let list = [...properties];
    if (filterType) {
      list = list.filter((p) => typeLabel(p) === filterType);
    }
    if (filterArea) {
      list = list.filter((p) =>
        [p.area, p.town].filter(Boolean).join("").includes(filterArea)
      );
    }
    list.sort((a, b) => priceToNumber(b) - priceToNumber(a));
    return list;
  }, [properties, filterType, filterArea]);

  if (status === "loading" || status === "unauthenticated") {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#f7f5f0", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "#888", fontSize: "14px" }}>読み込み中...</p>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: "#f7f5f0", minHeight: "100vh" }}>

      {/* 確認モーダル */}
      {confirmModal && (
        <div
          onClick={() => { setConfirmModal(null); setRequestResult(null); }}
          style={{
            position: "fixed", inset: 0,
            backgroundColor: "rgba(0,0,0,0.6)",
            zIndex: 9999,
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: "24px",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: "#fff",
              borderRadius: "8px",
              padding: "40px 32px",
              maxWidth: "480px",
              width: "100%",
              textAlign: "center",
            }}
          >
            {requestResult === null && (
              <>
                <div style={{ width: "48px", height: "1px", backgroundColor: "#C9A84C", margin: "0 auto 20px" }} />
                <h3 style={{
                  fontFamily: "'Noto Serif JP', serif",
                  fontSize: "18px", fontWeight: "600",
                  color: "#0d2218", margin: "0 0 12px",
                }}>
                  資料請求の確認
                </h3>
                <p style={{ fontSize: "14px", color: "#555", lineHeight: 1.8, margin: "0 0 8px" }}>
                  以下の物件の資料請求をします。
                </p>
                <div style={{
                  backgroundColor: "#f7f5f0",
                  borderRadius: "6px",
                  padding: "16px",
                  margin: "0 0 24px",
                }}>
                  <p style={{ fontSize: "13px", color: "#888", margin: "0 0 4px" }}>
                    No.{confirmModal.property.property_no}
                  </p>
                  <p style={{
                    fontFamily: "'Noto Serif JP', serif",
                    fontSize: "16px", fontWeight: "600",
                    color: "#0d2218", margin: 0,
                  }}>
                    {[confirmModal.property.area, confirmModal.property.town].filter(Boolean).join(" ")}
                  </p>
                </div>
                <p style={{ fontSize: "12px", color: "#aaa", margin: "0 0 24px", lineHeight: 1.7 }}>
                  担当者よりメールにてご連絡いたします。<br />
                  内容を確認の上、よろしければOKを押してください。
                </p>
                <div style={{ display: "flex", gap: "12px" }}>
                  <button
                    onClick={() => { setConfirmModal(null); setRequestResult(null); }}
                    style={{
                      flex: 1, padding: "13px",
                      border: "1px solid #e0dbd4",
                      borderRadius: "4px",
                      backgroundColor: "#fff",
                      color: "#888", fontSize: "14px",
                      cursor: "pointer",
                    }}
                  >
                    キャンセル
                  </button>
                  <button
                    onClick={() => handleInquiry(confirmModal.property)}
                    disabled={requesting}
                    style={{
                      flex: 1, padding: "13px",
                      backgroundColor: "#C9A84C",
                      border: "none",
                      borderRadius: "4px",
                      color: "#0d2218",
                      fontWeight: "bold",
                      fontSize: "14px",
                      cursor: requesting ? "not-allowed" : "pointer",
                      opacity: requesting ? 0.7 : 1,
                    }}
                  >
                    {requesting ? "送信中..." : "OK・資料請求する"}
                  </button>
                </div>
              </>
            )}

            {requestResult === "success" && (
              <>
                <div style={{ fontSize: "48px", marginBottom: "16px" }}>✅</div>
                <h3 style={{ fontFamily: "'Noto Serif JP', serif", fontSize: "18px", color: "#0d2218", margin: "0 0 12px" }}>
                  資料請求が完了しました
                </h3>
                <p style={{ fontSize: "13px", color: "#666", lineHeight: 1.8, margin: "0 0 24px" }}>
                  担当者よりメールにてご連絡いたします。<br />
                  今しばらくお待ちください。
                </p>
                <button
                  onClick={() => { setConfirmModal(null); setRequestResult(null); }}
                  style={{
                    width: "100%", padding: "13px",
                    backgroundColor: "#0d2218", color: "#fff",
                    border: "none", borderRadius: "4px",
                    fontSize: "14px", cursor: "pointer", fontWeight: "bold",
                  }}
                >
                  閉じる
                </button>
              </>
            )}

            {requestResult === "already" && (
              <>
                <div style={{ fontSize: "48px", marginBottom: "16px" }}>📬</div>
                <h3 style={{ fontFamily: "'Noto Serif JP', serif", fontSize: "18px", color: "#0d2218", margin: "0 0 12px" }}>
                  すでに資料請求済みです
                </h3>
                <p style={{ fontSize: "13px", color: "#666", lineHeight: 1.8, margin: "0 0 24px" }}>
                  この物件はすでに資料請求されています。<br />
                  担当者よりご連絡をお待ちください。
                </p>
                <button
                  onClick={() => { setConfirmModal(null); setRequestResult(null); }}
                  style={{
                    width: "100%", padding: "13px",
                    backgroundColor: "#0d2218", color: "#fff",
                    border: "none", borderRadius: "4px",
                    fontSize: "14px", cursor: "pointer", fontWeight: "bold",
                  }}
                >
                  閉じる
                </button>
              </>
            )}

            {requestResult === "error" && (
              <>
                <div style={{ fontSize: "48px", marginBottom: "16px" }}>⚠️</div>
                <h3 style={{ fontFamily: "'Noto Serif JP', serif", fontSize: "18px", color: "#0d2218", margin: "0 0 12px" }}>
                  エラーが発生しました
                </h3>
                <p style={{ fontSize: "13px", color: "#666", lineHeight: 1.8, margin: "0 0 24px" }}>
                  しばらくしてから再度お試しください。
                </p>
                <button
                  onClick={() => { setConfirmModal(null); setRequestResult(null); }}
                  style={{
                    width: "100%", padding: "13px",
                    backgroundColor: "#0d2218", color: "#fff",
                    border: "none", borderRadius: "4px",
                    fontSize: "14px", cursor: "pointer", fontWeight: "bold",
                  }}
                >
                  閉じる
                </button>
              </>
            )}
          </div>
        </div>
      )}

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

      {/* フィルター */}
      <div style={{ backgroundColor: "#fff", borderBottom: "1px solid #e0dbd4" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "16px 24px", display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
          <span style={{ fontSize: "13px", color: "#888", whiteSpace: "nowrap" }}>絞り込み：</span>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            style={{
              padding: "8px 12px",
              fontSize: "13px",
              border: "1px solid #e0dbd4",
              borderRadius: "4px",
              backgroundColor: filterType ? TYPE_FILTER_BG[filterType] : "#fff",
              color: filterType ? "#fff" : "#333",
              cursor: "pointer",
              minWidth: "120px",
            }}
          >
            <option value="">物件種別（すべて）</option>
            <option value="土地">土地</option>
            <option value="戸建て">戸建て</option>
            <option value="マンション">マンション</option>
          </select>

          <select
            value={filterArea}
            onChange={(e) => setFilterArea(e.target.value)}
            style={{
              padding: "8px 12px",
              fontSize: "13px",
              border: "1px solid #e0dbd4",
              borderRadius: "4px",
              backgroundColor: "#fff",
              color: "#333",
              cursor: "pointer",
              minWidth: "140px",
            }}
          >
            <option value="">エリア（すべて）</option>
            {AREAS.map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>

          {(filterType || filterArea) && (
            <button
              onClick={() => { setFilterType(""); setFilterArea(""); }}
              style={{
                padding: "8px 14px",
                fontSize: "12px",
                border: "1px solid #ddd",
                borderRadius: "4px",
                backgroundColor: "transparent",
                color: "#888",
                cursor: "pointer",
              }}
            >
              リセット
            </button>
          )}

          <span style={{ marginLeft: "auto", fontSize: "13px", color: "#888" }}>
            {loading ? "読み込み中..." : `${filtered.length}件`}
          </span>
        </div>
      </div>

      {/* 物件グリッド */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px 80px" }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: "80px 0", color: "#aaa", fontSize: "14px" }}>
            物件情報を読み込み中...
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0", color: "#aaa", fontSize: "14px" }}>
            条件に合う物件が見つかりませんでした
          </div>
        ) : (
          <div className="private-selection-grid">
            {filtered.map((p) => (
              <PrivateCard
                key={p.id}
                property={p}
                isRequested={requestedNos.has(String(p.property_no))}
                onRequest={() => setConfirmModal({ property: p })}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function PrivateCard({
  property,
  isRequested,
  onRequest,
}: {
  property: PrivateProperty;
  isRequested: boolean;
  onRequest: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const type = typeLabel(property);
  const colors = typeColors(property);
  const location = [property.area, property.town].filter(Boolean).join(" ");
  const infoDate = property.info_date ? new Date(property.info_date) : null;
  const dateLabel = infoDate && !isNaN(infoDate.getTime())
    ? `${infoDate.getFullYear()}/${String(infoDate.getMonth() + 1).padStart(2, "0")}/${String(infoDate.getDate()).padStart(2, "0")}`
    : "";

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        backgroundColor: "#fff",
        borderRadius: "8px",
        overflow: "hidden",
        border: "1px solid #e0dbd4",
        display: "flex",
        flexDirection: "column",
        boxShadow: hovered ? "0 12px 32px rgba(0,0,0,0.12)" : "0 2px 8px rgba(0,0,0,0.06)",
        transform: hovered ? "translateY(-3px)" : "translateY(0)",
        transition: "all 0.25s ease",
        position: "relative",
      }}
    >
      {/* 左縦ライン */}
      <div style={{
        position: "absolute",
        top: 0, left: 0, bottom: 0,
        width: "4px",
        backgroundColor: colors.line,
        zIndex: 1,
      }} />

      {/* ヘッダー */}
      <div style={{
        backgroundColor: colors.bg,
        padding: "20px 20px 20px 24px",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* 装飾円 */}
        <div style={{
          position: "absolute",
          top: "-30px", right: "-30px",
          width: "100px", height: "100px",
          borderRadius: "50%",
          backgroundColor: "rgba(255,255,255,0.04)",
        }} />

        {/* 上段：種別バッジ + 物件番号 */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "12px",
        }}>
          <span style={{
            border: `1px solid ${colors.badge}`,
            color: colors.badge,
            fontSize: "10px",
            padding: "3px 10px",
            borderRadius: "2px",
            letterSpacing: "0.15em",
            fontFamily: "'Montserrat', sans-serif",
            fontWeight: "600",
          }}>
            {type.toUpperCase()}
          </span>
          {property.property_no && (
            <span style={{
              fontSize: "10px",
              color: "rgba(255,255,255,0.3)",
              fontFamily: "'Montserrat', sans-serif",
              letterSpacing: "0.05em",
            }}>
              No.{property.property_no}
            </span>
          )}
        </div>

        {/* 所在地 */}
        <h3 style={{
          fontFamily: "'Noto Serif JP', serif",
          fontSize: "17px",
          fontWeight: "600",
          color: "#fff",
          margin: 0,
          lineHeight: 1.4,
          letterSpacing: "0.02em",
        }}>
          {location || "所在地非公開"}
        </h3>
      </div>

      {/* ボディ */}
      <div style={{
        padding: "20px 20px 20px 24px",
        flex: 1,
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#faf8f5",
      }}>

        {/* 価格 */}
        <div style={{
          marginBottom: "16px",
          paddingBottom: "14px",
          borderBottom: "1px solid #e8e2da",
        }}>
          <p style={{ fontSize: "11px", color: "#aaa", margin: "0 0 4px", letterSpacing: "0.08em" }}>
            販売価格
          </p>
          <p style={{ margin: 0, lineHeight: 1.3, display: "flex", alignItems: "baseline", gap: "2px", flexWrap: "wrap" }}>
            <span style={{
              fontSize: "22px",
              fontWeight: "bold",
              color: "#1a1a1a",
              letterSpacing: "-0.01em",
            }}>
              {formatPriceNum(property)}
            </span>
            {needsManEn(property) && (
              <span style={{ fontSize: "13px", color: "#666", fontWeight: "500" }}>
                万円
              </span>
            )}
          </p>
        </div>

        {/* スペック */}
        <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "18px", flex: 1 }}>
          {property.area_land_m2 && (
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "11px", color: "#999", letterSpacing: "0.03em" }}>土地面積</span>
              <span style={{ fontSize: "13px", color: "#444", fontWeight: "500" }}>{property.area_land_m2}㎡</span>
            </div>
          )}
          {property.area_build_m2 && (
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "11px", color: "#999", letterSpacing: "0.03em" }}>建物面積</span>
              <span style={{ fontSize: "13px", color: "#444", fontWeight: "500" }}>{property.area_build_m2}㎡</span>
            </div>
          )}
          {property.transaction_type && (
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "11px", color: "#999", letterSpacing: "0.03em" }}>取引態様</span>
              <span style={{ fontSize: "11px", color: "#666" }}>{property.transaction_type}</span>
            </div>
          )}
          {dateLabel && (
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "11px", color: "#999", letterSpacing: "0.03em" }}>情報日付</span>
              <span style={{ fontSize: "11px", color: "#999", fontFamily: "'Montserrat', sans-serif" }}>{dateLabel}</span>
            </div>
          )}
        </div>

        {/* 資料請求ボタン */}
        {isRequested ? (
          <div style={{
            textAlign: "center",
            padding: "12px",
            backgroundColor: "#f0ece6",
            borderRadius: "4px",
            fontSize: "12px",
            color: "#aaa",
            border: "1px solid #e0dbd4",
            letterSpacing: "0.05em",
          }}>
            ✓ 資料請求済み
          </div>
        ) : (
          <button
            onClick={onRequest}
            style={{
              display: "block",
              width: "100%",
              textAlign: "center",
              padding: "13px",
              backgroundColor: colors.line,
              color: colors.bg === "#2a1a3a" ? "#fff" : "#0d2218",
              border: "none",
              borderRadius: "4px",
              fontWeight: "bold",
              fontSize: "13px",
              letterSpacing: "0.08em",
              cursor: "pointer",
              transition: "opacity 0.15s ease",
              opacity: hovered ? 0.9 : 1,
            }}
          >
            資料請求する
          </button>
        )}
      </div>
    </div>
  );
}
