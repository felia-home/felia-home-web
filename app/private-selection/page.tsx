// app/private-selection/page.tsx
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { getPrivateProperties } from "@/lib/api";
import type { PrivateProperty } from "@/lib/api";
import {
  getPropertyTitle, getPriceDisplay,
  getAreaDisplay, getPropertyTypeLabel, getCardGradient,
} from "@/lib/privatePropertyHelpers";
import {
  Lock, MapPin, Maximize2, ChevronRight,
  Shield, Eye, EyeOff, Building2,
} from "lucide-react";

export const metadata = {
  title: "Felia Home Private Selection | フェリアホーム会員限定",
  robots: { index: false, follow: false },
};

export default async function PrivateSelectionPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect("/members/login?callbackUrl=/private-selection");
  }

  const properties = await getPrivateProperties();

  return (
    <div style={{ backgroundColor: "#0A1A0F", minHeight: "100vh" }}>

      {/* ── ヒーローセクション ─────────────────────── */}
      <div
        className="relative overflow-hidden"
        style={{
          background:
            "linear-gradient(160deg, #0A1A0F 0%, #0D2818 50%, #0F3020 100%)",
          borderBottom: "1px solid rgba(201,168,76,0.2)",
        }}
      >
        {/* 背景装飾 */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute top-0 right-0 w-[600px] h-[400px] opacity-5"
            style={{ background: "radial-gradient(circle at 80% 20%, #C9A84C, transparent 60%)" }}
          />
          <div
            className="absolute bottom-0 left-0 w-[400px] h-[300px] opacity-5"
            style={{ background: "radial-gradient(circle at 20% 80%, #5BAD52, transparent 60%)" }}
          />
        </div>

        <div className="container-content py-14 tb:py-20 relative z-10">
          <div className="max-w-3xl mx-auto text-center">

            {/* 会員バッジ */}
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border mb-6"
              style={{
                borderColor: "rgba(201,168,76,0.4)",
                backgroundColor: "rgba(201,168,76,0.08)",
              }}
            >
              <Lock size={11} style={{ color: "#C9A84C" }} />
              <span
                className="text-xs tracking-[0.25em] font-medium"
                style={{ color: "#C9A84C" }}
              >
                MEMBERS ONLY — 非公開物件
              </span>
            </div>

            {/* タイトル */}
            <h1
              className="font-bold leading-tight mb-3"
              style={{
                fontSize: "clamp(26px, 4vw, 48px)",
                color: "#F5F0E8",
                fontFamily: "'Montserrat', sans-serif",
                letterSpacing: "0.02em",
              }}
            >
              Felia Home<br />
              <span style={{ color: "#C9A84C" }}>Private Selection</span>
            </h1>
            <p
              className="font-medium tracking-widest mb-5"
              style={{
                color: "rgba(245,240,232,0.4)",
                fontSize: "11px",
                letterSpacing: "0.3em",
              }}
            >
              フェリアホーム プライベートセレクション
            </p>

            {/* 説明文 */}
            <p
              className="leading-relaxed mb-8 mx-auto"
              style={{
                color: "rgba(245,240,232,0.65)",
                fontSize: "clamp(13px, 1.8vw, 15px)",
                maxWidth: "520px",
                lineHeight: 2,
              }}
            >
              こちらの物件情報は、フェリアホームの会員様のみにご案内する
              非公開物件です。レインズ・SUUMO・アットホーム等の
              不動産ポータルサイトへの掲載は一切行っておりません。
            </p>

            {/* 転載禁止注意書き */}
            <div
              className="inline-flex items-start gap-3 px-5 py-3 rounded-xl text-left max-w-lg"
              style={{
                backgroundColor: "rgba(201,168,76,0.06)",
                border: "1px solid rgba(201,168,76,0.2)",
              }}
            >
              <Shield
                size={13}
                className="flex-shrink-0 mt-0.5"
                style={{ color: "#C9A84C" }}
              />
              <p
                className="text-xs leading-relaxed"
                style={{ color: "rgba(245,240,232,0.5)" }}
              >
                掲載情報の無断転載・スクリーンショットの共有・
                第三者への情報提供は固くお断りしております。
                本情報は会員様個人での参照のみにお使いください。
              </p>
            </div>
          </div>
        </div>

        {/* ゴールドライン */}
        <div
          className="h-px"
          style={{ background: "linear-gradient(90deg, transparent, #C9A84C, transparent)" }}
        />
      </div>

      {/* ── 件数表示 ─────────────────────────────── */}
      <div className="container-content py-5">
        <div className="flex items-center justify-between">
          <p style={{ color: "rgba(245,240,232,0.45)", fontSize: "13px" }}>
            現在
            <span
              className="font-bold mx-1.5"
              style={{ color: "#C9A84C", fontSize: "20px", fontFamily: "'Montserrat', sans-serif" }}
            >
              {properties.length}
            </span>
            件の非公開物件をご案内中
          </p>
          <div
            className="flex items-center gap-1.5"
            style={{ color: "rgba(245,240,232,0.35)", fontSize: "11px" }}
          >
            <Eye size={11} />
            <span>会員限定公開</span>
          </div>
        </div>
      </div>

      {/* ── 物件グリッド ─────────────────────────── */}
      <div className="container-content pb-16">
        {properties.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 tb:grid-cols-2 pc:grid-cols-3 gap-5 tb:gap-6">
            {properties.map((property) => (
              <PrivatePropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </div>

      {/* ── フッターCTA ──────────────────────────── */}
      <div
        className="py-12 text-center"
        style={{ borderTop: "1px solid rgba(201,168,76,0.12)" }}
      >
        <p
          style={{ color: "rgba(245,240,232,0.4)", fontSize: "13px", marginBottom: "16px" }}
        >
          ご希望の条件に合う物件についてお気軽にご相談ください
        </p>
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-lg font-bold text-sm transition-all hover:scale-105"
          style={{
            backgroundColor: "rgba(201,168,76,0.12)",
            color: "#C9A84C",
            border: "1px solid rgba(201,168,76,0.35)",
          }}
        >
          専任担当者に相談する
          <ChevronRight size={16} />
        </Link>
      </div>
    </div>
  );
}

// ── 物件カード ──────────────────────────────────────────────

function PrivatePropertyCard({ property }: { property: PrivateProperty }) {
  const title     = getPropertyTitle(property);
  const price     = getPriceDisplay(property);
  const area      = getAreaDisplay(property);
  const typeLabel = getPropertyTypeLabel(property);
  const gradient  = getCardGradient(property);

  return (
    <Link
      href={`/private-selection/${property.id}`}
      className="group block rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
      style={{
        border: "1px solid rgba(201,168,76,0.15)",
        boxShadow: "0 4px 20px rgba(0,0,0,0.35)",
      }}
    >
      {/* 画像エリア（画像なしのためグラデーション） */}
      <div
        className="relative"
        style={{ paddingBottom: "58%", background: gradient }}
      >
        {/* PRIVATE バッジ */}
        <div className="absolute top-3 left-3 z-10">
          <span
            className="flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded"
            style={{
              backgroundColor: "rgba(0,0,0,0.6)",
              color: "#C9A84C",
              border: "1px solid rgba(201,168,76,0.4)",
              backdropFilter: "blur(4px)",
            }}
          >
            <Lock size={8} />
            PRIVATE
          </span>
        </div>

        {/* 種別バッジ（右上） */}
        <div className="absolute top-3 right-3 z-10">
          <span
            className="text-[10px] px-2 py-0.5 rounded"
            style={{
              backgroundColor: "rgba(0,0,0,0.5)",
              color: "rgba(245,240,232,0.7)",
              border: "1px solid rgba(245,240,232,0.1)",
            }}
          >
            {typeLabel}
          </span>
        </div>

        {/* 物件番号（中央下） */}
        <div className="absolute bottom-3 left-3 z-10">
          <span
            className="text-[10px] font-medium tracking-widest"
            style={{ color: "rgba(201,168,76,0.5)", fontFamily: "'Montserrat', sans-serif" }}
          >
            No. {property.property_no}
          </span>
        </div>

        {/* hover オーバーレイ */}
        <div
          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ backgroundColor: "rgba(0,0,0,0.45)" }}
        >
          <span
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold"
            style={{ backgroundColor: "#C9A84C", color: "#0A1A0F" }}
          >
            詳細を見る <ChevronRight size={14} />
          </span>
        </div>
      </div>

      {/* 情報エリア */}
      <div
        className="p-4"
        style={{
          background: "linear-gradient(180deg, #0D2818 0%, #0A1A0F 100%)",
        }}
      >
        {/* 価格 */}
        <div className="flex items-baseline gap-1 mb-2">
          <span
            className="font-bold"
            style={{
              fontSize: "clamp(18px, 2.2vw, 24px)",
              color: "#C9A84C",
              fontFamily: "'Montserrat', sans-serif",
            }}
          >
            {price}
          </span>
        </div>

        {/* タイトル */}
        <p
          className="font-medium leading-snug mb-3 line-clamp-2"
          style={{ color: "#F5F0E8", fontSize: "14px" }}
        >
          {title}
        </p>

        {/* スペック */}
        <div className="space-y-1.5">
          {(property.area || property.town) && (
            <div
              className="flex items-center gap-1.5"
              style={{ color: "rgba(245,240,232,0.45)", fontSize: "12px" }}
            >
              <MapPin size={10} style={{ color: "#C9A84C" }} />
              <span className="truncate">
                {[property.area, property.town].filter(Boolean).join(" ")}
              </span>
            </div>
          )}
          {area !== "—" && (
            <div
              className="flex items-center gap-1.5"
              style={{ color: "rgba(245,240,232,0.45)", fontSize: "12px" }}
            >
              <Maximize2 size={10} style={{ color: "#C9A84C" }} />
              <span>{area}</span>
            </div>
          )}
        </div>

        {/* 区切りライン */}
        <div
          className="mt-3 pt-3 flex items-center justify-between"
          style={{ borderTop: "1px solid rgba(201,168,76,0.1)" }}
        >
          <span
            className="text-[11px] flex items-center gap-1"
            style={{ color: "rgba(201,168,76,0.5)" }}
          >
            <EyeOff size={10} />
            ポータルサイト非掲載
          </span>
          <span
            className="text-[10px]"
            style={{ color: "rgba(245,240,232,0.25)" }}
          >
            会員限定
          </span>
        </div>
      </div>
    </Link>
  );
}

// ── 空状態 ─────────────────────────────────────────────────

function EmptyState() {
  return (
    <div className="py-28 text-center">
      <div
        className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
        style={{
          backgroundColor: "rgba(201,168,76,0.08)",
          border: "1px solid rgba(201,168,76,0.2)",
        }}
      >
        <Lock size={24} style={{ color: "#C9A84C" }} />
      </div>
      <p style={{ color: "rgba(245,240,232,0.4)", fontSize: "14px", marginBottom: "6px" }}>
        現在、非公開物件は準備中です
      </p>
      <p style={{ color: "rgba(245,240,232,0.25)", fontSize: "12px" }}>
        新着情報はメールにてご連絡いたします
      </p>
    </div>
  );
}
