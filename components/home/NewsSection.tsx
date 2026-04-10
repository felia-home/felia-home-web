'use client'

import Link from 'next/link'
import Image from 'next/image'

type NewsItem = {
  id: number
  title: string
  category: string
  date: string
  image?: string
  url: string
}

const mockNews: NewsItem[] = [
  {
    id: 1,
    title: '【お役立ち情報】不動産売却の流れと注意点を解説',
    category: 'お役立ち情報',
    date: '2025.04.01',
    url: '/news/1'
  },
  {
    id: 2,
    title: '城南エリアの最新市場動向レポート',
    category: 'マーケット情報',
    date: '2025.03.25',
    url: '/news/2'
  },
  {
    id: 3,
    title: '住宅ローン控除の改正ポイントまとめ',
    category: 'お役立ち情報',
    date: '2025.03.18',
    url: '/news/3'
  },
  {
    id: 4,
    title: 'フェリアホーム千駄ヶ谷本店 リニューアルオープンのお知らせ',
    category: 'お知らせ',
    date: '2025.03.10',
    url: '/news/4'
  },
]

export default function NewsSection() {
  return (
    <section className="news-section">
      <div className="section-header">
        <p className="section-label">News</p>
        <h2 className="section-title">お役立ち情報</h2>
        <Link href="/news" className="view-all-link">view more →</Link>
      </div>
      <ul className="news-list">
        {mockNews.map((item) => (
          <li key={item.id} className="news-item">
            <Link href={item.url} className="news-link">
              <div className="news-img-wrap">
                <div className="news-img-placeholder" />
              </div>
              <div className="news-content">
                <span className="news-category">{item.category}</span>
                <span className="news-date">{item.date}</span>
                <p className="news-title">{item.title}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
