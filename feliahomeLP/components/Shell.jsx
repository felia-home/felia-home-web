// Shell components

const { useState, useEffect, useRef } = React;

function PhotoPlaceholder({ label, aspect = "4 / 5", tone = "warm", children, style }) {
  const bg = tone === "dark"
    ? "linear-gradient(135deg, #2a2a2a 0%, #3a3a3a 50%, #1f1f1f 100%)"
    : tone === "green"
    ? "linear-gradient(135deg, #3e7561 0%, #2d5e4a 50%, #1f4434 100%)"
    : "linear-gradient(135deg, #d9d3c3 0%, #c4bda8 50%, #a89f87 100%)";
  const fg = tone === "warm" ? "rgba(26,26,26,0.55)" : "rgba(255,255,255,0.75)";
  return (
    <div className="photo-placeholder" style={{ aspectRatio: aspect, background: bg, ...style }}>
      <div className="photo-stripes" />
      <div className="photo-label" style={{ color: fg }}>
        <span className="photo-label-mono">{label}</span>
        {children}
      </div>
    </div>
  );
}

function TopNav({ onCtaClick }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={"topnav" + (scrolled ? " topnav--scrolled" : "")}>
      <div className="topnav-inner">
        <a href="#" className="brandmark" aria-label="フェリアホーム">
          <span className="brandmark-mark">F</span>
          <span className="brandmark-name">フェリアホーム</span>
        </a>
        <div className="nav-links">
          <a href="#selection">未公開物件</a>
          <a href="#benefits">会員特典</a>
          <a href="#privacy">安心・安全</a>
          <a href="#register">会員登録</a>
        </div>
        <div className="nav-cta-wrap">
          <a href="#" className="nav-login">ログイン</a>
          <button className="nav-cta" onClick={onCtaClick}>
            <span>無料会員登録</span>
            <span className="nav-cta-arrow">→</span>
          </button>
        </div>
      </div>
    </nav>
  );
}

function SectionHeading({ eyebrow, title, sub, align = "left" }) {
  return (
    <div className={"section-heading section-heading--" + align}>
      <div className="section-eyebrow">
        <span className="section-eyebrow-rule" />
        <span className="section-eyebrow-text">{eyebrow}</span>
      </div>
      <h2 className="section-jp-main">{title}</h2>
      {sub && <div className="section-jp-sub">{sub}</div>}
    </div>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-top">
        <div className="footer-brand">
          <div className="footer-brand-name">株式会社フェリアホーム</div>
          <div className="footer-brand-jp">
            東京都心・城南・城西エリアの不動産<br />
            土地・戸建・マンションの売買をお任せください。
          </div>
        </div>
        <div className="footer-cols">
          <div className="footer-col">
            <div className="footer-col-title">物件情報</div>
            <a href="#">未公開物件</a>
            <a href="#">厳選物件</a>
            <a href="#">新着物件</a>
            <a href="#">現地販売会</a>
          </div>
          <div className="footer-col">
            <div className="footer-col-title">サービス</div>
            <a href="#">不動産購入</a>
            <a href="#">不動産売却</a>
            <a href="#">売却査定</a>
            <a href="#">無料FPサービス</a>
          </div>
          <div className="footer-col">
            <div className="footer-col-title">会社情報</div>
            <a href="#">会社概要</a>
            <a href="#">プライバシーポリシー</a>
            <a href="#">利用規約</a>
            <a href="#">お問い合わせ</a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="footer-copy">Copyright© Felia home Co.,Ltd All Right Reserved.</div>
        <div className="footer-meta">会員登録ページ</div>
      </div>
    </footer>
  );
}

Object.assign(window, { PhotoPlaceholder, TopNav, SectionHeading, Footer });
