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

      {/* メッセージ */}
      <div style={{ padding: "80px 24px", maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
        <p style={{ fontSize: "13px", color: "#5BAD52", letterSpacing: "0.2em", margin: "0 0 16px", fontFamily: "'Montserrat', sans-serif" }}>
          MESSAGE
        </p>
        <h2 style={{ fontSize: "clamp(22px, 4vw, 32px)", fontWeight: "bold", color: "#1a1a1a", margin: "0 0 32px" }}>
          人を本気で大切に。<br />本気の私たちと共に歩みます。
        </h2>
        <div style={{ width: "40px", height: "3px", backgroundColor: "#5BAD52", margin: "0 auto 40px" }} />
        <p style={{ fontSize: "15px", color: "#555", lineHeight: 2, textAlign: "left" }}>
          私たちフェリアホームは、東京都内を中心に不動産売買仲介を行う会社です。<br /><br />
          お客様にとって不動産の売買は、人生で最も大きな決断のひとつ。<br />
          だからこそ私たちは、数字よりも「人」を大切にし、<br />
          一人ひとりのお客様に誠実に向き合うことを何より重視しています。<br /><br />
          経験よりも大切なのは「誠実さ」と「熱意」。<br />
          お客様の笑顔のために、本気で取り組める仲間をお待ちしています。
        </p>
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

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px", marginBottom: "48px" }}>
            {/* 入社1〜2ヶ月 */}
            <div style={{ backgroundColor: "#fff", borderRadius: "12px", padding: "24px", border: "2px solid #5BAD52" }}>
              <p style={{ fontSize: "13px", fontWeight: "bold", color: "#5BAD52", margin: "0 0 16px", textAlign: "center" }}>
                入社1〜2ヶ月
              </p>
              {[
                { time: "9:30",  label: "出社・朝礼",          desc: "業務の流れを先輩と確認" },
                { time: "10:00", label: "同行・見学",           desc: "先輩の仕事を見て学ぶ" },
                { time: "12:00", label: "昼食",                desc: "先輩スタッフと情報共有" },
                { time: "13:00", label: "書類・資料作成サポート", desc: "物件資料作成のサポート業務" },
                { time: "16:00", label: "お客様対応（同行）",    desc: "先輩に同行してお客様対応を学ぶ" },
                { time: "18:00", label: "日報・振り返り",        desc: "本日の学びを記録・整理" },
                { time: "18:30", label: "退社",                desc: "" },
              ].map((item, i, arr) => (
                <div key={i} style={{ display: "flex", gap: "0", alignItems: "stretch" }}>
                  <div style={{ width: "60px", flexShrink: 0, textAlign: "right", paddingRight: "12px", paddingTop: "16px" }}>
                    <span style={{ fontSize: "12px", fontWeight: "bold", color: "#5BAD52", fontFamily: "'Montserrat', sans-serif" }}>
                      {item.time}
                    </span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
                    <div style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#5BAD52", marginTop: "18px", flexShrink: 0 }} />
                    {i < arr.length - 1 && <div style={{ width: "2px", flex: 1, backgroundColor: "#d4edda", minHeight: "24px" }} />}
                  </div>
                  <div style={{ paddingLeft: "12px", paddingBottom: "16px", paddingTop: "12px", flex: 1 }}>
                    <p style={{ fontSize: "13px", fontWeight: "bold", color: "#333", margin: "0 0 2px" }}>{item.label}</p>
                    {item.desc && <p style={{ fontSize: "11px", color: "#aaa", margin: 0 }}>{item.desc}</p>}
                  </div>
                </div>
              ))}
            </div>

            {/* 入社3ヶ月〜 */}
            <div style={{ backgroundColor: "#fff", borderRadius: "12px", padding: "24px", border: "1px solid #e8e8e8" }}>
              <p style={{ fontSize: "13px", fontWeight: "bold", color: "#333", margin: "0 0 16px", textAlign: "center" }}>
                入社3ヶ月〜
              </p>
              {[
                { time: "9:30",  label: "出社・朝礼",    desc: "メールチェック・訪問確認" },
                { time: "10:00", label: "物件調査・資料作成", desc: "現地確認、販売図面作成" },
                { time: "12:00", label: "昼食",          desc: "チームと情報共有" },
                { time: "13:00", label: "お客様対応・内覧", desc: "ご購入・売却のお客様を担当" },
                { time: "16:00", label: "商談・契約手続き", desc: "重要事項説明・売買契約" },
                { time: "18:00", label: "事務作業・日報",  desc: "顧客情報更新・翌日の準備" },
                { time: "18:30", label: "退社",          desc: "残業月平均20時間程度" },
              ].map((item, i, arr) => (
                <div key={i} style={{ display: "flex", gap: "0", alignItems: "stretch" }}>
                  <div style={{ width: "60px", flexShrink: 0, textAlign: "right", paddingRight: "12px", paddingTop: "16px" }}>
                    <span style={{ fontSize: "12px", fontWeight: "bold", color: "#5BAD52", fontFamily: "'Montserrat', sans-serif" }}>
                      {item.time}
                    </span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
                    <div style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#5BAD52", marginTop: "18px", flexShrink: 0 }} />
                    {i < arr.length - 1 && <div style={{ width: "2px", flex: 1, backgroundColor: "#d4edda", minHeight: "24px" }} />}
                  </div>
                  <div style={{ paddingLeft: "12px", paddingBottom: "16px", paddingTop: "12px", flex: 1 }}>
                    <p style={{ fontSize: "13px", fontWeight: "bold", color: "#333", margin: "0 0 2px" }}>{item.label}</p>
                    {item.desc && <p style={{ fontSize: "11px", color: "#aaa", margin: 0 }}>{item.desc}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ⑧ フェリアホームのお客様 */}
      <div style={{ padding: "80px 24px", maxWidth: "1100px", margin: "0 auto" }}>
        <SectionHeader en="OUR CUSTOMERS" ja="フェリアホームのお客様" />
        <Image
          src="/images/recruit/recruit_customer01.png"
          alt="フェリアホームのお客様"
          width={1100}
          height={500}
          style={{ width: "100%", height: "auto", display: "block", borderRadius: "12px" }}
        />
      </div>

      {/* ⑨ 採用フロー */}
      <div style={{ backgroundColor: "#f9f9f9", padding: "80px 24px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <SectionHeader en="RECRUIT FLOW" ja="採用フロー" />
          <Image
            src="/images/recruit/recruit_recruit_flow01.png"
            alt="採用フロー"
            width={1100}
            height={400}
            style={{ width: "100%", height: "auto", display: "block", borderRadius: "12px" }}
          />
        </div>
      </div>

      {/* ⑩ 社内行事 */}
      <div style={{ padding: "80px 24px", maxWidth: "1100px", margin: "0 auto" }}>
        <SectionHeader en="COMPANY EVENT" ja="社内行事" />
        <p style={{
          textAlign: "center", fontSize: "15px", color: "#555",
          lineHeight: 1.9, maxWidth: "700px", margin: "0 auto 48px",
        }}>
          フェリアホームでは、仕事以外の時間も大切にしています。<br />
          季節ごとの社内イベントや懇親会を通じて、チームの絆を深めています。<br />
          「仕事も、仲間も、どちらも大切に。」それが私たちの文化です。
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "24px" }}>
          {["recruit_company_event01.jpg", "recruit_company_event02.jpg"].map((file, i) => (
            <Image
              key={i}
              src={`/images/recruit/${file}`}
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
          <p style={{
            textAlign: "center", fontSize: "15px", color: "#555",
            lineHeight: 1.9, maxWidth: "700px", margin: "0 auto 48px",
          }}>
            渋谷区千駄ヶ谷に位置する北参道DTビル1階。<br />
            明るく開放的なオフィスで、お客様をお迎えしています。<br />
            落ち着いた雰囲気の中で、スタッフ同士の連携も取りやすい職場環境です。
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "24px" }}>
            {["recruit_store01.jpg", "recruit_store02.jpg"].map((file, i) => (
              <Image
                key={i}
                src={`/images/recruit/${file}`}
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
      <div style={{ padding: "80px 24px" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <SectionHeader en="REQUIREMENTS" ja="募集要項" />

          <div style={{
            backgroundColor: "#5BAD52",
            color: "#fff",
            padding: "16px 24px",
            borderRadius: "8px 8px 0 0",
            fontSize: "16px",
            fontWeight: "bold",
          }}>
            営業職（売買仲介）
          </div>

          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px", border: "1px solid #e8e8e8" }}>
            <tbody>
              {[
                { label: "仕事内容", value: "東京都内を中心とした不動産（土地・戸建・マンション）の売買仲介営業。お客様のご購入・売却のご相談から物件のご案内、価格交渉、契約手続きまで一貫してサポートします。" },
                { label: "雇用形態", value: "正社員（試用期間3ヶ月）" },
                { label: "給与",     value: "月給25万円〜（経験・能力を考慮）\n各種手当（交通費・資格手当）、賞与年2回（業績による）" },
                { label: "諸手当",   value: "交通費全額支給、資格取得支援手当、インセンティブあり" },
                { label: "勤務地",   value: "東京都渋谷区千駄ヶ谷4-16-7 北参道DTビル1階\n（転勤なし）" },
                { label: "勤務時間", value: "9:30〜18:30（所定労働時間8時間、休憩60分）\n時間外労働あり（月平均20時間程度）" },
                { label: "休日・休暇", value: "週休2日制（水曜・日曜定休）\n年間休日106日、有給休暇（入社6ヶ月後10日〜）\n夏季休暇、年末年始休暇、慶弔休暇" },
                { label: "応募資格", value: "■ 必須\n・普通自動車免許（AT限定可）\n\n■ 歓迎\n・不動産業界経験者\n・宅地建物取引士資格保有者\n・未経験者も歓迎（意欲重視）" },
                { label: "福利厚生", value: "社会保険完備（健康・厚生年金・雇用・労災保険）\n資格取得支援制度（宅建・FP等）\n社員研修制度、メンター制度" },
                { label: "選考フロー", value: "書類選考 → 面接1〜2回 → 内定\n※オンライン面接対応可" },
              ].map((row, i) => (
                <tr key={i} style={{ borderBottom: "1px solid #e8e8e8" }}>
                  <td style={{
                    padding: "16px 20px",
                    backgroundColor: "#f9f9f9",
                    color: "#333",
                    fontWeight: "bold",
                    width: "140px",
                    verticalAlign: "top",
                    fontSize: "13px",
                    whiteSpace: "nowrap",
                  }}>
                    {row.label}
                  </td>
                  <td style={{
                    padding: "16px 20px",
                    color: "#444",
                    lineHeight: 1.8,
                    fontSize: "13px",
                    whiteSpace: "pre-line",
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
