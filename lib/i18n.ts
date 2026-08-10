// The product targets English- and Spanish-speaking users, so every visible
// string lives here and is picked from the visitor's browser or request language.

export type Lang = "en" | "es";

export function pickLang(raw?: string | null): Lang {
  return (raw ?? "en").toLowerCase().startsWith("es") ? "es" : "en";
}

const EN = {
  heroBadge: "3 minute anonymous room",
  heroTaglineTop: "Take your cigtime.",
  heroTaglineBottom: "A place to let it out.",
  heroCta: "Let it out",
  heroReactions: "See reactions",
  heroMetricRoom: "03:00 room",
  heroMetricPrivate: "private by default",
  heroMetricDrop: "drop it and leave",
  heroObjects: "Objects",
  heroRooms: "Rooms",
  heroThought: "I just need one quiet minute today.",

  navRooms: "Rooms",
  navReactions: "Reactions",
  navGuidelines: "Guidelines",

  roomsTitle: "Where are you taking your cigtime?",
  roomsSubtitle: "Pick a room. Three minutes, then you leave lighter.",
  roomsSilentTag: "no posting",

  opening: "Opening room...",
  tapHint: "tap to share a thought",
  statusConnecting: "connecting",
  statusUnavailable: "unavailable",
  online: (count: number) => `${count} online`,
  liveRoom: "anonymous · live room",
  connectingRoom: "connecting to shared room",
  silentPlaceholder: "This room stays silent.",
  backToRooms: "Back to rooms",
  uploadBackground: "Upload room background",
  removeBackground: "Remove room background",

  endTitle: "That's your cigtime.",
  endDropped: (count: number) =>
    count === 1 ? "You dropped 1 thought." : `You dropped ${count} thoughts.`,
  endReactions: (count: number) =>
    count === 1 ? "1 reaction received." : `${count} reactions received.`,
  takeAnother: "Take another",
  leaveLighter: "Leave lighter",

  reportOrMute: "Report or mute",
  muteUser: "Mute user",
  reason: {
    harassment: "Harassment",
    hate: "Hate",
    sexual: "Sexual",
    self_harm: "Self-harm",
    personal_info: "Personal info",
    spam: "Spam",
    other: "Other",
  },

  errorEmpty: "Write at least one character.",
  errorTooLong: "Keep it under 140 characters.",
  errorLink: "Links are blocked in the MVP.",
  errorContact: "Personal contact info is blocked.",
  errorConnecting: "The shared room is still connecting. Try again in a moment.",
  errorSend: "Message could not be sent.",
  errorReaction: "Reaction could not be saved.",
  errorReport: "Report could not be submitted.",
};

type Copy = typeof EN;

const ES: Copy = {
  heroBadge: "sala anónima de 3 minutos",
  heroTaglineTop: "Tómate tu cigtime.",
  heroTaglineBottom: "Un lugar para desahogarte.",
  heroCta: "Desahógate",
  heroReactions: "Ver reacciones",
  heroMetricRoom: "sala de 03:00",
  heroMetricPrivate: "privado por defecto",
  heroMetricDrop: "suéltalo y vete",
  heroObjects: "Objetos",
  heroRooms: "Salas",
  heroThought: "Hoy solo necesito un minuto de calma.",

  navRooms: "Salas",
  navReactions: "Reacciones",
  navGuidelines: "Normas",

  roomsTitle: "¿Dónde vas a tomarte tu cigtime?",
  roomsSubtitle: "Elige una sala. Tres minutos y sales más ligero.",
  roomsSilentTag: "sin mensajes",

  opening: "Abriendo la sala...",
  tapHint: "toca para soltar un pensamiento",
  statusConnecting: "conectando",
  statusUnavailable: "no disponible",
  online: (count: number) => `${count} en línea`,
  liveRoom: "anónimo · sala en vivo",
  connectingRoom: "conectando con la sala compartida",
  silentPlaceholder: "Esta sala se queda en silencio.",
  backToRooms: "Volver a las salas",
  uploadBackground: "Subir fondo de la sala",
  removeBackground: "Quitar fondo de la sala",

  endTitle: "Ese fue tu cigtime.",
  endDropped: (count: number) =>
    count === 1 ? "Soltaste 1 pensamiento." : `Soltaste ${count} pensamientos.`,
  endReactions: (count: number) =>
    count === 1 ? "1 reacción recibida." : `${count} reacciones recibidas.`,
  takeAnother: "Otra vez",
  leaveLighter: "Salir más ligero",

  reportOrMute: "Reportar o silenciar",
  muteUser: "Silenciar a esta persona",
  reason: {
    harassment: "Acoso",
    hate: "Odio",
    sexual: "Contenido sexual",
    self_harm: "Autolesión",
    personal_info: "Datos personales",
    spam: "Spam",
    other: "Otro",
  },

  errorEmpty: "Escribe al menos un carácter.",
  errorTooLong: "Máximo 140 caracteres.",
  errorLink: "Los enlaces están bloqueados en el MVP.",
  errorContact: "Los datos de contacto están bloqueados.",
  errorConnecting: "La sala compartida sigue conectando. Inténtalo en un momento.",
  errorSend: "No se pudo enviar el mensaje.",
  errorReaction: "No se pudo guardar la reacción.",
  errorReport: "No se pudo enviar el reporte.",
};

const COPY: Record<Lang, Copy> = { en: EN, es: ES };

export function t(lang: Lang): Copy {
  return COPY[lang];
}
