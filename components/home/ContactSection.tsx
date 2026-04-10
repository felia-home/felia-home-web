import Link from 'next/link'

export default function ContactSection() {
  return (
    <section className="contact-section">
      <div className="contact-inner">
        <div className="contact-text">
          <p className="contact-label">Contact</p>
          <h2 className="contact-title">お問合せ</h2>
          <p className="contact-desc">
            不動産のご購入・売却など、お気軽にご相談ください。
          </p>
          <Link href="/contact" className="contact-btn">
            お問合せはこちら →
          </Link>
        </div>
        {/* 優良店認定バナー */}
        <div className="yuryo-badge">
          <div className="yuryo-badge-inner">
            <span className="yuryo-icon">優良</span>
            <div className="yuryo-text">
              <p className="yuryo-title">優良店認定</p>
              <p className="yuryo-sub">不動産会社</p>
              <p className="yuryo-note">東京都知事（3）第93180号</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
