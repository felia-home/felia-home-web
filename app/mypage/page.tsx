import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function MypagePage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const memberId = (session.user as { id?: string }).id;

  let member: Record<string, unknown> | null = null;
  try {
    const res = await fetch(`${process.env.ADMIN_API_URL}/api/members/${memberId}`, {
      cache: "no-store",
    });
    if (res.ok) {
      const data = await res.json();
      member = data.member;
    }
  } catch { /* ignore */ }

  return (
    <div className="bg-[#fafaf8] min-h-screen pt-24 pb-16">
      <div className="container-xl max-w-4xl mx-auto">
        <div className="mb-8">
          <p className="text-[#c9a96e] text-xs tracking-[0.4em] mb-2 font-serif">MY PAGE</p>
          <h1 className="font-serif text-3xl font-bold">マイページ</h1>
          {member && (
            <p className="text-sm text-[#706e68] mt-1">{String(member.name)} 様</p>
          )}
        </div>

        {/* クイックリンク */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          {[
            {
              href: "/mypage/private-properties",
              title: "未公開物件",
              desc: "会員限定の未公開物件を見る",
              icon: (
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#c9a96e" strokeWidth="1.5">
                  <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/>
                </svg>
              ),
            },
            {
              href: "/contact",
              title: "お問合せ",
              desc: "物件についてのご相談・お問合せ",
              icon: (
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#c9a96e" strokeWidth="1.5">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
              ),
            },
            {
              href: "/properties",
              title: "物件検索",
              desc: "公開中の物件を検索する",
              icon: (
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#c9a96e" strokeWidth="1.5">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
                </svg>
              ),
            },
          ].map((item, i) => (
            <Link
              key={i}
              href={item.href}
              className="bg-white rounded-2xl border border-[#e8e6e0] p-6 hover:shadow-lg transition-shadow group"
            >
              <div className="mb-3">{item.icon}</div>
              <div className="font-serif text-lg font-bold text-[#1a3a2a] mb-1 group-hover:text-[#c9a96e] transition-colors">
                {item.title}
              </div>
              <div className="text-sm text-[#706e68]">{item.desc}</div>
            </Link>
          ))}
        </div>

        {/* 登録情報サマリー */}
        {member && (
          <div className="bg-white rounded-2xl border border-[#e8e6e0] p-6">
            <h2 className="font-serif text-lg font-bold mb-4">ご登録情報</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              {[
                { label: "お名前", value: String(member.name ?? "") },
                { label: "メール", value: String(member.email ?? "") },
                { label: "電話番号", value: String(member.phone ?? "未登録") },
                {
                  label: "登録日",
                  value: member.created_at
                    ? new Date(String(member.created_at)).toLocaleDateString("ja-JP")
                    : "",
                },
              ].map((item, i) => (
                <div key={i}>
                  <div className="text-[#706e68] text-xs mb-1">{item.label}</div>
                  <div className="text-[#1c1b18]">{item.value}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
