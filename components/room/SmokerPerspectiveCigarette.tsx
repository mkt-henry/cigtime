"use client";

export function SmokerPerspectiveCigarette({
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
  const filterHeight = 76;
  const maxPaperHeight = 182;
  const paperHeight = Math.max(32, maxPaperHeight * (1 - progress));
  const ashHeight = Math.min(64, 10 + progress * 70);
  const emberSize = 18 + progress * 5 + (isAccelerating ? 8 : 0);
  const smokeStrength = Math.min(1, 0.42 + progress * 0.44 + (isAccelerating ? 0.24 : 0));
  const ashBottom = 34 + filterHeight + paperHeight - 2;

  return (
    <div className="relative z-10 h-[302px] w-full max-w-[520px] overflow-hidden">
      <div className="absolute left-1/2 bottom-5 h-10 w-40 -translate-x-1/2 rounded-[50%] bg-black/35 blur-xl" />

      <div className="absolute left-1/2 bottom-[34px] h-[258px] w-[112px] -translate-x-1/2">
        <SmokeColumn bottom={ashBottom + ashHeight - 8} opacity={smokeStrength} />

        <button
          aria-label="Hold cigarette filter"
          className="absolute bottom-0 left-1/2 z-20 h-[76px] w-[42px] -translate-x-1/2 rounded-b-full border border-[#5f412d] bg-[linear-gradient(90deg,#6d3f25_0%,#c88855_42%,#e0aa70_62%,#8f5735_100%)] shadow-[inset_8px_0_8px_rgba(255,255,255,0.24),inset_-8px_0_10px_rgba(51,29,15,0.4),0_12px_22px_rgba(0,0,0,0.28)] outline-none transition hover:brightness-105 focus-visible:ring-2 focus-visible:ring-ember disabled:cursor-default"
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
        >
          <span className="absolute left-2 top-4 h-9 w-1.5 rounded-full bg-white/25" />
          <span className="absolute right-2 top-5 h-8 w-1 rounded-full bg-black/18" />
          <span className="absolute left-1/2 top-2 h-px w-7 -translate-x-1/2 bg-[#5f3924]/50" />
          <span className="absolute left-1/2 top-7 h-px w-7 -translate-x-1/2 bg-[#5f3924]/34" />
        </button>

        <div
          className="absolute left-1/2 w-[42px] -translate-x-1/2 border-x border-[#d5d0bf] bg-[linear-gradient(90deg,#d9d2bf_0%,#fffdf1_28%,#f4efe2_55%,#cfc5ad_100%)] shadow-[inset_8px_0_8px_rgba(255,255,255,0.78),inset_-8px_0_8px_rgba(86,68,41,0.16),0_10px_22px_rgba(0,0,0,0.22)] transition-[height] duration-500"
          style={{ bottom: `${filterHeight - 1}px`, height: `${paperHeight}px` }}
        >
          <span className="absolute left-2 top-4 h-[72%] w-1.5 rounded-full bg-white/72" />
          <span className="absolute right-2 top-7 h-[56%] w-1 rounded-full bg-neutral-500/12" />
          <span className="absolute inset-x-0 bottom-[-1px] h-px bg-[#a88256]/40" />
        </div>

        <div
          className="absolute left-1/2 w-[42px] -translate-x-1/2 rounded-t-full border border-neutral-600 bg-[linear-gradient(90deg,#5f5d56_0%,#d2d0c6_45%,#8f8c82_72%,#3f3e39_100%)] shadow-[inset_7px_0_8px_rgba(255,255,255,0.23),inset_-7px_0_8px_rgba(0,0,0,0.32)] transition-all duration-500"
          style={{ bottom: `${ashBottom}px`, height: `${ashHeight}px` }}
        >
          <span className="absolute left-2 top-3 h-[52%] w-1 rounded-full bg-white/26" />
          <span className="absolute right-2 top-5 h-[42%] w-1 rounded-full bg-black/24" />
          <span className="absolute left-1/2 top-5 h-px w-8 -translate-x-1/2 rotate-[-18deg] bg-black/25" />
          <span className="absolute left-1/2 top-9 h-px w-7 -translate-x-1/2 rotate-[14deg] bg-white/22" />
          <span
            className="ember-flicker absolute left-1/2 top-[-10px] rounded-full bg-[radial-gradient(circle,#fff1b8_0%,#f2a65a_38%,#c8401c_68%,rgba(87,28,16,0.05)_100%)] shadow-[0_0_34px_rgba(242,166,90,0.98)]"
            style={{
              height: `${emberSize}px`,
              transform: "translateX(-50%)",
              width: `${emberSize}px`,
            }}
          />
          {isAccelerating ? (
            <span className="absolute left-1/2 top-[-21px] h-14 w-14 -translate-x-1/2 rounded-full border border-ember/80 shadow-[0_0_48px_rgba(242,166,90,0.98)]" />
          ) : null}
        </div>
      </div>

      <AshFall progress={progress} />
    </div>
  );
}

function SmokeColumn({ bottom, opacity }: { bottom: number; opacity: number }) {
  return (
    <div className="absolute left-1/2 h-36 w-28 -translate-x-1/2" style={{ bottom: `${bottom}px` }}>
      <span
        className="smoke-thread absolute left-12 top-14 h-28 w-10 rounded-full border-l-2 border-white/80"
        style={{ opacity }}
      />
      <span
        className="smoke-thread absolute left-16 top-4 h-36 w-14 rounded-full border-r-2 border-white/65 [animation-delay:0.8s]"
        style={{ opacity: opacity * 0.88 }}
      />
      <span
        className="smoke-thread absolute left-5 top-8 h-32 w-12 rounded-full border-l-2 border-moss/35 [animation-delay:1.5s]"
        style={{ opacity: opacity * 0.76 }}
      />
      <span
        className="smoke-thread absolute left-20 top-16 h-24 w-10 rounded-full border-r-2 border-rust/30 [animation-delay:2.1s]"
        style={{ opacity: opacity * 0.7 }}
      />
    </div>
  );
}

function AshFall({ progress }: { progress: number }) {
  if (progress < 0.18) return null;

  return (
    <>
      <span
        className="absolute left-1/2 z-20 rounded-full bg-neutral-400/75 blur-[0.5px]"
        style={{
          height: `${3 + progress * 5}px`,
          top: `${92 + progress * 82}px`,
          transform: `translateX(${18 + progress * 20}px)`,
          width: `${8 + progress * 16}px`,
        }}
      />
      <span
        className="absolute left-1/2 z-20 h-1.5 w-1.5 rounded-full bg-neutral-300/70"
        style={{
          top: `${120 + progress * 86}px`,
          transform: `translateX(${-18 - progress * 14}px)`,
        }}
      />
    </>
  );
}
