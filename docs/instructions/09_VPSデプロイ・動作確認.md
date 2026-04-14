# 指示文 09 — VPS デプロイ・動作確認

## 概要

ローカルで完成した felia-home-web を VPS に本番デプロイし、
全機能の動作を確認する。

**この指示文は Claude Code ではなく Atsushi が SSH で直接実行する。**

---

## 事前確認

### ローカルで最終ビルドを確認

```bash
cd C:\Users\User\projects\felia-home-web
npm run build
```
エラーがないことを確認してから VPS 作業に進む。

### git push 済みであることを確認

```bash
git log --oneline -3
git status
```
`nothing to commit` であること。

---

## Step 1: VPS に SSH 接続

```bash
ssh ubuntu@49.212.210.97
```

---

## Step 2: Admin システムが起動中か確認

HP は Admin API（ポート 3001）に依存しているため、先に起動確認する。

```bash
pm2 list
```

`felia-property` が `online` であることを確認。
`stopped` の場合は起動する:

```bash
pm2 start felia-property
```

---

## Step 3: .env.local の内容を確認・更新

```bash
cat /var/www/felia-home-web/.env.local
```

以下の内容がすべて揃っているか確認する:

```
ADMIN_API_URL=http://localhost:3001
NEXTAUTH_URL=https://index.felia-home.co.jp
NEXTAUTH_SECRET=felia2026-member-secret-xk9mq2
NEXT_PUBLIC_SITE_URL=https://index.felia-home.co.jp
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=（取得済みの場合は設定）
```

不足している行があれば追記:

```bash
nano /var/www/felia-home-web/.env.local
```

> ⚠️ `ADMIN_API_URL` が欠けていると全 API コールが失敗する。必ず確認すること。

---

## Step 4: デプロイ実行（スワップファイル付き）

Next.js のビルドはメモリを大量に消費する。
スワップファイルを作成してからビルドする。

```bash
# 1コマンドで全工程を実行
sudo fallocate -l 1G /swapfile2 \
  && sudo chmod 600 /swapfile2 \
  && sudo mkswap /swapfile2 \
  && sudo swapon /swapfile2 \
  && cd /var/www/felia-home-web \
  && git pull origin main \
  && npm install \
  && npm run build \
  && pm2 restart felia-home-web \
  && sudo swapoff /swapfile2 \
  && sudo rm /swapfile2
```

**各工程の所要時間の目安:**
- `git pull`: 数秒
- `npm install`: 30秒〜1分
- `npm run build`: 2〜4分（メモリ次第）
- `pm2 restart`: 数秒

---

## Step 5: デプロイ結果の確認

```bash
# PM2 ステータス確認
pm2 list

# ログでエラーがないか確認（30行）
pm2 logs felia-home-web --lines 30
```

`felia-home-web` が `online` で、ログにエラーがないことを確認。

---

## Step 6: 本番サイトの動作確認チェックリスト

ブラウザで `https://index.felia-home.co.jp` を開いて以下を確認する。

### 6-1. 全体表示

- [ ] ページが表示される（502 / 500 エラーが出ない）
- [ ] 背景が白（`#ffffff`）である
- [ ] ヘッダーが表示される（ロゴ・ナビゲーション）
- [ ] フッターが表示される（グレー背景・4カラム）

### 6-2. ヘッダー・メニュー

- [ ] ≡ メニューを押すとドロワーが右からスライドインする
- [ ] 「買いたい」「売りたい」「サービス」「私たちについて」の ＋ を押すとサブメニューが展開する
- [ ] × ボタンまたは背景クリックでドロワーが閉じる

### 6-3. HeroSlider

- [ ] スライダーが表示される
- [ ] 3秒で自動切り替えされる
- [ ] 左右矢印・ドットで手動切り替えができる

### 6-4. Felia Selection（厳選物件）

- [ ] Admin API との接続が取れている場合、物件カードが表示される
- [ ] 接続がない場合「厳選物件は準備中です」が表示される（クラッシュしない）

### 6-5. Recommend（エリア別）

- [ ] 4グループ × 4枚の区カードが表示される
- [ ] 画像が読み込めた区は写真、それ以外はグラデーション
- [ ] カードクリックで `/properties?area=区名` に遷移する

### 6-6. NEW / News（2カラム）

- [ ] 2カラムが左右に並んで表示される
- [ ] API 接続がない場合「ありません」表示（クラッシュしない）

### 6-7. 会員登録誘導バナー

- [ ] グリーングラデーションのバナーが表示される
- [ ] 「無料会員登録はこちら」ボタンが表示される

### 6-8. Search セクション

