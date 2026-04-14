// app/members/profile/page.tsx
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { getMemberProfileData } from "@/lib/api";
import { ProfileEditForm } from "@/components/members/ProfileEditForm";
import { ChevronLeft } from "lucide-react";

export const metadata = { title: "購入希望条件の変更" };

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/members/login");

  const memberId = (session.user as any).id;
  const profileData = await getMemberProfileData(memberId);

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F8F8F8" }}>
      <div className="bg-white border-b py-6" style={{ borderColor: "#E5E5E5" }}>
        <div className="container-content">
          <Link
            href="/members/mypage"
            className="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600 mb-2"
          >
            <ChevronLeft size={14} /> マイページ
          </Link>
          <h1 className="text-xl font-bold text-gray-800">購入希望条件の変更</h1>
          <p className="text-sm text-gray-500 mt-1">
            ご希望に合った物件をご提案するために使用します
          </p>
        </div>
      </div>

      <div className="container-content py-8">
        <div className="max-w-2xl mx-auto">
          <ProfileEditForm initialData={profileData} />
        </div>
      </div>
    </div>
  );
}
