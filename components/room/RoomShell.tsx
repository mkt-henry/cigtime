"use client";

import { ArrowLeft, Flag, ImagePlus, RotateCcw, Send, Timer, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import type { FormEvent, MouseEvent } from "react";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { Button } from "@/components/common/Button";
import { REACTIONS, RITUAL_OBJECTS } from "@/lib/constants";
import { scrubMessage, validateMessage } from "@/lib/filters";
import {
  clearRoomBackground,
  getRoomBackground,
  saveRoomBackground,
} from "@/lib/storage";
import { trackEvent } from "@/lib/analytics";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import type { ReactionType, Room, SharedMessage } from "@/lib/types";
import { useAnonymousUser } from "@/hooks/useAnonymousUser";
import { useSessionTimer } from "@/hooks/useSessionTimer";
import { RitualObject } from "./RitualObject";

type FloatingMsg = {
  message: SharedMessage;
  phase: "visible" | "disappearing";
  target: MessageTarget;
};

type MessageTarget = {
  x: number;
  y: number;
};

export function RoomShell({ room }: { room: Room }) {
  const anonymousUser = useAnonymousUser();
  const timer = useSessionTimer();
  const [objectKey, setObjectKey] = useState(RITUAL_OBJECTS[0].key);
  const [droppedCount, setDroppedCount] = useState(0);
  const [roomBackground, setRoomBackground] = useState<string | null>(null);
  const [showInput, setShowInput] = useState(false);
  const [floatingMessages, setFloatingMessages] = useState<FloatingMsg[]>([]);
  const [messageTarget, setMessageTarget] = useState<MessageTarget | null>(null);
  const [inputBody, setInputBody] = useState("");
  const [inputError, setInputError] = useState<string | null>(null);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [sessionRun, setSessionRun] = useState(0);
  const [todayCigaretteCount, setTodayCigaretteCount] = useState(0);
  const [onlineCount, setOnlineCount] = useState(1);
  const [connectionStatus, setConnectionStatus] = useState<"connecting" | "live" | "unavailable">("connecting");
  const [isSending, setIsSending] = useState(false);
  const backgroundInputRef = useRef<HTMLInputElement>(null);
  const chatInputRef = useRef<HTMLInputElement>(null);
  const completedSessionRef = useRef<string | null>(null);
  const realtimeChannelRef = useRef<RealtimeChannel | null>(null);

  const selectedObject = RITUAL_OBJECTS.find((object) => object.key === objectKey) ?? RITUAL_OBJECTS[0];

  const addMessage = useCallback((message: SharedMessage) => {
    setFloatingMessages((current) => {
      if (current.some((item) => item.message.id === message.id)) return current;
      return [...current, { message, phase: "visible" as const, target: getRandomMessageTarget() }].slice(-6);
    });
  }, []);

  const syncMessages = useCallback(async () => {
    const response = await fetch(`/api/messages?roomSlug=${encodeURIComponent(room.slug)}`, {
      cache: "no-store",
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error ?? "Messages are unavailable.");

    const latest = ((data.messages ?? []) as SharedMessage[]).slice(-6);
    setFloatingMessages((current) => {
      const existing = new Map(current.map((item) => [item.message.id, item]));
      return latest.map((message) => {
        const item = existing.get(message.id);
        return item
          ? { ...item, message }
          : { message, phase: "visible" as const, target: getRandomMessageTarget() };
      });
    });
    return data.roomId as string | undefined;
  }, [room.slug]);

  useEffect(() => {
    setRoomBackground(getRoomBackground(room.slug));
  }, [room.slug]);

  useEffect(() => {
    if (!anonymousUser) return;
    void trackEvent({
      anonymousUserId: anonymousUser.id,
      eventName: "room_entered",
      roomSlug: room.slug,
    });
  }, [anonymousUser, room.slug]);

  useEffect(() => {
    if (!anonymousUser) return;

    const user = anonymousUser;
    const supabase = createBrowserSupabaseClient();
    let disposed = false;
    let channel: RealtimeChannel | null = null;

    async function connect() {
      try {
        const roomId = await syncMessages();
        if (disposed) return;

        if (!supabase || typeof roomId !== "string") {
          setConnectionStatus("unavailable");
          return;
        }

        channel = supabase
          .channel(`room:${room.slug}`, { config: { presence: { key: user.id } } })
          .on(
            "postgres_changes",
            {
              event: "INSERT",
              filter: `room_id=eq.${roomId}`,
              schema: "public",
              table: "messages",
            },
            (payload) => {
              const row = payload.new as Record<string, string | null>;
              addMessage({
                id: String(row.id),
                roomSlug: room.slug,
                sessionId: row.session_id,
                anonymousUserId: String(row.anonymous_user_id),
                nickname: String(row.nickname),
                body: String(row.body),
                createdAt: String(row.created_at),
                reactions: [],
              });
            },
          )
          .on(
            "postgres_changes",
            { event: "*", schema: "public", table: "reactions" },
            (payload) => {
              const row = payload.new as Record<string, string>;
              if (!row.message_id || !REACTIONS.includes(row.reaction_type as ReactionType)) return;
              setFloatingMessages((current) =>
                current.map((item) => {
                  if (item.message.id !== row.message_id) return item;
                  const reactions = item.message.reactions.filter(
                    (reaction) => reaction.anonymous_user_id !== row.anonymous_user_id,
                  );
                  reactions.push({
                    anonymous_user_id: row.anonymous_user_id,
                    reaction_type: row.reaction_type as ReactionType,
                  });
                  return { ...item, message: { ...item.message, reactions } };
                }),
              );
            },
          )
          .on("broadcast", { event: "refresh" }, () => {
            void syncMessages();
          })
          .on("presence", { event: "sync" }, () => {
            if (!channel) return;
            setOnlineCount(Math.max(1, Object.keys(channel.presenceState()).length));
          })
          .subscribe(async (status) => {
            if (status === "SUBSCRIBED" && channel) {
              setConnectionStatus("live");
              await channel.track({ joinedAt: new Date().toISOString() });
            } else if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
              setConnectionStatus("unavailable");
            }
          });
        realtimeChannelRef.current = channel;
      } catch {
        if (!disposed) setConnectionStatus("unavailable");
      }
    }

    void connect();

    return () => {
      disposed = true;
      realtimeChannelRef.current = null;
      if (channel && supabase) void supabase.removeChannel(channel);
    };
  }, [addMessage, anonymousUser, room.slug, syncMessages]);

  useEffect(() => {
    let cancelled = false;

    async function loadTodayCount() {
      try {
        const response = await fetch("/api/sessions", { cache: "no-store" });
        if (!response.ok) return;
        const data = await response.json();
        if (!cancelled && typeof data.todayCigaretteCount === "number") {
          setTodayCigaretteCount(data.todayCigaretteCount);
        }
      } catch {
        // Keep the scene usable without the shared counter.
      }
    }

    void loadTodayCount();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!anonymousUser) return;

    const user = anonymousUser;
    let cancelled = false;
    completedSessionRef.current = null;
    setActiveSessionId(null);

    async function createSession() {
      try {
        const response = await fetch("/api/sessions", {
          body: JSON.stringify({
            anonymousUserId: user.id,
            nickname: user.nickname,
            objectKey,
            roomSlug: room.slug,
          }),
          headers: { "Content-Type": "application/json" },
          method: "POST",
        });

        if (!response.ok) return;
        const data = await response.json();

        if (!cancelled && typeof data.id === "string") {
          setActiveSessionId(data.id);
        }
      } catch {
        // Local interaction still works when the DB is unavailable.
      }
    }

    void createSession();

    return () => {
      cancelled = true;
    };
  }, [anonymousUser, objectKey, room.slug, sessionRun]);

  useEffect(() => {
    if (!anonymousUser || !timer.isDone || !activeSessionId || completedSessionRef.current === activeSessionId) return;

    const anonymousUserId = anonymousUser.id;
    completedSessionRef.current = activeSessionId;

    async function completeSession() {
      try {
        const response = await fetch("/api/sessions", {
          body: JSON.stringify({
            anonymousUserId,
            id: activeSessionId,
            status: "completed",
          }),
          headers: { "Content-Type": "application/json" },
          method: "PATCH",
        });

        if (!response.ok) return;
        const data = await response.json();

        if (typeof data.todayCigaretteCount === "number") {
          setTodayCigaretteCount(data.todayCigaretteCount);
        }
      } catch {
        // Shared ashtray is best-effort.
      }
    }

    void completeSession();
  }, [activeSessionId, anonymousUser, timer.isDone]);

  useEffect(() => {
    if (showInput) {
      const t = setTimeout(() => chatInputRef.current?.focus(), 50);
      return () => clearTimeout(t);
    }
  }, [showInput]);

  useEffect(() => {
    if (!showInput) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setShowInput(false);
        setInputError(null);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showInput]);

  function handleSceneClick(event: MouseEvent<HTMLElement>) {
    if (showInput) {
      setShowInput(false);
      setInputError(null);
    } else {
      setMessageTarget(getMessageTarget(event.clientX, event.clientY));
      setShowInput(true);
    }
  }

  async function send(event: FormEvent) {
    event.preventDefault();
    if (!anonymousUser) return;

    const validationError = validateMessage(inputBody);
    if (validationError) {
      setInputError(validationError);
      return;
    }

    if (!activeSessionId) {
      setInputError("The shared room is still connecting. Try again in a moment.");
      return;
    }

    const scrubbedBody = scrubMessage(inputBody);
    setIsSending(true);
    setInputError(null);

    try {
      const response = await fetch("/api/messages", {
        body: JSON.stringify({
          anonymousUserId: anonymousUser.id,
          body: scrubbedBody,
          nickname: anonymousUser.nickname,
          roomSlug: room.slug,
          sessionId: activeSessionId,
        }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Message could not be sent.");

      const message = { ...data, reactions: [] } as SharedMessage;
      setFloatingMessages((current) => [
        ...current.filter((item) => item.message.id !== message.id),
        {
          message,
          phase: "visible" as const,
          target: messageTarget ?? getDefaultMessageTarget(),
        },
      ].slice(-6));
      setDroppedCount((value) => value + 1);
      void realtimeChannelRef.current?.send({
        type: "broadcast",
        event: "refresh",
        payload: { messageId: message.id },
      });
      setInputBody("");
      setMessageTarget(null);
      setShowInput(false);
    } catch (error) {
      setInputError(error instanceof Error ? error.message : "Message could not be sent.");
    } finally {
      setIsSending(false);
    }
  }

  async function react(messageId: string, reactionType: ReactionType) {
    if (!anonymousUser) return;

    const applyReaction = (current: FloatingMsg[]) =>
      current.map((item) => {
        if (item.message.id !== messageId) return item;
        const reactions = item.message.reactions.filter(
          (reaction) => reaction.anonymous_user_id !== anonymousUser.id,
        );
        reactions.push({ anonymous_user_id: anonymousUser.id, reaction_type: reactionType });
        return { ...item, message: { ...item.message, reactions } };
      });

    setFloatingMessages(applyReaction);

    const response = await fetch("/api/reactions", {
      body: JSON.stringify({ anonymousUserId: anonymousUser.id, messageId, reactionType }),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    });
    if (!response.ok) {
      const data = await response.json().catch(() => null);
      setInputError(data?.error ?? "Reaction could not be saved.");
    } else {
      void realtimeChannelRef.current?.send({
        type: "broadcast",
        event: "refresh",
        payload: { messageId },
      });
    }
  }

  async function report(messageId: string) {
    if (!anonymousUser) return;
    const response = await fetch("/api/reports", {
      body: JSON.stringify({
        messageId,
        reason: "other",
        reporterAnonymousUserId: anonymousUser.id,
      }),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    });

    if (response.ok) {
      setFloatingMessages((current) => current.filter((item) => item.message.id !== messageId));
      return;
    }

    const data = await response.json().catch(() => null);
    setInputError(data?.error ?? "Report could not be submitted.");
  }

  function restart() {
    timer.restart();
    setDroppedCount(0);
    setFloatingMessages([]);
    setSessionRun((value) => value + 1);
    if (anonymousUser) {
      void trackEvent({
        anonymousUserId: anonymousUser.id,
        eventName: "session_restarted",
        roomSlug: room.slug,
      });
    }
  }

  async function updateRoomBackground(file: File | undefined) {
    if (!file || !file.type.startsWith("image/")) return;
    try {
      const imageDataUrl = await resizeRoomBackground(file);
      saveRoomBackground(room.slug, imageDataUrl);
      setRoomBackground(imageDataUrl);
    } catch {
      // silently fail
    } finally {
      if (backgroundInputRef.current) backgroundInputRef.current.value = "";
    }
  }

  function removeRoomBackground() {
    clearRoomBackground(room.slug);
    setRoomBackground(null);
  }

  if (!anonymousUser) {
    return (
      <main className="grid min-h-screen place-items-center px-4">
        <p className="rounded-md border border-line bg-white px-4 py-3 font-semibold">Opening room...</p>
      </main>
    );
  }

  const minutes = Math.floor(timer.remainingSec / 60);
  const seconds = String(timer.remainingSec % 60).padStart(2, "0");
  const reactionsReceived = floatingMessages
    .filter((item) => item.message.anonymousUserId === anonymousUser.id)
    .reduce((total, item) => total + item.message.reactions.length, 0);

  return (
    <main
      aria-label="Interactive cigtime room. Press Enter to share a thought."
      className="fixed inset-0 overflow-hidden"
      onClick={handleSceneClick}
      onKeyDown={(event) => {
        if (event.target !== event.currentTarget || (event.key !== "Enter" && event.key !== " ")) return;
        event.preventDefault();
        setMessageTarget(getDefaultMessageTarget());
        setShowInput(true);
      }}
      tabIndex={0}
    >
      {/* Full screen scene */}
      <div className="absolute inset-0">
        <RitualObject
          backgroundImage={roomBackground}
          fullscreen
          isAccelerating={timer.isAccelerating}
          object={selectedObject}
          onFilterHoldEnd={selectedObject.key === "cigarette" ? timer.stopAccelerating : undefined}
          onFilterHoldStart={selectedObject.key === "cigarette" ? timer.startAccelerating : undefined}
          progress={timer.progress}
          roomSlug={room.slug}
        />
      </div>

      <SharedAshtray count={todayCigaretteCount} />

      {/* Top HUD */}
      <div
        className="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-4 py-3"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2">
          <Link
            aria-label="Back to rooms"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-black/30 text-white backdrop-blur-sm transition hover:bg-black/45"
            href="/rooms"
          >
            <ArrowLeft size={18} aria-hidden />
          </Link>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-white/55">{room.name}</p>
            <p className="text-sm font-bold leading-tight text-white drop-shadow">{anonymousUser.nickname}</p>
            <p className="text-[10px] font-semibold text-white/50">
              {connectionStatus === "live" ? `${onlineCount} online` : connectionStatus}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <select
            className="h-9 rounded-md border border-white/20 bg-black/30 px-2 text-sm font-bold text-white backdrop-blur-sm outline-none"
            onChange={(event) => setObjectKey(event.target.value)}
            value={objectKey}
          >
            {RITUAL_OBJECTS.map((object) => (
              <option className="bg-neutral-900 text-white" key={object.key} value={object.key}>
                {object.name}
              </option>
            ))}
          </select>
          <input
            accept="image/*"
            className="sr-only"
            onChange={(event) => void updateRoomBackground(event.target.files?.[0])}
            ref={backgroundInputRef}
            type="file"
          />
          <button
            aria-label="Upload room background"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-black/30 text-white backdrop-blur-sm transition hover:bg-black/45"
            onClick={() => backgroundInputRef.current?.click()}
            type="button"
          >
            <ImagePlus size={16} aria-hidden />
          </button>
          {roomBackground && (
            <button
              aria-label="Remove room background"
              className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-black/30 text-white backdrop-blur-sm transition hover:bg-black/45"
              onClick={removeRoomBackground}
              type="button"
            >
              <Trash2 size={15} aria-hidden />
            </button>
          )}
          <div className="inline-flex items-center gap-1.5 rounded-md bg-black/30 px-3 py-2 font-mono text-sm font-black text-white backdrop-blur-sm">
            <Timer size={14} aria-hidden />
            {minutes}:{seconds}
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="absolute inset-x-0 bottom-0 z-10 h-0.5 bg-white/10">
        <div className="h-full bg-moss transition-all duration-300" style={{ width: `${timer.progress * 100}%` }} />
      </div>

      {/* Floating messages */}
      <div className="pointer-events-none absolute inset-0 z-10">
        {floatingMessages.slice(-6).map((msg) => (
          <FloatingMessage
            anonymousUserId={anonymousUser.id}
            key={msg.message.id}
            message={msg}
            onReact={react}
            onReport={report}
          />
        ))}
      </div>

      {/* Tap hint */}
      {!showInput && floatingMessages.length === 0 && (
        <div className="pointer-events-none absolute inset-x-0 bottom-7 z-10 text-center">
          <p className="text-xs font-medium text-white/30">tap to share a thought</p>
        </div>
      )}

      {/* Chat input overlay */}
      {showInput && (
        <div
          className="absolute inset-x-0 bottom-0 z-30 bg-gradient-to-t from-black/70 via-black/30 to-transparent px-4 pb-4 pt-16"
          onClick={(e) => e.stopPropagation()}
        >
          <form className="flex flex-col gap-2" onSubmit={send}>
            <div className="flex gap-2">
              <input
                autoComplete="off"
                className="h-11 min-w-0 flex-1 rounded-lg border border-white/20 bg-white/10 px-4 text-sm font-medium text-white placeholder:text-white/40 outline-none backdrop-blur-md transition focus:border-white/50 focus:bg-white/15"
                disabled={room.isSilent || isSending}
                maxLength={140}
                onChange={(event) => setInputBody(event.target.value)}
                placeholder={room.isSilent ? "This room stays silent." : room.placeholder}
                ref={chatInputRef}
                value={inputBody}
              />
              <button
                className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-moss text-white transition hover:brightness-110 disabled:opacity-50"
                disabled={room.isSilent || isSending || !activeSessionId}
                type="submit"
              >
                <Send size={18} aria-hidden />
              </button>
            </div>
            <div className="flex items-center justify-between px-1">
              <p className="text-xs font-medium">
                {inputError ? (
                  <span className="text-rust">{inputError}</span>
                ) : (
                  <span className="text-white/35">
                    {connectionStatus === "live" ? "anonymous · live room" : "connecting to shared room"}
                  </span>
                )}
              </p>
              <p className="text-xs font-medium text-white/35">{inputBody.length}/140</p>
            </div>
          </form>
        </div>
      )}

      {/* Session end modal */}
      {timer.isDone && (
        <section className="fixed inset-0 z-40 grid place-items-center bg-ink/45 px-4">
          <div className="w-full max-w-md rounded-lg border border-line bg-white p-6 shadow-soft">
            <h2 className="text-3xl font-black">That&apos;s your cigtime.</h2>
            <p className="mt-4 text-lg leading-7 text-neutral-700">
              You dropped {droppedCount} thought{droppedCount === 1 ? "" : "s"}.
            </p>
            <p className="mt-1 text-sm font-semibold text-neutral-500">
              {reactionsReceived} reaction{reactionsReceived === 1 ? "" : "s"} received.
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
      )}
    </main>
  );
}

function SharedAshtray({ count }: { count: number }) {
  const visibleCount = Math.min(24, Math.max(0, count));
  const butts = Array.from({ length: visibleCount }, (_, index) => ({
    bottom: 9 + (index % 3) * 8 + Math.floor(index / 12) * 3,
    left: 10 + ((index * 29) % 82),
    rotate: -18 + ((index * 37) % 72),
  }));

  return (
    <div
      aria-label={`${count} cigarettes finished today`}
      className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex justify-center px-4 pb-2"
    >
      <div className="relative h-20 w-[min(28rem,82vw)]">
        <div className="absolute bottom-0 left-1/2 h-8 w-full -translate-x-1/2 rounded-[50%] border border-white/10 bg-black/30 backdrop-blur-[1px]" />
        <div className="absolute bottom-1 left-1/2 h-4 w-[86%] -translate-x-1/2 rounded-[50%] bg-black/20" />
        {butts.map((butt, index) => (
          <span
            className="absolute h-3 w-9 rounded-[3px] border border-black/15 bg-[linear-gradient(90deg,#9a6842_0_34%,#e9dfc8_34%_78%,#5f5f58_78%_100%)] shadow-[0_1px_2px_rgba(0,0,0,0.2)]"
            key={index}
            style={{
              bottom: `${butt.bottom}px`,
              left: `${butt.left}%`,
              transform: `translateX(-50%) rotate(${butt.rotate}deg)`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

function FloatingMessage({
  message,
  anonymousUserId,
  onReact,
  onReport,
}: {
  message: FloatingMsg;
  anonymousUserId: string;
  onReact: (messageId: string, reactionType: ReactionType) => void;
  onReport: (messageId: string) => void;
}) {
  const isDisappearing = message.phase === "disappearing";
  const isMine = message.message.anonymousUserId === anonymousUserId;

  return (
    <div
      className="pointer-events-auto absolute"
      onClick={(event) => event.stopPropagation()}
      style={{
        left: `${message.target.x}px`,
        maxWidth: "min(22rem, calc(100vw - 2rem))",
        top: `${message.target.y}px`,
        transform: "translate(-50%, -50%)",
      }}
    >
      <motion.div
        className="relative rounded-xl px-5 py-3 text-center text-sm font-medium text-white shadow-xl backdrop-blur-sm"
        style={{
          background: "rgba(12, 12, 12, 0.62)",
          border: "1px solid rgba(255,255,255,0.1)",
          maxWidth: "100%",
          overflow: "visible",
          wordBreak: "break-word",
        }}
        initial={{ opacity: 0, y: 10, scale: 0.96, filter: "blur(0px)" }}
        animate={
          isDisappearing
            ? { opacity: 0, y: -30, scale: 0.93, filter: "blur(5px)" }
            : { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }
        }
        transition={
          isDisappearing
            ? { duration: 2, ease: "easeIn" }
            : { duration: 0.35, ease: "easeOut" }
        }
      >
        <p className="text-[10px] font-bold text-white/55">
          {isMine ? "you" : message.message.nickname}
        </p>
        <p className="mt-1">{message.message.body}</p>
        {!isMine && (
          <button
            aria-label="Report message"
            className="absolute right-1.5 top-1.5 rounded p-1 text-white/30 transition hover:bg-white/10 hover:text-white/70"
            onClick={() => onReport(message.message.id)}
            type="button"
          >
            <Flag aria-hidden size={11} />
          </button>
        )}
        <div className="mt-2 flex flex-wrap justify-center gap-1">
            {REACTIONS.map((reactionType) => {
              const reactions = message.message.reactions.filter(
                (reaction) => reaction.reaction_type === reactionType,
              );
              const active = reactions.some(
                (reaction) => reaction.anonymous_user_id === anonymousUserId,
              );
              return (
                <button
                  className={`rounded px-1.5 py-0.5 text-[10px] font-bold transition ${
                    active ? "bg-moss text-white" : "bg-white/10 text-white/65 hover:bg-white/20"
                  }`}
                  key={reactionType}
                  disabled={isMine}
                  onClick={() => onReact(message.message.id, reactionType)}
                  type="button"
                >
                  {reactionType}{reactions.length > 0 ? ` ${reactions.length}` : ""}
                </button>
              );
            })}
          </div>
        {isDisappearing && (
          <>
            <span className="ash-crumb ash-crumb-a" style={{ left: "18%", bottom: "-4px" }} />
            <span className="ash-crumb ash-crumb-b" style={{ left: "48%", bottom: "-3px" }} />
            <span className="ash-crumb ash-crumb-c" style={{ left: "72%", bottom: "-5px" }} />
            <span className="ash-crumb ash-crumb-a" style={{ left: "33%", bottom: "-2px", animationDelay: "0.2s" }} />
          </>
        )}
      </motion.div>
    </div>
  );
}

function getMessageTarget(x: number, y: number): MessageTarget {
  const horizontalMargin = 24;
  const verticalMargin = 48;

  return {
    x: clamp(x, horizontalMargin, window.innerWidth - horizontalMargin),
    y: clamp(y, verticalMargin, window.innerHeight - verticalMargin),
  };
}

function getDefaultMessageTarget(): MessageTarget {
  return {
    x: window.innerWidth / 2,
    y: window.innerHeight * 0.55,
  };
}

function getRandomMessageTarget(): MessageTarget {
  return {
    x: clamp(window.innerWidth * (0.2 + Math.random() * 0.6), 28, window.innerWidth - 28),
    y: clamp(window.innerHeight * (0.24 + Math.random() * 0.48), 56, window.innerHeight - 112),
  };
}

function clamp(value: number, min: number, max: number) {
  if (max < min) return min;
  return Math.min(max, Math.max(min, value));
}

function resizeRoomBackground(file: File) {
  return new Promise<string>((resolve, reject) => {
    const imageUrl = URL.createObjectURL(file);
    const image = document.createElement("img");

    image.onload = () => {
      URL.revokeObjectURL(imageUrl);
      const maxSize = 1600;
      const scale = Math.min(1, maxSize / Math.max(image.naturalWidth, image.naturalHeight));
      const width = Math.max(1, Math.round(image.naturalWidth * scale));
      const height = Math.max(1, Math.round(image.naturalHeight * scale));
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const context = canvas.getContext("2d");
      if (!context) {
        reject(new Error("Canvas is unavailable."));
        return;
      }
      context.drawImage(image, 0, 0, width, height);
      resolve(canvas.toDataURL("image/jpeg", 0.82));
    };

    image.onerror = () => {
      URL.revokeObjectURL(imageUrl);
      reject(new Error("Image could not be loaded."));
    };

    image.src = imageUrl;
  });
}
