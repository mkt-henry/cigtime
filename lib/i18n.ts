// The product targets English- and Spanish-speaking users, so every visible
// string lives here and is picked from the visitor's browser or request language.

export type Lang = "en" | "es";

export function pickLang(raw?: string | null): Lang {
  return (raw ?? "en").toLowerCase().startsWith("es") ? "es" : "en";
}

const EN = {
  heroTitle: "Take a minute.",
  heroLead: "Step out of the tab you're stuck in. Say the one thing on your mind, or say nothing. It burns out in a minute.",
  heroCta: "Step out",
  heroReactions: "What came back",
  heroThought: "I just need one quiet minute today.",
  stepsTitle: "How a cigtime goes",
  steps: [
    { title: "Pick a spot", body: "A rooftop, a fire escape, a back step. Everyone there is anonymous." },
    { title: "Say one line", body: "Up to 140 characters. Others can answer with same, real, oof, lol or hug." },
    { title: "Let it burn out", body: "When the minute is up you head back. What you said stays on the roof." },
  ],
  spotsTitle: "Where to stand",

  navRooms: "Rooms",
  navReactions: "Reactions",
  navGuidelines: "Guidelines",
  navPrivacy: "Privacy",
  navTerms: "Terms",
  navCoffee: "Buy me a coffee",

  roomsTitle: "Where are you stepping out?",
  roomsSubtitle: "Pick a room. A minute or a few, then you leave lighter.",
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
  roomAria: "Interactive cigtime room. Press Enter to share a thought.",
  objectLabel: "Ritual object",
  durationLabel: "Cigtime length",
  durationOption: (minutes: number) => `${minutes} min`,
  sendThought: "Send thought",
  you: "you",
  ashtrayLabel: (count: number) => (count === 1 ? "1 cigarette finished today" : `${count} cigarettes finished today`),

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

  metaTitle: "cigtime: a one-minute anonymous break",
  metaDescription:
    "Step out for a minute. cigtime is an anonymous online smoke-break room: say one line, get a quiet reaction, and head back lighter. No sign-up.",
  metaRooms: "Pick a room for your break: a rooftop, a fire escape, a back step, a convenience store or a silent balcony. Anonymous, one minute.",
  metaRoom: (name: string, description: string) => `${name}: ${description} A one-minute anonymous room on cigtime.`,

  notFoundTitle: "Nothing here.",
  notFoundBody: "This page burned out. The rooms are still open.",
  errorTitle: "Something went wrong.",
  errorBody: "Take a breath and try again.",
  retry: "Try again",

  statsTitle: "Product pulse",
  statsSubtitle: "Unique browsers that entered a room or acted inside it, by KST day.",
  statsEmpty: "No active-room events yet.",
  statsError: "DAU could not be loaded.",

  reactionsTitle: "What came back",
  reactionsSubtitle: "Reactions to thoughts left by this browser.",
  reactionsLoading: "Loading reactions...",
  reactionsError: "Reactions could not be loaded.",
  reactionsEmpty: "No reactions yet.",
  reactionsCta: "Drop a thought in The Rooftop",
};

type Copy = typeof EN;

const ES: Copy = {
  heroTitle: "Tómate un minuto.",
  heroLead: "Sal de la pestaña en la que estás atrapado. Di eso que traes, o no digas nada. Se consume en un minuto.",
  heroCta: "Salir un momento",
  heroReactions: "Lo que volvió",
  heroThought: "Hoy solo necesito un minuto de calma.",
  stepsTitle: "Cómo va un cigtime",
  steps: [
    { title: "Elige un sitio", body: "Una azotea, una escalera de incendios, un escalón trasero. Todos son anónimos." },
    { title: "Di una línea", body: "Hasta 140 caracteres. Los demás pueden responder con same, real, oof, lol o hug." },
    { title: "Deja que se consuma", body: "Cuando pasa el minuto, vuelves. Lo que dijiste se queda en la azotea." },
  ],
  spotsTitle: "Dónde quedarte",

  navRooms: "Salas",
  navReactions: "Reacciones",
  navGuidelines: "Normas",
  navPrivacy: "Privacidad",
  navTerms: "Términos",
  navCoffee: "Invítame un café",

  roomsTitle: "¿A dónde sales?",
  roomsSubtitle: "Elige una sala. Un minuto o unos pocos, y sales más ligero.",
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
  roomAria: "Sala interactiva de cigtime. Pulsa Enter para soltar un pensamiento.",
  objectLabel: "Objeto del ritual",
  durationLabel: "Duración del cigtime",
  durationOption: (minutes: number) => `${minutes} min`,
  sendThought: "Enviar pensamiento",
  you: "tú",
  ashtrayLabel: (count: number) => (count === 1 ? "1 cigarrillo terminado hoy" : `${count} cigarrillos terminados hoy`),

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

  metaTitle: "cigtime: un descanso anónimo de un minuto",
  metaDescription:
    "Sal un minuto. cigtime es una sala anónima para tu pausa: di una línea, recibe una reacción tranquila y vuelve más ligero. Sin registro.",
  metaRooms: "Elige una sala para tu pausa: una azotea, una escalera de incendios, un escalón trasero, una tienda o un balcón en silencio. Anónimo, un minuto.",
  metaRoom: (name: string, description: string) => `${name}: ${description} Una sala anónima de un minuto en cigtime.`,

  notFoundTitle: "Aquí no hay nada.",
  notFoundBody: "Esta página se consumió. Las salas siguen abiertas.",
  errorTitle: "Algo salió mal.",
  errorBody: "Respira e inténtalo de nuevo.",
  retry: "Reintentar",

  statsTitle: "Pulso del producto",
  statsSubtitle: "Navegadores únicos que entraron en una sala o actuaron dentro, por día KST.",
  statsEmpty: "Todavía no hay actividad en las salas.",
  statsError: "No se pudo cargar el DAU.",

  reactionsTitle: "Lo que volvió",
  reactionsSubtitle: "Reacciones a los pensamientos que dejó este navegador.",
  reactionsLoading: "Cargando reacciones...",
  reactionsError: "No se pudieron cargar las reacciones.",
  reactionsEmpty: "Todavía no hay reacciones.",
  reactionsCta: "Suelta un pensamiento en The Rooftop",
};

const COPY: Record<Lang, Copy> = { en: EN, es: ES };

export function t(lang: Lang): Copy {
  return COPY[lang];
}
