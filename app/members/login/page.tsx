// app/members/login/page.tsx
"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Mail, Lock, Eye, EyeOff, LogIn } from "lucide-react";

function LoginForm() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl  = searchParams.get("callbackUrl") || "/members/mypage";

  const [email, setEmail]           = useState("");
  const [password, setPassword]     = useState("");
  const [showPassword, setShowPwd]  = useState(false);
  const [error, setError]           = useState("");
  const [loading, setLoading]       = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("メールアドレスまたはパスワードが正しくありません");
      setLoading(false);
    } else {
      router.push(callbackUrl);
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-2xl p-8 tb:p-10 max-w-md w-full shadow-sm border" style={{ borderColor: "#E5E5E5" }}>

        {/* ヘッダー */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3"
            style={{ backgroundColor: "#EBF7EA" }}>
            <LogIn size={22} style={{ color: "#5BAD52" }} />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">ログイン</h1>
          <p className="text-sm text-gray-500 mt-1">会員限定コンテンツをご利用いただけます</p>
        </div>

        {/* エラー */}
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* メールアドレス */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              メールアドレス <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@email.com"
                required
                autoComplete="email"
                className="w-full pl-9 pr-4 py-2.5 border rounded-lg text-sm outline-none
                           focus:border-felia-green transition-colors"
                style={{ borderColor: "#E5E5E5" }}
              />
            </div>
          </div>

          {/* パスワード */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              パスワード <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="パスワードを入力"
                required
                autoComplete="current-password"
                className="w-full pl-9 pr-10 py-2.5 border rounded-lg text-sm outline-none
                           focus:border-felia-green transition-colors"
                style={{ borderColor: "#E5E5E5" }}
              />
              <button
                type="button"
                onClick={() => setShowPwd((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {/* ログインボタン */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg font-bold text-white transition-all mt-2
                       disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.01]"
            style={{ backgroundColor: "#5BAD52" }}
          >
            {loading ? "ログイン中..." : "ログイン"}
          </button>
        </form>

        {/* 区切り */}
        <div className="my-5 flex items-center gap-3">
          <div className="flex-1 h-px bg-gray-100" />
          <span className="text-xs text-gray-400">または</span>
          <div className="flex-1 h-px bg-gray-100" />
        </div>

        {/* 会員登録リンク */}
        <Link
          href="/members/register"
          className="flex items-center justify-center w-full py-2.5 rounded-lg border text-sm font-medium
                     text-gray-600 hover:border-felia-green hover:text-felia-green transition-colors"
          style={{ borderColor: "#E5E5E5" }}
        >
          新規会員登録はこちら（無料）
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50" />}>
      <LoginForm />
    </Suspense>
  );
}
