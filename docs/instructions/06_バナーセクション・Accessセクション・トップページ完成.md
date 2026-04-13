# 指示文 06 — バナーセクション・Access セクション・トップページ完成

## 概要

トップページの残りセクションを実装してトップページを完成させる。

1. **MemberBannerSection** — 会員登録誘導フルワイドバナー
2. **TradeUpBannerSection** — 買い替え誘導フルワイドバナー
3. **FeatureSection** — 特集（Phase 2 プレースホルダー）
4. **FreeBannerSection** — フリーバナー（Phase 2 プレースホルダー）
5. **AccessSection** — 会社情報 ＋ Google マップ
6. **app/page.tsx** — 全セクション統合・トップページ完成

**作業ディレクトリ**: `C:\Users\User\projects\felia-home-web`

---

## Step 1: components/home/MemberBannerSection.tsx の作成

会員登録を促すフルワイドバナー。
グリーンのグラデーション背景に白テキスト。
後で背景画像に差し替えられる構造にする。

```typescript
// components/home/MemberBannerSection.tsx
import Link from "next/link";
import { UserPlus, Eye, Heart, FileText } from "lucide-react";

const benefits = [
  { icon: Eye,      label: "未公開物件の閲覧" },
  { icon: Heart,    label: "お気に入り保存" },
  { icon: FileText, label: "資料請求・内覧申込" },
];

export function MemberBannerSection() {
  return (
    <section
      className="relative overflow-hidden py-14 tb:py-20"
      style={{
        background: "linear-gradient(135deg, #1a3a1a 0%, #2d5a2d 40%, #5BAD52 100%)",
      }}
    >
      {/* 背景装飾（円形） */}
      <div
        className="absolute -top-20 -right-20 w-80 h-80 rounded-full opacity-10"
        style={{ backgroundColor: "#ffffff" }}
      />
      <div
        className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full opacity-10"
        style={{ backgroundColor: "#ffffff" }}
      />

      <div className="container-content relative z-10">
        <div className="flex flex-col tb:flex-row items-center justify-between gap-8">

          {/* 左: テキスト */}
          <div className="text-center tb:text-left">
            <p className="text-white/70 text-sm tracking-widest mb-2">
              MEMBER REGISTRATION
            </p>
            <h2
              className="text-white font-bold leading-tight mb-4"
              style={{ fontSize: "clamp(22px, 3vw, 36px)" }}
            >
              会員登録で、もっと便利に。<br />
              <span className="text-white/85 font-normal" style={{ fontSize: "clamp(15px, 2vw, 22px)" }}>
                未公開物件も見られます。
              </span>
            </h2>

            {/* 特典リスト */}
            <div className="flex flex-wrap justify-center tb:justify-start gap-4 mb-6">
              {benefits.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-1.5 text-white/80 text-sm">
                  <Icon size={14} className="flex-shrink-0" />
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 右: CTA */}
          <div className="flex flex-col items-center gap-3 flex-shrink-0">
            <Link
              href="/members/register"
              className="flex items-center gap-2 px-8 py-4 rounded-lg font-bold text-base transition-all duration-200 hover:scale-105 hover:shadow-lg"
              style={{
                backgroundColor: "#ffffff",
                color: "#5BAD52",
                boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
              }}
            >
              <UserPlus size={18} />
              無料会員登録はこちら
            </Link>
            <Link
              href="/members/login"
              className="text-white/60 text-sm hover:text-white transition-colors"
            >
              すでに会員の方はログイン →
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}
```

---

## Step 2: components/home/TradeUpBannerSection.tsx の作成

物件買い替えを検討しているユーザーへの訴求バナー。
落ち着いたネイビー系グラデーション。

