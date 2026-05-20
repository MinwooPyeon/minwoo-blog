import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ThemeScript from "@/components/ThemeScript";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://minwoo-blog.vercel.app";

export const metadata: Metadata = {
  title: { default: "편민우 기술 블로그", template: "%s | 편민우" },
  description: "임베디드 · AI · 안드로이드 개발 기록",
  metadataBase: new URL(BASE_URL),
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: "편민우 기술 블로그",
    title: "편민우 기술 블로그",
    description: "임베디드 · AI · 안드로이드 개발 기록",
  },
  twitter: {
    card: "summary",
    title: "편민우 기술 블로그",
    description: "임베디드 · AI · 안드로이드 개발 기록",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <ThemeScript />
        <Header />
        <main style={{ paddingBottom: "4rem" }}>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
