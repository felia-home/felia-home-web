// app/about/page.tsx
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, MapPin } from "lucide-react";
import { getCompanyInfo, getCompanyBranches } from "@/lib/api";

export const metadata: Metadata = {
  title: "フェリアホームについて",
  description: "フェリアホームが選ばれる理由、代表ごあいさつ、会社概要、アクセスをご紹介します。",
};

export default async function AboutPage() {
  const [company, branches] = await Promise.all([
    getCompanyInfo(),
    getCompanyBranches(),
  ]);

  const mapsKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  const reasons = [
    {
      num: "01",
      title: "建築会社紹介まで\nトータルサポート",
      text: "【心の底から納得いく住まい】を実現するために、物件の紹介からご契約、住宅ローンの提案、金融機関との折衝、お引き渡しにおける調整、お引き渡し後の相談窓口として、担当スタッフが一貫して対応致します。",
    },
    {
      num: "02",
      title: "相談しやすい\n社員雰囲気",
      text: "お住まいを探されているお客様と同年代のスタッフが多く、些細なことでも相談しやすい会社です。また、不動産の経験を長く積んでいる有資格者の社員がお客様のご対応をいたします。不動産に関する知識は豊富にございますので、些細な事でも分からない事はお気軽にお聞きください。",
    },
    {
      num: "03",
      title: "豊富な\n情報量と情報力",
      text: "弊社所在地である世塚を中心に、近隣エリア（渋谷区・新宿区・世田谷区・中野区・目黒区）地域密着の不動産会社です。吸引のある多くの売主様より、これから販売を検討している情報や更にその前の仕入れを行おうとしている不動産の情報を先行で知る事ができる為、数多くの未公開情報を保有しております。",
    },
  ];

  return (
    <div style={{ backgroundColor: "#ffffff" }}>

      {/* パンくず */}
      <div style={{ backgroundColor: "#F8F8F8", padding: "8px 0" }}>
        <div className="container-content">
          <nav style={{ fontSize: "12px", color: "#999", display: "flex", alignItems: "center", gap: "4px" }}>
            <Link href="/" style={{ color: "#999", textDecoration: "none" }}>TOP</Link>
            <ChevronRight size={12} />
            <span style={{ color: "#333" }}>フェリアホームについて</span>
          </nav>
        </div>
      </div>

      {/* タイトル */}
      <div className="container-content" style={{ padding: "24px 0 0" }}>
        <h1 style={{ fontSize: "clamp(22px, 3vw, 32px)", fontWeight: "bold", color: "#1a1a1a", fontFamily: "'Noto Serif JP', serif" }}>
          フェリアホームについて
        </h1>
      </div>

      {/* ヒーロー画像（フルワイド） */}
      <div style={{ position: "relative", width: "100%", height: "clamp(200px, 35vw, 400px)", overflow: "hidden", marginTop: "24px" }}>
        <Image
          src="/images/about/abouthero.jpg"
          alt="フェリアホームについて"
          fill
          style={{ objectFit: "cover", objectPosition: "center" }}
          priority
          sizes="100vw"
        />
      </div>

      {/* ── フェリアホームが選ばれる理由 ─────────── */}
      <section style={{ padding: "64px 0" }}>
        <div className="container-content">
          <h2 style={{ fontSize: "clamp(16px, 2vw, 20px)", color: "#888", marginBottom: "48px", textAlign: "center", letterSpacing: "0.2em" }}>
            フェリアホームが選ばれる理由
          </h2>
          <div style={{ display: "grid", gap: "48px" }}>
            {reasons.map((r, i) => (
              <div key={r.num} style={{
                display: "grid",
                gridTemplateColumns: i % 2 === 0 ? "200px 1fr" : "1fr 200px",
                gap: "48px",
                alignItems: "start",
              }} className="grid-cols-1 tb:grid-cols-[200px_1fr]">
                {i % 2 === 0 ? (
                  <>
                    <div>
                      <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "48px", color: "#E5E5E5", fontWeight: "bold", lineHeight: 1, marginBottom: "8px" }}>
                        {r.num}
                      </p>
                      <h3 style={{ fontSize: "18px", fontWeight: "bold", color: "#1a1a1a", lineHeight: 1.5, whiteSpace: "pre-line", fontFamily: "'Noto Serif JP', serif" }}>
                        {r.title}
                      </h3>
                    </div>
                    <p style={{ fontSize: "14px", color: "#555", lineHeight: 2, paddingTop: "12px" }}>{r.text}</p>
                  </>
                ) : (
                  <>
                    <p style={{ fontSize: "14px", color: "#555", lineHeight: 2, paddingTop: "12px" }}>{r.text}</p>
                    <div style={{ textAlign: "right" }}>
                      <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "48px", color: "#E5E5E5", fontWeight: "bold", lineHeight: 1, marginBottom: "8px" }}>
                        {r.num}
                      </p>
                      <h3 style={{ fontSize: "18px", fontWeight: "bold", color: "#1a1a1a", lineHeight: 1.5, whiteSpace: "pre-line", fontFamily: "'Noto Serif JP', serif" }}>
                        {r.title}
                      </h3>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 代表写真（フルワイド） ──────────────── */}
      <div style={{ position: "relative", width: "100%", height: "clamp(240px, 40vw, 480px)", overflow: "hidden" }}>
        <Image
          src="/images/about/ceohero.jpg"
          alt="代表取締役 北原啓輔"
          fill
          style={{ objectFit: "cover", objectPosition: "center top" }}
          sizes="100vw"
        />
      </div>

      {/* ── ごあいさつ ──────────────────────────── */}
      <section style={{ padding: "64px 0" }}>
        <div className="container-content" style={{ maxWidth: "760px", margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(18px, 2.5vw, 28px)", fontWeight: "bold", color: "#1a1a1a", marginBottom: "40px", fontFamily: "'Noto Serif JP', serif", letterSpacing: "0.2em" }}>
            ごあいさつ
          </h2>
          <p style={{ fontSize: "16px", fontWeight: "bold", color: "#1a1a1a", marginBottom: "24px", lineHeight: 1.7 }}>
            私たちが目指すのは<br />
            「家族が幸せな暮らしを送って頂くこと」
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <p style={{ fontSize: "14px", color: "#555", lineHeight: 2 }}>
              私たちは、不動産の売買を通して「お客様の幸せ（feliz）を実現(realize)するパートナーとして貢献する」「弊社に関わる全ての人と幸せを共有する」との思いからフェリアホームを設立しました。
            </p>
            <p style={{ fontSize: "14px", color: "#555", lineHeight: 2 }}>
              私たちが目指すのは「家族が幸せな暮らしを送って頂くこと」<br />
              お住まいをお探しのファミリーが家族として1つのサイクルを迎える10年後、20年後にフェリアホームを選んで良かったと思えるような会社である為に、お客様それぞれの家族構成・ライフスタイルに合わせた【心の底から納得のいく住まいを】提案をしていきます。
            </p>
            <p style={{ fontSize: "14px", color: "#555", lineHeight: 2 }}>
              住まいの購入はもちろんのこと、日々の生活には様々な不安が付き纏います。そんな時、お気軽にお声掛けください。
            </p>
            <p style={{ fontSize: "14px", color: "#555", lineHeight: 2 }}>
              お客様の幸せを実現するために、フェリアホームは「お客様に寄り添い、お客様の将来に亘る幸せの追求」を大切に、不動産の購入や売却におけるお客様の負担を軽減できるよう、真摯にサポートして参ります。
            </p>
          </div>
          <div style={{ marginTop: "32px" }}>
            <p style={{ fontSize: "12px", color: "#888" }}>代表取締役</p>
            <p style={{ fontSize: "22px", fontWeight: "bold", color: "#1a1a1a", fontFamily: "'Noto Serif JP', serif", letterSpacing: "0.1em" }}>
              北原　啓輔
            </p>
          </div>
        </div>
      </section>

      {/* ── 会社概要 ─────────────────────────────── */}
      <section style={{ padding: "64px 0", backgroundColor: "#F8F8F8" }}>
        <div className="container-content">
          <div style={{ display: "grid", gap: "40px", alignItems: "start" }}
            className="grid-cols-1 tb:grid-cols-2">
            <div>
              <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "28px", fontStyle: "italic", color: "#1a1a1a", marginBottom: "4px" }}>
                Company
              </p>
              <p style={{ fontSize: "13px", color: "#888", marginBottom: "32px" }}>会社概要</p>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                <tbody>
                  {[
                    { label: "会社名", value: company?.name ?? "株式会社フェリアホーム　千駄ヶ谷本店" },
                    { label: "代表者", value: "北原 啓輔" },
                    { label: "所在地", value: company?.address ?? "" },
                    { label: "TEL", value: company?.phone ?? "" },
                    { label: "FAX", value: company?.fax ?? "" },
                    { label: "事業内容", value: "不動産売買仲介業" },
                    { label: "免許番号", value: company?.license ?? "" },
                    { label: "加盟団体", value: "（公社）全日本不動産協会\n（公社）首都圏不動産公正取引協議会\n（公社）東京都宅地建物取引業協会" },
                  ].filter(r => r.value).map((row) => (
                    <tr key={row.label} style={{ borderBottom: "1px solid #E5E5E5" }}>
                      <td style={{ padding: "10px 0", color: "#888", width: "80px", verticalAlign: "top" }}>{row.label}</td>
                      <td style={{ padding: "10px 0 10px 16px", color: "#333", whiteSpace: "pre-line" }}>{row.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* 会社写真 */}
            <div style={{ position: "relative", width: "100%", aspectRatio: "4/3", borderRadius: "8px", overflow: "hidden" }}>
              <Image
                src="/images/about/company-info.jpg"
                alt="フェリアホーム オフィス"
                fill
                style={{ objectFit: "cover" }}
                sizes="50vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── アクセス（本店） ─────────────────────── */}
      <AccessSection
        title="株式会社フェリアホーム　千駄ヶ谷本店"
        postalCode={company?.postal_code ?? "151-0051"}
        address={company?.address ?? "東京都渋谷区千駄ヶ谷4-16-7 北参道DTビル1階"}
        phone={company?.phone ?? "03-5981-8601"}
        accessText={company?.access_text ?? "千駄ヶ谷駅の改札を出て道路沿いに右側へ進みます。最初の信号（国立能楽堂前）を左折します。1車線の通りを直進し、くすりのカメイ様の隣のビル1階となります。"}
        lat={company?.lat ?? 35.6773}
        lng={company?.lng ?? 139.6858}
        mapsKey={mapsKey}
      />

      {/* ── アクセス（支店） ─────────────────────── */}
      {branches.map((branch) => (
        <AccessSection
          key={branch.id}
          title={branch.name}
          postalCode={branch.postal_code}
          address={branch.address}
          phone={branch.phone}
          accessText={branch.access_text}
          lat={branch.lat}
          lng={branch.lng}
          mapsKey={mapsKey}
          gray
        />
      ))}

    </div>
  );
}

// アクセスセクションコンポーネント
function AccessSection({
  title, postalCode, address, phone, accessText, lat, lng, mapsKey, gray,
}: {
  title: string;
  postalCode?: string | null;
  address: string;
  phone?: string | null;
  accessText?: string | null;
  lat?: number | null;
  lng?: number | null;
  mapsKey?: string;
  gray?: boolean;
}) {
  const mapSrc = mapsKey && lat && lng
    ? `https://www.google.com/maps/embed/v1/place?key=${mapsKey}&q=${lat},${lng}&zoom=16`
    : null;

  const googleMapsUrl = lat && lng
    ? `https://www.google.com/maps?q=${lat},${lng}`
    : `https://www.google.com/maps/search/${encodeURIComponent(address)}`;

  return (
    <section style={{ padding: "64px 0", backgroundColor: gray ? "#F8F8F8" : "#ffffff" }}>
      <div className="container-content">
        <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "28px", fontStyle: "italic", color: "#1a1a1a", marginBottom: "4px" }}>
          Access
        </p>
        <p style={{ fontSize: "13px", color: "#888", marginBottom: "32px" }}>アクセス</p>
        <div style={{ display: "grid", gap: "40px", alignItems: "start" }}
          className="grid-cols-1 tb:grid-cols-2">
          {/* 左: テキスト */}
          <div>
            <h3 style={{ fontSize: "18px", fontWeight: "bold", color: "#1a1a1a", marginBottom: "16px", fontFamily: "'Noto Serif JP', serif" }}>
              {title}
            </h3>
            {postalCode ? (
              <p style={{ fontSize: "13px", color: "#555", marginBottom: "4px" }}>〒{postalCode} {address}</p>
            ) : (
              <p style={{ fontSize: "13px", color: "#555", marginBottom: "4px" }}>{address}</p>
            )}
            {phone && (
              <p style={{ fontSize: "13px", color: "#555", marginBottom: "16px" }}>TEL：{phone}</p>
            )}
            {accessText && (
              <p style={{ fontSize: "13px", color: "#666", lineHeight: 1.9 }}>{accessText}</p>
            )}
          </div>
          {/* 右: 地図 */}
          <div>
            <div style={{ borderRadius: "8px", overflow: "hidden", border: "1px solid #E5E5E5", aspectRatio: "4/3", backgroundColor: "#EBF7EA", display: "flex", alignItems: "center", justifyContent: "center" }}>
              {mapSrc ? (
                <iframe
                  src={mapSrc}
                  width="100%"
                  height="100%"
                  style={{ border: 0, display: "block" }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              ) : (
                <div style={{ textAlign: "center", color: "#888", fontSize: "12px" }}>
                  <MapPin size={28} style={{ color: "#5BAD52", margin: "0 auto 8px", display: "block" }} />
                  <p>{address}</p>
                </div>
              )}
            </div>
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex", alignItems: "center", justifyContent: "flex-end",
                gap: "4px", marginTop: "8px",
                fontSize: "12px", color: "#555", textDecoration: "none",
              }}
            >
              Googleマップで見る →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
