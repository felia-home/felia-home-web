// components/members/LogoutButton.tsx
"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export function LogoutButton() {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: "/" })}
      className="logout-btn"
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
        padding: "12px",
        borderRadius: "12px",
        border: "1px solid #E5E5E5",
        backgroundColor: "#fff",
        color: "#888",
        fontSize: "14px",
        cursor: "pointer",
      }}
    >
      <LogOut size={16} />
      ログアウト
    </button>
  );
}
