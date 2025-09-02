import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Providers } from "@/components/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LinkShield - URL Security & Content Intelligence",
  description: "One-Click Link Safety Reports. Protect your visitors and your reputation with AI-powered URL analysis and content intelligence.",
  keywords: ["LinkShield", "URL security", "content analysis", "AI", "safety", "verification"],
  authors: [{ name: "LinkShield Team" }],
  openGraph: {
    title: "LinkShield - URL Security & Content Intelligence",
    description: "One-Click Link Safety Reports with AI-powered analysis",
    url: "https://linkshield.app",
    siteName: "LinkShield",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "LinkShield - URL Security & Content Intelligence",
    description: "One-Click Link Safety Reports with AI-powered analysis",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
