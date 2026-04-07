# Felia Home — Design System (Google Stitch Format)

> **Project**: felia-home-web  
> **Brand**: 株式会社フェリアホーム  
> **Stack**: Next.js 14 App Router + Tailwind CSS + Noto Serif JP / Noto Sans JP

---

## 1. Visual Theme & Atmosphere

**コンセプト**: 高級感と温かみを兼ね備えた、信頼できる不動産ブランド

- **雰囲気**: プレミアム・リュクスでありながら、親しみやすい。「幸せを実現する住まい」という価値観を空間で表現する
- **色彩印象**: ダークグリーン（森・安心・自然）× ゴールド（品格・特別感）× オフホワイト（清潔感・余白）
- **質感**: 紙の手触りを感じるオフホワイト背景、serif書体による格調、細いゴールドのラインによる抑制されたアクセント
- **ターゲットイメージ**: 東京都心・城南・城西エリアに住まいを求める30〜50代ファミリー

**ヒーローセクション**の典型的な表現:
```css
background: linear-gradient(135deg, #0d2418 0%, #1a3a2a 40%, #234d38 70%, #1a3a2a 100%);
```
ドット装飾パターン（ゴールド、opacity 10%）とトップのゴールドグラデーションラインを重ねる。

---

## 2. Color Palette

### CSS カスタムプロパティ（`globals.css`）

```css
:root {
  --color-main:   #1a3a2a;  /* ダークグリーン: ブランドプライマリ */
  --color-accent: #c9a96e;  /* ゴールド: アクセント・CTA */
  --color-bg:     #fafaf8;  /* オフホワイト: ページ背景 */
  --color-text:   #1c1b18;  /* チャコール: ボディテキスト */
  --color-gray:   #706e68;  /* ウォームグレー: セカンダリテキスト */
  --color-line:   #e8e6e0;  /* ラインベージュ: ボーダー・区切り */
}
```

### Tailwind 拡張カラー（`tailwind.config.ts`）

```ts
colors: {
  main:   "#1a3a2a",
  accent: "#c9a96e",
  bg:     "#fafaf8",
  line:   "#e8e6e0",
}
```

### セマンティックカラー一覧

| 用途 | 値 | Tailwind クラス |
|---|---|---|
| ブランドプライマリ（背景・ボタン） | `#1a3a2a` | `bg-[#1a3a2a]` |
| プライマリ hover | `#2d5a3e` | `bg-[#2d5a3e]` |
| プライマリ lighter | `#234d38` | `bg-[#234d38]` |
| アクセント（ゴールド）| `#c9a96e` | `bg-[#c9a96e]` |
| アクセント hover | `#b8935a` | `bg-[#b8935a]` |
| ページ背景 | `#fafaf8` | `bg-[#fafaf8]` |
| カード背景（白） | `#ffffff` | `bg-white` |
| ボディテキスト | `#1c1b18` | `text-[#1c1b18]` |
| セカンダリテキスト | `#706e68` | `text-[#706e68]` |
| ボーダー | `#e8e6e0` | `border-[#e8e6e0]` |
| タグ背景 | `#f5f5f0` | `bg-[#f5f5f0]` |
| フッター背景 | `#1a3a2a` | `bg-[#1a3a2a]` |
| ヒーロー暗部 | `#0d2418` | (inline style) |

### 透明度バリアント（よく使うもの）

```
white/10  — ヒーロー上のグラスモーフィズム要素
white/20  — ヒーローボーダー
white/50  — フッターテキスト
white/60  — フッターリンク
white/70  — ヒーローサブテキスト
c9a96e/20 — アクセント薄背景（タグ・バッジ）
c9a96e/30 — ゴールドナンバーバッジ
```

---

## 3. Typography

### フォントファミリー

| 変数 | フォント | 用途 |
|---|---|---|
| `var(--font-serif)` | Noto Serif JP | 見出し・ブランドロゴ・FEATURED等のラベル |
| `var(--font-sans)` | Noto Sans JP | ボディテキスト・フォーム・ナビ |

```ts
// next/font/google — layout.tsx
Noto_Serif_JP: weight ["400", "500", "700"]
Noto_Sans_JP:  weight ["400", "500", "700"]
```

### タイポグラフィスケール

