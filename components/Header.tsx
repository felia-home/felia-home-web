"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/properties", label: "物件検索" },
  { href: "/feature/felia", label: "弊社限定物件" },
  { href: "/service", label: "サービス" },
  { href: "/company", label: "会社案内" },
  { href: "/staff", label: "スタッフ" },
  { href: "/news", label: "お知らせ" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu on route change
  useEffect(() => { setMenuOpen(false); }, [pathname]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white shadow-md py-3" : "bg-transparent py-5"
      }`}
    >
      <div className="container-xl flex items-center justify-between">
        {/* ロゴ */}
        <Link href="/" className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
            scrolled ? "bg-[#1a3a2a]" : "bg-white/20"
          }`}>
            <span className="font-serif text-lg font-bold text-white">F</span>
          </div>
          <div className="flex flex-col">
            <span
              className={`text-lg font-serif font-bold tracking-[0.1em] transition-colors ${
                scrolled ? "text-[#1a3a2a]" : "text-white"
              }`}
            >
              Felia Home
            </span>
            <span
              className={`text-[9px] tracking-[0.25em] uppercase transition-colors ${
                scrolled ? "text-[#706e68]" : "text-white/60"
              }`}
            >
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
                scrolled ? "text-[#1c1b18]" : "text-white"
              } ${pathname === item.href ? "text-[#c9a96e]" : ""}`}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/contact"
            className="bg-[#c9a96e] text-white text-sm px-5 py-2.5 rounded-full tracking-wide hover:bg-[#b8935a] transition-colors"
          >
            無料相談
          </Link>
        </nav>

        {/* SP ハンバーガー */}
        <button
          className="lg:hidden p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="メニュー"
        >
          <span
            className={`block w-6 h-0.5 mb-1.5 transition-all ${
              scrolled ? "bg-[#1c1b18]" : "bg-white"
            }`}
          />
          <span
            className={`block w-6 h-0.5 mb-1.5 transition-all ${
              scrolled ? "bg-[#1c1b18]" : "bg-white"
            }`}
          />
          <span
            className={`block w-6 h-0.5 transition-all ${
              scrolled ? "bg-[#1c1b18]" : "bg-white"
            }`}
          />
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
            >
              {item.label}
            </Link>
          ))}
          <div className="p-4">
            <Link
              href="/contact"
              className="block text-center bg-[#c9a96e] text-white py-3 rounded-full text-sm font-bold"
            >
              無料相談
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
