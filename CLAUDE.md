# CLAUDE.md — フェリアホーム 公開HP（felia-home-web）

## プロジェクト概要

東京都内の不動産売買仲介「フェリアホーム」の公式HP。
物件情報・会員登録・査定依頼・お問い合わせ等を一般ユーザーに提供する公開Webサイト。

- **公開URL**: https://index.felia-home.co.jp
- **リポジトリ**: `C:\Users\User\projects\felia-home-web`
- **管理システム連携先**: https://admin.felia-home.co.jp（API経由、VPS内部では localhost:3001）
- **インフラ**: さくらVPS（Ubuntu 24.04）/ PM2（プロセス名: `felia-home-web`）/ ポート3002

> ⚠️ **このプロジェクトはゼロから新規構築**。既存ファイルは全刷新対象。
> 既存コードを流用・修正する前に必ず Atsushi に確認すること。

---

## Claude Code 運用ルール

- **このチャット（Claude.ai）**: 設計・指示文の作成のみ。コードを直接生成して実行はしない
- **VSCode Claude Code**: このチャットで作成した指示文を受け取り、実装・ファイル操作を行う
- **VPS / DB 操作**: 危険な操作は必ず Atsushi がチャットで確認後に実行
- 指示文は `/docs/instructions/` フォルダに連番管理（`01_xxx.md`, `02_xxx.md` ...）

---

## Tech Stack

| 項目 | 技術 |
|------|------|
| フレームワーク | Next.js 14（App Router） |
| 言語 | TypeScript |
| スタイリング | Tailwind CSS |
| 認証 | NextAuth.js（JWT 7日間） |
| デプロイ | PM2（プロセス名: `felia-home-web`） |

---

## デザインシステム

| 項目 | 値 |
|------|-----|
| メインカラー（グリーン） | `#5BAD52` |
| 背景色 | `#FFFFFF` |
| テキスト（基本） | `#333333` |
| テキスト（サブ） | `#666666` |
| ボーダー | `#E5E5E5` |
| フォント（日本語） | Noto Sans JP（Google Fonts） |
| フォント（英字見出し） | Montserrat（Google Fonts） |

### デザイン原則
- 白背景・グリーンアクセントのクリーンなデザイン
- モバイルファースト（SP / Tablet / PC の3ブレークポイント）
- 画像が主役。物件写真を大きく見せるレイアウト
- セクションごとに英字の大見出し（例: "Felia Selection"）＋日本語サブタイトルのパターンを統一
- `app/layout.tsx` の body に `bg-white` を明示的に設定すること
  （`bg-[#fafaf8]` など他の背景色は設定しない。過去の白飛びバグを防ぐため）
- HeroSlider 内で `marginTop` の重複設定をしない

---

## AIエージェント構成（全4Agent）

```
HPOrchestratorAgent               ← HP全体のコンテンツ品質管理・調整
├── SEOAgent                      ← 各ページのSEO最適化          [Phase 1]
├── AreaContentAgent              ← エリア説明・区の特徴文生成   [Phase 1]
├── PropertyCopyAgent             ← 物件キャッチコピー自動生成   [Phase 1]
└── MemberRecommendAgent          ← 会員向けパーソナライズ推薦   [Phase 2]
```

---

## AIエージェント詳細

### SEOAgent（検索エンジン最適化）

**役割**
- 物件詳細ページ・エリアページ・特集ページの meta / JSON-LD を自動生成
- ページタイトルのテンプレートからキーワード最適化

**出力形式（物件詳細ページ例）**
```typescript
interface PropertySEO {
  title: string;         // "渋谷区〇〇 3LDK 5,980万円の戸建て | フェリアホーム"
  description: string;  // 150文字以内の自然な説明文
  jsonLd: {             // schema.org/RealEstateListing
    "@context": "https://schema.org";
    "@type": "RealEstateListing";
    name: string;
    price: number;
    priceCurrency: "JPY";
    address: object;
    floorSize: object;
  };
}
```

**生成ルール**
- タイトルは「エリア名 ＋ 間取り ＋ 価格 ＋ 物件種別 ＋ | フェリアホーム」の形式
- descriptionは重複NG・価格/場所/広さの3要素を必ず含む
- JSON-LDは schema.org の RealEstateListing に準拠

---

### AreaContentAgent（エリア説明文生成）

**役割**
- Recommendセクション・エリア一覧ページ用の区説明文を自動生成
- 各区の生活利便性・交通・雰囲気を簡潔に説明するコンテンツ生成

**対象区（17区）**
```
渋谷区 / 新宿区 / 杉並区 / 世田谷区
文京区 / 豊島区 / 中野区 / 目黒区
北区 / 板橋区 / 練馬区 / 品川区
港区 / 大田区 / 千代田区 / 中央区
```