- [ ] SVG マップが表示される
- [ ] 17区がホバーで緑色になる
- [ ] 城東エリアがグレーのまま変化しない
- [ ] 路線タグが4グループ表示される

### 6-9. 買い替え誘導バナー

- [ ] ネイビーグラデーションのバナーが表示される

### 6-10. Access

- [ ] 会社情報カードが表示される
- [ ] `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` 設定済みの場合 Google マップが表示される
- [ ] 未設定の場合、緑背景のプレースホルダーが表示される

### 6-11. 物件一覧

- [ ] `https://index.felia-home.co.jp/properties` でページが表示される
- [ ] フィルター（物件種別・価格帯・並び順）が表示される
- [ ] Admin API 接続ありの場合、物件カードが表示される

### 6-12. 会員登録・ログイン

- [ ] `https://index.felia-home.co.jp/members/register` でフォームが表示される
- [ ] `https://index.felia-home.co.jp/members/login` でフォームが表示される

### 6-13. マイページ（認証）

- [ ] `/members/mypage` に未ログインでアクセスすると `/members/login` にリダイレクトされる
- [ ] ログイン後に `/members/mypage` が表示される

### 6-14. SP 表示確認

Chrome DevTools で iPhone SE（375px）に設定して確認:
- [ ] ヘッダーが崩れない
- [ ] スライダーが縦長比率で表示される
- [ ] 物件カードが1カラムで表示される

---

## Step 7: Admin API 連携の確認（Admin が起動中の場合）

```bash
# VPS上でAPIの疎通確認
curl -s http://localhost:3001/api/properties?flag=featured | head -c 200
```

JSON レスポンスが返ってくれば Admin API との連携は正常。
`Connection refused` の場合は Admin システムが停止している。

---

## よくあるトラブルと対処

### ビルドが途中でクラッシュする（OOM）

```bash
# スワップが残っていれば削除してやり直し
sudo swapoff /swapfile2 2>/dev/null
sudo rm -f /swapfile2

# 2GB のスワップで再試行
sudo fallocate -l 2G /swapfile2 \
  && sudo chmod 600 /swapfile2 \
  && sudo mkswap /swapfile2 \
  && sudo swapon /swapfile2 \
  && cd /var/www/felia-home-web \
  && npm run build \
  && pm2 restart felia-home-web \
  && sudo swapoff /swapfile2 \
  && sudo rm /swapfile2
```

### pm2 restart 後も古いページが表示される

```bash
# キャッシュをクリアして再起動
pm2 stop felia-home-web
pm2 start felia-home-web
```

### ページが 502 エラーになる

```bash
# PM2 のプロセス名と起動コマンドを確認
pm2 show felia-home-web

# ログでエラー詳細を確認
pm2 logs felia-home-web --lines 50
```

### `ADMIN_API_URL` が効いていない

```bash
# .env.local が正しく配置されているか確認
ls -la /var/www/felia-home-web/.env.local
cat /var/www/felia-home-web/.env.local | grep ADMIN_API_URL
```

### NextAuth のセッションエラー

```bash
# NEXTAUTH_SECRET が .env.local に設定されているか確認
cat /var/www/felia-home-web/.env.local | grep NEXTAUTH
```

---

## デプロイ完了後の確認コマンド（まとめ）

```bash
# 現在の状態を一括確認
pm2 list && echo "---" && \
curl -s -o /dev/null -w "HP HTTP status: %{http_code}\n" https://index.felia-home.co.jp && \
curl -s -o /dev/null -w "Admin API status: %{http_code}\n" http://localhost:3001/api/properties
```

期待される出力:
```
┌─ felia-property   online ─┐
└─ felia-home-web   online ─┘
---
HP HTTP status: 200
Admin API status: 200
```

---

## 完了条件チェックリスト

- [ ] `pm2 list` で `felia-home-web` が `online`
- [ ] `https://index.felia-home.co.jp` が表示される（HTTP 200）
- [ ] トップページの全セクションが表示される
- [ ] ヘッダーのドロワーメニューが動作する
- [ ] `/members/login` でログインページが表示される
- [ ] SP 表示（375px）で崩れがない

---

## デプロイ完了後の次のステップ

トップページと会員機能が本番で動作確認できたら、
以下を **adminシステムのチャット** で実施する:

1. `features`（特集）テーブル・管理画面・API の実装
2. `banners`（フリーバナー）テーブル・管理画面・API の実装
3. `hero_slides`（スライダー）テーブル・管理画面・API の実装

上記完了後に HP 側の Phase 2 実装へ進む:
- `10_Phase2-特集・バナー・スライダーAdmin連携.md`
