import type { ReactionType, RitualObject, Room } from "./types";

export const SESSION_DURATION_SEC = 180;

export const ROOMS: Room[] = [
  {
    slug: "rooftop",
    name: "The Rooftop",
    description: "A default open room for short resets.",
    descriptionEs: "La sala abierta por defecto para un respiro corto.",
    placeholder: "Let it out...",
    placeholderEs: "Suéltalo...",
  },
  {
    slug: "let-it-out",
    name: "Let It Out",
    description: "Drop the feeling and leave it there.",
    descriptionEs: "Suelta lo que sientes y déjalo ahí.",
    placeholder: "What do you need to get out?",
    placeholderEs: "¿Qué necesitas sacar?",
  },
  {
    slug: "unsent-replies",
    name: "Unsent Replies",
    description: "Say the reply you never sent.",
    descriptionEs: "Di la respuesta que nunca enviaste.",
    placeholder: "Say the reply you never sent.",
    placeholderEs: "Di la respuesta que nunca enviaste.",
  },
  {
    slug: "tiny-rants",
    name: "Tiny Rants",
    description: "Small complaints with small consequences.",
    descriptionEs: "Quejas pequeñas con consecuencias pequeñas.",
    placeholder: "What's your tiny rant?",
    placeholderEs: "¿Cuál es tu queja de hoy?",
  },
  {
    slug: "silent",
    name: "Silent Cigtime",
    description: "A quiet room with no posting.",
    descriptionEs: "Una sala tranquila donde no se escribe.",
    placeholder: "Quiet room. No words needed.",
    placeholderEs: "Sala tranquila. No hacen falta palabras.",
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

export type ReportReason = (typeof REPORT_REASONS)[number];
