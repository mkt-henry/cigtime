"use client";

import { useEffect, useRef, useState } from "react";
import { SESSION_DURATION_SEC } from "@/lib/constants";

const FAST_MULTIPLIER = 4;
// Visuals ease between values with CSS transitions, so ~7 updates/sec reads as smooth
// while avoiding a full room re-render on every animation frame.
const PROGRESS_STEP = 0.0015;

export function useSessionTimer(durationSec = SESSION_DURATION_SEC) {
  const durationMs = durationSec * 1000;
  const [sessionKey, setSessionKey] = useState(0);
  const [remainingSec, setRemainingSec] = useState(durationSec);
  const [progress, setProgress] = useState(0);
  const [isAccelerating, setIsAccelerating] = useState(false);

  const s = useRef({ elapsedMs: 0, lastTime: 0, isAccelerating: false, active: false });

  useEffect(() => {
    const state = s.current;
    state.elapsedMs = 0;
    state.lastTime = performance.now();
    state.isAccelerating = false;
    state.active = true;

    setRemainingSec(durationSec);
    setProgress(0);
    setIsAccelerating(false);

    let prevDisplaySec = durationSec;
    let prevProgress = 0;
    let rafId: number;

    function frame(now: number) {
      if (!state.active) return;

      const dt = now - state.lastTime;
      state.lastTime = now;
      state.elapsedMs = Math.min(durationMs, state.elapsedMs + dt * (state.isAccelerating ? FAST_MULTIPLIER : 1));

      const p = state.elapsedMs / durationMs;
      const rem = Math.max(0, Math.ceil((durationMs - state.elapsedMs) / 1000));

      if (Math.abs(p - prevProgress) >= PROGRESS_STEP || p >= 1) {
        prevProgress = p;
        setProgress(p);
      }
      if (rem !== prevDisplaySec) {
        prevDisplaySec = rem;
        setRemainingSec(rem);
      }

      if (state.elapsedMs < durationMs) {
        rafId = requestAnimationFrame(frame);
      }
    }

    rafId = requestAnimationFrame(frame);

    return () => {
      state.active = false;
      cancelAnimationFrame(rafId);
    };
  }, [sessionKey, durationMs, durationSec]);

  return {
    remainingSec: Math.max(0, remainingSec),
    progress: Math.min(1, Math.max(0, progress)),
    isDone: remainingSec === 0,
    isAccelerating,
    startAccelerating() {
      if (s.current.elapsedMs >= durationMs) return;
      s.current.isAccelerating = true;
      setIsAccelerating(true);
    },
    stopAccelerating() {
      s.current.isAccelerating = false;
      setIsAccelerating(false);
    },
    restart() {
      s.current.active = false;
      setSessionKey((k) => k + 1);
    },
  };
}
