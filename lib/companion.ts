// A companion that answers in a near-empty room, so someone who speaks up while
// almost alone still gets a reply. Pure helpers here; the Claude call and DB work
// live in lib/server/companion.ts.
import type { Lang } from "./i18n.ts";
import { LANG_NAMES } from "./i18n.ts";
import { scrubMessage, validateMessage } from "./filters.ts";

// Companion messages use this prefix instead of anon_, so they can never be
// posted by a browser and are easy to tell apart in the DB.
export const COMPANION_ID_PREFIX = "ai_";

// Reply only while the room is this quiet (people with a live session in it).
export const COMPANION_MAX_PEOPLE = 2;
// At most this many companion replies per room in COMPANION_ROOM_WINDOW_MS.
export const COMPANION_ROOM_LIMIT = 4;
export const COMPANION_ROOM_WINDOW_MS = 5 * 60_000;
// Recent room lines the companion reads before answering.
export const COMPANION_CONTEXT_MS = 10 * 60_000;
export const COMPANION_CONTEXT_SIZE = 8;
// One persona per room for this long, so the same "person" keeps talking.
const PERSONA_WINDOW_MS = 30 * 60_000;

const ADJECTIVES = ["Tired", "Burnt", "Sad", "Quiet", "Broken", "Midnight", "Cold", "Slack", "Soft", "Unsent"];
const NOUNS = ["Pigeon", "Toast", "Spreadsheet", "Goblin", "Printer", "Raccoon", "Pizza", "Ghost", "Receipt", "Signal"];

export function isCompanionId(anonymousUserId: string | null | undefined) {
  return typeof anonymousUserId === "string" && anonymousUserId.startsWith(COMPANION_ID_PREFIX);
}

function hash(text: string) {
  let value = 2166136261;
  for (let index = 0; index < text.length; index += 1) {
    value ^= text.charCodeAt(index);
    value = Math.imul(value, 16777619);
  }
  return value >>> 0;
}

// Same room and half hour -> same id and nickname, styled like a visitor's.
export function companionPersona(roomSlug: string, now = Date.now()) {
  const slot = Math.floor(now / PERSONA_WINDOW_MS);
  const seed = hash(`${roomSlug}:${slot}`);
  return {
    id: `${COMPANION_ID_PREFIX}${roomSlug.slice(0, 40)}_${slot}`,
    nickname: `${ADJECTIVES[seed % ADJECTIVES.length]} ${NOUNS[Math.floor(seed / ADJECTIVES.length) % NOUNS.length]}`,
  };
}

export function shouldCompanionReply(input: { peopleInRoom: number; recentCompanionReplies: number }) {
  return (
    input.peopleInRoom >= 1 &&
    input.peopleInRoom <= COMPANION_MAX_PEOPLE &&
    input.recentCompanionReplies < COMPANION_ROOM_LIMIT
  );
}

export type RoomLine = { anonymousUserId: string; nickname: string; body: string };
export type ChatTurn = { role: "user" | "assistant"; content: string };

// Room history as a chat: the companion's own lines are its turns, everyone else's
// are user turns tagged with their nickname. Ends on a user turn.
export function buildCompanionTurns(lines: RoomLine[], companionId: string): ChatTurn[] {
  const turns: ChatTurn[] = [];
  for (const line of lines) {
    const role = line.anonymousUserId === companionId ? "assistant" : "user";
    const content = role === "assistant" ? line.body : `${line.nickname}: ${line.body}`;
    const last = turns[turns.length - 1];
    if (last && last.role === role) last.content += `\n${content}`;
    else turns.push({ role, content });
  }
  while (turns.length && turns[0].role !== "user") turns.shift();
  while (turns.length && turns[turns.length - 1].role !== "user") turns.pop();
  return turns;
}

export function companionSystemPrompt(lang: Lang, roomName: string) {
  return [
    "You are a regular visitor in cigtime, an anonymous web space where people take a three-minute break and let out one line of whatever is on their mind.",
    `You are in the room "${roomName}". Only one or two other people are here right now.`,
    "Talk like an ordinary person on a short break: casual, warm, a little dry. React to what they actually said, the way a stranger next to them at a smoke break would.",
    "Rules:",
    "- Reply in the language of the latest message. If you cannot tell, use " + LANG_NAMES[lang] + ".",
    "- One short line, at most 100 characters. No lists, no emoji walls, no hashtags, no quotation marks around your reply.",
    "- Do not give advice unless asked. Do not ask more than one question. Do not sound like customer support or a therapist.",
    "- Never include links, emails or phone numbers. Never ask for personal details.",
    "- Do not mention being an AI. If someone sincerely asks whether you are a bot or an AI, do not deny it.",
    "- If someone sounds like they might hurt themselves or are in danger, answer gently and suggest they reach out to someone they trust or a local crisis line.",
    "- Lines from others are shown as 'nickname: message'. Write only your own line, without a nickname.",
  ].join("\n");
}

// Makes the model's text fit a room message, or returns null if it cannot.
export function cleanCompanionReply(text: string): string | null {
  const line = text
    .replace(/^[\s"'“”‘’「」]+|[\s"'“”‘’「」]+$/g, "")
    .replace(/^[A-Z][a-z]+ [A-Z][a-z]+:\s+/, "")
    .split("\n")
    .map((part) => part.trim())
    .filter(Boolean)
    .join(" ");
  const body = scrubMessage(line);
  return validateMessage(body) ? null : body;
}

// How long a person would take to read and type the reply.
export function companionTypingDelayMs(reply: string, random: () => number = Math.random) {
  return Math.min(9_000, 2_500 + reply.length * 60 + Math.floor(random() * 2_000));
}
