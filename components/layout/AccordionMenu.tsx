// components/layout/AccordionMenu.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { X, ChevronDown, ChevronUp } from "lucide-react";
import { signOut, useSession } from "next-auth/react";

interface MenuItem {
  label: string;
  href?: string;
  children?: { label: string; href: string }[];
}

const menuItems: MenuItem[] = [
  {
    label: "買いたい",
    children: [
      { label: "条件（地域・沿線・駅）から物件を探す", href: "/search" },
      { label: "厳選物件情報", href: "/properties?flag=featured" },
      { label: "新着物件情報", href: "/properties?flag=new" },
    ],
  },
  { label: "現地販売会情報", href: "/open-houses" },
  { label: "WEBチラシ", href: "/flyers" },
  {
    label: "売りたい",
    children: [
      { label: "不動産売却について", href: "/sell" },
      { label: "売却査定", href: "/sell/valuation" },
      { label: "売却実績", href: "/sell/results" },
    ],
  },
  {
    label: "サービス",
    children: [
      { label: "不動産購入について", href: "/buy" },
      { label: "物件の買い替えをお考えの方へ", href: "/buy/trade-up" },
      { label: "無料FPサービス", href: "/services/fp" },
      { label: "お客様の声", href: "/services/voice" },
    ],
  },
  { label: "よくある質問", href: "/faq" },
  {
    label: "私たちについて",
    children: [
      { label: "フェリアホームについて", href: "/about" },
      { label: "スタッフ紹介", href: "/staff" },
    ],
  },
  { label: "お知らせ", href: "/news" },
];

interface AccordionMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AccordionMenu({ isOpen, onClose }: AccordionMenuProps) {
  const [openItems, setOpenItems] = useState<string[]>([]);
  const [closeHover, setCloseHover] = useState(false);
  const session = useSession();
  const isLoggedIn = session?.status === "authenticated";

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      setOpenItems([]);
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const toggleItem = (label: string) => {
    setOpenItems((prev) =>
      prev.includes(label)
        ? prev.filter((l) => l !== label)
        : [...prev, label]
    );
  };

  if (!isOpen) return null;

  return (
    <>
      {/* オーバーレイ */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 50,
          backgroundColor: "rgba(0,0,0,0.4)",
        }}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* ドロワー本体 */}
      <div
        className="accordion-drawer"
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          zIndex: 50,
          height: "100%",
          backgroundColor: "#fff",
          boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
          overflowY: "auto",
          animation: "slideInRight 0.25s ease-out",
        }}
      >
        {/* ヘッダー */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px 24px",
            borderBottom: "1px solid #E5E5E5",
            position: "sticky",
            top: 0,
            backgroundColor: "#fff",
            zIndex: 10,
          }}
        >
          <span
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: 700,
              fontSize: "18px",
              letterSpacing: "0.05em",
              color: "#5BAD52",
            }}
          >
            MENU
          </span>
          <button
            onClick={onClose}
            onMouseEnter={() => setCloseHover(true)}
            onMouseLeave={() => setCloseHover(false)}
            style={{
              padding: "6px",
              borderRadius: "4px",
              border: "none",
              backgroundColor: closeHover ? "#f3f4f6" : "transparent",
              cursor: "pointer",
              transition: "background-color 0.2s",
            }}
            aria-label="メニューを閉じる"
          >
            <X size={22} style={{ color: "#666" }} />
          </button>
        </div>

        {/* メニューリスト */}
        <nav style={{ padding: "8px 0" }}>
          {menuItems.map((item) => (
            <div key={item.label}>
              {item.children ? (
                <>
                  <button
                    onClick={() => toggleItem(item.label)}
                    className="accordion-menu-item"
                  >
                    <span
                      style={{
                        fontWeight: 500,
                        color: "#444",
                        fontSize: "15px",
                      }}
                    >
                      {item.label}
                    </span>
                    {openItems.includes(item.label) ? (
                      <ChevronUp
                        size={18}
                        style={{ color: "#999", flexShrink: 0 }}
                      />
                    ) : (
                      <ChevronDown
                        size={18}
                        style={{ color: "#999", flexShrink: 0 }}
                      />
                    )}
                  </button>

                  {/* サブメニュー */}
                  {openItems.includes(item.label) && (
                    <div
                      style={{
                        borderLeft: "2px solid #5BAD52",
                        marginLeft: "24px",
                        marginBottom: "4px",
                      }}
                    >
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={onClose}
                          className="accordion-submenu-link"
                        >
                          <span
                            style={{
                              width: "4px",
                              height: "4px",
                              borderRadius: "50%",
                              flexShrink: 0,
                              backgroundColor: "#5BAD52",
                            }}
                          />
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link
                  href={item.href!}
                  onClick={onClose}
                  className="accordion-menu-item"
                  style={{ textDecoration: "none" }}
                >
                  <span
                    style={{
                      fontWeight: 500,
                      color: "#444",
                      fontSize: "15px",
                    }}
                  >
                    {item.label}
                  </span>
                  <span style={{ color: "#ccc", fontSize: "14px" }}>›</span>
                </Link>
              )}

              {/* セパレーター */}
              <div
                style={{
                  margin: "0 24px",
                  borderBottom: "1px solid #F0F0F0",
                }}
              />
            </div>
          ))}
        </nav>

        {/* 下部CTA */}
        <div
          style={{
            padding: "24px",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          <Link
            href="/lp/register"
            onClick={onClose}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              padding: "12px",
              borderRadius: "4px",
              backgroundColor: "#5BAD52",
              color: "#fff",
              fontWeight: 500,
              fontSize: "14px",
              textDecoration: "none",
            }}
          >
            無料会員登録
          </Link>
          <Link
            href="/sell/valuation"
            onClick={onClose}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              padding: "12px",
              borderRadius: "4px",
              border: "1px solid #E5E5E5",
              fontWeight: 500,
              fontSize: "14px",
              color: "#444",
              textDecoration: "none",
              backgroundColor: "#fff",
            }}
          >
            無料売却査定
          </Link>
        </div>

        {/* 採用情報リンク（SPのみ） */}
        <div className="accordion-recruit-wrap">
          <Link
            href="/recruit"
            onClick={onClose}
            style={{
              fontSize: "14px",
              color: "#888",
              textDecoration: "none",
            }}
          >
            採用情報
          </Link>
        </div>

        {/* ログアウト（ログイン時のみ） */}
        {isLoggedIn && (
          <button
            onClick={() => {
              onClose();
              signOut({ callbackUrl: "/" });
            }}
            style={{
              display: "block",
              width: "100%",
              textAlign: "left",
              padding: "14px 24px",
              backgroundColor: "transparent",
              border: "none",
              borderTop: "1px solid #f0f0f0",
              fontSize: "14px",
              color: "#888",
              cursor: "pointer",
            }}
          >
            ログアウト
          </button>
        )}
      </div>

      {/* アニメーション定義 */}
      <style jsx global>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </>
  );
}
