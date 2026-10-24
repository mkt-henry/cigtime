import { SITE_URL } from "@/lib/site";

// Last real content change per page group, used for sitemap lastmod and Article dates.
export const CONTENT_DATES = {
  guides: { published: "2026-10-21", modified: "2026-10-24" },
  legal: { published: "2026-08-10", modified: "2026-10-22" },
  rooms: { published: "2026-05-08", modified: "2026-10-24" },
  site: { published: "2026-05-08", modified: "2026-10-24" },
} as const;

export const ORGANIZATION_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

export const ORGANIZATION = {
  "@type": "Organization",
  "@id": ORGANIZATION_ID,
  name: "cigtime",
  url: SITE_URL,
  logo: `${SITE_URL}/icon.svg`,
};

export function absoluteUrl(path: string) {
  return new URL(path, SITE_URL).href;
}

// Home > ... > current page. Each crumb is [name, path].
export function breadcrumb(crumbs: Array<[string, string]>) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: [["Home", "/"] as [string, string], ...crumbs].map(([name, path], index) => ({
      "@type": "ListItem",
      position: index + 1,
      name,
      item: absoluteUrl(path),
    })),
  };
}

export function webPage({ path, name, description }: { path: string; name: string; description: string }) {
  return {
    "@type": "WebPage",
    "@id": `${absoluteUrl(path)}#webpage`,
    url: absoluteUrl(path),
    name,
    description,
    inLanguage: "en",
    isPartOf: { "@id": WEBSITE_ID },
    publisher: { "@id": ORGANIZATION_ID },
  };
}

// A written page (guide or policy) with the fields search engines need to cite it.
export function article({
  path,
  headline,
  description,
  dates,
}: {
  path: string;
  headline: string;
  description: string;
  dates: { published: string; modified: string };
}) {
  return {
    "@type": "Article",
    "@id": `${absoluteUrl(path)}#article`,
    mainEntityOfPage: absoluteUrl(path),
    headline,
    description,
    inLanguage: "en",
    datePublished: dates.published,
    dateModified: dates.modified,
    image: absoluteUrl("/opengraph-image"),
    author: { "@type": "Organization", name: "cigtime", url: SITE_URL },
    publisher: ORGANIZATION,
  };
}

export function jsonLd(graph: object[]) {
  // Escape "<" so page text can never close the script tag early.
  return JSON.stringify({ "@context": "https://schema.org", "@graph": graph }).replace(/</g, "\\u003c");
}
