import Link from "next/link";

export default function RegisterCompletePage() {
  return (
    <main style={{ backgroundColor: "#f7f5f0", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px" }}>
      <div style={{
        backgroundColor: "#fff",
        borderRadius: "16px",
        padding: "64px 48px",
        maxWidth: "600px",
        width: "100%",
        textAlign: "center",
        boxShadow: "0 4px 32px rgba(0,0,0,0.08)",
        border: "1px solid #e0dbd4",
      }}>
        {/* チェックマーク */}
        <div style={{
          width: "72px", height: "72px",
          borderRadius: "50%",
          backgroundColor: "#2d5e4a",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 28px",
          fontSize: "32px", color: "#fff",
        }}>
          ✓
        </div>

        <p style={{
          fontSize: "11px", color: "#2d5e4a",
          letterSpacing: "0.3em", margin: "0 0 12px",
          fontFamily: "'Montserrat', sans-serif", fontWeight: "600",
        }}>
          REGISTRATION COMPLETE
        </p>

        <h1 style={{
          fontFamily: "'Noto Serif JP', serif",
          fontSize: "26px", fontWeight: "600",
          color: "#1a1a1a", margin: "0 0 16px",
        }}>
          ご登録ありがとうございます
        </h1>

        {/* ログイン状態バッジ */}
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
          backgroundColor: "#f0f5f2",
          border: "1px solid #2d5e4a",
          borderRadius: "20px",
          padding: "6px 16px",
          marginBottom: "24px",
        }}>
          <div style={{
            width: "8px", height: "8px",
            borderRadius: "50%",
            backgroundColor: "#2d5e4a",
          }} />
          <span style={{ fontSize: "12px", color: "#2d5e4a", fontWeight: "bold" }}>
            現在ログイン中
          </span>
        </div>

        <p style={{
          fontSize: "14px", color: "#666",
          lineHeight: 1.9, margin: "0 0 40px",
        }}>
          フェリアホームの会員になられました。<br />
          ご登録いただいたメールアドレスに確認メールをお送りしました。
        </p>

        {/* メインCTA */}
        <div style={{
          backgroundColor: "#0d2218",
          borderRadius: "12px",
          padding: "28px 32px",
          marginBottom: "16px",
          textAlign: "left",
          position: "relative",
          overflow: "hidden",
        }}>
          <div style={{
            position: "absolute", top: "-20px", right: "-20px",
            width: "120px", height: "120px",
            borderRadius: "50%",
            backgroundColor: "rgba(255,255,255,0.04)",
          }} />
          <p style={{
            fontSize: "11px",
            color: "rgba(255,255,255,0.5)",
            letterSpacing: "0.2em",
            margin: "0 0 8px",
            fontFamily: "'Montserrat', sans-serif",
          }}>
            MEMBERS ONLY
          </p>
          <p style={{
            fontFamily: "'Noto Serif JP', serif",
            fontSize: "17px",
            fontWeight: "600",
            color: "#fff",
            margin: "0 0 8px",
            lineHeight: 1.5,
          }}>
            非公開物件が、今すぐご覧いただけます。
          </p>
          <p style={{
            fontSize: "13px",
            color: "rgba(255,255,255,0.6)",
            margin: "0 0 20px",
            lineHeight: 1.7,
          }}>
            一般には公開されていない厳選物件を、<br />
            会員様だけにご案内しています。
          </p>
          <Link
            href="/private-selection"
            style={{
              display: "inline-block",
              padding: "13px 28px",
              backgroundColor: "#fff",
              color: "#0d2218",
              borderRadius: "6px",
              textDecoration: "none",
              fontWeight: "bold",
              fontSize: "14px",
              letterSpacing: "0.03em",
            }}
          >
            Felia Home Private Selection を見る →
          </Link>
        </div>

        {/* サブリンク */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <Link
            href="/members/mypage"
            style={{
              display: "block", padding: "13px",
              backgroundColor: "#fff", color: "#2d5e4a",
              borderRadius: "6px", textDecoration: "none",
              fontSize: "14px", border: "1px solid #2d5e4a",
              fontWeight: "500",
            }}
          >
            マイページへ
          </Link>
          <Link
            href="/properties"
            style={{
              display: "block", padding: "12px",
              color: "#aaa", textDecoration: "none", fontSize: "13px",
            }}
          >
            新着物件を見る
          </Link>
        </div>
      </div>
    </main>
  );
}
