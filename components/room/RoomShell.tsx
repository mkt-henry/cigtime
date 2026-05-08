"use client";

import { ArrowLeft, RotateCcw, Users } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/common/Button";
import { RITUAL_OBJECTS } from "@/lib/constants";
import { scrubMessage } from "@/lib/filters";
import {
  getCooldownRemaining,
  getMessages,
  reportMessage,
  saveMessage,
  updateReaction,
} from "@/lib/storage";
import type { ChatMessage, ReactionType, Room } from "@/lib/types";
import { useAnonymousUser } from "@/hooks/useAnonymousUser";
import { useMutedUsers } from "@/hooks/useMutedUsers";
import { useSessionTimer } from "@/hooks/useSessionTimer";
import { ChatFeed } from "./ChatFeed";
import { ChatInput } from "./ChatInput";
import { RitualObject } from "./RitualObject";
import { SessionTimer } from "./SessionTimer";

export function RoomShell({ room }: { room: Room }) {
  const anonymousUser = useAnonymousUser();
  const { mutedUsers, mute } = useMutedUsers();
  const timer = useSessionTimer();
  const [objectKey, setObjectKey] = useState(RITUAL_OBJECTS[0].key);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [droppedCount, setDroppedCount] = useState(0);

  const selectedObject = RITUAL_OBJECTS.find((object) => object.key === objectKey) ?? RITUAL_OBJECTS[0];

  useEffect(() => {
    setMessages(getMessages(room.slug));
  }, [room.slug]);

  const visibleMessages = useMemo(
    () => messages.filter((message) => !mutedUsers.includes(message.anonymousUserId)),
    [messages, mutedUsers],
  );

  function send(body: string) {
    if (!anonymousUser) return "Preparing your anonymous room.";

    const cooldown = getCooldownRemaining();
    if (cooldown > 0) {
      return `Wait ${cooldown}s before sending again.`;
    }

    const message: ChatMessage = {
      id: crypto.randomUUID(),
      roomSlug: room.slug,
      anonymousUserId: anonymousUser.id,
      nickname: anonymousUser.nickname,
      body: scrubMessage(body),
      createdAt: new Date().toISOString(),
      reactions: {
        same: [],
        real: [],
        oof: [],
        lol: [],
        hug: [],
      },
    };

    saveMessage(message);
    setMessages(getMessages(room.slug));
    setDroppedCount((value) => value + 1);
    return null;
  }

  function react(messageId: string, reactionType: ReactionType) {
    if (!anonymousUser) return;
    updateReaction(messageId, anonymousUser.id, reactionType);
    setMessages(getMessages(room.slug));
  }

  function report(messageId: string) {
    reportMessage(messageId);
    setMessages(getMessages(room.slug));
  }

  function restart() {
    timer.restart();
    setDroppedCount(0);
  }

  if (!anonymousUser) {
    return (
      <main className="grid min-h-screen place-items-center px-4">
        <p className="rounded-md border border-line bg-white px-4 py-3 font-semibold">Opening room...</p>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-3 py-3 sm:px-4">
      <header className="mb-3 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-line bg-white/85 px-4 py-3">
        <div className="flex items-center gap-3">
          <Link
            aria-label="Back to rooms"
            className="inline-flex h-10 w-10 items-center justify-center rounded-md hover:bg-neutral-100"
            href="/rooms"
          >
            <ArrowLeft size={20} aria-hidden />
          </Link>
          <div>
            <p className="text-lg font-black">cigtime</p>
            <p className="text-sm font-semibold text-neutral-600">{anonymousUser.nickname}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 rounded-md border border-line px-3 py-2 text-sm font-bold text-neutral-700 sm:flex">
            <Users size={17} aria-hidden />
            {214 + visibleMessages.length} online
          </div>
          <SessionTimer remainingSec={timer.remainingSec} />
        </div>
      </header>

      <section className="mb-3 grid gap-3 lg:grid-cols-[1fr_390px]">
        <div className="rounded-lg border border-line bg-white/80 p-4">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-black uppercase text-neutral-500">Room</p>
              <h1 className="text-2xl font-black">{room.name}</h1>
            </div>
            <select
              className="h-10 rounded-md border border-line bg-white px-3 text-sm font-bold outline-none focus:border-ink"
              onChange={(event) => setObjectKey(event.target.value)}
              value={objectKey}
            >
              {RITUAL_OBJECTS.map((object) => (
                <option key={object.key} value={object.key}>
                  {object.name}
                </option>
              ))}
            </select>
          </div>
          <RitualObject
            isAccelerating={timer.isAccelerating}
            object={selectedObject}
            onFilterHoldEnd={selectedObject.key === "cigarette" ? timer.stopAccelerating : undefined}
            onFilterHoldStart={selectedObject.key === "cigarette" ? timer.startAccelerating : undefined}
            progress={timer.progress}
            roomSlug={room.slug}
          />
          <p className="mt-3 text-sm font-semibold text-neutral-600">{selectedObject.action}</p>
        </div>

        <aside className="flex h-[520px] min-h-0 flex-col overflow-hidden rounded-lg border border-line bg-white">
          <div className="border-b border-line px-4 py-3">
            <p className="text-sm font-black text-neutral-500">Live thoughts</p>
          </div>
          <ChatFeed
            anonymousUserId={anonymousUser.id}
            messages={visibleMessages}
            onMute={mute}
            onReact={react}
            onReport={report}
          />
          <ChatInput disabled={room.isSilent} onSend={send} placeholder={room.placeholder} />
        </aside>
      </section>

      {timer.isDone ? (
        <section className="fixed inset-0 z-20 grid place-items-center bg-ink/45 px-4">
          <div className="w-full max-w-md rounded-lg border border-line bg-white p-6 shadow-soft">
            <h2 className="text-3xl font-black">That&apos;s your cigtime.</h2>
            <p className="mt-4 text-lg leading-7 text-neutral-700">
              You dropped {droppedCount} thought{droppedCount === 1 ? "" : "s"}.
              <br />
              {visibleMessages.reduce(
                (sum, message) =>
                  sum + Object.values(message.reactions).reduce((total, users) => total + users.length, 0),
                0,
              )}{" "}
              people felt it.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button onClick={restart} type="button">
                <RotateCcw size={18} aria-hidden />
                Take another
              </Button>
              <Link
                className="inline-flex h-11 items-center justify-center rounded-md border border-line px-4 text-sm font-semibold hover:border-ink"
                href="/"
              >
                Leave lighter
              </Link>
            </div>
          </div>
        </section>
      ) : null}
    </main>
  );
}
