// app/staff/[id]/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, User } from "lucide-react";
import { getStaffById } from "@/lib/api";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const staff = await getStaffById(params.id);
  return {
    title: staff ? `${staff.name} | スタッフ紹介` : "スタッフ紹介",
  };
}

export default async function StaffDetailPage({ params }: { params: { id: string } }) {
  const staff = await getStaffById(params.id);
  if (!staff) notFound();

  return (
    <div style={{ backgroundColor: "#ffffff" }}>
      {/* パンくず */}
      <div style={{ backgroundColor: "#F8F8F8", padding: "8px 0" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>
          <nav style={{ fontSize: "12px", color: "#999", display: "flex", alignItems: "center", gap: "4px" }}>
            <Link href="/" style={{ color: "#999", textDecoration: "none" }}>TOP</Link>
            <ChevronRight size={12} />
            <Link href="/staff" style={{ color: "#999", textDecoration: "none" }}>スタッフ紹介</Link>
            <ChevronRight size={12} />
            <span style={{ color: "#333" }}>{staff.name}</span>
          </nav>
        </div>
      </div>

      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "32px 24px 64px" }}>
        {/* ヘッダー */}
        <div style={{ marginBottom: "32px" }}>
          <p style={{ fontSize: "12px", color: "#888", marginBottom: "4px" }}>
            {staff.position || staff.department}
          </p>
          <div style={{ display: "flex", alignItems: "baseline", gap: "16px", flexWrap: "wrap" }}>
            <h1 style={{ fontSize: "clamp(24px, 3vw, 32px)", fontWeight: "bold", color: "#1a1a1a", fontFamily: "'Noto Serif JP', serif", letterSpacing: "0.1em" }}>
              {staff.name}
            </h1>
            {staff.name_kana && (
              <span style={{ fontSize: "13px", color: "#888", letterSpacing: "0.1em" }}>{staff.name_kana}</span>
            )}
          </div>
        </div>

        {/* メイン画像 */}
        {staff.photo_url ? (
          <div style={{ position: "relative", width: "100%", height: "clamp(280px, 45vw, 500px)", borderRadius: "8px", overflow: "hidden", marginBottom: "40px" }}>
            <Image
              src={staff.photo_url}
              alt={staff.name}
              fill
              style={{ objectFit: "cover", objectPosition: "center top" }}
              priority
              sizes="900px"
            />
          </div>
        ) : (
          <div style={{ position: "relative", width: "100%", height: "clamp(280px, 45vw, 500px)", borderRadius: "8px", overflow: "hidden", marginBottom: "40px", backgroundColor: "#F0F5F0", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <User size={80} style={{ color: "#ccc" }} />
          </div>
        )}

        {/* キャッチフレーズ */}
        {staff.catchphrase && (
          <div style={{ marginBottom: "32px", padding: "24px 32px", backgroundColor: "#F0F5F0", borderRadius: "8px", borderLeft: "4px solid #5BAD52" }}>
            <p style={{ fontSize: "clamp(14px, 1.8vw, 18px)", fontWeight: "bold", color: "#1a1a1a", lineHeight: 1.8, fontFamily: "'Noto Serif JP', serif" }}>
              {staff.catchphrase}
            </p>
          </div>
        )}

        {/* プロフィール文 */}
        {staff.bio && (
          <div style={{ marginBottom: "40px" }}>
            <p style={{ fontSize: "14px", color: "#555", lineHeight: 2 }}>{staff.bio}</p>
          </div>
        )}

        {/* 詳細情報 */}
        {(staff.qualification || staff.favorite_word || staff.hobby || staff.memorable_client) && (
          <div style={{ marginBottom: "40px", display: "flex", flexDirection: "column", gap: "20px" }}>
            {[
              { label: "資格", value: staff.qualification },
              { label: "好きな言葉", value: staff.favorite_word },
              { label: "趣味", value: staff.hobby },
              { label: "印象に残っているお客様は？", value: staff.memorable_client },
            ].filter(item => item.value).map((item) => (
              <div key={item.label} style={{ borderBottom: "1px solid #F0F0F0", paddingBottom: "16px" }}>
                <p style={{ fontSize: "12px", color: "#5BAD52", fontWeight: "bold", marginBottom: "6px" }}>{item.label}</p>
                <p style={{ fontSize: "14px", color: "#333", lineHeight: 1.8, whiteSpace: "pre-line" }}>{item.value}</p>
              </div>
            ))}
          </div>
        )}

        {/* サブ画像 */}
        {staff.sub_images && staff.sub_images.length > 0 && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "16px", marginBottom: "40px" }}>
            {staff.sub_images.map((url, i) => (
              <div key={i} style={{ position: "relative", aspectRatio: "4/3", borderRadius: "8px", overflow: "hidden" }}>
                <Image
                  src={url}
                  alt={`${staff.name} ${i + 1}`}
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="50vw"
                />
              </div>
            ))}
          </div>
        )}

        {/* 一覧に戻る */}
        <div style={{ textAlign: "center", marginTop: "48px" }}>
          <Link
            href="/staff"
            style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              padding: "12px 32px", border: "1px solid #E5E5E5",
              borderRadius: "8px", color: "#555", fontSize: "14px",
              textDecoration: "none",
            }}
          >
            ← 一覧に戻る
          </Link>
        </div>
      </div>
    </div>
  );
}
