"use client";
import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const registered = searchParams.get("registered");
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false,
    });

    if (result?.error) {
      setError("メールアドレスまたはパスワードが正しくありません");
      setLoading(false);
    } else {
      router.push("/mypage");
    }
  };

  return (
    <div className="bg-[#fafaf8] min-h-screen pt-24 pb-16">
      <div className="container-xl max-w-md mx-auto">
        <div className="text-center mb-10">
          <p className="text-[#c9a96e] text-xs tracking-[0.4em] mb-3 font-serif">LOGIN</p>
          <h1 className="font-serif text-3xl font-bold">会員ログイン</h1>
        </div>

        {registered && (
          <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-xl mb-6 text-center">
            会員登録が完了しました。ログインしてください。
          </div>
        )}

        <div className="bg-white rounded-2xl border border-[#e8e6e0] p-8">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-[#1c1b18] mb-1.5">
                メールアドレス
              </label>
              <input
                type="email"
                required
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-[#e8e6e0] text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a96e]"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-[#1c1b18] mb-1.5">パスワード</label>
              <input
                type="password"
                required
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-[#e8e6e0] text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a96e]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1a3a2a] text-white py-4 rounded-xl font-bold text-sm hover:bg-[#2d5a3e] transition-colors disabled:opacity-50"
            >
              {loading ? "ログイン中..." : "ログイン"}
            </button>
          </form>

          <p className="text-center text-sm text-[#706e68] mt-6">
            会員登録がお済みでない方は{" "}
            <Link href="/register" className="text-[#c9a96e] hover:underline">
              こちらから無料登録
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
