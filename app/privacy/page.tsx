// app/privacy/page.tsx
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "プライバシーポリシー | フェリアホーム",
};

const SECTIONS: { title: string; content?: string; list?: string[] }[] = [
  {
    title: "1. 個人情報の収集",
    content: "当社は、お問い合わせ、会員登録、各種サービスのご利用に際して、氏名、住所、電話番号、メールアドレス等の個人情報をご提供いただく場合があります。",
  },
  {
    title: "2. 個人情報の利用目的",
    list: [
      "各種サービスの提供・運営",
      "お問い合わせへの対応",
      "新着物件・サービスに関するご案内",
      "利用規約等の変更などの通知",
    ],
  },
  {
    title: "3. 第三者への提供",
    content: "当社は、法令に基づく場合を除き、お客様の同意なく第三者に個人情報を提供することはありません。",
  },
  {
    title: "4. 個人情報の管理",
    content: "当社は、個人情報の漏洩、滅失、毀損の防止のため、適切なセキュリティ対策を実施します。",
  },
  {
    title: "5. 開示・訂正・削除",
    content: "お客様は、当社が保有する個人情報の開示・訂正・削除を請求することができます。ご連絡はお問い合わせ窓口までお願いいたします。",
  },
  {
    title: "6. お問い合わせ窓口",
    content: "個人情報に関するお問い合わせは、以下の窓口までご連絡ください。\n株式会社フェリアホーム\n〒151-0051 東京都渋谷区千駄ヶ谷4-16-7 北参道DTビル1階\nTEL: 03-5981-8601",
  },
];

export default function PrivacyPage() {
  return (
    <main style={{ backgroundColor: "#fafaf8", minHeight: "100vh", padding: "112px 24px 80px" }}>
      <div style={{ maxWidth: "760px", margin: "0 auto" }}>
        {/* ヘッダー */}
        <div style={{ marginBottom: "40px" }}>
          <p style={{ fontSize: "11px", letterSpacing: "0.3em", color: "#c9a96e", marginBottom: "8px", fontFamily: "'Noto Serif JP', serif" }}>
            PRIVACY POLICY
          </p>
          <h1 style={{ fontSize: "clamp(24px, 4vw, 36px)", fontWeight: "bold", color: "#1c1b18", margin: 0, fontFamily: "'Noto Serif JP', serif" }}>
            プライバシーポリシー
          </h1>
        </div>

        {/* コンテンツカード */}
        <div style={{ backgroundColor: "#fff", borderRadius: "16px", padding: "40px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
          <p style={{ fontSize: "14px", color: "#706e68", lineHeight: 1.9, marginBottom: "32px" }}>
            株式会社フェリアホーム（以下「当社」）は、お客様の個人情報の保護を重要な責務と考え、
            以下のプライバシーポリシーに従い適切に取り扱います。
          </p>

          {SECTIONS.map((section, i) => (
            <section key={i} style={{ marginBottom: "32px" }}>
              <h2 style={{ fontSize: "16px", fontWeight: "bold", color: "#1c1b18", margin: "0 0 12px", fontFamily: "'Noto Serif JP', serif" }}>
                {section.title}
              </h2>
              {section.content && (
                <p style={{ fontSize: "14px", color: "#706e68", lineHeight: 1.9, margin: 0, whiteSpace: "pre-line" }}>
                  {section.content}
                </p>
              )}
              {section.list && (
                <ul style={{ margin: 0, padding: "0 0 0 20px" }}>
                  {section.list.map((item, j) => (
                    <li key={j} style={{ fontSize: "14px", color: "#706e68", lineHeight: 1.9, marginBottom: "4px" }}>
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}

          <p style={{ fontSize: "12px", color: "#706e68", textAlign: "right", margin: "32px 0 0", borderTop: "1px solid #e8e6e0", paddingTop: "16px" }}>
            制定日: 2024年4月1日
          </p>
        </div>
      </div>
    </main>
  );
}
