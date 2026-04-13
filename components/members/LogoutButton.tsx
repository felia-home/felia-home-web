// components/members/LogoutButton.tsx
"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border
                 text-sm text-gray-500 hover:border-red-300 hover:text-red-400 transition-colors bg-white"
      style={{ borderColor: "#E5E5E5" }}
    >
      <LogOut size={16} />
      ログアウト
    </button>
  );
}
