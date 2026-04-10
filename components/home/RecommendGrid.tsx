'use client'

import Link from 'next/link'

const AREAS = [
  { name: '渋谷区',   city: '渋谷区' },
  { name: '新宿区',   city: '新宿区' },
  { name: '杉並区',   city: '杉並区' },
  { name: '世田谷区', city: '世田谷区' },
  { name: '文京区',   city: '文京区' },
  { name: '豊島区',   city: '豊島区' },
  { name: '中野区',   city: '中野区' },
  { name: '目黒区',   city: '目黒区' },
  { name: '北区',     city: '北区' },
  { name: '板橋区',   city: '板橋区' },
  { name: '練馬区',   city: '練馬区' },
  { name: '品川区',   city: '品川区' },
  { name: '港区',     city: '港区' },
  { name: '大田区',   city: '大田区' },
  { name: '千代田区', city: '千代田区' },
  { name: '中央区',   city: '中央区' },
  { name: 'その他',   city: '' },
]

// エリアごとの背景色（元サイト準拠の緑系グラデーション）
const COLORS = [
  '#2d5a3d', '#3a6b4a', '#193e48', '#4a7a5a', '#2a4a38',
  '#355c45', '#1e4d3a', '#446655', '#2b5040', '#3d6050',
  '#264838', '#4a6858', '#1f4535', '#3b5a4a', '#294030',
  '#3a5548', '#5b6b5b',
]

export default function RecommendGrid() {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: '8px',
    }}>
      {AREAS.map((area, i) => (
        <Link
          key={area.name}
          href={area.city ? `/properties?city=${encodeURIComponent(area.city)}` : '/properties'}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            aspectRatio: '4/3',
            background: COLORS[i % COLORS.length],
            color: '#fff',
            textDecoration: 'none',
            fontSize: '16px',
            fontWeight: 'bold',
            letterSpacing: '0.1em',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <span style={{
            position: 'relative',
            zIndex: 1,
            textShadow: '0 1px 4px rgba(0,0,0,0.3)',
          }}>
            {area.name}
          </span>
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(0,0,0,0.1) 100%)',
          }} />
        </Link>
      ))}
    </div>
  )
}
