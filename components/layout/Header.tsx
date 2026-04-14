// components/layout/Header.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { HeaderClient } from "./HeaderClient";

export async function Header() {
  const session = await getServerSession(authOptions);
  const isLoggedIn = !!session?.user;
  const userName = session?.user?.name ?? null;
  return <HeaderClient isLoggedIn={isLoggedIn} userName={userName} />;
}
