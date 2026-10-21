import type { ReactionType, RitualObject, Room } from "./types";

export const SESSION_DURATION_SEC = 300;
// Lengths the person in the room can pick for their own cigtime.
export const SESSION_DURATION_OPTIONS = [60, 180, 300, 600];

export const ROOMS: Room[] = [
  {
    slug: "rooftop",
    name: "The Rooftop",
    description: "A default open room for short resets.",
    descriptionEs: "La sala abierta por defecto para un respiro corto.",
    placeholder: "Let it out...",
    placeholderEs: "Suéltalo...",
    about:
      "For any small reset. Step away from the screen, watch the city for a minute, and drop one line if something is on your mind. It is the room people land in first, so it is usually the busiest.",
    aboutEs:
      "Para cualquier respiro corto. Aléjate de la pantalla, mira la ciudad un minuto y suelta una línea si traes algo en la cabeza. Es la sala a la que llega la mayoría, así que suele ser la más concurrida.",
  },
  {
    slug: "let-it-out",
    name: "Let It Out",
    description: "Drop the feeling and leave it there.",
    descriptionEs: "Suelta lo que sientes y déjalo ahí.",
    placeholder: "What do you need to get out?",
    placeholderEs: "¿Qué necesitas sacar?",
    about:
      "For venting without an audience you know. Say the thing that has been sitting in your chest, in one line, to people who will never know who you are. Nobody asks for context and nobody follows up.",
    aboutEs:
      "Para desahogarte sin un público que te conozca. Di eso que llevas en el pecho, en una línea, a gente que nunca sabrá quién eres. Nadie pide contexto y nadie pregunta después.",
  },
  {
    slug: "unsent-replies",
    name: "Unsent Replies",
    description: "Say the reply you never sent.",
    descriptionEs: "Di la respuesta que nunca enviaste.",
    placeholder: "Say the reply you never sent.",
    placeholderEs: "Di la respuesta que nunca enviaste.",
    about:
      "For the reply you typed and deleted. Write what you wish you had said to a coworker, a friend or an ex. It never reaches them: it floats here for a moment and then it is gone.",
    aboutEs:
      "Para la respuesta que escribiste y borraste. Escribe lo que te habría gustado decirle a un compañero, a un amigo o a tu ex. Nunca le llega: flota aquí un momento y luego desaparece.",
  },
  {
    slug: "tiny-rants",
    name: "Tiny Rants",
    description: "Small complaints with small consequences.",
    descriptionEs: "Quejas pequeñas con consecuencias pequeñas.",
    placeholder: "What's your tiny rant?",
    placeholderEs: "¿Cuál es tu queja de hoy?",
    about:
      "For the small stuff. The printer, the meeting that could have been an email, the person who reclines their seat. Small complaints feel smaller once someone answers with \"same\".",
    aboutEs:
      "Para las cosas pequeñas. La impresora, la reunión que pudo ser un correo, el que recuesta el asiento. Las quejas pequeñas se hacen más pequeñas cuando alguien responde \"same\".",
  },
  {
    slug: "silent",
    name: "Silent Cigtime",
    description: "A quiet room with no posting.",
    descriptionEs: "Una sala tranquila donde no se escribe.",
    placeholder: "Quiet room. No words needed.",
    placeholderEs: "Sala tranquila. No hacen falta palabras.",
    about:
      "For when you do not want to say anything at all. There is no input here: pick a candle, incense or coffee, watch it burn down, and breathe until the minute is over.",
    aboutEs:
      "Para cuando no quieres decir nada. Aquí no se escribe: elige una vela, incienso o un café, míralo consumirse y respira hasta que termine el minuto.",
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
    name: "Lollipop",
    action: "The swirl gets smaller with every lick.",
    tone: "lighter and playful",
  },
  {
    key: "ballpop",
    name: "Ball Pop",
    action: "The wrapper comes off and the ball melts down.",
    tone: "sweet and silly",
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

// Reactions are stored by name; this is how they show up on screen.
export const REACTION_EMOJI: Record<ReactionType, string> = {
  same: "🤝",
  real: "💯",
  oof: "😮‍💨",
  lol: "😂",
  hug: "🫂",
};

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
