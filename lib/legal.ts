import type { Lang } from "./i18n";

export type LegalPageKey = "privacy" | "terms" | "guidelines";

type LegalSection = { heading: string; body: string[] };
type LegalPageCopy = { title: string; intro: string; sections: LegalSection[] };

const EN: Record<LegalPageKey, LegalPageCopy> = {
  privacy: {
    title: "Privacy",
    intro:
      "cigtime is anonymous by design. There are no accounts, no passwords, and no email addresses.",
    sections: [
      {
        heading: "What stays in your browser",
        body: [
          "A generated anonymous ID and a random nickname, so a room can tell participants apart.",
          "The list of people you muted and any room background you uploaded. Both never leave your device.",
        ],
      },
      {
        heading: "What we store on the server",
        body: [
          "Sessions (room, ritual object, start and end time), messages, reactions, and reports, all keyed to the anonymous ID.",
          "Product analytics events such as entering a room or completing a session. They are counted, never sold or shared.",
        ],
      },
      {
        heading: "How long we keep it",
        body: [
          "Messages are purged automatically once they pass the retention window (24 hours by default).",
          "Reports are kept while moderation needs them. Sessions and analytics events are kept in aggregate form only.",
        ],
      },
      {
        heading: "Your part",
        body: [
          "Do not post names, phone numbers, email addresses, links, or anything that identifies you or someone else. Links and contact details are blocked automatically, but nothing beats not typing them.",
          "Clearing your browser storage resets your anonymous ID and detaches you from everything you wrote.",
        ],
      },
    ],
  },
  terms: {
    title: "Terms",
    intro:
      "By using cigtime you accept these terms. They are short on purpose, like the sessions.",
    sections: [
      {
        heading: "The service",
        body: [
          "cigtime provides short anonymous rooms. It is offered as-is, with no guarantee of availability, and it may change or stop at any time.",
          "It is not a health service. It does not offer medical, psychological, or legal advice.",
        ],
      },
      {
        heading: "Your responsibility",
        body: [
          "You are responsible for what you post. Do not post illegal content, threats, hate, sexual content, or anyone's personal data.",
          "Do not attempt to identify other participants, scrape the rooms, or automate posting.",
        ],
      },
      {
        heading: "Moderation",
        body: [
          "Reported messages can be hidden automatically once enough reports pile up, and we may remove any message or block access without notice.",
          "Muting is yours to use at any time and takes effect immediately in your browser.",
        ],
      },
      {
        heading: "Liability",
        body: [
          "To the extent permitted by law, we are not liable for damages arising from the use of the service or from content posted by others.",
        ],
      },
    ],
  },
  guidelines: {
    title: "Guidelines",
    intro:
      "One line, dropped and left behind. These rules keep the room usable for the next person.",
    sections: [
      {
        heading: "Do",
        body: [
          "Say the thing you needed to get out, in a line or two.",
          "React with same, real, oof, lol, or hug when something lands.",
          "Let people leave. Nobody owes you a conversation here.",
        ],
      },
      {
        heading: "Don't",
        body: [
          "No harassment, hate, or sexual content.",
          "No names, phone numbers, email addresses, links, or other personal data — yours or anyone else's.",
          "No spam, no repeated posting, no advertising.",
        ],
      },
      {
        heading: "If something goes wrong",
        body: [
          "Report the message and pick the reason that fits. Enough reports hide it for everyone.",
          "Mute anyone you would rather not read again. It applies instantly, only for you.",
        ],
      },
      {
        heading: "If you are in crisis",
        body: [
          "cigtime is a short break, not help. If you are thinking about hurting yourself, please contact your local emergency number or a suicide prevention line right now.",
        ],
      },
    ],
  },
};

