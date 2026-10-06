import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import { Big_Shoulders, Instrument_Sans } from "next/font/google";
import { pickLang, t } from "@/lib/i18n";
import { BING_SITE_VERIFICATION, GOOGLE_SITE_VERIFICATION, SITE_URL } from "@/lib/site";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { AnalyticsTracker } from "@/components/common/AnalyticsTracker";
import { ThirdPartyAnalytics } from "@/components/common/ThirdPartyAnalytics";
import "./globals.css";

// Condensed signage lettering for headlines, a plain humanist sans for everything you read.
const display = Big_Shoulders({
  variable: "--font-display",
  subsets: ["latin", "latin-ext"],
  weight: ["700", "900"],
});

const body = Instrument_Sans({
  variable: "--font-body",
  subsets: ["latin", "latin-ext"],
});

export const viewport: Viewport = {
  themeColor: "#161c24",
  viewportFit: "cover",
};

export async function generateMetadata(): Promise<Metadata> {
  const copy = t(pickLang((await headers()).get("accept-language")));

  return {
    metadataBase: new URL(SITE_URL),
    title: { default: copy.metaTitle, template: "%s | cigtime" },
    description: copy.metaDescription,
    applicationName: "cigtime",
    alternates: { canonical: "/" },
    openGraph: {
      title: copy.metaTitle,
      description: copy.metaDescription,
      siteName: "cigtime",
      type: "website",
      url: "/",
      locale: copy === t("es") ? "es_ES" : "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: copy.metaTitle,
      description: copy.metaDescription,
    },
    verification: {
      google: GOOGLE_SITE_VERIFICATION || undefined,
      other: BING_SITE_VERIFICATION ? { "msvalidate.01": BING_SITE_VERIFICATION } : undefined,
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
    <html className={`${display.variable} ${body.variable}`} lang={lang}>
      <body>
        <AnalyticsTracker />
        {children}
        <Analytics />
        <SpeedInsights />
        <ThirdPartyAnalytics />
      </body>
    </html>
  );
}
