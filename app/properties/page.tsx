// app/properties/page.tsx
import { Suspense } from "react";
import type { Metadata } from "next";
import { PropertyCard } from "@/components/property/PropertyCard";
import { PropertyListFilter } from "@/components/property/PropertyListFilter";
import { Pagination } from "@/components/property/Pagination";
import { getProperties, type PropertyListResponse } from "@/lib/api";

interface PageProps {
  searchParams: {
    area?: string;
    line?: string;
    flag?: string;
    type?: string;
    priceMin?: string;
    priceMax?: string;
    layout?: string;
    page?: string;
    sort?: string;
  };
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const area = searchParams.area;
  const flag = searchParams.flag;
  const title = area
    ? `${area}の物件一覧`
    : flag === "featured"
    ? "厳選物件一覧"
    : flag === "new"
    ? "新着物件一覧"
    : "物件一覧";

  return {
    title,
    description: `フェリアホームの${title}。東京都内の戸建て・マンション・土地を多数掲載。`,
  };
}

export default async function PropertiesPage({ searchParams }: PageProps) {
  const page = Number(searchParams.page) || 1;
  const sort = (searchParams.sort as any) || "newest";

  let result: PropertyListResponse = { properties: [], total: 0, page: 1, limit: 12, totalPages: 0 };
  try {
    result = await getProperties({
      area:     searchParams.area,
      line:     searchParams.line,
      flag:     searchParams.flag as any,
      type:     searchParams.type,
      priceMin: searchParams.priceMin ? Number(searchParams.priceMin) : undefined,
      priceMax: searchParams.priceMax ? Number(searchParams.priceMax) : undefined,
      layout:   searchParams.layout,
      page,
      limit:    12,
      sort,
    });
  } catch {
    // Admin API 未起動時はエラーにしない
  }

  // ページタイトル
  const pageTitle = searchParams.area
    ? `${searchParams.area}の物件`
    : searchParams.line
    ? `${searchParams.line}沿線の物件`
    : searchParams.flag === "featured"
    ? "厳選物件"
    : searchParams.flag === "new"
    ? "新着物件"
    : "すべての物件";

  return (
    <div className="bg-white min-h-screen">
      {/* ページヘッダー */}
      <div
        className="py-8 tb:py-10"
        style={{ backgroundColor: "#F8F8F8", borderBottom: "1px solid #E5E5E5" }}
      >
        <div className="container-content">
          {/* パンくず */}
          <nav className="text-xs text-gray-400 mb-2">
            <span>ホーム</span>
            <span className="mx-1.5">›</span>
            <span className="text-gray-600">物件一覧</span>
            {searchParams.area && (
              <>
                <span className="mx-1.5">›</span>
                <span className="text-gray-600">{searchParams.area}</span>
              </>
            )}
          </nav>
          <h1 className="text-2xl tb:text-3xl font-bold text-gray-800">
            {pageTitle}
          </h1>
        </div>
      </div>

      <div className="container-content py-8">
        {/* フィルター */}
        <Suspense fallback={<div className="h-20 bg-gray-50 rounded-xl mb-6 animate-pulse" />}>
          <PropertyListFilter total={result.total} />
        </Suspense>

        {/* 物件グリッド */}
        {result.properties.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-gray-400 text-lg mb-2">物件が見つかりませんでした</p>
            <p className="text-gray-300 text-sm">条件を変えて再検索してください</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 tb:grid-cols-2 pc:grid-cols-3 gap-4 tb:gap-5">
              {result.properties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>

            {/* ページネーション */}
            <Suspense fallback={null}>
              <Pagination
                currentPage={result.page}
                totalPages={result.totalPages}
              />
            </Suspense>
          </>
        )}
      </div>
    </div>
  );
}