**出力形式**
```typescript
interface AreaContent {
  areaName: string;       // 区名
  catchCopy: string;      // キャッチコピー（20字以内）
  description: string;    // エリア説明（80〜120字）
  keywords: string[];     // SEOキーワード（5個）
  highlights: string[];   // 生活ポイント（3項目）
}
```

**生成プロンプト指針**
- 不動産購入者視点（ファミリー・共働き・資産運用）で執筆
- 「住みやすい」「便利」等の陳腐な表現は避ける
- 具体的な駅名・施設名・距離感を含める

---

### PropertyCopyAgent（物件キャッチコピー生成）

**役割**
- 管理システムから取得した物件データをもとに、HPトップ・物件詳細で使う
  キャッチコピーと紹介文をAI生成する

**入力データ（admin APIから取得）**
```typescript
interface PropertyInput {
  propertyType: string;
  address: string;
  price: number;
  area: number;
  layout: string;
  nearestStation: string;
  walkMinutes: number;
  buildingYear?: number;
  features?: string[];    // 物件の特徴メモ
}
```

**出力形式**
```typescript
interface PropertyCopy {
  catchCopy: string;      // キャッチコピー（30字以内）
  subCopy: string;        // サブコピー（50字以内）
  description: string;    // 物件紹介文（150〜200字）
  appealPoints: string[]; // アピールポイント（3項目）
}
```

**生成ルール**
- 担当者確認後に公開（自動公開は禁止）
- 誇大広告・断定的表現は使用しない（宅建業法準拠）
- 「必ず」「絶対」「最高」等の表現は使用しない

---

### MemberRecommendAgent（会員向けパーソナライズ推薦）[Phase 2]

**役割**
- 会員のお気に入り・閲覧履歴・検索条件からパーソナライズ物件推薦
- マイページの「あなたへのおすすめ」セクションに表示

**マッチングスコア重み**
```
閲覧・お気に入りエリア: 40%
価格帯（±15%の範囲）:   25%
間取り・広さ:            20%
物件種別:                15%
```

**出力形式**
```typescript
interface RecommendResult {
  memberId: string;
  recommendedProperties: string[];  // property_id 配列（最大6件）
  reason: string;                   // 推薦理由テキスト（表示用）
  score: number;                    // マッチングスコア
}
```

**制約**
- 推薦データはサーバーサイドで生成（クライアントに会員データを渡さない）
- 会員限定物件は認証済みセッションがある場合のみ推薦候補に含める

---

## 全エージェント共通ルール

- **人間確認が必要な出力**: AI生成コンテンツは必ず担当者が確認してから公開
- **自動公開は一切禁止**: PropertyCopyAgent の出力を直接HPに表示しない
- **エラー時の動作**: AI生成失敗時はデフォルトテキストにフォールバック
- **API呼び出し**: すべて `ANTHROPIC_API_KEY` 環境変数を使用（ハードコード禁止）

---

## 環境変数（VPS: `.env.local`）

```bash
# 管理システムAPI（VPS内部通信）
ADMIN_API_URL=http://localhost:3001

# NextAuth
NEXTAUTH_URL=https://index.felia-home.co.jp
NEXTAUTH_SECRET=felia2026-member-secret-xk9mq2

# Claude API（AIエージェント用）
ANTHROPIC_API_KEY=

# Google Maps（AccessセクションのGoogleマップ埋め込み用）
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=

# サイトURL
NEXT_PUBLIC_SITE_URL=https://index.felia-home.co.jp
```

> ⚠️ `ADMIN_API_URL=http://localhost:3001` が未設定だとAPIコールが全滅する。
> VPS上の `.env.local` に必ず記載されていること。Atsushi が直接設定する。

---

## バックエンド連携（Admin API）

HPはすべてのデータを管理システム（ポート3001）からAPIで取得する。
**HPが直接DBに接続することは絶対に禁止。**

特集・バナーのadmin側実装は **adminシステムのチャット（felia-property-system）で行う**。
HP側の実装はadmin APIが完成した後に着手する。

### 主要APIエンドポイント

```
GET  /api/properties?flag=featured          厳選物件一覧
GET  /api/properties?flag=new               新着物件一覧
GET  /api/properties?area=渋谷区            エリア別物件一覧
GET  /api/properties?line=xxx               路線別物件一覧
GET  /api/properties/[id]                   物件詳細
GET  /api/open-houses                       現地販売会一覧
GET  /api/news                              お知らせ一覧
GET  /api/features                          特集一覧（admin側実装待ち）
GET  /api/banners                           バナー一覧（admin側実装待ち）
GET  /api/company                           会社情報
POST /api/members/register                  会員登録
POST /api/members/login                     ログイン
POST /api/inquiries                         問い合わせ送信
POST /api/valuations                        査定依頼
```

