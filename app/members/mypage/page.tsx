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

export const metadata = { title: "マイページ | フェリアホーム" };

export default async function MypagePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/members/login");

  const memberId = (session.user as any).id;

  let profile: any = null;
  let inquiries: any[] = [];
  let profileData: any = null;

  try {
    [profile, inquiries, profileData] = await Promise.all([
      getMemberProfile(memberId),
      getMemberInquiries(memberId),
      getMemberProfileData(memberId),
    ]);
  } catch {}

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
      sub: "会員限定の非公開物件",
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
      sub: `${inquiries.length}件の問い合わせ`,
      href: "/members/inquiries",
      accent: false,
      alert: false,
    },
    {
      icon: Settings,
      label: "購入希望条件の変更",
      sub: hasProfile ? "条件を編集する" : "条件を登録してください",
      href: "/members/profile",
      accent: false,
      alert: !hasProfile,
    },
  ];

  return (
    <main style={{ backgroundColor: "#f8f8f8", minHeight: "100vh" }}>

      {/* ヘッダー */}
      <div style={{ backgroundColor: "#fff", borderBottom: "1px solid #E5E5E5", padding: "32px 24px" }}>
        <div style={{ maxWidth: "640px", margin: "0 auto" }}>
          <h1 style={{ fontSize: "24px", fontWeight: "bold", color: "#333", margin: 0 }}>マイページ</h1>
        </div>
      </div>

      <div style={{ maxWidth: "640px", margin: "0 auto", padding: "24px 24px 80px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

          {/* プロフィールカード */}
          <div style={{ backgroundColor: "#fff", borderRadius: "12px", border: "1px solid #E5E5E5", padding: "24px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <div style={{
                width: "56px", height: "56px", borderRadius: "50%",
                backgroundColor: "#EBF7EA",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}>
                <User size={24} style={{ color: "#5BAD52" }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontWeight: "bold", color: "#333", fontSize: "18px", margin: "0 0 2px" }}>
                  {profile?.name || "会員"} 様
                </p>
                <p style={{ fontSize: "13px", color: "#888", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {profile?.email || (session.user as any)?.email}
                </p>
                {profile?.phone && (
                  <p style={{ fontSize: "13px", color: "#888", margin: "2px 0 0" }}>{profile.phone}</p>
                )}
              </div>
            </div>

            {/* 購入希望条件サマリー */}
            {profileData && hasProfile && (
              <div style={{ marginTop: "16px", paddingTop: "16px", borderTop: "1px solid #f0f0f0" }}>
                <p style={{ fontSize: "11px", fontWeight: "bold", color: "#aaa", letterSpacing: "0.1em", marginBottom: "8px" }}>
                  購入希望条件
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {profileData.desired_areas?.slice(0, 3).map((area: string) => (
                    <span key={area} style={{
                      fontSize: "11px", padding: "3px 10px", borderRadius: "20px",
                      backgroundColor: "#EBF7EA", color: "#2d7a3a",
                      display: "flex", alignItems: "center", gap: "4px",
                    }}>
                      <MapPin size={9} />{area}
                    </span>
                  ))}
                  {profileData.budget_max && (
                    <span style={{
                      fontSize: "11px", padding: "3px 10px", borderRadius: "20px",
                      backgroundColor: "#EBF7EA", color: "#2d7a3a",
                      display: "flex", alignItems: "center", gap: "4px",
                    }}>
                      <Wallet size={9} />〜{profileData.budget_max.toLocaleString()}万円
                    </span>
                  )}
                  {profileData.purchase_timing && (
                    <span style={{
                      fontSize: "11px", padding: "3px 10px", borderRadius: "20px",
                      backgroundColor: "#EBF7EA", color: "#2d7a3a",
                      display: "flex", alignItems: "center", gap: "4px",
                    }}>
                      <Calendar size={9} />{profileData.purchase_timing}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* 条件未登録警告 */}
            {!hasProfile && (
              <div style={{ marginTop: "16px", paddingTop: "16px", borderTop: "1px solid #f0f0f0" }}>
                <div style={{
                  display: "flex", alignItems: "center", gap: "8px",
                  padding: "10px 14px", borderRadius: "8px",
                  backgroundColor: "#fffbeb", border: "1px solid #f59e0b",
                }}>
                  <AlertCircle size={14} style={{ color: "#f59e0b", flexShrink: 0 }} />
                  <p style={{ fontSize: "12px", color: "#92400e", margin: 0 }}>
                    購入希望条件が未登録です。
                    <Link href="/members/profile" style={{ marginLeft: "4px", fontWeight: "bold", color: "#92400e" }}>
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
              key={href} href={href}
              style={{
                backgroundColor: accent ? "#0D2818" : "#fff",
                borderRadius: "12px",
                border: `1px solid ${accent ? "rgba(201,168,76,0.3)" : "#E5E5E5"}`,
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "18px 20px", textDecoration: "none",
                boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <div style={{
                  width: "40px", height: "40px", borderRadius: "10px",
                  backgroundColor: accent ? "rgba(201,168,76,0.15)" : "#f0f0f0",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Icon size={18} style={{ color: accent ? "#C9A84C" : "#5BAD52" }} />
                </div>
                <div>
                  <p style={{ fontSize: "14px", fontWeight: "bold", color: accent ? "#fff" : "#333", margin: "0 0 2px" }}>
                    {label}
                  </p>
                  <p style={{ fontSize: "12px", color: accent ? "rgba(255,255,255,0.6)" : "#888", margin: 0, display: "flex", alignItems: "center", gap: "4px" }}>
                    {alert && <AlertCircle size={10} style={{ color: "#f59e0b" }} />}
                    {sub}
                  </p>
                </div>
              </div>
              <ChevronRight size={18} style={{ color: accent ? "rgba(255,255,255,0.4)" : "#ccc", flexShrink: 0 }} />
            </Link>
          ))}

          {/* 担当者情報 */}
          <div style={{ backgroundColor: "#fff", borderRadius: "12px", border: "1px solid #E5E5E5", padding: "20px" }}>
            <p style={{ fontSize: "11px", fontWeight: "bold", color: "#aaa", letterSpacing: "0.1em", marginBottom: "12px" }}>
              担当者
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{
                width: "40px", height: "40px", borderRadius: "50%",
                backgroundColor: "#f0f0f0",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}>
                <User size={16} style={{ color: "#aaa" }} />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: "14px", fontWeight: "500", color: "#333", margin: "0 0 2px" }}>
                  フェリアホーム 担当者
                </p>
                <p style={{ fontSize: "12px", color: "#888", margin: 0 }}>
                  担当者よりご連絡いたします
                </p>
              </div>
              <a
                href="tel:0359818601"
                style={{
                  display: "flex", alignItems: "center", gap: "6px",
                  padding: "8px 14px", borderRadius: "8px",
                  backgroundColor: "#EBF7EA", color: "#5BAD52",
                  textDecoration: "none", fontSize: "12px", fontWeight: "bold",
                  flexShrink: 0,
                }}
              >
                <Phone size={12} />電話する
              </a>
            </div>
          </div>

          <LogoutButton />
        </div>
      </div>
    </main>
  );
}
