"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// ---- カラー定数 ----
const C = {
  accent: "#2d5e4a",
  accentLight: "#3d7a60",
  accentBg: "#f0f5f2",
  paper: "#f7f5f0",
  text: "#1a1a1a",
  textMuted: "#666",
  border: "#e0dbd4",
  white: "#ffffff",
};

// ---- 型定義 ----
interface Step1Data {
  email: string;
  password: string;
  password_confirm: string;
}

interface Step2Data {
  name: string;
  name_kana: string;
  phone: string;
  purpose: string;
  budget_min: string;
  budget_max: string;
  preferred_areas: string[];
  property_types: string[];
  preferred_rooms: string[];
  move_timing: string;
  remarks: string;
  privacy_agreed: boolean;
}

const AREAS = [
  "千代田区","中央区","港区","新宿区","文京区","台東区",
  "品川区","目黒区","大田区","世田谷区","渋谷区","中野区",
  "杉並区","豊島区","北区","荒川区","板橋区","練馬区",
];

const PROPERTY_TYPES = [
  { value: "new_house", label: "新築戸建て" },
  { value: "used_house", label: "中古戸建て" },
  { value: "mansion", label: "新築マンション" },
  { value: "used_mansion", label: "中古マンション" },
  { value: "land", label: "土地" },
];

const BUDGET_OPTIONS = [
  "3,000万円","5,000万円","7,000万円",
  "1億円","1.5億円","2億円","3億円","5億円","5億円以上"
];

const ROOM_TYPES = ["1LDK","2LDK","3LDK","4LDK","5LDK以上"];
const MOVE_TIMINGS = ["3ヶ月以内","6ヶ月以内","1年以内","1〜2年以内","時期は未定"];

