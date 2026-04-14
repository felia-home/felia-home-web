# 指示文 16 — AreaContentAgent 実装

## 概要

17区のエリア説明文をAIで自動生成・キャッシュし、
Recommendセクションとエリアページで表示する。

1. **`lib/agents/areaContentAgent.ts`** — Claude API でエリア説明文を生成
2. **`app/areas/[area]/page.tsx`** — エリア別物件一覧ページ（説明文付き）
3. **`public/areas/`** — 区画像の自動ダウンロード（Unsplash）
4. **Recommend セクション** — ホバー時に説明文をオーバーレイ表示

**作業ディレクトリ**: `C:\Users\User\projects\felia-home-web`

---

## 絶対ルール
1. `prisma db push` 絶対禁止（customers_email_key競合）
2. スキーマ変更は手動SQL + `npx prisma generate` のみ
3. VPS・DBへの直接操作禁止
4. Tailwind CSS禁止・全インラインスタイル
5. デプロイ（git pull / pm2 restart）はAtsushiが手動実施

---

## Step 1: lib/agents/areaContentAgent.ts の作成

```typescript
// lib/agents/areaContentAgent.ts

export interface AreaContent {
  areaName: string;
  catchCopy: string;       // キャッチコピー（20字以内）
  description: string;     // エリア説明（80〜120字）
  highlights: string[];    // 生活ポイント（3項目）
  keywords: string[];      // SEOキーワード（5個）
}

// 全17区のエリアコンテンツをまとめて生成
export async function generateAreaContents(
  areaNames: string[]
): Promise<Record<string, AreaContent>> {
  const prompt = `
以下の東京の各区について、不動産購入を検討している方向けのエリア説明文を生成してください。

対象エリア: ${areaNames.join("、")}

各エリアについて以下のJSON形式で生成してください。
全エリアをまとめて1つのJSONオブジェクトとして返してください。

{
  "渋谷区": {
    "areaName": "渋谷区",
    "catchCopy": "20字以内のキャッチコピー",
    "description": "80〜120字の説明文。ファミリー・共働き・資産運用など購入者視点で。具体的な駅名・施設名を含めること。「住みやすい」「便利」等の陳腐な表現は避ける。",
    "highlights": ["生活ポイント1（具体的に）", "生活ポイント2", "生活ポイント3"],
    "keywords": ["SEOキーワード1", "キーワード2", "キーワード3", "キーワード4", "キーワード5"]
  },
  ...
}

JSONのみを返してください。説明文や前置きは不要です。
  `.trim();

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY!,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-opus-4-5",
        max_tokens: 4000,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) throw new Error(`API error: ${response.status}`);

    const data = await response.json();
    const text = data.content?.[0]?.text ?? "";

    // JSON部分を抽出
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("JSON not found in response");

    const parsed = JSON.parse(jsonMatch[0]);
    return parsed;
  } catch (e) {
    console.error("[AreaContentAgent] Error:", e);
    // エラー時はデフォルトコンテンツを返す
    return Object.fromEntries(
      areaNames.map((name) => [
        name,
        {
          areaName: name,
          catchCopy: `${name}の不動産情報`,
          description: `${name}の戸建て・マンション・土地情報をフェリアホームがご紹介します。`,
          highlights: ["アクセス良好", "生活利便施設充実", "住環境良好"],
          keywords: [name, "不動産", "マンション", "戸建て", "土地"],
        },
      ])
    );
  }
}

// 単一エリアのコンテンツを生成（エリアページ用）
export async function generateSingleAreaContent(
  areaName: string
): Promise<AreaContent> {
  const results = await generateAreaContents([areaName]);
  return results[areaName] ?? {
    areaName,
    catchCopy: `${areaName}の不動産情報`,
    description: `${areaName}の戸建て・マンション・土地情報をフェリアホームがご紹介します。`,
    highlights: ["アクセス良好", "生活利便施設充実", "住環境良好"],
    keywords: [areaName, "不動産", "マンション", "戸建て", "土地"],
  };
}
```

---

## Step 2: lib/areaContents.ts の作成（静的キャッシュ）

