// components/home/MemberBannerSection.tsx
import Link from "next/link";
import { UserPlus, Eye, Heart, FileText } from "lucide-react";

const benefits = [
  { icon: Eye,      label: "未公開物件の閲覧" },
  { icon: Heart,    label: "お気に入り保存" },
  { icon: FileText, label: "資料請求・内覧申込" },
];

export function MemberBannerSection() {
  return (
    <section
      className="banner-section"
      style={{
        background: "linear-gradient(135deg, #1a3a1a 0%, #2d5a2d 40%, #5BAD52 100%)",
      }}
    >
      {/* 背景装飾（円形） */}
      <div
        style={{
          position: "absolute",
          top: "-80px",
          right: "-80px",
          width: "320px",
          height: "320px",
          borderRadius: "50%",
          backgroundColor: "rgba(255,255,255,0.1)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-64px",
          left: "-64px",
          width: "256px",
          height: "256px",
          borderRadius: "50%",
          backgroundColor: "rgba(255,255,255,0.1)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 24px",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div className="banner-flex-row">
          {/* 左: テキスト */}
          <div className="banner-text-center">
            <p
              style={{
                color: "rgba(255,255,255,0.7)",
                fontSize: "14px",
                letterSpacing: "0.15em",
                marginBottom: "8px",
                margin: "0 0 8px",
              }}
            >
              MEMBER REGISTRATION
            </p>
            <h2
              style={{
                color: "#fff",
                fontWeight: "bold",
                lineHeight: 1.2,
                marginBottom: "16px",
                fontSize: "clamp(22px, 3vw, 36px)",
              }}
            >
              会員登録で、もっと便利に。<br />
              <span
                style={{
                  color: "rgba(255,255,255,0.85)",
                  fontWeight: "normal",
                  fontSize: "clamp(15px, 2vw, 22px)",
                }}
              >
                未公開物件も見られます。
              </span>
            </h2>

            {/* 特典リスト */}
            <div
              className="banner-justify-center"
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "16px",
                marginBottom: "24px",
              }}
            >
              {benefits.map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    fontSize: "14px",
                    color: "rgba(255,255,255,0.8)",
                  }}
                >
                  <Icon size={14} style={{ flexShrink: 0 }} />
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 右: CTA */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "12px",
              flexShrink: 0,
            }}
          >
            <Link
              href="/members/register"
              className="cta-button-hover"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "16px 32px",
                borderRadius: "8px",
                fontWeight: "bold",
                fontSize: "16px",
                textDecoration: "none",
                backgroundColor: "#ffffff",
                color: "#5BAD52",
                boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
              }}
            >
              <UserPlus size={18} />
              無料会員登録はこちら
            </Link>
            <Link
              href="/members/login"
              className="cta-text-hover"
              style={{ fontSize: "14px" }}
            >
              すでに会員の方はログイン →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
