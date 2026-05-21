// components/layout/Header.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { HeaderClient } from "./HeaderClient";

export async function Header() {
  let isLoggedIn = false;
  let userName: string | null = null;

  try {
    const session = await getServerSession(authOptions);
    isLoggedIn = !!session?.user;
    userName = session?.user?.name ?? null;
  } catch (e) {
    console.error("[Header] getServerSession failed:", e);
    // セッション取得失敗時は未ログイン状態として表示継続
  }

  return <HeaderClient isLoggedIn={isLoggedIn} userName={userName} />;
}
