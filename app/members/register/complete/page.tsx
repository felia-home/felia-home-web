import Link from "next/link";

export default function RegisterCompletePage() {
  return (
    <main style={{ backgroundColor: "#f7f5f0", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px" }}>
      <div style={{
        backgroundColor: "#fff",
        borderRadius: "16px",
        padding: "64px 48px",
        maxWidth: "560px",
        width: "100%",
        textAlign: "center",
        boxShadow: "0 4px 32px rgba(0,0,0,0.08)",
        border: "1px solid #e0dbd4",
      }}>
        {/* チェックマーク */}
        <div style={{
          width: "72px",
          height: "72px",
          borderRadius: "50%",
          backgroundColor: "#2d5e4a",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 28px",
          fontSize: "32px",
          color: "#fff",
        }}>
          ✓
        </div>

        <p style={{
          fontSize: "11px",
          color: "#2d5e4a",
          letterSpacing: "0.3em",
          margin: "0 0 12px",
          fontFamily: "'Montserrat', sans-serif",
          fontWeight: "600",
        }}>
          REGISTRATION COMPLETE
        </p>

        <h1 style={{
          fontFamily: "'Noto Serif JP', serif",
          fontSize: "24px",
          fontWeight: "600",
          color: "#1a1a1a",
          margin: "0 0 16px",
        }}>
          会員登録が完了しました
        </h1>

        <p style={{
          fontSize: "14px",
          color: "#666",
          lineHeight: 1.9,
          margin: "0 0 40px",
        }}>
          フェリアホームへのご登録ありがとうございます。<br />
          ご登録いただいたメールアドレスに確認メールをお送りしました。<br />
          非公開物件情報はマイページよりご確認いただけます。
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <Link
            href="/members/mypage"
            style={{
              display: "block",
              padding: "16px",
              backgroundColor: "#2d5e4a",
              color: "#fff",
              borderRadius: "6px",
              textDecoration: "none",
              fontWeight: "bold",
              fontSize: "15px",
              letterSpacing: "0.03em",
            }}
          >
            マイページへ
          </Link>
          <Link
            href="/properties"
            style={{
              display: "block",
              padding: "14px",
              backgroundColor: "#fff",
              color: "#2d5e4a",
              borderRadius: "6px",
              textDecoration: "none",
              fontSize: "14px",
              border: "1px solid #2d5e4a",
            }}
          >
            物件を探す
          </Link>
          <Link
            href="/"
            style={{
              display: "block",
              padding: "12px",
              color: "#aaa",
              textDecoration: "none",
              fontSize: "13px",
            }}
          >
            トップページへ戻る
          </Link>
        </div>
      </div>
    </main>
  );
}