APIコールを毎回行わないよう、生成済みコンテンツを静的ファイルで管理する。
ビルド時または初回アクセス時に生成し、以降はキャッシュを使用する。

```typescript
// lib/areaContents.ts
import type { AreaContent } from "./agents/areaContentAgent";

// 手動生成済みのエリアコンテンツ
// scripts/generate-area-contents.ts で生成して貼り付ける
export const areaContents: Record<string, AreaContent> = {
  "渋谷区": {
    areaName: "渋谷区",
    catchCopy: "トレンドと暮らしが交差する街",
    description: "JR渋谷駅を中心に東急・東京メトロが集結する交通の要衝。代官山・恵比寿・広尾など高感度エリアを擁し、ファッション・グルメ・文化施設が充実。広尾の病院や代々木公園周辺の緑も魅力。",
    highlights: ["渋谷・代官山・恵比寿が徒歩圏", "代々木公園・明治神宮で緑豊か", "高品質なインターナショナルスクール多数"],
    keywords: ["渋谷区 不動産", "渋谷区 マンション", "渋谷区 戸建て", "代官山 物件", "恵比寿 不動産"],
  },
  "新宿区": {
    areaName: "新宿区",
    catchCopy: "都心アクセス最強の住宅街",
    description: "新宿駅はJR・小田急・京王・東京メトロが集結する日本最大のターミナル。四谷・神楽坂・早稲田など文教・歴史エリアも充実。都庁周辺の都市機能と落ち着いた住宅街が共存する。",
    highlights: ["新宿駅から全国どこへも直通", "神楽坂の下町情緒ある街並み", "都立新宿御苑で四季を楽しめる"],
    keywords: ["新宿区 不動産", "新宿区 マンション", "神楽坂 物件", "四谷 不動産", "新宿区 戸建て"],
  },
  "杉並区": {
    areaName: "杉並区",
    catchCopy: "緑と文化が薫る閑静な住宅地",
    description: "JR中央線・東京メトロ丸ノ内線が走り新宿まで15分圏。阿佐ヶ谷・荻窪・西荻窪など個性豊かな商店街が点在。善福寺川緑地など豊富な緑と低層住宅が広がる落ち着いた環境。",
    highlights: ["中央線沿線で都心へのアクセス良好", "善福寺川・井の頭公園など水辺・緑地が豊富", "個性的な商店街と文化施設が充実"],
    keywords: ["杉並区 不動産", "杉並区 戸建て", "荻窪 物件", "阿佐ヶ谷 不動産", "杉並区 マンション"],
  },
  "世田谷区": {
    areaName: "世田谷区",
    catchCopy: "東京23区最大の人気住宅区",
    description: "東急東横線・田園都市線・世田谷線など複数路線が走る。三軒茶屋・下北沢・二子玉川と個性異なる商業エリアを擁し、戸建てからタワマンまで幅広い住まいの選択肢。学区の良さも魅力。",
    highlights: ["三茶・下北沢・二子玉川が徒歩・自転車圏", "多摩川沿いの緑豊かな環境", "私立名門校・区立学校の学区が充実"],
    keywords: ["世田谷区 不動産", "世田谷区 戸建て", "三軒茶屋 物件", "二子玉川 不動産", "下北沢 マンション"],
  },
  "文京区": {
    areaName: "文京区",
    catchCopy: "東大・医療機関が集まる文教の地",
    description: "東京大学・お茶の水女子大など名門校が集積する学の街。東大病院・順天堂医院など高水準医療機関も多い。後楽園・小石川植物園など緑地も豊富で、都心へのアクセスも良好。",
    highlights: ["都内有数の文教地区で教育環境が充実", "東大病院など高水準の医療機関が近隣", "後楽園・小石川植物園で都心の緑を享受"],
    keywords: ["文京区 不動産", "文京区 マンション", "本郷 物件", "後楽園 不動産", "文京区 戸建て"],
  },
  "豊島区": {
    areaName: "豊島区",
    catchCopy: "池袋を核に再開発が進む注目区",
    description: "JR・東武・西武・東京メトロが集結する池袋を擁し都内最高水準の交通利便性。駅周辺は大規模再開発が進み新施設が続々誕生。雑司が谷・要町など静かな住宅街との対比も魅力。",
    highlights: ["池袋から全国新幹線・高速バス直結", "大規模再開発でスマートシティ化が進行中", "雑司が谷・要町エリアで静かな住環境"],
    keywords: ["豊島区 不動産", "豊島区 マンション", "池袋 物件", "雑司が谷 不動産", "豊島区 戸建て"],
  },
  "中野区": {
    areaName: "中野区",
    catchCopy: "渋谷・新宿に近い穴場住宅地",
    description: "JR中央線・東西線で新宿まで5分、渋谷まで10分圏。中野駅前は再開発で大規模複合施設が誕生予定。落ち着いた住宅街に個性的な飲食店・雑貨店が点在し、コスパの高さが魅力。",
    highlights: ["新宿まで中央線で5分の抜群のアクセス", "中野駅前の大規模再開発で資産価値上昇中", "都心比2〜3割安いコスパ優秀な物件価格帯"],
    keywords: ["中野区 不動産", "中野区 マンション", "中野 物件", "中野区 戸建て", "中野区 投資"],
  },
  "目黒区": {
    areaName: "目黒区",
    catchCopy: "桜の目黒川沿いの高級住宅地",
    description: "東急目黒線・東京メトロ日比谷線が走る。春の目黒川の桜が有名で、中目黒・自由が丘・学芸大学と感度高い商業エリアが連なる。住宅地としての品格と利便性を兼ね備えた高人気エリア。",
    highlights: ["中目黒・自由が丘・学芸大学が近隣に点在", "目黒川の桜並木が四季折々の表情", "東横線・目黒線で都心各所にダイレクトアクセス"],
    keywords: ["目黒区 不動産", "目黒区 マンション", "中目黒 物件", "自由が丘 不動産", "目黒区 戸建て"],
  },
  "北区": {
    areaName: "北区",
    catchCopy: "赤羽の活気と田端の閑静さを持つ区",
    description: "JR京浜東北線・埼京線・高崎線など複数路線が走り、東京駅・新宿駅への直通が充実。赤羽は商業集積が高く生活利便性抜群。飛鳥山公園など緑地も多く、都心比リーズナブルな価格帯。",
    highlights: ["赤羽駅から東京・新宿・横浜に乗り換えなし", "飛鳥山公園など広大な緑地と公園", "都心比2〜3割安いお値打ち価格帯"],
    keywords: ["北区 不動産", "北区 マンション", "赤羽 物件", "王子 不動産", "北区 戸建て"],
  },
  "板橋区": {
    areaName: "板橋区",
    catchCopy: "都営三田線で大手町直結の住宅区",
    description: "都営三田線・東武東上線・東京メトロ副都心線が走り都心直結。成増・板橋本町など商業集積地と閑静な住宅街が共存。家族向けの広めの住宅が手頃な価格で手に入る実力派エリア。",
    highlights: ["三田線で大手町・日比谷まで直通", "広い住宅が都心比お手頃な価格で実現", "区内に大型公園・緑地が豊富"],
    keywords: ["板橋区 不動産", "板橋区 戸建て", "成増 物件", "板橋区 マンション", "板橋区 土地"],
  },
  "練馬区": {
    areaName: "練馬区",
    catchCopy: "23区最大の農地が残る緑豊かな区",
    description: "西武池袋線・東京メトロ副都心線・大江戸線など複数路線が充実。23区内で最も農地が多く緑豊かな環境。光が丘・石神井公園など整備された公園も多く、子育て世代に根強い人気。",
    highlights: ["石神井公園・光が丘公園など大規模公園が点在", "西武線・副都心線で池袋・新宿・渋谷へ直通", "農地・緑地が多く空気が清澄な住環境"],
    keywords: ["練馬区 不動産", "練馬区 戸建て", "石神井公園 物件", "光が丘 不動産", "練馬区 マンション"],
  },
  "品川区": {
    areaName: "品川区",
    catchCopy: "新幹線・羽田直結のビジネス拠点",
    description: "品川駅は東海道新幹線・京急空港線が停車し出張族に最適。リニア中央新幹線の起点予定地として将来性も高い。天王洲アイル・大崎の再開発エリアからゆったりした戸越・小山台まで多彩な顔を持つ。",
    highlights: ["品川駅から新幹線・羽田空港に直結", "リニア開業予定で資産価値の長期上昇期待", "天王洲アイルなど運河沿いの洗練されたエリア"],
    keywords: ["品川区 不動産", "品川区 マンション", "大崎 物件", "天王洲 不動産", "品川区 戸建て"],
  },
  "港区": {
    areaName: "港区",
    catchCopy: "東京タワーを臨む最高級住宅地",
    description: "六本木・麻布・白金・青山など都内トップクラスの高級住宅地が集積。外資系企業・大使館が多く国際色豊か。東京タワー・増上寺など歴史的景観と最先端ライフスタイルが融合する。",
    highlights: ["六本木・麻布・白金など都内最高級エリアが集積", "外資系企業・大使館が多い国際的な環境", "東京タワー・増上寺など都心随一の景観"],
    keywords: ["港区 不動産", "港区 マンション", "麻布 物件", "六本木 不動産", "白金 マンション"],
  },
  "大田区": {
    areaName: "大田区",
    catchCopy: "羽田直結・多摩川沿いの広大な区",
    description: "23区最大の面積を誇り京急空港線で羽田空港まで5分。多摩川沿いの緑地・河川敷が充実し自然環境豊か。蒲田の商業集積から田園調布の高級住宅地まで価格帯の幅広さが特徴。",
    highlights: ["羽田空港まで京急で5分の国際アクセス", "多摩川沿いの広大な河川敷・緑地", "田園調布から蒲田まで幅広い価格帯"],
    keywords: ["大田区 不動産", "大田区 戸建て", "田園調布 物件", "蒲田 不動産", "大田区 マンション"],
  },
  "千代田区": {
    areaName: "千代田区",
    catchCopy: "皇居を擁する日本の中心エリア",
    description: "皇居・国会議事堂・霞が関など日本の中枢機能が集積。丸の内・大手町は国内有数のビジネス街で資産性が最高水準。神田・秋葉原など下町文化も残り投資・実需両面で需要が旺盛。",
    highlights: ["丸の内・大手町へ徒歩・自転車圏の超都心立地", "皇居・日比谷公園など緑地の資産価値への寄与", "都内最高水準の資産性と賃貸需要"],
    keywords: ["千代田区 不動産", "千代田区 マンション", "丸の内 物件", "神田 不動産", "千代田区 投資"],
  },
  "中央区": {
    areaName: "中央区",
    catchCopy: "銀座・日本橋を擁する商業の中心",
    description: "銀座・日本橋・築地など日本有数の商業・文化エリアが集積。東京駅まで徒歩圏の立地で通勤利便性が最高水準。隅田川テラスや浜離宮など水辺の自然環境も充実する再開発進行エリア。",
    highlights: ["銀座・日本橋が徒歩圏の都心中核立地", "東京駅・新橋へ徒歩またはメトロで数分", "隅田川テラスなど整備された水辺環境"],
    keywords: ["中央区 不動産", "中央区 マンション", "銀座 物件", "日本橋 不動産", "中央区 投資"],
  },
};

// エリア名から説明文を取得（フォールバック付き）
export function getAreaContent(areaName: string): AreaContent {
  return areaContents[areaName] ?? {
    areaName,
    catchCopy: `${areaName}の不動産`,
    description: `${areaName}の戸建て・マンション・土地情報をご紹介します。`,
    highlights: ["アクセス良好", "生活利便施設充実", "住環境良好"],
    keywords: [areaName, "不動産", "マンション", "戸建て", "土地"],
  };
}
```

