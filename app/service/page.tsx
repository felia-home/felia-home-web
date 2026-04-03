import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "サービス",
  description: "フェリアホームの不動産売買仲介・売却サポート・資金計画などのサービスをご紹介します。",
};

const SERVICES = [
  {
    icon: "🏠",
    title: "物件購入サポート",
    description:
      "ご希望のエリア・予算・間取りをヒアリングし、最適な物件をご提案。内覧同行から契約・引き渡しまで一貫サポートします。",
    items: ["物件探し・内覧同行", "価格交渉サポート", "住宅ローン相談", "売買契約立会い", "引き渡し確認"],
  },
  {
    icon: "💰",
    title: "売却サポート",
    description:
      "無料の査定から始まり、最適な価格設定・広告展開・買主との交渉まで、売主様の利益を最大化します。",
    items: ["無料査定（訪問・書面）", "販売価格設定アドバイス", "ポータル・HP掲載", "内覧対応", "決済・引き渡しサポート"],
  },
  {
    icon: "📋",
    title: "資金計画サポート",
    description:
      "住宅ローンの事前審査から返済計画まで、ファイナンシャルプランナーと連携してお客様に最適なプランをご提案します。",
    items: ["住宅ローン事前審査", "各種補助金・優遇制度案内", "返済シミュレーション", "火災・地震保険案内"],
  },
  {
    icon: "🔑",
    title: "未公開物件のご紹介",
    description:
      "ポータルサイトに出回らない売主様直接の物件を多数保有。会員登録していただくと優先的にご案内します。",
    items: ["完全未公開物件", "新着即時通知", "先行案内", "専任担当者制"],
  },
];

export default function ServicePage() {
  return (
    <div className="pt-28 pb-20 bg-[#fafaf8] min-h-screen">
      <div className="container-xl">
        <div className="mb-12 text-center">
          <p className="text-[#c9a96e] text-xs tracking-[0.3em] mb-2 font-serif">SERVICE</p>
          <h1 className="font-serif text-3xl font-bold text-[#1c1b18]">サービス</h1>
          <p className="text-sm text-[#706e68] mt-4">
            購入・売却・資金計画まで、住まいに関するすべてのご相談を承ります。
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {SERVICES.map((service) => (
            <div key={service.title} className="bg-white rounded-2xl p-8 shadow-sm">
              <div className="text-4xl mb-4">{service.icon}</div>
              <h2 className="font-serif text-xl font-bold text-[#1c1b18] mb-3">{service.title}</h2>
              <p className="text-sm text-[#706e68] leading-relaxed mb-6">{service.description}</p>
              <ul className="space-y-2">
                {service.items.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-[#1c1b18]">
                    <span className="text-[#c9a96e]">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="bg-[#1a3a2a] rounded-2xl p-10 text-white text-center">
          <h2 className="font-serif text-2xl font-bold mb-4">まずはお気軽にご相談ください</h2>
          <p className="text-white/75 text-sm mb-8">無料相談を随時受け付けています。お電話・メールどちらでも。</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="bg-[#c9a96e] text-white px-8 py-3 rounded-full text-sm font-bold hover:bg-[#b8935a] transition-colors"
            >
              無料相談・お問合せ
            </Link>
            <a
              href="tel:0120-000-000"
              className="border border-white text-white px-8 py-3 rounded-full text-sm font-bold hover:bg-white/10 transition-colors"
            >
              📞 0120-000-000
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
