'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

type PropertyImage = { url: string }
type Property = {
  id: string
  title: string
  price: number
  propertyType: string
  address: string
  nearestStation?: string
  walkMinutes?: number
  description?: string
  layout?: string
  buildingArea?: number
  landArea?: number
  exclusiveArea?: number
  images?: PropertyImage[]
  slug?: string
}

const TYPE_LABEL: Record<string, string> = {
  NEW_HOUSE: '新築戸建て',
  USED_HOUSE: '中古戸建',
  MANSION: 'マンション',
  LAND: '土地',
  OTHER: 'その他',
}

export default function FeliaSelecitonSlider({ properties }: { properties: Property[] }) {
  const [page, setPage] = useState(0)
  const PER = 2
  const total = Math.ceil(properties.length / PER)
  const items = properties.slice(page * PER, page * PER + PER)

  if (properties.length === 0) {
    return <p style={{ textAlign: 'center', color: '#aaa', padding: '48px 0' }}>物件情報を準備中です</p>
  }

  return (
    <div>
      {/* ドット */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '20px' }}>
        {Array.from({ length: total }).map((_, i) => (
          <button
            key={i}
            onClick={() => setPage(i)}
            aria-label={`ページ${i + 1}`}
            style={{
              width: '10px', height: '10px', borderRadius: '50%',
              border: 'none', padding: 0, cursor: 'pointer',
              background: i === page ? '#555' : '#ccc',
              transition: 'background 0.2s',
            }}
          />
        ))}
      </div>

      {/* スライダー */}
      <div style={{ display: 'flex', alignItems: 'stretch' }}>
        <button
          onClick={() => setPage(p => (p - 1 + total) % total)}
          aria-label="前へ"
          style={{
            flexShrink: 0, width: '40px',
            background: 'rgba(0,0,0,0.3)', border: 'none', cursor: 'pointer',
            color: '#fff', fontSize: '24px', lineHeight: 1,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >‹</button>

        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          {items.map(p => {
            const img = p.images?.[0]?.url
            const type = TYPE_LABEL[p.propertyType] || p.propertyType
            const areaText = p.buildingArea
              ? `${p.layout ? p.layout + '　' : ''}建物${p.buildingArea.toFixed(2)}㎡　専有${(p.exclusiveArea || p.buildingArea).toFixed(2)}㎡`
              : p.landArea ? `土地${p.landArea.toFixed(2)}㎡` : ''
            return (
              <Link key={p.id} href={`/properties/${p.slug || p.id}`}
                style={{ display: 'block', textDecoration: 'none', color: 'inherit', background: '#fff', border: '1px solid #e0e0e0' }}>
                <div style={{ position: 'relative', aspectRatio: '4/3', background: '#efefef', overflow: 'hidden' }}>
                  {img ? (
                    <Image src={img} alt={p.title} fill style={{ objectFit: 'cover' }} sizes="50vw" />
                  ) : (
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#bbb', fontSize: '12px', gap: '8px' }}>
                      <svg width="36" height="36" viewBox="0 0 48 48" fill="none"><path d="M24 8L4 22h6v18h10V28h8v12h10V22h6L24 8z" fill="#ccc" /></svg>
                      写真準備中
                    </div>
                  )}
                  <span style={{ position: 'absolute', top: '8px', left: '8px', background: '#5BAD52', color: '#fff', fontSize: '10px', fontWeight: 'bold', padding: '3px 10px' }}>{type}</span>
                </div>
                <div style={{ padding: '14px 16px' }}>
                  <p style={{ fontSize: '22px', fontWeight: 'bold', color: '#333', marginBottom: '4px', lineHeight: 1.2 }}>{p.price.toLocaleString()}万円</p>
                  <p style={{ fontSize: '12px', color: '#555', marginBottom: '2px' }}>{p.address}</p>
                  {p.nearestStation && (
                    <p style={{ fontSize: '11px', color: '#888', marginBottom: '8px' }}>{p.nearestStation}{p.walkMinutes ? ` 徒歩${p.walkMinutes}分` : ''}</p>
                  )}
                  {p.description && (
                    <p style={{ fontSize: '11px', color: '#555', lineHeight: 1.6, marginBottom: '8px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{p.description}</p>
                  )}
                  {areaText && (
                    <p style={{ fontSize: '11px', color: '#999', paddingTop: '8px', borderTop: '1px solid #eee' }}>{areaText}</p>
                  )}
                </div>
              </Link>
            )
          })}
          {items.length < PER && <div />}
        </div>

        <button
          onClick={() => setPage(p => (p + 1) % total)}
          aria-label="次へ"
          style={{
            flexShrink: 0, width: '40px',
            background: 'rgba(0,0,0,0.3)', border: 'none', cursor: 'pointer',
            color: '#fff', fontSize: '24px', lineHeight: 1,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >›</button>
      </div>
    </div>
  )
}
