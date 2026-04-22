"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

// ---- 型定義 ----
interface Step1Data {
  name: string;
  name_kana: string;
  email: string;
  phone: string;
  password: string;
  password_confirm: string;
}

interface Step2Data {
  purpose: string;
  budget_min: string;
  budget_max: string;
  preferred_areas: string[];
  property_types: string[];
  preferred_rooms: string[];
  move_timing: string;
  remarks: string;
}

const AREAS = [
  "千代田区","中央区","港区","新宿区","文京区","台東区",
  "品川区","目黒区","大田区","世田谷区","渋谷区","中野区",
  "杉並区","豊島区","北区","荒川区","板橋区","練馬区",
];

const PROPERTY_TYPES = [
  { value: "new_house",    label: "新築戸建て" },
  { value: "used_house",   label: "中古戸建て" },
  { value: "mansion",      label: "新築マンション" },
  { value: "used_mansion", label: "中古マンション" },
  { value: "land",         label: "土地" },
];

const ROOM_TYPES = ["1LDK","2LDK","3LDK","4LDK","5LDK以上"];

const MOVE_TIMINGS = [
  "3ヶ月以内","6ヶ月以内","1年以内","1〜2年以内","時期は未定"
];

const BUDGET_OPTIONS = [
  "指定なし","3,000万円","5,000万円","7,000万円",
  "1億円","1.5億円","2億円","3億円","5億円","5億円以上"
];