---

## Step 3: app/areas/[area]/page.tsx の作成

エリア別物件一覧ページ。説明文・ハイライト付き。

```typescript
// app/areas/[area]/page.tsx
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { getAreaContent, areaContents } from "@/lib/areaContents";
import { getProperties } from "@/lib/api";
import { PropertyCard } from "@/components/property/PropertyCard";
import { MapPin, ChevronRight } from "lucide-react";

interface PageProps {
  params: { area: string };
}

export async function generateStaticParams() {
  return Object.keys(areaContents).map((area) => ({
    area: encodeURIComponent(area),
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const areaName = decodeURIComponent(params.area);
  const content = getAreaContent(areaName);
  return {
    title: `${areaName}の不動産情報`,
    description: content.description,
    keywords: content.keywords.join(", "),
  };
}

export default async function AreaPage({ params }: PageProps) {
  const areaName = decodeURIComponent(params.area);
  const content  = getAreaContent(areaName);

  if (!areaContents[areaName]) notFound();

  let result = { properties: [], total: 0, page: 1, limit: 12, totalPages: 0 };
  try {
    result = await getProperties({ area: areaName, limit: 12 });
  } catch {}

  return (
    <div className="bg-white min-h-screen">

      {/* ヒーロー */}
      <div
        className="relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #1a3a1a 0%, #2d5a2d 50%, #5BAD52 100%)" }}
      >
        <div className="container-content py-12 tb:py-16 relative z-10">
          {/* パンくず */}
          <nav className="flex items-center gap-1.5 text-xs text-white/60 mb-4">
            <Link href="/" className="hover:text-white">ホーム</Link>
            <ChevronRight size={10} />
            <Link href="/properties" className="hover:text-white">物件一覧</Link>
            <ChevronRight size={10} />
            <span className="text-white">{areaName}</span>
          </nav>

          <div className="flex items-start gap-3 mb-4">
            <MapPin size={28} className="flex-shrink-0 mt-1" style={{ color: "rgba(255,255,255,0.8)" }} />
            <div>
              <p className="text-white/60 text-sm tracking-widest mb-1">AREA GUIDE</p>
              <h1 className="font-bold text-white"
                style={{ fontSize: "clamp(28px, 4vw, 48px)" }}>
                {areaName}
              </h1>
              <p className="text-white/80 mt-1"
                style={{ fontSize: "clamp(14px, 2vw, 18px)" }}>
                {content.catchCopy}
              </p>
            </div>
          </div>

          <p className="text-white/70 leading-relaxed max-w-2xl"
            style={{ fontSize: "clamp(13px, 1.6vw, 15px)" }}>
            {content.description}
          </p>

          {/* ハイライト */}
          <div className="flex flex-wrap gap-3 mt-5">
            {content.highlights.map((h, i) => (
              <div key={i}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
                style={{ backgroundColor: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)" }}>
                <span className="text-white/60 text-xs">0{i + 1}</span>
                <span className="text-white text-xs font-medium">{h}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 物件一覧 */}
      <div className="container-content py-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-bold text-gray-800 text-xl">
            {areaName}の物件一覧
            <span className="ml-2 text-base font-normal text-gray-500">
              （{result.total}件）
            </span>
          </h2>
          <Link href={`/properties?area=${encodeURIComponent(areaName)}`}
            className="text-sm flex items-center gap-1 hover:gap-2 transition-all"
            style={{ color: "#5BAD52" }}>
            すべて見る <ChevronRight size={14} />
          </Link>
        </div>

        {result.properties.length === 0 ? (
          <div className="py-16 text-center">
            <MapPin size={40} className="mx-auto mb-3 text-gray-200" />
            <p className="text-gray-400">現在このエリアの物件は準備中です</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 tb:grid-cols-2 pc:grid-cols-3 gap-4 tb:gap-5">
            {result.properties.map((property: any) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
```