---

## ページ構成

```
/                       トップページ
/properties             物件一覧
/properties/[id]        物件詳細
/search                 物件検索（詳細条件）
/features               特集一覧
/features/[slug]        特集詳細
/open-houses            現地販売会一覧
/news                   お知らせ一覧
/news/[slug]            お知らせ詳細
/sell                   売却・査定トップ
/sell/valuation         売却査定フォーム
/sell/results           売却実績
/buy                    購入について
/buy/trade-up           買い替えをお考えの方へ
/services/fp            無料FPサービス
/services/voice         お客様の声
/faq                    よくある質問
/about                  フェリアホームについて
/about/staff            スタッフ紹介
/recruit                採用情報
/members/register       会員登録
/members/login          ログイン
/members/mypage         マイページ（認証必須）
/members/favorites      お気に入り物件一覧（認証必須）
/members/inquiries      問い合わせ履歴（認証必須）
```

---

## ヘッダー構成

```
[ロゴ（左）] ── [物件検索] [お気に入り♡] [採用情報] [無料会員登録] [ログイン] [≡ メニュー]
```

### アコーディオンメニュー（≡ を押すと展開）

```
買いたい　[＋]
  └ 条件（地域・沿線・駅）から物件を探す  → /search
  └ 厳選物件情報                          → /properties?flag=featured
  └ 新着物件情報                          → /properties?flag=new
現地販売会情報                             → /open-houses
WEBチラシ                                 → /flyers

売りたい　[＋]
  └ 不動産売却について                    → /sell
  └ 売却査定                              → /sell/valuation
  └ 売却実績                              → /sell/results

サービス　[＋]
  └ 不動産購入について                    → /buy
  └ 物件の買い替えをお考えの方へ         → /buy/trade-up
  └ 無料FPサービス                        → /services/fp
  └ お客様の声                            → /services/voice

よくある質問                               → /faq

私たちについて　[＋]
  └ フェリアホームについて                → /about
  └ スタッフ紹介                          → /about/staff

お知らせ                                   → /news
```

---

## トップページ セクション構成

| # | セクション名 | 概要 | Phase |
|---|------------|------|-------|
| 1 | HeroSlider | フルワイドスライダー（3秒切替）| 1 |
| 2 | Felia Selection | 厳選物件2件＋スライド | 1 |
| 3 | Recommend | エリア別区画像4×4グループ | 1 |
| 4 | NEW / News | 新着物件＋お知らせ（2カラム）| 1 |
| 5 | 会員登録誘導バナー | フルワイドバナー | 1 |
| 6 | 買い替え誘導バナー | フルワイドバナー | 1 |
| 7 | Search | SVGクリッカブルMAP＋路線リンク | 1 |
| 8 | Open House / Information | 現地販売会＋お知らせ（2カラム）| 1 |
| 9 | Feature | 特集バナー横3列 | 2（admin待ち）|
| 10 | フリーバナー | 2カラム×2行（4枚）| 2（admin待ち）|
| 11 | Access | 店舗情報＋Googleマップ | 1 |
| 12 | Footer | テキストリンク中心 | 1 |

### Recommendセクション 対象区（17区）

| グループ | 区 |
|---------|-----|
| 1 | 渋谷区 / 新宿区 / 杉並区 / 世田谷区 |
| 2 | 文京区 / 豊島区 / 中野区 / 目黒区 |
| 3 | 北区 / 板橋区 / 練馬区 / 品川区 |
| 4 | 港区 / 大田区 / 千代田区 / 中央区 |

- 画像: 著作権フリー素材（Unsplash / Pixabay）を使用
- 格納: `/public/areas/[区名].jpg`

### SearchセクションのSVGマップ

- クリッカブル対象: 上記17区のみ
- 城東エリア（江東区・墨田区・江戸川区・葛飾区・足立区・荒川区・台東区等）は
  地図上に表示するがリンクは設定しない（グレーアウト表示）

### 対応路線（Searchセクション右カラム）

```
JR山手線 / JR中央線 / JR埼京線 / JR京浜東北線
東急東横線 / 東急田園都市線 / 東急目黒線
東京メトロ銀座線 / 東京メトロ丸ノ内線 / 東京メトロ半蔵門線
東京メトロ日比谷線 / 東京メトロ東西線 / 東京メトロ副都心線
小田急小田原線 / 京王線 / 西武池袋線 / 西武新宿線
都営新宿線 / 都営三田線 / 都営大江戸線
```

---

## 物件カード コンポーネント仕様

```typescript
interface PropertyCardProps {
  id: string;
  mainImage: string;
  propertyType: string;      // 土地・戸建て・マンション等
  name: string;
  address: string;
  price: number;             // 万円
  area: number;              // ㎡
  layout: string;            // 間取り（例: 3LDK）
  nearestStation: string;
  walkMinutes: number;
  isNew?: boolean;
  isFeatured?: boolean;
  isOpenHouse?: boolean;
  isMembersOnly?: boolean;
}
```

