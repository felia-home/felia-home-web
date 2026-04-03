import { Metadata } from "next";

export const metadata: Metadata = {
  title: "プライバシーポリシー",
};

export default function PrivacyPage() {
  return (
    <div className="pt-28 pb-20 bg-[#fafaf8] min-h-screen">
      <div className="container-xl max-w-3xl mx-auto">
        <div className="mb-10">
          <p className="text-[#c9a96e] text-xs tracking-[0.3em] mb-2 font-serif">PRIVACY POLICY</p>
          <h1 className="font-serif text-3xl font-bold text-[#1c1b18]">プライバシーポリシー</h1>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-sm prose prose-sm max-w-none text-[#1c1b18]">
          <p className="text-[#706e68] mb-8">
            株式会社フェリアホーム（以下「当社」）は、お客様の個人情報の保護を重要な責務と考え、
            以下のプライバシーポリシーに従い適切に取り扱います。
          </p>

          <section className="mb-8">
            <h2 className="font-serif text-lg font-bold mb-3">1. 個人情報の収集</h2>
            <p className="text-sm text-[#706e68] leading-relaxed">
              当社は、お問合せ・資料請求・物件紹介等のサービス提供にあたり、
              お名前・ご連絡先・ご要望内容等の個人情報をご提供いただく場合があります。
            </p>
          </section>

          <section className="mb-8">
            <h2 className="font-serif text-lg font-bold mb-3">2. 個人情報の利用目的</h2>
            <ul className="text-sm text-[#706e68] leading-relaxed space-y-1 list-disc list-inside">
              <li>お問合せへの回答・ご連絡</li>
              <li>物件情報・サービスのご案内</li>
              <li>売買・賃貸取引の手続き</li>
              <li>当社サービスの改善・向上</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="font-serif text-lg font-bold mb-3">3. 個人情報の第三者提供</h2>
            <p className="text-sm text-[#706e68] leading-relaxed">
              当社は、法令に基づく場合を除き、お客様の同意なく第三者に個人情報を提供しません。
              ただし、取引の相手方・金融機関・司法書士等、取引遂行に必要な範囲で共有する場合があります。
            </p>
          </section>

          <section className="mb-8">
            <h2 className="font-serif text-lg font-bold mb-3">4. 個人情報の管理</h2>
            <p className="text-sm text-[#706e68] leading-relaxed">
              当社は、個人情報の漏洩・滅失・毀損を防止するため、適切なセキュリティ措置を講じます。
              個人情報へのアクセスは、業務上必要な担当者に限定します。
            </p>
          </section>

          <section className="mb-8">
            <h2 className="font-serif text-lg font-bold mb-3">5. 開示・訂正・削除</h2>
            <p className="text-sm text-[#706e68] leading-relaxed">
              お客様ご自身の個人情報について、開示・訂正・削除をご希望の場合は、
              下記お問合せ窓口にご連絡ください。本人確認後、適切に対応いたします。
            </p>
          </section>

          <section className="mb-8">
            <h2 className="font-serif text-lg font-bold mb-3">6. お問合せ窓口</h2>
            <p className="text-sm text-[#706e68] leading-relaxed">
              株式会社フェリアホーム 個人情報取扱窓口<br />
              〒XXX-XXXX 東京都渋谷区千駄ヶ谷X-XX-XX<br />
              TEL: 0120-000-000<br />
              受付時間: 9:00〜18:00（定休日除く）
            </p>
          </section>

          <p className="text-xs text-[#706e68] text-right">制定日: 2024年4月1日</p>
        </div>
      </div>
    </div>
  );
}
