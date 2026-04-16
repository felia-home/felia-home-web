// app/faq/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, MessageCircle } from "lucide-react";
import { FaqAccordion } from "@/components/faq/FaqAccordion";

export const metadata: Metadata = {
  title: "よくある質問",
  description: "フェリアホームへのよくあるご質問をまとめました。売却活動・物件見学・来店についてお気軽にご相談ください。",
};

const FAQ_GROUPS = [
  {
    category: "売却活動について",
    items: [
      {
        q: "媒介契約はどのような契約になりますか？",
        a: "媒介契約は、専属専任媒介契約・専任媒介契約・一般媒介契約の三種類になります。どの契約を交わすかは売主様の状況によって変わりますのでご相談ください。",
      },
      {
        q: "住みながら売却活動はできる？",
        a: "可能になります。実際に住みながら売却される方が多くいらっしゃいます。購入希望者が見学に来られた際にはご協力ください。",
      },
      {
        q: "折込チラシやインターネットへの掲載など費用の負担はあるの？",
        a: "売主様が広告費を負担することはありません。基本的に買主様を探すための費用は当社にて負担します。",
      },
      {
        q: "近所に家を売却することを知られたくありません。それは可能？",
        a: "可能です。当社独自のネットワークで買主様をお探しします。また、広告活動も売主様と相談の上進めることが可能です。また、インターネット広告は興味のあるユーザーにしか目に触れない広告なためおすすめしています。",
      },
      {
        q: "家のカギは預けたほうがいいのでしょうか？",
        a: "住みながら売却する場合は必要ありません。すでに退去済みで空き家の場合は預けて頂いたほうが良いです。",
      },
      {
        q: "購入希望者が突然来ることはありますか？",
        a: "購入希望者が突然来ることはありません。事前に売主様へ予定を連絡させて頂いた上で訪問します。",
      },
      {
        q: "購入希望の方が来る前にやっておくことは？",
        a: "できる限りきれいに掃除をすることが大事です。特に玄関はきれいに掃除してください。その他にも目に見えるほこりはふき取ってください。また、部屋の照明はすべてつけて明るい印象にしましょう。窓を開けて部屋を換気してください。",
      },
    ],
  },
  {
    category: "物件見学・来店について",
    items: [
      {
        q: "店舗に行かなくても物件は見れますか？",
        a: "店舗にお越しいただかなくても物件へのご案内はおこなっております。\n\n見たい物件の最寄り駅にてお待ち合わせや、物件現地でのお待ち合わせなど、お客様のご都合に合わせて、物件のご案内をさせていただいております。\n\n赤ちゃんや小さなお子様が居て、物件の最寄り駅までの移動が困難な場合などは、お客様のご自宅までお迎えにあがり、物件のご案内もおこなっております。\n\nまずはお気軽にご相談ください。",
      },
      {
        q: "小さな子供を連れて行っても大丈夫ですか？",
        a: "もちろん大丈夫です。小さなお子様連れのお客様も気兼ねなくご来店ください。\n弊社内にキッズスペースがございます、退屈しやすいお子様が退屈しないよう、お子様用DVDやおもちゃをご用意しております。",
      },
      {
        q: "見たいと思った物件はすぐに見れますか？",
        a: "物件の種別によって異なります。\n居住中のマンションや戸建の場合、内覧の手配と取る必要があるため、当日すぐに内覧をする事が難しい場合もございます。\n空室や空家、土地などであれば、当日すぐのご案内が可能な場合もあります。\n見たいと思う物件が見つかりましたら、まずは一度ご連絡いただけると幸いです。",
      },
    ],
  },
];

export default function FaqPage() {
  return (
    <div style={{ backgroundColor: "#ffffff" }}>

      {/* パンくず */}
      <div style={{ backgroundColor: "#F8F8F8", padding: "8px 0" }}>
        <div className="container-content">
          <nav style={{ fontSize: "12px", color: "#999", display: "flex", alignItems: "center", gap: "4px" }}>
            <Link href="/" style={{ color: "#999", textDecoration: "none" }}>TOP</Link>
            <ChevronRight size={12} />
            <span style={{ color: "#333" }}>よくある質問</span>
          </nav>
        </div>
      </div>

      {/* ヘッダー */}
      <div style={{ backgroundColor: "#F0F5F0", padding: "48px 0 40px" }}>
        <div className="container-content" style={{ textAlign: "center" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            width: "56px", height: "56px", borderRadius: "50%",
            backgroundColor: "#5BAD52", marginBottom: "16px",
          }}>
            <MessageCircle size={28} style={{ color: "white" }} />
          </div>
          <h1 style={{
            fontSize: "clamp(24px, 3vw, 36px)",
            fontWeight: "bold",
            color: "#1a1a1a",
            fontFamily: "'Noto Serif JP', serif",
            marginBottom: "12px",
          }}>
            よくある質問
          </h1>
          <p style={{ fontSize: "14px", color: "#666" }}>
            お客様からよくいただくご質問をまとめました。
          </p>
        </div>
      </div>

      {/* FAQ本文 */}
      <section style={{ padding: "56px 0 80px" }}>
        <div className="container-content" style={{ maxWidth: "800px", margin: "0 auto" }}>
          <FaqAccordion groups={FAQ_GROUPS} />
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "48px 0", backgroundColor: "#F0F5F0" }}>
        <div className="container-content" style={{ textAlign: "center" }}>
          <p style={{ fontSize: "15px", fontWeight: "bold", color: "#1a1a1a", marginBottom: "8px" }}>
            解決しない場合はお気軽にご相談ください
          </p>
          <p style={{ fontSize: "13px", color: "#666", marginBottom: "24px" }}>
            お電話・メールフォームよりお問い合わせいただけます
          </p>
          <Link
            href="/contact"
            style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              padding: "14px 40px", borderRadius: "8px",
              backgroundColor: "#5BAD52", color: "white",
              fontWeight: "bold", fontSize: "15px", textDecoration: "none",
            }}
          >
            お問い合わせはこちら
          </Link>
        </div>
      </section>

    </div>
  );
}
