"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

const NAV_ITEMS = [
  { href: "/properties", label: "物件検索" },
  { href: "/recruit",    label: "採用情報" },
  { href: "/contact",    label: "お問合せ" },
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
        <Link href="/" className="flex items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://felia-home.co.jp/assets/images/common/logo.png"
            alt="Felia home"
            style={{ height: "40px", width: "auto" }}
          />
        </Link>

        {/* PC ナビゲーション */}
        <nav className="hidden lg:flex items-center gap-6">
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

          {/* お気に入り */}
          <Link
            href="/mypage/favorites"
            className="flex items-center gap-1 text-sm text-[#333] hover:text-[#5BAD52] transition-colors"
            title="お気に入り"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://felia-home.co.jp/assets/images/common/icon_hart_black.png"
              alt="お気に入り"
              style={{ height: "22px", width: "auto" }}
            />
          </Link>

          {/* ログイン / マイページ */}
          {session ? (
            <>
              <Link
                href="/mypage"
                className="flex items-center gap-1 text-sm text-[#333] hover:text-[#5BAD52] transition-colors"
                title="マイページ"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://felia-home.co.jp/assets/images/common/icon_acount_black.png"
                  alt="マイページ"
                  style={{ height: "22px", width: "auto" }}
                />
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
                className="flex items-center gap-1 text-sm text-[#333] hover:text-[#5BAD52] transition-colors"
                title="ログイン"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://felia-home.co.jp/assets/images/common/icon_door_black.png"
                  alt="ログイン"
                  style={{ height: "22px", width: "auto" }}
                />
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
          <Link
            href="/mypage/favorites"
            className="block px-6 py-4 text-sm border-b border-[#e0e0e0] text-[#333] hover:text-[#5BAD52] hover:bg-[#f0f7ee]"
            onClick={() => setMenuOpen(false)}
          >
            お気に入り
          </Link>
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
