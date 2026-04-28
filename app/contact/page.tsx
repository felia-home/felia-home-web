// app/contact/page.tsx
"use client";

import { useState, useEffect, Suspense, useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";

// ---- 営業日カレンダー生成（火・水定休） ----
function getBusinessDays(count: number): Date[] {
  const days: Date[] = [];
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 1);
  while (days.length < count) {
    const dow = d.getDay();
    if (dow !== 2 && dow !== 3) {
      days.push(new Date(d));
    }
    d.setDate(d.getDate() + 1);
  }
  return days;
}

function formatDate(d: Date): string {
  const dow = ["日", "月", "火", "水", "木", "金", "土"];
  return `${d.getMonth() + 1}月${d.getDate()}日（${dow[d.getDay()]}）`;
}

// ---- メインフォーム ----
function ContactForm() {
  const searchParams = useSearchParams();
  const propertyId = searchParams.get("property_id") ?? searchParams.get("propertyId") ?? "";
  const reinsId    = searchParams.get("reins_id") ?? searchParams.get("reinsId") ?? "";
  const propertyNo = searchParams.get("propertyNo") ?? searchParams.get("property_no") ?? "";
  const type       = searchParams.get("type") ?? "general";
  const token      = searchParams.get("token") ?? "";

  const isDocument = type === "document";
  const isVisit    = type === "visit";
  const isPrivate  = type === "private";
  const isReins    = type === "reins" || !!reinsId;
  const isProperty = !!propertyId || isReins || isPrivate || isDocument || isVisit;

  const session    = useSession();
  const isLoggedIn = session?.status === "authenticated";
  const memberId   = (session?.data?.user as any)?.id ?? null;

  const [form, setForm]                 = useState({ name: "", email: "", phone: "", message: "" });
  const [loading, setLoading]           = useState(false);
  const [done, setDone]                 = useState(false);
  const [error, setError]               = useState("");
  const [contactPhone, setContactPhone] = useState("03-5981-8601");
  const [property, setProperty]         = useState<any>(null);

  const businessDays = useMemo(() => getBusinessDays(21), []);
  const [selectedDates, setSelectedDates] = useState<string[]>([]);

  const update = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  // プロフィール自動入力
  useEffect(() => {
    if (!isLoggedIn || !memberId) return;
    fetch("/api/members/profile")
      .then((r) => r.json())
      .then((d) => {
        const m = d.member ?? d;
        setForm((prev) => ({
          ...prev,
          name:  m.name  ?? prev.name,
          email: m.email ?? prev.email,
          phone: m.phone ?? m.tel ?? prev.phone,
        }));
      })
      .catch(() => {});
  }, [isLoggedIn, memberId]);

  // 電話番号
  useEffect(() => {
    fetch("/api/company-info")
      .then((r) => r.json())
      .then((d) => {
        if (d.company?.phone) setContactPhone(d.company.phone);
      })
      .catch(() => {});
    if (propertyId) {
      fetch(`/api/properties/${propertyId}/store-phone`)
        .then((r) => r.json())
        .then((d) => {
          if (d.phone) setContactPhone(d.phone);
        })
        .catch(() => {});
    }
  }, [propertyId]);

  // 物件情報取得
  useEffect(() => {
    if (!propertyId && !reinsId) return;
    const url = reinsId ? `/api/reins/${reinsId}` : `/api/properties/search?id=${propertyId}`;
    fetch(url)
      .then((r) => r.json())
      .then((d) => {
        setProperty(d.property ?? d.properties?.[0] ?? d);
      })
      .catch(() => {});
  }, [propertyId, reinsId]);

  const toggleDate = (dateStr: string) => {
    setSelectedDates((prev) =>
      prev.includes(dateStr)
        ? prev.filter((d) => d !== dateStr)
        : prev.length < 3 ? [...prev, dateStr] : prev
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isVisit && selectedDates.length === 0) {
      setError("来店希望日を1つ以上選択してください");
      return;
    }
    setError(""); setLoading(true);
    try {
      const visitMessage = isVisit
        ? `【来店予約】\n希望日:\n${selectedDates.join("\n")}${form.message ? `\n\n備考: ${form.message}` : ""}`
        : isDocument
        ? `【資料請求】${form.message ? `\n備考: ${form.message}` : ""}`
        : form.message;

      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name, email: form.email,
          phone: form.phone || undefined,
          message: visitMessage,
          propertyId: propertyId || undefined,
          reinsId: reinsId || undefined,
          propertyNo: propertyNo || undefined,
          inquiryType: isProperty ? "PROPERTY" : "GENERAL",
          token: token || undefined,
          visitDates: isVisit ? selectedDates : undefined,
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

  // ---- 完了画面 ----
  if (done) {
    return (
      <div style={{ backgroundColor: "#f8f8f8", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px" }}>
        <div style={{ backgroundColor: "#fff", borderRadius: "16px", padding: "48px 40px", maxWidth: "480px", width: "100%", textAlign: "center", border: "1px solid #e8e8e8" }}>
          <div style={{ width: "64px", height: "64px", borderRadius: "50%", backgroundColor: "#e8f5e6", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: "28px" }}>
            ✓
          </div>
          <h1 style={{ fontSize: "20px", fontWeight: "bold", color: "#333", margin: "0 0 12px" }}>
            {isDocument ? "資料請求を受け付けました" : isVisit ? "来店予約を受け付けました" : "お問い合わせを受け付けました"}
          </h1>
          <p style={{ fontSize: "14px", color: "#666", lineHeight: 1.8, margin: "0 0 28px" }}>
            {isVisit
              ? "ご希望の日程を確認後、担当者よりご連絡いたします。"
              : "担当者より営業時間内にご連絡いたします。"}
          </p>
          <Link href="/" style={{ display: "block", padding: "14px", backgroundColor: "#5BAD52", color: "#fff", borderRadius: "8px", textDecoration: "none", fontWeight: "bold", fontSize: "15px" }}>
            トップページに戻る
          </Link>
        </div>
      </div>
    );
  }

  const pageTitle = isDocument ? "資料請求"
    : isVisit ? "来店予約"
    : isPrivate ? "非公開物件のお問い合わせ"
    : isProperty ? "物件のお問い合わせ"
    : "お問い合わせ";

  return (
    <div style={{ backgroundColor: "#f8f8f8", minHeight: "100vh" }}>

      {/* ヘッダー */}
      <div style={{ backgroundColor: "#fff", borderBottom: "1px solid #e8e8e8", padding: "24px" }}>
        <div style={{ maxWidth: "720px", margin: "0 auto" }}>
          <div style={{ display: "flex", gap: "6px", fontSize: "12px", color: "#aaa", marginBottom: "8px" }}>
            <Link href="/" style={{ color: "#aaa", textDecoration: "none" }}>ホーム</Link>
            <span>›</span>
            <span style={{ color: "#333" }}>{pageTitle}</span>
          </div>
          <h1 style={{ fontSize: "22px", fontWeight: "bold", color: "#333", margin: 0 }}>
            {pageTitle}
          </h1>
        </div>
      </div>

      <div style={{ maxWidth: "720px", margin: "0 auto", padding: "32px 24px 80px" }}>

        {/* 業者お断り */}
        <div style={{ backgroundColor: "#fffbeb", border: "1px solid #f59e0b", borderRadius: "8px", padding: "12px 16px", marginBottom: "20px" }}>
          <p style={{ fontSize: "12px", color: "#92400e", margin: 0 }}>
            ⚠️ こちらのフォームは<strong>個人のお客様専用</strong>です。不動産業者・同業者の方からのお問い合わせはお断りしております。
          </p>
        </div>

        {/* 物件情報カード */}
        {isProperty && property && (
          <div style={{
            backgroundColor: "#fff", borderRadius: "10px",
            border: "1px solid #e8e8e8", padding: "16px 20px",
            marginBottom: "20px",
            display: "flex", gap: "16px", alignItems: "flex-start",
          }}>
            <span style={{ fontSize: "24px", flexShrink: 0 }}>🏠</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: "11px", color: "#5BAD52", fontWeight: "bold", margin: "0 0 4px" }}>
                {isReins ? "REINS物件" : "お問い合わせ物件"}
              </p>
              <p style={{ fontSize: "14px", fontWeight: "bold", color: "#333", margin: "0 0 4px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {property.title ?? property.building_name ?? [property.city ?? property.area, property.town].filter(Boolean).join(" ") ?? "物件詳細"}
              </p>
              {property.price != null && (
                <p style={{ fontSize: "13px", color: "#5BAD52", fontWeight: "bold", margin: 0 }}>
                  {property.price.toLocaleString()}万円
                </p>
              )}
              {propertyNo && (
                <p style={{ fontSize: "11px", color: "#aaa", margin: "4px 0 0" }}>物件番号: {propertyNo}</p>
              )}
            </div>
          </div>
        )}

        {/* メインカード */}
        <div style={{ backgroundColor: "#fff", borderRadius: "12px", border: "1px solid #e8e8e8", padding: "28px" }}>

          <p style={{ fontSize: "14px", color: "#666", margin: "0 0 20px", lineHeight: 1.7 }}>
            {isDocument
              ? "以下の内容で資料請求を送信します。担当者より営業時間内にご連絡いたします。"
              : isVisit
              ? "ご希望の来店日を最大3つ選択してください。"
              : "以下のフォームにご入力ください。担当者より営業時間内（09:30〜19:00）にご連絡いたします。"}
          </p>

          {error && (
            <div style={{ backgroundColor: "#fef2f2", border: "1px solid #fca5a5", borderRadius: "6px", padding: "12px 16px", marginBottom: "16px", fontSize: "13px", color: "#991b1b" }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>

            {isLoggedIn ? (
              <div style={{ backgroundColor: "#f0f5f2", border: "1px solid #5BAD52", borderRadius: "8px", padding: "16px 20px", marginBottom: "20px", display: "flex", alignItems: "center", gap: "12px" }}>
                <span style={{ fontSize: "20px" }}>✓</span>
                <div>
                  <p style={{ fontSize: "13px", fontWeight: "bold", color: "#2d7a3a", margin: "0 0 2px" }}>会員情報で送信します</p>
                  <p style={{ fontSize: "12px", color: "#666", margin: 0 }}>
                    {form.name}　{form.email}{form.phone ? `　${form.phone}` : ""}
                  </p>
                </div>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "20px" }}>
                <Field label="お名前" required>
                  <input type="text" value={form.name} required onChange={(e) => update("name", e.target.value)} placeholder="山田 太郎" style={inp} />
                </Field>
                <Field label="メールアドレス" required>
                  <input type="email" value={form.email} required onChange={(e) => update("email", e.target.value)} placeholder="example@email.com" style={inp} />
                </Field>
                <Field label="電話番号">
                  <input type="tel" value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="090-0000-0000" style={inp} />
                </Field>
              </div>
            )}

            {/* 来店予約：日程選択カレンダー */}
            {isVisit && (
              <div style={{ marginBottom: "20px" }}>
                <p style={{ fontSize: "13px", fontWeight: "bold", color: "#444", margin: "0 0 12px" }}>
                  来店希望日を選択（最大3つ）
                  <span style={{ fontSize: "11px", color: "#aaa", marginLeft: "8px" }}>定休日：火・水曜日</span>
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  {businessDays.map((d) => {
                    const str = formatDate(d);
                    const selected = selectedDates.includes(str);
                    const disabled = !selected && selectedDates.length >= 3;
                    return (
                      <button
                        key={str}
                        type="button"
                        onClick={() => toggleDate(str)}
                        disabled={disabled}
                        style={{
                          display: "flex", alignItems: "center", gap: "12px",
                          padding: "12px 16px", borderRadius: "8px",
                          border: selected ? "1.5px solid #5BAD52" : "1px solid #e0e0e0",
                          backgroundColor: selected ? "#e8f5e6" : disabled ? "#fafafa" : "#fff",
                          color: selected ? "#2d7a3a" : disabled ? "#ccc" : "#333",
                          cursor: disabled ? "not-allowed" : "pointer",
                          fontSize: "14px", fontWeight: selected ? "bold" : "normal",
                          transition: "all 0.15s ease",
                          textAlign: "left",
                        }}
                      >
                        <span style={{
                          width: "20px", height: "20px", borderRadius: "50%",
                          border: selected ? "none" : "1.5px solid #ccc",
                          backgroundColor: selected ? "#5BAD52" : "transparent",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          flexShrink: 0, fontSize: "12px", color: "#fff",
                        }}>
                          {selected ? "✓" : ""}
                        </span>
                        {str}
                      </button>
                    );
                  })}
                </div>
                {selectedDates.length > 0 && (
                  <div style={{ marginTop: "12px", padding: "10px 14px", backgroundColor: "#f0f5f2", borderRadius: "6px" }}>
                    <p style={{ fontSize: "12px", color: "#2d7a3a", fontWeight: "bold", margin: "0 0 4px" }}>選択中の候補日</p>
                    {selectedDates.map((d, i) => (
                      <p key={d} style={{ fontSize: "13px", color: "#333", margin: "2px 0" }}>
                        第{i + 1}希望: {d}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* お問い合わせ内容 */}
            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "bold", color: "#444", marginBottom: "8px" }}>
                {isDocument ? "備考（任意）" : isVisit ? "その他ご要望（任意）" : "お問い合わせ内容"}
              </label>
              <textarea
                value={form.message}
                onChange={(e) => update("message", e.target.value)}
                placeholder={
                  isDocument ? "資料についてのご要望があればご記入ください"
                  : isVisit ? "ご来店についてのご要望・ご質問があればご記入ください"
                  : isPrivate ? "非公開物件についてのご質問・ご要望をご記入ください"
                  : "ご質問・ご要望などがあればご記入ください"
                }
                rows={4}
                style={{ ...inp, resize: "vertical", lineHeight: 1.7 }}
              />
            </div>

            <p style={{ fontSize: "12px", color: "#aaa", margin: "0 0 16px", lineHeight: 1.7 }}>
              送信することで<Link href="/privacy" style={{ color: "#5BAD52", textDecoration: "none" }}>プライバシーポリシー</Link>に同意したものとみなされます。
            </p>

            <button
              type="submit"
              disabled={loading || (isVisit && selectedDates.length === 0)}
              style={{
                display: "block", width: "100%", padding: "15px",
                backgroundColor: isDocument ? "#1a4a24" : isVisit ? "#2d4a6a" : "#5BAD52",
                color: "#fff", border: "none", borderRadius: "8px",
                fontSize: "16px", fontWeight: "bold",
                cursor: (loading || (isVisit && selectedDates.length === 0)) ? "not-allowed" : "pointer",
                opacity: (loading || (isVisit && selectedDates.length === 0)) ? 0.6 : 1,
                transition: "all 0.15s ease",
              }}
            >
              {loading ? "送信中..." : isDocument ? "資料請求を送信する" : isVisit ? "来店予約を送信する" : "送信する"}
            </button>
          </form>

          {/* 電話CTA */}
          <div style={{ marginTop: "24px", paddingTop: "20px", borderTop: "1px solid #f0f0f0", textAlign: "center" }}>
            <p style={{ fontSize: "12px", color: "#aaa", marginBottom: "8px" }}>お急ぎの方はお電話でどうぞ</p>
            <a
              href={`tel:${contactPhone.replace(/-/g, "")}`}
              style={{ fontWeight: "bold", fontSize: "20px", color: "#5BAD52", textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}
            >
              📞 {contactPhone}
            </a>
            <p style={{ fontSize: "11px", color: "#aaa", marginTop: "4px" }}>受付時間 09:30〜19:00（火・水定休）</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---- スタイル定数 ----
const inp: React.CSSProperties = {
  width: "100%", padding: "11px 14px",
  borderRadius: "8px", border: "1px solid #e0e0e0",
  fontSize: "15px", color: "#333",
  outline: "none", boxSizing: "border-box",
  backgroundColor: "#fff",
};

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ display: "block", fontSize: "13px", fontWeight: "bold", color: "#444", marginBottom: "8px" }}>
        {label}
        {required && <span style={{ marginLeft: "6px", fontSize: "10px", backgroundColor: "#5BAD52", color: "#fff", padding: "2px 6px", borderRadius: "3px" }}>必須</span>}
      </label>
      {children}
    </div>
  );
}

export default function ContactPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", backgroundColor: "#f8f8f8" }} />}>
      <ContactForm />
    </Suspense>
  );
}
