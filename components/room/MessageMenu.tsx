"use client";

import { Ban, Flag } from "lucide-react";
import { Button } from "@/components/common/Button";

export function MessageMenu({
  isMine,
  onMute,
  onReport,
}: {
  isMine: boolean;
  onMute: () => void;
  onReport: () => void;
}) {
  if (isMine) return null;

  return (
    <div className="flex gap-2">
      <Button
        aria-label="Mute user"
        className="h-8 px-2"
        onClick={onMute}
        title="Mute user"
        type="button"
        variant="ghost"
      >
        <Ban size={15} aria-hidden />
      </Button>
      <Button
        aria-label="Report message"
        className="h-8 px-2"
        onClick={onReport}
        title="Report message"
        type="button"
        variant="ghost"
      >
        <Flag size={15} aria-hidden />
      </Button>
    </div>
  );
}
