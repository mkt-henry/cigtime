"use client";

import { useEffect, useId, useRef, useState } from "react";

type AshParticle = {
  id: number;
  x: number;
  size: number;
  variant: "a" | "b" | "c";
  delay: number;
};

export type CigaretteObjectProps = {
  isActive?: boolean;
  progress: number;
};

type SmokerPerspectiveCigaretteProps = CigaretteObjectProps & {
  isAccelerating?: boolean;
  onFilterHoldEnd?: () => void;
  onFilterHoldStart?: () => void;
};

export function SmokerPerspectiveCigarette({
  isActive = true,
  isAccelerating,
  onFilterHoldEnd,
  onFilterHoldStart,
  progress,
}: SmokerPerspectiveCigaretteProps) {
  const pct = Math.min(1, Math.max(0, progress));
  const svgId = useId().replace(/[^a-zA-Z0-9_-]/g, "");

  const [particles, setParticles] = useState<AshParticle[]>([]);
  const particleId = useRef(0);
  const pctRef = useRef(pct);
  const litXRef = useRef(0);
  pctRef.current = pct;
  const paperGradientId = `ritual-paper-${svgId}`;
  const filterGradientId = `ritual-filter-${svgId}`;
  const emberGlowId = `ember-glow-${svgId}`;

  const filterX = 232;
  const filterWidth = 68;
  const maxPaperWidth = 200;
  const paperWidth = Math.max(10, maxPaperWidth * (1 - pct * 0.92));
  const ashWidth = Math.min(38, 11 + pct * 31);
  const cigaretteY = 142;
  const cigaretteHeight = 24;
  const paperX = filterX + filterWidth - 1;
  const ashX = paperX + paperWidth - 1;
  const litX = ashX + ashWidth - 1;
  const centerY = cigaretteY + cigaretteHeight / 2;
  const cigaretteRotation = -90;
  const cigarettePivotX = 340;
  const cigarettePivotY = 188;
  const litPoint = rotatePoint(litX, centerY, cigaretteRotation, cigarettePivotX, cigarettePivotY);
  const filterButtonCenter = rotatePoint(
    filterX + filterWidth / 2,
    centerY,
    cigaretteRotation,
    cigarettePivotX,
    cigarettePivotY,
  );
  litXRef.current = litX;
  const smokeOpacity = isActive ? Math.min(0.3, 0.2 + pct * 0.06 + (isAccelerating ? 0.03 : 0)) : 0.11;
  const ashOpacity = Math.min(0.9, 0.56 + pct * 0.34);

  useEffect(() => {
    const variants = ["a", "b", "c"] as const;
    let timerId: number;

    function spawn() {
      if (pctRef.current < 0.15 || pctRef.current >= 1) return;

      const count = 2 + Math.floor(Math.random() * 2);
      const burst: AshParticle[] = Array.from({ length: count }, (_, i) => ({
        id: particleId.current++,
        x: litXRef.current - 8 + Math.random() * 14,
        size: 1.4 + Math.random() * 2.2,
        variant: variants[i % 3],
        delay: i * 190,
      }));

      setParticles((prev) => [...prev, ...burst]);

      const ids = new Set(burst.map((p) => p.id));
      setTimeout(() => setParticles((prev) => prev.filter((p) => !ids.has(p.id))), 2600);
    }

    function schedule() {
      timerId = window.setTimeout(() => { spawn(); schedule(); }, 4200 + Math.random() * 3800);
    }

    timerId = window.setTimeout(() => { spawn(); schedule(); }, 1800 + Math.random() * 2000);
    return () => clearTimeout(timerId);
  }, []);

  return (
    <div className="relative z-10 h-[302px] w-full max-w-[560px] overflow-hidden">
      <svg aria-hidden className="h-full w-full overflow-visible" viewBox="0 0 560 302" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id={filterGradientId} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#9E683A" />
            <stop offset="0.5" stopColor="#B8763E" />
            <stop offset="1" stopColor="#7B5231" />
          </linearGradient>
          <filter id={emberGlowId} x="-300%" y="-300%" width="700%" height="700%">
            <feGaussianBlur stdDeviation="3.8" />
          </filter>
          <linearGradient id={paperGradientId} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#DED5BE" />
            <stop offset="0.42" stopColor="#F2E8CF" />
            <stop offset="1" stopColor="#D5CBB4" />
          </linearGradient>
        </defs>

        <g transform={`rotate(${cigaretteRotation} ${cigarettePivotX} ${cigarettePivotY})`}>
          <rect
            fill={`url(#${filterGradientId})`}
            height={cigaretteHeight}
            rx="2"
            stroke="rgba(82,52,32,0.34)"
            strokeWidth="0.8"
            width={filterWidth}
            x={filterX}
            y={cigaretteY}
          />
          <path d={`M ${filterX + 12} ${cigaretteY + 10} H ${filterX + filterWidth - 12}`} stroke="rgba(82,52,32,0.24)" strokeWidth="1.2" />
          <path d={`M ${filterX + 12} ${cigaretteY + 17} H ${filterX + filterWidth - 14}`} stroke="rgba(238,205,164,0.18)" strokeWidth="1.2" />
          <rect fill="rgba(67,42,27,0.18)" height={cigaretteHeight} width="1" x={filterX + filterWidth - 1} y={cigaretteY} />

          <rect
            fill={`url(#${paperGradientId})`}
            height={cigaretteHeight}
            stroke="rgba(128,113,90,0.28)"
            strokeWidth="0.8"
            width={paperWidth}
            x={paperX}
            y={cigaretteY}
          />
          <path
            d={`M ${paperX + 18} ${cigaretteY + 11} H ${paperX + Math.max(28, paperWidth - 22)}`}
            stroke="rgba(255,251,238,0.48)"
            strokeLinecap="round"
            strokeWidth="1.8"
          />
          <path
            d={`M ${paperX + 28} ${cigaretteY + 24} H ${paperX + Math.max(34, paperWidth * 0.72)}`}
            stroke="rgba(96,82,62,0.08)"
            strokeLinecap="round"
            strokeWidth="1.9"
          />

          <rect
            fill="#5C5C55"
            height={cigaretteHeight}
            opacity={ashOpacity}
            rx="2"
            width={ashWidth}
            x={ashX}
            y={cigaretteY}
          />
          <path
            d={`M ${ashX + 6} ${cigaretteY + 10} L ${ashX + ashWidth - 5} ${cigaretteY + 7}`}
            opacity={ashOpacity * 0.45}
            stroke="rgba(245,240,226,0.36)"
            strokeLinecap="round"
            strokeWidth="1.2"
          />
          <path
            d={`M ${ashX + 7} ${cigaretteY + 18} L ${ashX + ashWidth - 6} ${cigaretteY + 15}`}
            opacity={ashOpacity * 0.5}
            stroke="rgba(25,25,22,0.28)"
            strokeLinecap="round"
            strokeWidth="1.2"
          />
          <ellipse
            cx={litX - 1}
            cy={centerY}
            fill="#C8702A"
            filter={`url(#${emberGlowId})`}
            opacity={isActive ? (isAccelerating ? 0.72 : 0.55) : 0.2}
            rx="8.5"
            ry="9"
          />
          <ellipse cx={litX - 1} cy={centerY} fill="#E8943A" opacity={isActive ? (isAccelerating ? 0.75 : 0.6) : 0.2} rx="2.7" ry="3.4" />
          <ellipse cx={litX + 1.5} cy={centerY} fill="#77766e" opacity={ashOpacity * 0.75} rx="4.1" ry="7.4" />
          <circle cx={litX - 6} cy={centerY + 13} fill="#8b897f" opacity={ashOpacity * 0.42} r="1.8" />
          <circle cx={litX + 7} cy={centerY + 15} fill="#c5c0b4" opacity={ashOpacity * 0.34} r="1.3" />
        </g>

        {particles.map((p) => (
          <ellipse
            key={p.id}
            className={`ash-particle ash-particle-${p.variant}`}
            cx={litPoint.x - (litX - p.x)}
            cy={litPoint.y + 7}
            fill="#8a887c"
            rx={p.size}
            ry={p.size * 0.55}
            style={{ animationDelay: `${p.delay}ms` }}
          />
        ))}

        <g fill="none" stroke="#E8E0D2" strokeLinecap="round" strokeWidth="1" style={{ opacity: smokeOpacity }}>
          <path
            className="ritual-smoke [animation-delay:-3s]"
            d={`M ${litPoint.x - 2} ${litPoint.y - 2} C ${litPoint.x - 14} ${litPoint.y - 17}, ${litPoint.x + 7} ${litPoint.y - 28}, ${litPoint.x - 1} ${litPoint.y - 43} C ${litPoint.x - 8} ${litPoint.y - 56}, ${litPoint.x + 10} ${litPoint.y - 63}, ${litPoint.x + 5} ${litPoint.y - 76}`}
          />
          <path
            className="ritual-smoke [animation-delay:-7s]"
            d={`M ${litPoint.x + 4} ${litPoint.y - 1} C ${litPoint.x + 17} ${litPoint.y - 16}, ${litPoint.x - 2} ${litPoint.y - 30}, ${litPoint.x + 15} ${litPoint.y - 44} C ${litPoint.x + 27} ${litPoint.y - 55}, ${litPoint.x + 14} ${litPoint.y - 65}, ${litPoint.x + 25} ${litPoint.y - 75}`}
          />
          {pct > 0.24 ? (
            <path
              className="ritual-smoke [animation-delay:-10s]"
              d={`M ${litPoint.x - 4} ${litPoint.y} C ${litPoint.x - 9} ${litPoint.y - 15}, ${litPoint.x - 24} ${litPoint.y - 27}, ${litPoint.x - 20} ${litPoint.y - 41} C ${litPoint.x - 15} ${litPoint.y - 54}, ${litPoint.x - 31} ${litPoint.y - 62}, ${litPoint.x - 25} ${litPoint.y - 72}`}
              opacity="0.72"
            />
          ) : null}
        </g>
      </svg>

      <button
        aria-label="Hold cigarette filter"
        className="absolute z-30 rounded-[3px] outline-none transition focus-visible:ring-2 focus-visible:ring-ember focus-visible:ring-offset-2 focus-visible:ring-offset-transparent disabled:cursor-default"
        disabled={pct >= 1}
        onClick={(e) => e.stopPropagation()}
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
        style={{
          height: `${(cigaretteHeight / 302) * 100}%`,
          left: `${((filterButtonCenter.x - filterWidth / 2) / 560) * 100}%`,
          top: `${((filterButtonCenter.y - cigaretteHeight / 2) / 302) * 100}%`,
          transform: `rotate(${cigaretteRotation}deg)`,
          transformOrigin: "center center",
          width: `${(filterWidth / 560) * 100}%`,
        }}
        title="Hold"
        type="button"
      />
    </div>
  );
}

function rotatePoint(x: number, y: number, degrees: number, centerX: number, centerY: number) {
  const radians = (degrees * Math.PI) / 180;
  const dx = x - centerX;
  const dy = y - centerY;

  return {
    x: centerX + dx * Math.cos(radians) - dy * Math.sin(radians),
    y: centerY + dx * Math.sin(radians) + dy * Math.cos(radians),
  };
}
