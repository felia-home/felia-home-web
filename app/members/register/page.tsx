// app/members/register/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import {
  User, Mail, Lock, Phone, Eye, EyeOff,
  CheckCircle, ChevronRight, ChevronLeft,
  MapPin, Train, Home, Calendar, Wallet,
  Users, Star, Building2, ArrowRight
} from "lucide-react";

// ─── 選択肢定義 ───────────────────────────────────────────

const PROPERTY_TYPES = ["戸建て", "マンション", "土地", "収益物件"];

const DESIRED_AREAS = [
  "渋谷区", "新宿区", "杉並区", "世田谷区",
  "文京区", "豊島区", "中野区", "目黒区",
  "北区", "板橋区", "練馬区", "品川区",
  "港区", "大田区", "千代田区", "中央区",
  "その他",
];

const DESIRED_LINES = [
  "JR山手線", "JR中央線", "JR埼京線", "JR京浜東北線",
  "東急東横線", "東急田園都市線", "東急目黒線",
  "東京メトロ銀座線", "東京メトロ丸ノ内線", "東京メトロ半蔵門線",
  "東京メトロ日比谷線", "東京メトロ東西線", "東京メトロ副都心線",
  "小田急小田原線", "京王線", "西武池袋線", "西武新宿線",
  "都営新宿線", "都営三田線", "都営大江戸線",
];

const BUDGET_OPTIONS = [
  "2,000万円以下", "3,000万円以下", "4,000万円以下",
  "5,000万円以下", "6,000万円以下", "7,000万円以下",
  "8,000万円以下", "1億円以下", "1億円以上",
];
const BUDGET_MAP: Record<string, number> = {
  "2,000万円以下": 2000, "3,000万円以下": 3000, "4,000万円以下": 4000,
  "5,000万円以下": 5000, "6,000万円以下": 6000, "7,000万円以下": 7000,
  "8,000万円以下": 8000, "1億円以下": 10000, "1億円以上": 99999,
};

const LAYOUTS = ["1K/1DK", "1LDK/2DK", "2LDK/3DK", "3LDK", "4LDK以上"];

const PURCHASE_TIMINGS = [
  "3ヶ月以内", "6ヶ月以内", "1年以内", "2年以内", "時期未定",
];

const INCOME_RANGES = [
  "400万円未満", "400〜600万円", "600〜800万円",
  "800〜1,000万円", "1,000〜1,500万円", "1,500万円以上",
];

const PRIORITY_POINTS = [
  "駅からの距離", "価格・コスパ", "広さ", "学区・教育環境",
  "築年数・新しさ", "日当たり・眺望", "静かな環境", "買い物の利便性",
  "将来の資産価値", "間取りの使いやすさ",
];

const DOWN_PAYMENT_OPTIONS = [
  "100万円未満", "100〜300万円", "300〜500万円",
  "500〜1,000万円", "1,000〜2,000万円", "2,000万円以上",
];
const DOWN_PAYMENT_MAP: Record<string, number> = {
  "100万円未満": 50, "100〜300万円": 200, "300〜500万円": 400,
  "500〜1,000万円": 750, "1,000〜2,000万円": 1500, "2,000万円以上": 2000,
};

// ─── メインコンポーネント ──────────────────────────────────

