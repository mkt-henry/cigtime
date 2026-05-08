"use client";

import { REACTIONS } from "@/lib/constants";
import type { ChatMessage, ReactionType } from "@/lib/types";

export function ReactionBar({
  message,
  anonymousUserId,
  onReact,
}: {
  message: ChatMessage;
  anonymousUserId: string;
  onReact: (messageId: string, reactionType: ReactionType) => void;
}) {
  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {REACTIONS.map((reaction) => {
        const active = message.reactions[reaction].includes(anonymousUserId);
        const count = message.reactions[reaction].length;
        return (
          <button
            className={`h-8 rounded-md border px-2 text-xs font-black transition ${
              active
                ? "border-moss bg-moss text-white"
                : "border-line bg-white text-neutral-700 hover:border-ink"
            }`}
            key={reaction}
            onClick={() => onReact(message.id, reaction)}
            type="button"
          >
            {reaction} {count}
          </button>
        );
      })}
    </div>
  );
}
