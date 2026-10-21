"use client";

import { useLang } from "@/hooks/useLang";
import { t } from "@/lib/i18n";

// The shared questions people ask before stepping into a room.
export function FaqSection({ className = "" }: { className?: string }) {
  const copy = t(useLang());

  return (
    <section className={`mx-auto max-w-6xl px-5 sm:px-8 ${className}`}>
      <h2 className="font-display text-4xl font-black uppercase leading-none text-mist sm:text-5xl">{copy.faqTitle}</h2>
      <dl className="mt-10 grid gap-x-12 gap-y-8 sm:grid-cols-2">
        {copy.faq.map((item) => (
          <div key={item.q}>
            <dt className="text-lg font-semibold text-mist">{item.q}</dt>
            <dd className="mt-2 max-w-md leading-relaxed text-fog">{item.a}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
