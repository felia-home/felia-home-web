"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

const NAV_ITEMS = [
  { href: "/properties", label: "物件検索" },
  { href: "/feature/felia", label: "弊社限定物件" },
  { href: "/service", label: "サービス" },
  { href: "/company", label: "会社案内" },
  { href: "/staff", label: "スタッフ" },
  { href: "/news", label: "お知らせ" },
  { href: "/recruit", label: "採用情報" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();

  // トップページ以外は常に白背景
  const isTop = pathname === "/";
  const isTransparent = isTop && !scrolled;

  useEffect(() => {
    if (!isTop) return;
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isTop]);

  useEffect(() => { setMenuOpen(false); }, [pathname]);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isTransparent ? "bg-transparent py-5" : "bg-white shadow-md py-3"
    }`}>
      <div className="container-xl flex items-center justify-between">
        {/* ロゴ */}
        <Link href="/" className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
            isTransparent ? "bg-white/20" : "bg-[#1a3a2a]"
          }`}>
            <span className="font-serif text-lg font-bold text-white">F</span>
          </div>
          <div className="flex flex-col">
            <span className={`text-lg font-serif font-bold tracking-[0.1em] transition-colors ${
              isTransparent ? "text-white" : "text-[#1a3a2a]"
            }`}>
              Felia Home
            </span>
            <span className={`text-[9px] tracking-[0.25em] uppercase transition-colors ${
              isTransparent ? "text-white/60" : "text-[#706e68]"
            }`}>
              フェリアホーム
            </span>
          </div>
        </Link>

        {/* PC ナビ */}
        <nav className="hidden lg:flex items-center gap-7">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-sm tracking-wide transition-colors hover:text-[#c9a96e] ${
                isTransparent ? "text-white" : "text-[#1c1b18]"
              } ${pathname === item.href ? "text-[#c9a96e]" : ""}`}
            >
              {item.label}
            </Link>
          ))}
          {session ? (
            <>
              <Link href="/mypage" className={`text-sm tracking-wide transition-colors hover:text-[#c9a96e] ${isTransparent ? "text-white" : "text-[#1c1b18]"}`}>
                マイページ
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className={`text-sm tracking-wide transition-colors hover:text-[#c9a96e] ${isTransparent ? "text-white/70" : "text-[#706e68]"}`}
              >
                ログアウト
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className={`text-sm tracking-wide transition-colors hover:text-[#c9a96e] ${isTransparent ? "text-white" : "text-[#1c1b18]"}`}>
                ログイン
              </Link>
              <Link
                href="/register"
                className="bg-[#c9a96e] text-white text-sm px-5 py-2.5 rounded-full tracking-wide hover:bg-[#b8935a] transition-colors"
              >
                無料会員登録
              </Link>
            </>
          )}
        </nav>

        {/* SP ハンバーガー */}
        <button
          className="lg:hidden p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="メニュー"
        >
          <div className={`w-6 h-0.5 mb-1.5 transition-all ${isTransparent ? "bg-white" : "bg-[#1c1b18]"}`} />
          <div className={`w-6 h-0.5 mb-1.5 transition-all ${isTransparent ? "bg-white" : "bg-[#1c1b18]"}`} />
          <div className={`w-6 h-0.5 transition-all ${isTransparent ? "bg-white" : "bg-[#1c1b18]"}`} />
        </button>
      </div>

      {/* SP メニュー */}
      {menuOpen && (
        <div className="lg:hidden bg-white border-t border-[#e8e6e0]">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block px-6 py-4 text-sm border-b border-[#e8e6e0] text-[#1c1b18] hover:text-[#c9a96e]"
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <div className="p-4 space-y-2">
            {session ? (
              <>
                <Link href="/mypage" className="block text-center border border-[#1a3a2a] text-[#1a3a2a] py-3 rounded-full text-sm font-bold" onClick={() => setMenuOpen(false)}>
                  マイページ
                </Link>
                <button onClick={() => { setMenuOpen(false); signOut({ callbackUrl: "/" }); }} className="block w-full text-center text-[#706e68] py-2 text-sm">
                  ログアウト
                </button>
              </>
            ) : (
              <>
                <Link href="/register" className="block text-center bg-[#c9a96e] text-white py-3 rounded-full text-sm font-bold" onClick={() => setMenuOpen(false)}>
                  無料会員登録
                </Link>
                <Link href="/login" className="block text-center border border-[#1a3a2a] text-[#1a3a2a] py-3 rounded-full text-sm font-bold" onClick={() => setMenuOpen(false)}>
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
