import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "会社案内",
  description: "株式会社フェリアホームの会社概要・理念・アクセスをご紹介します。",
};

const COMPANY_INFO = [
  { label: "会社名", value: "株式会社フェリアホーム" },
  { label: "代表者", value: "代表取締役 〇〇 〇〇" },
  { label: "設立", value: "2004年4月" },
  { label: "免許", value: "宅地建物取引業 東京都知事(X)第XXXXX号" },
  { label: "所在地", value: "〒XXX-XXXX 東京都渋谷区千駄ヶ谷X-XX-XX" },
  { label: "TEL", value: "0120-000-000" },
  { label: "FAX", value: "03-0000-0000" },
  { label: "営業時間", value: "9:00〜18:00" },
  { label: "定休日", value: "毎週水曜日・年末年始" },
  { label: "事業内容", value: "不動産売買仲介・賃貸仲介・不動産コンサルティング" },
];

export default function CompanyPage() {
  return (
    <div className="pt-28 pb-20 bg-[#fafaf8] min-h-screen">
      <div className="container-xl">
        <div className="mb-12 text-center">
          <p className="text-[#c9a96e] text-xs tracking-[0.3em] mb-2 font-serif">COMPANY</p>
          <h1 className="font-serif text-3xl font-bold text-[#1c1b18]">会社案内</h1>
        </div>

        {/* 理念 */}
        <div className="bg-[#1a3a2a] rounded-2xl p-10 mb-12 text-white text-center">
          <p className="text-[#c9a96e] text-xs tracking-[0.3em] mb-4 font-serif">OUR MISSION</p>
          <h2 className="font-serif text-2xl font-bold mb-6">
            あなたの幸せを、住まいで実現する。
          </h2>
          <p className="text-white/75 text-sm leading-relaxed max-w-xl mx-auto">
            フェリアホームは、東京都心・城南・城西エリアに特化した不動産会社です。
            地域に根ざした20年の経験と、宅地建物取引士のプロフェッショナルが、
            お客様の大切な住まい探しを全力でサポートします。
          </p>
        </div>

        {/* 会社情報 */}
        <div className="bg-white rounded-2xl p-8 shadow-sm mb-12">
          <h2 className="font-serif text-xl font-bold text-[#1c1b18] mb-6">会社概要</h2>
          <table className="w-full text-sm">
            <tbody>
              {COMPANY_INFO.map((item) => (
                <tr key={item.label} className="border-b border-[#e8e6e0]">
                  <th className="text-left py-3 pr-6 w-1/4 text-[#706e68] font-normal whitespace-nowrap">
                    {item.label}
                  </th>
                  <td className="py-3 text-[#1c1b18]">{item.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* アクセス */}
        <div className="bg-white rounded-2xl p-8 shadow-sm mb-12">
          <h2 className="font-serif text-xl font-bold text-[#1c1b18] mb-4">アクセス</h2>
          <div className="h-64 rounded-xl overflow-hidden bg-[#e8e6e0] flex items-center justify-center text-[#706e68]">
            <p className="text-sm">地図を表示するにはGoogle Maps APIキーが必要です</p>
          </div>
          <p className="text-sm text-[#706e68] mt-4">
            〒XXX-XXXX 東京都渋谷区千駄ヶ谷X-XX-XX<br />
            JR千駄ヶ谷駅 徒歩3分 / 東京メトロ副都心線 北参道駅 徒歩5分
          </p>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link
            href="/contact"
            className="inline-block bg-[#c9a96e] text-white px-10 py-4 rounded-full font-bold text-sm hover:bg-[#b8935a] transition-colors"
          >
            お問合せはこちら
          </Link>
        </div>
      </div>
    </div>
  );
}
