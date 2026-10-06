import Link from "next/link";
import { headers } from "next/headers";
import { pickLang, t } from "@/lib/i18n";

export async function SiteNav({ overlay = false }: { overlay?: boolean }) {
  const copy = t(pickLang((await headers()).get("accept-language")));

  return (
    <header
      className={`z-20 mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-5 sm:px-8 ${
        overlay ? "absolute inset-x-0 top-0" : "relative"
      }`}
    >
      <Link href="/" className="font-display text-2xl font-black lowercase tracking-wide text-mist">
        cigtime
      </Link>
      <nav className="flex items-center gap-1 text-sm text-fog">
        <Link className="rounded-full px-3 py-2 transition hover:text-mist" href="/rooms">
          {copy.navRooms}
        </Link>
        <Link className="rounded-full px-3 py-2 transition hover:text-mist" href="/reactions">
          {copy.navReactions}
        </Link>
        <Link className="hidden rounded-full px-3 py-2 transition hover:text-mist sm:inline-block" href="/guidelines">
          {copy.navGuidelines}
        </Link>
      </nav>
    </header>
  );
}
