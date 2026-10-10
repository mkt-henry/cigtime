"use client";

import { useRef } from "react";
import { depth, useParallax } from "@/hooks/useParallax";
import { HERO_ALT } from "@/lib/scenes";

// The rooftop photo drifts a little against the pointer so the page feels like a place.
export function HeroBackdrop() {
  const rootRef = useRef<HTMLDivElement>(null);
  useParallax(rootRef);

  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden" ref={rootRef}>
      <div className="absolute -inset-6" style={depth(12)}>
        <picture>
          <source media="(max-width: 700px)" srcSet="/scenes/hero-sm.webp" />
          <img
            alt={HERO_ALT}
            className="h-full w-full object-cover object-[30%_center]"
            decoding="async"
            fetchPriority="high"
            src="/scenes/hero.webp"
          />
        </picture>
      </div>
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(22,28,36,0.55)_0%,rgba(22,28,36,0)_30%,rgba(22,28,36,0.25)_60%,#161c24_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(22,28,36,0.7)_0%,rgba(22,28,36,0)_60%)]" />
    </div>
  );
}
