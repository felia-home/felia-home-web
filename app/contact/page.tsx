// app/contact/page.tsx
"use client";

import { useState, Suspense, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  User, Mail, Phone, MessageSquare,
  CheckCircle, Lock, Home, ChevronRight,
} from "lucide-react";

function ContactForm() {
  const searchParams = useSearchParams();
  const propertyId   = searchParams.get("property_id") ?? searchParams.get("propertyId") ?? "";
  const reinsId      = searchParams.get("reins_id") ?? searchParams.get("reinsId") ?? "";
  const propertyNo   = searchParams.get("propertyNo") || "";
  const type         = searchParams.get("type") || "general";
  const token        = searchParams.get("token") || "";

  const isPrivate  = type === "private";
  const isReins    = type === "reins" || !!reinsId;
  const isProperty = type === "property" || !!propertyId || isReins;

  const session = useSession();
  const isLoggedIn = session?.status === "authenticated";
  const memberId = (session?.data?.user as any)?.id ?? null;

  const [form, setForm] = useState({
    name: "", email: "", phone: "", message: "",
  });
  const [loading, setLoading] = useState(false);
  const [done, setDone]       = useState(false);
  const [error, setError]     = useState("");

  const update = (key: string, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  // ログイン時にプロフィール自動入力
  useEffect(() => {
    if (!isLoggedIn || !memberId) return;
    fetch("/api/members/profile")
      .then((r) => r.json())
      .then((data) => {
        const member = data.member ?? data;
        setForm((prev) => ({
          ...prev,
          name: member.name ?? prev.name,
          email: member.email ?? prev.email,
          phone: member.phone ?? member.tel ?? prev.phone,
        }));
      })
      .catch(() => {});
  }, [isLoggedIn, memberId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name:        form.name,
          email:       form.email,
          phone:       form.phone || undefined,
          message:     form.message,
          propertyId:  propertyId || undefined,
          reinsId:     reinsId || undefined,
          propertyNo:  propertyNo || undefined,
          inquiryType: isPrivate ? "PROPERTY" : isProperty ? "PROPERTY" : "GENERAL",
          token:       token || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || "送信に失敗しました");
        return;
      }
      setDone(true);
    } catch {
      setError("通信エラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  // 完了画面
  if (done) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4"
        style={{ backgroundColor: "#F8F8F8" }}>
        <div className="bg-white rounded-2xl p-10 max-w-md w-full text-center shadow-sm border"
          style={{ borderColor: "#E5E5E5" }}>
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ backgroundColor: "#EBF7EA" }}>
            <CheckCircle size={32} style={{ color: "#5BAD52" }} />
          </div>
          <h1 className="text-xl font-bold text-gray-800 mb-2">
            お問い合わせを受け付けました
          </h1>
          <p className="text-sm text-gray-500 mb-2 leading-relaxed">
            ご入力いただいたメールアドレスに確認メールをお送りしました。
          </p>
          <p className="text-sm text-gray-500 mb-6 leading-relaxed">
            担当者より営業時間内にご連絡いたします。
          </p>
          <div className="space-y-2">
            <Link href="/"
              className="flex items-center justify-center w-full py-3 rounded-lg font-bold text-white"
              style={{ backgroundColor: "#5BAD52" }}>
              トップページに戻る
            </Link>
            {isPrivate && token && (
              <Link
                href={`/private-selection?token=${token}`}
                className="flex items-center justify-center w-full py-3 rounded-lg border text-sm font-medium"
                style={{ borderColor: "#E5E5E5", color: "#666" }}>
                非公開物件一覧に戻る
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: "#F8F8F8", minHeight: "100vh" }}>

      {/* ページヘッダー */}
      <div className="bg-white border-b py-8" style={{ borderColor: "#E5E5E5" }}>
        <div className="container-content">
          <nav className="text-xs text-gray-400 mb-2 flex items-center gap-1.5">
            <Link href="/" className="hover:text-gray-600">ホーム</Link>
            <ChevronRight size={10} />
            <span className="text-gray-600">
              {isPrivate ? "非公開物件のお問い合わせ" : "お問い合わせ"}
            </span>
          </nav>

          <div className="flex items-center gap-3">
            {isPrivate ? (
              <Lock size={22} style={{ color: "#5BAD52" }} />
            ) : (
              <Home size={22} style={{ color: "#5BAD52" }} />
            )}
            <h1 className="text-2xl font-bold text-gray-800">
              {isPrivate
                ? "非公開物件のお問い合わせ"
                : isProperty
                ? "物件のお問い合わせ"
                : "お問い合わせ"}
            </h1>
          </div>

          {propertyNo && (
            <p className="text-sm text-gray-500 mt-1">
              物件番号: <span className="font-medium text-gray-700">{propertyNo}</span>
            </p>
          )}
        </div>
      </div>

      <div className="container-content py-8 tb:py-12">
        <div className="max-w-xl mx-auto">

          {/* 業者お断り注意書き */}
          <div
            className="mb-6 p-4 rounded-xl border"
            style={{ backgroundColor: "#FFFBEB", borderColor: "#F59E0B" }}
          >
            <p className="text-xs text-amber-800 leading-relaxed">
              ⚠️ こちらのフォームは<strong>個人のお客様専用</strong>です。
              不動産業者・同業者の方からのお問い合わせはお断りしております。
            </p>
          </div>

          <div className="bg-white rounded-2xl border p-6 tb:p-8 shadow-sm"
            style={{ borderColor: "#E5E5E5" }}>

            <p className="text-sm text-gray-500 mb-6 leading-relaxed">
              以下のフォームにご入力ください。
              担当者より<strong>営業時間内（10:00〜18:00）</strong>にご連絡いたします。
            </p>

            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">

              {isLoggedIn ? (
                <div style={{
                  backgroundColor: "#f0f5f2",
                  border: "1px solid #5BAD52",
                  borderRadius: "8px",
                  padding: "16px 20px",
                  marginBottom: "16px",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                }}>
                  <span style={{ fontSize: "20px" }}>✓</span>
                  <div>
                    <p style={{ fontSize: "13px", fontWeight: "bold", color: "#2d7a3a", margin: "0 0 2px" }}>
                      会員情報で送信します
                    </p>
                    <p style={{ fontSize: "12px", color: "#666", margin: 0 }}>
                      {form.name}　{form.email}
                      {form.phone && `　${form.phone}`}
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <ContactField
                    label="お名前" required icon={<User size={14} />}
                    type="text" value={form.name} placeholder="山田 太郎"
                    onChange={(v) => update("name", v)}
                  />

                  <ContactField
                    label="メールアドレス" required icon={<Mail size={14} />}
                    type="email" value={form.email} placeholder="example@email.com"
                    onChange={(v) => update("email", v)}
                  />

                  <ContactField
                    label="電話番号" icon={<Phone size={14} />}
                    type="tel" value={form.phone} placeholder="090-0000-0000"
                    onChange={(v) => update("phone", v)}
                  />
                </>
              )}

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">
                  お問い合わせ内容 <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <MessageSquare size={14}
                    className="absolute left-3 top-3 text-gray-400" />
                  <textarea
                    value={form.message}
                    onChange={(e) => update("message", e.target.value)}
                    placeholder={
                      isPrivate
                        ? "非公開物件についてのご質問・ご要望をお書きください"
                        : isProperty
                        ? "物件についてのご質問・内覧のご希望等をお書きください"
                        : "お問い合わせ内容をお書きください"
                    }
                    required
                    rows={5}
                    className="w-full pl-9 pr-4 py-2.5 border rounded-lg text-sm outline-none
                               focus:border-felia-green transition-colors resize-none"
                    style={{ borderColor: "#E5E5E5" }}
                  />
                </div>
              </div>

              <p className="text-xs text-gray-400 leading-relaxed">
                送信することで
                <Link href="/privacy" className="underline hover:text-gray-600">
                  プライバシーポリシー
                </Link>
                に同意したものとみなされます。
              </p>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl font-bold text-white transition-all
                           disabled:opacity-50 hover:scale-[1.01]"
                style={{ backgroundColor: "#5BAD52" }}
              >
                {loading ? "送信中..." : "送信する"}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t text-center" style={{ borderColor: "#F0F0F0" }}>
              <p className="text-xs text-gray-400 mb-2">お急ぎの方はお電話でどうぞ</p>
              <a
                href="tel:03XXXXXXXX"
                className="font-bold text-lg flex items-center justify-center gap-2"
                style={{ color: "#5BAD52" }}
              >
                <Phone size={18} />
                03-XXXX-XXXX
              </a>
              <p className="text-xs text-gray-400 mt-1">
                受付時間 10:00〜18:00（水曜定休）
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ContactField({
  label, required, icon, type, value, placeholder, onChange,
}: {
  label: string; required?: boolean; icon: React.ReactNode;
  type: string; value: string; placeholder: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{icon}</span>
        <input
          type={type} value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder} required={required}
          className="w-full pl-8 pr-4 py-2.5 border rounded-lg text-sm outline-none
                     focus:border-felia-green transition-colors"
          style={{ borderColor: "#E5E5E5" }}
        />
      </div>
    </div>
  );
}

export default function ContactPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50" />}>
      <ContactForm />
    </Suspense>
  );
}
