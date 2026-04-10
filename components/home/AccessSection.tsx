export default function AccessSection() {
  return (
    <section className="access-section">
      <div className="section-header" style={{ justifyContent: 'center', paddingBottom: '8px' }}>
        <p className="section-label">Access</p>
        <h2 className="section-title">アクセス</h2>
      </div>
      <div className="access-grid">
        {/* 千駄ヶ谷本店 */}
        <div className="access-card">
          <h3 className="access-office-name">株式会社フェリアホーム 千駄ヶ谷本店</h3>
          <div className="access-info">
            <p>〒151-0051 東京都渋谷区千駄ヶ谷4-16-7 北参道DTビル1階</p>
            <p>TEL: 03-5981-8601</p>
          </div>
          <div className="access-map">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3241.0!2d139.7045!3d35.6838!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x60188ca6c5c3a4c5%3A0x9d75c11c9a6be3a4!2z5Y2D6amX44CW5Li75Yip5bmM44OT44Or4pyE5Y2D6amX5pys5bqXMeKIplNUWuODk-ODq!5e0!3m2!1sja!2sjp!4v1700000000000"
              width="100%"
              height="250"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="千駄ヶ谷本店 地図"
            />
          </div>
          <a
            href="https://maps.google.com/?q=東京都渋谷区千駄ヶ谷4-16-7"
            target="_blank"
            rel="noopener noreferrer"
            className="access-map-link"
          >
            Googleマップで確認 →
          </a>
        </div>

        {/* 幡ヶ谷店 */}
        <div className="access-card">
          <h3 className="access-office-name">株式会社フェリアホーム 幡ヶ谷店</h3>
          <div className="access-info">
            <p>〒151-0072 東京都渋谷区幡ヶ谷2-14-9</p>
            <p>TEL: 03-5352-7913</p>
          </div>
          <div className="access-map">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3241.5!2d139.6852!3d35.6780!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x60188d4c7b5a5555%3A0x1234567890abcdef!2z5qCq5byP5Lya56S-44OV44Ko44Oq44Ki44Ob44O844OA!5e0!3m2!1sja!2sjp!4v1700000000000"
              width="100%"
              height="250"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="幡ヶ谷店 地図"
            />
          </div>
          <a
            href="https://maps.google.com/?q=東京都渋谷区幡ヶ谷2-14-9"
            target="_blank"
            rel="noopener noreferrer"
            className="access-map-link"
          >
            Googleマップで確認 →
          </a>
        </div>
      </div>
    </section>
  )
}
