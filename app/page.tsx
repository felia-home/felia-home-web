import Link from 'next/link'
import Image from 'next/image'
import HeroSlider from '@/components/HeroSlider'
import FeliaSelecitonSlider from '@/components/home/FeliaSelecitonSlider'
import RecommendGrid from '@/components/home/RecommendGrid'

export const dynamic = 'force-dynamic'

// ======= 型定義 =======
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

// ======= 定数 =======
const ADMIN_API = process.env.ADMIN_API_URL || 'http://localhost:3001'

const TYPE_LABEL: Record<string, string> = {
  NEW_HOUSE: '新築戸建て',
  USED_HOUSE: '中古戸建',
  MANSION: 'マンション',
  LAND: '土地',
  OTHER: 'その他',
}

const MOCK_NEWS = [
  { id: 1, cat: 'お役立ち情報', date: '2025.04.01', title: '不動産売却の流れと注意点を解説', url: '/news/1' },
  { id: 2, cat: 'マーケット情報', date: '2025.03.25', title: '城南エリアの最新市場動向レポート', url: '/news/2' },
  { id: 3, cat: 'お役立ち情報', date: '2025.03.18', title: '住宅ローン控除の改正ポイントまとめ', url: '/news/3' },
  { id: 4, cat: 'お知らせ', date: '2025.03.10', title: 'フェリアホーム千駄ヶ谷本店 リニューアルのお知らせ', url: '/news/4' },
]

const MOCK_INFO = [
  { id: 1, date: '2025.04.05', cat: 'お知らせ', title: 'GWの営業日程についてのお知らせ', url: '/news/info-1' },
  { id: 2, date: '2025.03.28', cat: 'お役立ち', title: '東京都内の不動産相場 最新版（2025年春）', url: '/news/info-2' },
  { id: 3, date: '2025.03.15', cat: 'セミナー', title: '不動産購入セミナー開催のご案内', url: '/news/info-3' },
  { id: 4, date: '2025.03.01', cat: 'お役立ち', title: 'マイホーム購入の頭金はいくら必要？', url: '/news/info-4' },
  { id: 5, date: '2025.02.20', cat: 'お知らせ', title: '幡ヶ谷店 新スタッフ紹介', url: '/news/info-5' },
]

// ======= データ取得 =======
async function getProperties(limit: number): Promise<Property[]> {
  try {
    const res = await fetch(
      `${ADMIN_API}/api/properties?status=PUBLISHED&limit=${limit}`,
      { cache: 'no-store' }
    )
    if (!res.ok) return []
    const data = await res.json()
    const items: Property[] = Array.isArray(data) ? data : (data.properties || [])
    return items.slice(0, limit)
  } catch {
    return []
  }
}

// ======= 共通: セクション見出し =======
function SectionHead({
  en, ja, link, linkText, light = false,
}: {
  en: string
  ja: string
  link?: string
  linkText?: string
  light?: boolean
}) {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      marginBottom: '24px',
    }}>
      <div>
        <p style={{
          fontSize: '13px',
          fontStyle: 'italic',
          color: light ? 'rgba(255,255,255,0.85)' : '#555',
          marginBottom: '3px',
          letterSpacing: '0.05em',
        }}>
          {en}
        </p>
        <p style={{
          fontSize: '12px',
          color: light ? 'rgba(255,255,255,0.55)' : '#999',
          letterSpacing: '0.1em',
        }}>
          {ja}
        </p>
      </div>
      {link && (
        <Link href={link} style={{
          fontSize: '11px',
          color: light ? 'rgba(255,255,255,0.7)' : '#888',
          fontStyle: 'italic',
          textDecoration: 'none',
          letterSpacing: '0.05em',
        }}>
          {linkText || 'view more →'}
        </Link>
      )}
    </div>
  )
}

