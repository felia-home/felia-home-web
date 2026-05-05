import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "サービス | フェリアホーム",
  description: "フェリアホームが提供する不動産サービスをご紹介します。",
};

const C = {
  bg: "#fafaf8",
  green: "#1a3a2a",
  gold: "#c9a96e",
  text: "#1c1b18",
  sub: "#706e68",
  lightGreen: "#e8f0eb",
};

const SERVICES = [
  {
    icon: "🏠",
    title: "不動産購入サポート",
    description:
      "物件探しから契約まで、経験豊富なスタッフが丁寧にサポートします。",
    points: [
      "希望条件のヒアリング",
      "物件のご提案・内覧同行",
      "価格交渉・契約手続き",
      "引渡しまでの一貫サポート",
    ],
  },
  {
    icon: "💰",
    title: "不動産売却サポート",
    description:
      "適正価格での売却を実現。スピーディな査定と幅広いネットワークで対応します。",
    points: [
      "無料売却査定",
      "販売戦略のご提案",
      "購入希望者のご紹介",
      "税務・法務のご相談",
    ],
  },
  {
    icon: "🔄",
    title: "買い替えサポート",
    description:
      "現在のお住まいの売却と新居の購入を同時進行でサポートします。",
    points: [
      "売却・購入の同時進行",
      "つなぎ融資のご相談",
      "スケジュール管理",
      "住み替えコスト最小化",
    ],
  },
  {
    icon: "📊",
    title: "資産活用コンサルティング",
    description:
      "不動産を活用した資産形成・運用をトータルでサポートします。",
    points: [
      "収益物件のご提案",
      "リノベーション提案",
      "FP相談との連携",
      "長期資産形成プランニング",
    ],
  },
];

export default function ServicePage() {
  return (
    <main
      style={{
        backgroundColor: C.bg,
        minHeight: "100vh",
        paddingTop: "112px",
        paddingBottom: "80px",
      }}
    >
      <div className="container-xl">
        {/* ヘッダー */}
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <p
            style={{
              fontSize: "11px",
              color: C.gold,
              letterSpacing: "0.3em",
              marginBottom: "8px",
              fontFamily: "'Noto Serif JP', serif",
            }}
          >
            SERVICE
          </p>
          <h1
            style={{
              fontSize: "clamp(24px, 4vw, 36px)",
              fontWeight: "bold",
              color: C.text,
              margin: "0 0 16px",
              fontFamily: "'Noto Serif JP', serif",
            }}
          >
            サービス一覧
          </h1>
          <p
            style={{
              fontSize: "14px",
              color: C.sub,
              marginTop: "16px",
              lineHeight: 1.8,
            }}
          >
            フェリアホームは、不動産に関わるすべてのシーンでお客様をサポートします。
          </p>
        </div>

        {/* サービスカード */}
        <div className="service-card-grid" style={{ marginBottom: "64px" }}>
          {SERVICES.map((service, i) => (
            <div
              key={i}
              style={{
                backgroundColor: "#fff",
                borderRadius: "16px",
                padding: "32px",
                boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
              }}
            >
              <div style={{ fontSize: "36px", marginBottom: "16px" }}>
                {service.icon}
              </div>
              <h2
                style={{
                  fontFamily: "'Noto Serif JP', serif",
                  fontSize: "20px",
                  fontWeight: "bold",
                  color: C.text,
                  margin: "0 0 12px",
                }}
              >
                {service.title}
              </h2>
              <p
                style={{
                  fontSize: "14px",
                  color: C.sub,
                  lineHeight: 1.8,
                  marginBottom: "24px",
                }}
              >
                {service.description}
              </p>
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                }}
              >
                {service.points.map((point, j) => (
                  <li
                    key={j}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      fontSize: "14px",
                      color: C.text,
                    }}
                  >
                    <span
                      style={{
                        color: C.gold,
                        fontWeight: "bold",
                        flexShrink: 0,
                      }}
                    >
                      ✓
                    </span>
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div
          style={{
            backgroundColor: C.green,
            borderRadius: "16px",
            padding: "48px 40px",
            textAlign: "center",
          }}
        >
          <h2
            style={{
              fontFamily: "'Noto Serif JP', serif",
              fontSize: "clamp(20px, 3vw, 28px)",
              fontWeight: "bold",
              color: "#fff",
              margin: "0 0 16px",
            }}
          >
            まずはお気軽にご相談ください
          </h2>
          <p
            style={{
              color: "rgba(255,255,255,0.75)",
              fontSize: "14px",
              marginBottom: "32px",
              lineHeight: 1.8,
            }}
          >
            不動産に関するご相談は、フェリアホームにお任せください。
          </p>
          <div className="service-cta-btns">
            <Link
              href="/contact"
              className="btn-gold-fill"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "13px 32px",
                borderRadius: "9999px",
                backgroundColor: C.gold,
                color: "#fff",
                textDecoration: "none",
                fontSize: "14px",
                fontWeight: "bold",
              }}
            >
              無料相談はこちら
            </Link>
            <a
              href="tel:0359818601"
              className="btn-white-outline"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "13px 32px",
                borderRadius: "9999px",
                border: "1px solid rgba(255,255,255,0.6)",
                color: "#fff",
                textDecoration: "none",
                fontSize: "14px",
                fontWeight: "bold",
              }}
            >
              📞 03-5981-8601
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
