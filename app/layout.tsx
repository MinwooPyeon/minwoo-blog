import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: { default: "편민우 기술 블로그", template: "%s | 편민우" },
  description: "임베디드 · AI · 안드로이드 개발 기록",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <Header />
        <main style={{ paddingBottom: "4rem" }}>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
