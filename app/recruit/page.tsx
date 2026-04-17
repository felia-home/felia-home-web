import Image from "next/image";
import Link from "next/link";
import { getRecruitStaff } from "@/lib/api";
import StaffCard from "@/components/recruit/StaffCard";

export const revalidate = 60;

export default async function RecruitPage() {
  const recruitStaff = await getRecruitStaff();

  return (
    <main style={{ backgroundColor: "#fff" }}>

      {/* パンくず・ページタイトル */}
      <div style={{ backgroundColor: "#f9f9f9", borderBottom: "1px solid #e8e8e8", padding: "12px 24px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", gap: "8px", fontSize: "12px", color: "#888", alignItems: "center" }}>
          <Link href="/" style={{ color: "#888", textDecoration: "none" }}>ホーム</Link>
          <span>›</span>
          <span style={{ color: "#333", fontWeight: "500" }}>採用情報</span>
        </div>
      </div>

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
        {/* 薄いオーバーレイのみ */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundColor: "rgba(0,0,0,0.2)",
        }} />
      </div>

      {/* メッセージ */}
      <div style={{ padding: "100px 24px", background: "linear-gradient(180deg, #fff 0%, #f0f9ef 100%)" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "60px" }}>
            <p style={{
              fontSize: "12px", color: "#5BAD52", letterSpacing: "0.3em",
              margin: "0 0 20px", fontFamily: "'Montserrat', sans-serif", fontWeight: "600",
            }}>
              MESSAGE
            </p>
            <h2 style={{
              fontSize: "clamp(28px, 5vw, 44px)",
              fontWeight: "bold", color: "#1a1a1a",
              lineHeight: 1.4, margin: "0 0 24px",
            }}>
              人を本気で大切に。<br />
              本気の私たちと共に歩みます。
            </h2>
            <div style={{ width: "48px", height: "3px", backgroundColor: "#5BAD52", margin: "0 auto" }} />
          </div>

          <div style={{
            backgroundColor: "#fff",
            borderRadius: "16px",
            padding: "48px 56px",
            boxShadow: "0 8px 40px rgba(91,173,82,0.08)",
            border: "1px solid #e8f5e6",
            position: "relative",
            overflow: "hidden",
          }}>
            {/* 装飾 */}
            <div style={{
              position: "absolute", top: 0, left: 0,
              width: "6px", height: "100%",
              backgroundColor: "#5BAD52",
              borderRadius: "3px 0 0 3px",
            }} />
            <div style={{
              position: "absolute", top: "-40px", right: "-40px",
              width: "160px", height: "160px",
              borderRadius: "50%",
              backgroundColor: "#f0f9ef",
              zIndex: 0,
            }} />

            <div style={{ position: "relative", zIndex: 1 }}>
              <p style={{
                fontSize: "clamp(15px, 2vw, 18px)",
                color: "#333", lineHeight: 2.1,
                margin: "0 0 32px",
                fontWeight: "500",
              }}>
                私たちフェリアホームは、東京都内を中心に不動産売買仲介を行う会社です。
              </p>
              <p style={{ fontSize: "15px", color: "#555", lineHeight: 2, margin: "0 0 24px" }}>
                お客様にとって不動産の売買は、人生で最も大きな決断のひとつ。<br />
                だからこそ私たちは、数字よりも「人」を大切にし、<br />
                一人ひとりのお客様に誠実に向き合うことを何より重視しています。
              </p>
              <p style={{ fontSize: "15px", color: "#555", lineHeight: 2, margin: 0 }}>
                経験よりも大切なのは「誠実さ」と「熱意」。<br />
                お客様の笑顔のために、本気で取り組める仲間をお待ちしています。
              </p>

              <div style={{
                marginTop: "40px",
                paddingTop: "32px",
                borderTop: "1px solid #e8f5e6",
                textAlign: "right",
              }}>
                <p style={{ fontSize: "16px", fontWeight: "bold", color: "#333", margin: 0 }}>
                  株式会社フェリアホーム
                </p>
                <p style={{ fontSize: "13px", color: "#888", margin: "4px 0 0" }}>
                  代表取締役 北原 啓輔
                </p>
              </div>
            </div>
          </div>
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
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "24px" }}>
          {/* 上段：1枚（中央） */}
          <div style={{ width: "60%", maxWidth: "600px" }}>
            <Image
              src="/images/recruit/recruit_strength01.png"
              alt="当社の強み 1"
              width={600}
              height={400}
              style={{ width: "100%", height: "auto", display: "block", borderRadius: "12px" }}
            />
          </div>
          {/* 下段：2枚（横並び） */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", width: "100%" }}>
            <Image
              src="/images/recruit/recruit_strength02.png"
              alt="当社の強み 2"
              width={520}
              height={360}
              style={{ width: "100%", height: "auto", display: "block", borderRadius: "12px" }}
            />
            <Image
              src="/images/recruit/recruit_strength03.png"
              alt="当社の強み 3"
              width={520}
              height={360}
              style={{ width: "100%", height: "auto", display: "block", borderRadius: "12px" }}
            />
          </div>
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
            渋谷区千駄ヶ谷・幡ヶ谷の2拠点で展開しています。<br />
            明るく開放的なオフィスで、お客様もスタッフも快適に過ごせる環境です。
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "40px" }}>
            {/* 千駄ヶ谷本店 */}
            <div>
              <div style={{ borderRadius: "12px", overflow: "hidden", marginBottom: "20px" }}>
                <Image
                  src="/images/recruit/recruit_store01.jpg"
                  alt="千駄ヶ谷本店"
                  width={540}
                  height={360}
                  style={{ width: "100%", height: "auto", display: "block" }}
                />
              </div>
              <h3 style={{ fontSize: "18px", fontWeight: "bold", color: "#333", margin: "0 0 12px", borderLeft: "4px solid #5BAD52", paddingLeft: "12px" }}>
                千駄ヶ谷本店
              </h3>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                <tbody>
                  {[
                    { label: "住所",     value: "〒151-0051 東京都渋谷区千駄ヶ谷4-16-7 北参道DTビル1階" },
                    { label: "アクセス", value: "東京メトロ副都心線「北参道」駅 徒歩3分\nJR総武線「千駄ヶ谷」駅 徒歩8分" },
                    { label: "TEL",     value: "03-5781-6301" },
                    { label: "営業時間", value: "9:30〜18:30（水・日定休）" },
                  ].map((row, i) => (
                    <tr key={i} style={{ borderBottom: "1px solid #e8e8e8" }}>
                      <td style={{ padding: "10px 12px", color: "#888", fontWeight: "bold", width: "90px", verticalAlign: "top", whiteSpace: "nowrap", backgroundColor: "#fff" }}>
                        {row.label}
                      </td>
                      <td style={{ padding: "10px 12px", color: "#333", lineHeight: 1.7, whiteSpace: "pre-line", backgroundColor: "#fff" }}>
                        {row.value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 幡ヶ谷店 */}
            <div>
              <div style={{ borderRadius: "12px", overflow: "hidden", marginBottom: "20px" }}>
                <Image
                  src="/images/recruit/recruit_store02.jpg"
                  alt="幡ヶ谷店"
                  width={540}
                  height={360}
                  style={{ width: "100%", height: "auto", display: "block" }}
                />
              </div>
              <h3 style={{ fontSize: "18px", fontWeight: "bold", color: "#333", margin: "0 0 12px", borderLeft: "4px solid #5BAD52", paddingLeft: "12px" }}>
                幡ヶ谷店
              </h3>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                <tbody>
                  {[
                    { label: "住所",     value: "東京都渋谷区幡ヶ谷（詳細はお問い合わせください）" },
                    { label: "アクセス", value: "京王新線「幡ヶ谷」駅 徒歩圏内" },
                    { label: "TEL",     value: "03-6276-7614" },
                    { label: "営業時間", value: "9:30〜18:30（水・日定休）" },
                  ].map((row, i) => (
                    <tr key={i} style={{ borderBottom: "1px solid #e8e8e8" }}>
                      <td style={{ padding: "10px 12px", color: "#888", fontWeight: "bold", width: "90px", verticalAlign: "top", whiteSpace: "nowrap", backgroundColor: "#fff" }}>
                        {row.label}
                      </td>
                      <td style={{ padding: "10px 12px", color: "#333", lineHeight: 1.7, whiteSpace: "pre-line", backgroundColor: "#fff" }}>
                        {row.value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
