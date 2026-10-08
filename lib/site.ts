import type { Metadata } from "next";

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://cigtime.com";

// Public tracking IDs (they ship in the page anyway). Empty means the tag is not loaded.
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID ?? "G-9X8W8TMLYX";
export const CLARITY_PROJECT_ID = process.env.NEXT_PUBLIC_CLARITY_ID ?? "ytps1pqext";
export const GOOGLE_SITE_VERIFICATION = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ?? "FOQK9FvOSDeYHt5-V2kiEOlHFA6uK6OExrzHwcIPUmE";
export const BING_SITE_VERIFICATION = process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION ?? "DD5E0C4A6898114F2203365933B47589";

// Title, description, canonical URL and social card text for one page.
export function pageMetadata({
  description,
  noIndex = false,
  path,
  title,
}: {
  description: string;
  noIndex?: boolean;
  path: string;
  title: string;
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    // Nested pages that set openGraph lose the root file-based image, so point at it explicitly.
    openGraph: { title, description, url: path, siteName: "cigtime", type: "website", images: "/opengraph-image" },
    twitter: { card: "summary_large_image", title, description, images: "/opengraph-image" },
    ...(noIndex ? { robots: { index: false, follow: true } } : {}),
  };
}
