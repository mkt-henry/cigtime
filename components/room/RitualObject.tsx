"use client";

import { useEffect, useRef, useState } from "react";
import type { RitualObject as RitualObjectType } from "@/lib/types";
import { SmokerPerspectiveCigarette } from "@/components/common/SmokerPerspectiveCigarette";
import { depth, useParallax } from "@/hooks/useParallax";

export function RitualObject({
  backgroundImage,
  fullscreen,
  isAccelerating,
  object,
  onFilterHoldEnd,
  onFilterHoldStart,
  progress,
  roomSlug,
}: {
  backgroundImage?: string | null;
  fullscreen?: boolean;
  isAccelerating?: boolean;
  object: RitualObjectType;
  onFilterHoldEnd?: () => void;
  onFilterHoldStart?: () => void;
  progress: number;
  roomSlug: string;
}) {
  const pct = Math.min(1, Math.max(0, progress));

  return (
    <div
      className={
        fullscreen
          ? "relative flex h-full w-full items-center justify-center overflow-hidden bg-[#ecece6]"
          : "relative mx-auto flex h-[360px] w-full items-center justify-center overflow-hidden rounded-lg border border-line bg-[#ecece6]"
      }
    >
      {backgroundImage ? <CustomRoomBackground imageUrl={backgroundImage} /> : null}
      {!backgroundImage && roomSlug === "rooftop" ? <RooftopView /> : null}
      {!fullscreen && (
        <>
          <div
            className={`absolute inset-x-8 top-6 z-20 flex items-center justify-between gap-4 text-sm font-bold ${
              backgroundImage ? "text-white drop-shadow-[0_1px_5px_rgba(0,0,0,0.55)]" : "text-neutral-700"
            }`}
          >
            <span>{object.name}</span>
            <span>{object.tone}</span>
          </div>
          <div className="absolute bottom-0 left-0 z-30 h-1 bg-moss transition-all" style={{ width: `${pct * 100}%` }} />
        </>
      )}
      <ObjectVisual
        isAccelerating={isAccelerating}
        objectKey={object.key}
        onFilterHoldEnd={onFilterHoldEnd}
        onFilterHoldStart={onFilterHoldStart}
        progress={pct}
      />
    </div>
  );
}

