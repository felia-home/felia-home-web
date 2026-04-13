// components/home/OpenHouseAndInfoSection.tsx
import Link from "next/link";
import { ArrowRight, MapPin, Info } from "lucide-react";
import { getOpenHouses, getNews } from "@/lib/api";
import type { OpenHouse, NewsItem } from "@/lib/api";

export async function OpenHouseAndInfoSection() {
  let openHouses: OpenHouse[] = [];
  let infoItems: NewsItem[] = [];

  try {
    [openHouses, infoItems] = await Promise.all([
      getOpenHouses(),
      getNews(5),
    ]);
  } catch {
    // Admin APIが未起動の場合はスキップ
  }

  return (
    <section className="section-padding bg-white">
      <div className="container-content">
        <div className="grid grid-cols-1 tb:grid-cols-2 gap-8 tb:gap-12">

          {/* 左: 現地販売会 */}
          <div>
            <div className="flex items-end justify-between mb-6">
              <div>
                <span
                  className="font-montserrat font-bold text-2xl tb:text-3xl tracking-wider"
                  style={{ color: "#5BAD52", fontFamily: "'Montserrat', sans-serif" }}
                >
                  Open House
                </span>
                <p className="text-xs text-gray-400 tracking-widest mt-1">現地販売会情報</p>
                <div className="mt-2 w-8 h-0.5" style={{ backgroundColor: "#5BAD52" }} />
              </div>
              <Link
                href="/open-houses"
                className="text-xs flex items-center gap-1 hover:gap-2 transition-all"
                style={{ color: "#5BAD52" }}
              >
                もっと見る <ArrowRight size={12} />
              </Link>
            </div>

            <div className="space-y-4">
              {openHouses.length === 0 ? (
                <p className="text-sm text-gray-400 py-4">現地販売会の予定はありません</p>
              ) : (
                openHouses.slice(0, 3).map((oh) => (
                  <OpenHouseCard key={oh.id} openHouse={oh} />
                ))
              )}
            </div>
          </div>

          {/* 右: お知らせ */}
          <div>
            <div className="flex items-end justify-between mb-6">
              <div>
                <span
                  className="font-montserrat font-bold text-2xl tb:text-3xl tracking-wider text-gray-700"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                >
                  Information
                </span>
                <p className="text-xs text-gray-400 tracking-widest mt-1">お知らせ</p>
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
              {infoItems.length === 0 ? (
                <p className="text-sm text-gray-400 py-4">お知らせはありません</p>
              ) : (
                infoItems.map((item) => (
                  <InfoRow key={item.id} item={item} />
                ))
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

// 現地販売会カード
function OpenHouseCard({ openHouse }: { openHouse: OpenHouse }) {
  const dateObj = new Date(openHouse.date);
  const month = dateObj.getMonth() + 1;
  const day = dateObj.getDate();
  const weekdays = ["日", "月", "火", "水", "木", "金", "土"];
  const weekday = weekdays[dateObj.getDay()];

  return (
    <Link
      href={`/properties/${openHouse.propertyId}`}
      className="group flex gap-3 p-3 rounded-lg border hover:shadow-sm transition-all"
      style={{ borderColor: "#E5E5E5" }}
    >
      {/* 日付ブロック */}
      <div
        className="flex-shrink-0 w-14 rounded flex flex-col items-center justify-center py-2"
        style={{ backgroundColor: "#EBF7EA" }}
      >
        <span className="font-montserrat font-bold text-xl leading-none" style={{ color: "#5BAD52" }}>
          {day}
        </span>
        <span className="text-[10px] text-gray-500 mt-0.5">
          {month}月（{weekday}）
        </span>
        <span className="text-[9px] text-gray-400 mt-0.5">
          {openHouse.startTime}〜
        </span>
      </div>

      {/* 物件情報 */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-700 group-hover:text-felia-green leading-snug truncate transition-colors">
          {openHouse.propertyName}
        </p>
        <div className="flex items-center gap-1 mt-1">
          <MapPin size={10} style={{ color: "#5BAD52" }} />
          <span className="text-xs text-gray-400 truncate">{openHouse.address}</span>
        </div>
        <div className="mt-1.5">
          <span
            className="text-[10px] font-medium px-2 py-0.5 rounded"
            style={{ backgroundColor: "#EBF7EA", color: "#5BAD52" }}
          >
            現地販売会
          </span>
        </div>
      </div>
    </Link>
  );
}

// お知らせ行
function InfoRow({ item }: { item: NewsItem }) {
  const date = new Date(item.publishedAt).toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  return (
    <Link
      href={`/news/${item.slug}`}
      className="flex items-start gap-3 py-3.5 hover:bg-gray-50 -mx-2 px-2 rounded group transition-colors"
    >
      <Info size={13} className="flex-shrink-0 mt-0.5" style={{ color: "#5BAD52" }} />
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-700 group-hover:text-felia-green truncate transition-colors">
          {item.title}
        </p>
        <span className="text-[10px] text-gray-300">{date}</span>
      </div>
    </Link>
  );
}
