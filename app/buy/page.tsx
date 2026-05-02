// app/buy/page.tsx
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export const metadata: Metadata = {
  title: "不動産購入について",
  description: "フェリアホームの不動産購入サポート。購入の流れStep01〜10・諸費用・オンライン見学サービスをご紹介します。",
};

const STEPS = [
  {
    num: "01", title: "資産計画",
    text: "まず、ご希望の条件をお聞かせください。●住みたい地域●住みたい物件（新築戸建てor中古戸建orマンション）●広さ等を伺ってから、担当スタッフより大体の予算をお伝えいたします。資金計画はとても大切です。ご用意できる資金に加え住宅ローンの返済プラン、住んでからのライフプラン等、無理のない計画を立てることから始めましょう。",
    imgFile: "buy_step_01",
  },
  {
    num: "02", title: "物件情報収集",
    text: "ご希望条件が多ければ、それに合致する物件情報は少なくなります。お客様が欲しい物件は、他のお客様も欲しい可能性が高いからです。お値段が手ごろで問題のない物件は早い者勝ちになることも。物件情報はスピードが命。フェリアホームでは担当スタッフが地場ならではの強みを活かし、お客様のご希望に合わせて最新の物件情報をいち早くご紹介いたします。",
    imgFile: "buy_step_02",
  },
  {
    num: "03", title: "物件のご見学",
    text: "気になる物件が見つかったら、実際に見学をしてみましょう。様々な物件を見学し、どのような家に住みたいかイメージを固めてください。土地を見学したら同じような土地形状に建つ家や、モデルハウス等の見学もセットで考えることが大切です。フェリアホームではお客様のご希望の場所までお迎えにあがり、物件をご見学した後、送迎いたします。",
    imgFile: "buy_step_03",
  },
  {
    num: "04", title: "契約のご検討",
    text: "物件見学の後で購入したいと思っても、まずは一呼吸おいて検討してください。フェリアホームは、お客様が心の底から納得されたうえで購入していただきたいと思っています。検討期間中も担当スタッフがさらに詳しい情報をお伝えし、お客様が多くの物件情報を比較検討できるように努めます。ご検討の結果、契約に進みたいとなれば不動産売買契約のご説明に移ります。",
    imgFile: "buy_step_04",
  },
  {
    num: "05", title: "不動産売買契約",
    text: "まず、購入したい物件の所有者（売主）に対して購入の意思表示をする「不動産購入申込書の提出」を行います。次にお客様と売主との間で不動産の販売価格を決めて「不動産売買契約」を結びます。その際、契約の前に「宅地建物取引士」の不動産資格を所持した者が重要事項説明を行い、説明に納得されたら各種契約書類に記名押印し、契約締結となります。",
    imgFile: "buy_step_05",
  },
  {
    num: "06", title: "住宅ローンの契約",
    text: "物件の契約が終わったら、住宅ローンの契約になります。住宅ローンには大きく分けて、フラット35等の公的融資と大手・地方銀行などによる民間融資、そしてお勤め先の会社が用意した住宅ローンである企業融資の3つがあります。フェリアホームでは大手金融機関をはじめ多数の銀行と業務提携を行っており、より良い金利優遇を得られる場合があります。",
    imgFile: "buy_step_06",
  },
  {
    num: "07", title: "残金のお支払い・お引き渡し",
    text: "残金のお支払い（住宅ローン実行日）の数日前に、住宅ローンを借入した銀行と金融消費貸借契約を締結します。その後でお引き渡しとなり、司法書士、不動産仲介会社、売主、お客様が集まり、残金のお支払いを行います。売主に残金を支払い、入金確認が取れたらお引き渡し完了です。新築・中古戸建住宅の場合は、その場で鍵を受け取ります。",
    imgFile: "buy_step_07",
  },
  {
    num: "08", title: "お引越し",
    text: "物件の引き渡しが完了したら、いつでもお引越しすることができます。引っ越し準備はお引き渡し予定日から遡って1〜2ヶ月前から準備すると余裕を持って進められます。フェリアホームでは引っ越しの専門会社と提携しているので、こちらをご利用いただくとお客様が自ら依頼されるよりも料金がお安くなったり、特典が付いたり等のメリットがあります。",
    imgFile: "buy_step_08",
  },
  {
    num: "09", title: "税務申告",
    text: "不動産購入に係る税務申告は物件の価格・種類・購入資金の作り方によって様々です。そのひとつ、住宅ローン控除についてご紹介します。住宅ローンをご利用されているお客様で一定の条件を満たせば、住宅ローン金額の一定割合金額を上限として所得税、住民税が控除されます。フェリアホームでは住宅ローン控除が適用できるかどうか、物件購入の前にお伝えしています。",
    imgFile: "buy_step_09",
  },
  {
    num: "10", title: "アフターサービス",
    text: "不動産会社の大多数は仲介したらそれっきりという会社がほとんどです。フェリアホームは、その後にお客様がトラブルに遭われないようアフターサービスに力を入れています。物件のお引き渡し後に発生した不具合等がありましたら、些細なことでもご連絡ください。またリフォームやリノベーション等のご相談も承っていますので、お気軽にご相談ください。",
    imgFile: "buy_step_10",
  },
];

