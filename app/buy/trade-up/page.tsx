// app/buy/trade-up/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "物件の買い替えをお考えの方へ",
  description: "今が買い替えのチャンスです！5つのメリットと弊社の実際のお客様実例をご紹介します。",
};

// 実例コンポーネント
function CaseStudy({
  tag, title, client, voice, sellYear, sellType,
  sellPrice, sellArea, sellLayout, sellMonthly, sellMonthlyBreakdown,
  soldPrice, soldYear, soldNet,
  buyTitle, buyPrice, buyArea, buyAreaM2, buyLayout,
  buyLoan, buyMonthly, buyNote,
  beforeMonthly, beforeArea, beforeLayout,
  afterMonthly, afterArea, afterLayout, arrowLabel,
  result,
}: any) {
  return (
    <div style={{ marginBottom: "64px" }}>
      {/* タグ */}
      <p style={{ fontSize: "12px", color: "#5BAD52", fontWeight: "bold", marginBottom: "6px" }}>
        {tag}
      </p>
      <h3 style={{ fontSize: "clamp(16px, 2vw, 20px)", fontWeight: "bold", color: "#1a1a1a", marginBottom: "4px" }}>
        {title}　<span style={{ fontWeight: "normal", fontSize: "14px", color: "#888" }}>{client}</span>
      </h3>
      <p style={{ fontSize: "13px", color: "#666", marginBottom: "24px" }}>「{voice}」</p>

      {/* 1. 売却物件 */}
      <p style={{ fontSize: "13px", fontWeight: "bold", color: "#5BAD52", marginBottom: "8px", textAlign: "center" }}>
        1．売却物件
      </p>
      <p style={{ fontSize: "14px", fontWeight: "bold", color: "#333", marginBottom: "12px", textAlign: "center" }}>
        {sellYear}年築　{sellType}
      </p>
      <div style={{ backgroundColor: "#F8F8F8", borderRadius: "8px", padding: "20px", marginBottom: "8px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "16px", alignItems: "start" }}
          className="grid-cols-1 tb:grid-cols-[1fr_auto]">
          <div>
            <p style={{ fontWeight: "bold", fontSize: "15px", color: "#333", marginBottom: "4px" }}>購入価格 {sellPrice}万円</p>
            <p style={{ fontSize: "12px", color: "#5BAD52", fontWeight: "bold", marginBottom: "8px" }}>専有面積 {sellArea}㎡（{sellLayout}）</p>
            {sellMonthlyBreakdown.map((item: string, i: number) => (
              <p key={i} style={{ fontSize: "12px", color: "#666", lineHeight: 1.8 }}>・{item}</p>
            ))}
            <p style={{ fontWeight: "bold", fontSize: "14px", color: "#333", marginTop: "8px", borderTop: "1px solid #E0E0E0", paddingTop: "8px" }}>
              合計 {sellMonthly}万円／月
            </p>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{
              backgroundColor: "#5BAD52", color: "white", fontSize: "12px",
              fontWeight: "bold", padding: "6px 16px", borderRadius: "4px", marginBottom: "8px",
            }}>売却</div>
            <ArrowRight size={24} style={{ color: "#5BAD52", display: "block", margin: "0 auto 8px" }} />
            <p style={{ fontSize: "13px", fontWeight: "bold", color: "#333" }}>成約価格 {soldPrice}万円</p>
            <p style={{ fontSize: "11px", color: "#888" }}>{soldYear}</p>
            <div style={{ fontSize: "11px", color: "#666", margin: "8px 0", lineHeight: 1.6 }}>
              残債返済<br />仲介手数料支払い
            </div>
            <div style={{
              backgroundColor: "#E8F0E8", borderRadius: "6px", padding: "8px 12px",
              fontSize: "13px", fontWeight: "bold", color: "#2d5a2d",
            }}>
              手残資金 約{soldNet}万円
            </div>
          </div>
        </div>
      </div>

      {/* 2. 購入物件 */}
      <p style={{ fontSize: "13px", fontWeight: "bold", color: "#5BAD52", margin: "20px 0 8px", textAlign: "center" }}>
        2．購入物件
      </p>
      <p style={{ fontSize: "14px", fontWeight: "bold", color: "#333", marginBottom: "12px", textAlign: "center" }}>
        {buyTitle}
      </p>
      <div style={{ backgroundColor: "#F8F8F8", borderRadius: "8px", padding: "20px", marginBottom: "8px" }}>
        <p style={{ fontWeight: "bold", fontSize: "15px", color: "#333", marginBottom: "4px" }}>価格 {buyPrice}万円</p>
        <p style={{ fontSize: "12px", color: "#666", marginBottom: "4px" }}>土地面積 {buyArea}㎡</p>
        <p style={{ fontSize: "12px", color: "#5BAD52", fontWeight: "bold", marginBottom: "8px" }}>建物面積 {buyAreaM2}㎡（{buyLayout}）</p>
        <p style={{ fontSize: "13px", color: "#666" }}>ローン金額 {buyLoan}万円</p>
        <p style={{ fontWeight: "bold", fontSize: "14px", color: "#333", marginTop: "4px" }}>住宅ローン返済 {buyMonthly}万円／月</p>
        {buyNote && <p style={{ fontSize: "11px", color: "#888", marginTop: "4px" }}>※{buyNote}</p>}
      </div>

      {/* 3. 結果 */}
      <p style={{ fontSize: "13px", fontWeight: "bold", color: "#5BAD52", margin: "20px 0 12px", textAlign: "center" }}>
        3．結果
      </p>
      <div style={{ backgroundColor: "#F0F5F0", borderRadius: "8px", padding: "20px", textAlign: "center" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", flexWrap: "wrap", marginBottom: "16px" }}>
          <div style={{ border: "1px solid #ccc", borderRadius: "4px", padding: "10px 16px", backgroundColor: "white" }}>
            <p style={{ fontSize: "11px", color: "#888", marginBottom: "2px" }}>{sellYear}年築{sellType}</p>
            <p style={{ fontSize: "14px", fontWeight: "bold" }}>合計 {sellMonthly}万円／月</p>
            <p style={{ fontSize: "11px", color: "#666" }}>{sellArea}㎡　{sellLayout}</p>
          </div>
          <div style={{ textAlign: "center" }}>
            {arrowLabel && <p style={{ fontSize: "11px", color: "#5BAD52", fontWeight: "bold" }}>{arrowLabel}</p>}
            <div style={{ fontSize: "24px", color: "#5BAD52" }}>→</div>
            <p style={{ fontSize: "11px", color: "#5BAD52", fontWeight: "bold" }}>広い</p>
          </div>
          <div style={{ border: "2px solid #5BAD52", borderRadius: "4px", padding: "10px 16px", backgroundColor: "white" }}>
            <p style={{ fontSize: "11px", color: "#888", marginBottom: "2px" }}>{buyTitle}</p>
            <p style={{ fontSize: "14px", fontWeight: "bold" }}>{buyMonthly}万円／月</p>
            <p style={{ fontSize: "11px", color: "#666" }}>{buyAreaM2}㎡　{buyLayout}</p>
          </div>
        </div>
        <p style={{ fontSize: "clamp(14px, 1.8vw, 17px)", fontWeight: "bold", color: "#2d5a2d", lineHeight: 1.7, whiteSpace: "pre-line" }}>
          {result}
        </p>
      </div>
    </div>
  );
}

export default function TradeUpPage() {
  const merits = [
    {
      title: "低金利",
      sub: "ゼロ金利解除後も続く低金利",
      text: "お客様の費金内容にもよりますが、一般的な会社員の方であれば、現在変動0.6%台一お考えいただくことが可能です。",
    },
    {
      title: "団信革命",
      sub: "",
      text: "一般団信（主に死亡）に加え、がん・脳卒中・心筋梗塞等、様々なリスクに対応できる特約が拡充されております。",
    },
    {
      title: "住宅ローン減税",
      sub: "住宅ローン控除が5年間延長",
      text: "既存住宅取得にかかる借入限度額が拡充され、子育て世帯等への借入限度額の上乗せ措置がなされることになりました。",
    },
    {
      title: "譲渡所得の特別控除",
      sub: "3,000万円まで特別控除",
      text: "ご自宅を売却した際に発生する利益に対して課税される。譲渡取得税ですが、3,000万円までの利益であれば非課税になります。",
    },
    {
      title: "返済年数の拡充",
      sub: "返済期間が最大50年",
      text: "各銀行で差はありますが、返済年数の上限が35年完済から40年、45年、50年と延長される傾向にあり、ゆとりのある返済計画が立てやすくなっています。",
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
            <span style={{ color: "#333" }}>物件の買い替えをお考えの方へ</span>
          </nav>
        </div>
      </div>

      {/* タイトル */}
      <div className="container-content" style={{ padding: "32px 0 24px" }}>
        <h1 style={{ fontSize: "clamp(22px, 3vw, 32px)", fontWeight: "bold", color: "#1a1a1a", fontFamily: "'Noto Serif JP', serif" }}>
          物件の買い替えをお考えの方へ
        </h1>
      </div>

      {/* ヒーロー画像 */}
      <div className="container-content" style={{ paddingBottom: "48px" }}>
        <div style={{
          width: "100%", height: "clamp(200px, 35vw, 360px)", borderRadius: "8px",
          background: "linear-gradient(135deg, #2d5a2d, #5BAD52)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px" }}>ヒーロー画像</p>
        </div>
      </div>

      {/* 今が買い替えのチャンス */}
      <section style={{ padding: "0 0 64px" }}>
        <div className="container-content">
          <p style={{ fontSize: "13px", color: "#5BAD52", fontWeight: "bold", marginBottom: "8px" }}>
            買い替えのメリット多数アリ！
          </p>
          <h2 style={{ fontSize: "clamp(20px, 3vw, 32px)", fontWeight: "bold", color: "#1a1a1a", marginBottom: "32px", fontFamily: "'Noto Serif JP', serif" }}>
            今が買い替えのチャンスです!!
          </h2>

          {/* 現在の不動産市場 */}
          <h3 style={{ fontSize: "16px", fontWeight: "bold", color: "#1a1a1a", marginBottom: "16px" }}>
            現在の不動産市場
          </h3>
          <div style={{ display: "grid", gap: "24px", marginBottom: "48px" }}
            className="grid-cols-1 tb:grid-cols-[200px_1fr]">
            <div style={{ width: "100%", maxWidth: "200px", aspectRatio: "4/3", borderRadius: "8px", backgroundColor: "#E8F0E8", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: "11px", color: "#aaa" }}>写真</span>
            </div>
            <p style={{ fontSize: "14px", color: "#555", lineHeight: 1.9 }}>
              2008年、米投資銀行の経営破綻に端を発し、世界的な金融危機・不況に発展しました。その後、横ばいだった日本の不動産市場は、2002年以降日本とアメリカの金利に寄り添んだ円安、それにより活性化した海外投資家の資金流入により、日本の不動産は現在に至るまで上がり続けております。都市部と郊外の二極化が叫ばれておりますが、都市部の地価は依然低堅い状態が継続しております。
            </p>
          </div>

          {/* 5つのメリット */}
          <h3 style={{ fontSize: "20px", fontWeight: "bold", color: "#1a1a1a", marginBottom: "24px", fontFamily: "'Noto Serif JP', serif" }}>
            5つのメリット
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "16px" }}
            className="grid-cols-1 tb:grid-cols-3">
            {merits.slice(0, 3).map((m) => (
              <div key={m.title} style={{ backgroundColor: "#F0F5F0", borderRadius: "8px", padding: "20px" }}>
                <p style={{ fontWeight: "bold", fontSize: "15px", color: "#2d5a2d", marginBottom: "4px" }}>{m.title}</p>
                {m.sub && <p style={{ fontSize: "12px", color: "#5BAD52", marginBottom: "8px" }}>{m.sub}</p>}
                <p style={{ fontSize: "12px", color: "#555", lineHeight: 1.8 }}>{m.text}</p>
              </div>
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}
            className="grid-cols-1 tb:grid-cols-3">
            {merits.slice(3, 5).map((m) => (
              <div key={m.title} style={{ backgroundColor: "#F0F5F0", borderRadius: "8px", padding: "20px" }}>
                <p style={{ fontWeight: "bold", fontSize: "15px", color: "#2d5a2d", marginBottom: "4px" }}>{m.title}</p>
                {m.sub && <p style={{ fontSize: "12px", color: "#5BAD52", marginBottom: "8px" }}>{m.sub}</p>}
                <p style={{ fontSize: "12px", color: "#555", lineHeight: 1.8 }}>{m.text}</p>
              </div>
            ))}
            <div style={{ backgroundColor: "#F0F5F0", borderRadius: "8px", padding: "20px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: "11px", color: "#aaa" }}>家のイメージ図</span>
            </div>
          </div>
        </div>
      </section>

      {/* 弊社のお客様実例 */}
      <section style={{ padding: "64px 0", backgroundColor: "#F8F8F8" }}>
        <div className="container-content">
          <h2 style={{ fontSize: "clamp(18px, 2.5vw, 26px)", fontWeight: "bold", color: "#1a1a1a", marginBottom: "48px", fontFamily: "'Noto Serif JP', serif" }}>
            弊社のお客様実例
          </h2>

          {/* 実例1 */}
          <CaseStudy
            tag="3,000万円の特別控除を利用"
            title="月々の支払いが安くなり、建物は広くなったケース"
            client="品川区在住K様"
            voice="現在5人家族、以前のマンションだと狭いため広いお家を探しておりました"
            sellYear={2015}
            sellType="中古マンション"
            sellPrice={5580}
            sellArea={67}
            sellLayout="3LDK"
            sellMonthly={19.5}
            sellMonthlyBreakdown={["住宅ローン返済 14万円／月", "管理費等 3万円／月", "駐車場代 2.5万円／月"]}
            soldPrice={7580}
            soldYear="2024年 築9年"
            soldNet={3000}
            buyTitle="品川区内新築戸建て"
            buyPrice={9700}
            buyArea={60}
            buyAreaM2={100}
            buyLayout="4LDK＋車庫"
            buyLoan={7200}
            buyMonthly={18.2}
            buyNote="手残資金から一部（2,500万円）充当"
            beforeMonthly={19.5}
            beforeArea={67}
            beforeLayout="3LDK"
            afterMonthly={18.2}
            afterArea={100}
            afterLayout="4LDK＋車庫"
            arrowLabel="安い"
            result="月々の支払いは安く、広いお家に買い替えることができました。"
          />

          {/* 実例2 */}
          <CaseStudy
            tag="3,000万円の特別控除を利用"
            title="月々の支払いが安くなり、建物は広くなったケース"
            client="文京区在住T様"
            voice="子どもが産まれ、以前の住まいが手狭になったため買い替えを考えておりました"
            sellYear={2018}
            sellType="中古マンション"
            sellPrice={7450}
            sellArea={57}
            sellLayout="2LDK"
            sellMonthly={21.4}
            sellMonthlyBreakdown={["住宅ローン返済 19万円／月", "管理費等 2.4万円／月"]}
            soldPrice={11900}
            soldYear="2024年 築6年"
            soldNet={4000}
            buyTitle="文京区内土地"
            buyPrice="土地7,480万円 ＋ 建物3,300万円"
            buyArea={50}
            buyAreaM2={90}
            buyLayout="3LDK"
            buyLoan={7480}
            buyMonthly={19}
            buyNote="手残資金から一部（3,300万円）充当"
            beforeMonthly={21.4}
            beforeArea={57}
            beforeLayout="2LDK"
            afterMonthly={19}
            afterArea={90}
            afterLayout="3LDK"
            arrowLabel="安い"
            result="月々の支払いは安く、広いお家に買い替えることができました。"
          />

          {/* 実例3 */}
          <CaseStudy
            tag="住宅ローン控除を利用"
            title="月々の支払いは大きく増えずに、建物が広くなり、手持ち資金もできたケース"
            client="杉並区在住A様"
            voice="3人の子どもの成長に伴い、手狭になったため買い替えを希望しておりました"
            sellYear={2017}
            sellType="中古マンション"
            sellPrice={6600}
            sellArea={68}
            sellLayout="3LDK"
            sellMonthly={21.8}
            sellMonthlyBreakdown={["住宅ローン返済 17万円／月", "管理費等 2.7万円／月", "駐車場代 2.1万円／月"]}
            soldPrice={7580}
            soldYear="2023年 築6年"
            soldNet={1500}
            buyTitle="杉並区内新築戸建て"
            buyPrice={8980}
            buyArea={60}
            buyAreaM2={110}
            buyLayout="3LDK"
            buyLoan={8980}
            buyMonthly={23}
            buyNote="住宅ローン控除を利用"
            beforeMonthly={21.8}
            beforeArea={68}
            beforeLayout="3LDK"
            afterMonthly={23}
            afterArea={110}
            afterLayout="3LDK"
            arrowLabel="+約1万円"
            result={"月々の支払いは大きく増やさずに広いお家に買い替えることができ、\n手持ち資金を1,500万円つくることができました。\nさらに13年間のローン控除の恩恵も受けることができています。"}
          />
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "64px 0" }}>
        <div className="container-content" style={{ maxWidth: "640px", margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontSize: "clamp(16px, 2.5vw, 22px)", fontWeight: "bold", color: "#1a1a1a", marginBottom: "16px", fontFamily: "'Noto Serif JP', serif" }}>
            現在のご自宅からの買い替えにメリットがあるのか、まずはお気軽にご相談を！
          </h2>
          <p style={{ fontSize: "13px", color: "#666", lineHeight: 1.9, marginBottom: "32px" }}>
            フェリアホームでは買い替えのご相談も無料で承っております。<br />
            今買い替えを考えている方、買い替えを考え始めた方、まずはお気軽にお問い合わせください。
          </p>
          <Link
            href="/contact"
            style={{
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              padding: "16px 40px", border: "2px solid #4a8a8a", borderRadius: "4px",
              color: "#4a8a8a", fontWeight: "bold", fontSize: "15px",
              textDecoration: "none",
            }}
          >
            買い替えに関するご相談はこちらから
          </Link>
        </div>
      </section>

    </div>
  );
}
