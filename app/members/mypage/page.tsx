// app/members/mypage/page.tsx
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { getMemberProfile, getMemberInquiries } from "@/lib/api";
import { LogoutButton } from "@/components/members/LogoutButton";
import { User, Heart, FileText, Lock, ChevronRight } from "lucide-react";

export const metadata = { title: "マイページ" };

export default async function MypagePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/members/login");

  const memberId = (session.user as any).id;

  let profile = null;
  let inquiries: any[] = [];
  try {
    [profile, inquiries] = await Promise.all([
      getMemberProfile(memberId),
      getMemberInquiries(memberId),
    ]);
  } catch {}

  const menuItems = [
    { icon: Lock,     label: "プライベートセレクション", sub: "会員限定・非公開物件一覧", href: "/private-selection" },
    { icon: Heart,    label: "お気に入り物件",  sub: "保存した物件を確認",   href: "/members/favorites" },
    { icon: FileText, label: "問い合わせ履歴",  sub: `${inquiries.length}件の履歴`, href: "/members/inquiries" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ページヘッダー */}
      <div className="bg-white border-b py-8" style={{ borderColor: "#E5E5E5" }}>
        <div className="container-content">
          <h1 className="text-2xl font-bold text-gray-800">マイページ</h1>
        </div>
      </div>

      <div className="container-content py-8">
        <div className="max-w-2xl mx-auto space-y-4">

          {/* プロフィールカード */}
          <div className="bg-white rounded-xl border p-6" style={{ borderColor: "#E5E5E5" }}>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: "#EBF7EA" }}>
                <User size={24} style={{ color: "#5BAD52" }} />
              </div>
              <div>
                <p className="font-bold text-gray-800 text-lg">
                  {profile?.name || session.user.name} 様
                </p>
                <p className="text-sm text-gray-500">{profile?.email || session.user.email}</p>
                {profile?.phone && (
                  <p className="text-sm text-gray-500">{profile.phone}</p>
                )}
              </div>
            </div>
          </div>

          {/* メニュー */}
          {menuItems.map(({ icon: Icon, label, sub, href }) => (
            <Link
              key={href}
              href={href}
              className="bg-white rounded-xl border flex items-center justify-between p-5
                         hover:border-felia-green hover:shadow-sm transition-all group"
              style={{ borderColor: "#E5E5E5" }}
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: "#EBF7EA" }}>
                  <Icon size={18} style={{ color: "#5BAD52" }} />
                </div>
                <div>
                  <p className="font-medium text-gray-700 group-hover:text-felia-green transition-colors">
                    {label}
                  </p>
                  <p className="text-xs text-gray-400">{sub}</p>
                </div>
              </div>
              <ChevronRight size={18} className="text-gray-300 group-hover:text-felia-green transition-colors" />
            </Link>
          ))}

          {/* ログアウト */}
          <LogoutButton />
        </div>
      </div>
    </div>
  );
}
