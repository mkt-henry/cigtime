import { SiteFooter } from "@/components/common/SiteFooter";
import { SiteNav } from "@/components/common/SiteNav";
import { Hero } from "@/components/landing/Hero";
import { t } from "@/lib/i18n";
import { SITE_URL } from "@/lib/site";

// Fail the build if request-only rendering is introduced into this static page.
export const dynamic = "error";

const STRUCTURED_DATA = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      name: "cigtime",
      url: SITE_URL,
      inLanguage: ["en", "es"],
      description: "An anonymous one-minute break room. Vent in one line, get a quiet reaction, and let it burn out. No sign-up.",
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
    {
      "@type": "FAQPage",
      mainEntity: t("en").faq.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a },
      })),
    },
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
