import Link from "next/link";
import { headers } from "next/headers";
import { SiteFooter } from "@/components/common/SiteFooter";
import { SiteNav } from "@/components/common/SiteNav";
import { ROOMS } from "@/lib/constants";
import { pickLang, t } from "@/lib/i18n";
import { sceneFor } from "@/lib/scenes";

export default async function RoomsPage() {
  const lang = pickLang((await headers()).get("accept-language"));
  const copy = t(lang);

  return (
    <>
      <SiteNav />
      <main className="mx-auto max-w-6xl px-5 pb-24 pt-8 sm:px-8 sm:pt-14">
        <h1 className="font-display text-[clamp(3rem,9vw,6.5rem)] font-black uppercase leading-[0.88] text-mist">
          {copy.roomsTitle}
        </h1>
        <p className="mt-5 max-w-md text-lg leading-relaxed text-fog">{copy.roomsSubtitle}</p>
        <ul className="mt-12 grid gap-3">
          {ROOMS.map((room) => (
            <li key={room.slug}>
              <Link
                className="group relative flex h-36 items-end overflow-hidden rounded-2xl sm:h-44"
                href={`/room/${room.slug}`}
              >
                <img
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
                  decoding="async"
                  src={sceneFor(room.slug).small}
                />
                <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(22,28,36,0.92)_0%,rgba(22,28,36,0.55)_45%,rgba(22,28,36,0.1)_100%)]" />
                <div aria-hidden className="pointer-events-none absolute inset-0 rounded-2xl border border-white/10" />
                <div className="relative flex w-full items-end justify-between gap-4 p-5 sm:p-7">
                  <div>
                    <span className="flex items-center gap-3 font-display text-4xl font-black uppercase leading-none text-mist sm:text-5xl">
                      {room.name}
                      {room.isSilent ? (
                        <span className="rounded-full border border-white/25 px-2.5 py-0.5 font-sans text-xs font-medium normal-case text-fog">
                          {copy.roomsSilentTag}
                        </span>
                      ) : null}
                    </span>
                    <span className="mt-2 block text-sm text-fog sm:text-base">
                      {lang === "es" ? room.descriptionEs : room.description}
                    </span>
                  </div>
                  <span className="hidden shrink-0 rounded-full bg-sodium px-5 py-2.5 text-sm font-semibold text-asphalt opacity-0 transition group-hover:opacity-100 group-focus-visible:opacity-100 sm:block">
                    {copy.heroCta}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </main>
      <SiteFooter />
    </>
  );
}
