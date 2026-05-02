// app/members/login/page.tsx
"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Mail, Lock, Eye, EyeOff, LogIn } from "lucide-react";

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 12px 10px 36px",
  border: "1px solid #E5E5E5",
  borderRadius: "8px",
  fontSize: "14px",
  color: "#333",
  outline: "none",
  backgroundColor: "#fff",
  boxSizing: "border-box",
};

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/members/mypage";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPwd] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await signIn("credentials", { email, password, redirect: false });
    if (result?.error) {
      setError("メールアドレスまたはパスワードが正しくありません");
      setLoading(false);
    } else {
      router.push(callbackUrl);
      router.refresh();
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#f8f8f8",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "40px 16px",
    }}>
      <div style={{
        backgroundColor: "#fff",
        borderRadius: "16px",
        padding: "32px 28px",
        maxWidth: "420px",
        width: "100%",
        boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
        border: "1px solid #E5E5E5",
      }}>
        {/* ヘッダー */}
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <div style={{
            width: "48px", height: "48px", borderRadius: "12px",
            backgroundColor: "#EBF7EA",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 12px",
          }}>
            <LogIn size={22} style={{ color: "#5BAD52" }} />
          </div>
          <h1 style={{ fontSize: "22px", fontWeight: "bold", color: "#333", margin: "0 0 4px" }}>
            ログイン
          </h1>
          <p style={{ fontSize: "13px", color: "#888", margin: 0 }}>
            会員限定コンテンツをご利用いただけます
          </p>
        </div>

        {/* エラー */}
        {error && (
          <div style={{
            marginBottom: "16px",
            padding: "12px 14px",
            borderRadius: "8px",
            backgroundColor: "#fef2f2",
            border: "1px solid #fca5a5",
            fontSize: "13px",
            color: "#991b1b",
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* メールアドレス */}
          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: "bold", color: "#555", marginBottom: "6px" }}>
              メールアドレス <span style={{ color: "#e53e3e", fontSize: "10px" }}>必須</span>
            </label>
            <div style={{ position: "relative" }}>
              <Mail size={15} style={{ position: "absolute", left: "11px", top: "50%", transform: "translateY(-50%)", color: "#aaa" }} />
              <input
                type="email"
                value={email}
                required
                autoComplete="email"
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@email.com"
                style={inputStyle}
              />
            </div>
          </div>

          {/* パスワード */}
          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: "bold", color: "#555", marginBottom: "6px" }}>
              パスワード <span style={{ color: "#e53e3e", fontSize: "10px" }}>必須</span>
            </label>
            <div style={{ position: "relative" }}>
              <Lock size={15} style={{ position: "absolute", left: "11px", top: "50%", transform: "translateY(-50%)", color: "#aaa" }} />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                required
                autoComplete="current-password"
                onChange={(e) => setPassword(e.target.value)}
                placeholder="パスワード"
                style={{ ...inputStyle, paddingRight: "40px" }}
              />
              <button
                type="button"
                onClick={() => setShowPwd((s) => !s)}
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#aaa",
                  padding: 0,
                }}
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {/* ログインボタン */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "13px",
              backgroundColor: "#5BAD52",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              fontSize: "15px",
              fontWeight: "bold",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.6 : 1,
              transition: "opacity 0.15s ease",
              marginTop: "4px",
            }}
          >
            {loading ? "ログイン中..." : "ログイン"}
          </button>
        </form>

        {/* 区切り */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", margin: "20px 0" }}>
          <div style={{ flex: 1, height: "1px", backgroundColor: "#f0f0f0" }} />
          <span style={{ fontSize: "12px", color: "#aaa" }}>または</span>
          <div style={{ flex: 1, height: "1px", backgroundColor: "#f0f0f0" }} />
        </div>

        {/* 会員登録リンク */}
        <Link
          href="/members/register"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            padding: "11px",
            border: "1px solid #E5E5E5",
            borderRadius: "8px",
            fontSize: "13px",
            fontWeight: "500",
            color: "#555",
            textDecoration: "none",
            boxSizing: "border-box",
          }}
        >
          新規会員登録はこちら（無料）
        </Link>

        {/* パスワード忘れ */}
        <p style={{ textAlign: "center", marginTop: "16px" }}>
          <Link href="/members/reset-password" style={{ fontSize: "12px", color: "#aaa", textDecoration: "none" }}>
            パスワードをお忘れの方
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", backgroundColor: "#f8f8f8" }} />}>
      <LoginForm />
    </Suspense>
  );
}
