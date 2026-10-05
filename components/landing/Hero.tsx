import { ArrowRight, Cigarette, Clock3, Flame, Sparkles } from "lucide-react";
import type { ReactNode } from "react";
import { headers } from "next/headers";
import { LinkButton } from "@/components/common/Button";
import { RITUAL_OBJECTS, ROOMS } from "@/lib/constants";
import { pickLang, t } from "@/lib/i18n";
import { HeroBackdrop } from "./HeroBackdrop";

export async function Hero() {
  const copy = t(pickLang((await headers()).get("accept-language")));

  return (
    <main>
      <section className="relative min-h-[100svh] overflow-hidden bg-[#d8ddd3] px-4 pb-8 pt-24 sm:px-6 lg:pb-10">
        <HeroBackdrop />
        <div className="relative z-10 mx-auto flex min-h-[calc(100svh-8rem)] w-full max-w-6xl flex-col justify-between gap-12 pb-10 pt-2 lg:pt-8">
          <div className="max-w-2xl">
            <p className="fade-up mb-5 inline-flex items-center gap-2 rounded-md border border-white/30 bg-white/25 px-3 py-1 text-sm font-semibold text-white shadow-sm backdrop-blur-md">
              <Sparkles size={16} aria-hidden />
              {copy.heroBadge}
            </p>
            <h1 style={{ animationDelay: "120ms" }} className="fade-up text-6xl font-black leading-[0.9] tracking-normal text-white drop-shadow-[0_2px_24px_rgba(0,0,0,0.28)] sm:text-8xl">
              cigtime
            </h1>
            <p style={{ animationDelay: "260ms" }} className="fade-up mt-7 max-w-xl text-2xl font-semibold leading-tight text-white drop-shadow-[0_1px_18px_rgba(0,0,0,0.3)] sm:text-3xl">
              {copy.heroTaglineTop}
              <br />
              {copy.heroTaglineBottom}
            </p>
            <div style={{ animationDelay: "400ms" }} className="fade-up mt-8 flex flex-col gap-3 sm:flex-row">
              <LinkButton className="shadow-[0_14px_34px_rgba(0,0,0,0.2)]" href="/rooms">
                <Cigarette size={18} aria-hidden />
                {copy.heroCta}
              </LinkButton>
              <LinkButton
                className="border-white/45 bg-white/20 text-white backdrop-blur-md hover:border-white"
                href="/reactions"
                variant="secondary"
              >
                {copy.heroReactions}
                <ArrowRight size={18} aria-hidden />
              </LinkButton>
            </div>
          </div>

          <div style={{ animationDelay: "560ms" }} className="fade-up flex max-w-2xl flex-wrap gap-3 text-sm font-semibold text-white/85">
            <HeroMetric icon={<Clock3 size={16} aria-hidden />} label={copy.heroMetricRoom} />
            <HeroMetric icon={<Flame size={16} aria-hidden />} label={copy.heroMetricPrivate} />
            <HeroMetric className="hidden sm:inline-flex" icon={<Cigarette size={16} aria-hidden />} label={copy.heroMetricDrop} />
          </div>
        </div>
        <FloatingThought thought={copy.heroThought} />
      </section>

      <section className="border-y border-line bg-[#f5f5f2]/90 px-4 py-8 sm:px-6">
        <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-2">
          <Preview title={copy.heroObjects} items={RITUAL_OBJECTS.map((object) => object.name)} />
          <Preview title={copy.heroRooms} items={ROOMS.map((room) => room.name)} />
        </div>
      </section>
    </main>
  );
}

function HeroMetric({ className = "", icon, label }: { className?: string; icon: ReactNode; label: string }) {
  return (
    <span className={`inline-flex items-center gap-2 rounded-md border border-white/20 bg-black/20 px-3 py-2 shadow-sm backdrop-blur-md ${className}`}>
      {icon}
      {label}
    </span>
  );
}

function Preview({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h2 className="text-sm font-black uppercase text-neutral-500">{title}</h2>
      <p className="mt-3 flex flex-wrap gap-x-3 gap-y-2 text-lg font-semibold text-ink">
        {items.map((item) => (
          <span key={item}>{item}</span>
        ))}
      </p>
    </div>
  );
}

function FloatingThought({ thought }: { thought: string }) {
  return (
    <div className="float-slow pointer-events-none absolute right-[7%] top-[22%] z-10 hidden max-w-[18rem] rounded-xl border border-white/15 bg-black/35 px-5 py-3 text-sm font-medium leading-6 text-white shadow-2xl backdrop-blur-md sm:block">
      {thought}
      <p className="mt-2 text-xs font-bold text-white/55">same 12 / oof 4 / hug 2</p>
    </div>
  );
}
