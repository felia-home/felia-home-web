// app/sell/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, ArrowRight } from "lucide-react";
import { SellFAQ } from "@/components/sell/SellFAQ";
import { SellNav } from "@/components/sell/SellNav";

export const metadata: Metadata = {
  title: "不動産売却について",
  description: "フェリアホームの不動産売却サービス。7つの強み・売却の流れ・仲介と買取の違い・よくある質問をご紹介します。",
};

// 媒介契約比較テーブル
function MediateTable() {
  return (
    <div style={{ marginTop: "16px", overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px", minWidth: "480px" }}>
        <thead>
          <tr>
            <th style={{ padding: "8px 12px", backgroundColor: "#777", color: "white", border: "1px solid #ccc", width: "130px" }}></th>
            <th style={{ padding: "8px 12px", backgroundColor: "#5BAD52", color: "white", border: "1px solid #ccc", textAlign: "center" }}>一般媒介契約</th>
            <th style={{ padding: "8px 12px", backgroundColor: "#4a8a8a", color: "white", border: "1px solid #ccc", textAlign: "center" }}>専任媒介契約</th>
            <th style={{ padding: "8px 12px", backgroundColor: "#3a7a7a", color: "white", border: "1px solid #ccc", textAlign: "center" }}>専属専任媒介契約</th>
          </tr>
        </thead>
        <tbody>
          {[
            { label: "契約有効期間", vals: ["無制限", "3ヶ月以内", "3ヶ月以内"] },
            { label: "他社への依頼", vals: ["可能", "不可能", "不可能"] },
            { label: "自己成約", vals: ["可能", "可能", "不可能"] },
            { label: "売主ヘの報告", vals: ["無し", "2週間に1回以上", "1週間に1回以上"] },
            { label: "指定流通機関への登録", vals: ["無し", "有り", "有り"] },
          ].map((row) => (
            <tr key={row.label}>
              <td style={{ padding: "8px 12px", backgroundColor: "#f5f5f5", fontWeight: "bold", border: "1px solid #ddd", textAlign: "center", fontSize: "11px" }}>
                {row.label}
              </td>
              {row.vals.map((val, i) => (
                <td key={i} style={{ padding: "8px 12px", border: "1px solid #ddd", textAlign: "center", color: "#444" }}>
                  {val}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function StrengthCircle({ s }: { s: { num: string; text: string } }) {
  return (
    <div style={{
      width: "clamp(130px, 17vw, 165px)",
      height: "clamp(130px, 17vw, 165px)",
      borderRadius: "50%",
      backgroundColor: "#4a8a8a",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      padding: "14px",
    }}>
      <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "8px", letterSpacing: "0.15em" }}>Strong Point</p>
      <p style={{ color: "white", fontSize: "20px", fontWeight: "bold", fontFamily: "'Montserrat', sans-serif", margin: "1px 0" }}>{s.num}</p>
      <p style={{ color: "white", fontSize: "9.5px", lineHeight: 1.5, whiteSpace: "pre-line" }}>{s.text}</p>
    </div>
  );
}

export default function SellPage() {
  const strengths = [
    { num: "01", text: "ご相談・査定無料！\n弊社で買取も\n可能です" },
    { num: "02", text: "自社ホームページ\nで優先表示！" },
    { num: "03", text: "大手ポータルサイトに複数掲載します！\nスーモ・アットホーム・ホームズ等" },
    { num: "04", text: "新聞での\n折込チラシを配布" },
    { num: "05", text: "ポスティングチラシ\nで的確なアプローチ" },
    { num: "06", text: "現地販売会\n開催の効果" },
    { num: "07", text: "有資格者による\n適正な不動産査定" },
  ];

  const steps = [
    {
      step: "01", title: "売却相談", imageFile: "sale_flow_01",
      text: "不動産は高額であるため、容易には売れません。そこで、不動産売買を満知した売却専門のコンシェルジュが在籍する弊社にご相談ください。迅速かつ正確に適正価格を査定いたします。",
      hasTable: false,
    },
    {
      step: "02", title: "価格査定", imageFile: "sale_flow_02",
      text: "売却する不動産の近隣相場や接道状況、築年月、広さ、形状等から査定を行い、適正な売却価格をご提示。査定書を作成し、算出した価格の根拠をご説明いたします。",
      hasTable: false,
    },
    {
      step: "03", title: "媒介契約", imageFile: "sale_flow_03",
      text: "不動産の査定が終了し、ご提示した価格またはお客様ご希望の売却価格で弊社に売却をご依頼される場合には、弊社と媒介契約を結んでいただきます。",
      note: "※媒介契約には3つの種類（下記参照）があります。",
      hasTable: true,
    },
    {
      step: "04", title: "販売活動", imageFile: "sale_flow_04",
      text: "お客様から売却をご依頼された物件について、ホームページやポータルサイト、チラシ、現地販売会等の広報を通して販売活動を行います（契約に結び付くまで断続的に実施）。",
      hasTable: false,
    },
    {
      step: "05", title: "売買契約", imageFile: "sale_flow_05",
      text: "不動産を購入したい方が見つかった場合、購入申し込み、希望購入価格等の条件交渉がなされます。売却するかご検討いただき、売却契約へ進みます。契約書や重要事項説明書等の書類は弊社が作成いたします。",
      hasTable: false,
    },
    {
      step: "06", title: "お引き渡し", imageFile: "sale_flow_06",
      text: "売買契約を結んだ後、残代金決済を行います。残代金受領後に鍵（戸建ての場合）の引き渡しと法務局に所有権移転申請を行い、これで不動産の売却は完了です。",
      hasTable: false,
    },
  ];

  const comparisonRows = [
    {
      label: "買主",
      mediation: "不動産会社が探してきた購入希望者",
      buyout: "不動産会社",
    },
    {
      label: "価格",
      mediation: "相場価格と大差なく売ることができる",
      buyout: "仲介より売却価格は低くなりがちです",
    },
    {
      label: "要する期間",
      mediation: "購入者を探し、その後条件交渉などが発生するため比較的時間がかかる",
      buyout: "買い手が不動産会社になるため、買い手を探す手間や条件交渉の時間が軽減できる。仲介に比べ比較的短い期間で売却可能",
    },
    {
      label: "仲介手数料",
      mediation: "仲介手数料が発生する",
      buyout: "不動産会社が買主になるため不要",
    },
    {
      label: "広告宣伝",
      mediation: "インターネット・チラシなど物件情報を掲載し広告活動を行う\n※周りに極力知られたくない場合はご相談ください",
      buyout: "不動産会社が買主になるため不要",
    },
    {
      label: "メリット",
      mediation: "相場価格と大差ない価格で売却できる可能性がある。時間をかけて購入希望者を探すことで、より良い条件で売却できる可能性がある",
      buyout: "売却の可否が判明すれば比較的短い期間で売却可能。仲介手数料がかからない。広告を出さないので、周囲に気づかれず売却可能",
    },
    {
      label: "デメリット",
      mediation: "売却まで長期間、時間を要する場合がある。購入希望者からの内覧希望に都度対応する必要がある",
      buyout: "仲介より売却価格が低くなりがちです",
    },
  ];

  const costs = [
    { emoji: "💰", label: "売却仲介手数料" },
    { emoji: "📋", label: "売買契約書に\n貼付する印紙代" },
    { emoji: "📄", label: "振込等の\n抵消費用" },
    { emoji: "🏛️", label: "課税税" },
    { emoji: "🏠", label: "引き渡し準備等に\nかかる費用" },
  ];

  const points = [
    {
      num: "01", imageFile: "sale_point_01",
      title: "現在の自分の状況を把握し、\n売却する理由を考える。",
      text: "現在の手元資金や住宅ローン残債、月々の返済状況等、経済状況を確認しましょう。売主様の状況や、どのぐらいの期間以内に売却したいかによっても売却方法が変わってきます。",
    },
    {
      num: "02", imageFile: "sale_point_02",
      title: "信頼できる不動産会社（担当者）を選ぶ。",
      text: "信頼できる不動産会社（担当者）を選ぶ。売却を依頼する不動産会社を選ぶ際に、査定価格だけで選んでしまっては失敗するケースがあります。売却に対してアドバイスしてくれ、信頼できる担当者に依頼することが大事です。",
    },
    {
      num: "03", imageFile: "sale_point_03",
      title: "売り出し価格を設定し、\n段階ごとの売却価格を決める。",
      text: "「売却価格」をいくらに設定するかも大切です。具体的な売却価格の決め方は、売却査定価格等を基準にして、ある程度売り易い価格を目安となる価格を設定するとよいでしょう。",
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
            <span style={{ color: "#333" }}>不動産売却について</span>
          </nav>
        </div>
      </div>

      {/* タイトル */}
      <div className="container-content" style={{ padding: "24px 0 20px" }}>
        <h1 style={{ fontSize: "clamp(22px, 3vw, 32px)", fontWeight: "bold", color: "#1a1a1a", fontFamily: "'Noto Serif JP', serif", margin: 0 }}>
          不動産売却について
        </h1>
      </div>

      {/* ヒーロー画像（フルワイド） */}
      <div style={{ position: "relative", width: "100%", height: "clamp(280px, 45vw, 520px)", overflow: "hidden" }}>
        <Image
          src="/images/sell/sellhero.jpg"
          alt="不動産売却について"
          fill
          style={{ objectFit: "cover", objectPosition: "center" }}
          priority
          sizes="100vw"
        />
      </div>

      {/* ページ内ナビ */}
      <SellNav />

      {/* ── 7つの強み ────────────────────────────── */}
      <section id="strengths" style={{ padding: "64px 0" }}>
        <div className="container-content">
          <h2 style={{ fontSize: "clamp(18px, 2.5vw, 26px)", fontWeight: "bold", color: "#1a1a1a", marginBottom: "48px", fontFamily: "'Noto Serif JP', serif" }}>
            フェリアホームの不動産売却　7つの強み
          </h2>
          {/* 上段4つ */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "20px",
            marginBottom: "20px",
            justifyItems: "center",
          }}>
            {strengths.slice(0, 4).map((s) => (
              <StrengthCircle key={s.num} s={s} />
            ))}
          </div>

          {/* 下段3つ：0.5fr で左右に空白を作り中央揃え・上段と同じ1frカラム幅 */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "0.5fr 1fr 1fr 1fr 0.5fr",
            gap: "20px",
            justifyItems: "center",
          }}>
            <div />
            {strengths.slice(4).map((s) => (
              <StrengthCircle key={s.num} s={s} />
            ))}
            <div />
          </div>
        </div>
      </section>

      {/* ── 不動産売却の流れ ──────────────────────── */}
      <section id="flow" style={{ padding: "64px 0", backgroundColor: "#F8F8F8" }}>
        <div className="container-content">
          <h2 style={{ fontSize: "clamp(18px, 2.5vw, 22px)", fontWeight: "bold", color: "#1a1a1a", marginBottom: "40px", fontFamily: "'Noto Serif JP', serif" }}>
            不動産売却の流れ
          </h2>
          {steps.map((item, idx) => (
            <div key={item.step}>
              {/* カード */}
              <div style={{
                backgroundColor: "white",
                borderRadius: "12px",
                border: "1px solid #E5E5E5",
                padding: "24px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              }}>
                <div style={{ display: "grid", gap: "20px" }}
                  className="grid-cols-1 tb:grid-cols-[160px_1fr]">
                  <div style={{ position: "relative", width: "100%", maxWidth: "160px", aspectRatio: "4/3", borderRadius: "8px", overflow: "hidden" }}>
                    <Image
                      src={`/images/sell/${item.imageFile}.jpg`}
                      alt={item.title}
                      fill
                      style={{ objectFit: "cover" }}
                      sizes="160px"
                    />
                  </div>
                  <div>
                    {/* ステップ番号バッジ */}
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                      <span style={{
                        display: "inline-flex", alignItems: "center", justifyContent: "center",
                        width: "36px", height: "36px", borderRadius: "50%",
                        backgroundColor: "#4a8a8a", color: "white",
                        fontSize: "12px", fontWeight: "bold", flexShrink: 0,
                      }}>
                        {item.step}
                      </span>
                      <h3 style={{ fontSize: "16px", fontWeight: "bold", color: "#1a1a1a" }}>
                        {item.title}
                      </h3>
                    </div>
                    <p style={{ fontSize: "13px", color: "#555", lineHeight: 1.9 }}>{item.text}</p>
                    {item.note && <p style={{ fontSize: "12px", color: "#888", marginTop: "6px" }}>{item.note}</p>}
                    {item.hasTable && <MediateTable />}
                  </div>
                </div>
              </div>
              {/* ステップ間の矢印 */}
              {idx < steps.length - 1 && (
                <div style={{ textAlign: "center", padding: "8px 0", color: "#5BAD52", fontSize: "20px" }}>▼</div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── 「仲介」と「買取」の違い ──────────────── */}
      <section id="difference" style={{ padding: "64px 0" }}>
        <div className="container-content">
          <h2 style={{ fontSize: "clamp(18px, 2.5vw, 26px)", fontWeight: "bold", color: "#1a1a1a", marginBottom: "12px", fontFamily: "'Noto Serif JP', serif" }}>
            「仲介」と「買取」の違い
          </h2>
          <p style={{ fontSize: "14px", color: "#555", lineHeight: 1.9, marginBottom: "6px" }}>
            不動産を売却する際には、<br />「仲介」と「買取」の2種類があります。
          </p>
          <p style={{ fontSize: "13px", color: "#666", lineHeight: 1.9, marginBottom: "32px" }}>
            不動産会社に購入希望者（買主）を探してもらい売却を行う「仲介」と、不動産会社がお客様の不動産を買い取る「買取」。それぞれに売却価格、売却までにかかる期間、売却の手順が違います。メリットとデメリットを良く理解してお客様に合う売却方法を選択しましょう。
          </p>

          {/* 図解 */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "32px" }}
            className="grid-cols-1 tb:grid-cols-2">
            <div style={{ border: "2px solid #5BAD52", borderRadius: "8px", padding: "24px" }}>
              <h3 style={{ color: "#5BAD52", fontWeight: "bold", marginBottom: "12px", textAlign: "center" }}>仲介の場合</h3>
              <div style={{ fontSize: "12px", color: "#666", textAlign: "center", lineHeight: 2 }}>
                売主様 → 一般・専任媒介契約 → 不動産会社<br />
                ↓ 物件紹介・売主様との売買介入<br />
                買主様 → 売買契約
              </div>
            </div>
            <div style={{ border: "2px solid #d4a0b0", borderRadius: "8px", padding: "24px" }}>
              <h3 style={{ color: "#d4a0b0", fontWeight: "bold", marginBottom: "12px", textAlign: "center" }}>買取の場合</h3>
              <div style={{ fontSize: "12px", color: "#666", textAlign: "center", lineHeight: 2 }}>
                売主様 → 売買契約 → 不動産会社
              </div>
            </div>
          </div>

          {/* 比較表 */}
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", minWidth: "520px" }}>
              <thead>
                <tr>
                  <th style={{ padding: "10px 14px", backgroundColor: "#888", color: "white", border: "1px solid #ddd", width: "100px" }}></th>
                  <th style={{ padding: "10px 14px", backgroundColor: "#5BAD52", color: "white", border: "1px solid #ddd", textAlign: "center" }}>仲介</th>
                  <th style={{ padding: "10px 14px", backgroundColor: "#d4a0b0", color: "white", border: "1px solid #ddd", textAlign: "center" }}>買取</th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row) => (
                  <tr key={row.label}>
                    <td style={{ padding: "10px 14px", backgroundColor: "#f5f5f5", fontWeight: "bold", border: "1px solid #ddd", textAlign: "center", verticalAlign: "middle" }}>
                      {row.label}
                    </td>
                    <td style={{ padding: "10px 14px", border: "1px solid #ddd", lineHeight: 1.8, color: "#444", whiteSpace: "pre-line" }}>
                      {row.mediation}
                    </td>
                    <td style={{ padding: "10px 14px", border: "1px solid #ddd", lineHeight: 1.8, color: "#444", whiteSpace: "pre-line" }}>
                      {row.buyout}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={{ fontSize: "12px", color: "#777", marginTop: "12px" }}>
            「仲介」「買取」どちらでもお気軽にご相談ください。お客様に最適な売却方法をご提案致します。
          </p>
        </div>
      </section>

      {/* ── よくある質問 ──────────────────────────── */}
      <section id="faq" style={{ padding: "64px 0", backgroundColor: "#2d4a4a" }}>
        <div className="container-content">
          <h2 style={{ fontSize: "clamp(18px, 2.5vw, 22px)", fontWeight: "bold", color: "white", marginBottom: "32px", fontFamily: "'Noto Serif JP', serif" }}>
            よくある質問
          </h2>
          <SellFAQ />
        </div>
      </section>

      {/* ── 不動産売却時の諸費用 ──────────────────── */}
      <section id="costs" style={{ padding: "64px 0" }}>
        <div className="container-content">
          <h2 style={{ fontSize: "clamp(18px, 2.5vw, 26px)", fontWeight: "bold", color: "#1a1a1a", marginBottom: "12px", fontFamily: "'Noto Serif JP', serif" }}>
            不動産売却時の諸費用
          </h2>
          <p style={{ fontSize: "15px", fontWeight: "bold", color: "#333", lineHeight: 1.7, marginBottom: "8px" }}>
            不動産を売却する場合には<br />さまざまな諸費用や税金がかかります。
          </p>
          <p style={{ fontSize: "13px", color: "#666", lineHeight: 1.9, marginBottom: "40px" }}>
            不動産の売却にかかる費用や税費には様々な種類があります。売却する際には手取り金額がいくらになるのかを事前にチェックしたうえで計画的に売却を進めましょう。
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "32px" }}>
            {costs.map((item) => (
              <div key={item.label} style={{ textAlign: "center" }}>
                <div style={{
                  width: "80px", height: "80px", borderRadius: "50%",
                  backgroundColor: "#4a8a8a",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  margin: "0 auto 8px", fontSize: "28px",
                }}>
                  {item.emoji}
                </div>
                <p style={{ fontSize: "11px", color: "#555", whiteSpace: "pre-line", textAlign: "center", lineHeight: 1.5 }}>
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 少しでも高く売るポイント ──────────────── */}
      <section id="points" style={{ padding: "64px 0", backgroundColor: "#5a8a6a" }}>
        <div className="container-content">
          <h2 style={{ fontSize: "clamp(18px, 2.5vw, 26px)", fontWeight: "bold", color: "white", marginBottom: "8px", fontFamily: "'Noto Serif JP', serif" }}>
            少しでも高く売るポイント
          </h2>
          <p style={{ color: "rgba(255,255,255,0.95)", fontWeight: "bold", fontSize: "15px", marginBottom: "8px" }}>
            いざ売却する際には、<br />計画を立てて賢く売却しましょう。
          </p>
          <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "13px", lineHeight: 1.9, marginBottom: "40px" }}>
            何も考えずに売却を依頼してしまうと、数百万円単位で大損する可能性もあります。<br />
            家を売る際にはしっかりと計画を立て、賢い売却をしましょう。
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "36px" }}>
            {points.map((point) => (
              <div key={point.num} style={{ display: "grid", gap: "24px", alignItems: "start" }}
                className="grid-cols-1 tb:grid-cols-[200px_1fr]">
                <div style={{ position: "relative", width: "100%", maxWidth: "200px", aspectRatio: "4/3", borderRadius: "8px", overflow: "hidden" }}>
                  <Image
                    src={`/images/sell/${point.imageFile}.jpg`}
                    alt={point.title}
                    fill
                    style={{ objectFit: "cover" }}
                    sizes="200px"
                  />
                </div>
                <div>
                  <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "17px", color: "rgba(255,255,255,0.85)", fontStyle: "italic", marginBottom: "6px" }}>
                    Point.{point.num}
                  </p>
                  <h3 style={{ fontSize: "15px", fontWeight: "bold", color: "white", marginBottom: "10px", whiteSpace: "pre-line", lineHeight: 1.6 }}>
                    {point.title}
                  </h3>
                  <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.85)", lineHeight: 1.9 }}>
                    {point.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 売却実績リンク ───────────────────────── */}
      <section style={{ padding: "48px 0", backgroundColor: "#F8F8F8" }}>
        <div className="container-content" style={{ textAlign: "center" }}>
          <h2 style={{ fontSize: "clamp(18px, 2.5vw, 24px)", fontWeight: "bold", color: "#1a1a1a", marginBottom: "8px", fontFamily: "'Noto Serif JP', serif" }}>
            売却実績
          </h2>
          <p style={{ fontSize: "14px", color: "#666", marginBottom: "24px" }}>
            フェリアホームがサポートした成約実績をご覧いただけます
          </p>
          <Link
            href="/sell/results"
            style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              padding: "12px 32px", borderRadius: "8px",
              border: "2px solid #5BAD52", color: "#5BAD52",
              fontWeight: "bold", fontSize: "14px", textDecoration: "none",
            }}
          >
            売却実績を見る
            <ChevronRight size={16} />
          </Link>
        </div>
      </section>

      {/* ── 売却査定CTA ──────────────────────────── */}
      <section id="assessment" style={{ padding: "64px 0" }}>
        <div className="container-content" style={{ textAlign: "center" }}>
          <h2 style={{ fontSize: "clamp(18px, 2.5vw, 26px)", fontWeight: "bold", color: "#1a1a1a", marginBottom: "12px", fontFamily: "'Noto Serif JP', serif" }}>
            売却査定
          </h2>
          <p style={{ fontSize: "14px", color: "#666", marginBottom: "32px" }}>
            まずはお気軽に無料査定をご依頼ください
          </p>
          <Link
            href="/sell/valuation"
            style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              padding: "16px 48px", borderRadius: "8px",
              backgroundColor: "#5BAD52", color: "white",
              fontWeight: "bold", fontSize: "16px", textDecoration: "none",
            }}
          >
            無料売却査定を依頼する
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

    </div>
  );
}
