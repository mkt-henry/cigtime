"use client";

import { ArrowLeft, ImagePlus, RotateCcw, Send, Trash2 } from "lucide-react";
import { MotionConfig, motion } from "framer-motion";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import type { FormEvent, MouseEvent } from "react";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { Button, LinkButton } from "@/components/common/Button";
import {
  REACTIONS,
  RITUAL_OBJECTS,
  SESSION_DURATION_OPTIONS,
  SESSION_DURATION_SEC,
  type ReportReason,
} from "@/lib/constants";
import { ShareCard } from "./ShareCard";
import { scrubMessage, validateMessage } from "@/lib/filters";
import { t, type Lang } from "@/lib/i18n";
import { createNickname } from "@/lib/nickname";
import { getAmbientMessages } from "@/lib/randomMessages";
import {
  clearRoomBackground,
  getRoomBackground,
  getSessionDuration,
  saveRoomBackground,
  saveSessionDuration,
} from "@/lib/storage";
import { trackEvent } from "@/lib/analytics";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import type { ReactionType, Room, SharedMessage } from "@/lib/types";
import { useAnonymousUser } from "@/hooks/useAnonymousUser";
import { useLang } from "@/hooks/useLang";
import { useMutedUsers } from "@/hooks/useMutedUsers";
import { useSessionTimer } from "@/hooks/useSessionTimer";
import { AmbientCanvas } from "./AmbientCanvas";
import { MessageMenu } from "./MessageMenu";
import { RitualObject } from "./RitualObject";

const AMBIENT_PREFIX = "ambient_";

const riseIn = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

