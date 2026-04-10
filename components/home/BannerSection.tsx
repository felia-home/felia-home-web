'use client'

import Link from 'next/link'

export default function BannerSection() {
  return (
    <div className="cta-banners">
      {/* 査定件数バナー */}
      <div className="cta-banner cta-banner--assessment">
        <div className="cta-banner-inner">
          <div className="cta-banner-left">
            <p className="cta-banner-count">
              <span>【累計査定件数】</span>
              <strong>7,050件</strong>公開中
            </p>
            <p className="cta-banner-desc">あなたの大切な不動産を適正価格で売却するためのお手伝いをします。</p>
          </div>
          <div className="cta-banner-right">
            <p className="cta-banner-label">無料査定依頼はこちら</p>
            <Link href="/contact" className="cta-banner-btn">無料査定を依頼する →</Link>
          </div>
        </div>
      </div>

      {/* 不動産買い替え */}
      <div className="cta-banner cta-banner--replacement">
        <div className="cta-banner-inner">
          <p className="cta-banner-label-lg">住宅の買い替えをお考えの方へ</p>
          <p className="cta-banner-desc">住み替えをご検討の方、まずはお気軽にご相談ください。</p>
        </div>
      </div>

      {/* FPバナー */}
      <div className="cta-banner cta-banner--fp">
        <div className="cta-banner-inner">
          <div>
            <p className="cta-banner-small">FPファイナンシャルプランナーによる</p>
            <p className="cta-banner-title">無料個別相談</p>
            <p className="cta-banner-desc">住宅ローンの借り入れ可能額、返済計画など無料でご相談いただけます。</p>
          </div>
          <Link href="/contact" className="cta-banner-btn">相談する →</Link>
        </div>
      </div>

      {/* 採用バナー */}
      <div className="cta-banner cta-banner--company">
        <div className="cta-banner-inner">
          <div>
            <p className="cta-banner-title">一緒に働きませんか？</p>
            <p className="cta-banner-desc">フェリアホームでは不動産営業スタッフを募集しています。</p>
          </div>
          <Link href="/recruit" className="cta-banner-btn-outline">採用情報を見る →</Link>
        </div>
      </div>
    </div>
  )
}
