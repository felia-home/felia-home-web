// app/company/page.tsx
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "会社案内 | フェリアホーム",
  description: "フェリアホームの会社概要・代表挨拶・強み・アクセスをご紹介します。",
};

// ---- カラー定数 ----
const C = {
  bg: "#fafaf8",
  gold: "#c9a96e",
  goldHover: "#b8935a",
  border: "#e8e6e0",
  text: "#1c1b18",
  sub: "#706e68",
  green: "#1a3a2a",
  white: "#ffffff",
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
    fax: null as string | null,
    access: "京王新線「幡ヶ谷駅」北口より徒歩2分",
    directions: "「幡ヶ谷」駅北口出口（改札を右）より地上に出て左手（甲州街道を新宿方面へ）、「我武者羅」さんの隣のビル3階",
  },
];

export default function CompanyPage() {
  return (
    <main style={{ backgroundColor: C.bg, color: C.text }}>

      {/* ページヘッダー */}
      <section style={{ backgroundColor: C.white, borderBottom: `1px solid ${C.border}`, padding: "112px 24px 64px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <p style={{ fontSize: "11px", letterSpacing: "0.4em", color: C.gold, marginBottom: "12px", fontFamily: "'Noto Serif JP', serif" }}>
            COMPANY
          </p>
          <h1 style={{ fontSize: "clamp(28px, 5vw, 48px)", fontWeight: "bold", color: C.green, margin: "0 0 16px", lineHeight: 1.2 }}>
            会社案内
          </h1>
          <p style={{ fontSize: "15px", color: C.sub, lineHeight: 1.8, maxWidth: "640px" }}>
            フェリアホームの想いと歩みをご紹介します。
          </p>
        </div>
      </section>

      {/* 代表挨拶 */}
      <section style={{ padding: "80px 24px", backgroundColor: C.white }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div className="company-2col-grid" style={{ display: "grid", gap: "48px", alignItems: "center" }}>
            {/* 写真 */}
            <div style={{ position: "relative", height: "400px", borderRadius: "16px", overflow: "hidden", backgroundColor: C.border }}>
              <Image
                src="https://img.hs.aws.multi-use.net/adm1/felia/images/staff/kitahara.jpg"
                alt="代表 北原 啓輔"
                fill
                style={{ objectFit: "cover", objectPosition: "center top" }}
                sizes="(max-width: 1023px) 100vw, 50vw"
              />
            </div>
            {/* テキスト */}
            <div>
              <p style={{ fontSize: "11px", letterSpacing: "0.4em", color: C.gold, marginBottom: "12px", fontFamily: "'Montserrat', sans-serif" }}>
                MESSAGE
              </p>
              <h2 style={{ fontSize: "clamp(22px, 3vw, 32px)", fontWeight: "bold", color: C.green, margin: "0 0 24px", lineHeight: 1.4, fontFamily: "'Noto Serif JP', serif" }}>
                代表挨拶
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "16px", color: C.sub, fontSize: "14px", lineHeight: 1.9, marginBottom: "32px" }}>
                <p style={{ margin: 0 }}>
                  私たちは、不動産の売買を通して「お客様の幸せ（feliz）を実現(realize)するパートナーとして貢献する」「弊社に関わる全ての人と幸せを共有する」との思いからフェリアホームを設立しました。
                </p>
                <p style={{ margin: 0 }}>私たちが目指すのは「家族が幸せな暮らしを送って頂くこと」</p>
                <p style={{ margin: 0 }}>
                  お住まいをお探しのファミリーが家族として1つのサイクルを迎える10年後、20年後にフェリアホームを選んで良かったと思えるような会社である為に、お客様それぞれの家族構成・ライフスタイルに合わせた心の底から納得のいく住まいを提案をしていきます。
                </p>
                <p style={{ margin: 0 }}>
                  住まいの購入はもちろんのこと、日々の生活には様々な不安が付き纏います。そんな時、お気軽にお声掛けください。
                </p>
                <p style={{ margin: 0 }}>
                  お客様の幸せを実現するために、フェリアホームは「お客様に寄り添い、お客様の将来に亘る幸せの追求」を大切に、不動産の購入や売却におけるお客様の負担を軽減できるよう、真摯にサポートして参ります。
                </p>
              </div>
              <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: "24px" }}>
                <p style={{ fontSize: "12px", color: C.sub, margin: "0 0 4px" }}>代表取締役</p>
                <p style={{ fontSize: "22px", fontWeight: "bold", color: C.green, fontFamily: "'Noto Serif JP', serif", margin: 0 }}>北原 啓輔</p>
                <p style={{ fontSize: "12px", color: C.sub, marginTop: "4px" }}>キタハラ ケイスケ</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 会社の強み */}
      <section style={{ padding: "80px 24px", backgroundColor: C.bg }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <p style={{ fontSize: "11px", letterSpacing: "0.4em", color: C.gold, marginBottom: "12px", fontFamily: "'Montserrat', sans-serif", textAlign: "center" }}>
            OUR STRENGTH
          </p>
          <h2 style={{ fontSize: "clamp(22px, 3vw, 32px)", fontWeight: "bold", color: C.green, textAlign: "center", margin: "0 0 48px", fontFamily: "'Noto Serif JP', serif" }}>
            フェリアホームの強み
          </h2>
          <div className="company-3col-grid" style={{ display: "grid", gap: "24px" }}>
            {STRENGTHS.map((s) => (
              <div key={s.no} style={{
                backgroundColor: C.white, borderRadius: "16px",
                padding: "32px 28px", border: `1px solid ${C.border}`,
              }}>
                <div style={{
                  width: "48px", height: "48px", borderRadius: "50%",
                  backgroundColor: C.green, display: "flex",
                  alignItems: "center", justifyContent: "center",
                  marginBottom: "16px",
                }}>
                  <span style={{ color: C.gold, fontSize: "18px", fontWeight: "bold", fontFamily: "'Noto Serif JP', serif" }}>{s.no}</span>
                </div>
                <h3 style={{ fontSize: "16px", fontWeight: "bold", color: C.green, margin: "0 0 10px", lineHeight: 1.4, fontFamily: "'Noto Serif JP', serif" }}>
                  {s.title}
                </h3>
                <p style={{ fontSize: "13px", color: C.sub, lineHeight: 1.8, margin: 0 }}>
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 会社概要 */}
      <section style={{ padding: "80px 24px", backgroundColor: C.white }}>
        <div style={{ maxWidth: "860px", margin: "0 auto" }}>
          <p style={{ fontSize: "11px", letterSpacing: "0.4em", color: C.gold, marginBottom: "12px", fontFamily: "'Montserrat', sans-serif", textAlign: "center" }}>
            OVERVIEW
          </p>
          <h2 style={{ fontSize: "clamp(22px, 3vw, 32px)", fontWeight: "bold", color: C.green, textAlign: "center", margin: "0 0 40px", fontFamily: "'Noto Serif JP', serif" }}>
            会社概要
          </h2>
          <div style={{ backgroundColor: C.white, borderRadius: "16px", border: `1px solid ${C.border}`, overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <tbody>
                {COMPANY_INFO.map((row, i) => (
                  <tr key={row.label} style={{ borderTop: i > 0 ? `1px solid ${C.border}` : "none" }}>
                    <th style={{
                      width: "180px", padding: "18px 20px",
                      fontSize: "13px", color: C.green, fontWeight: "bold",
                      textAlign: "left", verticalAlign: "top", whiteSpace: "nowrap",
                      backgroundColor: C.bg,
                    }}>
                      {row.label}
                    </th>
                    <td style={{ padding: "18px 20px", fontSize: "14px", color: C.text, lineHeight: 1.7 }}>
                      {row.value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* アクセス */}
      <section style={{ padding: "80px 24px", backgroundColor: C.bg }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <p style={{ fontSize: "11px", letterSpacing: "0.4em", color: C.gold, marginBottom: "12px", fontFamily: "'Montserrat', sans-serif", textAlign: "center" }}>
            ACCESS
          </p>
          <h2 style={{ fontSize: "clamp(22px, 3vw, 32px)", fontWeight: "bold", color: C.green, textAlign: "center", margin: "0 0 48px", fontFamily: "'Noto Serif JP', serif" }}>
            アクセス
          </h2>
          <div className="company-2col-grid" style={{ display: "grid", gap: "24px" }}>
            {OFFICES.map((office) => (
              <div key={office.name} style={{ backgroundColor: C.white, borderRadius: "16px", padding: "32px", border: `1px solid ${C.border}` }}>
                <h3 style={{ fontSize: "20px", fontWeight: "bold", color: C.green, margin: "0 0 24px", fontFamily: "'Noto Serif JP', serif" }}>
                  {office.name}
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "16px", fontSize: "13px", color: C.sub }}>
                  <div>
                    <p style={{ fontWeight: "bold", color: C.text, margin: "0 0 4px" }}>住所</p>
                    <p style={{ margin: 0, lineHeight: 1.7 }}>{office.address}</p>
                  </div>
                  <div>
                    <p style={{ fontWeight: "bold", color: C.text, margin: "0 0 4px" }}>電話</p>
                    <p style={{ margin: 0 }}>
                      TEL:{" "}
                      <a href={`tel:${office.tel.replace(/-/g, "")}`} style={{ color: C.green, textDecoration: "none", fontWeight: "500" }}>
                        {office.tel}
                      </a>
                      {office.fax && <span> / FAX: {office.fax}</span>}
                    </p>
                  </div>
                  <div>
                    <p style={{ fontWeight: "bold", color: C.text, margin: "0 0 4px" }}>アクセス</p>
                    <p style={{ margin: 0, whiteSpace: "pre-line", lineHeight: 1.7 }}>{office.access}</p>
                  </div>
                  <div>
                    <p style={{ fontWeight: "bold", color: C.text, margin: "0 0 4px" }}>道順</p>
                    <p style={{ margin: 0, lineHeight: 1.8 }}>{office.directions}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "64px 24px", backgroundColor: C.white, textAlign: "center" }}>
        <Link
          href="/contact"
          style={{
            display: "inline-block",
            padding: "16px 40px",
            backgroundColor: C.gold,
            color: C.white,
            borderRadius: "9999px",
            textDecoration: "none",
            fontSize: "13px",
            fontWeight: "bold",
            letterSpacing: "0.05em",
          }}
        >
          お問合せはこちら
        </Link>
      </section>
    </main>
  );
}