// ---- メインコンポーネント ----
export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [step1, setStep1] = useState<Step1Data>({
    name: "", name_kana: "", email: "",
    phone: "", password: "", password_confirm: "",
  });

  const [step2, setStep2] = useState<Step2Data>({
    purpose: "purchase",
    budget_min: "",
    budget_max: "",
    preferred_areas: [],
    property_types: [],
    preferred_rooms: [],
    move_timing: "",
    remarks: "",
  });

  const toggleArray = (arr: string[], val: string): string[] =>
    arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val];

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!step1.name || !step1.email || !step1.password) {
      setError("必須項目を入力してください");
      return;
    }
    if (step1.password !== step1.password_confirm) {
      setError("パスワードが一致しません");
      return;
    }
    if (step1.password.length < 8) {
      setError("パスワードは8文字以上で入力してください");
      return;
    }
    setStep(2);
    window.scrollTo(0, 0);
  };

  const handleStep2Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/members/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...step1, ...step2 }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message ?? "登録に失敗しました");
      }
      router.push("/members/register/complete");
    } catch (err: any) {
      setError(err.message ?? "エラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ backgroundColor: "#f8f8f8", minHeight: "100vh" }}>

      {/* ヘッダー */}
      <div style={{
        background: "linear-gradient(135deg, #1a4a24 0%, #2d7a3a 60%, #5BAD52 100%)",
        padding: "48px 24px 40px",
        textAlign: "center",
        color: "#fff",
      }}>
        <Link href="/" style={{ display: "inline-block", marginBottom: "20px" }}>
          <span style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: "20px",
            fontWeight: "bold",
            color: "#fff",
            letterSpacing: "0.05em",
          }}>
            Felia <span style={{ fontWeight: "300" }}>Home</span>
          </span>
        </Link>
        <h1 style={{
          fontSize: "clamp(22px, 4vw, 32px)",
          fontWeight: "bold",
          margin: "0 0 8px",
        }}>
          無料会員登録
        </h1>
        <p style={{ fontSize: "14px", opacity: 0.8, margin: 0 }}>
          会員登録いただくと、非公開物件情報をご覧いただけます
        </p>
      </div>

      {/* ステップインジケーター */}
      <div style={{
        backgroundColor: "#fff",
        borderBottom: "1px solid #e8e8e8",
        padding: "20px 24px",
      }}>
        <div style={{
          maxWidth: "600px",
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          gap: "0",
        }}>
          {[
            { num: 1, label: "基本情報" },
            { num: 2, label: "購入希望条件" },
          ].map((s, i) => (
            <div key={s.num} style={{ display: "flex", alignItems: "center", flex: i < 1 ? "1" : "0" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{
                  width: "36px", height: "36px",
                  borderRadius: "50%",
                  backgroundColor: step >= s.num ? "#5BAD52" : "#e0e0e0",
                  color: step >= s.num ? "#fff" : "#aaa",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "14px", fontWeight: "bold",
                  flexShrink: 0,
                  transition: "all 0.3s ease",
                }}>
                  {step > s.num ? "✓" : s.num}
                </div>
                <span style={{
                  fontSize: "13px",
                  fontWeight: step === s.num ? "bold" : "normal",
                  color: step >= s.num ? "#333" : "#aaa",
                }}>
                  {s.label}
                </span>
              </div>
              {i < 1 && (
                <div style={{
                  flex: 1,
                  height: "2px",
                  backgroundColor: step > 1 ? "#5BAD52" : "#e0e0e0",
                  margin: "0 16px",
                  transition: "background-color 0.3s ease",
                }} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* フォーム */}
      <div style={{ maxWidth: "640px", margin: "0 auto", padding: "40px 24px 80px" }}>

        {/* エラー */}
        {error && (
          <div style={{
            backgroundColor: "#fdeaea",
            border: "1px solid #e87070",
            borderRadius: "8px",
            padding: "14px 16px",
            marginBottom: "24px",
            fontSize: "13px",
            color: "#8c1f1f",
          }}>
            {error}
          </div>
        )}

        {/* ---- STEP 1 ---- */}
        {step === 1 && (
          <form onSubmit={handleStep1Submit}>
            <div style={{
              backgroundColor: "#fff",
              borderRadius: "16px",
              border: "1px solid #e8e8e8",
              overflow: "hidden",
              boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
            }}>
              <div style={{
                borderBottom: "1px solid #e8e8e8",
                padding: "20px 28px",
                backgroundColor: "#fafafa",
              }}>
                <h2 style={{ fontSize: "16px", fontWeight: "bold", color: "#333", margin: 0 }}>
                  基本情報
                </h2>
              </div>

              <div style={{ padding: "28px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                  <FormField label="お名前" required>
                    <input
                      type="text"
                      value={step1.name}
                      onChange={e => setStep1(p => ({ ...p, name: e.target.value }))}
                      placeholder="山田 太郎"
                      required
                      style={inputStyle}
                    />
                  </FormField>

                  <FormField label="お名前（フリガナ）">
                    <input
                      type="text"
                      value={step1.name_kana}
                      onChange={e => setStep1(p => ({ ...p, name_kana: e.target.value }))}
                      placeholder="ヤマダ タロウ"
                      style={inputStyle}
                    />
                  </FormField>

                  <FormField label="メールアドレス" required>
                    <input
                      type="email"
                      value={step1.email}
                      onChange={e => setStep1(p => ({ ...p, email: e.target.value }))}
                      placeholder="example@email.com"
                      required
                      style={inputStyle}
                    />
                  </FormField>

                  <FormField label="電話番号">
                    <input
                      type="tel"
                      value={step1.phone}
                      onChange={e => setStep1(p => ({ ...p, phone: e.target.value }))}
                      placeholder="090-0000-0000"
                      style={inputStyle}
                    />
                  </FormField>

                  <FormField label="パスワード" required hint="8文字以上で設定してください">
                    <input
                      type="password"
                      value={step1.password}
                      onChange={e => setStep1(p => ({ ...p, password: e.target.value }))}
                      placeholder="8文字以上"
                      required
                      style={inputStyle}
                    />
                  </FormField>

                  <FormField label="パスワード（確認）" required>
                    <input
                      type="password"
                      value={step1.password_confirm}
                      onChange={e => setStep1(p => ({ ...p, password_confirm: e.target.value }))}
                      placeholder="もう一度入力"
                      required
                      style={inputStyle}
                    />
                  </FormField>
                </div>
              </div>
            </div>

            <p style={{ fontSize: "12px", color: "#888", margin: "20px 0", lineHeight: 1.7, textAlign: "center" }}>
              登録することで
              <Link href="/privacy" style={{ color: "#5BAD52", textDecoration: "none" }}>
                プライバシーポリシー
              </Link>
              に同意したものとみなされます
            </p>

            <button type="submit" style={primaryButtonStyle}>
              次へ進む →
            </button>

            <p style={{ textAlign: "center", marginTop: "20px", fontSize: "13px", color: "#888" }}>
              すでにアカウントをお持ちの方は
              <Link href="/members/login" style={{ color: "#5BAD52", textDecoration: "none", marginLeft: "4px" }}>
                ログイン
              </Link>
            </p>
          </form>
        )}

        {/* ---- STEP 2 ---- */}
        {step === 2 && (
          <form onSubmit={handleStep2Submit}>
            <div style={{
              backgroundColor: "#fff",
              borderRadius: "16px",
              border: "1px solid #e8e8e8",
              overflow: "hidden",
              boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
              marginBottom: "16px",
            }}>
              <div style={{
                borderBottom: "1px solid #e8e8e8",
                padding: "20px 28px",
                backgroundColor: "#fafafa",
              }}>
                <h2 style={{ fontSize: "16px", fontWeight: "bold", color: "#333", margin: 0 }}>
                  購入希望条件
                </h2>
                <p style={{ fontSize: "12px", color: "#888", margin: "4px 0 0" }}>
                  すべて任意項目です。後からマイページで変更できます。
                </p>
              </div>

              <div style={{ padding: "28px", display: "flex", flexDirection: "column", gap: "28px" }}>

                {/* ご購入目的 */}
                <SectionBlock label="ご購入目的">
                  <div style={{ display: "flex", gap: "10px" }}>
                    {[
                      { value: "purchase", label: "自己居住用" },
                      { value: "investment", label: "投資・資産運用" },
                      { value: "both", label: "両方" },
                    ].map(opt => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setStep2(p => ({ ...p, purpose: opt.value }))}
                        style={{
                          ...pillStyle,
                          ...(step2.purpose === opt.value ? pillActiveStyle : {}),
                        }}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </SectionBlock>

                {/* ご予算 */}
                <SectionBlock label="ご予算">
                  <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: "8px", alignItems: "center" }}>
                    <select
                      value={step2.budget_min}
                      onChange={e => setStep2(p => ({ ...p, budget_min: e.target.value }))}
                      style={selectStyle}
                    >
                      <option value="">下限なし</option>
                      {BUDGET_OPTIONS.filter(o => o !== "指定なし").map(o => (
                        <option key={o} value={o}>{o}</option>
                      ))}
                    </select>
                    <span style={{ fontSize: "14px", color: "#888", textAlign: "center" }}>〜</span>
                    <select
                      value={step2.budget_max}
                      onChange={e => setStep2(p => ({ ...p, budget_max: e.target.value }))}
                      style={selectStyle}
                    >
                      <option value="">上限なし</option>
                      {BUDGET_OPTIONS.filter(o => o !== "指定なし").map(o => (
                        <option key={o} value={o}>{o}</option>
                      ))}
                    </select>
                  </div>
                </SectionBlock>

                {/* 希望エリア */}
                <SectionBlock label="希望エリア（複数選択可）">
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                    {AREAS.map(area => (
                      <button
                        key={area}
                        type="button"
                        onClick={() => setStep2(p => ({ ...p, preferred_areas: toggleArray(p.preferred_areas, area) }))}
                        style={{
                          ...pillStyle,
                          ...(step2.preferred_areas.includes(area) ? pillActiveStyle : {}),
                        }}
                      >
                        {area}
                      </button>
                    ))}
                  </div>
                </SectionBlock>

                {/* 物件種別 */}
                <SectionBlock label="希望物件種別（複数選択可）">
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                    {PROPERTY_TYPES.map(pt => (
                      <button
                        key={pt.value}
                        type="button"
                        onClick={() => setStep2(p => ({ ...p, property_types: toggleArray(p.property_types, pt.value) }))}
                        style={{
                          ...pillStyle,
                          ...(step2.property_types.includes(pt.value) ? pillActiveStyle : {}),
                        }}
                      >
                        {pt.label}
                      </button>
                    ))}
                  </div>
                </SectionBlock>

                {/* 間取り */}
                <SectionBlock label="希望間取り（複数選択可）">
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                    {ROOM_TYPES.map(r => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setStep2(p => ({ ...p, preferred_rooms: toggleArray(p.preferred_rooms, r) }))}
                        style={{
                          ...pillStyle,
                          ...(step2.preferred_rooms.includes(r) ? pillActiveStyle : {}),
                        }}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </SectionBlock>

                {/* お引越し時期 */}
                <SectionBlock label="ご希望のお引越し時期">
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                    {MOVE_TIMINGS.map(t => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setStep2(p => ({ ...p, move_timing: p.move_timing === t ? "" : t }))}
                        style={{
                          ...pillStyle,
                          ...(step2.move_timing === t ? pillActiveStyle : {}),
                        }}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </SectionBlock>

                {/* 備考 */}
                <SectionBlock label="その他ご要望・備考">
                  <textarea
                    value={step2.remarks}
                    onChange={e => setStep2(p => ({ ...p, remarks: e.target.value }))}
                    placeholder="こだわりの条件などをご自由にご記入ください"
                    rows={4}
                    style={{
                      ...inputStyle,
                      resize: "vertical",
                      lineHeight: 1.7,
                    }}
                  />
                </SectionBlock>
              </div>
            </div>

            <div style={{ display: "flex", gap: "12px" }}>
              <button
                type="button"
                onClick={() => { setStep(1); window.scrollTo(0, 0); }}
                style={{
                  flex: "0 0 auto",
                  padding: "16px 24px",
                  backgroundColor: "#fff",
                  color: "#555",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  fontSize: "14px",
                  cursor: "pointer",
                }}
              >
                ← 戻る
              </button>
              <button
                type="submit"
                disabled={loading}
                style={{
                  ...primaryButtonStyle,
                  flex: 1,
                  opacity: loading ? 0.7 : 1,
                  cursor: loading ? "not-allowed" : "pointer",
                }}
              >
                {loading ? "登録中..." : "会員登録を完了する"}
              </button>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}

// ---- スタイル定数 ----
const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: "8px",
  border: "1px solid #e0e0e0",
  fontSize: "15px",
  color: "#333",
  outline: "none",
  boxSizing: "border-box",
  backgroundColor: "#fff",
  transition: "border-color 0.15s",
};

const selectStyle: React.CSSProperties = {
  width: "100%",
  padding: "11px 14px",
  borderRadius: "8px",
  border: "1px solid #e0e0e0",
  fontSize: "14px",
  color: "#333",
  outline: "none",
  backgroundColor: "#fff",
  cursor: "pointer",
};

const pillStyle: React.CSSProperties = {
  padding: "8px 16px",
  borderRadius: "20px",
  border: "1px solid #e0e0e0",
  backgroundColor: "#fff",
  color: "#555",
  fontSize: "13px",
  cursor: "pointer",
  transition: "all 0.15s ease",
  fontWeight: "normal",
};

const pillActiveStyle: React.CSSProperties = {
  border: "1.5px solid #5BAD52",
  backgroundColor: "#e8f5e6",
  color: "#3a8a32",
  fontWeight: "bold",
};

const primaryButtonStyle: React.CSSProperties = {
  display: "block",
  width: "100%",
  padding: "16px",
  backgroundColor: "#5BAD52",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  fontSize: "16px",
  fontWeight: "bold",
  cursor: "pointer",
  textAlign: "center",
  boxShadow: "0 4px 16px rgba(91,173,82,0.25)",
  transition: "all 0.15s ease",
};

// ---- サブコンポーネント ----
function FormField({
  label, required, hint, children
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label style={{
        display: "block",
        fontSize: "13px",
        fontWeight: "bold",
        color: "#444",
        marginBottom: "8px",
      }}>
        {label}
        {required && (
          <span style={{
            marginLeft: "6px",
            fontSize: "10px",
            backgroundColor: "#5BAD52",
            color: "#fff",
            padding: "2px 6px",
            borderRadius: "3px",
          }}>
            必須
          </span>
        )}
      </label>
      {hint && (
        <p style={{ fontSize: "11px", color: "#aaa", margin: "0 0 6px" }}>{hint}</p>
      )}
      {children}
    </div>
  );
}

function SectionBlock({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p style={{
        fontSize: "13px",
        fontWeight: "bold",
        color: "#444",
        margin: "0 0 12px",
        paddingBottom: "8px",
        borderBottom: "1px solid #f0f0f0",
      }}>
        {label}
      </p>
      {children}
    </div>
  );
}
