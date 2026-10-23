// Timing for the thought bubbles that float over a room. Each bubble is shown
// until `hideAt`, then fades out for FADE_OUT_MS and is dropped.
export const AMBIENT_VISIBLE_MS = 6_000;
export const MESSAGE_VISIBLE_MS = 9_000;
export const FADE_OUT_MS = 2_000;

export type TimedBubble = {
  phase: "visible" | "disappearing";
  hideAt: number;
};

// Moves bubbles from visible to disappearing to gone. Returns the same array when
// nothing changed so React can skip the re-render.
export function advanceBubbles<T extends TimedBubble>(items: T[], now: number): T[] {
  let changed = false;
  const next: T[] = [];
  for (const item of items) {
    if (now >= item.hideAt + FADE_OUT_MS) {
      changed = true;
      continue;
    }
    if (now >= item.hideAt && item.phase === "visible") {
      changed = true;
      next.push({ ...item, phase: "disappearing" });
      continue;
    }
    next.push(item);
  }
  return changed ? next : items;
}

// Starts the fade right away, e.g. when a real thought pushes an ambient one out.
export function fadeOut<T extends TimedBubble>(item: T, now: number): T {
  if (item.phase === "disappearing") return item;
  return { ...item, phase: "disappearing", hideAt: Math.min(item.hideAt, now) };
}

// A quiet room gets its first sample thought soon after you walk in, so it never
// sits still for long, then the next ones drift in at random intervals.
export const FIRST_AMBIENT_DELAY_MS: readonly [number, number] = [1_000, 3_000];
export const AMBIENT_GAP_MS: readonly [number, number] = [2_000, 9_000];

function between([min, max]: readonly [number, number], random: () => number) {
  return min + Math.floor(random() * (max - min));
}

export function firstAmbientAt(enteredAt: number, random: () => number = Math.random): number {
  return enteredAt + between(FIRST_AMBIENT_DELAY_MS, random);
}

// When the next sample thought may appear, counted from when the current one starts fading.
export function nextAmbientAt(hideAt: number, random: () => number = Math.random): number {
  return hideAt + FADE_OUT_MS + between(AMBIENT_GAP_MS, random);
}

// Random ambient line that is not the one just shown.
export function pickAmbientBody(
  pool: readonly string[],
  previous: string | null,
  random: () => number = Math.random,
): string {
  const choices = pool.length > 1 && previous ? pool.filter((body) => body !== previous) : pool;
  return choices[Math.min(choices.length - 1, Math.floor(random() * choices.length))];
}
