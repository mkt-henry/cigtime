import Link from "next/link";
import { headers } from "next/headers";
import { pickLang, t } from "@/lib/i18n";

export async function SiteNav() {
  const copy = t(pickLang((await headers()).get("accept-language")));

  return (
    <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-5 sm:px-6">
      <Link href="/" className="text-lg font-black tracking-normal">
        cigtime
      </Link>
      <nav className="flex items-center gap-1 text-sm font-medium text-neutral-700">
        <Link className="rounded-md px-3 py-2 hover:bg-white/70" href="/rooms">
          {copy.navRooms}
        </Link>
        <Link className="rounded-md px-3 py-2 hover:bg-white/70" href="/reactions">
          {copy.navReactions}
        </Link>
        <Link className="rounded-md px-3 py-2 hover:bg-white/70" href="/guidelines">
          {copy.navGuidelines}
        </Link>
      </nav>
    </header>
  );
}
