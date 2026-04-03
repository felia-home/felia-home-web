import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "お知らせ",
  description: "フェリアホームからのお知らせ・新着情報をご覧いただけます。",
};

const NEWS_ITEMS = [
  { date: "2026/02/02", title: "目黒区大橋 WEBチラシを公開しました！", slug: "meguro-ohashi-flyer" },
  { date: "2026/01/05", title: "新年のご挨拶", slug: "2026-new-year" },
  { date: "2025/12/08", title: "年末年始のお知らせ", slug: "2025-year-end" },
  { date: "2025/07/31", title: "2025年度：夏季休業日のお知らせ", slug: "2025-summer-holiday" },
  { date: "2025/04/21", title: "新築戸建：北新宿・下井草 WEBチラシを公開しました！", slug: "kitashinjuku-flyer" },
  { date: "2025/01/04", title: "新年のご挨拶", slug: "2025-new-year" },
  { date: "2024/12/16", title: "年末年始のお知らせ", slug: "2024-year-end" },
  { date: "2024/12/10", title: "北区東十条 新築戸建 WEBチラシを公開しました！", slug: "higashi-jujo-flyer" },
  { date: "2024/08/02", title: "2024年度：夏季休業日のお知らせ", slug: "2024-summer-holiday" },
  { date: "2024/06/19", title: "新店舗オープンのお知らせ", slug: "new-store-open" },
];

export default function NewsPage() {
  return (
    <div className="bg-[#fafaf8] min-h-screen">
      {/* ページヘッダー */}
      <section className="pt-28 pb-16 bg-white border-b border-[#e8e6e0]">
        <div className="container-xl">
          <p className="text-[#c9a96e] text-xs tracking-[0.4em] mb-3 font-serif">NEWS</p>
          <h1 className="font-serif text-4xl font-bold text-[#1c1b18]">お知らせ</h1>
        </div>
      </section>

      <div className="py-16">
        <div className="container-xl max-w-3xl mx-auto">
          <div className="space-y-3">
            {NEWS_ITEMS.map((item) => (
              <div
                key={item.slug}
                className="flex flex-col sm:flex-row sm:items-center gap-3 bg-white rounded-2xl px-6 py-5 border border-[#e8e6e0] hover:border-[#c9a96e] transition-colors"
              >
                <span className="text-xs text-[#706e68] whitespace-nowrap font-mono">{item.date}</span>
                <div className="w-px h-4 bg-[#e8e6e0] hidden sm:block flex-shrink-0" />
                <p className="text-sm text-[#1c1b18] leading-relaxed">{item.title}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
