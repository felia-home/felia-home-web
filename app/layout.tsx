// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: {
    default: "フェリアホーム | 東京の不動産売買・物件情報",
    template: "%s | フェリアホーム",
  },
  description:
    "フェリアホームは東京都内の不動産売買仲介会社です。厳選された戸建て・マンション・土地情報を多数ご紹介。売却査定・無料会員登録も受付中。",
  keywords: ["不動産", "東京", "売買", "物件", "マンション", "戸建て", "土地", "フェリアホーム"],
  openGraph: {
    type: "website",
    locale: "ja_JP",
    url: "https://index.felia-home.co.jp",
    siteName: "フェリアホーム",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body style={{ backgroundColor: "#ffffff", margin: 0, padding: 0 }}>
        <Providers>
          <Header />
          <main>{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
