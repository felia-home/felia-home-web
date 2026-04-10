'use client'

import Link from 'next/link'

type OpenHouseItem = {
  id: number
  date: string
  period: string
  title: string
  price: string
  area: string
  station: string
  url: string
}

const mockOpenHouse: OpenHouseItem[] = [
  {
    id: 1,
    date: '2025年05月03日（土）〜 2025年05月04日（日）',
    period: '10:00〜17:00',
    title: '新築戸建て',
    price: '13,499万円',
    area: '世田谷区代田１丁目',
    station: '梅ヶ丘駅 徒歩9分',
    url: '/openhouse/1'
  },
]

export default function OpenHouseSection() {
  return (
    <section className="openhouse-section">
      <div className="section-header">
        <p className="section-label">Open House</p>
        <h2 className="section-title">オープンハウス</h2>
        <Link href="/openhouse" className="view-all-link">view more →</Link>
      </div>
      {mockOpenHouse.length > 0 ? (
        <div className="openhouse-list">
          {mockOpenHouse.map((item) => (
            <Link key={item.id} href={item.url} className="openhouse-item">
              <div className="openhouse-date-badge">
                <span>開催日時</span>
                <strong>{item.date}</strong>
                <span>{item.period}</span>
              </div>
              <div className="openhouse-detail">
                <p className="openhouse-type">{item.title}</p>
                <p className="openhouse-price">{item.price}</p>
                <p className="openhouse-location">{item.area} {item.station}</p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="no-data">現在開催中のオープンハウスはありません</p>
      )}
    </section>
  )
}
