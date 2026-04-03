import type { Metadata } from "next";
import { Noto_Serif_JP, Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Providers } from "./providers";

const notoSerif = Noto_Serif_JP({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-serif",
  display: "swap",
});

const notoSans = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://felia-home.co.jp"),
  title: {
    default: "フェリアホーム｜東京都心・城南・城西の不動産",
    template: "%s｜フェリアホーム",
  },
  description:
    "東京都心・城南・城西エリアの不動産売買ならフェリアホーム。目黒区・世田谷区・渋谷区・品川区・港区の土地・戸建・マンションを豊富にご紹介。未公開物件も多数。",
  keywords: "不動産,東京,目黒区,世田谷区,渋谷区,土地,戸建,マンション,フェリアホーム",
  openGraph: {
    type: "website",
    locale: "ja_JP",
    url: "https://felia-home.co.jp",
    siteName: "フェリアホーム",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" className={`${notoSerif.variable} ${notoSans.variable}`}>
      <body className="font-sans bg-[#fafaf8] text-[#1c1b18] antialiased">
        <Providers>
          <Header />
          <main>{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
