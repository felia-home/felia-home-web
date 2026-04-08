"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

const NAV_ITEMS = [
  { href: "/properties", label: "物件検索" },
  { href: "/mypage/favorites", label: "お気に入り" },
  { href: "/recruit", label: "採用情報" },
  { href: "/contact", label: "お問合せ" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();

  useEffect(() => { setMenuOpen(false); }, [pathname]);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-[#e0e0e0]"
      style={{ height: "70px" }}
    >
      <div className="container-xl h-full flex items-center justify-between">
        {/* ロゴ */}
        <Link href="/" className="flex items-center gap-2">
          <svg width="38" height="38" viewBox="0 0 40 40" fill="none" aria-hidden="true">
            <rect width="40" height="40" rx="4" fill="#5BAD52" />
            <path d="M20 8L8 18v14h8v-8h8v8h8V18L20 8z" fill="white" />
            <circle cx="26" cy="13" r="3" fill="white" opacity="0.85" />
          </svg>
          <span
            className="text-xl text-[#333] tracking-wider"
            style={{ fontFamily: "sans-serif", fontWeight: 300 }}
          >
            felia home
          </span>
        </Link>

        {/* PC ナビゲーション */}
        <nav className="hidden lg:flex items-center gap-7">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-sm text-[#333] hover:text-[#5BAD52] transition-colors ${
                pathname === item.href ? "text-[#5BAD52]" : ""
              }`}
            >
              {item.label}
            </Link>
          ))}

          {session ? (
            <>
              <Link
                href="/mypage"
                className="text-sm text-[#333] hover:text-[#5BAD52] transition-colors"
              >
                マイページ
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="text-sm text-[#666] hover:text-[#5BAD52] transition-colors"
              >
                ログアウト
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm text-[#333] hover:text-[#5BAD52] transition-colors"
              >
                ログイン
              </Link>
              <Link
                href="/register"
                className="text-sm bg-[#5BAD52] text-white px-4 py-2 hover:bg-[#3d8a3a] transition-colors"
              >
                無料会員登録
              </Link>
            </>
          )}

          {/* ハンバーガー */}
          <button
            className="flex flex-col gap-1.5 p-1"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="メニュー"
          >
            <span className="block w-6 h-0.5 bg-[#333]" />
            <span className="block w-6 h-0.5 bg-[#333]" />
            <span className="block w-6 h-0.5 bg-[#333]" />
          </button>
        </nav>

        {/* SP ハンバーガー */}
        <button
          className="lg:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="メニュー"
        >
          <span className="block w-6 h-0.5 bg-[#333]" />
          <span className="block w-6 h-0.5 bg-[#333]" />
          <span className="block w-6 h-0.5 bg-[#333]" />
        </button>
      </div>

      {/* ドロワーメニュー */}
      {menuOpen && (
        <div className="bg-white border-t border-[#e0e0e0] shadow-md">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block px-6 py-4 text-sm border-b border-[#e0e0e0] text-[#333] hover:text-[#5BAD52] hover:bg-[#f0f7ee]"
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <div className="p-4 space-y-2">
            {session ? (
              <>
                <Link
                  href="/mypage"
                  className="block text-center border border-[#5BAD52] text-[#5BAD52] py-3 text-sm font-bold hover:bg-[#f0f7ee] transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  マイページ
                </Link>
                <button
                  onClick={() => { setMenuOpen(false); signOut({ callbackUrl: "/" }); }}
                  className="block w-full text-center text-[#666] py-2 text-sm"
                >
                  ログアウト
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/register"
                  className="block text-center bg-[#5BAD52] text-white py-3 text-sm font-bold hover:bg-[#3d8a3a] transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  無料会員登録
                </Link>
                <Link
                  href="/login"
                  className="block text-center border border-[#5BAD52] text-[#5BAD52] py-3 text-sm font-bold hover:bg-[#f0f7ee] transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  ログイン
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
