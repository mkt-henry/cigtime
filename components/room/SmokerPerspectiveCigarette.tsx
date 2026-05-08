"use client";

import { useId } from "react";

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
  const paperGradientId = `ritual-paper-${svgId}`;
  const filterGradientId = `ritual-filter-${svgId}`;

  const filterX = 332;
  const filterWidth = 42;
  const maxPaperWidth = 112;
  const paperWidth = Math.max(10, maxPaperWidth * (1 - pct * 0.92));
  const ashWidth = Math.min(22, 7 + pct * 20);
  const cigaretteY = 238;
  const cigaretteHeight = 13;
  const paperX = filterX + filterWidth - 1;
  const ashX = paperX + paperWidth - 1;
  const litX = ashX + ashWidth - 1;
  const centerY = cigaretteY + cigaretteHeight / 2;
  const smokeOpacity = isActive ? Math.min(0.3, 0.2 + pct * 0.06 + (isAccelerating ? 0.03 : 0)) : 0.11;
  const ashOpacity = Math.min(0.9, 0.56 + pct * 0.34);

  return (
    <div className="relative z-10 h-[302px] w-full max-w-[560px] overflow-hidden">
      <svg aria-hidden className="h-full w-full overflow-visible" viewBox="0 0 560 302" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id={filterGradientId} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#9E683A" />
            <stop offset="0.5" stopColor="#B8763E" />
            <stop offset="1" stopColor="#7B5231" />
          </linearGradient>
          <linearGradient id={paperGradientId} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#DED5BE" />
            <stop offset="0.42" stopColor="#F2E8CF" />
            <stop offset="1" stopColor="#D5CBB4" />
          </linearGradient>
        </defs>

        <g transform="rotate(-6 430 246)">
          <ellipse cx="419" cy="254" fill="rgba(0,0,0,0.16)" rx="79" ry="2.8" />
          <ellipse cx="420" cy="253.5" fill="rgba(255,255,255,0.06)" rx="42" ry="1" />

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
          <ellipse cx={litX + 1.5} cy={centerY} fill="#77766e" opacity={ashOpacity * 0.75} rx="2.6" ry="4.6" />
          <circle cx={litX - 4} cy={centerY + 8} fill="#8b897f" opacity={ashOpacity * 0.42} r="1.2" />
          <circle cx={litX + 5} cy={centerY + 10} fill="#c5c0b4" opacity={ashOpacity * 0.34} r="0.9" />
        </g>

        <g fill="none" stroke="#E8E0D2" strokeLinecap="round" strokeWidth="1" style={{ opacity: smokeOpacity }}>
          <path
            className="ritual-smoke [animation-delay:-3s]"
            d={`M ${litX - 2} ${cigaretteY - 2} C ${litX - 15} 218, ${litX + 7} 207, ${litX - 1} 190 C ${litX - 8} 175, ${litX + 10} 168, ${litX + 5} 154`}
          />
          <path
            className="ritual-smoke [animation-delay:-7s]"
            d={`M ${litX + 4} ${cigaretteY - 1} C ${litX + 18} 220, ${litX - 2} 205, ${litX + 15} 190 C ${litX + 27} 179, ${litX + 14} 168, ${litX + 25} 157`}
          />
          {pct > 0.24 ? (
            <path
              className="ritual-smoke [animation-delay:-10s]"
              d={`M ${litX - 4} ${cigaretteY} C ${litX - 9} 222, ${litX - 25} 209, ${litX - 20} 194 C ${litX - 15} 181, ${litX - 31} 172, ${litX - 25} 161`}
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
