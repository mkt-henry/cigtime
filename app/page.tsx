import { SiteFooter } from "@/components/common/SiteFooter";
import { SiteNav } from "@/components/common/SiteNav";
import { Hero } from "@/components/landing/Hero";
import { SITE_URL } from "@/lib/site";

const STRUCTURED_DATA = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      name: "cigtime",
      url: SITE_URL,
      inLanguage: ["en", "es"],
      description: "An anonymous one-minute online break room. Say one line, get a quiet reaction, head back lighter.",
    },
    {
      "@type": "WebApplication",
      name: "cigtime",
      url: SITE_URL,
      applicationCategory: "LifestyleApplication",
      operatingSystem: "Any",
      browserRequirements: "Requires a modern web browser",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    },
    { "@type": "Organization", name: "cigtime", url: SITE_URL, logo: `${SITE_URL}/icon.svg` },
  ],
};

export default function HomePage() {
  return (
    <div className="relative">
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(STRUCTURED_DATA) }}
        type="application/ld+json"
      />
      <SiteNav overlay />
      <Hero />
      <SiteFooter />
    </div>
  );
}
