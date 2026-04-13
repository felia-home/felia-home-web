// components/home/MemberBannerSection.tsx
import Link from "next/link";
import { UserPlus, Eye, Heart, FileText } from "lucide-react";

const benefits = [
  { icon: Eye,      label: "未公開物件の閲覧" },
  { icon: Heart,    label: "お気に入り保存" },
  { icon: FileText, label: "資料請求・内覧申込" },
];

export function MemberBannerSection() {
  return (
    <section
      className="relative overflow-hidden py-14 tb:py-20"
      style={{
        background: "linear-gradient(135deg, #1a3a1a 0%, #2d5a2d 40%, #5BAD52 100%)",
      }}
    >
      {/* 背景装飾（円形） */}
      <div
        className="absolute -top-20 -right-20 w-80 h-80 rounded-full opacity-10"
        style={{ backgroundColor: "#ffffff" }}
      />
      <div
        className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full opacity-10"
        style={{ backgroundColor: "#ffffff" }}
      />

      <div className="container-content relative z-10">
        <div className="flex flex-col tb:flex-row items-center justify-between gap-8">

          {/* 左: テキスト */}
          <div className="text-center tb:text-left">
            <p className="text-white/70 text-sm tracking-widest mb-2">
              MEMBER REGISTRATION
            </p>
            <h2
              className="text-white font-bold leading-tight mb-4"
              style={{ fontSize: "clamp(22px, 3vw, 36px)" }}
            >
              会員登録で、もっと便利に。<br />
              <span className="text-white/85 font-normal" style={{ fontSize: "clamp(15px, 2vw, 22px)" }}>
                未公開物件も見られます。
              </span>
            </h2>

            {/* 特典リスト */}
            <div className="flex flex-wrap justify-center tb:justify-start gap-4 mb-6">
              {benefits.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-1.5 text-white/80 text-sm">
                  <Icon size={14} className="flex-shrink-0" />
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 右: CTA */}
          <div className="flex flex-col items-center gap-3 flex-shrink-0">
            <Link
              href="/members/register"
              className="flex items-center gap-2 px-8 py-4 rounded-lg font-bold text-base transition-all duration-200 hover:scale-105 hover:shadow-lg"
              style={{
                backgroundColor: "#ffffff",
                color: "#5BAD52",
                boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
              }}
            >
              <UserPlus size={18} />
              無料会員登録はこちら
            </Link>
            <Link
              href="/members/login"
              className="text-white/60 text-sm hover:text-white transition-colors"
            >
              すでに会員の方はログイン →
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}
