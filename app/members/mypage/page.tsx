// app/members/mypage/page.tsx
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import {
  getMemberProfile,
  getMemberInquiries,
  getMemberProfileData,
} from "@/lib/api";
import { LogoutButton } from "@/components/members/LogoutButton";
import {
  User, Heart, FileText, Lock,
  ChevronRight, Settings, Phone,
  MapPin, Wallet, Calendar,
  AlertCircle,
} from "lucide-react";

export const metadata = { title: "マイページ" };

export default async function MypagePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/members/login");

  const memberId = (session.user as any).id;

  let profile = null;
  let inquiries: any[] = [];
  let profileData = null;

  try {
    [profile, inquiries, profileData] = await Promise.all([
      getMemberProfile(memberId),
      getMemberInquiries(memberId),
      getMemberProfileData(memberId),
    ]);
  } catch {}

  // 購入希望条件の入力状況チェック
  const hasProfile = !!(
    profileData &&
    (profileData.desired_areas?.length ||
      profileData.budget_max ||
      profileData.purchase_timing)
  );

  const menuItems = [
    {
      icon: Lock,
      label: "プライベートセレクション",
      sub: "会員限定・非公開物件一覧",
      href: "/private-selection",
      accent: true,
    },
    {
      icon: Heart,
      label: "お気に入り物件",
      sub: "保存した物件を確認",
      href: "/members/favorites",
      accent: false,
      alert: false,
    },
    {
      icon: FileText,
      label: "問い合わせ履歴",
      sub: `${inquiries.length}件の履歴`,
      href: "/members/inquiries",
      accent: false,
      alert: false,
    },
    {
      icon: Settings,
      label: "購入希望条件の変更",
      sub: hasProfile ? "条件が登録されています" : "条件を登録してください",
      href: "/members/profile",
      accent: false,
      alert: !hasProfile,
    },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F8F8F8" }}>

      {/* ページヘッダー */}
      <div className="bg-white border-b" style={{ borderColor: "#E5E5E5" }}>
        <div className="container-content py-8">
          <h1 className="text-2xl font-bold text-gray-800">マイページ</h1>
        </div>
      </div>

      <div className="container-content py-8">
        <div className="max-w-2xl mx-auto space-y-4">

          {/* プロフィールカード */}
          <div
            className="bg-white rounded-xl border p-6"
            style={{ borderColor: "#E5E5E5" }}
          >
            <div className="flex items-center gap-4">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: "#EBF7EA" }}
              >
                <User size={24} style={{ color: "#5BAD52" }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-800 text-lg">
                  {profile?.name || session.user?.name} 様
                </p>
                <p className="text-sm text-gray-500 truncate">
                  {profile?.email || session.user?.email}
                </p>
                {profile?.phone && (
                  <p className="text-sm text-gray-500">{profile.phone}</p>
                )}
              </div>
            </div>

            {/* 購入希望条件サマリー */}
            {profileData && hasProfile && (
              <div
                className="mt-4 pt-4 border-t"
                style={{ borderColor: "#F0F0F0" }}
              >
                <p className="text-xs font-bold text-gray-400 tracking-widest mb-2">
                  購入希望条件（登録済み）
                </p>
                <div className="flex flex-wrap gap-2">
                  {profileData.desired_areas?.slice(0, 3).map((area) => (
                    <span
                      key={area}
                      className="text-xs px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: "#EBF7EA", color: "#5BAD52" }}
                    >
                      <MapPin size={9} className="inline mr-0.5" />
                      {area}
                    </span>
                  ))}
                  {profileData.budget_max && (
                    <span
                      className="text-xs px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: "#EBF7EA", color: "#5BAD52" }}
                    >
                      <Wallet size={9} className="inline mr-0.5" />
                      〜{profileData.budget_max.toLocaleString()}万円
                    </span>
                  )}
                  {profileData.purchase_timing && (
                    <span
                      className="text-xs px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: "#EBF7EA", color: "#5BAD52" }}
                    >
                      <Calendar size={9} className="inline mr-0.5" />
                      {profileData.purchase_timing}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* 条件未登録の場合 */}
            {!hasProfile && (
              <div
                className="mt-4 pt-4 border-t"
                style={{ borderColor: "#F0F0F0" }}
              >
                <div
                  className="flex items-center gap-2 p-3 rounded-lg"
                  style={{ backgroundColor: "#FFF9EC", border: "1px solid #F59E0B" }}
                >
                  <AlertCircle size={14} style={{ color: "#F59E0B" }} className="flex-shrink-0" />
                  <p className="text-xs" style={{ color: "#92400E" }}>
                    購入希望条件が未登録です。登録するとより精度の高い物件提案が受けられます。
                    <Link
                      href="/members/profile"
                      className="ml-1 font-bold underline"
                    >
                      今すぐ登録 →
                    </Link>
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* メニュー */}
          {menuItems.map(({ icon: Icon, label, sub, href, accent, alert }) => (
            <Link
              key={href}
              href={href}
              className="bg-white rounded-xl border flex items-center justify-between p-5
                         hover:shadow-sm transition-all group"
              style={{
                borderColor: accent ? "rgba(201,168,76,0.3)" : "#E5E5E5",
                backgroundColor: accent ? "#0D2818" : "white",
              }}
            >
              <div className="flex items-center gap-4">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{
                    backgroundColor: accent
                      ? "rgba(201,168,76,0.15)"
                      : "#EBF7EA",
                  }}
                >
                  <Icon
                    size={18}
                    style={{ color: accent ? "#C9A84C" : "#5BAD52" }}
                  />
                </div>
                <div>
                  <p
                    className="font-medium"
                    style={{ color: accent ? "#F5F0E8" : "#374151" }}
                  >
                    {label}
                  </p>
                  <p
                    className="text-xs mt-0.5"
                    style={{
                      color: accent
                        ? "rgba(245,240,232,0.5)"
                        : alert
                        ? "#F59E0B"
                        : "#9CA3AF",
                    }}
                  >
                    {alert && <AlertCircle size={10} className="inline mr-1" />}
                    {sub}
                  </p>
                </div>
              </div>
              <ChevronRight
                size={18}
                style={{ color: accent ? "rgba(201,168,76,0.5)" : "#D1D5DB" }}
              />
            </Link>
          ))}

          {/* 担当者情報 */}
          <div
            className="bg-white rounded-xl border p-5"
            style={{ borderColor: "#E5E5E5" }}
          >
            <p className="text-xs font-bold text-gray-400 tracking-widest mb-3">
              担当者
            </p>
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: "#EBF7EA" }}
              >
                <User size={16} style={{ color: "#5BAD52" }} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">
                  フェリアホーム 担当者
                </p>
                <p className="text-xs text-gray-400">
                  担当者よりご連絡いたします
                </p>
              </div>
              <a
                href="tel:03XXXXXXXX"
                className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium"
                style={{ backgroundColor: "#EBF7EA", color: "#5BAD52" }}
              >
                <Phone size={12} />
                電話する
              </a>
            </div>
          </div>

          {/* ログアウト */}
          <LogoutButton />
        </div>
      </div>
    </div>
  );
}
