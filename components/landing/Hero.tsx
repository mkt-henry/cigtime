import { headers } from "next/headers";
import Link from "next/link";
import { LinkButton } from "@/components/common/Button";
import { ROOMS } from "@/lib/constants";
import { pickLang, t } from "@/lib/i18n";
import { sceneFor } from "@/lib/scenes";
import { HeroBackdrop } from "./HeroBackdrop";

export async function Hero() {
  const lang = pickLang((await headers()).get("accept-language"));
  const copy = t(lang);

  return (
    <main>
      <section className="relative flex min-h-[100svh] items-end overflow-hidden pb-16 pt-28 sm:pb-20">
        <HeroBackdrop />
        <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-10 px-5 sm:px-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <h1 className="fade-up font-display text-[clamp(4.5rem,15vw,11.5rem)] font-black uppercase leading-[0.86] tracking-[-0.01em] text-mist">
              {copy.heroTitle}
            </h1>
            <p
              className="fade-up mt-7 max-w-md text-lg leading-relaxed text-mist/80"
              style={{ animationDelay: "160ms" }}
            >
              {copy.heroLead}
            </p>
            <div className="fade-up mt-9 flex flex-wrap items-center gap-3" style={{ animationDelay: "300ms" }}>
              <LinkButton href="/rooms">{copy.heroCta}</LinkButton>
              <LinkButton href="/reactions" variant="ghost">
                {copy.heroReactions}
              </LinkButton>
            </div>
          </div>
          <figure
            className="fade-up hidden max-w-[17rem] rounded-2xl border border-white/10 bg-asphalt/55 px-5 py-4 text-[15px] leading-snug text-mist backdrop-blur-md lg:block"
            style={{ animationDelay: "700ms" }}
          >
            <figcaption className="text-xs text-fog">Quiet Signal</figcaption>
            <blockquote className="mt-1">{copy.heroThought}</blockquote>
            <p className="mt-3 flex gap-1.5 text-xs text-fog">
              <span className="rounded-full bg-sodium px-2 py-0.5 font-semibold text-asphalt">same 12</span>
              <span className="rounded-full bg-white/10 px-2 py-0.5">oof 4</span>
              <span className="rounded-full bg-white/10 px-2 py-0.5">hug 2</span>
            </p>
          </figure>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
        <h2 className="font-display text-4xl font-black uppercase leading-none text-mist sm:text-5xl">
          {copy.stepsTitle}
        </h2>
        <ol className="mt-12 grid gap-10 sm:grid-cols-3 sm:gap-8">
          {copy.steps.map((step, index) => (
            <li key={step.title}>
              <span className="font-display text-5xl font-black leading-none text-sodium">{index + 1}</span>
              <h3 className="mt-4 text-xl font-semibold text-mist">{step.title}</h3>
              <p className="mt-2 max-w-xs leading-relaxed text-fog">{step.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="pb-24">
        <h2 className="mx-auto max-w-6xl px-5 font-display text-4xl font-black uppercase leading-none text-mist sm:px-8 sm:text-5xl">
          {copy.spotsTitle}
        </h2>
        <ul className="mx-auto mt-10 flex max-w-6xl snap-x snap-mandatory scroll-px-5 gap-4 overflow-x-auto px-5 pb-4 sm:scroll-px-8 [scrollbar-width:none] sm:px-8">
          {ROOMS.map((room) => (
            <li className="w-[68vw] shrink-0 snap-start sm:w-64" key={room.slug}>
              <Link className="group block" href={`/room/${room.slug}`}>
                <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
                  <img
                    alt={sceneFor(room.slug).alt}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                    decoding="async"
                    loading="lazy"
                    src={sceneFor(room.slug).small}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-asphalt/90 via-asphalt/10 to-transparent" />
                  <span className="absolute inset-x-4 bottom-4 font-display text-3xl font-black uppercase leading-none text-mist">
                    {room.name}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-fog">
                  {lang === "es" ? room.descriptionEs : room.description}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