const POINTS = [
  {
    num: "01", title: "諸費用を抑える工夫",
    text: "基本的に税金や登記費用は物件価格に応じてかかりますが、住宅ローンや購入する保険は選び方によって諸費用を抑えることができます。",
    bullets: [
      "（例）保証料や団体信用生命保険が無料の住宅ローンを選択する",
      "火災保険や地震保険を1年ごとにする",
      "引っ越し時になるべく安価な家電や家具にする",
    ],
    imgFile: "buy_point_01",
  },
  {
    num: "02", title: "諸費用を住宅ローンに上乗せして借入する",
    text: "自己資金で諸費用を賄うことができない場合は住宅ローンに上乗せして借り入れることができる金融機関もあります。ただし、毎月の返済負担が大きくなるので、諸費用分くらいは用意しておいた方がいいでしょう。",
    bullets: [],
    imgFile: "buy_point_02",
  },
  {
    num: "03", title: "諸費用は原則現金での準備が必要",
    text: "自己資金の中から住宅購入の頭金に充てる費用と諸費用に充てる費用を考えましょう。原則として諸費用は現金での準備が必要となるため、自己資金すべてを頭金に充てることができません。",
    bullets: [],
    imgFile: "buy_point_03",
  },
  {
    num: "04", title: "物件価格以外にも様々な費用がかかる",
    text: "諸費用の総額は購入価格の3〜8%が目安です。購入する物件や借りる住宅ローンによって諸費用は変わるので、あらかじめ確認しておきましょう。また固定資産税のように毎年支払う費用も発生します。",
    bullets: [],
    imgFile: "buy_point_04",
  },
];

const COST_TABLE = [
  {
    category: "近習期間費用",
    rows: [
      { name: "仲介手数料", desc: "土地・建物不動産会社に仲介してもらう場合に発生（売買価格・税別）×3%＋6万円）＋消費税", timing: "引き渡し時" },
      { name: "司法書士報酬・各種登記費用・登記手数料", desc: "8〜20万円", timing: "登記納了時" },
    ],
  },
  {
    category: "税金",
    rows: [
      { name: "印紙税", desc: "購入する物件の金額に従って決められたいる。近習契約・ローン契約書に貼付", timing: "近習契約時" },
      { name: "登録免許税", desc: "固定資産評価額証明、若人等から算出される", timing: "登記時" },
      { name: "不動産取得税", desc: "原則：土地・家屋ともに3%", timing: "入居後" },
      { name: "固定資産税・都市計画税", desc: "固定資産評価額から算定される。建築の購入者が日割りで余分支払い", timing: "入居後" },
    ],
  },
  {
    category: "ローン型費用",
    rows: [
      { name: "ローン型保証料", desc: "民間金融機関の場合、1,000万円（35年返済の場合）当たり約20万円前後が目安。一括前払い、全期間に上乗せなど金融機関によってことなる", timing: "ローン借入時" },
      { name: "ローン手数料", desc: "3〜5万円。融資金額の2%前後（全融資金額に上乗せして支払う）", timing: "ローン借入時" },
      { name: "団体信用生命保険", desc: "金融にあらかじめ組み込まれている場合は費用の必要はない。組み込みがない場合は、ローン残高の0.3%程度。（全融機関によって異なる）", timing: "ローン借入時" },
      { name: "火災保険料・地震保険料", desc: "補償内容・建物・損害保険会社によって異なる。建物の評価額により建物の初期金額が表示", timing: "ローン借入時" },
    ],
  },
  {
    category: "その他費用",
    rows: [
      { name: "引っ越し費用", desc: "20万前後、ごみ処分や荷物の量による。", timing: "入居時" },
      { name: "家具・家電など", desc: "30万前後。購入する部屋・住宅の数・広さのした上乗せ費用", timing: "入居時" },
      { name: "雑費", desc: "5〜10万前後。近隣あいさつ・お引越し挨拶など", timing: "入居時" },
    ],
  },
];

