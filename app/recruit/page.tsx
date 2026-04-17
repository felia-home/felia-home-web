// app/recruit/page.tsx
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "採用情報 | フェリアホーム",
  description:
    "フェリアホームでは不動産営業スタッフを募集しています。月給25万円以上、週休2日制、宅建資格支援制度あり。未経験・第二新卒歓迎。",
};

export default function RecruitPage() {
  return (
    <main style={{ backgroundColor: "#fff" }}>

      {/* ① ヒーローセクション */}
      <div style={{
        backgroundColor: "#f0f9ef",
        padding: "80px 24px",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(135deg, #f0f9ef 0%, #e8f5e6 100%)",
        }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <p style={{
            fontSize: "13px", color: "#5BAD52", letterSpacing: "0.2em",
            fontFamily: "'Montserrat', sans-serif", margin: "0 0 16px",
          }}>
            RECRUIT
          </p>
          <h1 style={{
            fontSize: "clamp(28px, 5vw, 44px)",
            fontWeight: "bold", color: "#1a1a1a",
            lineHeight: 1.3, margin: "0 0 24px",
          }}>
            人を本気で大切に。<br />
            本気の私たちと共に歩みます。
          </h1>
          <p style={{
            fontSize: "15px", color: "#555", lineHeight: 1.9,
            maxWidth: "640px", margin: "0 auto 32px",
          }}>
            フェリアホームは、不動産を通じて「人の暮らし」に向き合う会社です。<br />
            お客様の大切な人生の転機に真剣に向き合える仲間を探しています。<br />
            経験よりも「誠実さ」と「熱意」を大切にしています。
          </p>
          {/* ヒーロー画像プレースホルダー */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "12px",
            maxWidth: "800px",
            margin: "0 auto",
          }}>
            {["社員写真①", "社員写真②", "オフィス写真"].map((label, i) => (
              <div key={i} style={{
                height: "200px",
                backgroundColor: "#d4edda",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#5BAD52",
                fontSize: "13px",
                border: "2px dashed #5BAD52",
              }}>
                📷 {label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ② フェリアホームで働く理由 */}
      <div style={{ padding: "80px 24px", maxWidth: "1100px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <p style={{ fontSize: "13px", color: "#5BAD52", letterSpacing: "0.15em", fontFamily: "'Montserrat', sans-serif", margin: "0 0 8px" }}>
            WHY FELIA HOME
          </p>
          <h2 style={{ fontSize: "28px", fontWeight: "bold", color: "#1a1a1a", margin: 0 }}>
            フェリアホームで働く理由
          </h2>
        </div>
        <div className="recruit-reasons" style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "32px",
        }}>
          {[
            {
              num: "01",
              title: "お客様と長く向き合える環境",
              desc: "一人ひとりのお客様に時間をかけて向き合うスタイル。数字だけを追う文化はありません。",
            },
            {
              num: "02",
              title: "成長を支えるキャリアパス",
              desc: "入社後の成長ステップが明確。先輩社員がしっかりサポートする体制が整っています。",
            },
            {
              num: "03",
              title: "働きやすい職場環境",
              desc: "有給取得率が高く、育児支援制度も充実。長く活躍できる環境づくりを大切にしています。",
            },
          ].map((item) => (
            <div key={item.num} style={{
              textAlign: "center",
              padding: "32px 24px",
              borderRadius: "12px",
              backgroundColor: "#f9f9f9",
              border: "1px solid #e8e8e8",
            }}>
              <p style={{
                fontSize: "40px",
                fontWeight: "bold",
                color: "#5BAD52",
                opacity: 0.3,
                fontFamily: "'Montserrat', sans-serif",
                margin: "0 0 12px",
                lineHeight: 1,
              }}>
                {item.num}
              </p>
              <h3 style={{
                fontSize: "16px", fontWeight: "bold",
                color: "#333", margin: "0 0 12px",
              }}>
                {item.title}
              </h3>
              <p style={{ fontSize: "13px", color: "#666", lineHeight: 1.7, margin: 0 }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ③ 社員インタビュー */}
      <div style={{ backgroundColor: "#f9f9f9", padding: "80px 24px" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <p style={{ fontSize: "13px", color: "#5BAD52", letterSpacing: "0.15em", fontFamily: "'Montserrat', sans-serif", margin: "0 0 8px" }}>
              INTERVIEW
            </p>
            <h2 style={{ fontSize: "28px", fontWeight: "bold", color: "#1a1a1a", margin: 0 }}>
              社員インタビュー
            </h2>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
            {[
              {
                name: "星 俊彦",
                position: "営業部部長 / 2019年入社",
                quote: "都内人気エリアに特化し、物件提案から融資提案まで一貫して担当するため、スキルアップが早い。社員の声も反映されやすく、20代スタッフも多く和気あいあいとした雰囲気です。",
              },
              {
                name: "伊藤 貴洋",
                position: "営業部係長 / 2022年入社",
                quote: "不動産のメリット・デメリットを正確にお伝えし、しっかりとお考え頂けるよう丁寧な接客を心掛けております。発展途上中のため社員の声が反映されやすい環境です。",
              },
            ].map((person, i) => (
              <div key={i} style={{
                display: "flex",
                gap: "32px",
                alignItems: "flex-start",
                backgroundColor: "#fff",
                borderRadius: "12px",
                padding: "32px",
                flexDirection: i % 2 === 1 ? "row-reverse" : "row",
                flexWrap: "wrap",
              }}>
                {/* 写真プレースホルダー */}
                <div style={{
                  width: "160px",
                  height: "200px",
                  backgroundColor: "#d4edda",
                  borderRadius: "8px",
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#5BAD52",
                  fontSize: "12px",
                  border: "2px dashed #5BAD52",
                  flexDirection: "column",
                  gap: "8px",
                }}>
                  <span style={{ fontSize: "24px" }}>📷</span>
                  <span>{person.name}</span>
                </div>
                <div style={{ flex: 1, minWidth: "200px" }}>
                  <p style={{
                    fontSize: "20px", fontWeight: "bold",
                    color: "#1a1a1a", margin: "0 0 4px",
                  }}>
                    {person.name}
                  </p>
                  <p style={{
                    fontSize: "13px", color: "#5BAD52",
                    margin: "0 0 20px", fontWeight: "500",
                  }}>
                    {person.position}
                  </p>
                  <p style={{
                    fontSize: "15px", color: "#444",
                    lineHeight: 1.9,
                    borderLeft: "3px solid #5BAD52",
                    paddingLeft: "16px",
                    margin: 0,
                  }}>
                    {person.quote}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ④ 採用フロー */}
      <div style={{ padding: "80px 24px", maxWidth: "900px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <p style={{ fontSize: "13px", color: "#5BAD52", letterSpacing: "0.15em", fontFamily: "'Montserrat', sans-serif", margin: "0 0 8px" }}>
            FLOW
          </p>
          <h2 style={{ fontSize: "28px", fontWeight: "bold", color: "#1a1a1a", margin: 0 }}>
            採用フロー
          </h2>
        </div>
        <div className="recruit-flow" style={{ display: "flex", alignItems: "flex-start", gap: "0", justifyContent: "center" }}>
          {[
            { step: "STEP 1", label: "エントリー", desc: "フォームまたはお電話でご応募ください" },
            { step: "STEP 2", label: "書類選考", desc: "履歴書・職務経歴書を確認いたします" },
            { step: "STEP 3", label: "面接", desc: "1〜2回の面接を実施します（オンライン可）" },
            { step: "STEP 4", label: "内定", desc: "合否のご連絡後、入社日を調整します" },
          ].map((item, i, arr) => (
            <div key={i} style={{ display: "flex", alignItems: "center", flex: 1 }}>
              <div style={{ flex: 1, textAlign: "center" }}>
                <div style={{
                  width: "64px", height: "64px",
                  borderRadius: "50%",
                  backgroundColor: "#5BAD52",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 12px",
                  fontSize: "11px",
                  fontWeight: "bold",
                  fontFamily: "'Montserrat', sans-serif",
                  flexDirection: "column",
                  gap: "2px",
                }}>
                  <span style={{ fontSize: "8px", opacity: 0.8 }}>{item.step.split(" ")[0]}</span>
                  <span style={{ fontSize: "16px" }}>{item.step.split(" ")[1]}</span>
                </div>
                <p style={{ fontSize: "14px", fontWeight: "bold", color: "#333", margin: "0 0 4px" }}>
                  {item.label}
                </p>
                <p style={{ fontSize: "11px", color: "#888", margin: 0, lineHeight: 1.5 }}>
                  {item.desc}
                </p>
              </div>
              {i < arr.length - 1 && (
                <div style={{
                  color: "#5BAD52", fontSize: "20px",
                  flexShrink: 0, marginBottom: "40px", opacity: 0.5,
                }}>
                  ›
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ⑤ 募集要項 */}
      <div style={{ backgroundColor: "#f9f9f9", padding: "80px 24px" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <p style={{ fontSize: "13px", color: "#5BAD52", letterSpacing: "0.15em", fontFamily: "'Montserrat', sans-serif", margin: "0 0 8px" }}>
              REQUIREMENTS
            </p>
            <h2 style={{ fontSize: "28px", fontWeight: "bold", color: "#1a1a1a", margin: 0 }}>
              募集要項
            </h2>
          </div>

          {[
            {
              category: "営業職（売買仲介）",
              rows: [
                { label: "雇用形態", value: "正社員（試用期間3ヶ月・待遇変更なし）" },
                { label: "給与", value: "月給25万円以上（経験・能力による）＋各種手当・賞与" },
                { label: "勤務地", value: "千駄ヶ谷本店（渋谷区千駄ヶ谷4-16-7 北参道DTビル1階）/ 幡ヶ谷支店（渋谷区幡ヶ谷2-1-4）※希望考慮・転居転勤なし" },
                { label: "勤務時間", value: "9:30〜18:30（実働8時間・休憩60分）" },
                { label: "休日休暇", value: "完全週休2日制（火・水）、年間休日117日、有給休暇、夏季・年末年始休暇、産前産後・育児休暇" },
                { label: "応募資格", value: "普通自動車免許（AT限定OK）/ 学歴不問 / 未経験歓迎 / 第二新卒歓迎 / ブランクOK" },
                { label: "福利厚生", value: "社会保険完備（健康・厚生年金・雇用・労災）、交通費全額支給、宅建資格手当1.5万円/月、宅建資格取得支援、報奨金、社員旅行" },
              ],
            },
          ].map((job, ji) => (
            <div key={ji} style={{ marginBottom: "40px" }}>
              <h3 style={{
                fontSize: "18px", fontWeight: "bold",
                color: "#333", marginBottom: "16px",
                paddingBottom: "12px",
                borderBottom: "2px solid #5BAD52",
              }}>
                {job.category}
              </h3>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
                <tbody>
                  {job.rows.map((row, ri) => (
                    <tr key={ri} style={{ borderBottom: "1px solid #e8e8e8" }}>
                      <td style={{
                        padding: "14px 16px",
                        backgroundColor: "#fff",
                        color: "#888",
                        fontWeight: "500",
                        width: "140px",
                        verticalAlign: "top",
                        whiteSpace: "nowrap",
                      }}>
                        {row.label}
                      </td>
                      <td style={{
                        padding: "14px 16px",
                        backgroundColor: "#fff",
                        color: "#333",
                        lineHeight: 1.7,
                      }}>
                        {row.value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      </div>

      {/* ⑥ 会社の数字 */}
      <div style={{ padding: "80px 24px", maxWidth: "900px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <p style={{ fontSize: "13px", color: "#5BAD52", letterSpacing: "0.15em", fontFamily: "'Montserrat', sans-serif", margin: "0 0 8px" }}>
            NUMBERS
          </p>
          <h2 style={{ fontSize: "28px", fontWeight: "bold", color: "#1a1a1a", margin: 0 }}>
            フェリアホームの数字
          </h2>
        </div>
        <div className="recruit-numbers" style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "24px",
          textAlign: "center",
        }}>
          {[
            { num: "21", unit: "名", label: "スタッフ数" },
            { num: "30", unit: "代", label: "平均年齢" },
            { num: "80", unit: "%", label: "有給取得率" },
            { num: "15", unit: "年", label: "業界平均経験" },
          ].map((item) => (
            <div key={item.label} style={{
              padding: "28px 16px",
              backgroundColor: "#f9f9f9",
              borderRadius: "12px",
              border: "1px solid #e8e8e8",
            }}>
              <p style={{
                fontSize: "44px", fontWeight: "bold",
                color: "#5BAD52", margin: "0 0 4px",
                fontFamily: "'Montserrat', sans-serif",
                lineHeight: 1,
              }}>
                {item.num}
                <span style={{ fontSize: "20px" }}>{item.unit}</span>
              </p>
              <p style={{ fontSize: "13px", color: "#888", margin: 0 }}>{item.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ⑦ CTA */}
      <div style={{
        backgroundColor: "#5BAD52",
        padding: "80px 24px",
        textAlign: "center",
      }}>
        <h2 style={{
          fontSize: "28px", fontWeight: "bold",
          color: "#fff", margin: "0 0 16px",
        }}>
          フェリアホームで一緒に働きませんか
        </h2>
        <p style={{
          fontSize: "15px", color: "rgba(255,255,255,0.85)",
          margin: "0 0 32px", lineHeight: 1.7,
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
