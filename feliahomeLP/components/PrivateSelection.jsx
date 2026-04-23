// 未公開物件の紹介

function PrivateSelection() {
  const listings = [
    { tag: "マンション", area: "港区 元麻布", type: "低層レジデンス", size: "142.5m²", price: "4.80億円", note: "竣工前・市場公開前", img: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80" },
    { tag: "戸建て", area: "渋谷区 松濤", type: "邸宅", size: "385.2m²", price: "12.5億円", note: "売主様ご意向", img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80" },
    { tag: "マンション", area: "千代田区 番町", type: "ハイフロア", size: "98.4m²", price: "3.20億円", note: "関係者限定", img: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80" },
    { tag: "土地", area: "目黒区 青葉台", type: "整形地", size: "248.0m²", price: "6.80億円", note: "非公開", img: "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?auto=format&fit=crop&w=800&q=80" },
  ];

  return (
    <section className="selection" id="selection">
      <div className="selection-inner">
        <div className="selection-header">
          <div className="section-eyebrow">
            <span className="section-eyebrow-rule" />
            <span>フェリアホーム限定・未公開物件</span>
            <span className="section-eyebrow-rule" />
          </div>
          <h2 className="section-jp-main">
            Feliahome <em>Private Selection</em>
          </h2>
          <div className="selection-intro">
            <p>
              REINS（不動産流通標準情報システム）や SUUMO などのポータルサイトに
              掲載される前の、あるいは最初から一般公開されない
              弊社限定の物件情報を、会員様限定で公開しています。
            </p>
          </div>
        </div>

        <div className="selection-listings">
          <div className="listings-label-row">
            <span className="listings-label">現在公開中の未公開物件（一部抜粋）</span>
            <span className="listings-label-rule" />
            <span className="listings-label-count">全8,111件</span>
          </div>

          <div className="listings-grid">
            {listings.map((l, i) => (
              <article className="listing-card" key={i}>
                <div className="listing-media">
                  <img src={l.img} alt={l.area} className="listing-photo" />
                  <div className="listing-lock">
                    <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
                      <rect x="3" y="7" width="10" height="7" rx="1" stroke="currentColor" strokeWidth="1.2"/>
                      <path d="M5 7V5a3 3 0 0 1 6 0v2" stroke="currentColor" strokeWidth="1.2" fill="none"/>
                    </svg>
                    <span>会員様限定</span>
                  </div>
                </div>
                <div className="listing-body">
                  <div className="listing-tag-row">
                    <span className="listing-tag">{l.tag}</span>
                    <span className="listing-note">{l.note}</span>
                  </div>
                  <div className="listing-area">{l.area}</div>
                  <div className="listing-meta-row">
                    <div className="listing-meta">
                      <span className="listing-meta-label">種別</span>
                      <span className="listing-meta-value">{l.type}</span>
                    </div>
                    <div className="listing-meta">
                      <span className="listing-meta-label">広さ</span>
                      <span className="listing-meta-value">{l.size}</span>
                    </div>
                    <div className="listing-meta">
                      <span className="listing-meta-label">価格</span>
                      <span className="listing-meta-value listing-meta-value--price">{l.price}</span>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="listings-gate">
            <div className="listings-gate-jp-main">
              他 <em>8,107件</em> の未公開物件を公開中
            </div>
            <div className="listings-gate-jp">
              無料会員登録で全ての詳細情報の閲覧・資料請求が可能になります
            </div>
            <a href="#register" className="listings-gate-btn">
              無料会員登録はこちら →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

window.PrivateSelection = PrivateSelection;
