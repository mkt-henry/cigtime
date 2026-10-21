import Link from "next/link";
import { LinkButton } from "@/components/common/Button";
import { SiteFooter } from "@/components/common/SiteFooter";
import { SiteNav } from "@/components/common/SiteNav";
import { GUIDES, guidePath, type Guide } from "@/lib/guides";
import { sceneFor } from "@/lib/scenes";
import { SITE_URL } from "@/lib/site";

export function GuidePage({ guide }: { guide: Guide }) {
  const scene = sceneFor(guide.roomSlug);
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "FAQPage",
        mainEntity: guide.faq.map(({ q, a }) => ({
          "@type": "Question",
          name: q,
          acceptedAnswer: { "@type": "Answer", text: a },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: new URL("/", SITE_URL).href },
          {
            "@type": "ListItem",
            position: 2,
            name: guide.title,
            item: new URL(guidePath(guide.slug), SITE_URL).href,
          },
        ],
      },
    ],
  };

  return (
    <>
      <SiteNav />
      <main lang="en" className="mx-auto max-w-2xl px-5 pb-24 pt-8 sm:px-8 sm:pt-14">
        <article>
          <h1 className="font-display text-6xl font-black uppercase leading-[0.9] text-mist sm:text-7xl">
            {guide.h1}
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-mist/85">{guide.intro}</p>
          <LinkButton href={guide.cta.href} className="mt-6">
            {guide.cta.label}
          </LinkButton>
          <img
            src={scene.small}
            alt={scene.alt}
            width={900}
            height={507}
            className="mt-8 h-auto w-full rounded-2xl"
          />
          <div className="mt-14 space-y-10">
            {guide.sections.map((section) => (
              <section key={section.heading}>
                <h2 className="text-xl font-semibold text-mist">{section.heading}</h2>
                <div className="mt-3 space-y-3 leading-relaxed text-fog">
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </section>
            ))}
            {guide.slug === "vent-anonymously" && (
              <p className="leading-relaxed text-fog">
                For a smaller complaint, try{" "}
                <Link href="/room/tiny-rants" className="text-sodium underline underline-offset-4 hover:text-mist">
                  Tiny Rants
                </Link>.
              </p>
            )}
            {guide.prompts && (
              <section>
                <h2 className="text-xl font-semibold text-mist">A few prompts for your unsent line</h2>
                <ul className="mt-3 list-disc space-y-2.5 pl-5 leading-relaxed text-fog">
                  {guide.prompts.map((prompt) => <li key={prompt}>{prompt}</li>)}
                </ul>
              </section>
            )}
            <section aria-labelledby="guide-faq">
              <h2 id="guide-faq" className="text-xl font-semibold text-mist">Frequently asked questions</h2>
              <div className="mt-5 space-y-6">
                {guide.faq.map(({ q, a }) => (
                  <div key={q}>
                    <h3 className="font-semibold text-mist">{q}</h3>
                    <p className="mt-2 leading-relaxed text-fog">{a}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
          <LinkButton href={guide.cta.href} className="mt-10">
            {guide.cta.label}
          </LinkButton>
        </article>
        <nav aria-labelledby="more-guides" className="mt-14 border-t border-white/10 pt-8">
          <h2 id="more-guides" className="text-xl font-semibold text-mist">More ways to take a minute</h2>
          <ul className="mt-3 space-y-3 leading-relaxed">
            {GUIDES.filter((other) => other.slug !== guide.slug).map((other) => (
              <li key={other.slug}>
                <Link href={guidePath(other.slug)} className="text-sodium underline underline-offset-4 hover:text-mist">
                  {other.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </main>
      <SiteFooter />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
      />
    </>
  );
}
