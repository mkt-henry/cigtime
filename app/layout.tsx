import type { Metadata } from "next";
import { headers } from "next/headers";
import { Geist, Geist_Mono } from "next/font/google";
import { pickLang, t } from "@/lib/i18n";
import { SITE_URL } from "@/lib/site";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { AnalyticsTracker } from "@/components/common/AnalyticsTracker";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const copy = t(pickLang((await headers()).get("accept-language")));

  return {
    metadataBase: new URL(SITE_URL),
    title: "cigtime",
    description: copy.metaDescription,
    openGraph: {
      title: "cigtime",
      description: copy.metaDescription,
      siteName: "cigtime",
      type: "website",
      url: SITE_URL,
    },
    twitter: {
      card: "summary_large_image",
      title: "cigtime",
      description: copy.metaDescription,
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const lang = pickLang((await headers()).get("accept-language"));

  return (
    <html className={`${geistSans.variable} ${geistMono.variable}`} lang={lang}>
      <body>
        <AnalyticsTracker />
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
