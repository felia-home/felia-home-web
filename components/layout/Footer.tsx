// components/layout/Footer.tsx
import Link from "next/link";

const footerLinks = [
  {
    group: "買いたい",
    links: [
      { label: "物件を条件で探す", href: "/search" },
      { label: "厳選物件情報", href: "/properties?flag=featured" },
      { label: "新着物件情報", href: "/properties?flag=new" },
      { label: "現地販売会情報", href: "/open-houses" },
      { label: "WEBチラシ", href: "/flyers" },
    ],
  },
  {
    group: "売りたい",
    links: [
      { label: "不動産売却について", href: "/sell" },
      { label: "売却査定（無料）", href: "/sell/valuation" },
      { label: "売却実績", href: "/sell/results" },
    ],
  },
  {
    group: "サービス",
    links: [
      { label: "不動産購入について", href: "/buy" },
      { label: "物件の買い替えをお考えの方へ", href: "/buy/trade-up" },
      { label: "無料FPサービス", href: "/services/fp" },
      { label: "お客様の声", href: "/services/voice" },
    ],
  },
  {
    group: "フェリアホーム",
    links: [
      { label: "会社概要", href: "/about" },
      { label: "スタッフ紹介", href: "/staff" },
      { label: "採用情報", href: "/recruit" },
      { label: "よくある質問", href: "/faq" },
      { label: "お知らせ", href: "/news" },
    ],
  },
];

const bottomLinks = [
  { label: "プライバシーポリシー", href: "/privacy" },
  { label: "免責事項", href: "/disclaimer" },
  { label: "サイトマップ", href: "/sitemap" },
];

export function Footer() {
  return (
    <footer style={{ backgroundColor: "#1A1A1A" }}>
      {/* メインフッター */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "48px 24px" }}>

        {/* ロゴ＋キャッチコピー */}
        <div
          style={{
            marginBottom: "40px",
            paddingBottom: "32px",
            borderBottom: "1px solid #333",
          }}
        >
          <Link
            href="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              marginBottom: "12px",
              textDecoration: "none",
            }}
          >
            <span
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontWeight: 700,
                fontSize: "24px",
                letterSpacing: "0.05em",
                color: "#5BAD52",
              }}
            >
              Felia
            </span>
            <span
              style={{
                fontWeight: 700,
                fontSize: "24px",
                color: "#fff",
                letterSpacing: "0.05em",
              }}
            >
              Home
            </span>
          </Link>
          <p style={{ fontSize: "14px", color: "#999", marginTop: "4px" }}>
            東京の不動産売買は、フェリアホームへ
          </p>
        </div>

        {/* リンクグループ */}
        <div className="footer-grid">
          {footerLinks.map((group) => (
            <div key={group.group}>
              <h3
                style={{
                  fontSize: "14px",
                  fontWeight: 700,
                  marginBottom: "16px",
                  paddingBottom: "8px",
                  borderBottom: "1px solid #333",
                  color: "#5BAD52",
                }}
              >
                {group.group}
              </h3>
              <ul
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                }}
              >
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="footer-link"
                      style={{ fontSize: "12px", lineHeight: 1.6 }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* 会員登録CTA */}
        <div className="footer-cta">
          <p style={{ fontSize: "14px", color: "#999", margin: 0 }}>
            会員登録で未公開物件・お気に入り保存が利用できます
          </p>
          <Link
            href="/members/register"
            style={{
              flexShrink: 0,
              padding: "10px 24px",
              borderRadius: "4px",
              backgroundColor: "#5BAD52",
              color: "#fff",
              fontSize: "14px",
              fontWeight: 500,
              textDecoration: "none",
              textAlign: "center",
            }}
          >
            無料会員登録はこちら
          </Link>
        </div>
      </div>

      {/* ボトムバー */}
      <div style={{ borderTop: "1px solid #2A2A2A", padding: "20px 0" }}>
        <div
          className="footer-bottom"
          style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}
        >
          {/* ボトムリンク */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: "16px",
            }}
          >
            {bottomLinks.map((link, i) => (
              <span
                key={link.href}
                style={{ display: "flex", alignItems: "center", gap: "16px" }}
              >
                <Link
                  href={link.href}
                  className="footer-bottom-link"
                  style={{ fontSize: "12px" }}
                >
                  {link.label}
                </Link>
                {i < bottomLinks.length - 1 && (
                  <span style={{ color: "#444" }}>|</span>
                )}
              </span>
            ))}
          </div>

          {/* コピーライト */}
          <div>
            <p style={{ fontSize: "12px", color: "#666", margin: 0 }}>
              東京都知事（X）第XXXXX号
            </p>
            <p style={{ fontSize: "12px", color: "#666", marginTop: "2px" }}>
              © 2025 株式会社フェリアホーム. All Rights Reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
