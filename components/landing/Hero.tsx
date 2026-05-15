import { ArrowRight, Cigarette, Coffee, Flame, Sparkles } from "lucide-react";
import { LinkButton } from "@/components/common/Button";
import { RITUAL_OBJECTS, ROOMS } from "@/lib/constants";

export function Hero() {
  return (
    <main>
      <section className="relative min-h-[calc(100vh-84px)] overflow-hidden px-4 pb-14 pt-10 sm:px-6">
        <div className="absolute inset-x-0 top-16 mx-auto h-[36rem] max-w-6xl rounded-[48%] border border-line/70 bg-white/30 blur-3xl" />
        <div className="relative mx-auto grid min-h-[70vh] w-full max-w-6xl items-center gap-10 lg:grid-cols-[1fr_0.9fr]">
          <div className="max-w-2xl">
            <p className="mb-5 inline-flex items-center gap-2 rounded-md border border-line bg-white/70 px-3 py-1 text-sm font-semibold text-moss">
              <Sparkles size={16} aria-hidden />
              3 minute anonymous room
            </p>
            <h1 className="text-5xl font-black leading-[0.95] tracking-normal text-ink sm:text-7xl">
              cigtime
            </h1>
            <p className="mt-7 text-2xl font-semibold leading-tight text-neutral-800 sm:text-3xl">
              Take your cigtime.
              <br />
              A place to let it out.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <LinkButton href="/room/rooftop">
                <Cigarette size={18} aria-hidden />
                Let it out
              </LinkButton>
              <LinkButton href="/rooms" variant="secondary">
                Choose room
                <ArrowRight size={18} aria-hidden />
              </LinkButton>
            </div>
            <p className="mt-8 max-w-lg text-base leading-7 text-neutral-700">
              Choose your ritual. Drop a thought. Leave lighter.
            </p>
          </div>

          <div className="relative min-h-[420px] overflow-hidden rounded-lg border border-line bg-[#ecece6] shadow-soft">
            <div className="absolute inset-x-8 top-8 flex items-center justify-between text-sm font-semibold text-neutral-600">
              <span>The Rooftop</span>
              <span>218 online</span>
            </div>
            <div className="absolute left-1/2 top-[48%] h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/80 bg-white/45" />
            <div className="absolute left-1/2 top-[48%] -translate-x-1/2 -translate-y-1/2">
              <RitualScene />
            </div>
            <div className="absolute bottom-5 left-5 right-5 rounded-md border border-line bg-white/85 p-4 shadow-sm">
              <p className="text-sm font-bold text-neutral-600">Tired Pigeon</p>
              <p className="mt-1 text-base text-ink">I just need one quiet minute today.</p>
              <p className="mt-3 text-sm font-semibold text-moss">same 12 · oof 4 · hug 2</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-white/70 px-4 py-8 sm:px-6">
        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2">
          <Preview title="Objects" items={RITUAL_OBJECTS.map((object) => object.name)} />
          <Preview title="Rooms" items={ROOMS.map((room) => room.name)} />
        </div>
      </section>
    </main>
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

function RitualScene() {
  return (
    <div className="relative h-60 w-60">
      <div className="smoke-thread absolute left-[60%] top-8 h-24 w-8 rounded-full border-l-2 border-moss/40" />
      <div className="smoke-thread absolute left-[67%] top-12 h-28 w-8 rounded-full border-r-2 border-rust/35 [animation-delay:1s]" />
      <div className="smoke-thread absolute left-[63%] top-6 h-20 w-10 rounded-full border-l-2 border-neutral-500/30 [animation-delay:1.8s]" />
      <div className="float-slow absolute bottom-[5.4rem] left-1/2 flex h-11 -translate-x-1/2 rotate-[-90deg] items-center">
        <div className="h-11 w-20 rounded-[5px] border border-[#5f412d] bg-[linear-gradient(180deg,#84502f,#d69a63,#9a603b)]" />
        <div className="h-11 w-40 border-y border-[#d5d0bf] bg-[linear-gradient(180deg,#f0eadb,#fffdf3,#d5cbb6)]" />
        <div className="relative h-11 w-14 rounded-r-sm border border-neutral-700 bg-[linear-gradient(180deg,#5f5d56,#d2d0c6,#56544d)]">
          <div className="absolute right-[-9px] top-1/2 h-7 w-7 -translate-y-1/2 rounded-full bg-ember shadow-[0_0_22px_rgba(242,166,90,0.92)]" />
        </div>
      </div>
      <Coffee className="absolute bottom-4 left-7 text-moss" size={34} aria-hidden />
      <Flame className="pulse-soft absolute bottom-7 right-10 text-rust" size={36} aria-hidden />
    </div>
  );
}
