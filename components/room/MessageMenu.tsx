"use client";

import { Flag } from "lucide-react";
import { useState } from "react";
import { REPORT_REASONS, type ReportReason } from "@/lib/constants";
import { t, type Lang } from "@/lib/i18n";

export function MessageMenu({
  lang,
  onMute,
  onReport,
}: {
  lang: Lang;
  onMute: () => void;
  onReport: (reason: ReportReason) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const copy = t(lang);

  return (
    <div className="absolute right-1.5 top-1.5">
      <button
        aria-label={copy.reportOrMute}
        className="rounded p-1 text-white/30 transition hover:bg-white/10 hover:text-white/70"
        onClick={() => setIsOpen((open) => !open)}
        type="button"
      >
        <Flag aria-hidden size={11} />
      </button>
      {isOpen ? (
        <div className="absolute right-0 top-6 z-10 w-40 overflow-hidden rounded-md border border-white/15 bg-neutral-900/95 py-1 text-[11px] font-semibold text-white/75 shadow-xl backdrop-blur">
          {REPORT_REASONS.map((reason: ReportReason) => (
            <button
              className="block w-full px-3 py-1.5 text-left transition hover:bg-white/10 hover:text-white"
              key={reason}
              onClick={() => {
                setIsOpen(false);
                onReport(reason);
              }}
              type="button"
            >
              {copy.reason[reason]}
            </button>
          ))}
          <button
            className="block w-full border-t border-white/10 px-3 py-1.5 text-left text-rust transition hover:bg-white/10"
            onClick={() => {
              setIsOpen(false);
              onMute();
            }}
            type="button"
          >
            {copy.muteUser}
          </button>
        </div>
      ) : null}
    </div>
  );
}
