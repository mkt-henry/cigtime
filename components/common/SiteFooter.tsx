import Link from "next/link";
import { headers } from "next/headers";
import { pickLang, t } from "@/lib/i18n";

export async function SiteFooter() {
  const copy = t(pickLang((await headers()).get("accept-language")));

  return (
    <footer className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-4 border-t border-white/10 px-5 py-8 text-sm text-fog sm:px-8">
      <span className="font-display text-lg font-black lowercase tracking-wide text-mist">cigtime</span>
      <nav className="flex gap-5">
        <Link className="transition hover:text-mist" href="/guidelines">
          {copy.navGuidelines}
        </Link>
        <Link className="transition hover:text-mist" href="/privacy">
          {copy.navPrivacy}
        </Link>
        <Link className="transition hover:text-mist" href="/terms">
          {copy.navTerms}
        </Link>
      </nav>
    </footer>
  );
}
