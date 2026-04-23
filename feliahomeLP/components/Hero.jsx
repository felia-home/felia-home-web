// Hero

function Hero({ onCtaClick }) {
  return (
    <section className="hero">
      <div className="hero-grid">
        <div className="hero-left">
          <div className="hero-meta">
            <span className="hero-meta-dot" />
            <span>現在の未公開物件数　8,111件 公開中</span>
          </div>

          <h1 className="hero-title">
            市場に出る前の物件情報を、<br />
            会員様へ。
          </h1>

          <p className="hero-lede">
            Feliahome Private Selection は、REINSやSUUMOなどの不動産流通サイトに掲載されない、
            弊社限定の未公開物件情報を会員様限定で公開するサービスです。
            都心の厳選された土地・戸建・マンションを、いち早く、会員様だけに。
          </p>

          <div className="hero-cta-row">
            <button className="btn-primary btn-primary--lg" onClick={onCtaClick}>
              <span>無料会員登録はこちら</span>
              <span className="btn-primary-arrow">→</span>
            </button>
            <div className="hero-cta-note">
              <span className="dot" />登録は60秒・完全無料
            </div>
          </div>
        </div>

        <div className="hero-right">
          <div className="hero-image-main">
            <img
              src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1000&q=80"
              alt="都心の高級邸宅"
              className="hero-photo"
            />
            <div className="hero-image-tag">
              <span className="hero-image-tag-num">01</span>
              <div>
                <div className="hero-image-tag-label">Private Selection</div>
                <div className="hero-image-tag-value">会員様限定公開</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="hero-stats">
        <div className="hero-stat">
          <div className="hero-stat-num">8,111<span className="hero-stat-unit">件</span></div>
          <div className="hero-stat-label">現在の未公開物件数</div>
        </div>
        <div className="hero-stat">
          <div className="hero-stat-num">60<span className="hero-stat-unit">秒</span></div>
          <div className="hero-stat-label">登録完了までの目安</div>
        </div>
        <div className="hero-stat">
          <div className="hero-stat-num">0<span className="hero-stat-unit">円</span></div>
          <div className="hero-stat-label">登録・月額ともに無料</div>
        </div>
        <div className="hero-stat">
          <div className="hero-stat-num">15<span className="hero-stat-unit">区+</span></div>
          <div className="hero-stat-label">都心・城南・城西対応</div>
        </div>
      </div>
    </section>
  );
}

window.Hero = Hero;
