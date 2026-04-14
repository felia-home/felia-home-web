// app/private-selection/expired/page.tsx
import Link from "next/link";
import { Clock, Phone } from "lucide-react";

export const metadata = {
  title: "URLの有効期限が切れています | フェリアホーム",
  robots: { index: false, follow: false },
};

export default function ExpiredPage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: "#0A1A0F" }}
    >
      <div
        className="max-w-md w-full text-center p-10 rounded-2xl"
        style={{ backgroundColor: "#0D2818", border: "1px solid rgba(201,168,76,0.2)" }}
      >
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
          style={{ backgroundColor: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.3)" }}
        >
          <Clock size={28} style={{ color: "#C9A84C" }} />
        </div>

        <h1 className="font-bold mb-3" style={{ color: "#F5F0E8", fontSize: "20px" }}>
          URLの有効期限が切れています
        </h1>
        <p className="text-sm leading-relaxed mb-8" style={{ color: "rgba(245,240,232,0.5)" }}>
          ご案内のURLは有効期限（30日間）が過ぎています。
          担当者に新しいURLの発行をご依頼ください。
        </p>

        <div className="space-y-3">
          <a
            href="tel:03XXXXXXXX"
            className="flex items-center justify-center gap-2 w-full py-3.5 rounded-lg font-bold text-sm transition-all hover:scale-[1.02]"
            style={{ backgroundColor: "#C9A84C", color: "#0A1A0F" }}
          >
            <Phone size={16} />
            担当者に電話する
          </a>
          <Link
            href="/members/register"
            className="flex items-center justify-center w-full py-3 rounded-lg text-sm border transition-colors"
            style={{ borderColor: "rgba(201,168,76,0.3)", color: "#C9A84C" }}
          >
            会員登録して閲覧する（無料）
          </Link>
        </div>
      </div>
    </div>
  );
}
