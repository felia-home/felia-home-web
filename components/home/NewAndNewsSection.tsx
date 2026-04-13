// components/home/NewAndNewsSection.tsx
import Link from "next/link";
import { ArrowRight, Home, Bell } from "lucide-react";
import { getNewProperties, getNews } from "@/lib/api";
import type { Property, NewsItem } from "@/lib/api";

export async function NewAndNewsSection() {
  let newProperties: Property[] = [];
  let newsItems: NewsItem[] = [];

  try {
    [newProperties, newsItems] = await Promise.all([
      getNewProperties(),
      getNews(5),
    ]);
  } catch {
    // Admin APIが未起動の場合はスキップ
  }

  return (
    <section className="section-padding" style={{ backgroundColor: "#F8F8F8" }}>
      <div className="container-content">
        <div className="grid grid-cols-1 tb:grid-cols-2 gap-8 tb:gap-12">

          {/* 左: 新着物件 */}
          <div>
            <div className="flex items-end justify-between mb-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className="font-montserrat font-bold text-2xl tb:text-3xl tracking-wider"
                    style={{ color: "#5BAD52", fontFamily: "'Montserrat', sans-serif" }}
                  >
                    NEW
                  </span>
                </div>
                <p className="text-xs text-gray-400 tracking-widest">新着物件情報</p>
                <div className="mt-2 w-8 h-0.5" style={{ backgroundColor: "#5BAD52" }} />
              </div>
              <Link
                href="/properties?flag=new"
                className="text-xs flex items-center gap-1 hover:gap-2 transition-all"
                style={{ color: "#5BAD52" }}
              >
                もっと見る <ArrowRight size={12} />
              </Link>
            </div>

            <div className="space-y-0 divide-y" style={{ borderColor: "#E5E5E5" }}>
              {newProperties.length === 0 ? (
                <p className="text-sm text-gray-400 py-4">新着物件はありません</p>
              ) : (
                newProperties.slice(0, 5).map((p) => (
                  <NewPropertyRow key={p.id} property={p} />
                ))
              )}
            </div>
          </div>

          {/* 右: お知らせ */}
          <div>
            <div className="flex items-end justify-between mb-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className="font-montserrat font-bold text-2xl tb:text-3xl tracking-wider text-gray-700"
                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                  >
                    News
                  </span>
                </div>
                <p className="text-xs text-gray-400 tracking-widest">新着物件のお知らせ</p>
                <div className="mt-2 w-8 h-0.5 bg-gray-300" />
              </div>
              <Link
                href="/news"
                className="text-xs flex items-center gap-1 hover:gap-2 transition-all"
                style={{ color: "#5BAD52" }}
              >
                もっと見る <ArrowRight size={12} />
              </Link>
            </div>

            <div className="space-y-0 divide-y" style={{ borderColor: "#E5E5E5" }}>
              {newsItems.length === 0 ? (
                <p className="text-sm text-gray-400 py-4">お知らせはありません</p>
              ) : (
                newsItems.map((item) => (
                  <NewsRow key={item.id} item={item} />
                ))
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

// 新着物件の1行
function NewPropertyRow({ property }: { property: Property }) {
  const date = new Date(property.createdAt).toLocaleDateString("ja-JP", {
    month: "2-digit",
    day: "2-digit",
  });

  return (
    <Link
      href={`/properties/${property.id}`}
      className="flex items-start gap-3 py-3.5 hover:bg-white/60 transition-colors -mx-2 px-2 rounded group"
    >
      <Home size={14} className="flex-shrink-0 mt-0.5" style={{ color: "#5BAD52" }} />
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-700 group-hover:text-felia-green truncate leading-snug transition-colors">
          {property.name}
        </p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs text-gray-400">{property.address}</span>
          <span className="text-xs font-medium" style={{ color: "#5BAD52" }}>
            {property.price.toLocaleString()}万円
          </span>
        </div>
      </div>
      <span className="text-[10px] text-gray-300 flex-shrink-0">{date}</span>
    </Link>
  );
}

// お知らせの1行
function NewsRow({ item }: { item: NewsItem }) {
  const date = new Date(item.publishedAt).toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  return (
    <Link
      href={`/news/${item.slug}`}
      className="flex items-start gap-3 py-3.5 hover:bg-white/60 transition-colors -mx-2 px-2 rounded group"
    >
      <Bell size={14} className="flex-shrink-0 mt-0.5 text-gray-400" />
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-700 group-hover:text-felia-green truncate leading-snug transition-colors">
          {item.title}
        </p>
        <span className="text-[10px] text-gray-300 mt-0.5 block">{item.category}</span>
      </div>
      <span className="text-[10px] text-gray-300 flex-shrink-0">{date}</span>
    </Link>
  );
}
