"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAnonymousUser } from "@/hooks/useAnonymousUser";
import type { ReactionType } from "@/lib/types";

type InboxMessage = {
  id: string;
  body: string;
  createdAt: string;
  room: { slug: string; name: string } | null;
  reactions: Array<{ reaction_type: ReactionType; created_at: string }>;
};

export function ReactionInbox() {
  const anonymousUser = useAnonymousUser();
  const [messages, setMessages] = useState<InboxMessage[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    if (!anonymousUser) return;
    const user = anonymousUser;
    let cancelled = false;

    async function load() {
      try {
        const response = await fetch(
          `/api/reactions?anonymousUserId=${encodeURIComponent(user.id)}`,
          { cache: "no-store" },
        );
        const data = await response.json();
        if (!response.ok) throw new Error(data.error);
        if (!cancelled) {
          setMessages(data.messages ?? []);
          setStatus("ready");
        }
      } catch {
        if (!cancelled) setStatus("error");
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [anonymousUser]);

  if (status === "loading") return <p className="text-neutral-500">Loading reactions...</p>;
  if (status === "error") return <p className="text-rust">Reactions could not be loaded.</p>;
  if (messages.length === 0) {
    return (
      <div className="rounded-lg border border-line bg-white/80 p-6">
        <p className="font-semibold text-neutral-600">No reactions yet.</p>
        <Link className="mt-4 inline-block font-bold text-moss hover:underline" href="/room/rooftop">
          Drop a thought in The Rooftop
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {messages.map((message) => {
        const counts = new Map<ReactionType, number>();
        for (const reaction of message.reactions) {
          counts.set(reaction.reaction_type, (counts.get(reaction.reaction_type) ?? 0) + 1);
        }
        return (
          <article className="rounded-lg border border-line bg-white/85 p-5 shadow-sm" key={message.id}>
            <p className="text-sm font-bold text-neutral-500">{message.room?.name ?? "cigtime"}</p>
            <p className="mt-2 text-lg font-semibold leading-7">{message.body}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {[...counts].map(([reaction, count]) => (
                <span className="rounded-md bg-neutral-100 px-2.5 py-1 text-xs font-black" key={reaction}>
                  {reaction} {count}
                </span>
              ))}
            </div>
          </article>
        );
      })}
    </div>
  );
}
