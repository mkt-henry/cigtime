import type { RitualObject as RitualObjectType } from "@/lib/types";
import { SmokerPerspectiveCigarette } from "./SmokerPerspectiveCigarette";

export function RitualObject({
  backgroundImage,
  isAccelerating,
  object,
  onFilterHoldEnd,
  onFilterHoldStart,
  progress,
  roomSlug,
}: {
  backgroundImage?: string | null;
  isAccelerating?: boolean;
  object: RitualObjectType;
  onFilterHoldEnd?: () => void;
  onFilterHoldStart?: () => void;
  progress: number;
  roomSlug: string;
}) {
  const pct = Math.min(1, Math.max(0, progress));

  return (
    <div className="relative mx-auto flex h-[360px] w-full items-center justify-center overflow-hidden rounded-lg border border-line bg-[#ecece6]">
      {backgroundImage ? <CustomRoomBackground imageUrl={backgroundImage} /> : null}
      {!backgroundImage && roomSlug === "rooftop" ? <RooftopView progress={pct} /> : null}
      <div
        className={`absolute inset-x-8 top-6 z-20 flex items-center justify-between gap-4 text-sm font-bold ${
          backgroundImage ? "text-white drop-shadow-[0_1px_5px_rgba(0,0,0,0.55)]" : "text-neutral-700"
        }`}
      >
        <span>{object.name}</span>
        <span>{object.tone}</span>
      </div>
      <div className="absolute bottom-0 left-0 z-30 h-1 bg-moss transition-all" style={{ width: `${pct * 100}%` }} />
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
  const fade = 1 - progress * 0.6;

  if (objectKey === "candy") {
    return (
      <div className="float-slow relative h-32 w-56" style={{ opacity: fade }}>
        <div className="absolute left-9 top-10 h-14 w-36 rounded-full bg-rust shadow-soft" />
        <div className="absolute left-0 top-12 h-10 w-14 rotate-[-18deg] rounded-md bg-white" />
        <div className="absolute right-0 top-12 h-10 w-14 rotate-[18deg] rounded-md bg-white" />
      </div>
    );
  }

  if (objectKey === "incense") {
    return (
      <div className="relative h-48 w-48" style={{ opacity: fade }}>
        <div className="smoke-thread absolute left-24 top-4 h-32 w-10 rounded-full border-l-2 border-moss/45" />
        <div className="absolute bottom-10 left-16 h-2 w-28 rotate-[-24deg] rounded-full bg-ink" />
        <div className="absolute bottom-5 left-10 h-3 w-36 rounded-full bg-neutral-300" />
      </div>
    );
  }

  if (objectKey === "coffee") {
    return (
      <div className="relative h-48 w-48" style={{ opacity: fade }}>
        <div className="smoke-thread absolute left-16 top-2 h-28 w-8 rounded-full border-l-2 border-neutral-500/40" />
        <div className="smoke-thread absolute left-24 top-8 h-24 w-8 rounded-full border-r-2 border-moss/35 [animation-delay:1.2s]" />
        <div className="absolute bottom-10 left-10 h-24 w-28 rounded-b-3xl rounded-t-md border-4 border-ink bg-white" />
        <div className="absolute bottom-20 right-4 h-12 w-12 rounded-full border-4 border-ink" />
        <div className="absolute bottom-28 left-14 h-4 rounded-full bg-rust" style={{ width: `${70 - progress * 45}px` }} />
      </div>
    );
  }

  if (objectKey === "candle") {
    return (
      <div className="relative h-48 w-48" style={{ opacity: fade }}>
        <div className="pulse-soft absolute left-[78px] top-8 h-16 w-9 rounded-t-full bg-ember" />
        <div className="absolute bottom-8 left-14 h-28 w-20 rounded-md bg-white shadow-soft" />
        <div className="absolute bottom-8 left-14 h-28 w-20 rounded-md border border-line" />
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

export function LegacyBurningCigarette({
  isAccelerating,
  onFilterHoldEnd,
  onFilterHoldStart,
  progress,
}: {
  isAccelerating?: boolean;
  onFilterHoldEnd?: () => void;
  onFilterHoldStart?: () => void;
  progress: number;
}) {
  const paperWidth = Math.max(14, 132 * (1 - progress));
  const ashWidth = Math.min(52, 8 + progress * 54);
  const smokeOpacity = (0.45 + progress * 0.45) * (isAccelerating ? 1.12 : 1);
  const emberScale = (1 - progress * 0.25) * (isAccelerating ? 1.28 : 1);

  return (
    <div className="relative z-10 h-56 w-[320px]">
      <div
        className="smoke-thread absolute left-[57%] top-2 h-36 w-10 rounded-full border-l-2 border-white/70"
        style={{ opacity: smokeOpacity }}
      />
      <div
        className="smoke-thread absolute left-[63%] top-7 h-32 w-12 rounded-full border-r-2 border-moss/45 [animation-delay:1s]"
        style={{ opacity: smokeOpacity }}
      />
      <div
        className="smoke-thread absolute left-[51%] top-10 h-28 w-9 rounded-full border-l-2 border-rust/35 [animation-delay:1.8s]"
        style={{ opacity: smokeOpacity }}
      />

      <div className="absolute bottom-20 left-1/2 flex -translate-x-1/2 rotate-[-8deg] items-center drop-shadow-xl">
        <button
          aria-label="Pull the cigarette filter"
          className="h-7 w-[46px] rounded-l-full border border-neutral-700 bg-gradient-to-r from-[#9b5f37] to-[#d4a06d] outline-none transition hover:brightness-110 focus-visible:ring-2 focus-visible:ring-ember disabled:cursor-default"
          disabled={progress >= 1}
          onBlur={onFilterHoldEnd}
          onKeyDown={(event) => {
            if (event.key === " " || event.key === "Enter") {
              event.preventDefault();
              onFilterHoldStart?.();
            }
          }}
          onKeyUp={(event) => {
            if (event.key === " " || event.key === "Enter") {
              event.preventDefault();
              onFilterHoldEnd?.();
            }
          }}
          onPointerCancel={onFilterHoldEnd}
          onPointerDown={onFilterHoldStart}
          onPointerLeave={onFilterHoldEnd}
          onPointerUp={onFilterHoldEnd}
          title="Hold"
          type="button"
        />
        <div
          className="h-7 border-y border-neutral-700 bg-gradient-to-r from-white to-[#f1efe6] transition-all duration-700"
          style={{ width: `${paperWidth}px` }}
        />
        <div
          className="relative h-7 rounded-r-full border border-neutral-700 bg-gradient-to-r from-neutral-500 to-neutral-300 transition-all duration-700"
          style={{ width: `${ashWidth}px` }}
        >
          <span
            className="pulse-soft absolute right-[-8px] top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-ember shadow-[0_0_24px_rgba(242,166,90,0.95)]"
            style={{ transform: `translateY(-50%) scale(${emberScale})` }}
          />
          {isAccelerating ? (
            <span className="absolute right-[-16px] top-1/2 h-10 w-10 -translate-y-1/2 rounded-full border border-ember/80 shadow-[0_0_32px_rgba(242,166,90,0.9)]" />
          ) : null}
          <span className="absolute right-2 top-1 h-1.5 w-6 rounded-full bg-white/45" />
        </div>
      </div>

      <div
        className="absolute bottom-12 rounded-full bg-neutral-500/60 blur-[1px] transition-all"
        style={{
          height: `${3 + progress * 5}px`,
          left: `${210 + progress * 38}px`,
          width: `${16 + progress * 38}px`,
        }}
      />
    </div>
  );
}

function RooftopView({ progress }: { progress: number }) {
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
    <div className="absolute inset-0 overflow-hidden" aria-hidden>
      <div className="absolute inset-0 transition-colors duration-700" style={{ background: sky }} />
      <div
        className="absolute left-[18%] h-16 w-16 rounded-full bg-ember shadow-[0_0_55px_rgba(242,166,90,0.75)] transition-all duration-700"
        style={{ top: `${sunTop}px`, opacity: Math.max(0, 1 - progress * 1.4) }}
      />
      <div
        className="absolute right-[18%] top-12 h-14 w-14 rounded-full bg-white shadow-[0_0_45px_rgba(255,255,255,0.75)] transition-opacity duration-700"
        style={{ opacity: moonOpacity }}
      />
      <div className="absolute inset-x-0 bottom-20 h-28">
        {Array.from({ length: 9 }, (_, index) => (
          <Building key={index} index={index} lightOpacity={lightOpacity} />
        ))}
      </div>
      <div className="absolute inset-x-0 bottom-0 h-24 bg-[#202625]" />
      <div className="absolute inset-x-0 bottom-20 h-4 bg-[#39413d]" />
      <div className="absolute bottom-20 left-10 h-16 w-28 rounded-t-md bg-[#2b3332]" />
      <div className="absolute bottom-24 right-12 h-10 w-36 rounded-t-md bg-[#2f3836]" />
      <div className="absolute bottom-7 left-1/2 h-3 w-[72%] -translate-x-1/2 rounded-full bg-black/30 blur-sm" />
    </div>
  );
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
