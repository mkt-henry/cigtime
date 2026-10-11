"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

// Three.js render of a ritual object. The flat fallback only shows on devices
// without WebGL, so switching objects never flashes the CSS stand-in.
export function RitualScene3D({
  fallback,
  isAccelerating,
  objectKey,
  onHoldEnd,
  onHoldStart,
  progress,
}: {
  fallback: ReactNode;
  isAccelerating?: boolean;
  objectKey: string;
  onHoldEnd?: () => void;
  onHoldStart?: () => void;
  progress: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const emberRef = useRef<HTMLSpanElement>(null);
  const progressRef = useRef(progress);
  progressRef.current = progress;
  const [status, setStatus] = useState<"loading" | "ready" | "failed">("loading");

  useEffect(() => {
    let handle: { dispose(): void } | null = null;
    let cancelled = false;
    setStatus("loading");
    import("@/lib/ritual3d")
      .then(({ mountRitual }) => {
        if (cancelled || !canvasRef.current) return;
        handle = mountRitual(canvasRef.current, objectKey, {
          ember: emberRef.current,
          getProgress: () => progressRef.current,
          reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
        });
        setStatus(handle ? "ready" : "failed");
      })
      .catch(() => setStatus("failed"));
    return () => {
      cancelled = true;
      handle?.dispose();
    };
  }, [objectKey]);

  return (
    <div className="relative z-10 h-[340px] w-full max-w-[640px] sm:h-[460px]">
      {status === "failed" && <div className="absolute inset-0 flex items-center justify-center">{fallback}</div>}
      <canvas
        aria-hidden
        className={`pointer-events-none absolute bottom-0 left-0 h-[150%] w-full origin-bottom transition duration-700 ${status === "ready" ? "opacity-100" : "opacity-0"} ${isAccelerating ? "scale-[1.03]" : ""}`}
        key={objectKey}
        ref={canvasRef}
      />
      {onHoldStart && progress < 1 && (
        // Press and hold the object to burn it faster, like the cigarette filter.
        <button
          aria-label="Hold to burn faster"
          className="absolute bottom-0 left-1/2 top-[10%] z-20 w-2/5 -translate-x-1/2 touch-none select-none rounded-3xl outline-none [-webkit-touch-callout:none] focus-visible:ring-2 focus-visible:ring-sodium"
          onBlur={onHoldEnd}
          onClick={(event) => event.stopPropagation()}
          onContextMenu={(event) => event.preventDefault()}
          onKeyDown={(event) => {
            if (event.key !== " " && event.key !== "Enter") return;
            event.preventDefault();
            event.stopPropagation();
            onHoldStart();
          }}
          onKeyUp={(event) => {
            if (event.key !== " " && event.key !== "Enter") return;
            event.preventDefault();
            onHoldEnd?.();
          }}
          onPointerCancel={onHoldEnd}
          onPointerDown={onHoldStart}
          onPointerLeave={onHoldEnd}
          onPointerUp={onHoldEnd}
          title="Hold"
          type="button"
        />
      )}
      <span aria-hidden className="pointer-events-none absolute h-1 w-1 -translate-x-1/2 -translate-y-1/2" ref={emberRef} />
    </div>
  );
}