function CustomRoomBackground({ imageUrl }: { imageUrl: string }) {
  return (
    <>
      <div
        aria-hidden
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${imageUrl})` }}
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(180deg,rgba(11,16,20,0.12)_0%,rgba(11,16,20,0.18)_48%,rgba(11,16,20,0.42)_100%)]"
      />
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/30 to-transparent" />
    </>
  );
}

function ObjectVisual({
  isAccelerating,
  objectKey,
  onFilterHoldEnd,
  onFilterHoldStart,
  progress,
}: {
  isAccelerating?: boolean;
  objectKey: string;
  onFilterHoldEnd?: () => void;
  onFilterHoldStart?: () => void;
  progress: number;
}) {
  if (objectKey === "candy") {
    // The candy itself shrinks while the wrapper stays put.
    const scale = 1 - progress * 0.72;
    return (
      <div className="float-slow relative h-32 w-56">
        <div
          className="absolute left-9 top-10 h-14 w-36 origin-center rounded-full bg-rust shadow-soft transition-transform duration-700"
          style={{ transform: `scale(${scale})` }}
        />
        <div className="absolute left-0 top-12 h-10 w-14 rotate-[-18deg] rounded-md bg-white" />
        <div className="absolute right-0 top-12 h-10 w-14 rotate-[18deg] rounded-md bg-white" />
      </div>
    );
  }

  if (objectKey === "incense") {
    // The stick burns down from the top and leaves ash behind it.
    const stickWidth = Math.max(6, 112 * (1 - progress));
    const ashWidth = Math.min(46, progress * 60);
    return (
      <div className="relative h-48 w-48">
        <div
          className="smoke-thread absolute left-24 top-4 h-32 w-10 rounded-full border-l-2 border-moss/45"
          style={{ opacity: 0.4 + progress * 0.5 }}
        />
        <div className="absolute bottom-10 left-16 flex rotate-[-24deg] items-center">
          <div className="h-2 rounded-l-full bg-ink transition-all duration-700" style={{ width: `${stickWidth}px` }} />
          <div
            className="relative h-2 rounded-r-full bg-neutral-400 transition-all duration-700"
            style={{ width: `${ashWidth}px` }}
          >
            <span data-ember="0.7" className="absolute right-[-4px] top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-ember shadow-[0_0_10px_rgba(242,166,90,0.7)]" />
          </div>
        </div>
        <div className="absolute bottom-5 left-10 h-3 w-36 rounded-full bg-neutral-300" />
      </div>
    );
  }

  if (objectKey === "coffee") {
    // The cup empties and the steam thins out with it.
    const liquidHeight = Math.max(0, 56 * (1 - progress));
    const steamOpacity = Math.max(0, 1 - progress * 1.2);
    return (
      <div className="relative h-48 w-48">
        <div
          className="smoke-thread absolute left-16 top-2 h-28 w-8 rounded-full border-l-2 border-neutral-500/40"
          style={{ opacity: steamOpacity }}
        />
        <div
          data-ember="0.45"
          className="smoke-thread absolute left-24 top-8 h-24 w-8 rounded-full border-r-2 border-moss/35 [animation-delay:1.2s]"
          style={{ opacity: steamOpacity }}
        />
        <div className="absolute bottom-10 left-10 h-24 w-28 overflow-hidden rounded-b-3xl rounded-t-md border-4 border-ink bg-white">
          <div
            className="absolute inset-x-0 bottom-0 bg-rust transition-all duration-700"
            style={{ height: `${liquidHeight}px` }}
          />
        </div>
        <div className="absolute bottom-20 right-4 h-12 w-12 rounded-full border-4 border-ink" />
      </div>
    );
  }

  if (objectKey === "candle") {
    // Wax melts down and the flame gets smaller with it.
    const waxHeight = Math.max(10, 112 * (1 - progress * 0.78));
    const flameScale = 1 - progress * 0.55;
    return (
      <div className="relative h-48 w-48">
        <div
          data-ember="0.25"
          className="pulse-soft absolute left-[86px] h-10 w-5 origin-bottom rounded-full bg-ember shadow-[0_0_28px_rgba(242,166,90,0.6)] transition-all duration-700"
          style={{ bottom: `${34 + waxHeight}px`, transform: `scale(${flameScale})` }}
        />
        <div className="absolute left-[94px] h-3 w-[3px] bg-neutral-600" style={{ bottom: `${32 + waxHeight}px` }} />
        <div
          className="absolute bottom-8 left-[74px] w-12 rounded-sm border border-line bg-white shadow-soft transition-all duration-700"
          style={{ height: `${waxHeight}px` }}
        />
      </div>
    );
  }

  return (
    <SmokerPerspectiveCigarette
      isAccelerating={isAccelerating}
      onFilterHoldEnd={onFilterHoldEnd}
      onFilterHoldStart={onFilterHoldStart}
      progress={progress}
    />
  );
}

function RooftopView() {
  const rootRef = useRef<HTMLDivElement>(null);
  useParallax(rootRef);
  const progress = useTimeOfDayProgress();
  const dusk = Math.min(1, progress * 1.25);
  const night = Math.max(0, (progress - 0.55) / 0.45);
  const sunTop = 46 + progress * 108;
  const moonOpacity = Math.max(0, (progress - 0.45) / 0.4);
  const lightOpacity = 0.2 + night * 0.8;
  const sky = `linear-gradient(180deg, ${mixRgb([128, 184, 205], [23, 28, 42], dusk)} 0%, ${mixRgb(
    [242, 188, 126],
    [63, 45, 72],
    dusk,
  )} 58%, ${mixRgb([80, 92, 90], [18, 22, 29], night)} 100%)`;

  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden ref={rootRef}>
      <div className="absolute inset-0 transition-colors duration-700" style={{ background: sky }} />
      <div className="absolute -inset-x-6 inset-y-0" style={depth(4)}>
        <div className="absolute inset-0 transition-opacity duration-700" style={{ opacity: night }}>
          {STARS.map((star, index) => (
            <span
              className="star absolute rounded-full bg-white"
              key={index}
              style={{
                animationDelay: `${star.delay}s`,
                height: star.size,
                left: `${star.x}%`,
                top: `${star.y}%`,
                width: star.size,
              }}
            />
          ))}
        </div>
        <div
          className="absolute left-[18%] h-16 w-16 rounded-full bg-ember shadow-[0_0_55px_rgba(242,166,90,0.75)] transition-all duration-700"
          style={{ top: `${sunTop}px`, opacity: Math.max(0, 1 - progress * 1.4) }}
        />
        <div
          className="absolute right-[18%] top-12 h-14 w-14 rounded-full bg-white shadow-[0_0_45px_rgba(255,255,255,0.75)] transition-opacity duration-700"
          style={{ opacity: moonOpacity }}
        />
        <div className="cloud-drift absolute left-0 top-[16%] h-10 w-56 rounded-full bg-white/25 blur-2xl" style={{ opacity: 1 - night * 0.7 }} />
        <div className="cloud-drift absolute left-0 top-[26%] h-8 w-72 rounded-full bg-white/20 blur-2xl [animation-delay:-40s] [animation-duration:110s]" style={{ opacity: 1 - night * 0.7 }} />
      </div>
      <div className="absolute -inset-x-8 inset-y-0" style={depth(10)}>
        <div className="absolute inset-x-0 bottom-20 h-28">
          {Array.from({ length: 9 }, (_, index) => (
            <Building key={index} index={index} lightOpacity={lightOpacity} />
          ))}
        </div>
      </div>
      <div className="absolute -inset-x-10 inset-y-0" style={depth(18)}>
        <div className="absolute inset-x-0 bottom-0 h-24 bg-[#202625]" />
        <div className="absolute inset-x-0 bottom-20 h-4 bg-[#39413d]" />
        <div className="absolute bottom-20 left-14 h-16 w-28 rounded-t-md bg-[#2b3332]" />
        <div className="absolute bottom-24 right-16 h-10 w-36 rounded-t-md bg-[#2f3836]" />
        <div className="absolute bottom-7 left-1/2 h-3 w-[72%] -translate-x-1/2 rounded-full bg-black/30 blur-sm" />
      </div>
    </div>
  );
}

// Fixed pseudo-random positions so server and client render the same sky.
const STARS = Array.from({ length: 28 }, (_, index) => ({
  delay: (index * 0.37) % 4,
  size: index % 5 === 0 ? 3 : 2,
  x: (index * 37 + 11) % 100,
  y: (index * 53 + 7) % 46,
}));

function useTimeOfDayProgress() {
  const [progress, setProgress] = useState(getTimeOfDayProgress);

  useEffect(() => {
    const timerId = window.setInterval(() => {
      setProgress(getTimeOfDayProgress());
    }, 60_000);

    return () => window.clearInterval(timerId);
  }, []);

  return progress;
}

function getTimeOfDayProgress() {
  const now = new Date();
  const minutes = now.getHours() * 60 + now.getMinutes();
  const dawnStart = 5 * 60;
  const dayStart = 7 * 60;
  const sunsetStart = 17 * 60;
  const nightStart = 20 * 60 + 30;

  if (minutes < dawnStart) return 1;
  if (minutes < dayStart) return 1 - (minutes - dawnStart) / (dayStart - dawnStart);
  if (minutes < sunsetStart) return 0;
  if (minutes < nightStart) return (minutes - sunsetStart) / (nightStart - sunsetStart);
  return 1;
}

function Building({ index, lightOpacity }: { index: number; lightOpacity: number }) {
  const heights = [92, 132, 108, 152, 116, 142, 98, 126, 104];
  const widths = [13, 16, 12, 15, 14, 17, 12, 15, 13];
  const left = index * 12 - 3;

  return (
    <div
      className="absolute bottom-0 bg-[#1c2427]"
      style={{
        height: `${heights[index]}px`,
        left: `${left}%`,
        width: `${widths[index]}%`,
      }}
    >
      {Array.from({ length: 8 }, (_, lightIndex) => (
        <span
          className="absolute h-2 w-2 rounded-[1px] bg-ember"
          key={lightIndex}
          style={{
            left: `${18 + (lightIndex % 3) * 24}%`,
            opacity: (lightIndex + index) % 3 === 0 ? lightOpacity : lightOpacity * 0.45,
            top: `${16 + Math.floor(lightIndex / 3) * 22}px`,
          }}
        />
      ))}
    </div>
  );
}

function mixRgb(from: [number, number, number], to: [number, number, number], amount: number) {
  const pct = Math.min(1, Math.max(0, amount));
  const [r, g, b] = from.map((value, index) => Math.round(value + (to[index] - value) * pct));
  return `rgb(${r}, ${g}, ${b})`;
}
