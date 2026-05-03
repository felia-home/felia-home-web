// app/staff/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, User } from "lucide-react";
import { getStaffList } from "@/lib/api";

export const metadata: Metadata = {
  title: "スタッフ紹介",
  description: "フェリアホームのスタッフをご紹介します。",
};

export default async function StaffPage() {
  const staffList = await getStaffList();

  // 店舗の表示順を定義
  const STORE_ORDER = ["千駄ヶ谷本店", "幡ヶ谷店", "コンサルティング事業部"];

  // 店舗ごとにグループ分け
  const groups: Record<string, typeof staffList> = {};
  staffList.forEach((s) => {
    const store = s.store_name ?? "その他";
    if (!groups[store]) groups[store] = [];
    groups[store].push(s);
  });

  // 各グループ内をsort_order昇順でソート
  Object.keys(groups).forEach((store) => {
    groups[store].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
  });

  // 店舗を定義順にソート
  const sortedStores = [
    ...STORE_ORDER.filter((s) => groups[s]),
    ...Object.keys(groups).filter((s) => !STORE_ORDER.includes(s)),
  ];

  return (
    <div style={{ backgroundColor: "#ffffff" }}>
      {/* パンくず */}
      <div style={{ backgroundColor: "#F8F8F8", padding: "8px 0" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>
          <nav style={{ fontSize: "12px", color: "#999", display: "flex", alignItems: "center", gap: "4px" }}>
            <Link href="/" style={{ color: "#999", textDecoration: "none" }}>TOP</Link>
            <ChevronRight size={12} />
            <span style={{ color: "#333" }}>スタッフ紹介</span>
          </nav>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px 64px" }}>
        <h1 style={{ fontSize: "clamp(22px, 3vw, 32px)", fontWeight: "bold", color: "#1a1a1a", marginBottom: "48px", fontFamily: "'Noto Serif JP', serif" }}>
          スタッフ紹介
        </h1>

        {sortedStores.map((storeName) => {
          const members = groups[storeName];
          return (
          <div key={storeName} style={{ marginBottom: "56px" }}>
            {/* 店舗名 */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "28px" }}>
              <div style={{ width: "3px", height: "18px", backgroundColor: "#5BAD52", borderRadius: "2px" }} />
              <h2 style={{ fontSize: "15px", fontWeight: "bold", color: "#555" }}>{storeName}</h2>
            </div>

            {/* グリッド */}
            <div className="staff-grid" style={{ display: "grid", gap: "32px" }}>
              {members.map((staff) => (
                <Link
                  key={staff.id}
                  href={`/staff/${staff.id}`}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <div>
                    {/* 写真 */}
                    <div style={{
                      position: "relative", width: "100%", aspectRatio: "16/9",
                      borderRadius: "8px", overflow: "hidden",
                      backgroundColor: "#F0F5F0", marginBottom: "12px",
                    }}>
                      {staff.photo_url ? (
                        <Image
                          src={staff.photo_url}
                          alt={staff.name}
                          fill
                          style={{ objectFit: "cover", objectPosition: "center" }}
                          sizes="(max-width: 768px) 50vw, 33vw"
                        />
                      ) : (
                        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <User size={48} style={{ color: "#ccc" }} />
                        </div>
                      )}
                    </div>
                    {/* テキスト */}
                    <div>
                      {(staff.department || staff.position) && (
                        <p style={{ fontSize: "11px", color: "#888", marginBottom: "2px" }}>
                          {staff.department || staff.position}
                        </p>
                      )}
                      <p style={{ fontSize: "17px", fontWeight: "bold", color: "#1a1a1a", letterSpacing: "0.05em", fontFamily: "'Noto Serif JP', serif" }}>
                        {staff.name}
                      </p>
                      {staff.name_kana && (
                        <p style={{ fontSize: "11px", color: "#888", marginTop: "2px", letterSpacing: "0.05em" }}>
                          {staff.name_kana}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
          );
        })}
      </div>
    </div>
  );
}
