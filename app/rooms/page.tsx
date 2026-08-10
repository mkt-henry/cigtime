import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { headers } from "next/headers";
import { SiteNav } from "@/components/common/SiteNav";
import { ROOMS } from "@/lib/constants";
import { pickLang, t } from "@/lib/i18n";

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
          {ROOMS.map((room) => (
            <li key={room.slug}>
              <Link
                className="flex items-center justify-between gap-4 rounded-md border border-line bg-white px-5 py-4 transition hover:border-ink"
                href={`/room/${room.slug}`}
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
                <ArrowRight aria-hidden className="shrink-0 text-neutral-400" size={20} />
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </>
  );
}
