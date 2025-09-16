import type React from "react";
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/next";
import { AuthProvider } from "@/components/auth-provider";
import { Toaster } from "@/components/ui/toaster";
import { Suspense } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "픽동 - 우리 동네 축제 구독 서비스",
  description: "관심있는 동네를 고르면, 그 동네에서 열리는 축제를 픽해드려요",
  generator: "Next.js",
  keywords: ["축제", "동네 축제", "지역 축제", "구독 서비스", "픽동"],
  authors: [{ name: "픽동" }],
  creator: "픽동",
  publisher: "픽동",
  icons: {
    icon: "/pickdong-logo.png",
  },
  openGraph: {
    title: "픽동 - 우리 동네 축제 구독 서비스",
    description: "관심있는 동네를 고르면, 그 동네에서 열리는 축제를 픽해드려요",
    url: "https://pickdong.com",
    siteName: "픽동",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 600,
        alt: "픽동 서비스 미리보기",
      },
    ],
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "픽동 - 우리 동네 축제 구독 서비스",
    description: "관심있는 동네를 고르면, 그 동네에서 열리는 축제를 픽해드려요",
    images: ["/og-image.png"],
  },
  applicationName: "픽동",
  themeColor: "#c18200",
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Suspense fallback={null}>
          <AuthProvider>
            {children}
            <Toaster />
          </AuthProvider>
        </Suspense>
        <Analytics />
      </body>
    </html>
  );
}
