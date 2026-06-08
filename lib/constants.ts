import type { ReactionType, RitualObject, Room } from "./types";
import { GENERAL_CHAT_MESSAGES } from "./randomMessages";

export const SESSION_DURATION_SEC = 180;

export const ROOMS: Room[] = [
  {
    slug: "rooftop",
    name: "The Rooftop",
    description: "A default open room for short resets.",
    placeholder: "Let it out...",
  },
  {
    slug: "let-it-out",
    name: "Let It Out",
    description: "Drop the feeling and leave it there.",
    placeholder: "What do you need to get out?",
  },
  {
    slug: "unsent-replies",
    name: "Unsent Replies",
    description: "Say the reply you never sent.",
    placeholder: "Say the reply you never sent.",
  },
  {
    slug: "tiny-rants",
    name: "Tiny Rants",
    description: "Small complaints with small consequences.",
    placeholder: "What's your tiny rant?",
  },
  {
    slug: "silent",
    name: "Silent Cigtime",
    description: "A quiet room with no posting.",
    placeholder: "Quiet room. No words needed.",
    isSilent: true,
  },
];

export const RITUAL_OBJECTS: RitualObject[] = [
  {
    key: "cigarette",
    name: "Cigarette",
    action: "Slow ash, soft smoke.",
    tone: "classic release",
  },
  {
    key: "candy",
    name: "Candy",
    action: "The wrapper opens and the color fades.",
    tone: "lighter and playful",
  },
  {
    key: "incense",
    name: "Incense",
    action: "Smoke lifts in a thin line.",
    tone: "calm",
  },
  {
    key: "coffee",
    name: "Coffee",
    action: "Steam thins as the cup empties.",
    tone: "work break",
  },
  {
    key: "candle",
    name: "Candle",
    action: "A small flame gets smaller.",
    tone: "quiet release",
  },
];

export const REACTIONS: ReactionType[] = ["same", "real", "oof", "lol", "hug"];

export const REPORT_REASONS = [
  "harassment",
  "hate",
  "sexual",
  "self_harm",
  "personal_info",
  "spam",
  "other",
] as const;

export { GENERAL_CHAT_MESSAGES };

export const SEED_MESSAGES = GENERAL_CHAT_MESSAGES;
