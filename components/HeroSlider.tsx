'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'

const SLIDES = [
  {
    img: '/images/hero/kv_felia-selection.jpg',
    en: 'Felia Selection',
    ja: '厳選物件情報',
    sub: 'フェリアホームが厳選してオススメする最優良物件をご紹介',
    link: '/properties',
  },
  {
    img: '/images/hero/kv_replacement.jpg',
    en: 'Replacement',
    ja: '買い替えについて',
    sub: '物件の買い替えをお考えの方へ',
    link: '/replacement',
  },
]

export default function HeroSlider() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(c => (c + 1) % SLIDES.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div style={{ position: 'relative', width: '100%', overflow: 'hidden', backgroundColor: '#e8f0e8' }}>
      {SLIDES.map((slide, i) => (
        <div
          key={i}
          style={{
            position: i === 0 ? 'relative' : 'absolute',
            inset: 0,
            opacity: i === current ? 1 : 0,
            transition: 'opacity 1s ease',
            zIndex: i === current ? 1 : 0,
          }}
        >
          <Image
            src={slide.img}
            alt={slide.ja}
            width={1200}
            height={580}
            priority={i === 0}
            style={{ width: '100%', height: 'auto', display: 'block' }}
          />
          {/* テキストオーバーレイ */}
          <div style={{
            position: 'absolute',
            bottom: '80px',
            left: '32px',
            right: '260px',
            zIndex: 10,
          }}>
            <p style={{
              fontSize: '13px',
              color: '#fff',
              letterSpacing: '0.15em',
              marginBottom: '6px',
              textShadow: '0 1px 4px rgba(0,0,0,0.5)',
              fontWeight: '400',
            }}>
              {slide.ja}　{slide.sub}
            </p>
            <p style={{
              fontFamily: '"Dancing Script", "Times New Roman", serif',
              fontSize: 'clamp(32px, 4.5vw, 60px)',
              color: '#fff',
              lineHeight: 1.1,
              textShadow: '0 2px 8px rgba(0,0,0,0.3)',
              fontStyle: 'italic',
            }}>
              {slide.en}
            </p>
          </div>
          {/* view more */}
          <Link href={slide.link} style={{
            position: 'absolute',
            bottom: '24px',
            right: '260px',
            color: '#fff',
            fontSize: '13px',
            fontStyle: 'italic',
            textDecoration: 'none',
            letterSpacing: '0.1em',
            zIndex: 10,
            textShadow: '0 1px 3px rgba(0,0,0,0.4)',
          }}>
            view more ▶
          </Link>
        </div>
      ))}

      {/* スライドドット */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: '8px',
        zIndex: 20,
      }}>
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            aria-label={`スライド${i + 1}`}
            style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
              background: i === current ? '#fff' : 'rgba(255,255,255,0.4)',
              transition: 'background 0.3s',
            }}
          />
        ))}
      </div>

      {/* 右下: 会員登録パネル */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        right: 0,
        zIndex: 20,
        width: '220px',
        background: '#193e48',
        padding: '18px 20px 16px',
        textAlign: 'center',
      }}>
        <p style={{
          color: '#c9a84c',
          fontSize: '11px',
          letterSpacing: '0.25em',
          marginBottom: '6px',
        }}>
          無 料 会 員 登 録
        </p>
        <p style={{
          color: '#fff',
          fontSize: '9px',
          fontStyle: 'italic',
          marginBottom: '6px',
          letterSpacing: '0.05em',
        }}>
          Sign up to become a member
        </p>
        <p style={{
          color: 'rgba(255,255,255,0.8)',
          fontSize: '10px',
          lineHeight: 1.7,
          marginBottom: '10px',
        }}>
          未公開物件６，０００件以上公開中<br />
          豊富な情報を取り揃えております
        </p>
        <Link href="/membership" style={{
          display: 'block',
          border: '1px solid rgba(255,255,255,0.4)',
          color: '#fff',
          fontSize: '10px',
          padding: '8px 4px',
          textDecoration: 'none',
          letterSpacing: '0.15em',
        }}>
          登 録 は こ ち ら か ら ▶
        </Link>
        <p style={{
          color: 'rgba(255,255,255,0.3)',
          fontSize: '9px',
          marginTop: '8px',
          textAlign: 'right',
        }}>
          fh felia home
        </p>
      </div>
    </div>
  )
}
