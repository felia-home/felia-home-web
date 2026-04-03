import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "お知らせ",
  description: "フェリアホームからのお知らせ・新着情報をご覧いただけます。",
};

type News = {
  id: string;
  title: string;
  body?: string;
  published_at: string;
  category?: string;
};

async function getNews(): Promise<News[]> {
  try {
    const adminUrl = process.env.ADMIN_API_URL ?? "http://localhost:3001";
    const res = await fetch(`${adminUrl}/api/news?status=PUBLISHED`, {
      next: { revalidate: 600 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.news ?? [];
  } catch {
    return [];
  }
}

export default async function NewsPage() {
  const newsList = await getNews();

  return (
    <div className="pt-28 pb-20 bg-[#fafaf8] min-h-screen">
      <div className="container-xl max-w-3xl mx-auto">
        <div className="mb-10">
          <p className="text-[#c9a96e] text-xs tracking-[0.3em] mb-2 font-serif">NEWS</p>
          <h1 className="font-serif text-3xl font-bold text-[#1c1b18]">お知らせ</h1>
        </div>

        {newsList.length > 0 ? (
          <div className="space-y-4">
            {newsList.map((item) => (
              <Link
                key={item.id}
                href={`/news/${item.id}`}
                className="block bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xs text-[#706e68]">
                    {new Date(item.published_at).toLocaleDateString("ja-JP")}
                  </span>
                  {item.category && (
                    <span className="text-xs bg-[#e8f0eb] text-[#1a3a2a] px-2 py-0.5 rounded-full">
                      {item.category}
                    </span>
                  )}
                </div>
                <h2 className="text-[#1c1b18] font-bold hover:text-[#1a3a2a] transition-colors">
                  {item.title}
                </h2>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-8 text-center text-[#706e68]">
            <p>現在お知らせはありません。</p>
          </div>
        )}
      </div>
    </div>
  );
}
