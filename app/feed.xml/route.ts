import { GUIDES, guidePath } from "@/lib/guides";
import { t } from "@/lib/i18n";
import { SITE_URL } from "@/lib/site";
import { CONTENT_DATES } from "@/lib/structuredData";

export const dynamic = "force-static";

function escape(text: string) {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

// RSS 2.0 feed of the guide pages, the site's only written articles.
export function GET() {
  const copy = t("en");
  const published = new Date(CONTENT_DATES.guides.published).toUTCString();
  const items = GUIDES.map((guide) => {
    const url = `${SITE_URL}${guidePath(guide.slug)}`;
    return [
      "    <item>",
      `      <title>${escape(guide.title)}</title>`,
      `      <link>${url}</link>`,
      `      <guid isPermaLink="true">${url}</guid>`,
      `      <description>${escape(guide.description)}</description>`,
      `      <pubDate>${published}</pubDate>`,
      "    </item>",
    ].join("\n");
  });

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    "  <channel>",
    "    <title>cigtime guides</title>",
    `    <link>${SITE_URL}</link>`,
    `    <description>${escape(copy.metaDescription)}</description>`,
    "    <language>en</language>",
    `    <lastBuildDate>${new Date(CONTENT_DATES.guides.modified).toUTCString()}</lastBuildDate>`,
    `    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />`,
    ...items,
    "  </channel>",
    "</rss>",
    "",
  ].join("\n");

  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
