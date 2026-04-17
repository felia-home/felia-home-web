import Image from "next/image";
import Link from "next/link";
import { getRecruitStaff } from "@/lib/api";
import StaffCard from "@/components/recruit/StaffCard";

export const revalidate = 60;

export default async function RecruitPage() {
  const recruitStaff = await getRecruitStaff();

  return (
    <main style={{ backgroundColor: "#fff" }}>

      {/* ① ヒーローバナー */}
      <div style={{ position: "relative", width: "100%", height: "500px" }}>
        <Image
          src="/images/recruit/recruithero.jpg"
          alt="フェリアホーム 採用"
          fill
          priority
          quality={90}
          style={{ objectFit: "cover", objectPosition: "center" }}
          sizes="100vw"
        />
        <div style={{
          position: "absolute", inset: 0,
          backgroundColor: "rgba(0,0,0,0.35)",
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          textAlign: "center", padding: "0 24px",
        }}>
          <p style={{
            fontSize: "13px", color: "rgba(255,255,255,0.8)",
            letterSpacing: "0.2em", margin: "0 0 16px",
            fontFamily: "'Montserrat', sans-serif",
          }}>
            RECRUIT
          </p>
          <h1 style={{
            fontSize: "clamp(28px, 5vw, 48px)",
            fontWeight: "bold", color: "#fff",
            lineHeight: 1.3, margin: "0 0 20px",
          }}>
            人を本気で大切に。<br />
            本気の私たちと共に歩みます。
          </h1>
          <p style={{
            fontSize: "15px", color: "rgba(255,255,255,0.85)",
            lineHeight: 1.8, maxWidth: "600px",
          }}>
            フェリアホームは、不動産を通じて「人の暮らし」に向き合う会社です。<br />
            お客様の大切な人生の転機に真剣に向き合える仲間を探しています。
          </p>
        </div>
      </div>

      {/* ② 事業内容 */}
      <div style={{ padding: "80px 24px", maxWidth: "1100px", margin: "0 auto" }}>
        <SectionHeader en="BUSINESS" ja="事業内容" />
        <div style={{ position: "relative", width: "100%", borderRadius: "12px", overflow: "hidden" }}>
          <Image
            src="/images/recruit/recruit_business01.png"
            alt="事業内容"
            width={1100}
            height={600}
            style={{ width: "100%", height: "auto", display: "block" }}
          />
        </div>
      </div>

      {/* ③ スタッフインタビュー */}
      {recruitStaff.length > 0 && (
        <div style={{ backgroundColor: "#f9f9f9", padding: "80px 24px" }}>
          <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
            <SectionHeader en="INTERVIEW" ja="スタッフインタビュー" />
            <p style={{ textAlign: "center", fontSize: "13px", color: "#888", marginTop: "-24px", marginBottom: "40px" }}>
              クリックするとインタビューをご覧いただけます
            </p>
            <div className="recruit-staff-grid">
              {recruitStaff.map(staff => (
                <StaffCard key={staff.id} staff={staff} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ④ キャリアステップ */}
      <div style={{ padding: "80px 24px", maxWidth: "1100px", margin: "0 auto" }}>
        <SectionHeader en="CAREER STEP" ja="キャリアステップ" />
        <Image
          src="/images/recruit/recruit_career01.png"
          alt="キャリアステップ"
          width={1100}
          height={600}
          style={{ width: "100%", height: "auto", display: "block", borderRadius: "12px" }}
        />
      </div>

      {/* ⑤ 入社後のロードマップ */}
      <div style={{ backgroundColor: "#f9f9f9", padding: "80px 24px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <SectionHeader en="ROAD MAP" ja="入社後のロードマップ" />
          <Image
            src="/images/recruit/recruit_road01.png"
            alt="入社後のロードマップ"
            width={1100}
            height={600}
            style={{ width: "100%", height: "auto", display: "block", borderRadius: "12px" }}
          />
        </div>
      </div>

      {/* ⑥ 当社の強み */}
      <div style={{ padding: "80px 24px", maxWidth: "1100px", margin: "0 auto" }}>
        <SectionHeader en="STRENGTH" ja="当社の強み" />
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {[
            "/images/recruit/recruit_strength01.png",
            "/images/recruit/recruit_strength02.png",
            "/images/recruit/recruit_strength03.png",
          ].map((src, i) => (
            <Image
              key={i}
              src={src}
              alt={`当社の強み ${i + 1}`}
              width={1100}
              height={400}
              style={{ width: "100%", height: "auto", display: "block", borderRadius: "12px" }}
            />
          ))}
        </div>
      </div>

      {/* ⑦ 営業の1日の流れ */}
      <div style={{ backgroundColor: "#f9f9f9", padding: "80px 24px" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <SectionHeader en="ONE DAY" ja="営業の1日の流れ" />
          <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
            {[
              { time: "9:00",  label: "出社・朝礼",        desc: "メールチェック、本日の訪問先・内覧の確認" },
              { time: "10:00", label: "物件調査・資料作成", desc: "新規物件の現地確認、販売図面作成" },
              { time: "12:00", label: "昼食",              desc: "チームメンバーと外食、情報共有" },
              { time: "13:00", label: "お客様対応・内覧",   desc: "ご購入・売却検討のお客様と物件案内" },
              { time: "16:00", label: "商談・契約手続き",   desc: "重要事項説明、売買契約の締結サポート" },
              { time: "18:00", label: "事務作業・日報",     desc: "顧客情報更新、翌日の準備" },
              { time: "18:30", label: "退社",              desc: "残業は月平均20時間程度" },
            ].map((item, i, arr) => (
              <div key={i} style={{ display: "flex", gap: "0", alignItems: "stretch" }}>
                {/* 時間 */}
                <div style={{
                  width: "80px", flexShrink: 0,
                  textAlign: "right", paddingRight: "16px",
                  paddingTop: "20px",
                }}>
                  <span style={{
                    fontSize: "14px", fontWeight: "bold",
                    color: "#5BAD52",
                    fontFamily: "'Montserrat', sans-serif",
                  }}>
                    {item.time}
                  </span>
                </div>
                {/* タイムライン線 */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
                  <div style={{
                    width: "14px", height: "14px",
                    borderRadius: "50%",
                    backgroundColor: "#5BAD52",
                    marginTop: "22px", flexShrink: 0,
                  }} />
                  {i < arr.length - 1 && (
                    <div style={{ width: "2px", flex: 1, backgroundColor: "#d4edda", minHeight: "32px" }} />
                  )}
                </div>
                {/* 内容 */}
                <div style={{ paddingLeft: "16px", paddingBottom: "24px", paddingTop: "16px", flex: 1 }}>
                  <p style={{ fontSize: "15px", fontWeight: "bold", color: "#333", margin: "0 0 4px" }}>
                    {item.label}
                  </p>
                  <p style={{ fontSize: "13px", color: "#888", margin: 0 }}>
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ⑧ フェリアホームのお客様 */}
      <div style={{ padding: "80px 24px", maxWidth: "1100px", margin: "0 auto" }}>
        <SectionHeader en="OUR CUSTOMERS" ja="フェリアホームのお客様" />
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "24px",
        }}>
          {[
            "/images/recruit/recruit_customer01.png",
            "/images/recruit/recruit_customer02.png",
            "/images/recruit/recruit_customer03.png",
            "/images/recruit/recruit_customer04.png",
          ].map((src, i) => (
            <div key={i} style={{
              position: "relative", width: "100%",
              borderRadius: "12px", overflow: "hidden",
            }}>
              <Image
                src={src}
                alt={`お客様 ${i + 1}`}
                width={540}
                height={360}
                style={{ width: "100%", height: "auto", display: "block" }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* ⑨ 採用フロー */}
      <div style={{ backgroundColor: "#f9f9f9", padding: "80px 24px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <SectionHeader en="RECRUIT FLOW" ja="採用フロー" />
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {[
              "/images/recruit/recruit_recruit_flow01.png",
              "/images/recruit/recruit_recruit_flow02.png",
              "/images/recruit/recruit_recruit_flow03.png",
            ].map((src, i) => (
              <Image
                key={i}
                src={src}
                alt={`採用フロー ${i + 1}`}
                width={1100}
                height={300}
                style={{ width: "100%", height: "auto", display: "block", borderRadius: "12px" }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ⑩ 社内行事 */}
      <div style={{ padding: "80px 24px", maxWidth: "1100px", margin: "0 auto" }}>
        <SectionHeader en="COMPANY EVENT" ja="社内行事" />
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "24px",
        }}>
          {[
            "/images/recruit/recruit_company_event01.jpg",
            "/images/recruit/recruit_company_event02.jpg",
          ].map((src, i) => (
            <Image
              key={i}
              src={src}
              alt={`社内行事 ${i + 1}`}
              width={540}
              height={360}
              style={{ width: "100%", height: "auto", display: "block", borderRadius: "12px" }}
            />
          ))}
        </div>
      </div>

      {/* ⑪ 店舗紹介 */}
      <div style={{ backgroundColor: "#f9f9f9", padding: "80px 24px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <SectionHeader en="STORE" ja="店舗紹介" />
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "24px",
          }}>
            {[
              "/images/recruit/recruit_store01.jpg",
              "/images/recruit/recruit_store02.jpg",
            ].map((src, i) => (
              <Image
                key={i}
                src={src}
                alt={`店舗 ${i + 1}`}
                width={540}
                height={360}
                style={{ width: "100%", height: "auto", display: "block", borderRadius: "12px" }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ⑫ 募集要項 */}
      <div style={{ padding: "80px 24px", maxWidth: "900px", margin: "0 auto" }}>
        <SectionHeader en="REQUIREMENTS" ja="募集要項" />
        <div style={{ borderRadius: "12px", overflow: "hidden", border: "1px solid #e8e8e8" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
            <tbody>
              {[
                { label: "職種",     value: "営業職（売買仲介）" },
                { label: "雇用形態", value: "正社員" },
                { label: "給与",     value: "月給 25万円〜（経験・能力による）＋各種手当・賞与" },
                { label: "勤務地",   value: "東京都渋谷区千駄ヶ谷4-16-7 北参道DTビル1階（転勤なし）" },
                { label: "勤務時間", value: "9:30〜18:30（休憩60分）" },
                { label: "休日休暇", value: "週休2日制（水曜・日曜定休）、年間休日106日、有給休暇、夏季・年末年始休暇" },
                { label: "応募資格", value: "不動産業界経験者優遇・未経験可（要普通自動車免許）" },
                { label: "福利厚生", value: "社会保険完備（健康・厚生年金・雇用・労災）、交通費支給、資格取得支援" },
              ].map((row, i) => (
                <tr key={i} style={{ borderBottom: "1px solid #e8e8e8" }}>
                  <td style={{
                    padding: "16px 20px",
                    backgroundColor: "#f9f9f9",
                    color: "#555",
                    fontWeight: "bold",
                    width: "160px",
                    verticalAlign: "top",
                    whiteSpace: "nowrap",
                    fontSize: "13px",
                  }}>
                    {row.label}
                  </td>
                  <td style={{
                    padding: "16px 20px",
                    color: "#333",
                    lineHeight: 1.7,
                    backgroundColor: "#fff",
                  }}>
                    {row.value}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ⑬ CTA */}
      <div style={{
        backgroundColor: "#5BAD52",
        padding: "80px 24px",
        textAlign: "center",
      }}>
        <h2 style={{
          fontSize: "clamp(22px, 4vw, 32px)",
          fontWeight: "bold", color: "#fff",
          margin: "0 0 16px",
        }}>
          フェリアホームで一緒に働きませんか
        </h2>
        <p style={{
          fontSize: "15px", color: "rgba(255,255,255,0.85)",
          margin: "0 0 32px", lineHeight: 1.8,
        }}>
          まずはお気軽にご連絡ください。<br />
          説明会・職場見学も随時受付中です。
        </p>
        <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
          <Link
            href="/contact?type=recruit"
            style={{
              display: "inline-block",
              padding: "16px 40px",
              backgroundColor: "#fff",
              color: "#5BAD52",
              borderRadius: "8px",
              textDecoration: "none",
              fontWeight: "bold",
              fontSize: "15px",
            }}
          >
            エントリーはこちら
          </Link>
          <a
            href="tel:0357816301"
            style={{
              display: "inline-block",
              padding: "16px 40px",
              backgroundColor: "transparent",
              color: "#fff",
              borderRadius: "8px",
              textDecoration: "none",
              fontWeight: "bold",
              fontSize: "15px",
              border: "2px solid rgba(255,255,255,0.8)",
            }}
          >
            📞 お電話でのお問い合わせ
          </a>
        </div>
      </div>

    </main>
  );
}

// セクションヘッダーコンポーネント
function SectionHeader({ en, ja }: { en: string; ja: string }) {
  return (
    <div style={{ textAlign: "center", marginBottom: "48px" }}>
      <p style={{
        fontSize: "12px", color: "#5BAD52",
        letterSpacing: "0.2em", margin: "0 0 8px",
        fontFamily: "'Montserrat', sans-serif",
        fontWeight: "600",
      }}>
        {en}
      </p>
      <h2 style={{
        fontSize: "clamp(22px, 4vw, 32px)",
        fontWeight: "bold", color: "#1a1a1a",
        margin: "0 0 16px",
      }}>
        {ja}
      </h2>
      <div style={{
        width: "40px", height: "3px",
        backgroundColor: "#5BAD52",
        margin: "0 auto",
        borderRadius: "2px",
      }} />
    </div>
  );
}
