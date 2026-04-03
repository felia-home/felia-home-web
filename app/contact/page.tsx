"use client";

import { useState } from "react";

const INQUIRY_TYPES = [
  { value: "PROPERTY", label: "物件について" },
  { value: "SELL", label: "売却相談" },
  { value: "OTHER", label: "その他" },
];

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    inquiry_type: "PROPERTY",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const adminUrl = process.env.NEXT_PUBLIC_ADMIN_API_URL ?? "http://localhost:3001";
      const res = await fetch(`${adminUrl}/api/inquiries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone || undefined,
          inquiry_type: form.inquiry_type,
          message: form.message,
          source: "HP",
        }),
      });
      if (!res.ok) throw new Error("送信に失敗しました");
      setDone(true);
    } catch {
      setError("送信中にエラーが発生しました。お電話にてお問合せください。");
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div className="pt-32 pb-20 bg-[#fafaf8] min-h-screen">
        <div className="container-xl max-w-xl mx-auto text-center">
          <div className="w-16 h-16 bg-[#e8f0eb] rounded-full flex items-center justify-center mx-auto mb-6">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <path d="M6 16l7 7 13-13" stroke="#1a3a2a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1 className="font-serif text-2xl font-bold text-[#1c1b18] mb-4">
            お問合せを受け付けました
          </h1>
          <p className="text-[#706e68] text-sm leading-relaxed mb-8">
            ご連絡いただきありがとうございます。
            <br />
            担当者よりご連絡差し上げますので、今しばらくお待ちください。
          </p>
          <a
            href="/"
            className="inline-block bg-[#1a3a2a] text-white px-8 py-3 rounded-full text-sm font-bold hover:bg-[#2d5a3e] transition-colors"
          >
            トップページへ戻る
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-20 bg-[#fafaf8] min-h-screen">
      <div className="container-xl">
        <div className="mb-12 text-center">
          <p className="text-[#c9a96e] text-xs tracking-[0.3em] mb-2 font-serif">CONTACT</p>
          <h1 className="font-serif text-3xl font-bold text-[#1c1b18]">お問合せ</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* 左: 会社情報 */}
          <div>
            <h2 className="font-serif text-xl font-bold text-[#1c1b18] mb-8">
              お気軽にご相談ください
            </h2>
            <p className="text-sm text-[#706e68] leading-relaxed mb-10">
              物件のご相談・売却のご相談など、何でもお気軽にお問合せください。
              通常1営業日以内にご連絡差し上げます。
            </p>

            <div className="space-y-7">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-[#1a3a2a] rounded-full flex items-center justify-center flex-shrink-0">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z" fill="white"/>
                  </svg>
                </div>
                <div>
                  <div className="font-bold text-[#1c1b18] mb-1">お電話でのお問合せ</div>
                  <a href="tel:0120-000-000" className="text-2xl font-serif text-[#c9a96e] hover:text-[#b8935a] transition-colors">
                    0120-000-000
                  </a>
                  <div className="text-sm text-[#706e68] mt-1">受付時間: 9:00〜18:00（定休日除く）</div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-[#1a3a2a] rounded-full flex items-center justify-center flex-shrink-0">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="white"/>
                  </svg>
                </div>
                <div>
                  <div className="font-bold text-[#1c1b18] mb-1">所在地</div>
                  <div className="text-sm text-[#706e68] leading-relaxed">
                    〒XXX-XXXX<br />
                    東京都渋谷区千駄ヶ谷X-XX-XX
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-[#1a3a2a] rounded-full flex items-center justify-center flex-shrink-0">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <rect x="3" y="4" width="18" height="16" rx="2" stroke="white" strokeWidth="1.8"/>
                    <path d="M3 9h18" stroke="white" strokeWidth="1.8"/>
                    <path d="M8 2v4M16 2v4" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
                  </svg>
                </div>
                <div>
                  <div className="font-bold text-[#1c1b18] mb-1">営業時間</div>
                  <div className="text-sm text-[#706e68]">
                    9:00〜18:00<br />
                    定休日: 毎週水曜日・年末年始
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 右: フォーム */}
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-[#1c1b18] mb-1.5">
                  お名前 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="山田 太郎"
                  className="w-full px-4 py-3 border border-[#e8e6e0] rounded-xl text-sm text-[#1c1b18] focus:outline-none focus:border-[#1a3a2a] transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-[#1c1b18] mb-1.5">
                  メールアドレス <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="example@email.com"
                  className="w-full px-4 py-3 border border-[#e8e6e0] rounded-xl text-sm text-[#1c1b18] focus:outline-none focus:border-[#1a3a2a] transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-[#1c1b18] mb-1.5">
                  電話番号
                </label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="090-0000-0000"
                  className="w-full px-4 py-3 border border-[#e8e6e0] rounded-xl text-sm text-[#1c1b18] focus:outline-none focus:border-[#1a3a2a] transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-[#1c1b18] mb-1.5">
                  お問合せ種別 <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-4 flex-wrap">
                  {INQUIRY_TYPES.map((t) => (
                    <label key={t.value} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="inquiry_type"
                        value={t.value}
                        checked={form.inquiry_type === t.value}
                        onChange={(e) => setForm({ ...form, inquiry_type: e.target.value })}
                        className="accent-[#1a3a2a]"
                      />
                      <span className="text-sm text-[#1c1b18]">{t.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-[#1c1b18] mb-1.5">
                  メッセージ <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="ご質問・ご要望をお書きください"
                  className="w-full px-4 py-3 border border-[#e8e6e0] rounded-xl text-sm text-[#1c1b18] focus:outline-none focus:border-[#1a3a2a] transition-colors resize-none"
                />
              </div>

              {error && (
                <p className="text-red-500 text-sm bg-red-50 px-4 py-3 rounded-xl">{error}</p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-[#c9a96e] text-white py-4 rounded-xl font-bold text-sm hover:bg-[#b8935a] transition-colors disabled:opacity-60"
              >
                {submitting ? "送信中..." : "送信する"}
              </button>

              <p className="text-xs text-[#706e68] text-center">
                送信いただいた個人情報は、お問合せへの回答のみに使用します。
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
