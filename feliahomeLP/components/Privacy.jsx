// プライバシー・セキュリティ

function Privacy() {
  const items = [
    {
      jp: "SSL暗号化通信",
      desc: "ご登録情報はすべて256bit SSL/TLSで暗号化して送信されます。",
      icon: (
        <svg width="22" height="22" viewBox="0 0 28 28" fill="none">
          <rect x="6" y="12" width="16" height="12" rx="1" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M9 12V8a5 5 0 0 1 10 0v4" stroke="currentColor" strokeWidth="1.5"/>
          <circle cx="14" cy="18" r="1.5" fill="currentColor"/>
        </svg>
      ),
    },
    {
      jp: "情報セキュリティ",
      desc: "個人情報保護方針に基づいた厳格な管理体制を構築しています。",
      icon: (
        <svg width="22" height="22" viewBox="0 0 28 28" fill="none">
          <path d="M14 3L4 7v7c0 5.5 4 9.5 10 11 6-1.5 10-5.5 10-11V7l-10-4z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
          <path d="M10 14l3 3 5-6" stroke="currentColor" strokeWidth="1.5"/>
        </svg>
      ),
    },
    {
      jp: "第三者提供なし",
      desc: "ご同意いただかない限り、個人情報を第三者に提供することはありません。",
      icon: (
        <svg width="22" height="22" viewBox="0 0 28 28" fill="none">
          <circle cx="14" cy="14" r="10" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M7 7l14 14" stroke="currentColor" strokeWidth="1.5"/>
        </svg>
      ),
    },
    {
      jp: "いつでも退会可能",
      desc: "マイページから情報のご確認・修正・削除・退会手続きが可能です。",
      icon: (
        <svg width="22" height="22" viewBox="0 0 28 28" fill="none">
          <path d="M8 10h12M10 10v11a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V10M12 10V7a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3" stroke="currentColor" strokeWidth="1.5" fill="none"/>
        </svg>
      ),
    },
  ];

  return (
    <section className="privacy" id="privacy">
      <div className="privacy-inner">
        <div className="privacy-left">
          <div className="section-eyebrow">
            <span className="section-eyebrow-rule" />
            <span>安心・安全への取り組み</span>
          </div>
          <h2 className="section-jp-main">
            お客様の大切な情報を、<br />
            責任を持ってお預かりします。
          </h2>
          <p className="privacy-lede">
            不動産に関するお問い合わせは、個人情報のなかでも特に繊細なものです。
            フェリアホームでは、プライバシー保護とセキュリティ対策を徹底し、
            お客様に安心してご利用いただける環境を整えています。
          </p>

          <div className="privacy-quote">
            <blockquote className="privacy-quote-body">
              お客様の情報は、お客様の資産です。<br />
              私たちは、それをお預かりするだけ。
            </blockquote>
            <div className="privacy-quote-cite">
              — 株式会社フェリアホーム
            </div>
          </div>
        </div>

        <div className="privacy-right">
          <div className="privacy-grid">
            {items.map((it, i) => (
              <div className="privacy-card" key={i}>
                <div className="privacy-card-icon">{it.icon}</div>
                <div className="privacy-card-jp">{it.jp}</div>
                <div className="privacy-card-desc">{it.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

window.Privacy = Privacy;