export default function RegisterPage() {
  const [step, setStep]           = useState<1 | 2 | "done">(1);
  const [memberId, setMemberId]   = useState("");
  const [memberEmail, setMemberEmail]       = useState("");
  const [memberPassword, setMemberPassword] = useState("");

  // STEP1 フォーム
  const [basic, setBasic] = useState({
    name: "", nameKana: "", email: "", password: "", confirmPassword: "", phone: "",
  });
  const [showPwd, setShowPwd]         = useState(false);
  const [step1Error, setStep1Error]   = useState("");
  const [step1Loading, setStep1Loading] = useState(false);

  // STEP2 フォーム
  const [profile, setProfile] = useState({
    property_types:       [] as string[],
    desired_areas:        [] as string[],
    desired_lines:        [] as string[],
    budget_max_label:     "",
    desired_area_m2_min:  "",
    desired_layout:       [] as string[],
    purchase_timing:      "",
    current_residence:    "",
    current_rent:         "",
    lease_expiry:         "",
    has_property_to_sell: "",
    family_structure:     "",
    children_ages:        "",
    down_payment_label:   "",
    annual_income_range:  "",
    loan_preapproval:     "",
    purchase_motivation:  "",
    priority_points:      [] as string[],
    other_agents:         "",
    remarks:              "",
  });
  const [step2Loading, setStep2Loading] = useState(false);
  const [step2Error, setStep2Error]     = useState("");

  // ── STEP 1 送信 ───────────────────────────────────────────
  const handleStep1 = async (e: React.FormEvent) => {
    e.preventDefault();
    setStep1Error("");

    if (basic.password !== basic.confirmPassword) {
      setStep1Error("パスワードが一致しません"); return;
    }
    if (basic.password.length < 8) {
      setStep1Error("パスワードは8文字以上で入力してください"); return;
    }

    setStep1Loading(true);
    try {
      const res = await fetch("/api/members/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name:      basic.name,
          name_kana: basic.nameKana,
          email:     basic.email,
          password:  basic.password,
          phone:     basic.phone || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setStep1Error(data.message || "登録に失敗しました"); return;
      }
      // data.member.id を使用
      setMemberId(data.member.id);
      setMemberEmail(basic.email);
      setMemberPassword(basic.password);
      setStep(2);
    } catch {
      setStep1Error("通信エラーが発生しました");
    } finally {
      setStep1Loading(false);
    }
  };

  // ── STEP 2 送信 ───────────────────────────────────────────
  const handleStep2 = async (skip = false) => {
    if (skip) {
      await autoLogin();
      return;
    }
    setStep2Error("");
    setStep2Loading(true);
    try {
      const payload = {
        property_types:       profile.property_types,
        desired_areas:        profile.desired_areas,
        desired_lines:        profile.desired_lines,
        budget_max:           BUDGET_MAP[profile.budget_max_label] || undefined,
        desired_area_m2_min:  profile.desired_area_m2_min
                                ? Number(profile.desired_area_m2_min) : undefined,
        desired_layout:       profile.desired_layout,
        purchase_timing:      profile.purchase_timing || undefined,
        current_residence:    profile.current_residence || undefined,
        current_rent:         profile.current_rent
                                ? Number(profile.current_rent) : undefined,
        lease_expiry:         profile.lease_expiry || undefined,
        has_property_to_sell: profile.has_property_to_sell || undefined,
        family_structure:     profile.family_structure || undefined,
        children_ages:        profile.children_ages || undefined,
        down_payment:         DOWN_PAYMENT_MAP[profile.down_payment_label] || undefined,
        annual_income_range:  profile.annual_income_range || undefined,
        loan_preapproval:     profile.loan_preapproval || undefined,
        purchase_motivation:  profile.purchase_motivation || undefined,
        priority_points:      profile.priority_points,
        other_agents:         profile.other_agents || undefined,
        remarks:              profile.remarks || undefined,
      };

      const res = await fetch("/api/members/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) { setStep2Error("条件の保存に失敗しました"); return; }
    } catch {
      setStep2Error("通信エラーが発生しました");
    } finally {
      setStep2Loading(false);
    }
    await autoLogin();
  };

  // 登録後に自動ログイン → マイページへ
  const autoLogin = async () => {
    try {
      await signIn("credentials", {
        email: memberEmail,
        password: memberPassword,
        callbackUrl: "/members/mypage",
        redirect: true,
      });
    } catch {
      setStep(2);
    }
  };

  // チェックボックス系のトグル
  const toggleArray = (arr: string[], val: string) =>
    arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val];

  // ── 完了画面 ──────────────────────────────────────────────
  if (step === "done") {
    return <CompletePage />;
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F8F8F8" }}>

      {/* ヒーロー（LP上部） */}
      <div
        className="py-12 tb:py-16 text-white text-center relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #1a3a1a 0%, #2d5a2d 50%, #5BAD52 100%)" }}
      >
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(circle at 20% 50%, white, transparent 50%), radial-gradient(circle at 80% 20%, white, transparent 40%)" }} />
        <div className="container-content relative z-10">
          <p className="text-white/70 text-xs tracking-[0.3em] mb-3">FREE MEMBERSHIP</p>
          <h1 className="font-bold leading-tight mb-4"
            style={{ fontSize: "clamp(24px, 4vw, 42px)" }}>
            無料会員登録で、<br />理想の住まいに出会う。
          </h1>
          <p className="text-white/80 text-sm tb:text-base max-w-lg mx-auto mb-6">
            会員限定の未公開物件・プライベートセレクションへのアクセス、<br className="hidden tb:block" />
            専任担当者によるパーソナルサポートをご利用いただけます。
          </p>
          {/* 特典バッジ */}
          <div className="flex flex-wrap justify-center gap-3">
            {[
              "未公開物件の閲覧",
              "専任担当者サポート",
              "AIマッチング物件提案",
              "お気に入り保存",
            ].map((b) => (
              <span key={b}
                className="text-xs px-3 py-1.5 rounded-full border border-white/30 text-white/90">
                ✓ {b}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ステップインジケーター */}
      <div className="bg-white border-b sticky top-14 z-30" style={{ borderColor: "#E5E5E5" }}>
        <div className="container-content py-3">
          <div className="flex items-center justify-center gap-2 max-w-sm mx-auto">
            {[
              { n: 1, label: "基本情報" },
              { n: 2, label: "購入希望条件" },
            ].map((s, i) => (
              <div key={s.n} className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{
                      backgroundColor: step >= s.n ? "#5BAD52" : "#E5E5E5",
                      color: step >= s.n ? "white" : "#999",
                    }}
                  >
                    {step > s.n ? "✓" : s.n}
                  </div>
                  <span className={`text-xs font-medium ${step >= s.n ? "text-gray-700" : "text-gray-400"}`}>
                    {s.label}
                  </span>
                </div>
                {i === 0 && (
                  <div className="w-8 h-px" style={{ backgroundColor: step >= 2 ? "#5BAD52" : "#E5E5E5" }} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container-content py-8 tb:py-12">
        <div className="max-w-2xl mx-auto">

          {/* ─── STEP 1 ─────────────────────────────────── */}
          {step === 1 && (
            <div className="bg-white rounded-2xl border p-6 tb:p-10 shadow-sm" style={{ borderColor: "#E5E5E5" }}>
              <h2 className="text-xl font-bold text-gray-800 mb-6">
                STEP 1 — 基本情報
              </h2>

              {step1Error && (
                <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
                  {step1Error}
                </div>
              )}

              <form onSubmit={handleStep1} className="space-y-4">
                {/* 氏名 */}
                <RegField label="お名前" required icon={<User size={14} />}
                  type="text" value={basic.name} placeholder="山田 太郎"
                  onChange={(v) => setBasic((b) => ({ ...b, name: v }))} />

                {/* ふりがな */}
                <RegField label="ふりがな" required icon={<User size={14} />}
                  type="text" value={basic.nameKana} placeholder="やまだ たろう"
                  onChange={(v) => setBasic((b) => ({ ...b, nameKana: v }))} />

                {/* メール */}
                <RegField label="メールアドレス" required icon={<Mail size={14} />}
                  type="email" value={basic.email} placeholder="example@email.com"
                  onChange={(v) => setBasic((b) => ({ ...b, email: v }))} />

                {/* 電話 */}
                <RegField label="電話番号" required icon={<Phone size={14} />}
                  type="tel" value={basic.phone} placeholder="090-0000-0000"
                  onChange={(v) => setBasic((b) => ({ ...b, phone: v }))} />

                {/* パスワード */}
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">
                    パスワード <span className="text-red-500">*</span>
                    <span className="text-gray-400 font-normal ml-1">（8文字以上）</span>
                  </label>
                  <div className="relative">
                    <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type={showPwd ? "text" : "password"}
                      value={basic.password}
                      onChange={(e) => setBasic((b) => ({ ...b, password: e.target.value }))}
                      placeholder="8文字以上"
                      required
                      className="w-full pl-8 pr-10 py-2.5 border rounded-lg text-sm outline-none focus:border-felia-green transition-colors"
                      style={{ borderColor: "#E5E5E5" }}
                    />
                    <button type="button" onClick={() => setShowPwd((s) => !s)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      {showPwd ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>

                {/* パスワード確認 */}
                <RegField label="パスワード（確認）" required icon={<Lock size={14} />}
                  type="password" value={basic.confirmPassword} placeholder="もう一度入力"
                  onChange={(v) => setBasic((b) => ({ ...b, confirmPassword: v }))} />

                <p className="text-xs text-gray-400">
                  登録することで
                  <Link href="/privacy" className="underline">プライバシーポリシー</Link>
                  に同意したものとみなされます。
                </p>

                <button
                  type="submit"
                  disabled={step1Loading}
                  className="w-full py-3.5 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all disabled:opacity-50 hover:scale-[1.01]"
                  style={{ backgroundColor: "#5BAD52" }}
                >
                  {step1Loading ? "登録中..." : (
                    <>次へ：購入希望条件を入力 <ChevronRight size={18} /></>
                  )}
                </button>
              </form>

              <p className="mt-4 text-center text-sm text-gray-500">
                すでに会員の方は
                <Link href="/members/login" className="ml-1 font-medium hover:underline" style={{ color: "#5BAD52" }}>
                  こちらからログイン
                </Link>
              </p>
            </div>
          )}

          {/* ─── STEP 2 ─────────────────────────────────── */}
          {step === 2 && (
            <div className="space-y-5">
              <div className="bg-white rounded-2xl border p-6 tb:p-8 shadow-sm" style={{ borderColor: "#E5E5E5" }}>
                <div className="flex items-start justify-between mb-2">
                  <h2 className="text-xl font-bold text-gray-800">
                    STEP 2 — 購入希望条件
                  </h2>
                  <button
                    onClick={() => handleStep2(true)}
                    className="text-xs text-gray-400 hover:text-gray-600 underline flex-shrink-0 mt-1"
                  >
                    あとで設定する
                  </button>
                </div>
                <p className="text-sm text-gray-500 mb-6">
                  ご希望に合った物件をご提案するために使用します。後からマイページで変更できます。
                </p>

                {step2Error && (
                  <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
                    {step2Error}
                  </div>
                )}

                <div className="space-y-7">

                  {/* 物件種別 */}
                  <ProfileSection icon={<Building2 size={15} />} title="希望する物件種別">
                    <CheckGroup
                      options={PROPERTY_TYPES}
                      selected={profile.property_types}
                      onChange={(v) => setProfile((p) => ({
                        ...p, property_types: toggleArray(p.property_types, v)
                      }))}
                    />
                  </ProfileSection>

                  {/* 希望エリア */}
                  <ProfileSection icon={<MapPin size={15} />} title="希望エリア（複数選択可）">
                    <CheckGroup
                      options={DESIRED_AREAS}
                      selected={profile.desired_areas}
                      onChange={(v) => setProfile((p) => ({
                        ...p, desired_areas: toggleArray(p.desired_areas, v)
                      }))}
                      cols={4}
                    />
                  </ProfileSection>

                  {/* 希望沿線 */}
                  <ProfileSection icon={<Train size={15} />} title="希望沿線（複数選択可）">
                    <CheckGroup
                      options={DESIRED_LINES}
                      selected={profile.desired_lines}
                      onChange={(v) => setProfile((p) => ({
                        ...p, desired_lines: toggleArray(p.desired_lines, v)
                      }))}
                      cols={2}
                    />
                  </ProfileSection>

                  {/* 予算・広さ・間取り */}
                  <ProfileSection icon={<Wallet size={15} />} title="予算・希望条件">
                    <div className="grid grid-cols-1 tb:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">予算上限</label>
                        <SelectField
                          value={profile.budget_max_label}
                          options={BUDGET_OPTIONS}
                          onChange={(v) => setProfile((p) => ({ ...p, budget_max_label: v }))}
                          placeholder="選択してください"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">希望広さ（㎡以上）</label>
                        <input
                          type="number"
                          value={profile.desired_area_m2_min}
                          onChange={(e) => setProfile((p) => ({ ...p, desired_area_m2_min: e.target.value }))}
                          placeholder="例: 70"
                          className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:border-felia-green"
                          style={{ borderColor: "#E5E5E5" }}
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">購入希望時期</label>
                        <SelectField
                          value={profile.purchase_timing}
                          options={PURCHASE_TIMINGS}
                          onChange={(v) => setProfile((p) => ({ ...p, purchase_timing: v }))}
                          placeholder="選択してください"
                        />
                      </div>
                    </div>
                    <div className="mt-3">
                      <label className="block text-xs text-gray-500 mb-1">希望間取り（複数選択可）</label>
                      <CheckGroup
                        options={LAYOUTS}
                        selected={profile.desired_layout}
                        onChange={(v) => setProfile((p) => ({
                          ...p, desired_layout: toggleArray(p.desired_layout, v)
                        }))}
                      />
                    </div>
                  </ProfileSection>

                  {/* 現在の状況 */}
                  <ProfileSection icon={<Home size={15} />} title="現在の住居状況">
                    <div className="grid grid-cols-1 tb:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">現在の住居</label>
                        <SelectField
                          value={profile.current_residence}
                          options={["賃貸", "持ち家（売却予定あり）", "持ち家（売却予定なし）", "その他"]}
                          onChange={(v) => setProfile((p) => ({ ...p, current_residence: v }))}
                          placeholder="選択してください"
                        />
                      </div>
                      {profile.current_residence === "賃貸" && (
                        <>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">現在の家賃（万円/月）</label>
                            <input
                              type="number"
                              value={profile.current_rent}
                              onChange={(e) => setProfile((p) => ({ ...p, current_rent: e.target.value }))}
                              placeholder="例: 15"
                              className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:border-felia-green"
                              style={{ borderColor: "#E5E5E5" }}
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">賃貸契約の満了時期</label>
                            <input
                              type="text"
                              value={profile.lease_expiry}
                              onChange={(e) => setProfile((p) => ({ ...p, lease_expiry: e.target.value }))}
                              placeholder="例: 2025年9月"
                              className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:border-felia-green"
                              style={{ borderColor: "#E5E5E5" }}
                            />
                          </div>
                        </>
                      )}
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">売却予定</label>
                        <SelectField
                          value={profile.has_property_to_sell}
                          options={["あり", "なし", "未定"]}
                          onChange={(v) => setProfile((p) => ({ ...p, has_property_to_sell: v }))}
                          placeholder="選択してください"
                        />
                      </div>
                    </div>
                  </ProfileSection>

                  {/* 家族構成 */}
                  <ProfileSection icon={<Users size={15} />} title="家族構成">
                    <div className="grid grid-cols-1 tb:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">家族構成</label>
                        <SelectField
                          value={profile.family_structure}
                          options={[
                            "おひとり様", "夫婦2人", "夫婦＋子1人", "夫婦＋子2人",
                            "夫婦＋子3人以上", "その他",
                          ]}
                          onChange={(v) => setProfile((p) => ({ ...p, family_structure: v }))}
                          placeholder="選択してください"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">お子様の年齢（任意）</label>
                        <input
                          type="text"
                          value={profile.children_ages}
                          onChange={(e) => setProfile((p) => ({ ...p, children_ages: e.target.value }))}
                          placeholder="例: 3歳・6歳"
                          className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:border-felia-green"
                          style={{ borderColor: "#E5E5E5" }}
                        />
                      </div>
                    </div>
                  </ProfileSection>

                  {/* 資金計画 */}
                  <ProfileSection icon={<Wallet size={15} />} title="資金計画">
                    <div className="grid grid-cols-1 tb:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">頭金の目安</label>
                        <SelectField
                          value={profile.down_payment_label}
                          options={DOWN_PAYMENT_OPTIONS}
                          onChange={(v) => setProfile((p) => ({ ...p, down_payment_label: v }))}
                          placeholder="選択してください"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">年収帯（おおよそ）</label>
                        <SelectField
                          value={profile.annual_income_range}
                          options={INCOME_RANGES}
                          onChange={(v) => setProfile((p) => ({ ...p, annual_income_range: v }))}
                          placeholder="選択してください"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">ローン事前審査</label>
                        <SelectField
                          value={profile.loan_preapproval}
                          options={["未検討", "検討中", "申込済み", "通過済み"]}
                          onChange={(v) => setProfile((p) => ({ ...p, loan_preapproval: v }))}
                          placeholder="選択してください"
                        />
                      </div>
                    </div>
                  </ProfileSection>

                  {/* 重視するポイント */}
                  <ProfileSection icon={<Star size={15} />} title="物件選びで重視するポイント（複数選択可）">
                    <CheckGroup
                      options={PRIORITY_POINTS}
                      selected={profile.priority_points}
                      onChange={(v) => setProfile((p) => ({
                        ...p, priority_points: toggleArray(p.priority_points, v)
                      }))}
                      cols={3}
                    />
                  </ProfileSection>

                  {/* 購入動機・他社 */}
                  <ProfileSection icon={<Calendar size={15} />} title="その他">
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">購入を考えたきっかけ</label>
                        <SelectField
                          value={profile.purchase_motivation}
                          options={[
                            "家賃がもったいないと感じた",
                            "子供の学区・入学に合わせて",
                            "結婚・同居",
                            "資産として保有したい",
                            "住み替えを検討",
                            "その他",
                          ]}
                          onChange={(v) => setProfile((p) => ({ ...p, purchase_motivation: v }))}
                          placeholder="選択してください"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">他社での検討状況</label>
                        <SelectField
                          value={profile.other_agents}
                          options={["検討していない", "他社でも検討中", "申込・交渉中"]}
                          onChange={(v) => setProfile((p) => ({ ...p, other_agents: v }))}
                          placeholder="選択してください"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">ご要望・備考（自由記述）</label>
                        <textarea
                          value={profile.remarks}
                          onChange={(e) => setProfile((p) => ({ ...p, remarks: e.target.value }))}
                          placeholder="例: ペット可物件を希望、2階以上希望、など"
                          rows={3}
                          className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:border-felia-green resize-none"
                          style={{ borderColor: "#E5E5E5" }}
                        />
                      </div>
                    </div>
                  </ProfileSection>

                </div>
              </div>

              {/* 送信ボタン */}
              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="flex items-center gap-1 px-4 py-3 rounded-xl border text-sm text-gray-500 hover:border-gray-400 transition-colors"
                  style={{ borderColor: "#E5E5E5" }}
                >
                  <ChevronLeft size={16} />戻る
                </button>
                <button
                  onClick={() => handleStep2(false)}
                  disabled={step2Loading}
                  className="flex-1 py-3.5 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all disabled:opacity-50 hover:scale-[1.01]"
                  style={{ backgroundColor: "#5BAD52" }}
                >
                  {step2Loading ? "保存中..." : (
                    <>登録完了・マイページへ <ArrowRight size={18} /></>
                  )}
                </button>
              </div>
              <p className="text-center text-xs text-gray-400">
                <button onClick={() => handleStep2(true)} className="underline hover:text-gray-600">
                  購入希望条件の入力をスキップしてマイページへ
                </button>
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

// ─── 小コンポーネント ──────────────────────────────────────

function RegField({ label, required, icon, type, value, placeholder, onChange }: {
  label: string; required?: boolean; icon: React.ReactNode;
  type: string; value: string; placeholder: string; onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{icon}</span>
        <input type={type} value={value} onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder} required={required}
          className="w-full pl-8 pr-4 py-2.5 border rounded-lg text-sm outline-none focus:border-felia-green transition-colors"
          style={{ borderColor: "#E5E5E5" }} />
      </div>
    </div>
  );
}

function ProfileSection({ icon, title, children }: {
  icon: React.ReactNode; title: string; children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3 pb-2 border-b" style={{ borderColor: "#F0F0F0" }}>
        <span style={{ color: "#5BAD52" }}>{icon}</span>
        <h3 className="text-sm font-bold text-gray-700">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function CheckGroup({ options, selected, onChange, cols = 2 }: {
  options: string[]; selected: string[]; onChange: (v: string) => void; cols?: number;
}) {
  const gridCols = cols === 4 ? "grid-cols-2 tb:grid-cols-4"
    : cols === 3 ? "grid-cols-2 tb:grid-cols-3"
    : "grid-cols-2";
  return (
    <div className={`grid ${gridCols} gap-2`}>
      {options.map((opt) => (
        <label key={opt}
          className="flex items-center gap-2 cursor-pointer p-2 rounded-lg border transition-all hover:border-felia-green"
          style={{ borderColor: selected.includes(opt) ? "#5BAD52" : "#E5E5E5",
                   backgroundColor: selected.includes(opt) ? "#EBF7EA" : "white" }}>
          <input type="checkbox" checked={selected.includes(opt)}
            onChange={() => onChange(opt)} className="hidden" />
          <span className="w-4 h-4 rounded border flex items-center justify-center flex-shrink-0"
            style={{ borderColor: selected.includes(opt) ? "#5BAD52" : "#D1D5DB",
                     backgroundColor: selected.includes(opt) ? "#5BAD52" : "white" }}>
            {selected.includes(opt) && <span className="text-white text-[10px]">✓</span>}
          </span>
          <span className="text-xs text-gray-700">{opt}</span>
        </label>
      ))}
    </div>
  );
}

function SelectField({ value, options, onChange, placeholder }: {
  value: string; options: string[]; onChange: (v: string) => void; placeholder: string;
}) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:border-felia-green cursor-pointer bg-white"
      style={{ borderColor: value ? "#5BAD52" : "#E5E5E5" }}>
      <option value="">{placeholder}</option>
      {options.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}

function CompletePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl p-10 max-w-md w-full text-center shadow-sm border" style={{ borderColor: "#E5E5E5" }}>
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
          style={{ backgroundColor: "#EBF7EA" }}>
          <CheckCircle size={32} style={{ color: "#5BAD52" }} />
        </div>
        <h1 className="text-xl font-bold text-gray-800 mb-2">登録が完了しました</h1>
        <p className="text-sm text-gray-500 mb-6 leading-relaxed">
          ご登録ありがとうございます。<br />
          担当者より順次ご連絡いたします。
        </p>
        <Link href="/members/mypage"
          className="flex items-center justify-center w-full py-3 rounded-lg font-bold text-white"
          style={{ backgroundColor: "#5BAD52" }}>
          マイページへ
        </Link>
      </div>
    </div>
  );
}
