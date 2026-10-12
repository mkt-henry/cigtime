"use client";

import { useLang } from "@/hooks/useLang";
import { SiteNav } from "@/components/common/SiteNav";
import { DauChart } from "@/components/stats/DauChart";
import { t } from "@/lib/i18n";

export function StatsContent() {
  const copy = t(useLang());

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