// ======= ページ本体 =======
export default async function HomePage() {
  const [selectionProps, latestProps] = await Promise.all([
    getProperties(20),
    getProperties(8),
  ])

  return (
    <main>

      {/* ============================================================
          ① ヒーロースライダー（2スライド）
      ============================================================ */}
      <HeroSlider />


      {/* ============================================================
          ② Felia Selection — 2件スライダー
          背景: #f6f6f6, padding 48px 0
      ============================================================ */}
      <section style={{ background: '#f6f6f6', padding: '48px 0' }}>
        <div style={{ maxWidth: '1140px', margin: '0 auto', padding: '0 24px' }}>
          <SectionHead
            en="Felia Selection"
            ja="厳選物件情報"
            link="/properties"
            linkText="厳選物件一覧はこちら →"
          />
          <FeliaSelecitonSlider properties={selectionProps} />
        </div>
      </section>


      {/* ============================================================
          ③ Recommend — エリア別おすすめ（画像グリッド）
          背景: #fff, padding 56px 0
      ============================================================ */}
      <section style={{ background: '#fff', padding: '56px 0' }}>
        <div style={{ maxWidth: '1140px', margin: '0 auto', padding: '0 24px' }}>
          <SectionHead en="Recommend" ja="エリア別おすすめ物件" />
          <RecommendGrid />
        </div>
      </section>


      {/* ============================================================
          ④ New + News — 2カラム 各540px
          背景: #fff
      ============================================================ */}
      <section style={{ background: '#fff', borderTop: '1px solid #eee' }}>
        <div style={{
          maxWidth: '1140px',
          margin: '0 auto',
          padding: '56px 24px',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '60px',
        }}>

          {/* 新着物件 */}
          <div>
            <SectionHead en="New" ja="新着物件情報" link="/properties" />
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {latestProps.map(p => (
                <li key={p.id} style={{ borderBottom: '1px solid #eee' }}>
                  <Link href={`/properties/${p.slug || p.id}`} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '10px 0',
                    textDecoration: 'none',
                    color: 'inherit',
                  }}>
                    {/* サムネイル */}
                    <div style={{
                      flexShrink: 0,
                      width: '72px',
                      height: '54px',
                      position: 'relative',
                      background: '#efefef',
                      overflow: 'hidden',
                    }}>
                      {p.images?.[0]?.url ? (
                        <Image
                          src={p.images[0].url}
                          alt={p.title}
                          fill
                          style={{ objectFit: 'cover' }}
                          sizes="72px"
                        />
                      ) : (
                        <div style={{
                          position: 'absolute', inset: 0,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '9px', color: '#bbb',
                        }}>
                          写真準備中
                        </div>
                      )}
                    </div>
                    {/* テキスト */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <span style={{ fontSize: '10px', fontWeight: 'bold', color: '#5BAD52', display: 'block', marginBottom: '2px' }}>
                        {TYPE_LABEL[p.propertyType] || p.propertyType}
                      </span>
                      <span style={{ fontSize: '15px', fontWeight: 'bold', color: '#333', display: 'block', marginBottom: '2px' }}>
                        {p.price.toLocaleString()}万円
                      </span>
                      <span style={{ fontSize: '11px', color: '#888', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {p.address}
                        {p.nearestStation ? `　${p.nearestStation}` : ''}
                        {p.walkMinutes ? ` 徒歩${p.walkMinutes}分` : ''}
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
              {latestProps.length === 0 && (
                <p style={{ color: '#bbb', fontSize: '13px', padding: '24px 0', textAlign: 'center' }}>
                  新着物件を準備中です
                </p>
              )}
            </ul>
          </div>

          {/* お役立ち情報 */}
          <div>
            <SectionHead en="News" ja="お役立ち情報" link="/news" />
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {MOCK_NEWS.map(item => (
                <li key={item.id} style={{ borderBottom: '1px solid #eee' }}>
                  <Link href={item.url} style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    padding: '10px 0',
                    textDecoration: 'none',
                    color: 'inherit',
                  }}>
                    {/* サムネイル（グレーボックス） */}
                    <div style={{
                      flexShrink: 0,
                      width: '80px',
                      height: '60px',
                      background: '#ddd',
                    }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ marginBottom: '5px' }}>
                        <span style={{
                          fontSize: '9px',
                          background: '#193e48',
                          color: '#fff',
                          padding: '2px 7px',
                          marginRight: '6px',
                        }}>
                          {item.cat}
                        </span>
                        <span style={{ fontSize: '10px', color: '#aaa' }}>
                          {item.date}
                        </span>
                      </div>
                      <p style={{
                        fontSize: '12px',
                        color: '#333',
                        lineHeight: 1.55,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}>
                        {item.title}
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </section>


      {/* ============================================================
          ⑤ CTAバナー — 査定（7050件）・買い替え
          max-width: 840px, 中央寄せ
      ============================================================ */}
      <section style={{ background: '#fff', padding: '48px 0', borderTop: '1px solid #eee' }}>
        <div style={{ maxWidth: '840px', margin: '0 auto', padding: '0 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* 査定バナー（画像がない場合のフォールバック） */}
          <Link href="/contact" style={{ display: 'block', textDecoration: 'none' }}>
            <div style={{
              background: '#193e48',
              padding: '32px 40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '32px',
            }}>
              <div>
                <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)', marginBottom: '4px', letterSpacing: '0.1em' }}>【累計査定件数】</p>
                <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#fff', marginBottom: '8px' }}>
                  7,050件<span style={{ fontSize: '16px', fontWeight: 'normal' }}>公開中</span>
                </p>
                <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.75)', lineHeight: 1.6 }}>
                  あなたの大切な不動産を適正価格で売却するためのお手伝いをします。
                </p>
              </div>
              <div style={{ flexShrink: 0, textAlign: 'center' }}>
                <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.6)', marginBottom: '8px' }}>無料 無料査定依頼はこちら</p>
                <span style={{
                  display: 'inline-block',
                  background: '#fff',
                  color: '#193e48',
                  padding: '10px 20px',
                  fontSize: '12px',
                  fontWeight: 'bold',
                }}>
                  無料査定を依頼する →
                </span>
              </div>
            </div>
          </Link>
          {/* 買い替えバナー */}
          <Link href="/replacement" style={{ display: 'block', textDecoration: 'none' }}>
            <div style={{
              background: '#5b8a6b',
              padding: '32px 40px',
            }}>
              <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#fff', marginBottom: '8px' }}>
                住宅の買い替えをお考えの方へ
              </p>
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.85)' }}>
                住み替えをご検討の方、まずはお気軽にご相談ください。
              </p>
            </div>
          </Link>
        </div>
      </section>


      {/* ============================================================
          ⑥ Search — 物件検索
          背景: #193e48, padding 56px 0
      ============================================================ */}
      <section style={{ background: '#193e48', padding: '56px 0' }}>
        <div style={{ maxWidth: '1140px', margin: '0 auto', padding: '0 24px' }}>
          <SectionHead en="Search" ja="物件を探す" light />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', marginTop: '8px' }}>

            {/* エリア選択 */}
            <div>
              <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.65)', marginBottom: '10px', letterSpacing: '0.1em' }}>
                エリアを選択
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '4px' }}>
                {['渋谷区','新宿区','杉並区','世田谷区','文京区','豊島区','中野区','目黒区',
                  '北区','板橋区','練馬区','品川区','港区','大田区','千代田区','中央区'].map(a => (
                  <Link
                    key={a}
                    href={`/properties?city=${encodeURIComponent(a)}`}
                    style={{
                      display: 'block',
                      background: 'rgba(255,255,255,0.08)',
                      border: '1px solid rgba(255,255,255,0.15)',
                      color: '#fff',
                      fontSize: '11px',
                      padding: '8px 4px',
                      textAlign: 'center',
                      textDecoration: 'none',
                      letterSpacing: '0.05em',
                    }}
                  >
                    {a}
                  </Link>
                ))}
              </div>
            </div>

            {/* 種別・価格・ボタン */}
            <div>
              <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.65)', marginBottom: '10px', letterSpacing: '0.1em' }}>
                物件種別
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '20px' }}>
                {['新築戸建て', '中古戸建て', 'マンション', '土地'].map(t => (
                  <Link
                    key={t}
                    href={`/properties?type=${encodeURIComponent(t)}`}
                    style={{
                      padding: '6px 16px',
                      fontSize: '12px',
                      background: 'rgba(255,255,255,0.08)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      color: '#fff',
                      textDecoration: 'none',
                      letterSpacing: '0.05em',
                    }}
                  >
                    {t}
                  </Link>
                ))}
              </div>
              <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.65)', marginBottom: '10px', letterSpacing: '0.1em' }}>
                価格帯
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '28px' }}>
                {['5,000万円以下', '8,000万円以下', '1億円以下', '1億円以上'].map(t => (
                  <span
                    key={t}
                    style={{
                      padding: '6px 16px',
                      fontSize: '12px',
                      background: 'rgba(255,255,255,0.08)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      color: '#fff',
                      cursor: 'pointer',
                      letterSpacing: '0.05em',
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>
              <Link href="/properties" style={{
                display: 'block',
                background: '#5BAD52',
                color: '#fff',
                textAlign: 'center',
                padding: '14px',
                fontSize: '14px',
                textDecoration: 'none',
                letterSpacing: '0.1em',
              }}>
                この条件で検索する
              </Link>
            </div>
          </div>
        </div>
      </section>


      {/* ============================================================
          ⑦ Open House + Information — 2カラム
          max-width: 1140px
      ============================================================ */}
      <section style={{ background: '#fff', borderTop: '1px solid #eee' }}>
        <div style={{
          maxWidth: '1140px',
          margin: '0 auto',
          padding: '56px 24px',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '60px',
        }}>

          {/* Open House */}
          <div>
            <SectionHead en="Open House" ja="開催場所合計" link="/openhouse" />
            <p style={{ color: '#bbb', fontSize: '13px', textAlign: 'center', padding: '32px 0' }}>
              現在開催中のオープンハウスはありません
            </p>
          </div>

          {/* Information */}
          <div>
            <SectionHead en="Information" ja="お知らせ" link="/news" />
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {MOCK_INFO.map(item => (
                <li key={item.id} style={{ borderBottom: '1px solid #eee' }}>
                  <Link href={item.url} style={{
                    display: 'block',
                    padding: '10px 0',
                    textDecoration: 'none',
                    color: 'inherit',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span style={{ fontSize: '10px', color: '#aaa' }}>{item.date}</span>
                      <span style={{
                        fontSize: '9px',
                        border: '1px solid #193e48',
                        color: '#193e48',
                        padding: '1px 6px',
                      }}>
                        {item.cat}
                      </span>
                    </div>
                    <p style={{ fontSize: '12px', color: '#333', lineHeight: 1.55 }}>{item.title}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>


      {/* ============================================================
          ⑧ Feature — 特集
          背景: #f6f6f6, padding 56px 0
      ============================================================ */}
      <section style={{ background: '#f6f6f6', padding: '56px 0' }}>
        <div style={{ maxWidth: '1140px', margin: '0 auto', padding: '0 24px' }}>
          <SectionHead en="Feature" ja="特集" />

          {/* 特集カード 3枚 */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '16px',
            marginBottom: '40px',
          }}>
            {[
              { img: '/images/feature/family.jpg', sub: '家族団らん広々物件特集', title: 'ご家族でのびのびと過ごせる大きなお家', url: '/feature/family' },
              { img: '/images/feature/limited.jpg', sub: '弊社限定物件情報', title: '弊社限定の物件情報', url: '/feature/limited' },
              { img: '/images/feature/vr.jpg', sub: '360度VR物件特集', title: '360度VR画像が閲覧可能な物件', url: '/feature/vr' },
            ].map(f => (
              <Link key={f.url} href={f.url} style={{ display: 'block', textDecoration: 'none', color: 'inherit', background: '#fff' }}>
                <div style={{ position: 'relative', aspectRatio: '4/3', overflow: 'hidden', background: '#b8c8b8' }}>
                  <Image
                    src={f.img}
                    alt={f.sub}
                    fill
                    style={{ objectFit: 'cover' }}
                    sizes="(max-width: 1140px) 33vw, 373px"
                  />
                  <div style={{
                    position: 'absolute', inset: 0,
                    background: 'rgba(0,0,0,0.38)',
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'flex-start', justifyContent: 'flex-end',
                    padding: '16px',
                  }}>
                    <p style={{ fontSize: '14px', fontWeight: 'bold', color: '#fff', lineHeight: 1.4, marginBottom: '6px' }}>
                      {f.sub}
                    </p>
                    <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.85)' }}>
                      {f.title}
                    </p>
                    <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.8)', fontStyle: 'italic', marginTop: '8px' }}>
                      view more　——
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* 不動産について 01/02 — 各565x370、横並び */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
            {[
              {
                num: '01',
                label: '不動産購入について',
                desc: '専任の担当スタッフが不動産探しから重要事項説明まで\n一貫して行います。',
                img: '/images/about/purchase.jpg',
                url: '/service',
              },
              {
                num: '02',
                label: '不動産売却について',
                desc: '売却する不動産の近隣相場や接道状況、築年月、広さ、\n形状等から適正な売却査定を行います。',
                img: '/images/about/sale.jpg',
                url: '/contact',
              },
            ].map(c => (
              <Link key={c.url} href={c.url} style={{
                display: 'block',
                textDecoration: 'none',
                position: 'relative',
                aspectRatio: '565 / 370',
                overflow: 'hidden',
                background: '#193e48',
              }}>
                <Image
                  src={c.img}
                  alt={c.label}
                  fill
                  style={{ objectFit: 'cover', opacity: 0.65 }}
                  sizes="50vw"
                />
                <div style={{
                  position: 'absolute', inset: 0,
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center',
                  textAlign: 'center',
                  padding: '32px',
                }}>
                  <span style={{
                    fontSize: '52px',
                    color: 'rgba(255,255,255,0.22)',
                    fontStyle: 'italic',
                    lineHeight: 1,
                    display: 'block',
                    marginBottom: '10px',
                  }}>
                    {c.num}
                  </span>
                  <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#fff', marginBottom: '14px' }}>
                    {c.label}
                  </p>
                  <p style={{
                    fontSize: '12px',
                    color: 'rgba(255,255,255,0.78)',
                    lineHeight: 1.8,
                    whiteSpace: 'pre-line',
                  }}>
                    {c.desc}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          {/* お客様の声 / 売却実績 — 各565x169、横並び */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <Link href="/voice" style={{
              display: 'block', textDecoration: 'none',
              position: 'relative', aspectRatio: '565 / 169', overflow: 'hidden',
              background: '#2d5a3d',
            }}>
              <Image
                src="/images/voice/customer-reviews.jpg"
                alt="お客様の声"
                fill
                style={{ objectFit: 'cover' }}
                sizes="50vw"
              />
            </Link>
            <Link href="/contact" style={{
              display: 'block', textDecoration: 'none',
              position: 'relative', aspectRatio: '565 / 169', overflow: 'hidden',
              background: '#193e48',
            }}>
              <Image
                src="/images/voice/sales-performance.jpg"
                alt="売却実績"
                fill
                style={{ objectFit: 'cover' }}
                sizes="50vw"
              />
            </Link>
          </div>

        </div>
      </section>


      {/* ============================================================
          ⑨ CTAバナー群 — FP・Corp・採用
          max-width: 840px, 中央寄せ
          背景: #fff, padding 48px 0
      ============================================================ */}
      <section style={{ background: '#fff', padding: '48px 0', borderTop: '1px solid #eee' }}>
        <div style={{
          maxWidth: '840px',
          margin: '0 auto',
          padding: '0 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}>
          {/* FPバナー */}
          <Link href="/contact" style={{ display: 'block', textDecoration: 'none' }}>
            <div style={{ background: '#193e48', padding: '28px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '24px' }}>
              <div>
                <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)', marginBottom: '4px' }}>FPファイナンシャルプランナーによる</p>
                <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#fff', marginBottom: '6px' }}>無料個別相談</p>
                <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.75)' }}>住宅ローンの借り入れ可能額、返済計画など無料でご相談いただけます。</p>
              </div>
              <span style={{
                flexShrink: 0,
                display: 'inline-block',
                background: '#fff',
                color: '#193e48',
                padding: '10px 20px',
                fontSize: '12px',
                fontWeight: 'bold',
              }}>
                相談する →
              </span>
            </div>
          </Link>
          {/* 会社紹介バナー */}
          <Link href="/company" style={{ display: 'block', textDecoration: 'none' }}>
            <div style={{ background: '#2d5a3d', padding: '28px 40px' }}>
              <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#fff', marginBottom: '6px' }}>フェリアホームについて</p>
              <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.8)' }}>東京都心・城南・城西エリアを専門とする不動産会社です。</p>
            </div>
          </Link>
          {/* 採用バナー */}
          <Link href="/recruit" style={{ display: 'block', textDecoration: 'none' }}>
            <div style={{ background: '#1a3a2a', padding: '40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ fontSize: '22px', fontWeight: 'bold', color: '#fff', marginBottom: '8px' }}>一緒に働きませんか？</p>
                <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.75)' }}>フェリアホームでは不動産営業スタッフを募集しています。</p>
              </div>
              <span style={{
                flexShrink: 0,
                display: 'inline-block',
                border: '1px solid rgba(255,255,255,0.5)',
                color: '#fff',
                padding: '10px 20px',
                fontSize: '12px',
                textDecoration: 'none',
              }}>
                採用情報を見る →
              </span>
            </div>
          </Link>
        </div>
      </section>


      {/* ============================================================
          ⑩ 優良店認定バナー
          max-width: 840px, 中央寄せ
      ============================================================ */}
      <div style={{ background: '#fff', padding: '0 0 32px' }}>
        <div style={{ maxWidth: '840px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{
            border: '2px solid #c9a84c',
            padding: '20px 32px',
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              border: '2px solid #c9a84c',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              fontSize: '14px',
              fontWeight: 'bold',
              color: '#c9a84c',
            }}>
              優良
            </div>
            <div>
              <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#333', marginBottom: '2px' }}>優良店認定 不動産会社</p>
              <p style={{ fontSize: '12px', color: '#888' }}>東京都知事（3）第93180号</p>
            </div>
          </div>
        </div>
      </div>


      {/* ============================================================
          ⑪ Contact
          背景: #f6f6f6
      ============================================================ */}
      <section style={{ background: '#f6f6f6', padding: '64px 24px' }}>
        <div style={{ maxWidth: '1140px', margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: '13px', color: '#888', marginBottom: '8px', letterSpacing: '0.15em' }}>
            不動産のこと、お気軽にご相談ください
          </p>
          <p style={{
            fontFamily: '"Dancing Script", "Times New Roman", serif',
            fontSize: '42px',
            fontStyle: 'italic',
            color: '#333',
            marginBottom: '6px',
            letterSpacing: '0.05em',
          }}>
            Contact
          </p>
          <p style={{ fontSize: '13px', color: '#888', marginBottom: '32px', letterSpacing: '0.2em' }}>
            お問合せ
          </p>
          <Link href="/contact" style={{
            display: 'inline-block',
            background: '#193e48',
            color: '#fff',
            padding: '16px 56px',
            fontSize: '14px',
            textDecoration: 'none',
            letterSpacing: '0.2em',
          }}>
            お問合せはこちら
          </Link>
        </div>
      </section>


      {/* ============================================================
          ⑫ Access
          背景: #fff, padding 64px 0
      ============================================================ */}
      <section style={{ background: '#fff', padding: '64px 0' }}>
        <div style={{ maxWidth: '1140px', margin: '0 auto', padding: '0 24px' }}>
          <SectionHead en="Access" ja="アクセス" />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '56px' }}>
            {[
              {
                name: '株式会社フェリアホーム\n千駄ヶ谷本店',
                addr: '〒151-0051 東京都渋谷区千駄ヶ谷4-16-7 北参道DTビル1階\nTEL: 03-5981-8601\n営業時間: 10:00〜19:00（水曜定休）',
                mapSrc: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3241.4!2d139.7025!3d35.6837!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x60188ca68dc05ef7%3A0x72b06ebb9ddb21fe!2z5aeZ5oqk44Ob44O844Og5Y2a5bqr5bqr5YmN!5e0!3m2!1sja!2sjp!4v1700000000',
                gmap: 'https://maps.google.com/?q=東京都渋谷区千駄ヶ谷4-16-7',
              },
              {
                name: '株式会社フェリアホーム\n幡ヶ谷店',
                addr: '〒151-0072 東京都渋谷区幡ヶ谷2-14-9\nTEL: 03-5352-7913\n営業時間: 10:00〜19:00（水曜定休）',
                mapSrc: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3241.8!2d139.6858!3d35.6773!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x60188ca68dc05ef7%3A0x72b06ebb9ddb21fe!2z5aeZ5oqk44Ob44O844Og5Zsn44Gg6LC35bqr!5e0!3m2!1sja!2sjp!4v1700000000',
                gmap: 'https://maps.google.com/?q=東京都渋谷区幡ヶ谷2-14-9',
              },
            ].map(office => (
              <div key={office.name}>
                <h3 style={{
                  fontSize: '14px',
                  fontWeight: 'bold',
                  color: '#193e48',
                  marginBottom: '12px',
                  lineHeight: 1.6,
                  whiteSpace: 'pre-line',
                }}>
                  {office.name}
                </h3>
                <p style={{
                  fontSize: '13px',
                  color: '#555',
                  lineHeight: 1.9,
                  marginBottom: '16px',
                  whiteSpace: 'pre-line',
                }}>
                  {office.addr}
                </p>
                <iframe
                  src={office.mapSrc}
                  width="100%"
                  height="220"
                  style={{ border: 0, display: 'block', marginBottom: '8px' }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={office.name.replace('\n', '')}
                />
                <a
                  href={office.gmap}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontSize: '12px', color: '#5BAD52', textDecoration: 'none' }}
                >
                  Googleマップで確認 →
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

    </main>
  )
}
