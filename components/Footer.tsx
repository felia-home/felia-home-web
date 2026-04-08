import Link from "next/link";

const PROPERTY_LINKS = [
  { href: "/properties?type=NEW_HOUSE",  label: "新築戸建て" },
  { href: "/properties?type=USED_HOUSE", label: "中古戸建て" },
  { href: "/properties?type=MANSION",    label: "マンション" },
  { href: "/properties?type=LAND",       label: "土地" },
  { href: "/feature/felia",              label: "弊社限定物件" },
];

const AREA_LINKS = [
  { href: "/properties?city=渋谷区",   label: "渋谷区" },
  { href: "/properties?city=新宿区",   label: "新宿区" },
  { href: "/properties?city=杉並区",   label: "杉並区" },
  { href: "/properties?city=世田谷区", label: "世田谷区" },
  { href: "/properties?city=目黒区",   label: "目黒区" },
  { href: "/properties?city=品川区",   label: "品川区" },
  { href: "/properties?city=港区",     label: "港区" },
  { href: "/properties?city=中野区",   label: "中野区" },
];

const COMPANY_LINKS = [
  { href: "/company",  label: "会社案内" },
  { href: "/staff",    label: "スタッフ紹介" },
  { href: "/service",  label: "サービス" },
  { href: "/news",     label: "お知らせ" },
  { href: "/recruit",  label: "採用情報" },
  { href: "/contact",  label: "お問合せ" },
  { href: "/privacy",  label: "プライバシーポリシー" },
];

export default function Footer() {
  return (
    <footer className="bg-[#2d5a3d] text-white">
      <div className="container-xl py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* ブランド・会社情報 */}
          <div>
            <div className="text-xl font-light tracking-wider mb-4">felia home</div>
            <p className="text-xs text-white/60 leading-relaxed">
              株式会社フェリアホーム<br />
              宅地建物取引業 東京都知事（2）第104842号<br />
              千駄ヶ谷本店: 〒151-0051<br />
              東京都渋谷区千駄ヶ谷4-16-7<br />
              北参道DTビル1階<br />
              TEL: 03-5981-8601
            </p>
          </div>

          {/* 物件を探す */}
          <div>
            <h3 className="text-sm font-bold mb-4 text-white">物件を探す</h3>
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
            <h3 className="text-sm font-bold mb-4 text-white">エリアから探す</h3>
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

          {/* フェリアホーム */}
          <div>
            <h3 className="text-sm font-bold mb-4 text-white">フェリアホーム</h3>
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

        <div className="border-t border-white/20 pt-6 text-center text-xs text-white/40">
          © 2025 Felia Home Co., Ltd. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}
