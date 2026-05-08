import { ArrowRight } from "lucide-react";
import { LinkButton } from "@/components/common/Button";
import { SiteNav } from "@/components/common/SiteNav";
import { ROOMS } from "@/lib/constants";

export default function RoomsPage() {
  return (
    <>
      <SiteNav />
      <main className="mx-auto w-full max-w-6xl px-4 pb-16 pt-10 sm:px-6">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-black tracking-normal sm:text-5xl">
            Where are you taking your cigtime?
          </h1>
          <p className="mt-4 text-lg leading-7 text-neutral-700">
            Pick a room, choose a ritual object, and keep it to three minutes.
          </p>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {ROOMS.map((room) => (
            <article
              className="rounded-lg border border-line bg-white/80 p-6 shadow-sm transition hover:border-ink"
              key={room.slug}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black">{room.name}</h2>
                  <p className="mt-3 text-neutral-700">{room.description}</p>
                </div>
                {room.isSilent ? (
                  <span className="rounded-md bg-neutral-100 px-2 py-1 text-xs font-bold text-neutral-600">
                    silent
                  </span>
                ) : null}
              </div>
              <LinkButton className="mt-7" href={`/room/${room.slug}`} variant="secondary">
                Enter
                <ArrowRight size={18} aria-hidden />
              </LinkButton>
            </article>
          ))}
        </div>
      </main>
    </>
  );
}
