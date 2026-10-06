"use client";

import { Button } from "@/components/common/Button";
import { useLang } from "@/hooks/useLang";
import { t } from "@/lib/i18n";

export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  const copy = t(useLang());

  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center px-5 sm:px-8">
      <h1 className="font-display text-7xl font-black uppercase leading-[0.9] text-mist">{copy.errorTitle}</h1>
      <p className="mt-5 text-lg text-fog">{copy.errorBody}</p>
      <Button className="mt-10 self-start" onClick={reset} type="button">
        {copy.retry}
      </Button>
    </main>
  );
}
