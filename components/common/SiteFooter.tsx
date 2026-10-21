"use client";

import Link from "next/link";
import { useLang } from "@/hooks/useLang";
import { GUIDES, guidePath } from "@/lib/guides";
import { t } from "@/lib/i18n";

export function SiteFooter() {
  const copy = t(useLang());

  return (
    <footer className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-4 border-t border-white/10 px-5 py-8 text-sm text-fog sm:px-8">
      <span className="font-display text-lg font-black lowercase tracking-wide text-mist">cigtime</span>
      <nav className="-my-3 flex flex-wrap gap-x-5">
        <Link className="py-3 transition hover:text-mist" href="/guidelines">
          {copy.navGuidelines}
        </Link>
        <Link className="py-3 transition hover:text-mist" href="/privacy">
          {copy.navPrivacy}
        </Link>
        <Link className="py-3 transition hover:text-mist" href="/terms">
          {copy.navTerms}
        </Link>
        <a
          className="py-3 text-sodium transition hover:text-mist"
          href="https://buymeacoffee.com/bpark0718z"
          rel="noopener noreferrer"
          target="_blank"
        >
          {copy.navCoffee}
        </a>
      </nav>
      {/* Guide pages are English-only, so their titles stay untranslated. */}
      <nav aria-label="Guides" className="-my-3 flex w-full flex-wrap gap-x-5">
        {GUIDES.map((guide) => (
          <Link key={guide.slug} className="py-3 transition hover:text-mist" href={guidePath(guide.slug)}>
            {guide.title}
          </Link>
        ))}
      </nav>
    </footer>
  );
}