| 用途 | クラス | 実サイズ |
|---|---|---|
| ページ大見出し (H1) | `font-serif text-4xl lg:text-5xl font-bold` | 36px / 48px |
| セクション見出し (H2) | `font-serif text-3xl font-bold` | 30px |
| カード見出し (H3) | `font-serif text-lg font-bold` | 18px |
| 価格表示 | `text-2xl font-bold text-[#c9a96e]` | 24px |
| ボディテキスト | `text-sm` | 14px |
| キャプション・ラベル | `text-xs` | 12px |
| セクションラベル (英字) | `text-xs tracking-[0.4em] font-serif` | 12px + 超ワイドトラッキング |

### トラッキング（letter-spacing）パターン

```
tracking-[0.4em]  — "PROPERTIES", "COMPANY" 等のセクションラベル
tracking-[0.3em]  — "FEATURED PROPERTIES" 等
tracking-[0.25em] — フッターサブブランド "フェリアホーム"
tracking-[0.1em]  — ヘッダーロゴ "Felia Home"
tracking-wider    — フッターカラムヘッダー
tracking-widest   — ヘッダーロゴ部分
```

---

## 4. Component Styles

### ボタン

#### プライマリCTAボタン（ゴールド）
```html
<button class="bg-[#c9a96e] text-white px-8 py-3.5 rounded-full font-bold text-sm hover:bg-[#b8935a] transition-colors">
```

#### セカンダリボタン（ダークグリーン）
```html
<button class="bg-[#1a3a2a] text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-[#2d5a3e] transition-colors">
```

#### アウトラインボタン
```html
<button class="border border-[#1a3a2a] text-[#1a3a2a] px-8 py-3.5 rounded-full text-sm hover:bg-[#1a3a2a] hover:text-white transition-colors">
```

#### アウトラインボタン（白 / ダーク背景上）
```html
<button class="border-2 border-white text-white px-10 py-4 rounded-full font-bold text-sm hover:bg-white/10 transition-colors">
```

**ルール**: CTAは `rounded-full`。管理的操作ボタンは `rounded-xl`。

---

### カード（物件カード）

```html
<div class="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-[#e8e6e0]">
  <!-- 画像エリア: h-52 -->
  <!-- コンテンツ: p-5 -->
</div>
```

**hover状態**: `shadow-xl` + `translate-y-[-4px]` + 画像 `scale-105`

---

### バッジ・タグ

#### 物件種別バッジ（カラー付き）
```html
<span class="px-2.5 py-1 rounded-full text-white text-xs font-bold" style="background: #c9a96e">
  新築戸建
</span>
```

#### NEWバッジ
```html
<span class="bg-[#c9a96e] text-white text-xs font-bold px-2.5 py-1 rounded-full">NEW</span>
```

#### スペックタグ（グレー）
```html
<span class="bg-[#f5f5f0] text-[#706e68] text-xs px-2 py-1 rounded">4LDK</span>
```

---

### フォーム要素

#### セレクト・インプット（フィルターバー）
```html
<select class="px-4 py-2.5 rounded-xl border border-[#e8e6e0] text-sm text-[#1c1b18] bg-white">
```

#### インプット（フォームページ）
```html
<input class="w-full px-4 py-3 rounded-xl border border-[#e8e6e0] text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a96e]">
```

**フォーカスリング**: `focus:ring-2 focus:ring-[#c9a96e]` — ゴールドで統一

---

### ヘッダー

- 固定ヘッダー: `fixed top-0 left-0 right-0 z-50`
- **トップページ**: スクロール前は `bg-transparent py-5`、スクロール後は `bg-white shadow-md py-3`
- **その他ページ**: 常時 `bg-white shadow-md py-3`
- ロゴ: Fバッジ（円形 `bg-[#1a3a2a]`）+ "Felia Home"（serif）+ "フェリアホーム"（xs, gray）

---

### フッター

- 背景: `bg-[#1a3a2a]`（ブランドプライマリ）
- グリッド: `grid-cols-1 md:grid-cols-4`
- サブブランド色: `text-[#c9a96e]`（ゴールド）
- リンク: `text-white/60 hover:text-white`
- 区切り線: `border-white/10`

---

### セクションラベル（ "FEATURED PROPERTIES" 等）

