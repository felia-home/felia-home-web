// components/members/ProfileEditForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  MapPin, Train, Wallet, Home,
  Users, Star, Calendar, Building2,
  CheckCircle,
} from "lucide-react";
import type { MemberProfileData } from "@/lib/api";

// ─── スタイル定数 ────────────────────────────────────────────
const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "9px 12px",
  border: "1px solid #E5E5E5",
  borderRadius: "8px",
  fontSize: "14px",
  color: "#333",
  outline: "none",
  backgroundColor: "#fff",
  boxSizing: "border-box",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "12px",
  color: "#888",
  marginBottom: "4px",
};

// ─── 選択肢定義 ───────────────────────────────────────────────

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
const BUDGET_REVERSE: Record<number, string> = Object.fromEntries(
  Object.entries(BUDGET_MAP).map(([k, v]) => [v, k])
);

const LAYOUTS = ["1K/1DK", "1LDK/2DK", "2LDK/3DK", "3LDK", "4LDK以上"];
const PURCHASE_TIMINGS = ["3ヶ月以内", "6ヶ月以内", "1年以内", "2年以内", "時期未定"];
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
const DOWN_PAYMENT_REVERSE: Record<number, string> = Object.fromEntries(
  Object.entries(DOWN_PAYMENT_MAP).map(([k, v]) => [v, k])
);

// ─── メインコンポーネント ─────────────────────────────────────

interface Props {
  initialData: MemberProfileData | null;
}

