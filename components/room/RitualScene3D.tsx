"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

// Three.js render of a ritual object. Shows the flat fallback until WebGL is up
// (or forever, if the device has no WebGL).
export function RitualScene3D({
  fallback,
  objectKey,
  progress,
}: {
  fallback: ReactNode;
  objectKey: string;
  progress: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const emberRef = useRef<HTMLSpanElement>(null);
  const progressRef = useRef(progress);
  progressRef.current = progress;
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let handle: { dispose(): void } | null = null;
    let cancelled = false;
    setReady(false);
    import("@/lib/ritual3d")
      .then(({ mountRitual }) => {
        if (cancelled || !canvasRef.current) return;
        handle = mountRitual(canvasRef.current, objectKey, {
          ember: emberRef.current,
          getProgress: () => progressRef.current,
          reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
        });
        if (handle) setReady(true);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
      handle?.dispose();
    };
  }, [objectKey]);

  return (
    <div className="relative z-10 h-[340px] w-full max-w-[640px] sm:h-[460px]">
      {!ready && <div className="absolute inset-0 flex items-center justify-center">{fallback}</div>}
      <canvas
        aria-hidden
        className={`pointer-events-none absolute bottom-0 left-0 h-[150%] w-full transition-opacity duration-700 ${ready ? "opacity-100" : "opacity-0"}`}
        key={objectKey}
        ref={canvasRef}
      />
      <span aria-hidden className="pointer-events-none absolute h-1 w-1 -translate-x-1/2 -translate-y-1/2" ref={emberRef} />
    </div>
  );
}
