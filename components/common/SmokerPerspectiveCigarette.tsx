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

  const filterX = 332;
  const filterWidth = 42;
  const maxPaperWidth = 112;
  const paperWidth = Math.max(10, maxPaperWidth * (1 - pct * 0.92));
  const ashWidth = Math.min(22, 7 + pct * 20);
  const cigaretteY = 150;
  const cigaretteHeight = 13;
  const paperX = filterX + filterWidth - 1;
  const ashX = paperX + paperWidth - 1;
  const litX = ashX + ashWidth - 1;
  const centerY = cigaretteY + cigaretteHeight / 2;
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

        <g transform={`rotate(-6 430 ${cigaretteY + 8})`}>
          <ellipse cx="419" cy={cigaretteY + 16} fill="rgba(0,0,0,0.16)" rx="79" ry="2.8" />
          <ellipse cx="420" cy={cigaretteY + 15.5} fill="rgba(255,255,255,0.06)" rx="42" ry="1" />

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
          <path d={`M ${filterX + 8} ${cigaretteY + 6} H ${filterX + filterWidth - 8}`} stroke="rgba(82,52,32,0.24)" strokeWidth="0.8" />
          <path d={`M ${filterX + 8} ${cigaretteY + 10} H ${filterX + filterWidth - 10}`} stroke="rgba(238,205,164,0.18)" strokeWidth="0.8" />
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
            d={`M ${paperX + 12} ${cigaretteY + 7} H ${paperX + Math.max(20, paperWidth - 14)}`}
            stroke="rgba(255,251,238,0.48)"
            strokeLinecap="round"
            strokeWidth="1.2"
          />
          <path
            d={`M ${paperX + 20} ${cigaretteY + 14} H ${paperX + Math.max(24, paperWidth * 0.72)}`}
            stroke="rgba(96,82,62,0.08)"
            strokeLinecap="round"
            strokeWidth="1.4"
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
            d={`M ${ashX + 4} ${cigaretteY + 6} L ${ashX + ashWidth - 3} ${cigaretteY + 4}`}
            opacity={ashOpacity * 0.45}
            stroke="rgba(245,240,226,0.36)"
            strokeLinecap="round"
            strokeWidth="0.8"
          />
          <path
            d={`M ${ashX + 5} ${cigaretteY + 10} L ${ashX + ashWidth - 4} ${cigaretteY + 8}`}
            opacity={ashOpacity * 0.5}
            stroke="rgba(25,25,22,0.28)"
            strokeLinecap="round"
            strokeWidth="0.8"
          />
          <ellipse
            cx={litX - 1}
            cy={centerY}
            fill="#C8702A"
            filter={`url(#${emberGlowId})`}
            opacity={isActive ? (isAccelerating ? 0.72 : 0.55) : 0.2}
            rx="5.5"
            ry="6"
          />
          <ellipse cx={litX - 1} cy={centerY} fill="#E8943A" opacity={isActive ? (isAccelerating ? 0.75 : 0.6) : 0.2} rx="1.6" ry="2" />
          <ellipse cx={litX + 1.5} cy={centerY} fill="#77766e" opacity={ashOpacity * 0.75} rx="2.6" ry="4.6" />
          <circle cx={litX - 4} cy={centerY + 8} fill="#8b897f" opacity={ashOpacity * 0.42} r="1.2" />
          <circle cx={litX + 5} cy={centerY + 10} fill="#c5c0b4" opacity={ashOpacity * 0.34} r="0.9" />
        </g>

        {particles.map((p) => (
          <ellipse
            key={p.id}
            className={`ash-particle ash-particle-${p.variant}`}
            cx={p.x}
            cy={cigaretteY + cigaretteHeight + 2}
            fill="#8a887c"
            rx={p.size}
            ry={p.size * 0.55}
            style={{ animationDelay: `${p.delay}ms` }}
          />
        ))}

        <g fill="none" stroke="#E8E0D2" strokeLinecap="round" strokeWidth="1" style={{ opacity: smokeOpacity }}>
          <path
            className="ritual-smoke [animation-delay:-3s]"
            d={`M ${litX - 2} ${cigaretteY - 2} C ${litX - 15} ${cigaretteY - 20}, ${litX + 7} ${cigaretteY - 31}, ${litX - 1} ${cigaretteY - 48} C ${litX - 8} ${cigaretteY - 63}, ${litX + 10} ${cigaretteY - 70}, ${litX + 5} ${cigaretteY - 84}`}
          />
          <path
            className="ritual-smoke [animation-delay:-7s]"
            d={`M ${litX + 4} ${cigaretteY - 1} C ${litX + 18} ${cigaretteY - 18}, ${litX - 2} ${cigaretteY - 33}, ${litX + 15} ${cigaretteY - 48} C ${litX + 27} ${cigaretteY - 59}, ${litX + 14} ${cigaretteY - 70}, ${litX + 25} ${cigaretteY - 81}`}
          />
          {pct > 0.24 ? (
            <path
              className="ritual-smoke [animation-delay:-10s]"
              d={`M ${litX - 4} ${cigaretteY} C ${litX - 9} ${cigaretteY - 16}, ${litX - 25} ${cigaretteY - 29}, ${litX - 20} ${cigaretteY - 44} C ${litX - 15} ${cigaretteY - 57}, ${litX - 31} ${cigaretteY - 66}, ${litX - 25} ${cigaretteY - 77}`}
              opacity="0.72"
            />
          ) : null}
        </g>
      </svg>

      <button
        aria-label="Hold cigarette filter"
        className="absolute z-30 rounded-[3px] outline-none transition focus-visible:ring-2 focus-visible:ring-ember focus-visible:ring-offset-2 focus-visible:ring-offset-transparent disabled:cursor-default"
        disabled={pct >= 1}
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
          left: `${(filterX / 560) * 100}%`,
          top: `${(cigaretteY / 302) * 100}%`,
          transform: "rotate(-5deg)",
          transformOrigin: "right center",
          width: `${(filterWidth / 560) * 100}%`,
        }}
        title="Hold"
        type="button"
      />
    </div>
  );
}