const ONLINE_STEPS = [
  { num: "01", title: "物件を伝える", text: "担当スタッフに不動産見学希望日程、見学したい物件を伝えてください。" },
  { num: "02", title: "内見の手配", text: "担当スタッフより内見の手配を行います。近郊中の物件等、調整いたします。" },
  { num: "03", title: "現場からご返絡", text: "ご指定の日時にテレビ電話アプリを使用して、物件現場からお客様へご返絡いたします。" },
  { num: "04", title: "ご案内", text: "見たい箇所や疑問点をリクエストしながら、オンライン不動産見学をお楽しみください。" },
];

export default function BuyPage() {
  return (
    <div style={{ backgroundColor: "#ffffff" }}>

      {/* パンくず */}
      <div style={{ backgroundColor: "#F8F8F8", padding: "8px 0" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>
          <nav style={{ fontSize: "12px", color: "#999", display: "flex", alignItems: "center", gap: "4px" }}>
            <Link href="/" style={{ color: "#999", textDecoration: "none" }}>TOP</Link>
            <ChevronRight size={12} />
            <span style={{ color: "#333" }}>不動産購入について</span>
          </nav>
        </div>
      </div>

      {/* タイトル */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "24px 24px 0" }}>
        <h1 style={{ fontSize: "clamp(22px, 3vw, 32px)", fontWeight: "bold", color: "#1a1a1a", fontFamily: "'Noto Serif JP', serif" }}>
          不動産購入について
        </h1>
      </div>

      {/* ヒーロー画像 */}
      <div style={{ position: "relative", width: "100%", height: "clamp(240px, 40vw, 460px)", overflow: "hidden", marginTop: "24px" }}>
        <Image
          src="/images/buy/buyhero.jpg"
          alt="不動産購入について"
          fill
          style={{ objectFit: "cover", objectPosition: "center" }}
          priority
          sizes="100vw"
        />
      </div>

      {/* ── 購入の流れ ──────────────────────────────── */}
      <section style={{ padding: "64px 0" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>
          <h2 style={{ fontSize: "clamp(18px, 2.5vw, 26px)", fontWeight: "bold", color: "#1a1a1a", marginBottom: "8px", fontFamily: "'Noto Serif JP', serif" }}>
            購入の流れ
          </h2>
          <h3 style={{ fontSize: "15px", fontWeight: "bold", color: "#333", marginBottom: "16px" }}>
            不動産探しで大切なこと
          </h3>
          <p style={{ fontSize: "14px", color: "#555", lineHeight: 1.9, marginBottom: "48px" }}>
            不動産は安い買い物ではありません。だからこそ慎重にご検討いただき、納得されたうえで購入していただきたいと考えています。フェリアホームでは専任の担当スタッフがお客様一人ひとりに寄り添い、物件探しからご契約・お引き渡しまで一貫してサポートいたします。「何でも相談できる」「安心して任せられる」そんな存在でありたいと思っています。大切なお住まい探しのパートナーとして、フェリアホームをご活用ください。
          </p>

          {/* Step カード */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
            {STEPS.map((step, idx) => (
              <div key={step.num}>
                <div
                  className="buy-step-grid"
                  style={{
                    backgroundColor: "white",
                    borderRadius: "8px",
                    border: "1px solid #E5E5E5",
                    padding: "20px 24px",
                    display: "grid",
                    gap: "20px",
                    alignItems: "start",
                  }}
                >
                  {/* 写真 */}
                  <div style={{ position: "relative", width: "100%", maxWidth: "160px", aspectRatio: "4/3", borderRadius: "6px", overflow: "hidden" }}>
                    <Image
                      src={`/images/buy/${step.imgFile}.jpg`}
                      alt={step.title}
                      fill
                      style={{ objectFit: "cover" }}
                      sizes="160px"
                    />
                  </div>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                      <span style={{
                        display: "inline-flex", alignItems: "center", justifyContent: "center",
                        width: "36px", height: "36px", borderRadius: "50%",
                        backgroundColor: "#4a8a8a", color: "white",
                        fontSize: "12px", fontWeight: "bold", flexShrink: 0,
                      }}>
                        {step.num}
                      </span>
                      <h3 style={{ fontSize: "16px", fontWeight: "bold", color: "#1a1a1a" }}>
                        Step.{step.num}　{step.title}
                      </h3>
                    </div>
                    <p style={{ fontSize: "13px", color: "#555", lineHeight: 1.9 }}>{step.text}</p>
                  </div>
                </div>
                {idx < STEPS.length - 1 && (
                  <div style={{ textAlign: "center", padding: "6px 0", color: "#5BAD52", fontSize: "16px" }}>▼</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 住宅取得時の諸費用4つのポイント ─────────── */}
      <section style={{ padding: "64px 0", backgroundColor: "#5a8a6a" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>
          <h2 style={{ fontSize: "clamp(18px, 2.5vw, 26px)", fontWeight: "bold", color: "white", marginBottom: "8px", fontFamily: "'Noto Serif JP', serif" }}>
            住宅取得時の諸費用4つのポイント
          </h2>
          <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.8)", marginBottom: "40px" }}>4つのポイント</p>

          <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
            {POINTS.map((point) => (
              <div
                key={point.num}
                className="buy-point-grid"
                style={{ display: "grid", gap: "24px", alignItems: "start" }}
              >
                {/* 写真 */}
                <div style={{ position: "relative", width: "100%", maxWidth: "180px", aspectRatio: "4/3", borderRadius: "8px", overflow: "hidden" }}>
                  <Image
                    src={`/images/buy/${point.imgFile}.jpg`}
                    alt={point.title}
                    fill
                    style={{ objectFit: "cover" }}
                    sizes="180px"
                  />
                </div>
                <div>
                  <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "17px", color: "rgba(255,255,255,0.85)", fontStyle: "italic", marginBottom: "6px" }}>
                    Point.{point.num}
                  </p>
                  <h3 style={{ fontSize: "15px", fontWeight: "bold", color: "white", marginBottom: "10px" }}>
                    {point.title}
                  </h3>
                  <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.85)", lineHeight: 1.9 }}>
                    {point.text}
                  </p>
                  {point.bullets.length > 0 && (
                    <ul style={{ marginTop: "8px", display: "flex", flexDirection: "column", gap: "4px" }}>
                      {point.bullets.map((b, i) => (
                        <li key={i} style={{ fontSize: "12px", color: "rgba(255,255,255,0.8)", lineHeight: 1.7, listStyle: "none", paddingLeft: "12px", position: "relative" }}>
                          <span style={{ position: "absolute", left: 0 }}>・</span>
                          {b}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 諸費用一覧テーブル ──────────────────────── */}
      <section style={{ padding: "64px 0", backgroundColor: "#5a8a6a" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>
          <div style={{ backgroundColor: "white", borderRadius: "8px", padding: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h3 style={{ fontSize: "16px", fontWeight: "bold", color: "#1a1a1a" }}>住宅取得時にかかる主な諸費用一覧</h3>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
                <thead>
                  <tr style={{ backgroundColor: "#f5f5f5" }}>
                    <th style={{ padding: "8px 12px", border: "1px solid #ddd", textAlign: "center", width: "100px", backgroundColor: "#888", color: "white" }}>種別</th>
                    <th style={{ padding: "8px 12px", border: "1px solid #ddd", textAlign: "center", backgroundColor: "#5BAD52", color: "white" }}>項目</th>
                    <th style={{ padding: "8px 12px", border: "1px solid #ddd", textAlign: "center", backgroundColor: "#5BAD52", color: "white" }}>内容</th>
                    <th style={{ padding: "8px 12px", border: "1px solid #ddd", textAlign: "center", backgroundColor: "#d4a0b0", color: "white", width: "100px" }}>支払</th>
                  </tr>
                </thead>
                <tbody>
                  {COST_TABLE.map((cat) =>
                    cat.rows.map((row, ri) => (
                      <tr key={`${cat.category}-${ri}`}>
                        {ri === 0 && (
                          <td rowSpan={cat.rows.length} style={{ padding: "8px 12px", border: "1px solid #ddd", textAlign: "center", backgroundColor: "#f0f0f0", fontWeight: "bold", verticalAlign: "middle" }}>
                            {cat.category}
                          </td>
                        )}
                        <td style={{ padding: "8px 12px", border: "1px solid #ddd", color: "#333" }}>{row.name}</td>
                        <td style={{ padding: "8px 12px", border: "1px solid #ddd", color: "#555", lineHeight: 1.7 }}>{row.desc}</td>
                        <td style={{ padding: "8px 12px", border: "1px solid #ddd", textAlign: "center", color: "#555" }}>{row.timing}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* ── オンライン不動産見学サービス ───────────── */}
      <section style={{ padding: "64px 0" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>
          <h2 style={{ fontSize: "clamp(18px, 2.5vw, 26px)", fontWeight: "bold", color: "#1a1a1a", marginBottom: "8px", fontFamily: "'Noto Serif JP', serif" }}>
            オンライン不動産見学サービス
          </h2>
          <h3 style={{ fontSize: "15px", fontWeight: "bold", color: "#333", marginBottom: "12px" }}>
            オンライン不動産見学サービスとは？
          </h3>
          <p style={{ fontSize: "14px", color: "#555", lineHeight: 1.9, marginBottom: "40px" }}>
            現地に直接行かなくても、ご自宅やwi-fi環境のある場所から本物件見学を行えるサービスです。外出するのが難しい、空いた短い時間を利用して見学したい、動画を見ながら質疑応答したい等、お客様のニーズに合わせて物件を見ることができます。
          </p>

          <div
            className="buy-online-grid"
            style={{ display: "grid", gap: "16px", marginBottom: "32px" }}
          >
            {ONLINE_STEPS.map((s) => (
              <div key={s.num} style={{ border: "1px solid #E5E5E5", borderRadius: "8px", overflow: "hidden", width: "100%" }}>
                <div style={{ backgroundColor: "#F0F5F0", padding: "8px 12px" }}>
                  <p style={{ fontSize: "11px", color: "#5BAD52", fontWeight: "bold" }}>Step.{s.num}</p>
                  <p style={{ fontSize: "13px", fontWeight: "bold", color: "#1a1a1a" }}>{s.title}</p>
                </div>
                <div style={{ position: "relative", width: "100%", height: "140px", overflow: "hidden" }}>
                  <Image
                    src={`/images/buy/buy_online_${s.num}.jpg`}
                    alt={s.title}
                    fill
                    style={{ objectFit: "cover" }}
                    sizes="25vw"
                  />
                </div>
                <div style={{ padding: "10px 12px" }}>
                  <p style={{ fontSize: "12px", color: "#555", lineHeight: 1.7 }}>{s.text}</p>
                </div>
              </div>
            ))}
          </div>

          <div style={{ backgroundColor: "#F8F8F8", borderRadius: "8px", padding: "20px" }}>
            <p style={{ fontSize: "13px", fontWeight: "bold", color: "#333", marginBottom: "8px" }}>＜事前準備＞</p>
            <p style={{ fontSize: "13px", color: "#555", lineHeight: 1.8, marginBottom: "12px" }}>
              お客様がお使いのパソコン・スマートフォン・タブレットに『Zoom』『Google Meet』『LINE』等のビデオ通話アプリをインストールする必要があります。
            </p>
            <ul style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              {[
                "ご利用のビデオ通話アプリ（Zoom・Google Meet・LINE等）のご連絡先は担当スタッフよりお伝えいたします。",
                "本サービス利用の際はネットワーク接続された機器およびブラウザ・アプリケーションが必要になります。通信状況・端末によってはテレビ電話の画質が悪くなる場合がございます。",
                "本不動産見学サービスは東京23区内の物件に限られます。",
                "当物件室内の手配が必要となりますので、ご希望日程に添えない事もございます。ご了承ください。",
                "現在居住中の物件等、ご案内ができない物件もございます。",
              ].map((note, i) => (
                <li key={i} style={{ fontSize: "12px", color: "#777", lineHeight: 1.7, listStyle: "none", paddingLeft: "12px", position: "relative" }}>
                  <span style={{ position: "absolute", left: 0 }}>※</span>
                  {note}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

    </div>
  );
}
