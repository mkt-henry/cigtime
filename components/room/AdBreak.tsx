"use client";

import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Button } from "@/components/common/Button";
import { AD_BREAK_SECONDS, type Ad, type AdPlacement } from "@/lib/ads";
import { t, type Lang } from "@/lib/i18n";

// A short ad that has to play out before "Take another" or "Leave lighter" goes through.
export function AdBreak({
  ad,
  lang,
  onAdClick,
  onDone,
  placement,
}: {
  ad: Ad;
  lang: Lang;
  onAdClick: (ad: Ad, placement: AdPlacement) => void;
  onDone: () => void;
  placement: AdPlacement;
}) {
  const copy = t(lang);
  const adCopy = ad.copy[lang];
  const [secondsLeft, setSecondsLeft] = useState(AD_BREAK_SECONDS);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const id = window.setTimeout(() => setSecondsLeft((value) => value - 1), 1000);
    return () => window.clearTimeout(id);
  }, [secondsLeft]);

  const ready = secondsLeft <= 0;
  const progress = (AD_BREAK_SECONDS - secondsLeft) / AD_BREAK_SECONDS;

  return (
    <motion.section
      animate={{ opacity: 1 }}
      aria-label={copy.adLabel}
      className="fixed inset-0 z-50 grid place-items-center bg-asphalt/80 px-4 backdrop-blur-md"
      initial={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-slate/95 shadow-soft"
        initial={{ opacity: 0, y: 20 }}
        transition={{ type: "spring", stiffness: 160, damping: 20 }}
      >
        <div className="h-1 w-full bg-white/10">
          <motion.div
            animate={{ width: `${progress * 100}%` }}
            className="h-full bg-sodium"
            initial={false}
            transition={{ duration: 1, ease: "linear" }}
          />
        </div>
        <div className="p-8">
          <div className="flex items-center justify-between text-xs uppercase tracking-[0.18em] text-fog/80">
            <span>{adCopy.eyebrow}</span>
            <span className="rounded-full border border-white/15 px-2 py-0.5 tracking-normal">{copy.adLabel}</span>
          </div>
          <h2 className="mt-5 font-display text-4xl font-black leading-[0.95] text-mist">{adCopy.headline}</h2>
          <p className="mt-4 text-fog">{adCopy.body}</p>
          <a
            className="mt-6 inline-flex items-center gap-1.5 font-semibold text-sodium transition hover:text-mist"
            href={ad.url}
            onClick={() => onAdClick(ad, placement)}
            rel="noopener noreferrer sponsored"
            target="_blank"
          >
            {adCopy.cta}
            <ArrowUpRight size={16} aria-hidden />
          </a>
          <Button
            className="mt-8 w-full tabular-nums"
            disabled={!ready}
            onClick={onDone}
            type="button"
            variant={ready ? "primary" : "secondary"}
          >
            {ready ? copy.adContinue : copy.adContinueIn(secondsLeft)}
          </Button>
        </div>
      </motion.div>
    </motion.section>
  );
}