```html
<p class="text-[#c9a96e] text-xs tracking-[0.4em] mb-3 font-serif uppercase">PROPERTIES</p>
<h2 class="font-serif text-3xl font-bold text-[#1c1b18]">見出しテキスト</h2>
```

必ずラベル（ゴールド・極小・超ワイドトラッキング）→ 見出し（serif・太字）のペアで使う。

---

### テーブル（物件概要・会社概要）

```html
<tr class="bg-[#fafaf8]">  <!-- 偶数行 -->
<tr class="bg-white">       <!-- 奇数行 -->
  <th class="text-left text-xs font-bold text-[#706e68] p-4 w-1/3 border-b border-[#e8e6e0]">
  <td class="text-sm text-[#1c1b18] p-4 border-b border-[#e8e6e0]">
```

---

### スティッキーフィルターバー

```html
<div class="bg-white shadow-sm sticky top-16 z-40 border-b border-[#e8e6e0]">
```
`top-16` = ヘッダー高さ（64px）の直下に配置。

---

## 5. Layout & Spacing

### コンテナ

```css
/* globals.css */
.container-xl {
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
  padding: 0 1rem;        /* px-4 */
}
/* sm: px-6, lg: px-8 */
```

### セクション間余白

```
py-20  — 標準セクション（80px上下）
py-16  — CTAセクション（64px上下）
py-12  — 小セクション
py-8   — ページ内コンテンツ
```

### ページヘッダー余白

```
pt-24 pb-10  — ページ最上部（固定ヘッダー分 + 余白）
pt-28 pb-16  — 会社案内等の大きめページヘッダー
```

### グリッドシステム

| 用途 | クラス |
|---|---|
| 物件一覧 | `grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6` |
| 特徴・強み | `grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8` |
| エリアカード | `grid-cols-2 md:grid-cols-3 gap-4` |
| 詳細ページ | `grid-cols-1 lg:grid-cols-3 gap-8`（左2/右1） |
| フッター | `grid-cols-1 md:grid-cols-4 gap-8` |
| 会社概要 | `max-w-3xl mx-auto`（中央寄せ単列） |

### カード内余白

```
p-5   — 物件カードコンテンツ
p-6   — セクションカード（設備・概要ブロック）
p-8   — 会社・スタッフ・登録系カード
```

---

## 6. Elevation & Shadows

### シャドウシステム

| 用途 | クラス |
|---|---|
| 物件カード（通常） | `shadow-sm` |
| 物件カード（hover） | `shadow-xl` |
| ヘッダー（スクロール後） | `shadow-md` |
| フィルターバー | `shadow-sm` |
| マイページカード（hover） | `shadow-lg` |

### ボーダー

- 標準ボーダー: `border border-[#e8e6e0]`
- フォーカス: `ring-2 ring-[#c9a96e]`
- ダーク背景上の区切り: `border-white/10`
- アクティブナビ: `border-l-2 border-[#4a8a60]`（管理画面サイドバー）

### 角丸

```
rounded-full   — pill型ボタン・バッジ・ロゴ円形
rounded-2xl    — カード・モーダル・フォームコンテナ
rounded-xl     — インプット・セレクト・管理系ボタン
rounded-lg     — サブ画像サムネイル
rounded        — スペックタグ（小さいタグ）
```

---

## 7. Motion & Animation

### トランジション基準

| 要素 | 設定 |
|---|---|
| 全ボタン・リンク色変化 | `transition-colors` |
| 物件カード全体 | `transition-all duration-300` |
| 物件カードhover浮上 | `hover:-translate-y-1` |
| 物件カード画像ズーム | `transition-transform duration-500` |
| 画像ズーム量 | `group-hover:scale-105` |
| エリアカードテキスト | `group-hover:scale-110 transition-transform duration-300` |
| エリアカードボトムライン | `scale-x-0 group-hover:scale-x-100 transition-transform duration-300` |
| ヘッダー背景切替 | `transition-all duration-300` |

### スクロールアニメーション

```js
// Header.tsx — スクロール検知閾値
window.scrollY > 60  →  scrolled = true  →  透明→白ヘッダー
```

### 使用禁止

- `transition-all` を不必要に多用しない（パフォーマンス）
- アニメーション `duration` は `300ms` / `500ms` に統一する
- `framer-motion` や外部アニメーションライブラリは未導入

---