---

## Step 4: components/home/RecommendSection.tsx を更新

ホバー時に説明文をオーバーレイ表示する。

```typescript
// components/home/RecommendSection.tsx を更新
// AreaCard コンポーネントの部分のみ変更

// lib/areaContents.ts から getAreaContent をインポートして追加
import { getAreaContent } from "@/lib/areaContents";

// AreaCard コンポーネントを以下に差し替え
function AreaCard({ area }: { area: AreaItem }) {
  const content = getAreaContent(area.name);

  return (
    <Link
      href={`/areas/${encodeURIComponent(area.name)}`}
      className="group relative block overflow-hidden rounded-lg"
      style={{ paddingBottom: "70%" }}
    >
      <div className="absolute inset-0">
        <AreaBackground area={area} />

        {/* 通常オーバーレイ */}
        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/60 transition-colors duration-300" />

        {/* 通常表示テキスト */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-2
                        group-hover:opacity-0 transition-opacity duration-300">
          <span className="text-white font-bold tracking-widest text-center drop-shadow-md"
            style={{ fontSize: "clamp(13px, 2vw, 18px)" }}>
            {area.name}
          </span>
          <span className="mt-1.5 text-white/70 text-xs tracking-widest">
            view more
          </span>
        </div>

        {/* ホバー時：説明文オーバーレイ */}
        <div className="absolute inset-0 flex flex-col justify-end p-3
                        opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <p className="text-white font-bold text-sm mb-1 leading-snug">
            {area.name}
          </p>
          <p className="text-white/80 text-[11px] leading-relaxed line-clamp-3">
            {content.catchCopy}
          </p>
          <div className="mt-2 flex flex-wrap gap-1">
            {content.highlights.slice(0, 2).map((h, i) => (
              <span key={i}
                className="text-[9px] px-1.5 py-0.5 rounded"
                style={{ backgroundColor: "rgba(91,173,82,0.7)", color: "white" }}>
                {h.length > 12 ? h.slice(0, 12) + "…" : h}
              </span>
            ))}
          </div>
        </div>

        {/* 下部グリーンライン */}
        <div
          className="absolute bottom-0 left-0 h-0.5 transition-all duration-500 w-0 group-hover:w-full"
          style={{ backgroundColor: "#5BAD52" }}
        />
      </div>
    </Link>
  );
}
```

