"use client";

import { ChatMessage } from "./ChatMessage";
import type { ChatMessage as ChatMessageType, ReactionType } from "@/lib/types";

export function ChatFeed({
  messages,
  anonymousUserId,
  onMute,
  onReact,
  onReport,
}: {
  messages: ChatMessageType[];
  anonymousUserId: string;
  onMute: (anonymousUserId: string) => void;
  onReact: (messageId: string, reactionType: ReactionType) => void;
  onReport: (messageId: string) => void;
}) {
  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto bg-paper p-3">
      {messages.map((message) => (
        <ChatMessage
          anonymousUserId={anonymousUserId}
          key={message.id}
          message={message}
          onMute={onMute}
          onReact={onReact}
          onReport={onReport}
        />
      ))}
    </div>
  );
}
