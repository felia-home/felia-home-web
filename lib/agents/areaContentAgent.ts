// lib/agents/areaContentAgent.ts

export interface AreaContent {
  areaName: string;
  catchCopy: string;    // キャッチコピー（20字以内）
  description: string;  // エリア説明（80〜120字）
  highlights: string[]; // 生活ポイント（3項目）
  keywords: string[];   // SEOキーワード（5個）
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
