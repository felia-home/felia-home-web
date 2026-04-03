import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

type News = {
  id: string;
  title: string;
  body?: string;
  published_at: string;
  category?: string;
};

async function getNewsItem(id: string): Promise<News | null> {
  try {
    const adminUrl = process.env.ADMIN_API_URL ?? "http://localhost:3001";
    const res = await fetch(`${adminUrl}/api/news/${id}`, {
      next: { revalidate: 600 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.news ?? null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const news = await getNewsItem(params.id);
  if (!news) return { title: "お知らせが見つかりません" };
  return { title: news.title };
}

export default async function NewsDetailPage({ params }: { params: { id: string } }) {
  const news = await getNewsItem(params.id);
  if (!news) notFound();

  return (
    <div className="pt-28 pb-20 bg-[#fafaf8] min-h-screen">
      <div className="container-xl max-w-3xl mx-auto">
        <nav className="text-xs text-[#706e68] flex items-center gap-2 mb-8">
          <Link href="/" className="hover:text-[#1a3a2a]">ホーム</Link>
          <span>/</span>
          <Link href="/news" className="hover:text-[#1a3a2a]">お知らせ</Link>
          <span>/</span>
          <span className="text-[#1c1b18] line-clamp-1">{news.title}</span>
        </nav>

        <div className="bg-white rounded-2xl p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-sm text-[#706e68]">
              {new Date(news.published_at).toLocaleDateString("ja-JP")}
            </span>
            {news.category && (
              <span className="text-xs bg-[#e8f0eb] text-[#1a3a2a] px-2 py-0.5 rounded-full">
                {news.category}
              </span>
            )}
          </div>
          <h1 className="font-serif text-2xl font-bold text-[#1c1b18] mb-8">{news.title}</h1>
          {news.body && (
            <div className="text-sm text-[#1c1b18] leading-relaxed whitespace-pre-line">
              {news.body}
            </div>
          )}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/news"
            className="inline-block border border-[#1a3a2a] text-[#1a3a2a] px-6 py-2.5 rounded-full text-sm hover:bg-[#1a3a2a] hover:text-white transition-colors"
          >
            ← お知らせ一覧へ
          </Link>
        </div>
      </div>
    </div>
  );
}
