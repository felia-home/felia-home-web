// app/sell/valuation/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  User, Mail, Phone, MapPin, Home,
  CheckCircle, Building2,
} from "lucide-react";

const PROPERTY_TYPES = ["戸建て", "マンション", "土地", "収益物件", "その他"];
const TIMING_OPTIONS = [
  "3ヶ月以内に売りたい",
  "6ヶ月以内に売りたい",
  "1年以内に売りたい",
  "時期はまだ決めていない",
  "査定だけ知りたい",
];
const MERITS = ["✓ 査定完全無料", "✓ 売却のプロが対応", "✓ 秘密厳守", "✓ 相場価格がわかる"];

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "12px",
  fontWeight: "bold",
  color: "#555",
  marginBottom: "6px",
};

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

  // 完了画面
  if (done) {
    return (
      <div style={{
        minHeight: "100vh",
        backgroundColor: "#f8f8f8",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "40px 16px",
      }}>
        <div style={{
          backgroundColor: "#fff",
          borderRadius: "16px",
          padding: "48px 40px",
          maxWidth: "480px",
          width: "100%",
          textAlign: "center",
          border: "1px solid #E5E5E5",
        }}>
          <div style={{
            width: "64px", height: "64px", borderRadius: "50%",
            backgroundColor: "#EBF7EA",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 20px",
          }}>
            <CheckCircle size={32} style={{ color: "#5BAD52" }} />
          </div>
          <h1 style={{ fontSize: "20px", fontWeight: "bold", color: "#333", margin: "0 0 12px" }}>
            査定依頼を受け付けました
          </h1>
          <p style={{ fontSize: "14px", color: "#666", lineHeight: 1.8, margin: "0 0 28px" }}>
            担当者より営業時間内（09:30〜19:00）にご連絡いたします。
          </p>
          <Link href="/" style={{
            display: "block",
            padding: "14px",
            backgroundColor: "#5BAD52",
            color: "#fff",
            borderRadius: "8px",
            textDecoration: "none",
            fontWeight: "bold",
            fontSize: "15px",
          }}>
            トップページに戻る
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: "#f8f8f8", minHeight: "100vh" }}>

      {/* ページヘッダー */}
      <div style={{ backgroundColor: "#fff", borderBottom: "1px solid #E5E5E5", padding: "24px" }}>
        <div style={{ maxWidth: "720px", margin: "0 auto" }}>
          <div style={{ display: "flex", gap: "6px", fontSize: "12px", color: "#aaa", marginBottom: "8px" }}>
            <Link href="/" style={{ color: "#aaa", textDecoration: "none" }}>ホーム</Link>
            <span>›</span>
            <Link href="/sell" style={{ color: "#aaa", textDecoration: "none" }}>売りたい</Link>
            <span>›</span>
            <span style={{ color: "#333" }}>無料査定依頼</span>
          </div>
          <h1 style={{ fontSize: "22px", fontWeight: "bold", color: "#333", margin: "0 0 4px", display: "flex", alignItems: "center", gap: "8px" }}>
            <Home size={22} style={{ color: "#5BAD52" }} />
            無料売却査定のご依頼
          </h1>
          <p style={{ fontSize: "13px", color: "#888", margin: 0 }}>
            査定は完全無料・しつこい営業は一切ありません
          </p>
        </div>
      </div>

      {/* 特典バナー */}
      <div style={{ background: "linear-gradient(135deg, #1a3a1a, #2d5a2d, #5BAD52)", padding: "16px 24px" }}>
        <div style={{ maxWidth: "720px", margin: "0 auto", display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "16px" }}>
          {MERITS.map((item) => (
            <span key={item} style={{ color: "#fff", fontSize: "13px", fontWeight: "bold" }}>{item}</span>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: "720px", margin: "0 auto", padding: "32px 24px 80px" }}>
        <div style={{ backgroundColor: "#fff", borderRadius: "12px", border: "1px solid #E5E5E5", padding: "28px" }}>

          <p style={{ fontSize: "14px", color: "#666", lineHeight: 1.8, margin: "0 0 20px" }}>
            フォームに必要事項をご入力ください。担当者より営業時間内（09:30〜19:00）にご連絡いたします。
          </p>

          {error && (
            <div style={{
              marginBottom: "16px", padding: "12px 14px",
              borderRadius: "8px", backgroundColor: "#fef2f2",
              border: "1px solid #fca5a5",
              fontSize: "13px", color: "#991b1b",
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

            {/* お客様情報 */}
            <div>
              <h3 style={{
                fontSize: "13px", fontWeight: "bold", color: "#555",
                margin: "0 0 14px", paddingBottom: "8px",
                borderBottom: "1px solid #f0f0f0",
                display: "flex", alignItems: "center", gap: "6px",
              }}>
                <User size={14} style={{ color: "#5BAD52" }} />お客様情報
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <ValuationField label="お名前" required icon={<User size={13} />}
                  type="text" value={form.name} placeholder="山田 太郎"
                  onChange={(v) => update("name", v)} />
                <ValuationField label="メールアドレス" required icon={<Mail size={13} />}
                  type="email" value={form.email} placeholder="example@email.com"
                  onChange={(v) => update("email", v)} />
                <ValuationField label="電話番号" required icon={<Phone size={13} />}
                  type="tel" value={form.phone} placeholder="090-0000-0000"
                  onChange={(v) => update("phone", v)} />
              </div>
            </div>

            {/* 物件情報 */}
            <div>
              <h3 style={{
                fontSize: "13px", fontWeight: "bold", color: "#555",
                margin: "0 0 14px", paddingBottom: "8px",
                borderBottom: "1px solid #f0f0f0",
                display: "flex", alignItems: "center", gap: "6px",
              }}>
                <Building2 size={14} style={{ color: "#5BAD52" }} />物件情報
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <ValuationField label="物件の所在地" required icon={<MapPin size={13} />}
                  type="text" value={form.address} placeholder="東京都渋谷区〇〇 1-2-3"
                  onChange={(v) => update("address", v)} />

                {/* 物件種別 */}
                <div>
                  <label style={labelStyle}>
                    物件種別 <span style={{ color: "#fff", fontSize: "10px", marginLeft: "6px", backgroundColor: "#e53e3e", padding: "1px 6px", borderRadius: "3px" }}>必須</span>
                  </label>
                  <div className="valuation-type-grid" style={{ display: "grid", gap: "8px" }}>
                    {PROPERTY_TYPES.map((ptype) => (
                      <label key={ptype} style={{
                        display: "flex", alignItems: "center", justifyContent: "center",
                        padding: "10px 8px", borderRadius: "8px", cursor: "pointer",
                        border: `1.5px solid ${form.propertyType === ptype ? "#5BAD52" : "#E5E5E5"}`,
                        backgroundColor: form.propertyType === ptype ? "#EBF7EA" : "#fff",
                        fontSize: "13px",
                        fontWeight: form.propertyType === ptype ? "bold" : "normal",
                        color: form.propertyType === ptype ? "#2d7a3a" : "#555",
                        transition: "all 0.15s ease",
                      }}>
                        <input
                          type="radio" name="propertyType" value={ptype}
                          checked={form.propertyType === ptype}
                          onChange={() => update("propertyType", ptype)}
                          style={{ display: "none" }}
                        />
                        {ptype}
                      </label>
                    ))}
                  </div>
                </div>

                {/* 売却希望時期 */}
                <div>
                  <label style={labelStyle}>
                    売却希望時期 <span style={{ color: "#fff", fontSize: "10px", marginLeft: "6px", backgroundColor: "#e53e3e", padding: "1px 6px", borderRadius: "3px" }}>必須</span>
                  </label>
                  <select
                    value={form.timing}
                    onChange={(e) => update("timing", e.target.value)}
                    required
                    style={{
                      width: "100%", padding: "10px 12px",
                      border: "1px solid #E5E5E5", borderRadius: "8px",
                      fontSize: "14px",
                      color: form.timing ? "#333" : "#aaa",
                      outline: "none", backgroundColor: "#fff", cursor: "pointer",
                      boxSizing: "border-box",
                    }}
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
              <label style={labelStyle}>ご要望・備考（任意）</label>
              <textarea
                value={form.message}
                onChange={(e) => update("message", e.target.value)}
                rows={4}
                placeholder="ご自由にご記入ください"
                style={{
                  width: "100%", padding: "10px 12px",
                  border: "1px solid #E5E5E5", borderRadius: "8px",
                  fontSize: "14px", color: "#333", outline: "none",
                  backgroundColor: "#fff", resize: "vertical", lineHeight: 1.7,
                  boxSizing: "border-box",
                }}
              />
            </div>

            <p style={{ fontSize: "12px", color: "#aaa", lineHeight: 1.7, margin: 0 }}>
              送信することで
              <Link href="/privacy" style={{ color: "#5BAD52", textDecoration: "none" }}>プライバシーポリシー</Link>
              に同意したものとみなされます。
            </p>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%", padding: "15px",
                backgroundColor: "#5BAD52", color: "#fff",
                border: "none", borderRadius: "8px",
                fontSize: "16px", fontWeight: "bold",
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.6 : 1,
              }}
            >
              {loading ? "送信中..." : "無料査定を依頼する"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function ValuationField({
  label, required, icon, type, value, placeholder, onChange,
}: {
  label: string;
  required?: boolean;
  icon: React.ReactNode;
  type: string;
  value: string;
  placeholder: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label style={{ display: "block", fontSize: "12px", fontWeight: "bold", color: "#555", marginBottom: "6px" }}>
        {label}
        {required && (
          <span style={{ color: "#fff", fontSize: "10px", marginLeft: "6px", backgroundColor: "#e53e3e", padding: "1px 6px", borderRadius: "3px" }}>
            必須
          </span>
        )}
      </label>
      <div style={{ position: "relative" }}>
        <span style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "#aaa" }}>
          {icon}
        </span>
        <input
          type={type}
          value={value}
          required={required}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          style={{
            width: "100%", padding: "10px 12px 10px 34px",
            border: "1px solid #E5E5E5", borderRadius: "8px",
            fontSize: "14px", color: "#333", outline: "none",
            backgroundColor: "#fff", boxSizing: "border-box",
          }}
        />
      </div>
    </div>
  );
}
