// app/members/register/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Mail, Lock, Phone, Eye, EyeOff, CheckCircle } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "", email: "", password: "", confirmPassword: "", phone: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError]   = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone]     = useState(false);

  const update = (key: string, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("パスワードが一致しません");
      return;
    }
    if (form.password.length < 8) {
      setError("パスワードは8文字以上で入力してください");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/members/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name:     form.name,
          email:    form.email,
          password: form.password,
          phone:    form.phone || undefined,
        }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message || "登録に失敗しました。もう一度お試しください。");
        return;
      }
      setDone(true);
    } catch {
      setError("通信エラーが発生しました。しばらくしてから再度お試しください。");
    } finally {
      setLoading(false);
    }
  };

  // 完了画面
  if (done) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl p-8 tb:p-12 max-w-md w-full text-center shadow-sm border" style={{ borderColor: "#E5E5E5" }}>
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ backgroundColor: "#EBF7EA" }}>
            <CheckCircle size={32} style={{ color: "#5BAD52" }} />
          </div>
          <h1 className="text-xl font-bold text-gray-800 mb-2">登録が完了しました</h1>
          <p className="text-sm text-gray-500 mb-6 leading-relaxed">
            会員登録ありがとうございます。<br />
            ログインして未公開物件をご覧ください。
          </p>
          <Link
            href="/members/login"
            className="flex items-center justify-center w-full py-3 rounded-lg font-bold text-white"
            style={{ backgroundColor: "#5BAD52" }}
          >
            ログインする
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-2xl p-8 tb:p-10 max-w-md w-full shadow-sm border" style={{ borderColor: "#E5E5E5" }}>

        {/* ヘッダー */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3"
            style={{ backgroundColor: "#EBF7EA" }}>
            <User size={22} style={{ color: "#5BAD52" }} />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">無料会員登録</h1>
          <p className="text-sm text-gray-500 mt-1">未公開物件・お気に入り機能が使えます</p>
        </div>

        {/* エラー */}
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 氏名 */}
          <FormField
            label="お名前" required icon={<User size={15} />}
            type="text" value={form.name} placeholder="山田 太郎"
            onChange={(v) => update("name", v)}
          />

          {/* メールアドレス */}
          <FormField
            label="メールアドレス" required icon={<Mail size={15} />}
            type="email" value={form.email} placeholder="example@email.com"
            onChange={(v) => update("email", v)}
          />

          {/* 電話番号 */}
          <FormField
            label="電話番号（任意）" icon={<Phone size={15} />}
            type="tel" value={form.phone} placeholder="090-0000-0000"
            onChange={(v) => update("phone", v)}
          />

          {/* パスワード */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              パスワード <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Lock size={15} />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={(e) => update("password", e.target.value)}
                placeholder="8文字以上"
                required
                className="w-full pl-9 pr-10 py-2.5 border rounded-lg text-sm outline-none
                           focus:border-felia-green transition-colors"
                style={{ borderColor: "#E5E5E5" }}
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {/* パスワード確認 */}
          <FormField
            label="パスワード（確認）" required icon={<Lock size={15} />}
            type="password" value={form.confirmPassword} placeholder="もう一度入力"
            onChange={(v) => update("confirmPassword", v)}
          />

          {/* 注意書き */}
          <p className="text-xs text-gray-400 leading-relaxed">
            登録することで
            <Link href="/privacy" className="underline hover:text-gray-600">プライバシーポリシー</Link>
            に同意したものとみなされます。
          </p>

          {/* 送信 */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg font-bold text-white transition-all
                       disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.01]"
            style={{ backgroundColor: "#5BAD52" }}
          >
            {loading ? "登録中..." : "無料で会員登録する"}
          </button>
        </form>

        {/* ログインリンク */}
        <p className="mt-5 text-center text-sm text-gray-500">
          すでに会員の方は
          <Link href="/members/login" className="font-medium ml-1 hover:underline" style={{ color: "#5BAD52" }}>
            こちらからログイン
          </Link>
        </p>
      </div>
    </div>
  );
}

// フォームフィールド共通コンポーネント
function FormField({
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
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          className="w-full pl-9 pr-4 py-2.5 border rounded-lg text-sm outline-none
                     focus:border-felia-green transition-colors"
          style={{ borderColor: "#E5E5E5" }}
        />
      </div>
    </div>
  );
}
