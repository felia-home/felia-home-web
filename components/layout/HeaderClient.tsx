"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Heart, Menu, Lock } from "lucide-react";
import { AccordionMenu } from "./AccordionMenu";
import { useSession } from "next-auth/react";

interface HeaderClientProps {
  isLoggedIn?: boolean;
  userName?: string | null;
}

export function HeaderClient({ isLoggedIn: _isLoggedIn, userName }: HeaderClientProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);
  const session = useSession();
  const isLoggedIn = session?.status === "authenticated";

  const navItemStyle = (key: string): React.CSSProperties => ({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "2px",
    padding: "4px 8px",
    borderRadius: "6px",
    backgroundColor: hoveredNav === key ? "#f9f9f9" : "transparent",
    cursor: "pointer",
    textDecoration: "none",
    transition: "background-color 0.15s ease",
  });

  return (
    <>
      <header style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        backgroundColor: "#fff",
        borderBottom: "1px solid #E5E5E5",
      }}>
        <div style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 16px",
        }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: "64px",
          }}>

            {/* ロゴ */}
            <Link href="/" style={{ display: "flex", alignItems: "center", gap: "4px", textDecoration: "none" }}>
              <span style={{
                fontFamily: "'Montserrat', sans-serif",
                fontWeight: "bold",
                fontSize: "22px",
                letterSpacing: "0.05em",
                color: "#5BAD52",
              }}>
                Felia
              </span>
              <span style={{
                fontWeight: "bold",
                fontSize: "22px",
                color: "#555",
                letterSpacing: "0.03em",
              }}>
                Home
              </span>
            </Link>

            {/* ナビゲーション */}
            <nav style={{ display: "flex", alignItems: "center", gap: "4px" }}>

              {/* 物件検索 */}
              <Link
                href="/search"
                style={navItemStyle("search")}
                onMouseEnter={() => setHoveredNav("search")}
                onMouseLeave={() => setHoveredNav(null)}
              >
                <Search size={20} strokeWidth={1.8} color="#888" />
                <span style={{ fontSize: "10px", color: "#888", whiteSpace: "nowrap" }}>
                  物件検索
                </span>
              </Link>

              {/* お気に入り */}
              <Link
                href={isLoggedIn ? "/members/favorites" : "/members/login"}
                style={navItemStyle("favorites")}
                onMouseEnter={() => setHoveredNav("favorites")}
                onMouseLeave={() => setHoveredNav(null)}
              >
                <Heart size={20} strokeWidth={1.8} color="#888" />
                <span style={{ fontSize: "10px", color: "#888", whiteSpace: "nowrap" }}>
                  お気に入り
                </span>
              </Link>

              {/* 採用情報 */}
              <Link
                href="/recruit"
                style={{ ...navItemStyle("recruit"), display: "none" }}
                className="tb-show"
                onMouseEnter={() => setHoveredNav("recruit")}
                onMouseLeave={() => setHoveredNav(null)}
              >
                <span style={{ fontSize: "11px", color: "#666", whiteSpace: "nowrap", lineHeight: "20px" }}>
                  採用情報
                </span>
              </Link>

              {/* 非公開物件（ログイン時） */}
              {isLoggedIn && (
                <Link
                  href="/private-selection"
                  style={navItemStyle("private")}
                  onMouseEnter={() => setHoveredNav("private")}
                  onMouseLeave={() => setHoveredNav(null)}
                >
                  <Lock size={18} strokeWidth={1.8} color="#5BAD52" />
                  <span style={{ fontSize: "10px", color: "#5BAD52", whiteSpace: "nowrap", fontWeight: "bold" }}>
                    非公開物件
                  </span>
                </Link>
              )}

              {/* ログイン状態によってボタン切り替え */}
              {isLoggedIn ? (
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginLeft: "4px" }}>
                  <Link
                    href="/private-selection"
                    style={{
                      fontSize: "13px", color: "#5BAD52",
                      textDecoration: "none", fontWeight: "bold",
                      whiteSpace: "nowrap", padding: "4px 8px",
                    }}
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
                  >
                    マイページ
                  </Link>
                </div>
              ) : (
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginLeft: "4px" }}>
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
                  >
                    ログイン
                  </Link>
                </div>
              )}

              {/* ハンバーガーメニュー */}
              <button
                onClick={() => setMenuOpen(true)}
                onMouseEnter={() => setHoveredNav("menu")}
                onMouseLeave={() => setHoveredNav(null)}
                style={{
                  ...navItemStyle("menu"),
                  background: "none",
                  border: "none",
                  marginLeft: "4px",
                }}
                aria-label="メニューを開く"
              >
                <Menu size={22} strokeWidth={1.8} color="#666" />
                <span style={{ fontSize: "10px", color: "#888" }}>メニュー</span>
              </button>
            </nav>
          </div>
        </div>
      </header>

      <AccordionMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
