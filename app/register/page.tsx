"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    name_kana: "",
    email: "",
    phone: "",
    password: "",
    password_confirm: "",
    agree: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.password_confirm) {
      setError("パスワードが一致しません");
      return;
    }
    if (!form.agree) {
      setError("プライバシーポリシーに同意してください");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/member/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          name_kana: form.name_kana,
          email: form.email,
          phone: form.phone,
          password: form.password,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "登録に失敗しました");
      } else {
        router.push("/login?registered=1");
      }
    } catch {
      setError("通信エラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#fafaf8] min-h-screen pt-24 pb-16">
      <div className="container-xl max-w-lg mx-auto">
        <div className="text-center mb-10">
          <p className="text-[#c9a96e] text-xs tracking-[0.4em] mb-3 font-serif">REGISTER</p>
          <h1 className="font-serif text-3xl font-bold">無料会員登録</h1>
          <p className="text-sm text-[#706e68] mt-3">
            会員登録すると未公開物件の閲覧・資料請求ができます
          </p>
        </div>

        {/* 会員特典 */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "未公開物件の閲覧", icon: (
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#c9a96e" strokeWidth="1.5"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>
            )},
            { label: "資料請求", icon: (
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#c9a96e" strokeWidth="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
            )},
            { label: "お気に入り保存", icon: (
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#c9a96e" strokeWidth="1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            )},
          ].map((item, i) => (
            <div key={i} className="bg-white rounded-xl p-4 text-center border border-[#e8e6e0]">
              <div className="flex justify-center mb-2">{item.icon}</div>
              <div className="text-xs text-[#706e68]">{item.label}</div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-[#e8e6e0] p-8">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-[#1c1b18] mb-1.5">
                  お名前 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="山田 太郎"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-[#e8e6e0] text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a96e]"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-[#1c1b18] mb-1.5">フリガナ</label>
                <input
                  type="text"
                  placeholder="ヤマダ タロウ"
                  value={form.name_kana}
                  onChange={e => setForm({ ...form, name_kana: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-[#e8e6e0] text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a96e]"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-[#1c1b18] mb-1.5">
                メールアドレス <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                required
                placeholder="example@email.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-[#e8e6e0] text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a96e]"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-[#1c1b18] mb-1.5">電話番号</label>
              <input
                type="tel"
                placeholder="090-0000-0000"
                value={form.phone}
                onChange={e => setForm({ ...form, phone: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-[#e8e6e0] text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a96e]"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-[#1c1b18] mb-1.5">
                パスワード <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                required
                placeholder="8文字以上"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-[#e8e6e0] text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a96e]"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-[#1c1b18] mb-1.5">
                パスワード（確認） <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                required
                placeholder="パスワードを再入力"
                value={form.password_confirm}
                onChange={e => setForm({ ...form, password_confirm: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-[#e8e6e0] text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a96e]"
              />
            </div>

            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="agree"
                checked={form.agree}
                onChange={e => setForm({ ...form, agree: e.target.checked })}
                className="mt-1 w-4 h-4 accent-[#1a3a2a]"
              />
              <label htmlFor="agree" className="text-sm text-[#706e68]">
                <Link href="/privacy" className="text-[#c9a96e] hover:underline" target="_blank">
                  プライバシーポリシー
                </Link>
                に同意します
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#c9a96e] text-white py-4 rounded-xl font-bold text-sm hover:bg-[#b8935a] transition-colors disabled:opacity-50"
            >
              {loading ? "登録中..." : "無料で会員登録する"}
            </button>
          </form>

          <p className="text-center text-sm text-[#706e68] mt-6">
            すでに会員の方は{" "}
            <Link href="/login" className="text-[#c9a96e] hover:underline">
              こちらからログイン
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