---

## 会員機能仕様

| 機能 | 内容 |
|------|------|
| 登録フロー | メール認証 → アクティベート → ログイン → マイページ |
| 会員特典 | 未公開物件閲覧・お気に入り保存・資料請求・問い合わせ履歴 |
| 非ログイン制限 | 会員限定物件はサムネのみ表示。詳細データはSSR/APIで除外 |
| お気に入り | ボタン押下でログイン誘導モーダル（非ログイン時） |

---

## 実装フェーズ管理

### Phase 1（先行着手可能）
- [ ] プロジェクト初期セットアップ（Next.js 14 + Tailwind + NextAuth）
- [ ] ヘッダー・フッター・アコーディオンメニュー
- [ ] HeroSlider（静的画像4〜6枚）
- [ ] Felia Selection（`is_featured` API連携）
- [ ] Recommend（静的区画像17枚）
- [ ] Search（SVGクリッカブルMAP + 路線リンク）
- [ ] NEW / News（API連携）
- [ ] Open House / Information（API連携）
- [ ] 会員登録・ログイン・マイページ
- [ ] 物件一覧・物件詳細
- [ ] SEOAgent 実装

### Phase 2（admin側API完成後）
- [ ] Feature（特集）セクション
- [ ] フリーバナーセクション
- [ ] HeroSliderのadmin連携
- [ ] MemberRecommendAgent 実装

### admin側で先に実装が必要な機能（adminチャットで依頼）
- `features` テーブル・管理画面・CRUD API
- `banners` テーブル・管理画面・CRUD API
- `hero_slides` テーブル・管理画面・CRUD API

---

## ディレクトリ構成

```
felia-home-web/
├── docs/
│   └── instructions/           ← Claude Code 向け指示文（連番管理）
│       ├── 01_初期セットアップ.md
│       ├── 02_ヘッダーフッター.md
│       └── ...
├── app/
│   ├── layout.tsx              ← body に bg-white を明示設定
│   ├── page.tsx                ← トップページ
│   ├── properties/
│   │   ├── page.tsx
│   │   └── [id]/page.tsx
│   ├── members/
│   │   ├── register/page.tsx
│   │   ├── login/page.tsx
│   │   └── mypage/page.tsx
│   └── ...（各ページ）
├── components/
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── AccordionMenu.tsx
│   │   └── Footer.tsx
│   ├── home/
│   │   ├── HeroSlider.tsx
│   │   ├── FeliaSectionSelection.tsx
│   │   ├── RecommendSection.tsx
│   │   ├── NewAndNewsSection.tsx
│   │   ├── MemberBannerSection.tsx
│   │   ├── TradeUpBannerSection.tsx
│   │   ├── SearchSection.tsx
│   │   ├── OpenHouseAndInfoSection.tsx
│   │   ├── FeatureSection.tsx
│   │   ├── FreeBannerSection.tsx
│   │   └── AccessSection.tsx
│   ├── property/
│   │   ├── PropertyCard.tsx
│   │   └── PropertySlider.tsx
│   └── ui/
│       ├── SectionTitle.tsx    ← 英字大見出し＋日本語サブタイトル共通
│       ├── Badge.tsx
│       └── Button.tsx
├── lib/
│   ├── api.ts                  ← Admin APIクライアント（全fetch処理を集約）
│   ├── agents/
│   │   ├── seoAgent.ts
│   │   ├── areaContentAgent.ts
│   │   ├── propertyCopyAgent.ts
│   │   └── memberRecommendAgent.ts
│   └── auth.ts
├── public/
│   ├── areas/                  ← 各区の著作権フリー画像
│   └── hero/                   ← スライダー用画像（Atsushi 提供）
└── CLAUDE.md
```

---

## デプロイ手順

```bash
# VPS上での作業（Atsushi が実施）
git pull origin main
npm run build
pm2 restart felia-home-web
```

- `.env.local` は git 管理外。VPS 上に直接配置
- `ADMIN_API_URL=http://localhost:3001` が必須
- adminシステム（ポート3001）が先に起動していること

---

## 禁止事項

| 禁止操作 | 理由 |
|---------|------|
| `prisma db push` | adminシステムのDBと衝突するリスク |
| HPからDB直接接続 | データ整合性の破壊リスク |
| adminの機能をHPで再実装 | APIで利用するだけでよい |
| VPS `.env.local` の直接書き換え | Atsushi が実施する |
| ビルド確認なしの `pm2 restart` | 必ず `npm run build` 後に実行 |
| AI生成コンテンツの自動公開 | 担当者確認後のみ公開 |
