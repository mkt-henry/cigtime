import { headers } from "next/headers";
import { SiteNav } from "@/components/common/SiteNav";
import { pickLang } from "@/lib/i18n";
import { legalCopy, type LegalPageKey } from "@/lib/legal";

export async function LegalPage({ page }: { page: LegalPageKey }) {
  const copy = legalCopy(pickLang((await headers()).get("accept-language")), page);

  return (
    <>
      <SiteNav />
      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <h1 className="text-4xl font-black">{copy.title}</h1>
        <p className="mt-4 text-lg leading-7 text-neutral-700">{copy.intro}</p>
        <div className="mt-10 space-y-8">
          {copy.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="text-lg font-black">{section.heading}</h2>
              <ul className="mt-3 space-y-2 text-base leading-7 text-neutral-700">
                {section.body.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </main>
    </>
  );
}
