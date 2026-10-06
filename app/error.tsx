"use client";

import { Button } from "@/components/common/Button";
import { useLang } from "@/hooks/useLang";
import { t } from "@/lib/i18n";

export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  const copy = t(useLang());

  return (
    <main className="mx-auto grid min-h-screen max-w-3xl place-items-center px-4 text-center sm:px-6">
      <div>
        <h1 className="text-4xl font-black">{copy.errorTitle}</h1>
        <p className="mt-3 text-base text-neutral-600">{copy.errorBody}</p>
        <Button className="mt-8" onClick={reset} type="button">
          {copy.retry}
        </Button>
      </div>
    </main>
  );
}