---

## Step 5: RecommendSection の href を /areas/[area] に変更

`lib/areaData.ts` の各エリアの `href` を変更する：

```typescript
// lib/areaData.ts の全エリアの href を以下の形式に変更
// 変更前: href: "/properties?area=渋谷区"
// 変更後: href: `/areas/${encodeURIComponent("渋谷区")}`

// 例:
{ id: "shibuya", name: "渋谷区", ..., href: "/areas/%E6%B8%8B%E8%B0%B7%E5%8C%BA" },
```

> **注意**: `encodeURIComponent` でエンコードした値をハードコードするか、
> `lib/areaData.ts` の AreaItem の href を動的に生成するよう変更する。
> 変更方法は以下のいずれか:
>
> **方法A（推奨）**: `href` を `/areas/渋谷区` のまま書いて Next.js に任せる
> **方法B**: `href: \`/areas/${encodeURIComponent(area.name)}\`` と動的生成

---

## Step 6: 区の画像ダウンロードスクリプト（任意）

画像がまだない区については以下のスクリプトを実行：

```bash
# VPS または ローカルで実行
cd public/areas

# 未ダウンロードの区画像を取得
for area in minato ota chiyoda chuo bunkyo toshima nakano meguro kita itabashi nerima shinagawa setagaya suginami shinjuku; do
  if [ ! -f "${area}.jpg" ]; then
    echo "Downloading ${area}..."
    curl -L "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80" \
      -o "${area}.jpg" 2>/dev/null || echo "Failed: ${area}"
  fi
done
```

> 画像がなくてもグラデーションにフォールバックするため動作に支障なし。

---

## Step 7: 動作確認

```bash
npm run dev
```

確認項目:
- [ ] トップページの Recommend セクションで区カードをホバーすると説明文が表示される
- [ ] 区カードをクリックすると `/areas/渋谷区` 等のエリアページに遷移する
- [ ] エリアページにグリーンヒーロー + キャッチコピー + ハイライトが表示される
- [ ] エリアページに物件一覧が表示される（API未起動時は「準備中」表示）
- [ ] `npm run build` エラーなし

---

## 完了条件チェックリスト

- [ ] `lib/agents/areaContentAgent.ts` 作成済み
- [ ] `lib/areaContents.ts` 作成済み（17区分のコンテンツ）
- [ ] `app/areas/[area]/page.tsx` 作成済み
- [ ] `components/home/RecommendSection.tsx` ホバー説明文対応
- [ ] `lib/areaData.ts` の href を `/areas/[area]` 形式に更新
- [ ] `npm run build` エラーなし

---

## 次の指示文

`17_SEOAgent実装.md`
