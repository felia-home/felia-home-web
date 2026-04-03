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
          <div className="text-5xl mb-6">✉️</div>
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
      <div className="container-xl max-w-2xl mx-auto">
        <div className="mb-10 text-center">
          <p className="text-[#c9a96e] text-xs tracking-[0.3em] mb-2 font-serif">CONTACT</p>
          <h1 className="font-serif text-3xl font-bold text-[#1c1b18]">お問合せ</h1>
          <p className="text-sm text-[#706e68] mt-4 leading-relaxed">
            物件のご相談・売却のご相談など、お気軽にお問合せください。
            <br />
            通常1営業日以内にご連絡差し上げます。
          </p>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
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
                rows={6}
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

        {/* 電話でのお問合せ */}
        <div className="mt-8 bg-[#1a3a2a] rounded-2xl p-6 text-white text-center">
          <p className="text-sm text-white/70 mb-1">お電話でのお問合せ</p>
          <a href="tel:0120-000-000" className="text-2xl font-bold tracking-wider hover:text-[#c9a96e] transition-colors">
            0120-000-000
          </a>
          <p className="text-xs text-white/50 mt-1">受付時間 9:00〜18:00（定休日除く）</p>
        </div>
      </div>
    </div>
  );
}
