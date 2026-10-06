"use client";

import { useEffect, useState } from "react";
import { useLang } from "@/hooks/useLang";
import { t } from "@/lib/i18n";

type DauPoint = { day: string; dau: number };

export function DauChart() {
  const copy = t(useLang());
  const [points, setPoints] = useState<DauPoint[]>([]);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/analytics?days=14", { cache: "no-store", signal: controller.signal })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error);
        setPoints(data.dailyActiveUsers ?? []);
      })
      .catch((error) => {
        if (error instanceof Error && error.name !== "AbortError") setFailed(true);
      });
    return () => controller.abort();
  }, []);

  if (failed) return <p className="text-ember">{copy.statsError}</p>;
  if (points.length === 0) return <p className="text-fog">{copy.statsEmpty}</p>;

  const max = Math.max(1, ...points.map((point) => Number(point.dau)));
  return (
    <div className="rounded-2xl border border-white/10 bg-slate p-6">
      <div className="flex h-56 items-end gap-2">
        {points.map((point) => (
          <div className="flex min-w-0 flex-1 flex-col items-center gap-2" key={point.day}>
            <span className="text-xs font-semibold text-mist">{point.dau}</span>
            <div
              className="w-full min-w-2 rounded-t bg-sodium"
              style={{ height: `${Math.max(6, (Number(point.dau) / max) * 170)}px` }}
            />
            <span className="text-[10px] text-fog">{point.day.slice(5)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
