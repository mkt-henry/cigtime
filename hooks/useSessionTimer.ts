"use client";

import { useEffect, useMemo, useState } from "react";
import { SESSION_DURATION_SEC } from "@/lib/constants";

const FAST_TICK_SEC = 4;

export function useSessionTimer(durationSec = SESSION_DURATION_SEC) {
  const [remainingSec, setRemainingSec] = useState(durationSec);
  const [sessionKey, setSessionKey] = useState(0);
  const [isAccelerating, setIsAccelerating] = useState(false);

  useEffect(() => {
    setRemainingSec(durationSec);
    setIsAccelerating(false);
  }, [durationSec, sessionKey]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      const tickSize = isAccelerating ? FAST_TICK_SEC : 1;
      setRemainingSec((value) => Math.max(0, value - tickSize));
    }, 1000);

    return () => window.clearInterval(interval);
  }, [isAccelerating]);

  const progress = useMemo(
    () => (durationSec - remainingSec) / durationSec,
    [durationSec, remainingSec],
  );

  function startAccelerating() {
    if (remainingSec <= 0) return;
    setIsAccelerating(true);
  }

  function stopAccelerating() {
    setIsAccelerating(false);
  }

  return {
    remainingSec,
    progress,
    isDone: remainingSec === 0,
    isAccelerating,
    startAccelerating,
    stopAccelerating,
    restart: () => {
      setIsAccelerating(false);
      setSessionKey((key) => key + 1);
    },
  };
}
