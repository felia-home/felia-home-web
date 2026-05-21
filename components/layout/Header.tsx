// components/layout/Header.tsx
import { HeaderClient } from "./HeaderClient";

export async function Header() {
  // session は layout.tsx の Providers に渡し済み。
  // HeaderClient 内の useSession() で取得する。
  return <HeaderClient />;
}
