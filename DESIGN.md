# Felia Home — Design System

> **Project**: felia-home-web  
> **Brand**: 株式会社フェリアホーム  
> **Stack**: Next.js 14 App Router + Tailwind CSS + Noto Sans JP  
> **コンセプト**: 既存 felia-home.co.jp（ハトサポシステム）と同一デザイン

---

## 1. カラーパレット

| 用途 | 値 | Tailwind クラス |
|---|---|---|
| メイングリーン（ロゴ・アクセント・ボタン） | `#5BAD52` | `bg-[#5BAD52]` / `text-[#5BAD52]` |
| メイングリーン（hover） | `#3d8a3a` | `bg-[#3d8a3a]` |
| ライトグリーン背景 | `#f0f7ee` | `bg-[#f0f7ee]` |
| フッター背景 | `#2d5a3d` | `bg-[#2d5a3d]` |
| ページ背景 | `#ffffff` | `bg-white` |
| ボディテキスト | `#333333` | `text-[#333]` |
| サブテキスト | `#666666` | `text-[#666]` |
| ボーダー | `#e0e0e0` | `border-[#e0e0e0]` |

### CSS カスタムプロパティ（globals.css）

```css
:root {
  --color-primary:       #5BAD52;
  --color-primary-dark:  #3d8a3a;
  --color-primary-light: #f0f7ee;
  --color-footer:        #2d5a3d;
  --color-text:          #333333;
  --color-text-sub:      #666666;
  --color-border:        #e0e0e0;
  --color-bg:            #ffffff;
}
```

### 使用禁止

- ❌ ゴールド (`#c9a96e`) は使用しない（旧デザインの名残）
- ❌ ダークグリーン (`#1a3a2a`) をプライマリとして使用しない
- ❌ ビビッドな原色を使用しない

---

## 2. フォント

| 用途 | フォント |
|---|---|
| ボディ・ナビ・フォーム | `'Noto Sans JP', var(--font-sans), sans-serif` |
| セクションイタリック（英語ラベル） | `'Dancing Script', cursive` （HeroSlider の英字テキスト） |

- **見出し**: `font-bold text-[#333]`（sans-serif）
- **セクションラベル**: イタリック・ライト・`tracking-[0.3em]`・`text-[#5BAD52]`

---

## 3. コンポーネントスタイル

### ヘッダー

- 白背景固定: `fixed top-0 bg-white border-b border-[#e0e0e0]` / `height: 70px`
- **トップページ含め常に白背景**（スクロールで変化させない）
- ロゴ: 緑の角丸正方形SVGアイコン + "felia home"（font-weight: 300, tracking-wider）
- ナビリンク: `text-[#333] hover:text-[#5BAD52]`
- 会員登録ボタン: `bg-[#5BAD52] text-white hover:bg-[#3d8a3a]`（角丸なし）

### フッター

- 背景: `bg-[#2d5a3d]`
- リンク: `text-white/60 hover:text-white`
- 4カラムグリッド（会社情報・物件リンク・エリア・会社案内）

### 物件カード

- **シャープ（角丸なし）**: `border border-[#e0e0e0] hover:shadow-md bg-white`
- 種別ラベル: `text-xs text-[#5BAD52] font-bold`
- 価格: `text-lg font-bold text-[#333]`
- バッジ: `bg-[#5BAD52] text-white text-xs px-2 py-0.5 font-bold`（角丸なし）

### ボタン

- プライマリ: `bg-[#5BAD52] text-white hover:bg-[#3d8a3a]`（角丸なし）
- アウトライン: `border border-[#5BAD52] text-[#5BAD52] hover:bg-[#5BAD52] hover:text-white`
- フッター内CTA: `border border-white text-white hover:bg-white/10`

### セクションラベル（ページ内各セクション）

```html
<p class="text-[#5BAD52] text-sm tracking-[0.3em] mb-2 font-light italic">
  Felia Selection
</p>
<h2 class="text-2xl font-bold text-[#333]">厳選物件情報</h2>
<div class="w-12 h-px bg-[#5BAD52] mx-auto mt-3" />
```

---

## 4. レイアウト・スペーシング

- コンテナ: `.container-xl`（`max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8`）
- セクション間余白: `py-16`（標準）
- 物件グリッド: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`
- ヘッダー高さ: `70px` → ページコンテンツは `margin-top: 70px`

---

## 5. HeroSlider

- フルスクリーン: `height: calc(100vh - 70px)` / `margin-top: 70px`
- 波形SVGオーバーレイ（グリーン系）が下部にかかる
- 右下に会員登録バナー（`#1a3a2a` 背景・ゴールドボーダー）
- ドットインジケーター: アクティブ `#5BAD52` / 非アクティブ `rgba(255,255,255,0.4)`
- 5秒自動スライド

---

## 6. next/image

```tsx
// 外部画像には必須
<Image src={url} fill className="object-cover" unoptimized />
```

---

## 7. Server / Client Components

- `Header.tsx` — `"use client"`（セッション・メニュー開閉）
- `HeroSlider.tsx` — `"use client"`（スライドアニメーション）
- `Footer.tsx` — Server Component
- `PropertyCard.tsx` — Server Component
- ページ (`page.tsx`) — 基本 Server Component、`export const dynamic = "force-dynamic"`

---

## 8. 環境変数

```
ADMIN_API_URL          — 管理システムAPIのベースURL（Server側のみ）
NEXT_PUBLIC_SITE_URL   — metadataBase用
NEXTAUTH_URL           — NextAuth
NEXTAUTH_SECRET        — NextAuth署名鍵
```

---

*このドキュメントは felia-home.co.jp（既存HP）に合わせたデザインリニューアル後の仕様です。*  
*デザイン変更時はコードと同時にこのファイルを更新してください。*
