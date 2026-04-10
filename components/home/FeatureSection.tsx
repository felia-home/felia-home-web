'use client'

import Link from 'next/link'

type FeatureItem = {
  id: number
  title: string
  subtitle: string
  label: string
  url: string
}

const features: FeatureItem[] = [
  {
    id: 1,
    title: '定期借地権付き物件特集',
    subtitle: '定期借地権について',
    label: '特集',
    url: '/feature/shakuchi'
  },
  {
    id: 2,
    title: '家族暮らしに最適物件特集',
    subtitle: '家族暮らし定番物件特集',
    label: '特集',
    url: '/feature/family'
  },
  {
    id: 3,
    title: '3000万円台物件特集',
    subtitle: '3000万円台物件特集',
    label: '特集',
    url: '/feature/3000'
  },
]

export default function FeatureSection() {
  return (
    <section className="feature-section">
      <div className="section-header">
        <p className="section-label">Feature</p>
        <h2 className="section-title">特集</h2>
      </div>
      <div className="feature-grid">
        {features.map((item) => (
          <Link key={item.id} href={item.url} className="feature-card">
            <div className="feature-img-wrap">
              <div className="feature-img-placeholder" />
              <span className="feature-label">{item.label}</span>
            </div>
            <div className="feature-text">
              <p className="feature-subtitle">{item.subtitle}</p>
              <h3 className="feature-title">{item.title}</h3>
              <span className="feature-link-text">view more →</span>
            </div>
          </Link>
        ))}
      </div>

      {/* 不動産について 01/02 */}
      <div className="about-real-estate">
        <Link href="/service" className="about-card about-card--purchase">
          <div className="about-card-inner">
            <span className="about-num">01</span>
            <div className="about-text">
              <p className="about-label">不動産を購入する</p>
              <p className="about-desc">フェリアホームが厳選した物件をご紹介。<br />ご購入からお引渡しまで丁寧にサポートいたします。</p>
              <span className="about-link">view more →</span>
            </div>
          </div>
        </Link>
        <Link href="/contact" className="about-card about-card--sale">
          <div className="about-card-inner">
            <span className="about-num">02</span>
            <div className="about-text">
              <p className="about-label">不動産を売却する</p>
              <p className="about-desc">地域密着の実績で、適正価格での売却をサポート。<br />まずは無料査定をお試しください。</p>
              <span className="about-link">view more →</span>
            </div>
          </div>
        </Link>
      </div>

      {/* お客様の声 / 資金計画相談 バナー */}
      <div className="voice-plan-banners">
        <Link href="/voice" className="banner-card banner-card--voice">
          <div className="banner-card-inner">
            <p className="banner-card-title">Customer Voice</p>
            <p className="banner-card-sub">お客様の声</p>
          </div>
        </Link>
        <Link href="/fp" className="banner-card banner-card--plan">
          <div className="banner-card-inner">
            <p className="banner-card-title">Plan Consultation</p>
            <p className="banner-card-sub">資金計画相談</p>
          </div>
        </Link>
      </div>
    </section>
  )
}