## 8. Design Guardrails

### カラー

- ❌ ビビッドな原色（赤・青・黄）を直接使わない
- ❌ アクセントゴールド（`#c9a96e`）を背景色に広く使わない（CTAボタン・ラベルのみ）
- ❌ `#1a3a2a` と `#c9a96e` 以外のブランドカラーを追加しない
- ✅ エラー表示のみ `red-50 / red-200 / red-700` を使用可

### タイポグラフィ

- ❌ sans-serif で見出しを作らない（必ず `font-serif`）
- ❌ セクションラベルに日本語を使わない（英字 + `tracking-[0.4em]`）
- ❌ `text-lg` 以上のサイズに `font-sans` を使わない

### コンポーネント

- ❌ CTAボタンを `rounded-xl` にしない（`rounded-full` 固定）
- ❌ 物件カード以外で `hover:-translate-y-1` を使わない
- ❌ 画像を `optimized`（next/image default）で外部URLに使わない → 必ず `unoptimized`
- ❌ テーブルのゼブラストライプを崩さない（偶数行 `#fafaf8` / 奇数行 `white`）

### スペーシング

- ❌ セクション間に `py-20` 未満の余白を使わない（コンパクトすぎる印象になる）
- ❌ コンテナを `.container-xl` 以外で独自定義しない

### アクセシビリティ

- ✅ インタラクティブ要素には必ず `transition-colors` を付ける
- ✅ フォームのフォーカス状態は `focus:ring-2 focus:ring-[#c9a96e]` で統一
- ✅ `focus:outline-none` と `focus:ring-*` を必ずセットで使う

---

## 9. Implementation Notes

### Tailwind CSS

- `tailwind.config.ts` の `extend.colors` に登録済みのカラーは `bg-main`、`bg-accent`、`bg-bg`、`border-line` で参照可能
- ただし多くの箇所で `bg-[#1a3a2a]` の形式（任意値）を直接使用しており、どちらでも可
- カスタムコンテナは `@layer utilities` 内の `.container-xl` を使う（`container` クラスは使わない）

### next/image

```tsx
// 外部画像（S3・管理システム）には必須
<Image src={url} fill className="object-cover" unoptimized />

// 静的サイズ指定の場合
<Image src={url} width={400} height={300} unoptimized />

// fillを使う親要素には必ず
<div className="relative h-52 overflow-hidden">
```

### Server Components / Client Components

- `Header.tsx` — `"use client"` （scroll・pathname・session依存）
- `Footer.tsx` — Server Component（静的）
- ページ (`page.tsx`) — 基本 Server Component
- フォーム・インタラクション — 別ファイルの Client Component に分離

### 動的ページ

```ts
export const dynamic = "force-dynamic";  // APIデータを使う全ページ
```
`revalidate: 300` は使わない（ISRキャッシュで表示が古くなる問題があったため）。

### 環境変数

```
ADMIN_API_URL          — 管理システムAPIのベースURL（Server側のみ）
NEXT_PUBLIC_ADMIN_API_URL  — クライアント側で必要な場合（現在未使用）
NEXT_PUBLIC_SITE_URL   — metadataBase用
NEXTAUTH_URL           — NextAuth
NEXTAUTH_SECRET        — NextAuth署名鍵
```

### フォント読み込み

```ts
// layout.tsx
const notoSerif = Noto_Serif_JP({ variable: "--font-serif", weight: ["400","500","700"] })
const notoSans  = Noto_Sans_JP({  variable: "--font-sans",  weight: ["400","500","700"] })

// globals.css → tailwind.config.ts で参照
fontFamily: { serif: ["var(--font-serif)", "serif"], sans: ["var(--font-sans)", "sans-serif"] }
```

### 物件種別カラーマッピング

```ts
const TYPE_COLOR: Record<string, string> = {
  NEW_HOUSE:  "#c9a96e",  // ゴールド
  USED_HOUSE: "#5c8a6e",  // ミドルグリーン
  MANSION:    "#5c6e8a",  // ブルーグレー
  LAND:       "#8a7a5c",  // ブラウン
  OTHER:      "#706e68",  // グレー
};
```

---

*このドキュメントは `felia-home-web` の実装コードから直接抽出されています。*  
*デザイン変更時はコードと同時にこのファイルを更新してください。*
