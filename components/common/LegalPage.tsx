"use client";

import { useLang } from "@/hooks/useLang";
import { SiteFooter } from "@/components/common/SiteFooter";
import { SiteNav } from "@/components/common/SiteNav";
import { legalCopy, type LegalPageKey } from "@/lib/legal";

export function LegalPage({ page }: { page: LegalPageKey }) {
  const copy = legalCopy(useLang(), page);

  return (
    <>
      <SiteNav />
      <main className="mx-auto max-w-2xl px-5 pb-24 pt-8 sm:px-8 sm:pt-14">
        <h1 className="font-display text-6xl font-black uppercase leading-[0.9] text-mist sm:text-7xl">{copy.title}</h1>
        <p className="mt-6 text-lg leading-relaxed text-mist/85">{copy.intro}</p>
        <div className="mt-14 space-y-10">
          {copy.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="text-xl font-semibold text-mist">{section.heading}</h2>
              <ul className="mt-3 space-y-2.5 leading-relaxed text-fog">
                {section.body.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