// Stable 0..1 value per message so bubbles bob out of phase with each other.
function seedOf(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  return (hash % 1000) / 1000;
}

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
  const [durationSec, setDurationSec] = useState(SESSION_DURATION_SEC);
  const timer = useSessionTimer(durationSec);
  const lang = useLang();
  const copy = t(lang);
  const { mutedUsers, mute } = useMutedUsers();
  const [objectKey, setObjectKey] = useState(RITUAL_OBJECTS[0].key);
  const [droppedCount, setDroppedCount] = useState(0);
  const [lastThought, setLastThought] = useState<string | null>(null);
  const [roomBackground, setRoomBackground] = useState<string | null>(null);
  const [showInput, setShowInput] = useState(false);
  const [floatingMessages, setFloatingMessages] = useState<FloatingMsg[]>([]);
  const [messageTarget, setMessageTarget] = useState<MessageTarget | null>(null);
  const [inputBody, setInputBody] = useState("");
  const [inputError, setInputError] = useState<string | null>(null);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [sessionRun, setSessionRun] = useState(0);
  const [todayCigaretteCount, setTodayCigaretteCount] = useState(0);
  const [sessionReactionCount, setSessionReactionCount] = useState<number | null>(null);
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
      const real = current.filter((item) => !item.message.id.startsWith(AMBIENT_PREFIX));
      return [...real, { message, phase: "visible" as const, target: getRandomMessageTarget() }].slice(-6);
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
      if (latest.length === 0) {
        // Nobody has spoken yet — keep the room warm with ambient thoughts.
        const ambient = current.filter((item) => item.message.id.startsWith(AMBIENT_PREFIX));
        return ambient.length ? ambient : createAmbientMessages(room.slug);
      }
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
    const saved = getSessionDuration();
    if (saved && SESSION_DURATION_OPTIONS.includes(saved)) setDurationSec(saved);
  }, []);

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
    let refreshTimer: ReturnType<typeof setTimeout> | undefined;

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
            // Every client receives every refresh; coalesce bursts into one fetch.
            clearTimeout(refreshTimer);
            refreshTimer = setTimeout(() => void syncMessages(), 1200);
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
        if (disposed) return;
        setConnectionStatus("unavailable");
        setFloatingMessages((current) => (current.length ? current : createAmbientMessages(room.slug)));
      }
    }

    void connect();

    return () => {
      disposed = true;
      clearTimeout(refreshTimer);
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
            durationSec,
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
  }, [anonymousUser, durationSec, objectKey, room.slug, sessionRun]);

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
        if (typeof data.sessionReactionCount === "number") {
          setSessionReactionCount(data.sessionReactionCount);
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
    if (room.isSilent) return;
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

    const validationError = validateMessage(inputBody, lang);
    if (validationError) {
      setInputError(validationError);
      return;
    }

    if (!activeSessionId) {
      setInputError(copy.errorConnecting);
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
      if (!response.ok) throw new Error(data.error ?? copy.errorSend);

      const message = { ...data, reactions: [] } as SharedMessage;
      setFloatingMessages((current) => [
        ...current.filter(
          (item) => item.message.id !== message.id && !item.message.id.startsWith(AMBIENT_PREFIX),
        ),
        {
          message,
          phase: "visible" as const,
          target: messageTarget ?? getDefaultMessageTarget(),
        },
      ].slice(-6));
      setDroppedCount((value) => value + 1);
      setLastThought(scrubbedBody);
      void realtimeChannelRef.current?.send({
        type: "broadcast",
        event: "refresh",
        payload: { messageId: message.id },
      });
      setInputBody("");
      setMessageTarget(null);
      setShowInput(false);
    } catch (error) {
      setInputError(error instanceof Error ? error.message : copy.errorSend);
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
      setInputError(data?.error ?? copy.errorReaction);
    } else {
      void realtimeChannelRef.current?.send({
        type: "broadcast",
        event: "refresh",
        payload: { messageId },
      });
    }
  }

  async function report(messageId: string, reason: ReportReason) {
    if (!anonymousUser) return;
    const response = await fetch("/api/reports", {
      body: JSON.stringify({
        messageId,
        reason,
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
    setInputError(data?.error ?? copy.errorReport);
  }

  function restart() {
    timer.restart();
    setDroppedCount(0);
    setLastThought(null);
    setSessionReactionCount(null);
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

  // A new length starts a fresh cigtime, the same way switching objects does.
  function changeDuration(seconds: number) {
    saveSessionDuration(seconds);
    setDurationSec(seconds);
    setDroppedCount(0);
    setLastThought(null);
    setSessionReactionCount(null);
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
        <p className="text-fog">{copy.opening}</p>
      </main>
    );
  }

  const minutes = Math.floor(timer.remainingSec / 60);
  const seconds = String(timer.remainingSec % 60).padStart(2, "0");
  const visibleMessages = floatingMessages.filter(
    (item) => !mutedUsers.includes(item.message.anonymousUserId),
  );
  const reactionsReceived =
    sessionReactionCount ??
    floatingMessages
      .filter((item) => item.message.anonymousUserId === anonymousUser.id)
      .reduce((total, item) => total + item.message.reactions.length, 0);

  return (
    <MotionConfig reducedMotion="user">
    <main
      aria-label={copy.roomAria}
      className="fixed inset-0 overflow-hidden"
      onClick={handleSceneClick}
      onKeyDown={(event) => {
        if (room.isSilent) return;
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

      <AmbientCanvas intensity={timer.isAccelerating ? 2.2 : 1} />

      <SharedAshtray label={copy.ashtrayLabel(todayCigaretteCount)} />

      {/* Top HUD */}
      <div
        className="absolute inset-x-0 top-0 z-20 flex flex-wrap items-center justify-between gap-x-3 gap-y-3 px-4 py-4 sm:flex-nowrap sm:px-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex min-w-0 items-center gap-3">
          <Link
            aria-label={copy.backToRooms}
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/15 bg-asphalt/45 text-mist backdrop-blur-md transition hover:bg-asphalt/70"
            href="/rooms"
          >
            <ArrowLeft size={18} aria-hidden />
          </Link>
          <div className="min-w-0 drop-shadow-[0_1px_8px_rgba(0,0,0,0.5)]">
            <p className="truncate font-display text-2xl font-black uppercase leading-none text-mist">{room.name}</p>
            <p className="mt-1 truncate text-xs text-fog">
              <span className="hidden sm:inline">{anonymousUser.nickname}</span>
              <span className="mx-1.5 hidden h-1 w-1 rounded-full bg-fog/60 align-middle sm:inline-block" aria-hidden />
              {connectionStatus === "live"
                ? copy.online(onlineCount)
                : connectionStatus === "connecting"
                  ? copy.statusConnecting
                  : copy.statusUnavailable}
            </p>
          </div>
        </div>
        <div className="contents sm:flex sm:items-center sm:gap-4">
          <div className="order-last flex h-10 items-center divide-x divide-white/10 rounded-full border border-white/15 bg-asphalt/45 px-1 text-sm text-mist backdrop-blur-md max-sm:ml-auto sm:order-first">
            <select
              aria-label={copy.objectLabel}
              className="h-full cursor-pointer rounded-full bg-transparent pl-3 pr-1 outline-none focus-visible:ring-2 focus-visible:ring-sodium"
              onChange={(event) => setObjectKey(event.target.value)}
              value={objectKey}
            >
              {RITUAL_OBJECTS.map((object) => (
                <option className="bg-slate text-mist" key={object.key} value={object.key}>
                  {object.name}
                </option>
              ))}
            </select>
            <select
              aria-label={copy.durationLabel}
              className="h-full cursor-pointer bg-transparent pl-3 pr-1 outline-none focus-visible:ring-2 focus-visible:ring-sodium"
              onChange={(event) => changeDuration(Number(event.target.value))}
              value={durationSec}
            >
              {SESSION_DURATION_OPTIONS.map((seconds) => (
                <option className="bg-slate text-mist" key={seconds} value={seconds}>
                  {copy.durationOption(seconds / 60)}
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
              aria-label={copy.uploadBackground}
              className="inline-flex h-full w-10 items-center justify-center text-fog transition hover:text-mist"
              onClick={() => backgroundInputRef.current?.click()}
              type="button"
            >
              <ImagePlus size={16} aria-hidden />
            </button>
            {roomBackground && (
              <button
                aria-label={copy.removeBackground}
                className="inline-flex h-full w-10 items-center justify-center text-fog transition hover:text-mist"
                onClick={removeRoomBackground}
                type="button"
              >
                <Trash2 size={15} aria-hidden />
              </button>
            )}
          </div>
          <div
            aria-label={`${minutes}:${seconds}`}
            className={`font-display text-4xl font-black leading-none tabular-nums drop-shadow-[0_1px_10px_rgba(0,0,0,0.5)] ${
              timer.remainingSec > 0 && timer.remainingSec <= 10 ? "pulse-soft text-sodium" : "text-mist"
            }`}
            role="timer"
          >
            {minutes}:{seconds}
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="absolute inset-x-0 bottom-0 z-10 h-[3px] bg-white/10">
        <div className="h-full bg-sodium transition-all duration-300" style={{ width: `${timer.progress * 100}%` }} />
      </div>

      {/* Floating messages */}
      <div className="pointer-events-none absolute inset-0 z-10">
        {visibleMessages.slice(-6).map((msg) => (
          <FloatingMessage
            anonymousUserId={anonymousUser.id}
            key={msg.message.id}
            lang={lang}
            message={msg}
            onMute={mute}
            onReact={react}
            onReport={report}
          />
        ))}
      </div>

      {/* Tap hint */}
      {!showInput && visibleMessages.length === 0 && (
        <div className="pointer-events-none absolute inset-x-0 bottom-8 z-10 text-center">
          <p className="text-sm text-mist/70 drop-shadow">
            {room.isSilent ? copy.silentPlaceholder : copy.tapHint}
          </p>
        </div>
      )}

      {/* Chat input overlay */}
      {showInput && (
        <div
          className="absolute inset-x-0 bottom-0 z-30 bg-gradient-to-t from-asphalt/90 via-asphalt/40 to-transparent px-4 pb-6 pt-20"
          onClick={(e) => e.stopPropagation()}
        >
          <form className="mx-auto flex max-w-xl flex-col gap-2" onSubmit={send}>
            <div className="flex h-14 items-center gap-2 rounded-full border border-white/15 bg-asphalt/60 pl-5 pr-1.5 backdrop-blur-md transition focus-within:border-sodium/70">
              <input
                autoComplete="off"
                className="h-full min-w-0 flex-1 bg-transparent text-[15px] text-mist outline-none placeholder:text-fog/70"
                disabled={room.isSilent || isSending}
                maxLength={140}
                onChange={(event) => setInputBody(event.target.value)}
                placeholder={
                  room.isSilent
                    ? copy.silentPlaceholder
                    : lang === "es"
                      ? room.placeholderEs
                      : room.placeholder
                }
                ref={chatInputRef}
                value={inputBody}
              />
              <button
                aria-label={copy.sendThought}
                className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-sodium text-asphalt transition hover:bg-[#f7b55a] active:scale-95 disabled:opacity-40"
                disabled={room.isSilent || isSending || !activeSessionId}
                type="submit"
              >
                <Send size={18} aria-hidden />
              </button>
            </div>
            <div className="flex items-center justify-between px-5 text-xs">
              {inputError ? (
                <span className="text-ember">{inputError}</span>
              ) : (
                <span className="text-fog/80">{connectionStatus === "live" ? copy.liveRoom : copy.connectingRoom}</span>
              )}
              <span className="tabular-nums text-fog/80">{inputBody.length}/140</span>
            </div>
          </form>
        </div>
      )}

      {/* Session end modal */}
      {timer.isDone && (
        <motion.section
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-40 grid place-items-center bg-asphalt/60 px-4 backdrop-blur-md"
          initial={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            animate="show"
            className="w-full max-w-md rounded-3xl border border-white/10 bg-slate/95 p-8 shadow-soft"
            initial="hidden"
            variants={{
              hidden: { opacity: 0, y: 28, scale: 0.96 },
              show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 140, damping: 18, delayChildren: 0.25, staggerChildren: 0.12 } },
            }}
          >
            <motion.h2 className="font-display text-6xl font-black uppercase leading-[0.85] text-mist" variants={riseIn}>
              {copy.endTitle}
            </motion.h2>
            <motion.p className="mt-6 text-lg text-mist" variants={riseIn}>{copy.endDropped(droppedCount)}</motion.p>
            <motion.p className="mt-1 text-fog" variants={riseIn}>
              {copy.endReactions(reactionsReceived)}
            </motion.p>
            <motion.div className="mt-8 flex flex-col gap-3" variants={riseIn}>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button className="flex-1" onClick={restart} type="button">
                  <RotateCcw size={18} aria-hidden />
                  {copy.takeAnother}
                </Button>
                <LinkButton className="flex-1" href="/" variant="secondary">
                  {copy.leaveLighter}
                </LinkButton>
              </div>
              <ShareCard thought={lastThought} lang={lang} />
            </motion.div>
          </motion.div>
        </motion.section>
      )}
    </main>
    </MotionConfig>
  );
}

// How many cigarettes everyone finished today, as a quiet line in the corner.
function SharedAshtray({ label }: { label: string }) {
  return (
    <p className="pointer-events-none absolute bottom-5 left-5 z-10 hidden text-xs text-fog/80 drop-shadow sm:block">
      {label}
    </p>
  );
}

function FloatingMessage({
  anonymousUserId,
  lang,
  message,
  onMute,
  onReact,
  onReport,
}: {
  anonymousUserId: string;
  lang: Lang;
  message: FloatingMsg;
  onMute: (anonymousUserId: string) => void;
  onReact: (messageId: string, reactionType: ReactionType) => void;
  onReport: (messageId: string, reason: ReportReason) => void;
}) {
  const isDisappearing = message.phase === "disappearing";
  const isMine = message.message.anonymousUserId === anonymousUserId;
  const isAmbient = message.message.id.startsWith(AMBIENT_PREFIX);
  const copy = t(lang);
  const seed = seedOf(message.message.id);

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
        animate={isDisappearing ? undefined : { y: [0, -4, 0] }}
        transition={{ duration: 5 + seed * 3, ease: "easeInOut", repeat: Infinity, delay: seed * 2 }}
      >
      <motion.div
        className="relative max-w-full break-words rounded-2xl border border-white/10 bg-asphalt/60 px-5 py-3.5 text-center text-[15px] leading-snug text-mist shadow-soft backdrop-blur-md"
        initial={{ opacity: 0, y: 18, scale: 0.9, filter: "blur(6px)" }}
        animate={
          isDisappearing
            ? { opacity: 0, y: -30, scale: 0.93, filter: "blur(5px)" }
            : {
                opacity: 1,
                y: 0,
                scale: 1,
                filter: "blur(0px)",
                boxShadow: isAmbient
                  ? "0 0 0 0 rgba(242,162,60,0)"
                  : ["0 0 0 3px rgba(242,162,60,0.6)", "0 0 0 0 rgba(242,162,60,0)"],
              }
        }
        transition={
          isDisappearing
            ? { duration: 2, ease: "easeIn" }
            : {
                default: { type: "spring", stiffness: 170, damping: 16 },
                filter: { duration: 0.5 },
                boxShadow: { duration: 1.2, ease: "easeOut" },
              }
        }
        whileHover={{ scale: 1.03 }}
      >
        <p className="text-xs text-fog">
          {isMine ? copy.you : message.message.nickname}
        </p>
        <p className="mt-1">{message.message.body}</p>
        {!isMine && !isAmbient && (
          <MessageMenu
            lang={lang}
            onMute={() => onMute(message.message.anonymousUserId)}
            onReport={(reason) => onReport(message.message.id, reason)}
          />
        )}
        {!isAmbient && (
          <div className="mt-2.5 flex flex-wrap justify-center gap-1">
            {REACTIONS.map((reactionType) => {
              const reactions = message.message.reactions.filter(
                (reaction) => reaction.reaction_type === reactionType,
              );
              const active = reactions.some(
                (reaction) => reaction.anonymous_user_id === anonymousUserId,
              );
              return (
                <motion.button
                  aria-pressed={active}
                  whileTap={{ scale: 0.82 }}
                  whileHover={{ scale: 1.08 }}
                  className={`rounded-full px-2.5 py-1 text-xs font-medium transition focus-visible:ring-2 focus-visible:ring-sodium ${
                    active ? "bg-sodium text-asphalt" : "bg-white/10 text-fog hover:bg-white/20 hover:text-mist"
                  }`}
                  key={reactionType}
                  disabled={isMine}
                  onClick={() => onReact(message.message.id, reactionType)}
                  type="button"
                >
                  {reactionType}
                  {reactions.length > 0 ? (
                    <motion.span
                      animate={{ scale: 1 }}
                      className="ml-1 inline-block"
                      initial={{ scale: 1.7 }}
                      key={reactions.length}
                      transition={{ type: "spring", stiffness: 400, damping: 12 }}
                    >
                      {reactions.length}
                    </motion.span>
                  ) : null}
                </motion.button>
              );
            })}
          </div>
        )}
        {isDisappearing && (
          <>
            <span className="ash-crumb ash-crumb-a" style={{ left: "18%", bottom: "-4px" }} />
            <span className="ash-crumb ash-crumb-b" style={{ left: "48%", bottom: "-3px" }} />
            <span className="ash-crumb ash-crumb-c" style={{ left: "72%", bottom: "-5px" }} />
            <span className="ash-crumb ash-crumb-a" style={{ left: "33%", bottom: "-2px", animationDelay: "0.2s" }} />
          </>
        )}
      </motion.div>
      </motion.div>
    </div>
  );
}

// Decorative thoughts shown while the room is empty. They carry the AMBIENT_PREFIX
// so they stay out of reactions, reports, and the DB.
function createAmbientMessages(roomSlug: string): FloatingMsg[] {
  const pool = getAmbientMessages(typeof navigator === "undefined" ? "en" : navigator.language);
  const now = Date.now();

  return Array.from({ length: 3 }, (_, index) => ({
    message: {
      id: `${AMBIENT_PREFIX}${index}`,
      roomSlug,
      sessionId: null,
      anonymousUserId: `${AMBIENT_PREFIX}${index}`,
      nickname: createNickname(),
      body: pool[Math.floor(Math.random() * pool.length)],
      createdAt: new Date(now - (index + 1) * 24_000).toISOString(),
      reactions: [],
    },
    phase: "visible" as const,
    // Spread them out instead of stacking three random targets on top of each other.
    target: getMessageTarget(
      window.innerWidth * (index % 2 === 0 ? 0.32 : 0.68),
      window.innerHeight * (0.28 + index * 0.2),
    ),
  }));
}

// Bubbles are centered on their target and can be up to 22rem wide, so the
// margin has to cover half a bubble or the text runs off screen.
function getHorizontalMargin() {
  return Math.min(184, window.innerWidth * 0.4);
}

function getMessageTarget(x: number, y: number): MessageTarget {
  const horizontalMargin = getHorizontalMargin();
  const verticalMargin = 72;

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
  const horizontalMargin = getHorizontalMargin();
  return {
    x: clamp(
      window.innerWidth * (0.2 + Math.random() * 0.6),
      horizontalMargin,
      window.innerWidth - horizontalMargin,
    ),
    y: clamp(window.innerHeight * (0.24 + Math.random() * 0.48), 96, window.innerHeight - 140),
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