export function ProfileEditForm({ initialData }: Props) {
  const router = useRouter();
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [profile, setProfile] = useState({
    property_types:       initialData?.property_types       ?? [] as string[],
    desired_areas:        initialData?.desired_areas         ?? [] as string[],
    desired_lines:        initialData?.desired_lines         ?? [] as string[],
    budget_max_label:     BUDGET_REVERSE[initialData?.budget_max ?? 0] ?? "",
    desired_area_m2_min:  String(initialData?.desired_area_m2_min ?? ""),
    desired_layout:       initialData?.desired_layout        ?? [] as string[],
    purchase_timing:      initialData?.purchase_timing       ?? "",
    current_residence:    initialData?.current_residence     ?? "",
    current_rent:         String(initialData?.current_rent   ?? ""),
    lease_expiry:         initialData?.lease_expiry          ?? "",
    has_property_to_sell: initialData?.has_property_to_sell  ?? "",
    family_structure:     initialData?.family_structure      ?? "",
    children_ages:        initialData?.children_ages         ?? "",
    down_payment_label:   DOWN_PAYMENT_REVERSE[initialData?.down_payment ?? 0] ?? "",
    annual_income_range:  initialData?.annual_income_range   ?? "",
    loan_preapproval:     initialData?.loan_preapproval      ?? "",
    purchase_motivation:  initialData?.purchase_motivation   ?? "",
    priority_points:      initialData?.priority_points       ?? [] as string[],
    other_agents:         initialData?.other_agents          ?? "",
    remarks:              initialData?.remarks               ?? "",
  });

  const toggleArray = (arr: string[], val: string) =>
    arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val];

  const handleSave = async () => {
    setError("");
    setLoading(true);
    try {
      const payload = {
        property_types:       profile.property_types,
        desired_areas:        profile.desired_areas,
        desired_lines:        profile.desired_lines,
        budget_max:           BUDGET_MAP[profile.budget_max_label] || undefined,
        desired_area_m2_min:  profile.desired_area_m2_min ? Number(profile.desired_area_m2_min) : undefined,
        desired_layout:       profile.desired_layout,
        purchase_timing:      profile.purchase_timing || undefined,
        current_residence:    profile.current_residence || undefined,
        current_rent:         profile.current_rent ? Number(profile.current_rent) : undefined,
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
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) { setError("保存に失敗しました"); return; }
      setSaved(true);
      setTimeout(() => {
        setSaved(false);
        router.push("/members/mypage");
      }, 1500);
    } catch {
      setError("通信エラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  // ─── 保存完了 ─────────────────────────────────────────────
  if (saved) {
    return (
      <div style={{
        backgroundColor: "#fff",
        borderRadius: "16px",
        border: "1px solid #E5E5E5",
        padding: "48px 40px",
        textAlign: "center",
        boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
      }}>
        <div style={{
          width: "56px", height: "56px",
          borderRadius: "50%",
          backgroundColor: "#EBF7EA",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 16px",
        }}>
          <CheckCircle size={28} style={{ color: "#5BAD52" }} />
        </div>
        <p style={{ fontWeight: "bold", color: "#333", fontSize: "18px", margin: "0 0 4px" }}>
          保存しました
        </p>
        <p style={{ fontSize: "13px", color: "#888", margin: 0 }}>
          マイページに戻ります...
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {error && (
        <div style={{
          padding: "12px 16px",
          borderRadius: "8px",
          backgroundColor: "#fef2f2",
          border: "1px solid #fca5a5",
          fontSize: "13px",
          color: "#991b1b",
        }}>
          {error}
        </div>
      )}

      <div style={{
        backgroundColor: "#fff",
        borderRadius: "16px",
        border: "1px solid #E5E5E5",
        padding: "28px",
        boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
      }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>

          {/* 物件種別 */}
          <ProfileSection icon={<Building2 size={15} />} title="希望する物件種別">
            <CheckGroup
              options={PROPERTY_TYPES}
              selected={profile.property_types}
              onChange={(v) => setProfile((p) => ({ ...p, property_types: toggleArray(p.property_types, v) }))}
              cols={4}
            />
          </ProfileSection>

          {/* 希望エリア */}
          <ProfileSection icon={<MapPin size={15} />} title="希望エリア（複数選択可）">
            <CheckGroup
              options={DESIRED_AREAS}
              selected={profile.desired_areas}
              onChange={(v) => setProfile((p) => ({ ...p, desired_areas: toggleArray(p.desired_areas, v) }))}
              cols={4}
            />
          </ProfileSection>

          {/* 希望沿線 */}
          <ProfileSection icon={<Train size={15} />} title="希望沿線（複数選択可）">
            <CheckGroup
              options={DESIRED_LINES}
              selected={profile.desired_lines}
              onChange={(v) => setProfile((p) => ({ ...p, desired_lines: toggleArray(p.desired_lines, v) }))}
              cols={2}
            />
          </ProfileSection>

          {/* 予算・希望条件 */}
          <ProfileSection icon={<Wallet size={15} />} title="予算・希望条件">
            <div className="profile-grid-3col" style={{ display: "grid", gap: "12px", marginBottom: "12px" }}>
              <div>
                <label style={labelStyle}>予算上限</label>
                <SelectField
                  value={profile.budget_max_label}
                  options={BUDGET_OPTIONS}
                  onChange={(v) => setProfile((p) => ({ ...p, budget_max_label: v }))}
                  placeholder="選択してください"
                />
              </div>
              <div>
                <label style={labelStyle}>希望広さ（㎡以上）</label>
                <input
                  type="number"
                  value={profile.desired_area_m2_min}
                  onChange={(e) => setProfile((p) => ({ ...p, desired_area_m2_min: e.target.value }))}
                  placeholder="例: 70"
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>購入希望時期</label>
                <SelectField
                  value={profile.purchase_timing}
                  options={PURCHASE_TIMINGS}
                  onChange={(v) => setProfile((p) => ({ ...p, purchase_timing: v }))}
                  placeholder="選択してください"
                />
              </div>
            </div>
            <div>
              <label style={labelStyle}>希望間取り（複数選択可）</label>
              <CheckGroup
                options={LAYOUTS}
                selected={profile.desired_layout}
                onChange={(v) => setProfile((p) => ({ ...p, desired_layout: toggleArray(p.desired_layout, v) }))}
                cols={4}
              />
            </div>
          </ProfileSection>

          {/* 現在の住居状況 */}
          <ProfileSection icon={<Home size={15} />} title="現在の住居状況">
            <div className="profile-grid-2col" style={{ display: "grid", gap: "12px" }}>
              <div>
                <label style={labelStyle}>現在の住居</label>
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
                    <label style={labelStyle}>現在の家賃（万円/月）</label>
                    <input
                      type="number"
                      value={profile.current_rent}
                      onChange={(e) => setProfile((p) => ({ ...p, current_rent: e.target.value }))}
                      placeholder="例: 15"
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>賃貸契約の満了時期</label>
                    <input
                      type="text"
                      value={profile.lease_expiry}
                      onChange={(e) => setProfile((p) => ({ ...p, lease_expiry: e.target.value }))}
                      placeholder="例: 2026年9月"
                      style={inputStyle}
                    />
                  </div>
                </>
              )}
              <div>
                <label style={labelStyle}>売却予定</label>
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
            <div className="profile-grid-2col" style={{ display: "grid", gap: "12px" }}>
              <div>
                <label style={labelStyle}>家族構成</label>
                <SelectField
                  value={profile.family_structure}
                  options={["おひとり様", "夫婦2人", "夫婦＋子1人", "夫婦＋子2人", "夫婦＋子3人以上", "その他"]}
                  onChange={(v) => setProfile((p) => ({ ...p, family_structure: v }))}
                  placeholder="選択してください"
                />
              </div>
              <div>
                <label style={labelStyle}>お子様の年齢（任意）</label>
                <input
                  type="text"
                  value={profile.children_ages}
                  onChange={(e) => setProfile((p) => ({ ...p, children_ages: e.target.value }))}
                  placeholder="例: 3歳・6歳"
                  style={inputStyle}
                />
              </div>
            </div>
          </ProfileSection>

          {/* 資金計画 */}
          <ProfileSection icon={<Wallet size={15} />} title="資金計画">
            <div className="profile-grid-3col" style={{ display: "grid", gap: "12px" }}>
              <div>
                <label style={labelStyle}>頭金の目安</label>
                <SelectField
                  value={profile.down_payment_label}
                  options={DOWN_PAYMENT_OPTIONS}
                  onChange={(v) => setProfile((p) => ({ ...p, down_payment_label: v }))}
                  placeholder="選択してください"
                />
              </div>
              <div>
                <label style={labelStyle}>年収帯（おおよそ）</label>
                <SelectField
                  value={profile.annual_income_range}
                  options={INCOME_RANGES}
                  onChange={(v) => setProfile((p) => ({ ...p, annual_income_range: v }))}
                  placeholder="選択してください"
                />
              </div>
              <div>
                <label style={labelStyle}>ローン事前審査</label>
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
          <ProfileSection icon={<Star size={15} />} title="物件選びで重視するポイント">
            <CheckGroup
              options={PRIORITY_POINTS}
              selected={profile.priority_points}
              onChange={(v) => setProfile((p) => ({ ...p, priority_points: toggleArray(p.priority_points, v) }))}
              cols={3}
            />
          </ProfileSection>

          {/* その他 */}
          <ProfileSection icon={<Calendar size={15} />} title="その他">
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div>
                <label style={labelStyle}>購入を考えたきっかけ</label>
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
                <label style={labelStyle}>ご要望・備考</label>
                <textarea
                  value={profile.remarks}
                  onChange={(e) => setProfile((p) => ({ ...p, remarks: e.target.value }))}
                  placeholder="例: ペット可物件を希望、2階以上希望、など"
                  rows={4}
                  style={{ ...inputStyle, resize: "vertical", lineHeight: 1.7 }}
                />
              </div>
            </div>
          </ProfileSection>
        </div>
      </div>

      {/* 保存ボタン */}
      <button
        onClick={handleSave}
        disabled={loading}
        style={{
          width: "100%",
          padding: "14px",
          backgroundColor: "#5BAD52",
          color: "#fff",
          border: "none",
          borderRadius: "10px",
          fontSize: "16px",
          fontWeight: "bold",
          cursor: loading ? "not-allowed" : "pointer",
          opacity: loading ? 0.6 : 1,
          transition: "opacity 0.15s ease",
        }}
      >
        {loading ? "保存中..." : "変更を保存する"}
      </button>
    </div>
  );
}

// ─── サブコンポーネント ─────────────────────────────────────

function ProfileSection({ icon, title, children }: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        marginBottom: "12px",
        paddingBottom: "8px",
        borderBottom: "1px solid #F0F0F0",
      }}>
        <span style={{ color: "#5BAD52" }}>{icon}</span>
        <h3 style={{ fontSize: "13px", fontWeight: "bold", color: "#555", margin: 0 }}>
          {title}
        </h3>
      </div>
      {children}
    </div>
  );
}

