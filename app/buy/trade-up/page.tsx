// app/buy/trade-up/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";

export const metadata: Metadata = {
  title: "物件の買い替えをお考えの方へ",
  description: "今が買い替えのチャンスです！5つのメリットと弊社の実際のお客様実例をご紹介します。",
};

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

  const cases = [
    {
      tag: "3,000万円の特別控除を利用",
      title: "月々の支払いが安くなり、建物は広くなったケース",
      client: "品川区在住K様",
      voice: "現在5人家族、以前のマンションだと狭いため広いお家を探しておりました",
      sellImg: "case011",
      buyImg: "case012",
      sell: {
        year: 2015, type: "中古マンション",
        price: 5580, area: 67, layout: "3LDK",
        monthly: 19.5,
        breakdown: ["住宅ローン返済 14万円／月", "管理費等 3万円／月", "駐車場代 2.5万円／月"],
        soldPrice: 7580, soldYear: "2024年 築9年", soldNet: 3000,
      },
      buy: {
        title: "品川区内新築戸建て",
        price: "9,700", area: 60, areaM2: 100, layout: "4LDK＋車庫",
        loan: 7200, monthly: 18.2,
        note: "手残資金から一部（2,500万円）充当",
      },
      result: {
        beforeMonthly: 19.5, beforeArea: 67, beforeLayout: "3LDK",
        afterMonthly: 18.2, afterArea: 100, afterLayout: "4LDK＋車庫",
        arrowLabel: "安い",
        text: "月々の支払いは安く、広いお家に買い替えることができました。",
      },
    },
    {
      tag: "3,000万円の特別控除を利用",
      title: "月々の支払いが安くなり、建物は広くなったケース",
      client: "文京区在住T様",
      voice: "子どもが産まれ、以前の住まいが手狭になったため買い替えを考えておりました",
      sellImg: "case021",
      buyImg: "case022",
      sell: {
        year: 2018, type: "中古マンション",
        price: 7450, area: 57, layout: "2LDK",
        monthly: 21.4,
        breakdown: ["住宅ローン返済 19万円／月", "管理費等 2.4万円／月"],
        soldPrice: 11900, soldYear: "2024年 築6年", soldNet: 4000,
      },
      buy: {
        title: "文京区内土地",
        price: "土地7,480万円 ＋ 建物3,300万円", area: 50, areaM2: 90, layout: "3LDK",
        loan: 7480, monthly: 19,
        note: "手残資金から一部（3,300万円）充当",
      },
      result: {
        beforeMonthly: 21.4, beforeArea: 57, beforeLayout: "2LDK",
        afterMonthly: 19, afterArea: 90, afterLayout: "3LDK",
        arrowLabel: "安い",
        text: "月々の支払いは安く、広いお家に買い替えることができました。",
      },
    },
    {
      tag: "住宅ローン控除を利用",
      title: "月々の支払いは大きく増えずに、建物が広くなり、手持ち資金もできたケース",
      client: "杉並区在住A様",
      voice: "3人の子どもの成長に伴い、手狭になったため買い替えを希望しておりました",
      sellImg: "case031",
      buyImg: "case032",
      sell: {
        year: 2017, type: "中古マンション",
        price: 6600, area: 68, layout: "3LDK",
        monthly: 21.8,
        breakdown: ["住宅ローン返済 17万円／月", "管理費等 2.7万円／月", "駐車場代 2.1万円／月"],
        soldPrice: 7580, soldYear: "2023年 築6年", soldNet: 1500,
      },
      buy: {
        title: "杉並区内新築戸建て",
        price: "8,980", area: 60, areaM2: 110, layout: "3LDK",
        loan: 8980, monthly: 23,
        note: "住宅ローン控除を利用",
      },
      result: {
        beforeMonthly: 21.8, beforeArea: 68, beforeLayout: "3LDK",
        afterMonthly: 23, afterArea: 110, afterLayout: "3LDK",
        arrowLabel: "+約1万円",
        text: "月々の支払いは大きく増やさずに広いお家に買い替えることができ、\n手持ち資金を1,500万円つくることができました。\nさらに13年間のローン控除の恩恵も受けることができています。",
      },
    },
  ];

  return (
    <div style={{ backgroundColor: "#ffffff" }}>

      {/* パンくず */}
      <div style={{ backgroundColor: "#F8F8F8", padding: "8px 0" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>
          <nav style={{ fontSize: "12px", color: "#999", display: "flex", alignItems: "center", gap: "4px" }}>
            <Link href="/" style={{ color: "#999", textDecoration: "none" }}>TOP</Link>
            <ChevronRight size={12} />
            <span style={{ color: "#333" }}>物件の買い替えをお考えの方へ</span>
          </nav>
        </div>
      </div>

      {/* タイトル */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "24px 24px 0" }}>
        <h1 style={{ fontSize: "clamp(22px, 3vw, 32px)", fontWeight: "bold", color: "#1a1a1a", fontFamily: "'Noto Serif JP', serif" }}>
          物件の買い替えをお考えの方へ
        </h1>
      </div>

      {/* ヒーロー画像（フルワイド） */}
      <div style={{ position: "relative", width: "100%", height: "clamp(240px, 40vw, 460px)", overflow: "hidden", marginTop: "24px" }}>
        <Image
          src="/images/buy/trade-up/trade-uphero.jpg"
          alt="物件の買い替えをお考えの方へ"
          fill
          style={{ objectFit: "cover", objectPosition: "center" }}
          priority
          sizes="100vw"
        />
      </div>

      {/* 今が買い替えのチャンス */}
      <section style={{ padding: "56px 0 0" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>
          <p style={{ fontSize: "13px", color: "#5BAD52", fontWeight: "bold", marginBottom: "6px" }}>
            買い替えのメリット多数アリ！
          </p>
          <h2 style={{ fontSize: "clamp(20px, 3vw, 32px)", fontWeight: "bold", color: "#1a1a1a", marginBottom: "40px", fontFamily: "'Noto Serif JP', serif" }}>
            今が買い替えのチャンスです!!
          </h2>

          {/* 現在の不動産市場 */}
          <h3 style={{ fontSize: "18px", fontWeight: "bold", color: "#1a1a1a", marginBottom: "20px" }}>
            現在の不動産市場
          </h3>
          <div className="tradeup-img-grid" style={{ display: "grid", gap: "24px", marginBottom: "56px", alignItems: "start" }}>
            <div style={{ position: "relative", width: "100%", maxWidth: "220px", aspectRatio: "4/3", borderRadius: "8px", overflow: "hidden" }}>
              <Image src="/images/buy/trade-up/img01.jpg" alt="不動産市場" fill style={{ objectFit: "cover" }} sizes="220px" />
            </div>
            <p style={{ fontSize: "14px", color: "#555", lineHeight: 1.9 }}>
              2008年、米投資銀行の経営破綻に端を発し、世界的な金融危機・不況に発展しました。その後、横ばいだった日本の不動産市場は、2002年以降日本とアメリカの金利に寄り添んだ円安、それにより活性化した海外投資家の資金流入により、日本の不動産は現在に至るまで上がり続けております。都市部と郊外の二極化が叫ばれておりますが、都市部の地価は依然低堅い状態が継続しております。
            </p>
          </div>

          {/* 5つのメリット */}
          <h3 style={{ fontSize: "20px", fontWeight: "bold", color: "#1a1a1a", marginBottom: "24px", fontFamily: "'Noto Serif JP', serif" }}>
            5つのメリット
          </h3>
          <div className="tradeup-merit-grid" style={{ display: "grid", gap: "16px", marginBottom: "16px" }}>
            {merits.slice(0, 3).map((m) => (
              <div key={m.title} style={{ backgroundColor: "#F0F5F0", borderRadius: "8px", padding: "20px" }}>
                <p style={{ fontWeight: "bold", fontSize: "15px", color: "#2d5a2d", marginBottom: "4px" }}>{m.title}</p>
                {m.sub && <p style={{ fontSize: "11px", color: "#5BAD52", marginBottom: "8px" }}>{m.sub}</p>}
                <p style={{ fontSize: "12px", color: "#555", lineHeight: 1.8 }}>{m.text}</p>
              </div>
            ))}
          </div>
          <div className="tradeup-merit-grid" style={{ display: "grid", gap: "16px", marginBottom: "56px" }}>
            {merits.slice(3, 5).map((m) => (
              <div key={m.title} style={{ backgroundColor: "#F0F5F0", borderRadius: "8px", padding: "20px" }}>
                <p style={{ fontWeight: "bold", fontSize: "15px", color: "#2d5a2d", marginBottom: "4px" }}>{m.title}</p>
                {m.sub && <p style={{ fontSize: "11px", color: "#5BAD52", marginBottom: "8px" }}>{m.sub}</p>}
                <p style={{ fontSize: "12px", color: "#555", lineHeight: 1.8 }}>{m.text}</p>
              </div>
            ))}
            <div style={{ position: "relative", borderRadius: "8px", overflow: "hidden", aspectRatio: "4/3" }}>
              <Image src="/images/buy/trade-up/img02.jpg" alt="住宅イメージ" fill style={{ objectFit: "cover" }} sizes="33vw" />
            </div>
          </div>
        </div>
      </section>

      {/* 弊社のお客様実例 */}
      <section style={{ padding: "56px 0", backgroundColor: "#F8F8F8" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>
          <h2 style={{ fontSize: "clamp(18px, 2.5vw, 26px)", fontWeight: "bold", color: "#1a1a1a", marginBottom: "48px", fontFamily: "'Noto Serif JP', serif" }}>
            弊社のお客様実例
          </h2>

          {cases.map((c, ci) => (
            <div key={ci} style={{ marginBottom: ci < cases.length - 1 ? "64px" : 0 }}>
              <p style={{ fontSize: "12px", color: "#5BAD52", fontWeight: "bold", marginBottom: "4px" }}>{c.tag}</p>
              <h3 style={{ fontSize: "clamp(15px, 2vw, 19px)", fontWeight: "bold", color: "#1a1a1a", marginBottom: "4px" }}>
                {c.title}　<span style={{ fontWeight: "normal", fontSize: "13px", color: "#888" }}>{c.client}</span>
              </h3>
              <p style={{ fontSize: "13px", color: "#666", marginBottom: "24px" }}>「{c.voice}」</p>

              {/* 1. 売却物件 */}
              <p style={{ fontSize: "13px", fontWeight: "bold", color: "#666", textAlign: "center", marginBottom: "8px" }}>1．売却物件</p>
              <p style={{ fontSize: "14px", fontWeight: "bold", color: "#333", textAlign: "center", marginBottom: "16px" }}>
                {c.sell.year}年築　{c.sell.type}
              </p>
              <div style={{ backgroundColor: "white", borderRadius: "8px", padding: "20px", marginBottom: "24px", border: "1px solid #E5E5E5" }}>
                {/* 上段：物件情報 + 矢印 + 売却結果 の3カラム */}
                <div className="tradeup-case-grid" style={{ display: "grid", gap: "16px", alignItems: "center" }}>

                  {/* 物件写真 */}
                  <div style={{ position: "relative", width: "180px", aspectRatio: "4/3", borderRadius: "6px", overflow: "hidden" }}>
                    <Image src={`/images/buy/trade-up/${c.sellImg}.jpg`} alt="売却物件" fill style={{ objectFit: "cover" }} sizes="180px" />
                  </div>

                  {/* 売却前の情報 */}
                  <div>
                    <p style={{ fontWeight: "bold", fontSize: "15px", color: "#333" }}>購入価格 {c.sell.price != null ? c.sell.price.toLocaleString() : "未定"}万円</p>
                    <p style={{ fontSize: "12px", color: "#5BAD52", fontWeight: "bold", margin: "4px 0 8px" }}>専有面積 {c.sell.area}㎡（{c.sell.layout}）</p>
                    {c.sell.breakdown.map((b, i) => (
                      <p key={i} style={{ fontSize: "12px", color: "#666", lineHeight: 1.8 }}>・{b}</p>
                    ))}
                    <p style={{ fontWeight: "bold", fontSize: "14px", color: "#333", marginTop: "8px", paddingTop: "8px", borderTop: "1px solid #E5E5E5" }}>
                      合計 {c.sell.monthly}万円／月
                    </p>
                  </div>

                  {/* 矢印 + 売却バッジ */}
                  <div style={{ textAlign: "center" }}>
                    <div style={{ backgroundColor: "#5BAD52", color: "white", fontSize: "11px", fontWeight: "bold", padding: "4px 8px", borderRadius: "4px", marginBottom: "8px" }}>売却</div>
                    <div style={{ fontSize: "28px", color: "#5BAD52", lineHeight: 1 }}>→</div>
                  </div>

                  {/* 売却結果 */}
                  <div style={{ backgroundColor: "#F0F5F0", borderRadius: "8px", padding: "16px" }}>
                    <p style={{ fontSize: "12px", color: "#666", marginBottom: "6px" }}>{c.sell.soldYear}</p>
                    <p style={{ fontSize: "16px", fontWeight: "bold", color: "#2d5a2d", marginBottom: "12px" }}>
                      成約価格 {c.sell.soldPrice != null ? c.sell.soldPrice.toLocaleString() : "未定"}万円
                    </p>
                    <div style={{ borderTop: "1px dashed #ccc", paddingTop: "10px" }}>
                      <p style={{ fontSize: "11px", color: "#888", marginBottom: "4px" }}>残債返済・仲介手数料支払い後</p>
                      <p style={{ fontSize: "15px", fontWeight: "bold", color: "#2d5a2d" }}>
                        手残資金 約{c.sell.soldNet != null ? c.sell.soldNet.toLocaleString() : "未定"}万円
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. 購入物件 */}
              <p style={{ fontSize: "13px", fontWeight: "bold", color: "#666", textAlign: "center", marginBottom: "8px" }}>2．購入物件</p>
              <p style={{ fontSize: "14px", fontWeight: "bold", color: "#333", textAlign: "center", marginBottom: "16px" }}>{c.buy.title}</p>
              <div style={{ backgroundColor: "white", borderRadius: "8px", padding: "20px", marginBottom: "24px", border: "1px solid #E5E5E5" }}>
                <div className="tradeup-buy-grid" style={{ display: "grid", gap: "16px", alignItems: "start" }}>
                  <div>
                    <p style={{ fontWeight: "bold", fontSize: "15px", color: "#333" }}>価格 {c.buy.price}万円</p>
                    <p style={{ fontSize: "12px", color: "#666", margin: "4px 0" }}>土地面積 {c.buy.area}㎡</p>
                    <p style={{ fontSize: "12px", color: "#5BAD52", fontWeight: "bold", marginBottom: "8px" }}>建物面積 {c.buy.areaM2}㎡（{c.buy.layout}）</p>
                    <div style={{ backgroundColor: "#EBF7EA", borderRadius: "6px", padding: "8px 12px", display: "inline-block", marginBottom: "8px" }}>
                      <p style={{ fontSize: "11px", color: "#2d5a2d" }}>↓ {c.buy.note}</p>
                    </div>
                    <p style={{ fontSize: "13px", color: "#555" }}>ローン金額 {c.buy.loan != null ? c.buy.loan.toLocaleString() : "未定"}万円</p>
                    <p style={{ fontWeight: "bold", fontSize: "14px", color: "#333", marginTop: "4px" }}>住宅ローン返済 {c.buy.monthly}万円／月</p>
                  </div>
                  <div style={{ position: "relative", width: "100%", maxWidth: "180px", aspectRatio: "4/3", borderRadius: "6px", overflow: "hidden" }}>
                    <Image src={`/images/buy/trade-up/${c.buyImg}.jpg`} alt="購入物件" fill style={{ objectFit: "cover" }} sizes="180px" />
                  </div>
                </div>
              </div>

              {/* 3. 結果 */}
              <p style={{ fontSize: "13px", fontWeight: "bold", color: "#666", textAlign: "center", marginBottom: "16px" }}>3．結果</p>
              <div style={{ backgroundColor: "#F0F5F0", borderRadius: "8px", padding: "24px", textAlign: "center" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "16px", flexWrap: "wrap", marginBottom: "16px" }}>
                  <div style={{ border: "1px solid #ccc", borderRadius: "4px", padding: "10px 20px", backgroundColor: "white", textAlign: "center" }}>
                    <p style={{ fontSize: "11px", color: "#888", marginBottom: "2px" }}>{c.sell.year}年築{c.sell.type}</p>
                    <p style={{ fontSize: "14px", fontWeight: "bold" }}>合計 {c.result.beforeMonthly}万円／月</p>
                    <p style={{ fontSize: "11px", color: "#666" }}>{c.result.beforeArea}㎡　{c.result.beforeLayout}</p>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <p style={{ fontSize: "11px", color: "#5BAD52", fontWeight: "bold" }}>{c.result.arrowLabel}</p>
                    <div style={{ fontSize: "28px", color: "#5BAD52" }}>→</div>
                    <p style={{ fontSize: "11px", color: "#5BAD52", fontWeight: "bold" }}>広い</p>
                  </div>
                  <div style={{ border: "2px solid #5BAD52", borderRadius: "4px", padding: "10px 20px", backgroundColor: "white", textAlign: "center" }}>
                    <p style={{ fontSize: "11px", color: "#888", marginBottom: "2px" }}>{c.buy.title}</p>
                    <p style={{ fontSize: "14px", fontWeight: "bold" }}>{c.result.afterMonthly}万円／月</p>
                    <p style={{ fontSize: "11px", color: "#666" }}>{c.result.afterArea}㎡　{c.result.afterLayout}</p>
                  </div>
                </div>
                <p style={{ fontSize: "clamp(13px, 1.8vw, 16px)", fontWeight: "bold", color: "#2d5a2d", lineHeight: 1.8, whiteSpace: "pre-line" }}>
                  {c.result.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "56px 0" }}>
        <div style={{ maxWidth: "640px", margin: "0 auto", padding: "0 24px", textAlign: "center" }}>
          <h2 style={{ fontSize: "clamp(15px, 2vw, 20px)", fontWeight: "bold", color: "#1a1a1a", marginBottom: "16px", fontFamily: "'Noto Serif JP', serif" }}>
            現在のご自宅からの買い替えにメリットがあるのか、まずはお気軽にご相談を！
          </h2>
          <p style={{ fontSize: "13px", color: "#666", lineHeight: 1.9, marginBottom: "32px" }}>
            フェリアホームでは買い替えのご相談も無料で承っております。<br />
            今買い替えを考えている方、買い替えを考え始めた方、まずはお気軽にお問い合わせください。
          </p>
          <Link href="/contact" style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            padding: "16px 40px", border: "2px solid #4a8a8a",
            borderRadius: "4px", color: "#4a8a8a",
            fontWeight: "bold", fontSize: "15px", textDecoration: "none",
          }}>
            買い替えに関するご相談はこちらから
          </Link>
        </div>
      </section>

    </div>
  );
}