// ---- メインコンポーネント ----
export default function RegisterLPPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [step1, setStep1] = useState<Step1Data>({
    email: "", password: "", password_confirm: "",
  });

  const [step2, setStep2] = useState<Step2Data>({
    name: "", name_kana: "", phone: "",
    purpose: "purchase",
    budget_min: "", budget_max: "",
    preferred_areas: [], property_types: [],
    preferred_rooms: [], move_timing: "",
    remarks: "", privacy_agreed: false,
  });

  const toggle = (arr: string[], val: string) =>
    arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val];

  const handleStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!step1.email || !step1.password) { setError("必須項目を入力してください"); return; }
    if (step1.password !== step1.password_confirm) { setError("パスワードが一致しません"); return; }
    if (step1.password.length < 8) { setError("パスワードは8文字以上で入力してください"); return; }
    setStep(2);
    window.scrollTo(0, 0);
  };

  const handleStep2 = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!step2.privacy_agreed) { setError("プライバシーポリシーへの同意が必要です"); return; }
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
    <main style={{ backgroundColor: C.paper, minHeight: "100vh" }}>

      {/* ============ HERO ============ */}
      <section style={{
        background: `linear-gradient(160deg, #0d2218 0%, ${C.accent} 50%, #3d7a60 100%)`,
        padding: "100px 24px 80px",
        color: C.white,
        position: "relative",
        overflow: "hidden",
      }}>
        {/* 装飾円 */}
        <div style={{ position: "absolute", top: "-100px", right: "-100px", width: "500px", height: "500px", borderRadius: "50%", backgroundColor: "rgba(255,255,255,0.04)" }} />
        <div style={{ position: "absolute", bottom: "-60px", left: "-60px", width: "300px", height: "300px", borderRadius: "50%", backgroundColor: "rgba(255,255,255,0.03)" }} />

        <div style={{ maxWidth: "900px", margin: "0 auto", position: "relative", zIndex: 1 }}>
          {/* ブランドロゴ */}
          <div style={{ marginBottom: "40px" }}>
            <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "18px", fontWeight: "300", letterSpacing: "0.1em", opacity: 0.9 }}>
              Felia <strong style={{ fontWeight: "700" }}>Home</strong>
            </span>
          </div>

          {/* キャッチコピー */}
          <h1 style={{
            fontFamily: "'Noto Serif JP', serif",
            fontSize: "clamp(28px, 5vw, 52px)",
            fontWeight: "600",
            lineHeight: 1.3,
            margin: "0 0 24px",
            letterSpacing: "0.02em",
          }}>
            市場に出る前の物件情報を、<br />
            会員様へ。
          </h1>

          <p style={{
            fontSize: "clamp(14px, 2vw, 17px)",
            lineHeight: 1.9,
            opacity: 0.8,
            margin: "0 0 56px",
            maxWidth: "560px",
          }}>
            フェリアホームの会員登録で、
            一般には公開されない非公開物件・未公開物件へアクセスできます。
            登録は無料、いつでも退会可能です。
          </p>

          {/* 統計 */}
          <div style={{ display: "flex", gap: "48px", flexWrap: "wrap", marginBottom: "56px" }}>
            {[
              { num: "100", unit: "件+", label: "非公開物件数" },
              { num: "60", unit: "秒", label: "登録所要時間" },
              { num: "0", unit: "円", label: "会員費用" },
              { num: "18", unit: "区", label: "対応エリア" },
            ].map((s) => (
              <div key={s.label}>
                <div style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: "clamp(28px, 4vw, 44px)",
                  fontWeight: "700",
                  lineHeight: 1,
                  marginBottom: "4px",
                }}>
                  {s.num}<span style={{ fontSize: "0.5em", opacity: 0.7 }}>{s.unit}</span>
                </div>
                <div style={{ fontSize: "12px", opacity: 0.6, letterSpacing: "0.05em" }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <a
            href="#register"
            style={{
              display: "inline-block",
              padding: "18px 48px",
              backgroundColor: C.white,
              color: C.accent,
              borderRadius: "4px",
              textDecoration: "none",
              fontWeight: "bold",
              fontSize: "16px",
              letterSpacing: "0.05em",
              boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
            }}
          >
            無料で会員登録する
          </a>
        </div>
      </section>

      {/* ============ PRIVATE SELECTION ============ */}
      <section style={{ padding: "96px 24px", backgroundColor: C.white }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "56px" }}>
            <p style={{ fontSize: "11px", color: C.accent, letterSpacing: "0.3em", margin: "0 0 12px", fontFamily: "'Montserrat', sans-serif", fontWeight: "600" }}>
              PRIVATE SELECTION
            </p>
            <h2 style={{ fontFamily: "'Noto Serif JP', serif", fontSize: "clamp(22px, 4vw, 34px)", fontWeight: "600", color: C.text, margin: "0 0 16px" }}>
              会員限定の非公開物件
            </h2>
            <p style={{ fontSize: "14px", color: C.textMuted, margin: 0, lineHeight: 1.8 }}>
              以下はフェリアホームが取り扱う非公開物件の一例です。<br />
              会員登録後、実際の物件情報・価格・詳細をご覧いただけます。
            </p>
          </div>

          {/* ぼかし物件カード */}
          <div className="lp-private-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px" }}>
            {[
              { area: "港区", type: "マンション", price: "●,●●●万円" },
              { area: "渋谷区", type: "戸建て", price: "●,●●●万円" },
              { area: "千代田区", type: "マンション", price: "●●,●●●万円" },
              { area: "目黒区", type: "戸建て", price: "●,●●●万円" },
            ].map((card, i) => (
              <div
                key={i}
                style={{
                  backgroundColor: C.paper,
                  borderRadius: "8px",
                  overflow: "hidden",
                  border: `1px solid ${C.border}`,
                  position: "relative",
                }}
              >
                {/* 画像プレースホルダー */}
                <div style={{
                  height: "160px",
                  backgroundColor: "#d4d0c8",
                  filter: "blur(6px)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "48px",
                }}>
                  🏠
                </div>

                {/* ロックオーバーレイ */}
                <div style={{
                  position: "absolute",
                  top: 0, left: 0, right: 0,
                  height: "160px",
                  backgroundColor: "rgba(13,34,24,0.5)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}>
                  <div style={{ textAlign: "center", color: C.white }}>
                    <div style={{ fontSize: "28px", marginBottom: "4px" }}>🔒</div>
                    <div style={{ fontSize: "11px", opacity: 0.8, letterSpacing: "0.1em" }}>MEMBERS ONLY</div>
                  </div>
                </div>

                {/* 物件情報（ぼかし） */}
                <div style={{ padding: "16px", filter: "blur(4px)", userSelect: "none" }}>
                  <p style={{ fontSize: "11px", color: C.accent, fontWeight: "bold", margin: "0 0 4px" }}>{card.area} · {card.type}</p>
                  <p style={{ fontSize: "18px", fontWeight: "bold", color: C.text, margin: 0 }}>{card.price}</p>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: "center", marginTop: "32px" }}>
            <a href="#register" style={{ color: C.accent, fontSize: "14px", textDecoration: "none", fontWeight: "bold" }}>
              会員登録して物件を見る →
            </a>
          </div>
        </div>
      </section>

      {/* ============ BENEFITS ============ */}
      <section style={{ padding: "96px 24px", backgroundColor: C.paper }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "56px" }}>
            <p style={{ fontSize: "11px", color: C.accent, letterSpacing: "0.3em", margin: "0 0 12px", fontFamily: "'Montserrat', sans-serif", fontWeight: "600" }}>
              MEMBER BENEFITS
            </p>
            <h2 style={{ fontFamily: "'Noto Serif JP', serif", fontSize: "clamp(22px, 4vw, 34px)", fontWeight: "600", color: C.text, margin: 0 }}>
              会員だけの4つの特典
            </h2>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {[
              { num: "01", title: "非公開物件へのアクセス", desc: "売主様のご意向により一般公開されていない物件情報を、会員様限定でご覧いただけます。市場に出る前の優良物件に出会える機会です。", icon: "🔑" },
              { num: "02", title: "新着物件のメール通知", desc: "ご登録いただいた購入希望条件に合う新着物件が登録されると、いち早くメールでお知らせします。見逃しがなくなります。", icon: "🔔" },
              { num: "03", title: "専任担当者によるサポート", desc: "会員登録後、ご希望に応じてフェリアホームの専任担当者が物件探しを一貫してサポートします。", icon: "👤" },
              { num: "04", title: "Felia Private Selection", desc: "フェリアホームが厳選した特別な物件情報を会員様限定でご案内します。希少性の高い物件をいち早くご覧いただけます。", icon: "⭐" },
            ].map((b, i) => (
              <div
                key={i}
                style={{
                  display: "grid",
                  gridTemplateColumns: "80px 1fr",
                  backgroundColor: C.white,
                  borderRadius: "8px",
                  border: `1px solid ${C.border}`,
                  overflow: "hidden",
                }}
              >
                {/* 番号列 */}
                <div style={{
                  backgroundColor: i === 0 ? C.accent : C.paper,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "24px 8px",
                  borderRight: `1px solid ${C.border}`,
                }}>
                  <span style={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontSize: "22px",
                    fontWeight: "700",
                    color: i === 0 ? C.white : C.accent,
                    lineHeight: 1,
                  }}>
                    {b.num}
                  </span>
                </div>

                {/* テキスト列 */}
                <div style={{ padding: "24px 28px", display: "flex", alignItems: "center", gap: "20px" }}>
                  <span style={{ fontSize: "28px", flexShrink: 0 }}>{b.icon}</span>
                  <div>
                    <h3 style={{ fontSize: "16px", fontWeight: "bold", color: C.text, margin: "0 0 6px" }}>
                      {b.title}
                    </h3>
                    <p style={{ fontSize: "13px", color: C.textMuted, margin: 0, lineHeight: 1.8 }}>
                      {b.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ REGISTER FORM ============ */}
      <section id="register" style={{ padding: "96px 24px", backgroundColor: C.white }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "56px" }}>
            <p style={{ fontSize: "11px", color: C.accent, letterSpacing: "0.3em", margin: "0 0 12px", fontFamily: "'Montserrat', sans-serif", fontWeight: "600" }}>
              REGISTER
            </p>
            <h2 style={{ fontFamily: "'Noto Serif JP', serif", fontSize: "clamp(22px, 4vw, 34px)", fontWeight: "600", color: C.text, margin: 0 }}>
              無料会員登録
            </h2>
          </div>

          <div className="lp-register-grid" style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: "48px", alignItems: "start" }}>

            {/* 左：フォーム */}
            <div>
              {/* ステップインジケーター */}
              <div style={{ display: "flex", alignItems: "center", marginBottom: "32px" }}>
                {[{ num: 1, label: "アカウント情報" }, { num: 2, label: "購入希望条件" }].map((s, i) => (
                  <div key={s.num} style={{ display: "flex", alignItems: "center", flex: i < 1 ? 1 : 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <div style={{
                        width: "32px", height: "32px",
                        borderRadius: "50%",
                        backgroundColor: step >= s.num ? C.accent : "#e0e0e0",
                        color: step >= s.num ? C.white : "#aaa",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "13px", fontWeight: "bold", flexShrink: 0,
                      }}>
                        {step > s.num ? "✓" : s.num}
                      </div>
                      <span style={{ fontSize: "13px", fontWeight: step === s.num ? "bold" : "normal", color: step >= s.num ? C.text : "#aaa" }}>
                        {s.label}
                      </span>
                    </div>
                    {i < 1 && (
                      <div style={{ flex: 1, height: "1px", backgroundColor: step > 1 ? C.accent : "#e0e0e0", margin: "0 16px" }} />
                    )}
                  </div>
                ))}
              </div>

              {/* エラー */}
              {error && (
                <div style={{ backgroundColor: "#fdeaea", border: "1px solid #e87070", borderRadius: "6px", padding: "12px 16px", marginBottom: "20px", fontSize: "13px", color: "#8c1f1f" }}>
                  {error}
                </div>
              )}

              {/* STEP 1 */}
              {step === 1 && (
                <form onSubmit={handleStep1}>
                  <div style={{ backgroundColor: C.paper, borderRadius: "12px", border: `1px solid ${C.border}`, padding: "32px", display: "flex", flexDirection: "column", gap: "20px" }}>

                    <Field label="メールアドレス" required>
                      <input
                        type="email" value={step1.email} required
                        onChange={e => setStep1(p => ({ ...p, email: e.target.value }))}
                        placeholder="example@email.com"
                        style={inp}
                      />
                    </Field>

                    <Field label="パスワード" required hint="8文字以上">
                      <input
                        type="password" value={step1.password} required
                        onChange={e => setStep1(p => ({ ...p, password: e.target.value }))}
                        placeholder="8文字以上"
                        style={inp}
                      />
                    </Field>

                    <Field label="パスワード（確認）" required>
                      <input
                        type="password" value={step1.password_confirm} required
                        onChange={e => setStep1(p => ({ ...p, password_confirm: e.target.value }))}
                        placeholder="もう一度入力"
                        style={inp}
                      />
                    </Field>

                    <button type="submit" style={btn(C.accent)}>
                      次へ →
                    </button>

                    <p style={{ textAlign: "center", fontSize: "13px", color: C.textMuted, margin: 0 }}>
                      すでにアカウントをお持ちの方は
                      <Link href="/members/login" style={{ color: C.accent, marginLeft: "4px" }}>ログイン</Link>
                    </p>
                  </div>
                </form>
              )}

              {/* STEP 2 */}
              {step === 2 && (
                <form onSubmit={handleStep2}>
                  <div style={{ backgroundColor: C.paper, borderRadius: "12px", border: `1px solid ${C.border}`, padding: "32px", display: "flex", flexDirection: "column", gap: "24px" }}>

                    <Field label="お名前" required>
                      <input type="text" value={step2.name} required onChange={e => setStep2(p => ({ ...p, name: e.target.value }))} placeholder="山田 太郎" style={inp} />
                    </Field>

                    <Field label="お名前（フリガナ）">
                      <input type="text" value={step2.name_kana} onChange={e => setStep2(p => ({ ...p, name_kana: e.target.value }))} placeholder="ヤマダ タロウ" style={inp} />
                    </Field>

                    <Field label="電話番号">
                      <input type="tel" value={step2.phone} onChange={e => setStep2(p => ({ ...p, phone: e.target.value }))} placeholder="090-0000-0000" style={inp} />
                    </Field>

                    <Block label="ご購入目的">
                      <div style={{ display: "flex", gap: "8px" }}>
                        {[{ v: "purchase", l: "自己居住用" }, { v: "investment", l: "投資・資産運用" }, { v: "both", l: "両方" }].map(o => (
                          <button key={o.v} type="button" onClick={() => setStep2(p => ({ ...p, purpose: o.v }))} style={pill(step2.purpose === o.v, C.accent)}>
                            {o.l}
                          </button>
                        ))}
                      </div>
                    </Block>

                    <Block label="ご予算">
                      <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: "8px", alignItems: "center" }}>
                        <select value={step2.budget_min} onChange={e => setStep2(p => ({ ...p, budget_min: e.target.value }))} style={sel}>
                          <option value="">下限なし</option>
                          {BUDGET_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                        </select>
                        <span style={{ fontSize: "13px", color: C.textMuted }}>〜</span>
                        <select value={step2.budget_max} onChange={e => setStep2(p => ({ ...p, budget_max: e.target.value }))} style={sel}>
                          <option value="">上限なし</option>
                          {BUDGET_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                        </select>
                      </div>
                    </Block>

                    <Block label="希望エリア（複数選択可）">
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                        {AREAS.map(a => (
                          <button key={a} type="button" onClick={() => setStep2(p => ({ ...p, preferred_areas: toggle(p.preferred_areas, a) }))} style={pill(step2.preferred_areas.includes(a), C.accent)}>
                            {a}
                          </button>
                        ))}
                      </div>
                    </Block>

                    <Block label="希望物件種別（複数選択可）">
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                        {PROPERTY_TYPES.map(pt => (
                          <button key={pt.value} type="button" onClick={() => setStep2(p => ({ ...p, property_types: toggle(p.property_types, pt.value) }))} style={pill(step2.property_types.includes(pt.value), C.accent)}>
                            {pt.label}
                          </button>
                        ))}
                      </div>
                    </Block>

                    <Block label="希望間取り（複数選択可）">
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                        {ROOM_TYPES.map(r => (
                          <button key={r} type="button" onClick={() => setStep2(p => ({ ...p, preferred_rooms: toggle(p.preferred_rooms, r) }))} style={pill(step2.preferred_rooms.includes(r), C.accent)}>
                            {r}
                          </button>
                        ))}
                      </div>
                    </Block>

                    <Block label="お引越し時期">
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                        {MOVE_TIMINGS.map(t => (
                          <button key={t} type="button" onClick={() => setStep2(p => ({ ...p, move_timing: p.move_timing === t ? "" : t }))} style={pill(step2.move_timing === t, C.accent)}>
                            {t}
                          </button>
                        ))}
                      </div>
                    </Block>

                    <Block label="その他ご要望">
                      <textarea value={step2.remarks} onChange={e => setStep2(p => ({ ...p, remarks: e.target.value }))} rows={3} placeholder="ご要望・こだわり条件など" style={{ ...inp, resize: "vertical", lineHeight: 1.7 }} />
                    </Block>

                    {/* プライバシー同意 */}
                    <div style={{ display: "flex", alignItems: "flex-start", gap: "10px", padding: "16px", backgroundColor: C.white, borderRadius: "8px", border: `1px solid ${C.border}` }}>
                      <input
                        type="checkbox"
                        id="privacy"
                        checked={step2.privacy_agreed}
                        onChange={e => setStep2(p => ({ ...p, privacy_agreed: e.target.checked }))}
                        style={{ marginTop: "2px", flexShrink: 0, accentColor: C.accent }}
                      />
                      <label htmlFor="privacy" style={{ fontSize: "13px", color: C.textMuted, lineHeight: 1.7, cursor: "pointer" }}>
                        <Link href="/privacy" style={{ color: C.accent }}>プライバシーポリシー</Link>
                        および
                        <Link href="/terms" style={{ color: C.accent }}>利用規約</Link>
                        に同意します
                      </label>
                    </div>

                    <div style={{ display: "flex", gap: "10px" }}>
                      <button type="button" onClick={() => { setStep(1); window.scrollTo(0, 0); }} style={{ padding: "14px 20px", backgroundColor: C.white, color: C.textMuted, border: `1px solid ${C.border}`, borderRadius: "6px", fontSize: "14px", cursor: "pointer" }}>
                        ← 戻る
                      </button>
                      <button type="submit" disabled={loading || !step2.privacy_agreed} style={{ ...btn(C.accent), flex: 1, opacity: (loading || !step2.privacy_agreed) ? 0.6 : 1, cursor: (loading || !step2.privacy_agreed) ? "not-allowed" : "pointer" }}>
                        {loading ? "登録中..." : "会員登録を完了する"}
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </div>

            {/* 右：特典サイドバー */}
            <div style={{ position: "sticky", top: "80px" }}>
              <div style={{ backgroundColor: C.paper, borderRadius: "12px", border: `1px solid ${C.border}`, padding: "28px" }}>
                <h3 style={{ fontFamily: "'Noto Serif JP', serif", fontSize: "16px", fontWeight: "600", color: C.text, margin: "0 0 20px", paddingBottom: "16px", borderBottom: `1px solid ${C.border}` }}>
                  会員登録の特典
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  {[
                    { icon: "🔑", title: "非公開物件へのアクセス", desc: "一般未公開の100件以上の物件をご覧いただけます" },
                    { icon: "🔔", title: "新着物件メール通知", desc: "条件にマッチした物件を最速でお知らせ" },
                    { icon: "👤", title: "専任担当者サポート", desc: "経験豊富なスタッフが物件探しをご支援" },
                  ].map((b) => (
                    <div key={b.title} style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                      <span style={{ fontSize: "20px", flexShrink: 0 }}>{b.icon}</span>
                      <div>
                        <p style={{ fontSize: "13px", fontWeight: "bold", color: C.text, margin: "0 0 2px" }}>{b.title}</p>
                        <p style={{ fontSize: "12px", color: C.textMuted, margin: 0, lineHeight: 1.6 }}>{b.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: "20px", padding: "16px", backgroundColor: C.accentBg, borderRadius: "8px", borderLeft: `3px solid ${C.accent}` }}>
                  <p style={{ fontSize: "12px", color: C.accent, fontWeight: "bold", margin: "0 0 4px" }}>登録無料</p>
                  <p style={{ fontSize: "12px", color: C.textMuted, margin: 0 }}>いつでも退会可能・個人情報は厳重に管理</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ PRIVACY ============ */}
      <section style={{ padding: "80px 24px", backgroundColor: C.paper }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <div className="lp-privacy-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "64px", alignItems: "center" }}>
            <div>
              <p style={{ fontSize: "11px", color: C.accent, letterSpacing: "0.3em", margin: "0 0 12px", fontFamily: "'Montserrat', sans-serif", fontWeight: "600" }}>
                PRIVACY & SECURITY
              </p>
              <h2 style={{ fontFamily: "'Noto Serif JP', serif", fontSize: "clamp(20px, 3vw, 28px)", fontWeight: "600", color: C.text, margin: "0 0 20px", lineHeight: 1.4 }}>
                お客様の情報は、<br />
                安全に管理します。
              </h2>
              <p style={{ fontSize: "14px", color: C.textMuted, lineHeight: 1.9, margin: 0 }}>
                フェリアホームは、お客様からお預かりする個人情報を適切に管理し、
                許可なく第三者への提供は一切行いません。
                登録情報はいつでもマイページから変更・削除できます。
              </p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              {[
                { icon: "🔒", title: "SSL暗号化通信", desc: "全通信を暗号化し安全に保護" },
                { icon: "🛡️", title: "情報セキュリティ", desc: "厳格なセキュリティ基準で管理" },
                { icon: "🚫", title: "第三者提供なし", desc: "無断での情報提供は一切なし" },
                { icon: "🚪", title: "いつでも退会可能", desc: "マイページから簡単に退会可能" },
              ].map((item) => (
                <div
                  key={item.title}
                  style={{
                    backgroundColor: C.white,
                    borderRadius: "8px",
                    padding: "20px 16px",
                    border: `1px solid ${C.border}`,
                    textAlign: "center",
                  }}
                >
                  <div style={{ fontSize: "28px", marginBottom: "10px" }}>{item.icon}</div>
                  <p style={{ fontSize: "13px", fontWeight: "bold", color: C.text, margin: "0 0 4px" }}>{item.title}</p>
                  <p style={{ fontSize: "11px", color: C.textMuted, margin: 0, lineHeight: 1.6 }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============ FINAL CTA ============ */}
      <section style={{
        background: `linear-gradient(160deg, #0d2218 0%, ${C.accent} 100%)`,
        padding: "96px 24px",
        textAlign: "center",
        color: C.white,
      }}>
        <h2 style={{ fontFamily: "'Noto Serif JP', serif", fontSize: "clamp(24px, 4vw, 36px)", fontWeight: "600", margin: "0 0 16px" }}>
          まずは無料でご登録ください
        </h2>
        <p style={{ fontSize: "16px", opacity: 0.8, margin: "0 0 40px", lineHeight: 1.8 }}>
          非公開物件へのアクセス・新着通知・専任サポート。<br />
          すべて無料でご利用いただけます。
        </p>
        <a href="#register" style={{ display: "inline-block", padding: "18px 48px", backgroundColor: C.white, color: C.accent, borderRadius: "4px", textDecoration: "none", fontWeight: "bold", fontSize: "16px", boxShadow: "0 8px 32px rgba(0,0,0,0.2)" }}>
          無料で会員登録する
        </a>
        <p style={{ fontSize: "12px", opacity: 0.5, marginTop: "16px" }}>
          登録無料 · いつでも退会可能 · 個人情報は厳重に管理
        </p>
      </section>

    </main>
  );
}

// ---- スタイルヘルパー ----
const inp: React.CSSProperties = {
  width: "100%", padding: "12px 14px",
  borderRadius: "6px", border: "1px solid #e0dbd4",
  fontSize: "15px", color: "#1a1a1a",
  outline: "none", boxSizing: "border-box",
  backgroundColor: "#ffffff",
};

const sel: React.CSSProperties = {
  width: "100%", padding: "11px 14px",
  borderRadius: "6px", border: "1px solid #e0dbd4",
  fontSize: "14px", color: "#1a1a1a",
  backgroundColor: "#ffffff", cursor: "pointer",
};

const pill = (active: boolean, accent: string): React.CSSProperties => ({
  padding: "7px 14px", borderRadius: "20px",
  border: active ? `1.5px solid ${accent}` : "1px solid #e0dbd4",
  backgroundColor: active ? "#f0f5f2" : "#ffffff",
  color: active ? accent : "#666",
  fontSize: "12px", fontWeight: active ? "bold" : "normal",
  cursor: "pointer", transition: "all 0.15s ease",
});

const btn = (bg: string): React.CSSProperties => ({
  display: "block", width: "100%", padding: "15px",
  backgroundColor: bg, color: "#ffffff",
  border: "none", borderRadius: "6px",
  fontSize: "15px", fontWeight: "bold",
  cursor: "pointer", letterSpacing: "0.05em",
});

function Field({ label, required, hint, children }: { label: string; required?: boolean; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ display: "block", fontSize: "13px", fontWeight: "bold", color: "#444", marginBottom: "8px" }}>
        {label}
        {required && <span style={{ marginLeft: "6px", fontSize: "10px", backgroundColor: "#2d5e4a", color: "#fff", padding: "2px 6px", borderRadius: "3px" }}>必須</span>}
      </label>
      {hint && <p style={{ fontSize: "11px", color: "#aaa", margin: "0 0 6px" }}>{hint}</p>}
      {children}
    </div>
  );
}

function Block({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p style={{ fontSize: "13px", fontWeight: "bold", color: "#444", margin: "0 0 10px", paddingBottom: "6px", borderBottom: "1px solid #f0f0f0" }}>
        {label}
      </p>
      {children}
    </div>
  );
}
