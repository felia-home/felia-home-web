// app/private-selection/expired/page.tsx
import Link from "next/link";
import { Clock, Phone } from "lucide-react";

export const metadata = {
  title: "URLの有効期限が切れています | フェリアホーム",
  robots: { index: false, follow: false },
};

export default function ExpiredPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 16px",
        backgroundColor: "#0A1A0F",
      }}
    >
      <div
        style={{
          maxWidth: "28rem",
          width: "100%",
          textAlign: "center",
          padding: "40px",
          borderRadius: "16px",
          backgroundColor: "#0D2818",
          border: "1px solid rgba(201,168,76,0.2)",
        }}
      >
        <div
          style={{
            width: "64px",
            height: "64px",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 20px",
            backgroundColor: "rgba(201,168,76,0.1)",
            border: "1px solid rgba(201,168,76,0.3)",
          }}
        >
          <Clock size={28} style={{ color: "#C9A84C" }} />
        </div>

        <h1
          style={{
            fontWeight: "bold",
            marginBottom: "12px",
            color: "#F5F0E8",
            fontSize: "20px",
          }}
        >
          URLの有効期限が切れています
        </h1>
        <p
          style={{
            fontSize: "14px",
            lineHeight: 1.7,
            marginBottom: "32px",
            color: "rgba(245,240,232,0.5)",
          }}
        >
          ご案内のURLは有効期限（30日間）が過ぎています。
          担当者に新しいURLの発行をご依頼ください。
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <a
            href="tel:03XXXXXXXX"
            className="cta-button-hover"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              width: "100%",
              padding: "14px",
              borderRadius: "8px",
              fontWeight: "bold",
              fontSize: "14px",
              textDecoration: "none",
              backgroundColor: "#C9A84C",
              color: "#0A1A0F",
              boxSizing: "border-box",
            }}
          >
            <Phone size={16} />
            担当者に電話する
          </a>
          <Link
            href="/members/register"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              padding: "12px",
              borderRadius: "8px",
              fontSize: "14px",
              border: "1px solid rgba(201,168,76,0.3)",
              color: "#C9A84C",
              textDecoration: "none",
              transition: "background-color 0.2s ease",
              boxSizing: "border-box",
            }}
          >
            会員登録して閲覧する（無料）
          </Link>
        </div>
      </div>
    </div>
  );
}
