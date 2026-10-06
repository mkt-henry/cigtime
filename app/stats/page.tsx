import { headers } from "next/headers";
import { SiteNav } from "@/components/common/SiteNav";
import { DauChart } from "@/components/stats/DauChart";
import { pickLang, t } from "@/lib/i18n";
import { pageMetadata } from "@/lib/site";

export async function generateMetadata() {
  const copy = t(pickLang((await headers()).get("accept-language")));
  return pageMetadata({ title: copy.statsTitle, description: copy.statsSubtitle, path: "/stats", noIndex: true });
}

export default async function StatsPage() {
  const copy = t(pickLang((await headers()).get("accept-language")));

  return (
    <>
      <SiteNav />
      <main className="mx-auto w-full max-w-4xl px-5 pb-24 pt-8 sm:px-8 sm:pt-14">
        <h1 className="font-display text-6xl font-black uppercase leading-[0.9] text-mist sm:text-7xl">
          {copy.statsTitle}
        </h1>
        <p className="mb-10 mt-5 text-lg leading-relaxed text-fog">{copy.statsSubtitle}</p>
        <DauChart />
      </main>
    </>
  );
}
