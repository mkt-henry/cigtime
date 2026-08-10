// Ambient floating messages shown in a room when no real person has spoken yet.
// The product targets English- and Spanish-speaking users, so the pool is
// localized and selected at runtime from the visitor's browser language.

const EN_TOPICS = [
  "This whole day",
  "That message I never sent",
  "The meeting that ran long",
  "My inbox right now",
  "The thing I keep putting off",
  "This Monday",
  "Friday afternoon",
  "The coffee going cold",
  "That call out of nowhere",
  "The reply I'm still drafting",
  "Late night air",
  "The to-do list",
  "This quiet minute",
  "The group chat",
  "Dinner alone tonight",
  "The deadline creeping up",
  "My phone buzzing again",
  "The weekend I had planned",
  "Everyone acting fine",
  "The slow wifi",
  "That one notification",
  "The commute home",
  "This empty calendar",
  "This packed calendar",
  "The laundry I keep ignoring",
] as const;

const EN_COMMENTS = [
  "it just keeps sitting on me",
  "heavier than it should be",
  "honestly not as bad as I feared",
  "small thing, still stuck on it",
  "I just want to mute it for a second",
  "it sounds worse if I say it out loud",
  "I'm letting it drift off",
  "a little funny, a little sad",
  "it feels bigger than it is",
  "weirdly it won't leave me alone",
  "everyone's pretending it's fine",
  "feels like I'm the slow one",
  "I'm ignoring it for now",
  "it passes faster than I think",
  "I just want it to pause",
  "quieter than I expected",
  "kind of want to talk to someone",
  "this alone is enough to drain me",
  "it's grinding on me",
  "such a small thing and I'm out of energy",
] as const;

const ES_TOPICS = [
  "Todo este día",
  "Ese mensaje que nunca mandé",
  "La reunión que se alargó",
  "Mi bandeja de entrada ahora",
  "Eso que sigo posponiendo",
  "Este lunes",
  "El viernes por la tarde",
  "El café que se enfría",
  "Esa llamada de la nada",
  "La respuesta que sigo escribiendo",
  "El aire de la madrugada",
  "La lista de pendientes",
  "Este minuto de calma",
  "El grupo de chat",
  "La cena solo esta noche",
  "La fecha de entrega encima",
  "El teléfono vibrando otra vez",
  "El fin de semana que había planeado",
  "Todos fingiendo que están bien",
  "El wifi lento",
  "Esa notificación",
  "El camino a casa",
  "Este calendario vacío",
  "Este calendario lleno",
  "La ropa que sigo ignorando",
] as const;

const ES_COMMENTS = [
  "se me queda encima",
  "pesa más de lo que debería",
  "la verdad, no tan mal como temía",
  "una tontería y sigo dándole vueltas",
  "solo quiero silenciarlo un segundo",
  "suena peor si lo digo en voz alta",
  "lo estoy dejando ir",
  "un poco gracioso, un poco triste",
  "se siente más grande de lo que es",
  "qué raro, no me deja en paz",
  "todos fingen que no pasa nada",
  "siento que el lento soy yo",
  "lo estoy ignorando por ahora",
  "pasa más rápido de lo que creo",
  "solo quiero que se detenga",
  "más silencioso de lo que esperaba",
  "me dan ganas de hablar con alguien",
  "solo con esto ya quedo agotado",
  "me está desgastando",
  "una cosa mínima y ya no tengo energía",
] as const;

function buildMessages(
  topics: readonly string[],
  comments: readonly string[],
): readonly string[] {
  return topics.flatMap((topic) => comments.map((comment) => `${topic}, ${comment}.`));
}

export const EN_CHAT_MESSAGES = buildMessages(EN_TOPICS, EN_COMMENTS);
export const ES_CHAT_MESSAGES = buildMessages(ES_TOPICS, ES_COMMENTS);

// English is the default pool (used for SSR and seed data).
export const GENERAL_CHAT_MESSAGES = EN_CHAT_MESSAGES;

// Pick the ambient pool that matches the visitor's browser language.
export function getAmbientMessages(lang?: string): readonly string[] {
  const code = (lang ?? "en").toLowerCase();
  if (code.startsWith("es")) return ES_CHAT_MESSAGES;
  return EN_CHAT_MESSAGES;
}
