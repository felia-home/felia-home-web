// 会員特典 4つ

function Benefits() {
  const items = [
    {
      num: "01",
      jp: "未公開物件情報の閲覧",
      desc: "弊社限定の未公開物件情報をマイページでご覧いただけます。REINSやSUUMOなど一般の不動産流通サイトには掲載されない、貴重な情報をいち早くお届けします。物件資料のご請求もオンラインで簡単に。",
      tags: ["未公開物件", "資料請求", "限定情報"],
      img: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80",
    },
    {
      num: "02",
      jp: "物件のお気に入り保存",
      desc: "気になる物件をマイページに保存して、いつでも見返せます。価格の改定や新しい資料が追加された際には通知でお知らせ。ご家族と共有したり、複数物件の比較検討にもご活用いただけます。",
      tags: ["保存", "比較検討", "更新通知"],
      img: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800&q=80",
    },
    {
      num: "03",
      jp: "検索条件保存・マッチングメール",
      desc: "ご希望エリア・価格帯・広さ・築年数などの検索条件を保存。条件に合致した物件が入荷したタイミングで、担当者からのコメント付きでメールにてお知らせします。お探しの物件を見逃しません。",
      tags: ["条件保存", "自動通知", "担当者コメント"],
      img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
    },
    {
      num: "04",
      jp: "希望エリアのマーケット情報",
      desc: "ご希望エリアの取引相場・新規入荷動向・住環境や税制に関するトピックスを、月次レポートでお届けします。ご購入・ご売却のご判断材料として、お役立ていただけます。",
      tags: ["相場レポート", "月次配信", "エリア情報"],
      img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80",
    },
  ];

  return (
    <section className="benefits" id="benefits">
      <div className="benefits-inner">
        <div className="benefits-header">
          <div className="section-eyebrow">
            <span className="section-eyebrow-rule" />
            <span>無料会員登録の4つのメリット</span>
            <span className="section-eyebrow-rule" />
          </div>
          <h2 className="section-jp-main">
            会員様だけの、4つの特典
          </h2>
          <div className="benefits-intro">
            登録は無料。いつでも退会可能です。<br />
            都心の不動産をご検討の方に必要な機能を、すべてご用意しました。
          </div>
        </div>

        <div className="benefits-list">
          {items.map((item, i) => (
            <article className="benefit-row" key={i}>
              <div className="benefit-num-col">
                <div className="benefit-num">{item.num}</div>
                <div className="benefit-num-rule" />
              </div>
              <div className="benefit-text-col">
                <h3 className="benefit-jp">{item.jp}</h3>
                <p className="benefit-desc">{item.desc}</p>
                <div className="benefit-tags">
                  {item.tags.map((t, j) => (
                    <span className="benefit-tag" key={j}>{t}</span>
                  ))}
                </div>
              </div>
              <div className="benefit-media-col">
                <div className="benefit-media-wrap">
                  <img src={item.img} alt={item.jp} className="benefit-photo" />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

window.Benefits = Benefits;
