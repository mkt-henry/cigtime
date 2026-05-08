import { REACTIONS, SEED_MESSAGES } from "./constants";
import type { ChatMessage, ReactionType } from "./types";

const MESSAGE_KEY = "cigtime.messages";
const LAST_SENT_KEY = "cigtime.lastSentAt";
const MUTED_KEY = "cigtime.mutedUsers";
const ROOM_BACKGROUND_KEY = "cigtime.roomBackgrounds";

export function getMessages(roomSlug: string): ChatMessage[] {
  const stored = readMessages().filter((message) => message.roomSlug === roomSlug);
  return stored.length ? stored : createSeedMessages(roomSlug);
}

export function saveMessage(message: ChatMessage) {
  const messages = readMessages();
  writeMessages([...messages, message].slice(-120));
  window.localStorage.setItem(LAST_SENT_KEY, String(Date.now()));
}

export function getCooldownRemaining() {
  const lastSentAt = Number(window.localStorage.getItem(LAST_SENT_KEY) ?? 0);
  const diff = Date.now() - lastSentAt;
  return Math.max(0, Math.ceil((10000 - diff) / 1000));
}

export function updateReaction(
  messageId: string,
  anonymousUserId: string,
  reactionType: ReactionType,
) {
  const messages = readMessages().map((message) => {
    if (message.id !== messageId) return message;

    const reactions = { ...message.reactions };
    for (const type of REACTIONS) {
      reactions[type] = reactions[type].filter((id) => id !== anonymousUserId);
    }
    reactions[reactionType] = [...reactions[reactionType], anonymousUserId];

    return { ...message, reactions };
  });

  writeMessages(messages);
  return messages;
}

export function reportMessage(messageId: string) {
  const messages = readMessages().map((message) =>
    message.id === messageId ? { ...message, reported: true } : message,
  );
  writeMessages(messages);
  return messages;
}

export function getMutedUsers() {
  const raw = window.localStorage.getItem(MUTED_KEY);
  return raw ? (JSON.parse(raw) as string[]) : [];
}

export function muteUser(anonymousUserId: string) {
  const muted = new Set(getMutedUsers());
  muted.add(anonymousUserId);
  window.localStorage.setItem(MUTED_KEY, JSON.stringify([...muted]));
}

export function getRoomBackground(roomSlug: string) {
  return readRoomBackgrounds()[roomSlug] ?? null;
}

export function saveRoomBackground(roomSlug: string, imageDataUrl: string) {
  const backgrounds = readRoomBackgrounds();
  backgrounds[roomSlug] = imageDataUrl;
  window.localStorage.setItem(ROOM_BACKGROUND_KEY, JSON.stringify(backgrounds));
}

export function clearRoomBackground(roomSlug: string) {
  const backgrounds = readRoomBackgrounds();
  delete backgrounds[roomSlug];
  window.localStorage.setItem(ROOM_BACKGROUND_KEY, JSON.stringify(backgrounds));
}

function readMessages(): ChatMessage[] {
  const raw = window.localStorage.getItem(MESSAGE_KEY);
  return raw ? (JSON.parse(raw) as ChatMessage[]) : [];
}

function writeMessages(messages: ChatMessage[]) {
  window.localStorage.setItem(MESSAGE_KEY, JSON.stringify(messages));
}

function readRoomBackgrounds(): Record<string, string> {
  const raw = window.localStorage.getItem(ROOM_BACKGROUND_KEY);
  return raw ? (JSON.parse(raw) as Record<string, string>) : {};
}

function createSeedMessages(roomSlug: string): ChatMessage[] {
  const now = Date.now();
  return SEED_MESSAGES.map((body, index) => ({
    id: `seed_${roomSlug}_${index}`,
    roomSlug,
    anonymousUserId: `seed_user_${index}`,
    nickname: ["Tired Pigeon", "Burnt Toast", "Sad Spreadsheet", "Quiet Signal", "Cold Pizza"][
      index
    ],
    body,
    createdAt: new Date(now - (index + 1) * 24000).toISOString(),
    reactions: {
      same: Array.from({ length: 2 + index }, (_, i) => `seed_same_${index}_${i}`),
      real: Array.from({ length: index % 3 }, (_, i) => `seed_real_${index}_${i}`),
      oof: Array.from({ length: index + 1 }, (_, i) => `seed_oof_${index}_${i}`),
      lol: [],
      hug: Array.from({ length: index % 2 }, (_, i) => `seed_hug_${index}_${i}`),
    },
  }));
}
