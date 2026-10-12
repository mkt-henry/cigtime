"use client";

import { useEffect, useState } from "react";
import { isDaytime } from "@/lib/daytime";

// Match the static night shell on hydration, then use the visitor's local clock.
export function useDaytime() {
  const [day, setDay] = useState(false);
  useEffect(() => {
    const update = () => setDay(isDaytime());
    update();
    const timer = setInterval(update, 60_000);
    return () => clearInterval(timer);
  }, []);
  return day;
}
