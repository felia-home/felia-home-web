// app/properties/[id]/page.tsx
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import {
  MapPin, Train, Maximize2, LayoutGrid,
  Building2, Calendar, Home, Phone, Mail,
  ChevronRight, Heart, Share2
} from "lucide-react";
import { getPropertyById, getNewProperties } from "@/lib/api";
import { PropertyImageGallery } from "@/components/property/PropertyImageGallery";
import { PropertyCard } from "@/components/property/PropertyCard";

interface PageProps {
  params: { id: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const property = await getPropertyById(params.id);
    return {
      title: `${property.address} ${property.layout} ${property.price != null ? property.price.toLocaleString() : "未定"}万円`,
      description: `${property.propertyType}｜${property.address}｜${property.price != null ? property.price.toLocaleString() : "未定"}万円｜${property.area}㎡｜${property.nearestStation}徒歩${property.walkMinutes}分`,
    };
  } catch {
    return { title: "物件詳細" };
  }
}

export default async function PropertyDetailPage({ params }: PageProps) {
  let property;
  try {
    property = await getPropertyById(params.id);
  } catch {
    notFound();
  }

  // 関連物件（同エリア）
  let relatedProperties: any[] = [];
  try {
    const result = await getNewProperties();
    relatedProperties = result.filter((p: any) => p.id !== params.id).slice(0, 3);
  } catch {}

  const specs = [
    { label: "物件種別",   value: property.propertyType,                         icon: Home },
    { label: "価格",       value: property.price != null ? `${property.price.toLocaleString()}万円` : "未定", icon: null },
    { label: "所在地",     value: property.address,                               icon: MapPin },
    { label: "最寄駅",     value: `${property.nearestStation} 徒歩${property.walkMinutes}分`, icon: Train },
    { label: "面積",       value: property.area ? `${property.area}㎡` : "—",     icon: Maximize2 },
    { label: "間取り",     value: property.layout || "—",                         icon: LayoutGrid },
    { label: "築年月",     value: property.buildingYear ? `${property.buildingYear}年` : "—", icon: Calendar },
    { label: "構造",       value: property.structure || "—",                      icon: Building2 },
    ...(property.managementFee != null ? [{
      label: "管理費", value: property.managementFee != null ? `${property.managementFee.toLocaleString()}円/月` : "なし", icon: null
    }] : []),
    ...(property.repairReserve != null ? [{
      label: "修繕積立金", value: property.repairReserve != null ? `${property.repairReserve.toLocaleString()}円/月` : "なし", icon: null
    }] : []),
  ];

  return (
    <div className="bg-white min-h-screen">
      {/* パンくず */}
      <div
        className="py-3 border-b"
        style={{ backgroundColor: "#F8F8F8", borderColor: "#E5E5E5" }}
      >
        <div className="container-content">
          <nav className="flex items-center gap-1.5 text-xs text-gray-400 flex-wrap">
            <Link href="/" className="hover:text-gray-600">ホーム</Link>
            <ChevronRight size={10} />
            <Link href="/properties" className="hover:text-gray-600">物件一覧</Link>
            <ChevronRight size={10} />
            <span className="text-gray-600 truncate max-w-[200px]">{property.name}</span>
          </nav>
        </div>
      </div>

      <div className="container-content py-8">
        <div className="grid grid-cols-1 pc:grid-cols-3 gap-8 tb:gap-10">

          {/* 左・メインカラム（PC: 2/3幅） */}
          <div className="pc:col-span-2">
            {/* バッジ */}
            <div className="flex flex-wrap gap-2 mb-3">
              {property.isNew && (
                <span className="text-xs font-bold px-2.5 py-1 rounded text-white" style={{ backgroundColor: "#5BAD52" }}>
                  NEW
                </span>
              )}
              {property.isFeatured && (
                <span className="text-xs font-bold px-2.5 py-1 rounded text-white" style={{ backgroundColor: "#E67E22" }}>
                  厳選
                </span>
              )}
              {property.isMembersOnly && (
                <span className="text-xs font-bold px-2.5 py-1 rounded text-white bg-gray-600">
                  会員限定
                </span>
              )}
              <span className="text-xs px-2.5 py-1 rounded border text-gray-500" style={{ borderColor: "#E5E5E5" }}>
                {property.propertyType}
              </span>
            </div>

            {/* 物件名 */}
            <h1 className="text-xl tb:text-2xl font-bold text-gray-800 mb-1">
              {property.name}
            </h1>
            <p className="text-sm text-gray-500 mb-4 flex items-center gap-1">
              <MapPin size={13} style={{ color: "#5BAD52" }} />
              {property.address}
            </p>

            {/* 価格 */}
            <div
              className="flex items-baseline gap-1 mb-6 pb-6 border-b"
              style={{ borderColor: "#E5E5E5" }}
            >
              <span className="text-3xl tb:text-4xl font-bold" style={{ color: "#5BAD52" }}>
                {property.price != null ? property.price.toLocaleString() : "未定"}
              </span>
              {property.price != null && <span className="text-lg text-gray-500">万円</span>}
            </div>

            {/* 画像ギャラリー */}
            <div className="mb-8">
              <PropertyImageGallery
                images={property.images?.length ? property.images : (property.mainImage ? [property.mainImage] : [])}
                name={property.name}
              />
            </div>

            {/* 物件スペック */}
            <div className="mb-8">
              <h2
                className="font-bold text-lg mb-4 pb-2 border-b"
                style={{ color: "#333", borderColor: "#5BAD52", borderBottomWidth: "2px" }}
              >
                物件概要
              </h2>
              <dl className="grid grid-cols-1 tb:grid-cols-2 gap-0 border-t border-l"
                style={{ borderColor: "#E5E5E5" }}>
                {specs.map(({ label, value }) => (
                  <div
                    key={label}
                    className="flex border-b border-r"
                    style={{ borderColor: "#E5E5E5" }}
                  >
                    <dt
                      className="flex-shrink-0 w-28 px-3 py-2.5 text-xs font-medium text-gray-500 flex items-center"
                      style={{ backgroundColor: "#F8F8F8" }}
                    >
                      {label}
                    </dt>
                    <dd className="flex-1 px-3 py-2.5 text-sm text-gray-700">
                      {value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* 物件説明 */}
            {property.description && (
              <div className="mb-8">
                <h2
                  className="font-bold text-lg mb-4 pb-2 border-b"
                  style={{ color: "#333", borderColor: "#5BAD52", borderBottomWidth: "2px" }}
                >
                  物件説明
                </h2>
                <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
                  {property.description}
                </p>
              </div>
            )}
          </div>

          {/* 右・サイドバー（PC: 1/3幅） */}
          <div className="space-y-4">
            {/* 価格カード（PC: sticky） */}
            <div
              className="bg-white rounded-xl border p-5 pc:sticky pc:top-24"
              style={{ borderColor: "#E5E5E5" }}
            >
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-2xl font-bold" style={{ color: "#5BAD52" }}>
                  {property.price != null ? property.price.toLocaleString() : "未定"}
                </span>
                {property.price != null && <span className="text-gray-500">万円</span>}
              </div>

              {/* 主要スペック */}
              <div className="space-y-1.5 mb-5 text-sm text-gray-600">
                <div className="flex items-center gap-1.5">
                  <Train size={13} style={{ color: "#5BAD52" }} />
                  {property.nearestStation} 徒歩{property.walkMinutes}分
                </div>
                {property.area > 0 && (
                  <div className="flex items-center gap-1.5">
                    <Maximize2 size={13} style={{ color: "#5BAD52" }} />
                    {property.area}㎡
                  </div>
                )}
                {property.layout && (
                  <div className="flex items-center gap-1.5">
                    <LayoutGrid size={13} style={{ color: "#5BAD52" }} />
                    {property.layout}
                  </div>
                )}
              </div>

              {/* CTAボタン */}
              <div className="space-y-2.5">
                <Link
                  href={`/inquiry?propertyId=${property.id}`}
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-lg
                             font-bold text-sm text-white transition-all hover:scale-[1.02]"
                  style={{ backgroundColor: "#5BAD52", boxShadow: "0 2px 8px rgba(91,173,82,0.3)" }}
                >
                  <Mail size={16} />
                  この物件に問い合わせる
                </Link>
                <Link
                  href={`/inquiry?propertyId=${property.id}&type=viewing`}
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-lg
                             font-bold text-sm border transition-colors hover:border-felia-green hover:text-felia-green"
                  style={{ borderColor: "#E5E5E5", color: "#666" }}
                >
                  <Home size={16} />
                  内覧を申し込む
                </Link>
                <div className="flex gap-2">
                  <button
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg
                               border text-xs text-gray-500 hover:border-red-300 hover:text-red-400 transition-colors"
                    style={{ borderColor: "#E5E5E5" }}
                  >
                    <Heart size={14} />
                    お気に入り
                  </button>
                  <button
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg
                               border text-xs text-gray-500 hover:border-gray-400 transition-colors"
                    style={{ borderColor: "#E5E5E5" }}
                  >
                    <Share2 size={14} />
                    シェア
                  </button>
                </div>
              </div>

              {/* 電話 */}
              <div
                className="mt-4 pt-4 border-t text-center"
                style={{ borderColor: "#F0F0F0" }}
              >
                <p className="text-xs text-gray-400 mb-1">お電話でのお問い合わせ</p>
                <a
                  href="tel:03XXXXXXXX"
                  className="font-bold text-lg flex items-center justify-center gap-1.5"
                  style={{ color: "#5BAD52" }}
                >
                  <Phone size={16} />
                  03-XXXX-XXXX
                </a>
                <p className="text-[10px] text-gray-400 mt-0.5">
                  受付時間 10:00〜18:00（水曜定休）
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* 関連物件 */}
        {relatedProperties.length > 0 && (
          <div className="mt-16 pt-10 border-t" style={{ borderColor: "#E5E5E5" }}>
            <h2 className="text-xl font-bold text-gray-800 mb-6">関連物件</h2>
            <div className="grid grid-cols-1 tb:grid-cols-3 gap-4">
              {relatedProperties.map((p: any) => (
                <PropertyCard key={p.id} property={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
