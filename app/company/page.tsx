import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "会社案内",
  description: "株式会社フェリアホームの会社概要・代表挨拶・アクセスをご紹介します。",
};

const COMPANY_INFO = [
  { label: "会社名", value: "株式会社フェリアホーム" },
  { label: "代表者", value: "代表取締役 北原 啓輔（キタハラ ケイスケ）" },
  { label: "免許", value: "宅地建物取引業 東京都知事（2）第104842号" },
  { label: "事業内容", value: "不動産売買仲介業" },
  { label: "加盟団体", value: "(公社）全日本不動産協会 / (公社）首都圏不動産公正取引協議会 / (公社）東京都宅地建物取引業協会" },
  { label: "千駄ヶ谷本店", value: "〒151-0051 東京都渋谷区千駄ヶ谷4-16-7 北参道DTビル1階" },
  { label: "TEL（本店）", value: "03-5981-8601" },
  { label: "FAX（本店）", value: "03-5981-8602" },
  { label: "幡ヶ谷支店", value: "〒151-0072 東京都渋谷区幡ヶ谷2-1-4 ACN渋谷幡ヶ谷ビル3階" },
  { label: "TEL（支店）", value: "03-6276-7614" },
  { label: "営業時間", value: "9:30〜18:30" },
  { label: "定休日", value: "毎週火曜日・水曜日" },
];

const STRENGTHS = [
  {
    no: "01",
    title: "建築会社紹介までトータルサポート",
    desc: "物件紹介からご契約、住宅ローンの提案、金融機関との折衝、お引き渡し調整、お引き渡し後の相談窓口まで担当スタッフが一貫対応します。",
  },
  {
    no: "02",
    title: "相談しやすい社員雰囲気",
    desc: "お住まいを探されているお客様と同年代のスタッフが多く、些細なことでも相談しやすい会社です。有資格者の社員が対応します。",
  },
  {
    no: "03",
    title: "豊富な情報量と情報力",
    desc: "渋谷区・新宿区・世田谷区・中野区・目黒区の地域密着。多くの売主様より未公開情報を先行で保有しています。",
  },
];

const OFFICES = [
  {
    name: "千駄ヶ谷本店",
    address: "〒151-0051 東京都渋谷区千駄ヶ谷4-16-7 北参道DTビル1階",
    tel: "03-5981-8601",
    fax: "03-5981-8602",
    access: "JR線「千駄ヶ谷駅・代々木駅」より徒歩7分\n副都心線「北参道駅」より徒歩4分",
    directions: "千駄ヶ谷駅の改札を出て道路沿いに右側へ進みます。最初の信号（国立能楽堂前）を左折します。1車線の通りを直進し、くすりのカメイ様の隣のビル1階",
  },
  {
    name: "幡ヶ谷支店",
    address: "〒151-0072 東京都渋谷区幡ヶ谷2-1-4 ACN渋谷幡ヶ谷ビル3階",
    tel: "03-6276-7614",
    fax: null,
    access: "京王新線「幡ヶ谷駅」北口より徒歩2分",
    directions: "「幡ヶ谷」駅北口出口（改札を右）より地上に出て左手（甲州街道を新宿方面へ）、「我武者羅」さんの隣のビル3階",
  },
];

