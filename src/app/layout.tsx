import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";
import { Analytics } from "@/components/ui/Analytics";
import { ChatAssistant } from "@/components/ui/ChatAssistant";
import { ScrollNav } from "@/components/ui/ScrollNav";
import { seoConfig } from "./metadata";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: seoConfig.metadataBase,
  title: {
    default: seoConfig.title.default,
    template: seoConfig.title.template,
  },
  description: seoConfig.description,
  keywords: seoConfig.keywords,
  authors: seoConfig.authors,
  creator: seoConfig.creator,
  publisher: seoConfig.publisher,
  formatDetection: seoConfig.formatDetection,
  icons: {
    icon: [
      { url: '/neolifelogo.png' },
      { url: '/icon.png' },
    ],
    apple: [
      { url: '/neolifelogo.png' },
    ],
    shortcut: '/neolifelogo.png',
  },
  openGraph: seoConfig.openGraph,
  twitter: seoConfig.twitter,
  robots: seoConfig.robots,
  verification: seoConfig.verification,
};

import { LanguageProvider } from "@/lib/i18n/LanguageContext";
import { SelectionProvider } from "@/lib/context/SelectionContext";
import { FloatingSelectionBar } from "@/components/ui/FloatingSelectionBar";

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <LanguageProvider>
          <SelectionProvider>
            <Analytics />
            <Header />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
            <ScrollNav />
            <ChatAssistant />
            <FloatingSelectionBar />
          </SelectionProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
