import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { headers } from "next/headers";
import { SiteNav } from "@/components/common/SiteNav";
import { ROOMS } from "@/lib/constants";
import { pickLang, t } from "@/lib/i18n";

// A small accent per room so the list reads as places, not a settings menu.
const ACCENTS: Record<string, string> = {
  rooftop: "#d7a979",
  "let-it-out": "#a94722",
  "unsent-replies": "#7faebf",
  "tiny-rants": "#f2a65a",
  silent: "#9a9890",
};

export default async function RoomsPage() {
  const acceptLanguage = (await headers()).get("accept-language");
  const lang = pickLang(acceptLanguage);
  const copy = t(lang);

  return (
    <>
      <SiteNav />
      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <h1 className="text-4xl font-black">{copy.roomsTitle}</h1>
        <p className="mt-3 text-base text-neutral-600">{copy.roomsSubtitle}</p>
        <ul className="mt-8 space-y-3">
          {ROOMS.map((room, index) => (
            <li className="fade-up" key={room.slug} style={{ animationDelay: `${index * 60}ms` }}>
              <Link
                className="group flex items-center justify-between gap-4 rounded-md border border-line border-l-4 bg-white px-5 py-4 transition hover:-translate-y-0.5 hover:border-ink hover:shadow-soft"
                href={`/room/${room.slug}`}
                style={{ borderLeftColor: ACCENTS[room.slug] }}
              >
                <span>
                  <span className="block text-lg font-black">
                    {room.name}
                    {room.isSilent ? (
                      <span className="ml-2 rounded bg-neutral-100 px-2 py-0.5 text-[11px] font-bold uppercase text-neutral-500">
                        {copy.roomsSilentTag}
                      </span>
                    ) : null}
                  </span>
                  <span className="mt-1 block text-sm text-neutral-600">
                    {lang === "es" ? room.descriptionEs : room.description}
                  </span>
                </span>
                <ArrowRight aria-hidden className="shrink-0 text-neutral-400 transition group-hover:translate-x-1 group-hover:text-ink" size={20} />
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </>
  );
}
