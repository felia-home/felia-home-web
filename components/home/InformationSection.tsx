'use client'

import Link from 'next/link'

type InfoItem = {
  id: number
  date: string
  category: string
  title: string
  url: string
}

const mockInfo: InfoItem[] = [
  {
    id: 1,
    date: '2025.04.05',
    category: 'お知らせ',
    title: 'GWの営業日程についてのお知らせ',
    url: '/news/info-1'
  },
  {
    id: 2,
    date: '2025.03.28',
    category: 'お役立ち情報',
    title: '東京都内の不動産相場 最新版（2025年春）',
    url: '/news/info-2'
  },
  {
    id: 3,
    date: '2025.03.15',
    category: 'セミナー',
    title: '不動産購入セミナー開催のご案内',
    url: '/news/info-3'
  },
  {
    id: 4,
    date: '2025.03.01',
    category: 'お役立ち情報',
    title: 'マイホーム購入の頭金はいくら必要？',
    url: '/news/info-4'
  },
  {
    id: 5,
    date: '2025.02.20',
    category: 'お知らせ',
    title: '幡ヶ谷店 新スタッフ紹介',
    url: '/news/info-5'
  },
]

export default function InformationSection() {
  return (
    <section className="information-section">
      <div className="section-header">
        <p className="section-label">Information</p>
        <h2 className="section-title">お知らせ</h2>
        <Link href="/news" className="view-all-link">view more →</Link>
      </div>
      <ul className="info-list">
        {mockInfo.map((item) => (
          <li key={item.id} className="info-item">
            <Link href={item.url} className="info-link">
              <span className="info-date">{item.date}</span>
              <span className="info-category">{item.category}</span>
              <p className="info-title">{item.title}</p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
