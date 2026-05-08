"use client";

import { MessageMenu } from "./MessageMenu";
import { ReactionBar } from "./ReactionBar";
import type { ChatMessage as ChatMessageType, ReactionType } from "@/lib/types";

export function ChatMessage({
  message,
  anonymousUserId,
  onMute,
  onReact,
  onReport,
}: {
  message: ChatMessageType;
  anonymousUserId: string;
  onMute: (anonymousUserId: string) => void;
  onReact: (messageId: string, reactionType: ReactionType) => void;
  onReport: (messageId: string) => void;
}) {
  const isMine = message.anonymousUserId === anonymousUserId;

  if (message.reported) {
    return (
      <article className="rounded-lg border border-line bg-white/70 p-4 text-sm font-semibold text-neutral-500">
        This message is hidden after a report.
      </article>
    );
  }

  return (
    <article className="rounded-lg border border-line bg-white/90 p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-black text-neutral-600">{message.nickname}</p>
          <p className="mt-1 text-base leading-6 text-ink">{message.body}</p>
        </div>
        <MessageMenu
          isMine={isMine}
          onMute={() => onMute(message.anonymousUserId)}
          onReport={() => onReport(message.id)}
        />
      </div>
      <ReactionBar anonymousUserId={anonymousUserId} message={message} onReact={onReact} />
    </article>
  );
}
