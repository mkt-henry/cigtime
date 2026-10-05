"use client";

import { useRef } from "react";
import { depth, useParallax } from "@/hooks/useParallax";

// The landing skyline. Layers drift against the pointer at different depths, a few
// windows flicker, and the rooftop vent breathes out slow puffs of smoke.
export function HeroBackdrop() {
  const rootRef = useRef<HTMLDivElement>(null);
  useParallax(rootRef);

  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden" ref={rootRef}>
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#7faebf_0%,#d7a979_52%,#4e5b58_100%)]" />
      <div className="absolute -inset-x-6 inset-y-0" style={depth(6)}>
        <div className="absolute right-[10%] top-[14%] h-20 w-20 rounded-full bg-ember shadow-[0_0_90px_rgba(242,166,90,0.78)] sm:right-[34%] sm:top-[17%] sm:h-24 sm:w-24" />
        <div className="cloud-drift absolute left-0 top-[24%] h-12 w-72 rounded-full bg-white/25 blur-2xl" />
        <div className="cloud-drift absolute left-0 top-[38%] h-10 w-96 rounded-full bg-white/20 blur-2xl [animation-delay:-45s] [animation-duration:120s]" />
      </div>
      <div className="absolute -inset-x-8 bottom-[6.7rem] h-40" style={depth(14)}>
        {Array.from({ length: 9 }, (_, index) => (
          <HeroBuilding key={index} index={index} />
        ))}
      </div>
      <div className="absolute -inset-x-10 inset-y-0" style={depth(24)}>
        <div className="absolute inset-x-0 bottom-0 h-36 bg-[#202726]" />
        <div className="absolute inset-x-0 bottom-36 h-5 bg-[#3a4640]" />
        <div className="absolute bottom-36 left-16 h-16 w-32 rounded-t-sm bg-[#2b3532]" />
        <div className="absolute bottom-40 right-14 h-11 w-40 rounded-t-sm bg-[#303a37]" />
        {[0, 1, 2, 3].map((index) => (
          <span
            className="vent-puff absolute bottom-52 left-[6.5rem] h-10 w-10 rounded-full bg-white/30 blur-xl"
            key={index}
            style={{ animationDelay: `${index * 1.75}s` }}
          />
        ))}
      </div>
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(12,18,18,0.36)_0%,rgba(12,18,18,0.12)_46%,rgba(12,18,18,0.08)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 h-72 bg-[linear-gradient(0deg,rgba(10,12,12,0.5)_0%,rgba(10,12,12,0)_100%)]" />
    </div>
  );
}

function HeroBuilding({ index }: { index: number }) {
  const heights = [108, 152, 126, 172, 132, 160, 118, 144, 124];
  const widths = [13, 15, 12, 15, 14, 16, 12, 15, 14];
  const left = index * 12 - 4;

  return (
    <div
      className="absolute bottom-0 bg-[#1f2a2d]"
      style={{ height: `${heights[index]}px`, left: `${left}%`, width: `${widths[index]}%` }}
    >
      {Array.from({ length: 9 }, (_, lightIndex) => {
        const lit = (lightIndex + index) % 3 === 0;
        return (
          <span
            className={`absolute h-2 w-2 rounded-[1px] bg-[#f4b66d] ${lit && lightIndex % 2 === 0 ? "window-flicker" : ""}`}
            key={lightIndex}
            style={
              {
                "--lit": lit ? 0.78 : 0.24,
                animationDelay: `${(index * 1.3 + lightIndex * 0.9) % 6}s`,
                left: `${18 + (lightIndex % 3) * 25}%`,
                opacity: lit ? 0.78 : 0.24,
                top: `${18 + Math.floor(lightIndex / 3) * 24}px`,
              } as React.CSSProperties
            }
          />
        );
      })}
    </div>
  );
}
