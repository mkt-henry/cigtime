"use client";

import { useEffect, useState } from "react";

type DauPoint = { day: string; dau: number };

export function DauChart() {
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

  if (failed) return <p className="text-rust">DAU could not be loaded.</p>;
  if (points.length === 0) return <p className="text-neutral-500">No active-room events yet.</p>;

  const max = Math.max(1, ...points.map((point) => Number(point.dau)));
  return (
    <div className="rounded-lg border border-line bg-white/85 p-6 shadow-sm">
      <div className="flex h-56 items-end gap-2">
        {points.map((point) => (
          <div className="flex min-w-0 flex-1 flex-col items-center gap-2" key={point.day}>
            <span className="text-xs font-black">{point.dau}</span>
            <div
              className="w-full min-w-2 rounded-t bg-moss"
              style={{ height: `${Math.max(6, (Number(point.dau) / max) * 170)}px` }}
            />
            <span className="text-[10px] font-semibold text-neutral-500">{point.day.slice(5)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
