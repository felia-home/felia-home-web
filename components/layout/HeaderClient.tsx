// components/layout/HeaderClient.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Heart, Menu, Lock } from "lucide-react";
import { AccordionMenu } from "./AccordionMenu";
import { useSession } from "next-auth/react";

interface HeaderClientProps {
  isLoggedIn: boolean;
  userName?: string | null;
}

export function HeaderClient({ isLoggedIn: _isLoggedIn, userName }: HeaderClientProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { status } = useSession();
  const isLoggedIn = status === "authenticated";

  return (
    <>
      <header
        className="sticky top-0 z-50 bg-white border-b"
        style={{ borderColor: "#E5E5E5" }}
      >
        <div className="container-content">
          <div className="flex items-center justify-between h-14 tb:h-[72px]">

            {/* ロゴ */}
            <Link href="/" className="flex items-center gap-1">
              <span
                className="font-montserrat font-bold text-xl tb:text-2xl tracking-wider"
                style={{ color: "#5BAD52" }}
              >
                Felia
              </span>
              <span className="font-bold text-xl tb:text-2xl text-gray-700 tracking-wide">
                Home
              </span>
            </Link>

            {/* ナビゲーション */}
            <nav className="flex items-center gap-1 tb:gap-2">

              {/* 物件検索 */}
              <Link
                href="/search"
                className="flex flex-col items-center gap-0.5 px-2 py-1 rounded hover:bg-gray-50 transition-colors group"
              >
                <Search size={20} className="text-gray-500 group-hover:text-felia-green transition-colors" strokeWidth={1.8} />
                <span className="hidden tb:block text-[10px] text-gray-500 group-hover:text-felia-green whitespace-nowrap">
                  物件検索
                </span>
              </Link>

              {/* お気に入り */}
              <Link
                href={isLoggedIn ? "/members/favorites" : "/members/login"}
                className="flex flex-col items-center gap-0.5 px-2 py-1 rounded hover:bg-gray-50 transition-colors group"
              >
                <Heart size={20} className="text-gray-500 group-hover:text-red-400 transition-colors" strokeWidth={1.8} />
                <span className="hidden tb:block text-[10px] text-gray-500 group-hover:text-red-400 whitespace-nowrap">
                  お気に入り
                </span>
              </Link>

              {/* 採用情報 */}
              <Link
                href="/recruit"
                className="hidden tb:flex flex-col items-center gap-0.5 px-2 py-1 rounded hover:bg-gray-50 transition-colors group"
              >
                <span className="text-[11px] font-medium text-gray-600 group-hover:text-felia-green whitespace-nowrap" style={{ lineHeight: "20px" }}>
                  採用情報
                </span>
              </Link>

              {/* 非公開物件（ログイン時のみ） */}
              {isLoggedIn && (
                <Link
                  href="/private-selection"
                  className="hidden tb:flex flex-col items-center gap-0.5 px-2 py-1 rounded hover:bg-gray-50 transition-colors group"
                >
                  <Lock size={18} strokeWidth={1.8} style={{ color: "#5BAD52" }} />
                  <span className="text-[10px] font-medium whitespace-nowrap" style={{ color: "#5BAD52" }}>
                    非公開物件
                  </span>
                </Link>
              )}

              {/* ログイン状態によってボタンを切り替え */}
              {isLoggedIn ? (
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <Link
                    href="/private-selection"
                    style={{
                      fontSize: "13px",
                      color: "#5BAD52",
                      textDecoration: "none",
                      fontWeight: "bold",
                      whiteSpace: "nowrap",
                    }}
                    className="hidden tb:block"
                  >
                    プライベートセレクション
                  </Link>
                  <Link
                    href="/members/mypage"
                    style={{
                      display: "inline-block",
                      padding: "8px 16px",
                      backgroundColor: "#5BAD52",
                      color: "#fff",
                      borderRadius: "6px",
                      textDecoration: "none",
                      fontSize: "13px",
                      fontWeight: "bold",
                      whiteSpace: "nowrap",
                    }}
                    className="hidden tb:block"
                  >
                    マイページ
                  </Link>
                </div>
              ) : (
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <Link
                    href="/lp/register"
                    style={{
                      display: "inline-block",
                      padding: "8px 16px",
                      backgroundColor: "#5BAD52",
                      color: "#fff",
                      borderRadius: "6px",
                      textDecoration: "none",
                      fontSize: "13px",
                      fontWeight: "bold",
                      whiteSpace: "nowrap",
                    }}
                    className="hidden tb:block"
                  >
                    無料会員登録
                  </Link>
                  <Link
                    href="/members/login"
                    style={{
                      fontSize: "13px",
                      color: "#555",
                      textDecoration: "none",
                      whiteSpace: "nowrap",
                    }}
                    className="hidden tb:block"
                  >
                    ログイン
                  </Link>
                </div>
              )}

              {/* ハンバーガーメニュー */}
              <button
                onClick={() => setMenuOpen(true)}
                className="flex flex-col items-center gap-0.5 px-2 py-1 rounded hover:bg-gray-50 transition-colors group ml-1"
                aria-label="メニューを開く"
              >
                <Menu size={22} className="text-gray-600 group-hover:text-felia-green transition-colors" strokeWidth={1.8} />
                <span className="hidden tb:block text-[10px] text-gray-500 group-hover:text-felia-green">
                  メニュー
                </span>
              </button>
            </nav>
          </div>
        </div>
      </header>

      <AccordionMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
