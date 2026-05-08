import { Timer } from "lucide-react";

export function SessionTimer({ remainingSec }: { remainingSec: number }) {
  const minutes = Math.floor(remainingSec / 60);
  const seconds = String(remainingSec % 60).padStart(2, "0");

  return (
    <div className="inline-flex items-center gap-2 rounded-md border border-line bg-white px-3 py-2 font-mono text-lg font-black">
      <Timer size={18} aria-hidden />
      {minutes}:{seconds}
    </div>
  );
}
