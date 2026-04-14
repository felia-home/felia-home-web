// app/sell/valuation/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  User, Mail, Phone, MapPin, Home,
  CheckCircle, ChevronRight, Building2,
} from "lucide-react";

const PROPERTY_TYPES = ["戸建て", "マンション", "土地", "収益物件", "その他"];
const TIMING_OPTIONS = [
  "3ヶ月以内に売りたい",
  "6ヶ月以内に売りたい",
  "1年以内に売りたい",
  "時期はまだ決めていない",
  "査定だけ知りたい",
];

export default function ValuationPage() {
  const [form, setForm] = useState({
    name: "", email: "", phone: "",
    address: "", propertyType: "",
    timing: "", message: "",
  });
  const [loading, setLoading] = useState(false);
  const [done, setDone]       = useState(false);
  const [error, setError]     = useState("");

  const update = (key: string, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const message = [
      `【査定依頼】`,
      `物件住所: ${form.address}`,
      `物件種別: ${form.propertyType}`,
      `売却希望時期: ${form.timing}`,
      form.message ? `\nご要望: ${form.message}` : "",
    ].filter(Boolean).join("\n");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name:        form.name,
          email:       form.email,
          phone:       form.phone || undefined,
          message,
          inquiryType: "ASSESSMENT",
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
          <h1 className="text-xl font-bold text-gray-800 mb-2">査定依頼を受け付けました</h1>
          <p className="text-sm text-gray-500 mb-6 leading-relaxed">
            ご入力いただいたメールアドレスに確認メールをお送りしました。
            担当者より営業時間内にご連絡いたします。
          </p>
          <Link href="/"
            className="flex items-center justify-center w-full py-3 rounded-lg font-bold text-white"
            style={{ backgroundColor: "#5BAD52" }}>
            トップページに戻る
          </Link>
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
            <Link href="/sell" className="hover:text-gray-600">売りたい</Link>
            <ChevronRight size={10} />
            <span className="text-gray-600">無料査定依頼</span>
          </nav>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Home size={22} style={{ color: "#5BAD52" }} />
            無料売却査定のご依頼
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            査定は完全無料・訪問なしのオンライン査定も対応しております
          </p>
        </div>
      </div>

      {/* 特典バナー */}
      <div
        className="py-5"
        style={{ background: "linear-gradient(135deg, #1a3a1a, #2d5a2d, #5BAD52)" }}
      >
        <div className="container-content">
          <div className="flex flex-wrap justify-center gap-6">
            {[
              "✓ 完全無料・無料相談",
              "✓ 訪問なしでOK",
              "✓ 最短即日査定",
              "✓ 売却実績多数",
            ].map((item) => (
              <span key={item} className="text-white text-sm font-medium">{item}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="container-content py-8 tb:py-12">
        <div className="max-w-xl mx-auto">
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

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* お客様情報 */}
              <div>
                <h3 className="text-sm font-bold text-gray-700 mb-3 pb-2 border-b flex items-center gap-1.5"
                  style={{ borderColor: "#F0F0F0" }}>
                  <User size={14} style={{ color: "#5BAD52" }} />
                  お客様情報
                </h3>
                <div className="space-y-3">
                  <ValuationField
                    label="お名前" required icon={<User size={14} />}
                    type="text" value={form.name} placeholder="山田 太郎"
                    onChange={(v) => update("name", v)}
                  />
                  <ValuationField
                    label="メールアドレス" required icon={<Mail size={14} />}
                    type="email" value={form.email} placeholder="example@email.com"
                    onChange={(v) => update("email", v)}
                  />
                  <ValuationField
                    label="電話番号" required icon={<Phone size={14} />}
                    type="tel" value={form.phone} placeholder="090-0000-0000"
                    onChange={(v) => update("phone", v)}
                  />
                </div>
              </div>

              {/* 物件情報 */}
              <div>
                <h3 className="text-sm font-bold text-gray-700 mb-3 pb-2 border-b flex items-center gap-1.5"
                  style={{ borderColor: "#F0F0F0" }}>
                  <Building2 size={14} style={{ color: "#5BAD52" }} />
                  物件情報
                </h3>
                <div className="space-y-3">
                  <ValuationField
                    label="物件の所在地" required icon={<MapPin size={14} />}
                    type="text" value={form.address} placeholder="東京都○○区○○ 番地まで"
                    onChange={(v) => update("address", v)}
                  />

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">
                      物件種別 <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {PROPERTY_TYPES.map((ptype) => (
                        <label
                          key={ptype}
                          className="flex items-center justify-center py-2 rounded-lg border text-xs font-medium cursor-pointer transition-all"
                          style={{
                            borderColor: form.propertyType === ptype ? "#5BAD52" : "#E5E5E5",
                            backgroundColor: form.propertyType === ptype ? "#EBF7EA" : "white",
                            color: form.propertyType === ptype ? "#5BAD52" : "#666",
                          }}
                        >
                          <input
                            type="radio" name="propertyType" value={ptype}
                            checked={form.propertyType === ptype}
                            onChange={() => update("propertyType", ptype)}
                            className="hidden"
                          />
                          {ptype}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">
                      売却希望時期 <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={form.timing}
                      onChange={(e) => update("timing", e.target.value)}
                      required
                      className="w-full px-3 py-2.5 border rounded-lg text-sm outline-none
                                 focus:border-felia-green cursor-pointer bg-white"
                      style={{ borderColor: form.timing ? "#5BAD52" : "#E5E5E5" }}
                    >
                      <option value="">選択してください</option>
                      {TIMING_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* 備考 */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">
                  ご要望・備考（任意）
                </label>
                <textarea
                  value={form.message}
                  onChange={(e) => update("message", e.target.value)}
                  placeholder="売却の背景・希望価格・リフォーム歴など、何でもお書きください"
                  rows={4}
                  className="w-full px-3 py-2.5 border rounded-lg text-sm outline-none
                             focus:border-felia-green transition-colors resize-none"
                  style={{ borderColor: "#E5E5E5" }}
                />
              </div>

              <p className="text-xs text-gray-400 leading-relaxed">
                送信することで
                <Link href="/privacy" className="underline">プライバシーポリシー</Link>
                に同意したものとみなされます。
              </p>

              <button
                type="submit"
                disabled={loading || !form.propertyType || !form.timing}
                className="w-full py-3.5 rounded-xl font-bold text-white transition-all
                           disabled:opacity-50 hover:scale-[1.01]"
                style={{ backgroundColor: "#5BAD52" }}
              >
                {loading ? "送信中..." : "無料査定を依頼する"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

function ValuationField({
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
