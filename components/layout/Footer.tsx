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
      <div className="container-content py-12 tb:py-16">

        {/* ロゴ＋キャッチコピー */}
        <div className="mb-10 pb-8 border-b" style={{ borderColor: "#333" }}>
          <Link href="/" className="inline-flex items-center gap-1 mb-3">
            <span
              className="font-montserrat font-bold text-2xl tracking-wider"
              style={{ color: "#5BAD52" }}
            >
              Felia
            </span>
            <span className="font-bold text-2xl text-white tracking-wide">
              Home
            </span>
          </Link>
          <p className="text-sm text-gray-400 mt-1">
            東京の不動産売買は、フェリアホームへ
          </p>
        </div>

        {/* リンクグループ */}
        <div className="grid grid-cols-2 tb:grid-cols-4 gap-8 tb:gap-6">
          {footerLinks.map((group) => (
            <div key={group.group}>
              <h3
                className="text-sm font-bold mb-4 pb-2 border-b"
                style={{ color: "#5BAD52", borderColor: "#333" }}
              >
                {group.group}
              </h3>
              <ul className="space-y-2.5">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-xs text-gray-400 hover:text-white transition-colors leading-relaxed"
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
        <div
          className="mt-10 pt-8 border-t flex flex-col tb:flex-row items-center gap-4"
          style={{ borderColor: "#333" }}
        >
          <p className="text-sm text-gray-400">
            会員登録で未公開物件・お気に入り保存が利用できます
          </p>
          <Link
            href="/members/register"
            className="flex-shrink-0 px-6 py-2.5 rounded text-white text-sm font-medium transition-colors"
            style={{ backgroundColor: "#5BAD52" }}
          >
            無料会員登録はこちら
          </Link>
        </div>
      </div>

      {/* ボトムバー */}
      <div className="border-t py-5" style={{ borderColor: "#2A2A2A" }}>
        <div className="container-content flex flex-col tb:flex-row items-center justify-between gap-3">
          {/* ボトムリンク */}
          <div className="flex flex-wrap items-center gap-4 justify-center tb:justify-start">
            {bottomLinks.map((link, i) => (
              <span key={link.href} className="flex items-center gap-4">
                <Link
                  href={link.href}
                  className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {link.label}
                </Link>
                {i < bottomLinks.length - 1 && (
                  <span className="text-gray-700">|</span>
                )}
              </span>
            ))}
          </div>

          {/* コピーライト */}
          <div className="text-center tb:text-right">
            <p className="text-xs text-gray-600">
              東京都知事（X）第XXXXX号
            </p>
            <p className="text-xs text-gray-600 mt-0.5">
              © 2025 株式会社フェリアホーム. All Rights Reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