function CheckGroup({ options, selected, onChange, cols = 2 }: {
  options: string[];
  selected: string[];
  onChange: (v: string) => void;
  cols?: number;
}) {
  const colClass = cols === 4 ? "profile-check-4col"
    : cols === 3 ? "profile-check-3col"
    : "profile-check-2col";

  return (
    <div className={colClass} style={{ display: "grid", gap: "8px" }}>
      {options.map((opt) => {
        const checked = selected.includes(opt);
        return (
          <label
            key={opt}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              cursor: "pointer",
              padding: "8px 10px",
              borderRadius: "8px",
              border: `1px solid ${checked ? "#5BAD52" : "#E5E5E5"}`,
              backgroundColor: checked ? "#EBF7EA" : "#fff",
              transition: "all 0.15s ease",
            }}
          >
            <input
              type="checkbox"
              checked={checked}
              onChange={() => onChange(opt)}
              style={{ display: "none" }}
            />
            <span style={{
              width: "16px",
              height: "16px",
              borderRadius: "4px",
              flexShrink: 0,
              border: `1.5px solid ${checked ? "#5BAD52" : "#D0D0D0"}`,
              backgroundColor: checked ? "#5BAD52" : "transparent",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
              {checked && <span style={{ color: "#fff", fontSize: "10px", lineHeight: 1 }}>✓</span>}
            </span>
            <span style={{ fontSize: "12px", color: "#444" }}>{opt}</span>
          </label>
        );
      })}
    </div>
  );
}

function SelectField({ value, options, onChange, placeholder }: {
  value: string;
  options: string[];
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        ...inputStyle,
        borderColor: value ? "#5BAD52" : "#E5E5E5",
        cursor: "pointer",
      }}
    >
      <option value="">{placeholder}</option>
      {options.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}