export default function CompanyPage() {
  return (
    <div className="bg-[#fafaf8]">
      {/* ページヘッダー */}
      <section className="pt-28 pb-16 bg-white border-b border-[#e8e6e0]">
        <div className="container-xl">
          <p className="text-[#c9a96e] text-xs tracking-[0.4em] mb-3 font-serif">COMPANY</p>
          <h1 className="font-serif text-4xl font-bold text-[#1c1b18]">会社案内</h1>
        </div>
      </section>

      {/* 代表挨拶 */}
      <section className="py-20 bg-white">
        <div className="container-xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* 代表写真 */}
            <div className="relative h-[400px] rounded-2xl overflow-hidden bg-[#e8e6e0]">
              <Image
                src="https://img.hs.aws.multi-use.net/adm1/felia/images/staff/kitahara.jpg"
                alt="代表取締役 北原 啓輔"
                fill
                className="object-cover object-top"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            {/* 挨拶文 */}
            <div>
              <p className="text-[#c9a96e] text-xs tracking-[0.4em] mb-4 font-serif">MESSAGE</p>
              <h2 className="font-serif text-2xl font-bold text-[#1c1b18] mb-6">代表挨拶</h2>
              <div className="text-[#706e68] leading-relaxed space-y-4 text-sm">
                <p>
                  私たちは、不動産の売買を通して「お客様の幸せ（feliz）を実現(realize)するパートナーとして貢献する」「弊社に関わる全ての人と幸せを共有する」との思いからフェリアホームを設立しました。
                </p>
                <p>
                  私たちが目指すのは「家族が幸せな暮らしを送って頂くこと」
                </p>
                <p>
                  お住まいをお探しのファミリーが家族として1つのサイクルを迎える10年後、20年後にフェリアホームを選んで良かったと思えるような会社である為に、お客様それぞれの家族構成・ライフスタイルに合わせた心の底から納得のいく住まいを提案をしていきます。
                </p>
                <p>
                  住まいの購入はもちろんのこと、日々の生活には様々な不安が付き纏います。そんな時、お気軽にお声掛けください。
                </p>
                <p>
                  お客様の幸せを実現するために、フェリアホームは「お客様に寄り添い、お客様の将来に亘る幸せの追求」を大切に、不動産の購入や売却におけるお客様の負担を軽減できるよう、真摯にサポートして参ります。
                </p>
              </div>
              <div className="mt-8 pt-6 border-t border-[#e8e6e0]">
                <div className="text-xs text-[#706e68] mb-1">代表取締役</div>
                <div className="font-serif text-xl font-bold text-[#1c1b18]">北原 啓輔</div>
                <div className="text-xs text-[#706e68] mt-1">キタハラ ケイスケ</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 会社の強み */}
      <section className="py-20 bg-[#fafaf8]">
        <div className="container-xl">
          <div className="text-center mb-12">
            <p className="text-[#c9a96e] text-xs tracking-[0.4em] mb-3 font-serif">OUR STRENGTH</p>
            <h2 className="font-serif text-3xl font-bold text-[#1c1b18]">フェリアホームの強み</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {STRENGTHS.map((s) => (
              <div key={s.no} className="bg-white rounded-2xl p-8 border border-[#e8e6e0]">
                <div className="font-serif text-4xl font-bold text-[#c9a96e]/30 mb-4">{s.no}</div>
                <h3 className="font-serif text-lg font-bold text-[#1a3a2a] mb-3">{s.title}</h3>
                <p className="text-sm text-[#706e68] leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 会社概要 */}
      <section className="py-20 bg-white">
        <div className="container-xl max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[#c9a96e] text-xs tracking-[0.4em] mb-3 font-serif">OVERVIEW</p>
            <h2 className="font-serif text-3xl font-bold text-[#1c1b18]">会社概要</h2>
          </div>
          <div className="bg-white rounded-2xl border border-[#e8e6e0] overflow-hidden">
            {COMPANY_INFO.map((item, i) => (
              <div key={item.label} className={`grid grid-cols-3 ${i !== 0 ? "border-t border-[#e8e6e0]" : ""}`}>
                <div className="p-5 bg-[#fafaf8]">
                  <span className="text-sm font-bold text-[#1a3a2a] whitespace-nowrap">{item.label}</span>
                </div>
                <div className="p-5 col-span-2">
                  <span className="text-sm text-[#1c1b18] leading-relaxed">{item.value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* アクセス */}
      <section className="py-20 bg-[#fafaf8]">
        <div className="container-xl">
          <div className="text-center mb-12">
            <p className="text-[#c9a96e] text-xs tracking-[0.4em] mb-3 font-serif">ACCESS</p>
            <h2 className="font-serif text-3xl font-bold text-[#1c1b18]">アクセス</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {OFFICES.map((office) => (
              <div key={office.name} className="bg-white rounded-2xl p-8 border border-[#e8e6e0]">
                <h3 className="font-serif text-xl font-bold text-[#1a3a2a] mb-6">{office.name}</h3>
                <div className="space-y-4 text-sm text-[#706e68]">
                  <div>
                    <div className="font-bold text-[#1c1b18] mb-1">住所</div>
                    <p>{office.address}</p>
                  </div>
                  <div>
                    <div className="font-bold text-[#1c1b18] mb-1">電話</div>
                    <p>
                      TEL: <a href={`tel:${office.tel}`} className="text-[#1a3a2a] hover:text-[#c9a96e] transition-colors">{office.tel}</a>
                      {office.fax && <span> / FAX: {office.fax}</span>}
                    </p>
                  </div>
                  <div>
                    <div className="font-bold text-[#1c1b18] mb-1">アクセス</div>
                    <p className="whitespace-pre-line">{office.access}</p>
                  </div>
                  <div>
                    <div className="font-bold text-[#1c1b18] mb-1">道順</div>
                    <p className="leading-relaxed">{office.directions}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-white">
        <div className="container-xl text-center">
          <Link
            href="/contact"
            className="inline-block bg-[#c9a96e] text-white px-10 py-4 rounded-full font-bold text-sm hover:bg-[#b8935a] transition-colors"
          >
            お問合せはこちら
          </Link>
        </div>
      </section>
    </div>
  );
}
