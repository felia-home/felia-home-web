// app/providers.tsx
"use client";

import { SessionProvider } from "next-auth/react";
import { useState, useEffect, type ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // SSR・hydration フェーズでは SessionProvider なしで描画
    return <>{children}</>;
  }

  return <SessionProvider>{children}</SessionProvider>;
}
