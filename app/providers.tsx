// app/providers.tsx
"use client";

import dynamic from "next/dynamic";
import type { ReactNode } from "react";

// SessionProvider を SSR から除外
const SessionProvider = dynamic(
  () => import("next-auth/react").then((mod) => mod.SessionProvider),
  { ssr: false }
);

export function Providers({ children }: { children: ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
