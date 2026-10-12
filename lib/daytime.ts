// Daytime is 6:00–17:59 on the visitor's local clock. Called only in browser effects.
export function isDaytime() {
  const hour = new Date().getHours();
  return hour >= 6 && hour < 18;
}