```typescript
// components/home/TradeUpBannerSection.tsx
import Link from "next/link";
import { ArrowRight, RefreshCw } from "lucide-react";

const steps = [
  { num: "01", label: "売却査定" },
  { num: "02", label: "新居探し" },
  { num: "03", label: "同時進行サポート" },
];

export function TradeUpBannerSection() {
  return (
    <section
      className="relative overflow-hidden py-14 tb:py-20"
      style={{
        background: "linear-gradient(135deg, #0f1f2f 0%, #1a3a5a 50%, #2a5a8a 100%)",
      }}
    >
      {/* 背景装飾 */}
      <div
        className="absolute top-0 right-0 w-[600px] h-full opacity-5"
        style={{
          background: "radial-gradient(circle at 80% 50%, #ffffff, transparent 60%)",
        }}
      />

      <div className="container-content relative z-10">
        <div className="flex flex-col tb:flex-row items-center justify-between gap-8">

          {/* 左: テキスト */}
          <div className="text-center tb:text-left">
            <div className="flex items-center justify-center tb:justify-start gap-2 mb-3">
              <RefreshCw size={16} className="text-white/60" />
              <p className="text-white/60 text-sm tracking-widest">TRADE-UP SUPPORT</p>
            </div>
            <h2
              className="text-white font-bold leading-tight mb-4"
              style={{ fontSize: "clamp(20px, 2.8vw, 34px)" }}
            >
              物件の買い替えを<br />お考えの方へ
            </h2>
            <p className="text-white/70 text-sm tb:text-base leading-relaxed max-w-md">
              「今の家を売りながら、新しい家を探したい」<br />
              売却と購入を同時にサポートします。
            </p>

            {/* ステップ */}
            <div className="flex items-center gap-2 mt-5 justify-center tb:justify-start">
              {steps.map((step, i) => (
                <div key={step.num} className="flex items-center gap-2">
                  <div className="flex flex-col items-center">
                    <span
                      className="font-montserrat font-bold text-sm"
                      style={{ color: "#5BAD52", fontFamily: "'Montserrat', sans-serif" }}
                    >
                      {step.num}
                    </span>
                    <span className="text-white/70 text-xs whitespace-nowrap">{step.label}</span>
                  </div>
                  {i < steps.length - 1 && (
                    <ArrowRight size={12} className="text-white/30 flex-shrink-0 mb-0.5" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 右: CTA */}
          <div className="flex-shrink-0">
            <Link
              href="/buy/trade-up"
              className="flex items-center gap-2 px-8 py-4 rounded-lg font-bold text-base text-white transition-all duration-200 hover:scale-105 hover:shadow-lg border-2"
              style={{
                borderColor: "#5BAD52",
                backgroundColor: "rgba(91,173,82,0.15)",
                boxShadow: "0 4px 20px rgba(91,173,82,0.2)",
              }}
            >
              詳しく見る
              <ArrowRight size={18} />
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}
```

---

## Step 3: components/home/FeatureSection.tsx の作成（Phase 2 プレースホルダー）

admin側のAPIが完成するまでは表示しない（コメントアウト状態）。
コンポーネント自体は作成しておく。

```typescript
// components/home/FeatureSection.tsx
// Phase 2: admin側の features テーブル・API が完成次第実装
// 現時点では app/page.tsx に組み込まない

import Link from "next/link";
import { SectionTitle } from "@/components/ui/SectionTitle";

interface Feature {
  id: string;
  slug: string;
  title: string;
  subTitle: string;
  image: string;
  href: string;
}

// TODO: getFeatures() を lib/api.ts に追加して差し替え
async function getFeatures(): Promise<Feature[]> {
  return [];
}

export async function FeatureSection() {
  const features = await getFeatures();
  if (features.length === 0) return null;

  return (
    <section className="section-padding bg-white">
      <div className="container-content">
        <SectionTitle en="Feature" ja="特集" />
        <div className="grid grid-cols-1 tb:grid-cols-3 gap-4 tb:gap-6">
          {features.slice(0, 3).map((feature) => (
            <Link
              key={feature.id}
              href={feature.href}
              className="group relative block overflow-hidden rounded-lg"
              style={{ paddingBottom: "65%" }}
            >
              <div className="absolute inset-0">
                <div
                  className="absolute inset-0"
                  style={{ backgroundImage: `url(${feature.image})`, backgroundSize: "cover" }}
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                  <p className="text-white font-bold text-lg leading-snug">{feature.title}</p>
                  <p className="text-white/70 text-sm mt-1">{feature.subTitle}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
```

---

## Step 4: components/home/FreeBannerSection.tsx の作成（Phase 2 プレースホルダー）

```typescript
// components/home/FreeBannerSection.tsx
// Phase 2: admin側の banners テーブル・API が完成次第実装
// 現時点では app/page.tsx に組み込まない

import Link from "next/link";

interface Banner {
  id: string;
  image: string;
  href: string;
  alt: string;
}

// TODO: getBanners() を lib/api.ts に追加して差し替え
async function getBanners(): Promise<Banner[]> {
  return [];
}

export async function FreeBannerSection() {
  const banners = await getBanners();
  if (banners.length === 0) return null;

  return (
    <section className="section-padding" style={{ backgroundColor: "#F8F8F8" }}>
      <div className="container-content">
        <div className="grid grid-cols-1 tb:grid-cols-2 gap-4">
          {banners.slice(0, 4).map((banner) => (
            <Link key={banner.id} href={banner.href} className="block group">
              <div className="relative overflow-hidden rounded-lg" style={{ paddingBottom: "40%" }}>
                <div
                  className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                  style={{ backgroundImage: `url(${banner.image})` }}
                />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
```

---

## Step 5: components/home/AccessSection.tsx の作成