const ES: Record<LegalPageKey, LegalPageCopy> = {
  privacy: {
    title: "Privacidad",
    intro:
      "cigtime es anónimo por diseño. No hay cuentas, ni contraseñas, ni direcciones de correo.",
    sections: [
      {
        heading: "Lo que se queda en tu navegador",
        body: [
          "Un identificador anónimo generado y un apodo aleatorio, para que la sala distinga a cada persona.",
          "La lista de personas silenciadas y el fondo de sala que hayas subido. Nada de eso sale de tu dispositivo.",
        ],
      },
      {
        heading: "Lo que guardamos en el servidor",
        body: [
          "Sesiones (sala, objeto, inicio y fin), mensajes, reacciones y reportes, siempre ligados al identificador anónimo.",
          "Eventos de producto como entrar en una sala o completar una sesión. Se cuentan; nunca se venden ni se comparten.",
        ],
      },
      {
        heading: "Cuánto tiempo lo guardamos",
        body: [
          "Los mensajes se borran automáticamente al pasar la ventana de retención (24 horas por defecto).",
          "Los reportes se conservan mientras la moderación los necesite. Las sesiones y los eventos se conservan solo de forma agregada.",
        ],
      },
      {
        heading: "Tu parte",
        body: [
          "No publiques nombres, teléfonos, correos, enlaces ni nada que te identifique a ti o a otra persona. Los enlaces y datos de contacto se bloquean solos, pero lo mejor es no escribirlos.",
          "Si borras el almacenamiento del navegador, tu identificador anónimo se reinicia y te desvinculas de todo lo que escribiste.",
        ],
      },
    ],
  },
  terms: {
    title: "Términos",
    intro: "Al usar cigtime aceptas estos términos. Son cortos a propósito, como las sesiones.",
    sections: [
      {
        heading: "El servicio",
        body: [
          "cigtime ofrece salas anónimas breves. Se ofrece tal cual, sin garantía de disponibilidad, y puede cambiar o cerrar en cualquier momento.",
          "No es un servicio de salud. No da consejo médico, psicológico ni legal.",
        ],
      },
      {
        heading: "Tu responsabilidad",
        body: [
          "Eres responsable de lo que publicas. No publiques contenido ilegal, amenazas, odio, contenido sexual ni datos personales de nadie.",
          "No intentes identificar a otras personas, extraer datos de las salas ni automatizar mensajes.",
        ],
      },
      {
        heading: "Moderación",
        body: [
          "Un mensaje reportado puede ocultarse automáticamente cuando se acumulan suficientes reportes, y podemos eliminar cualquier mensaje o bloquear el acceso sin aviso.",
          "Silenciar está en tus manos y surte efecto de inmediato en tu navegador.",
        ],
      },
      {
        heading: "Responsabilidad legal",
        body: [
          "En la medida que la ley lo permita, no somos responsables de daños derivados del uso del servicio ni del contenido publicado por otras personas.",
        ],
      },
    ],
  },
  guidelines: {
    title: "Normas",
    intro:
      "Una línea, soltada y dejada atrás. Estas normas mantienen la sala usable para quien venga después.",
    sections: [
      {
        heading: "Sí",
        body: [
          "Di eso que necesitabas sacar, en una línea o dos.",
          "Reacciona con same, real, oof, lol o hug cuando algo te toque.",
          "Deja que la gente se vaya. Aquí nadie te debe una conversación.",
        ],
      },
      {
        heading: "No",
        body: [
          "Nada de acoso, odio ni contenido sexual.",
          "Nada de nombres, teléfonos, correos, enlaces ni otros datos personales, tuyos o de terceros.",
          "Nada de spam, mensajes repetidos ni publicidad.",
        ],
      },
      {
        heading: "Si algo sale mal",
        body: [
          "Reporta el mensaje y elige el motivo que encaje. Con suficientes reportes se oculta para todo el mundo.",
          "Silencia a quien prefieras no volver a leer. Se aplica al instante y solo para ti.",
        ],
      },
      {
        heading: "Si estás en crisis",
        body: [
          "cigtime es una pausa corta, no ayuda profesional. Si piensas en hacerte daño, contacta ahora mismo con el número de emergencias local o una línea de prevención del suicidio.",
        ],
      },
    ],
  },
};

export function legalCopy(lang: Lang, page: LegalPageKey): LegalPageCopy {
  return (lang === "es" ? ES : EN)[page];
}
