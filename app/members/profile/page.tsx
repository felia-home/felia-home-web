// app/members/profile/page.tsx
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { authOptions } from "@/lib/auth";
import { getMemberProfileData } from "@/lib/api";
import { ProfileEditForm } from "@/components/members/ProfileEditForm";

export const metadata = { title: "購入希望条件の変更 | フェリアホーム" };

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/members/login");
  const memberId = (session.user as any).id;

  let profileData = null;
  try {
    profileData = await getMemberProfileData(memberId);
  } catch {}

  return (
    <main style={{ backgroundColor: "#f8f8f8", minHeight: "100vh" }}>
      {/* ヘッダー */}
      <div style={{ backgroundColor: "#fff", borderBottom: "1px solid #E5E5E5", padding: "20px 24px" }}>
        <div style={{ maxWidth: "640px", margin: "0 auto" }}>
          <Link
            href="/members/mypage"
            style={{ display: "inline-flex", alignItems: "center", gap: "4px", fontSize: "13px", color: "#888", textDecoration: "none", marginBottom: "8px" }}
          >
            <ChevronLeft size={14} /> マイページ
          </Link>
          <h1 style={{ fontSize: "20px", fontWeight: "bold", color: "#333", margin: "0 0 4px" }}>
            購入希望条件の変更
          </h1>
          <p style={{ fontSize: "13px", color: "#888", margin: 0 }}>
            希望する条件を登録・更新してください
          </p>
        </div>
      </div>

      {/* フォーム */}
      <div style={{ maxWidth: "640px", margin: "0 auto", padding: "24px 24px 80px" }}>
        <ProfileEditForm initialData={profileData} />
      </div>
    </main>
  );
}
