// components/layout/AccordionMenu.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { X, ChevronDown, ChevronUp } from "lucide-react";

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
      { label: "スタッフ紹介", href: "/about/staff" },
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

  // メニューが開いた時にスクロールを禁止
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
        className="fixed inset-0 z-50 bg-black/40"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* ドロワー本体 */}
      <div
        className="fixed top-0 right-0 z-50 h-full w-full tb:w-[420px] bg-white shadow-2xl overflow-y-auto"
        style={{ animation: "slideInRight 0.25s ease-out" }}
      >
        {/* ヘッダー */}
        <div
          className="flex items-center justify-between px-6 py-4 border-b sticky top-0 bg-white z-10"
          style={{ borderColor: "#E5E5E5" }}
        >
          <span
            className="font-montserrat font-bold text-lg tracking-wider"
            style={{ color: "#5BAD52" }}
          >
            MENU
          </span>
          <button
            onClick={onClose}
            className="p-1.5 rounded hover:bg-gray-100 transition-colors"
            aria-label="メニューを閉じる"
          >
            <X size={22} className="text-gray-600" />
          </button>
        </div>

        {/* メニューリスト */}
        <nav className="py-2">
          {menuItems.map((item) => (
            <div key={item.label}>
              {item.children ? (
                <>
                  <button
                    onClick={() => toggleItem(item.label)}
                    className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors text-left"
                  >
                    <span className="font-medium text-gray-700 text-[15px]">
                      {item.label}
                    </span>
                    {openItems.includes(item.label) ? (
                      <ChevronUp size={18} className="text-gray-400 flex-shrink-0" />
                    ) : (
                      <ChevronDown size={18} className="text-gray-400 flex-shrink-0" />
                    )}
                  </button>

                  {/* サブメニュー */}
                  {openItems.includes(item.label) && (
                    <div
                      className="border-l-2 ml-6 mb-1"
                      style={{ borderColor: "#5BAD52" }}
                    >
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={onClose}
                          className="flex items-center gap-2 px-4 py-3 text-sm text-gray-600 hover:text-felia-green hover:bg-green-50 transition-colors"
                        >
                          <span
                            className="w-1 h-1 rounded-full flex-shrink-0"
                            style={{ backgroundColor: "#5BAD52" }}
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
                  className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
                >
                  <span className="font-medium text-gray-700 text-[15px]">
                    {item.label}
                  </span>
                  <span className="text-gray-300 text-sm">›</span>
                </Link>
              )}

              {/* セパレーター */}
              <div
                className="mx-6 border-b"
                style={{ borderColor: "#F0F0F0" }}
              />
            </div>
          ))}
        </nav>

        {/* 下部CTA */}
        <div className="px-6 py-6 space-y-3">
          <Link
            href="/members/register"
            onClick={onClose}
            className="flex items-center justify-center w-full py-3 rounded text-white font-medium text-sm transition-colors"
            style={{ backgroundColor: "#5BAD52" }}
          >
            無料会員登録
          </Link>
          <Link
            href="/sell/valuation"
            onClick={onClose}
            className="flex items-center justify-center w-full py-3 rounded border font-medium text-sm transition-colors text-gray-700 hover:border-felia-green hover:text-felia-green"
            style={{ borderColor: "#E5E5E5" }}
          >
            無料売却査定
          </Link>
        </div>

        {/* 採用情報リンク（SPのみ） */}
        <div className="px-6 pb-8 tb:hidden">
          <Link
            href="/recruit"
            onClick={onClose}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            採用情報
          </Link>
        </div>
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
