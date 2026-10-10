"use client";

import { useRef } from "react";
import type { RitualObject as RitualObjectType } from "@/lib/types";
import { SmokerPerspectiveCigarette } from "@/components/common/SmokerPerspectiveCigarette";
import { depth, useParallax } from "@/hooks/useParallax";
import { sceneFor } from "@/lib/scenes";

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
          ? "relative flex h-full w-full items-center justify-center overflow-hidden bg-asphalt"
          : "relative mx-auto flex h-[360px] w-full items-center justify-center overflow-hidden rounded-2xl bg-asphalt"
      }
    >
      {backgroundImage ? <CustomRoomBackground imageUrl={backgroundImage} /> : <SceneBackdrop roomSlug={roomSlug} />}
      {!fullscreen && (
        <>
          <div
            className={`absolute inset-x-8 top-6 z-20 flex items-center justify-between gap-4 text-sm font-bold ${
              "text-mist drop-shadow-[0_1px_5px_rgba(0,0,0,0.55)]"
            }`}
          >
            <span>{object.name}</span>
            <span>{object.tone}</span>
          </div>
          <div className="absolute bottom-0 left-0 z-30 h-1 bg-sodium transition-all" style={{ width: `${pct * 100}%` }} />
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
          className="absolute left-9 top-10 h-14 w-36 origin-center rounded-full bg-ember shadow-soft transition-transform duration-700"
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
          className="smoke-thread absolute left-24 top-4 h-32 w-10 rounded-full border-l-2 border-mist/40"
          style={{ opacity: 0.4 + progress * 0.5 }}
        />
        <div className="absolute bottom-10 left-16 flex rotate-[-24deg] items-center">
          <div className="h-2 rounded-l-full bg-[#7a5a3f] transition-all duration-700" style={{ width: `${stickWidth}px` }} />
          <div
            className="relative h-2 rounded-r-full bg-[#9a968c] transition-all duration-700"
            style={{ width: `${ashWidth}px` }}
          >
            <span data-ember="0.7" className="absolute right-[-4px] top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-ember shadow-[0_0_10px_rgba(242,166,90,0.7)]" />
          </div>
        </div>
        <div className="absolute bottom-5 left-10 h-3 w-36 rounded-full bg-white/20" />
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
          className="smoke-thread absolute left-16 top-2 h-28 w-8 rounded-full border-l-2 border-mist/40"
          style={{ opacity: steamOpacity }}
        />
        <div
          data-ember="0.45"
          className="smoke-thread absolute left-24 top-8 h-24 w-8 rounded-full border-r-2 border-mist/30 [animation-delay:1.2s]"
          style={{ opacity: steamOpacity }}
        />
        <div className="absolute bottom-10 left-10 h-24 w-28 overflow-hidden rounded-b-3xl rounded-t-md border-4 border-mist/80 bg-white/90">
          <div
            className="absolute inset-x-0 bottom-0 bg-[#6b3f22] transition-all duration-700"
            style={{ height: `${liquidHeight}px` }}
          />
        </div>
        <div className="absolute bottom-20 right-4 h-12 w-12 rounded-full border-4 border-mist/80" />
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
          className="pulse-soft absolute left-[86px] h-10 w-5 origin-bottom rounded-full bg-sodium shadow-[0_0_28px_rgba(242,162,60,0.6)] transition-all duration-700"
          style={{ bottom: `${34 + waxHeight}px`, transform: `scale(${flameScale})` }}
        />
        <div className="absolute left-[94px] h-3 w-[3px] bg-[#3a3a3a]" style={{ bottom: `${32 + waxHeight}px` }} />
        <div
          className="absolute bottom-8 left-[74px] w-12 rounded-sm bg-[#efe9dc] shadow-soft transition-all duration-700"
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

// The room's photograph, drifting slightly against the pointer, with a vignette that
// keeps the centre object and the floating thoughts readable.
function SceneBackdrop({ roomSlug }: { roomSlug: string }) {
  const rootRef = useRef<HTMLDivElement>(null);
  useParallax(rootRef);
  const scene = sceneFor(roomSlug);

  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden" ref={rootRef}>
      <div className="absolute -inset-6" style={depth(14)}>
        <picture>
          <source media="(max-width: 700px)" srcSet={scene.small} />
          <img alt={scene.alt} className="h-full w-full object-cover" decoding="async" fetchPriority="high" src={scene.large} />
        </picture>
      </div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(22,28,36,0.15)_0%,rgba(22,28,36,0.55)_70%,rgba(22,28,36,0.85)_100%)]" />
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-asphalt/70 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-asphalt/80 to-transparent" />
    </div>
  );
}
