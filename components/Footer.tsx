import Link from "next/link";

const PROPERTY_LINKS = [
  { href: "/properties?type=NEW_HOUSE", label: "新築戸建て" },
  { href: "/properties?type=USED_HOUSE", label: "中古戸建て" },
  { href: "/properties?type=MANSION", label: "マンション" },
  { href: "/properties?type=LAND", label: "土地" },
  { href: "/feature/felia", label: "弊社限定物件" },
  { href: "/properties?price_min=10000", label: "1億円以上" },
];

const AREA_LINKS = [
  { href: "/feature/meguro", label: "目黒区" },
  { href: "/feature/setagaya", label: "世田谷区" },
  { href: "/feature/shibuya", label: "渋谷区" },
  { href: "/feature/shinagawa", label: "品川区" },
  { href: "/feature/minato", label: "港区" },
  { href: "/feature/nakano", label: "中野区" },
  { href: "/feature/suginami", label: "杉並区" },
];

const COMPANY_LINKS = [
  { href: "/company", label: "会社案内" },
  { href: "/staff", label: "スタッフ紹介" },
  { href: "/service", label: "サービス" },
  { href: "/news", label: "お知らせ" },
  { href: "/contact", label: "お問合せ" },
  { href: "/privacy", label: "プライバシーポリシー" },
];

export default function Footer() {
  return (
    <footer className="bg-[#1a3a2a] text-white">
      <div className="container-xl py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* ブランド */}
          <div className="col-span-1">
            <div className="font-serif text-xl font-bold tracking-widest mb-1">Felia Home</div>
            <div className="text-xs tracking-[0.2em] text-[#c9a96e] mb-4">フェリアホーム</div>
            <div className="w-8 h-px bg-[#c9a96e] mb-4" />
            <p className="text-sm text-white/50 leading-relaxed">
              お客様の幸せを、住まいで実現する。
              <br />
              東京都心・城南・城西エリアに特化した不動産のプロフェッショナル。
            </p>
          </div>

          {/* 物件を探す */}
          <div>
            <h3 className="text-xs tracking-widest text-[#c9a96e] mb-4 uppercase">物件を探す</h3>
            {PROPERTY_LINKS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block text-sm text-white/60 hover:text-white mb-2 transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* エリアから探す */}
          <div>
            <h3 className="text-xs tracking-widest text-[#c9a96e] mb-4 uppercase">エリアから探す</h3>
            {AREA_LINKS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block text-sm text-white/60 hover:text-white mb-2 transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* 会社情報 */}
          <div>
            <h3 className="text-xs tracking-widest text-[#c9a96e] mb-4 uppercase">フェリアホーム</h3>
            {COMPANY_LINKS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block text-sm text-white/60 hover:text-white mb-2 transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        {/* 会社情報バー */}
        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-white/50 text-center md:text-left">
              株式会社フェリアホーム｜宅地建物取引業 東京都知事(X)第XXXXX号
              <br />
              〒XXX-XXXX 東京都渋谷区千駄ヶ谷X-XX-XX
            </div>
            <div className="text-sm text-white/30">
              © 2024 Felia Home Co., Ltd. All Rights Reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
