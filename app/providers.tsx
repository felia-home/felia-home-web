// app/providers.tsx
"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

interface AuthUser {
  id: string;
  name?: string | null;
  email?: string | null;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  signOut: async () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

export function Providers({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // /api/auth/session から next-auth のセッションを取得
    fetch("/api/auth/session")
      .then((r) => r.json())
      .then((data) => {
        setUser(data?.user ?? null);
      })
      .catch(() => setUser(null))
      .finally(() => setIsLoading(false));
  }, []);

  const signOut = async () => {
    try {
      // CSRF トークン取得
      const csrfRes = await fetch("/api/auth/csrf");
      const { csrfToken } = await csrfRes.json();
      // signout
      await fetch("/api/auth/signout", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `csrfToken=${encodeURIComponent(csrfToken ?? "")}&json=true`,
      });
    } catch {
      // 失敗してもクライアント側のクリアは行う
    }
    setUser(null);
    window.location.href = "/";
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
