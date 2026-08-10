import { headers } from "next/headers";
import { SiteNav } from "@/components/common/SiteNav";
import { DauChart } from "@/components/stats/DauChart";
import { pickLang, t } from "@/lib/i18n";

export default async function StatsPage() {
  const copy = t(pickLang((await headers()).get("accept-language")));

  return (
    <>
      <SiteNav />
      <main className="mx-auto w-full max-w-4xl px-4 pb-16 pt-10 sm:px-6">
        <h1 className="text-4xl font-black sm:text-5xl">{copy.statsTitle}</h1>
        <p className="mb-8 mt-4 text-lg text-neutral-600">{copy.statsSubtitle}</p>
        <DauChart />
      </main>
    </>
  );
}
