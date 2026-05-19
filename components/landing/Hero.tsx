import { ArrowRight, Cigarette, Clock3, Flame, Sparkles } from "lucide-react";
import type { ReactNode } from "react";
import { LinkButton } from "@/components/common/Button";
import { RITUAL_OBJECTS, ROOMS } from "@/lib/constants";

export function Hero() {
  return (
    <main>
      <section className="relative min-h-[calc(100vh-84px)] overflow-hidden bg-[#d8ddd3] px-4 pb-8 pt-8 sm:px-6 lg:pb-10">
        <RooftopBackdrop />
        <div className="relative z-10 mx-auto flex min-h-[calc(100vh-132px)] w-full max-w-6xl flex-col justify-between gap-12 pb-10 pt-2 lg:pt-8">
          <div className="max-w-2xl">
            <p className="mb-5 inline-flex items-center gap-2 rounded-md border border-white/30 bg-white/25 px-3 py-1 text-sm font-semibold text-white shadow-sm backdrop-blur-md">
              <Sparkles size={16} aria-hidden />
              3 minute anonymous room
            </p>
            <h1 className="text-6xl font-black leading-[0.9] tracking-normal text-white drop-shadow-[0_2px_24px_rgba(0,0,0,0.28)] sm:text-8xl">
              cigtime
            </h1>
            <p className="mt-7 max-w-xl text-2xl font-semibold leading-tight text-white drop-shadow-[0_1px_18px_rgba(0,0,0,0.3)] sm:text-3xl">
              Take your cigtime.
              <br />
              A place to let it out.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <LinkButton className="shadow-[0_14px_34px_rgba(0,0,0,0.2)]" href="/room/rooftop">
                <Cigarette size={18} aria-hidden />
                Let it out
              </LinkButton>
              <LinkButton
                className="border-white/45 bg-white/20 text-white backdrop-blur-md hover:border-white"
                href="/rooms"
                variant="secondary"
              >
                Choose room
                <ArrowRight size={18} aria-hidden />
              </LinkButton>
            </div>
          </div>

          <div className="flex max-w-2xl flex-wrap gap-3 text-sm font-semibold text-white/85">
            <HeroMetric icon={<Clock3 size={16} aria-hidden />} label="03:00 room" />
            <HeroMetric icon={<Flame size={16} aria-hidden />} label="private by default" />
            <HeroMetric className="hidden sm:inline-flex" icon={<Cigarette size={16} aria-hidden />} label="drop it and leave" />
          </div>
        </div>
        <FloatingThought />
      </section>

      <section className="border-y border-line bg-[#f5f5f2]/90 px-4 py-8 sm:px-6">
        <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-2">
          <Preview title="Objects" items={RITUAL_OBJECTS.map((object) => object.name)} />
          <Preview title="Rooms" items={ROOMS.map((room) => room.name)} />
        </div>
      </section>
    </main>
  );
}

function RooftopBackdrop() {
  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#7faebf_0%,#d7a979_52%,#4e5b58_100%)]" />
      <div className="absolute left-[14%] top-[17%] h-24 w-24 rounded-full bg-ember shadow-[0_0_90px_rgba(242,166,90,0.78)]" />
      <div className="absolute inset-x-0 bottom-[6.7rem] h-40">
        {Array.from({ length: 9 }, (_, index) => (
          <HeroBuilding key={index} index={index} />
        ))}
      </div>
      <div className="absolute inset-x-0 bottom-0 h-36 bg-[#202726]" />
      <div className="absolute inset-x-0 bottom-36 h-5 bg-[#3a4640]" />
      <div className="absolute bottom-36 left-8 h-16 w-32 rounded-t-sm bg-[#2b3532]" />
      <div className="absolute bottom-40 right-6 h-11 w-40 rounded-t-sm bg-[#303a37]" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(12,18,18,0.36)_0%,rgba(12,18,18,0.12)_46%,rgba(12,18,18,0.08)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 h-72 bg-[linear-gradient(0deg,rgba(10,12,12,0.5)_0%,rgba(10,12,12,0)_100%)]" />
    </div>
  );
}

function HeroBuilding({ index }: { index: number }) {
  const heights = [108, 152, 126, 172, 132, 160, 118, 144, 124];
  const widths = [13, 15, 12, 15, 14, 16, 12, 15, 14];
  const left = index * 12 - 4;

  return (
    <div
      className="absolute bottom-0 bg-[#1f2a2d]"
      style={{ height: `${heights[index]}px`, left: `${left}%`, width: `${widths[index]}%` }}
    >
      {Array.from({ length: 9 }, (_, lightIndex) => (
        <span
          className="absolute h-2 w-2 rounded-[1px] bg-[#f4b66d]"
          key={lightIndex}
          style={{
            left: `${18 + (lightIndex % 3) * 25}%`,
            opacity: (lightIndex + index) % 3 === 0 ? 0.78 : 0.24,
            top: `${18 + Math.floor(lightIndex / 3) * 24}px`,
          }}
        />
      ))}
    </div>
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

function FloatingThought() {
  return (
    <div className="float-slow pointer-events-none absolute right-[7%] top-[22%] z-10 hidden max-w-[18rem] rounded-xl border border-white/15 bg-black/35 px-5 py-3 text-sm font-medium leading-6 text-white shadow-2xl backdrop-blur-md sm:block">
      I just need one quiet minute today.
      <p className="mt-2 text-xs font-bold text-white/55">same 12 / oof 4 / hug 2</p>
    </div>
  );
}