```typescript
// components/home/AccessSection.tsx
import { MapPin, Phone, Clock, CalendarX } from "lucide-react";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { getCompanyInfo } from "@/lib/api";

// Google Maps が未設定の場合のフォールバック用デフォルト値
const DEFAULT_COMPANY = {
  name: "株式会社フェリアホーム",
  address: "東京都 ※住所を設定してください",
  phone: "03-XXXX-XXXX",
  hours: "10:00〜18:00",
  holiday: "水曜日・年末年始",
  access: "※アクセス方法を設定してください",
  lat: 35.6762,
  lng: 139.6503,
  licenseNumber: "東京都知事（X）第XXXXX号",
};

export async function AccessSection() {
  let company = DEFAULT_COMPANY;
  try {
    const data = await getCompanyInfo();
    if (data) company = { ...DEFAULT_COMPANY, ...data };
  } catch {
    // Admin APIが未起動の場合はデフォルト値を使用
  }

  const mapsEmbedUrl = `https://maps.google.com/maps?q=${company.lat},${company.lng}&z=16&output=embed`;

  return (
    <section className="section-padding" style={{ backgroundColor: "#F8F8F8" }}>
      <div className="container-content">
        <SectionTitle en="Access" ja="会社情報・アクセス" />

        <div className="grid grid-cols-1 tb:grid-cols-2 gap-8 tb:gap-12 items-start">

          {/* 左: 店舗情報 */}
          <div>
            <div
              className="bg-white rounded-xl p-6 tb:p-8 border"
              style={{ borderColor: "#E5E5E5" }}
            >
              {/* 会社名 */}
              <h3
                className="font-bold text-xl tb:text-2xl mb-6 pb-4 border-b"
                style={{ color: "#333333", borderColor: "#E5E5E5" }}
              >
                {company.name}
              </h3>

              {/* 情報リスト */}
              <dl className="space-y-4">
                <InfoRow icon={MapPin} label="所在地" value={company.address} />
                <InfoRow icon={Phone} label="電話番号" value={company.phone} isPhone />
                <InfoRow icon={Clock} label="営業時間" value={company.hours} />
                <InfoRow icon={CalendarX} label="定休日" value={company.holiday} />
              </dl>

              {/* アクセス */}
              {company.access && company.access !== DEFAULT_COMPANY.access && (
                <div className="mt-5 pt-5 border-t" style={{ borderColor: "#E5E5E5" }}>
                  <p className="text-xs font-bold text-gray-400 tracking-widest mb-2">ACCESS</p>
                  <p className="text-sm text-gray-600 leading-relaxed">{company.access}</p>
                </div>
              )}

              {/* 免許番号 */}
              <p className="mt-5 pt-4 border-t text-xs text-gray-400" style={{ borderColor: "#F0F0F0" }}>
                宅地建物取引業 {company.licenseNumber}
              </p>
            </div>

            {/* 電話CTA */}
            <a
              href={`tel:${company.phone.replace(/-/g, "")}`}
              className="mt-4 flex items-center justify-center gap-3 w-full py-4 rounded-xl font-bold text-white transition-all hover:scale-[1.02]"
              style={{
                backgroundColor: "#5BAD52",
                boxShadow: "0 4px 12px rgba(91,173,82,0.3)",
              }}
            >
              <Phone size={20} />
              <span className="text-lg tracking-wider">{company.phone}</span>
            </a>
          </div>

          {/* 右: Google Maps */}
          <div
            className="rounded-xl overflow-hidden border"
            style={{ borderColor: "#E5E5E5", aspectRatio: "4/3" }}
          >
            {process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ? (
              <iframe
                src={mapsEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={`${company.name}の地図`}
              />
            ) : (
              // APIキー未設定時のプレースホルダー
              <div
                className="w-full h-full flex flex-col items-center justify-center gap-3"
                style={{ backgroundColor: "#E8F5E8" }}
              >
                <MapPin size={40} style={{ color: "#5BAD52" }} />
                <p className="text-sm text-gray-500 text-center">
                  Google Maps を表示するには<br />
                  <code className="text-xs bg-gray-100 px-1 py-0.5 rounded">
                    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
                  </code><br />
                  を .env.local に設定してください
                </p>
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}

// 情報行コンポーネント
function InfoRow({
  icon: Icon,
  label,
  value,
  isPhone = false,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  isPhone?: boolean;
}) {
  return (
    <div className="flex items-start gap-3">
      <div
        className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center mt-0.5"
        style={{ backgroundColor: "#EBF7EA" }}
      >
        <Icon size={14} style={{ color: "#5BAD52" }} />
      </div>
      <div>
        <dt className="text-xs text-gray-400 tracking-widest mb-0.5">{label}</dt>
        <dd className="text-sm font-medium text-gray-700">
          {isPhone ? (
            <a
              href={`tel:${value.replace(/-/g, "")}`}
              className="hover:underline"
              style={{ color: "#5BAD52" }}
            >
              {value}
            </a>
          ) : (
            value
          )}
        </dd>
      </div>
    </div>
  );
}
```

---

## Step 6: app/page.tsx — トップページ完成版

```typescript
// app/page.tsx
import { HeroSlider } from "@/components/home/HeroSlider";
import { FeliaSectionSelection } from "@/components/home/FeliaSectionSelection";
import { RecommendSection } from "@/components/home/RecommendSection";
import { NewAndNewsSection } from "@/components/home/NewAndNewsSection";
import { MemberBannerSection } from "@/components/home/MemberBannerSection";
import { TradeUpBannerSection } from "@/components/home/TradeUpBannerSection";
import { SearchSection } from "@/components/home/SearchSection";
import { OpenHouseAndInfoSection } from "@/components/home/OpenHouseAndInfoSection";
// Feature・FreeBanner は Phase 2（admin API 完成後に有効化）
// import { FeatureSection } from "@/components/home/FeatureSection";
// import { FreeBannerSection } from "@/components/home/FreeBannerSection";
import { AccessSection } from "@/components/home/AccessSection";

export default function HomePage() {
  return (
    <main className="bg-white">
      {/* 1. ヒーロースライダー */}
      <HeroSlider />

      {/* 2. 厳選物件 */}
      <FeliaSectionSelection />

      {/* 3. エリア別おすすめ */}
      <RecommendSection />

      {/* 4. 新着物件 ＋ お知らせ */}
      <NewAndNewsSection />

      {/* 5. 会員登録誘導バナー */}
      <MemberBannerSection />

      {/* 6. 物件検索（SVGマップ ＋ 路線） */}
      <SearchSection />

      {/* 7. 現地販売会 ＋ お知らせ */}
      <OpenHouseAndInfoSection />

      {/* 8. 買い替え誘導バナー */}
      <TradeUpBannerSection />

      {/* 9. 特集（Phase 2） */}
      {/* <FeatureSection /> */}

      {/* 10. フリーバナー（Phase 2） */}
      {/* <FreeBannerSection /> */}

      {/* 11. Access */}
      <AccessSection />
    </main>
  );
}
```

---

## Step 7: 動作確認

```bash
npm run dev
```

確認項目:

**MemberBannerSection**
- [ ] グリーングラデーション背景に白テキスト
- [ ] 「無料会員登録はこちら」ボタンが白・緑文字で表示
- [ ] 「ログイン →」テキストリンクが表示
- [ ] 特典3項目（未公開物件・お気に入り・資料請求）が表示

**TradeUpBannerSection**
- [ ] ネイビー系グラデーション背景
- [ ] 3ステップ（査定→探す→同時進行）が表示
- [ ] 「詳しく見る」ボタンが緑ボーダーで表示

**AccessSection**
- [ ] 左カラムに会社情報が白カードで表示
- [ ] 電話番号がタップで発信できるリンクになっている
- [ ] `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` 未設定の場合、緑背景のプレースホルダーが表示
- [ ] 設定済みの場合、Google Maps が表示

**トップページ全体**
- [ ] ページを上から下まで全セクションが繋がって表示される
- [ ] 各セクションの背景色が交互に変わる（白 → グレー → 白 → グリーン → グレー ...）
- [ ] SP（375px）で崩れない
- [ ] `npm run build` エラーなし

---

## 完了条件チェックリスト

- [ ] `components/home/MemberBannerSection.tsx` 作成済み
- [ ] `components/home/TradeUpBannerSection.tsx` 作成済み
- [ ] `components/home/FeatureSection.tsx` 作成済み（Phase 2・非組み込み）
- [ ] `components/home/FreeBannerSection.tsx` 作成済み（Phase 2・非組み込み）
- [ ] `components/home/AccessSection.tsx` 作成済み
- [ ] `app/page.tsx` が全セクション統合の完成版になっている
- [ ] Feature・FreeBanner がコメントアウト状態であること
- [ ] `npm run build` エラーなし

---

## 完了後: Atsushiへのメモ

**Google Maps の有効化**（任意のタイミングで実施）:
1. Google Cloud Console で Maps Embed API を有効化
2. API キーを取得
3. VPS の `.env.local` に `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=取得したキー` を追記
4. `npm run build` → `pm2 restart felia-home-web`

**Phase 2 の有効化手順**（adminチャットで特集・バナーAPIが完成したら）:
1. `lib/api.ts` に `getFeatures()` と `getBanners()` を追加
2. `FeatureSection.tsx` と `FreeBannerSection.tsx` 内の TODO を実装
3. `app/page.tsx` の該当コメントアウトを解除

---

## 次の指示文

`07_物件一覧・物件詳細ページ.md`
