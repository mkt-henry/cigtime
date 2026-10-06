"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAnonymousUser } from "@/hooks/useAnonymousUser";
import { useLang } from "@/hooks/useLang";
import { t } from "@/lib/i18n";
import type { ReactionType } from "@/lib/types";

type InboxMessage = {
  id: string;
  body: string;
  createdAt: string;
  room: { slug: string; name: string } | null;
  reactions: Array<{ reaction_type: ReactionType; created_at: string }>;
};

export function ReactionInbox() {
  const copy = t(useLang());
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

  if (status === "loading") return <p className="text-fog">{copy.reactionsLoading}</p>;
  if (status === "error") return <p className="text-ember">{copy.reactionsError}</p>;
  if (messages.length === 0) {
    return (
      <div className="rounded-2xl border border-white/10 bg-slate p-7">
        <p className="text-lg text-mist">{copy.reactionsEmpty}</p>
        <Link className="mt-5 inline-flex h-11 items-center rounded-full bg-sodium px-5 text-sm font-semibold text-asphalt transition hover:bg-[#f7b55a]" href="/room/rooftop">
          {copy.reactionsCta}
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-3">
      {messages.map((message) => {
        const counts = new Map<ReactionType, number>();
        for (const reaction of message.reactions) {
          counts.set(reaction.reaction_type, (counts.get(reaction.reaction_type) ?? 0) + 1);
        }
        return (
          <article className="rounded-2xl border border-white/10 bg-slate p-6" key={message.id}>
            <p className="text-sm text-fog">{message.room?.name ?? "cigtime"}</p>
            <p className="mt-2 text-lg leading-relaxed text-mist">{message.body}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {[...counts].map(([reaction, count]) => (
                <span className="rounded-full bg-sodium/15 px-3 py-1 text-xs font-semibold text-sodium" key={reaction}>
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
