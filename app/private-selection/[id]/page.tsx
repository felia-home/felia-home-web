// app/private-selection/[id]/page.tsx
import { getServerSession } from "next-auth";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { getPrivatePropertyById, verifyPrivateSelectionToken } from "@/lib/api";
import {
  getPropertyTitle, getPriceDisplay,
  getAreaDisplay, getPropertyTypeLabel, getCardGradient,
} from "@/lib/privatePropertyHelpers";
import {
  Lock, MapPin, Maximize2, ChevronLeft,
  Mail, Phone, Shield, EyeOff,
} from "lucide-react";

export const metadata = {
  title: "非公開物件詳細 | フェリアホームプライベートセレクション",
  robots: { index: false, follow: false },
};

interface PageProps {
  params: { id: string };
  searchParams: { token?: string };
}

export default async function PrivatePropertyDetailPage({
  params,
  searchParams,
}: PageProps) {
  const session = await getServerSession(authOptions);
  const urlToken = searchParams.token;

  // アクセス制御
  if (!session?.user && !urlToken) {
    redirect("/members/login");
  }

  if (!session?.user && urlToken) {
    const result = await verifyPrivateSelectionToken(urlToken);
    if (!result.valid) {
      if (result.reason === "expired") redirect("/private-selection/expired");
      redirect("/members/login");
    }
  }

  const property = await getPrivatePropertyById(params.id);
  if (!property) notFound();

  const title     = getPropertyTitle(property);
  const price     = getPriceDisplay(property);
  const area      = getAreaDisplay(property);
  const typeLabel = getPropertyTypeLabel(property);
  const gradient  = getCardGradient(property);

  const specs = [
    { label: "物件番号",   value: property.property_no },
    { label: "物件種別",   value: typeLabel },
    { label: "エリア",     value: [property.area, property.town].filter(Boolean).join(" ") || "—" },
    { label: "土地面積",   value: property.area_land_m2  ? `${property.area_land_m2}㎡`  : "—" },
    { label: "建物面積",   value: property.area_build_m2 ? `${property.area_build_m2}㎡` : "—" },
    { label: "仲介手数料", value: property.commission ? `${property.commission.toLocaleString()}万円` : "別途ご相談" },
  ].filter((s) => s.value !== "—");

  return (
    <div style={{ backgroundColor: "#0A1A0F", minHeight: "100vh" }}>

      {/* パンくず */}
      <div className="container-content py-4">
        <Link
          href={urlToken ? `/private-selection?token=${urlToken}` : "/private-selection"}
          className="flex items-center gap-1 text-sm transition-colors hover:opacity-80"
          style={{ color: "rgba(201,168,76,0.6)" }}
        >
          <ChevronLeft size={14} />
          プライベートセレクション一覧
        </Link>
      </div>

      <div className="container-content pb-16">
        <div className="grid grid-cols-1 pc:grid-cols-3 gap-8 tb:gap-10">

          {/* 左・メインカラム */}
          <div className="pc:col-span-2">

            {/* バッジ行 */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span
                className="flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded"
                style={{
                  backgroundColor: "rgba(201,168,76,0.08)",
                  color: "#C9A84C",
                  border: "1px solid rgba(201,168,76,0.3)",
                }}
              >
                <Lock size={10} />
                PRIVATE — ポータルサイト非掲載
              </span>
              <span style={{ color: "rgba(245,240,232,0.35)", fontSize: "11px" }}>
                {typeLabel}
              </span>
            </div>

            {/* 物件名・価格 */}
            <h1
              className="font-bold leading-tight mb-2"
              style={{ color: "#F5F0E8", fontSize: "clamp(18px, 2.5vw, 30px)" }}
            >
              {title}
            </h1>
            <div
              className="flex items-baseline gap-1 mb-6 pb-6"
              style={{ borderBottom: "1px solid rgba(201,168,76,0.15)" }}
            >
              <span
                className="font-bold"
                style={{
                  fontSize: "clamp(28px, 3.5vw, 42px)",
                  color: "#C9A84C",
                  fontFamily: "'Montserrat', sans-serif",
                }}
              >
                {price}
              </span>
            </div>

            {/* ビジュアルエリア（画像なし → グラデーション） */}
            <div
              className="rounded-xl mb-8 flex items-center justify-center"
              style={{
                background: gradient,
                aspectRatio: "16/7",
                border: "1px solid rgba(201,168,76,0.15)",
              }}
            >
              <div className="text-center">
                <Lock size={32} className="mx-auto mb-2" style={{ color: "rgba(201,168,76,0.3)" }} />
                <p style={{ color: "rgba(201,168,76,0.4)", fontSize: "12px", letterSpacing: "0.2em" }}>
                  PRIVATE PROPERTY
                </p>
                <p style={{ color: "rgba(245,240,232,0.2)", fontSize: "11px", marginTop: "4px" }}>
                  No. {property.property_no}
                </p>
              </div>
            </div>

            {/* 物件概要テーブル */}
            <div className="mb-8">
              <h2
                className="font-bold mb-4 pb-2"
                style={{
                  color: "#F5F0E8",
                  borderBottom: "2px solid #C9A84C",
                  fontSize: "16px",
                }}
              >
                物件概要
              </h2>
              <dl
                className="grid grid-cols-1 tb:grid-cols-2 border-t border-l"
                style={{ borderColor: "rgba(201,168,76,0.12)" }}
              >
                {specs.map(({ label, value }) => (
                  <div
                    key={label}
                    className="flex border-b border-r"
                    style={{ borderColor: "rgba(201,168,76,0.12)" }}
                  >
                    <dt
                      className="flex-shrink-0 w-28 px-3 py-3 text-xs font-medium flex items-center"
                      style={{
                        backgroundColor: "rgba(201,168,76,0.04)",
                        color: "rgba(201,168,76,0.6)",
                      }}
                    >
                      {label}
                    </dt>
                    <dd
                      className="flex-1 px-3 py-3 text-sm"
                      style={{ color: "rgba(245,240,232,0.75)" }}
                    >
                      {value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* 備考・説明文 */}
            {property.note && (
              <div>
                <h2
                  className="font-bold mb-3 pb-2"
                  style={{ color: "#F5F0E8", borderBottom: "2px solid #C9A84C", fontSize: "16px" }}
                >
                  物件説明
                </h2>
                <p
                  className="text-sm leading-relaxed whitespace-pre-wrap"
                  style={{ color: "rgba(245,240,232,0.65)" }}
                >
                  {property.note}
                </p>
              </div>
            )}

            {/* 転載禁止注意 */}
            <div
              className="mt-8 p-4 rounded-xl flex items-start gap-3"
              style={{
                backgroundColor: "rgba(201,168,76,0.04)",
                border: "1px solid rgba(201,168,76,0.15)",
              }}
            >
              <EyeOff size={14} className="flex-shrink-0 mt-0.5" style={{ color: "#C9A84C" }} />
              <p className="text-xs leading-relaxed" style={{ color: "rgba(245,240,232,0.4)" }}>
                本物件情報は会員様限定の非公開情報です。
                無断転載・第三者への情報提供は固くお断りしております。
              </p>
            </div>
          </div>

          {/* 右・サイドバー */}
          <div>
            <div
              className="rounded-xl p-5 pc:sticky pc:top-24"
              style={{
                backgroundColor: "#0D2818",
                border: "1px solid rgba(201,168,76,0.25)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
              }}
            >
              {/* 価格 */}
              <div
                className="mb-4 pb-4"
                style={{ borderBottom: "1px solid rgba(201,168,76,0.12)" }}
              >
                <p style={{ color: "rgba(245,240,232,0.4)", fontSize: "11px", marginBottom: "4px" }}>
                  価格
                </p>
                <span
                  className="font-bold"
                  style={{
                    fontSize: "28px",
                    color: "#C9A84C",
                    fontFamily: "'Montserrat', sans-serif",
                  }}
                >
                  {price}
                </span>
              </div>

              {/* スペック */}
              <div
                className="space-y-2 mb-5 text-sm"
                style={{ color: "rgba(245,240,232,0.55)" }}
              >
                {(property.area || property.town) && (
                  <div className="flex items-center gap-2">
                    <MapPin size={12} style={{ color: "#C9A84C" }} />
                    {[property.area, property.town].filter(Boolean).join(" ")}
                  </div>
                )}
                {area !== "—" && (
                  <div className="flex items-center gap-2">
                    <Maximize2 size={12} style={{ color: "#C9A84C" }} />
                    {area}
                  </div>
                )}
              </div>

              {/* CTAボタン */}
              <div className="space-y-2.5">
                <Link
                  href={`/contact?propertyId=${property.id}&type=private&propertyNo=${property.property_no}`}
                  className="flex items-center justify-center gap-2 w-full py-3.5 rounded-lg font-bold text-sm transition-all hover:scale-[1.02]"
                  style={{
                    backgroundColor: "#C9A84C",
                    color: "#0A1A0F",
                    boxShadow: "0 4px 16px rgba(201,168,76,0.3)",
                  }}
                >
                  <Mail size={15} />
                  担当者に相談する
                </Link>
                <a
                  href="tel:03XXXXXXXX"
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-lg font-bold text-sm border transition-colors"
                  style={{ borderColor: "rgba(201,168,76,0.3)", color: "#C9A84C" }}
                >
                  <Phone size={15} />
                  電話で問い合わせる
                </a>
              </div>

              {/* 注意書き */}
              <div
                className="mt-4 pt-4"
                style={{ borderTop: "1px solid rgba(201,168,76,0.08)" }}
              >
                <div className="flex items-start gap-2">
                  <Shield size={10} className="flex-shrink-0 mt-0.5" style={{ color: "rgba(201,168,76,0.4)" }} />
                  <p className="text-[10px] leading-relaxed" style={{ color: "rgba(245,240,232,0.25)" }}>
                    本物件は会員様限定の非公開情報です。第三者への情報提供はご遠慮ください。
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
