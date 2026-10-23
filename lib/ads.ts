import type { Lang } from "./i18n";

// Seconds the ad break holds before "Take another" or "Leave lighter" goes through.
export const AD_BREAK_SECONDS = 5;

export type AdPlacement = "take_another" | "leave_lighter";

type LocalizedAd = {
  eyebrow: string;
  headline: string;
  body: string;
  cta: string;
};

export type Ad = {
  id: string;
  url: string;
  copy: Record<Lang, LocalizedAd>;
};

// House ads until a sponsor buys the slot. Add a sponsor by prepending an entry;
// each one gets an equal random share of breaks.
export const ADS: Ad[] = [
  {
    id: "house_advertise",
    url: "mailto:bpark0718@bpstudio.co.kr?subject=Advertising%20on%20cigtime",
    copy: {
      en: {
        eyebrow: "Your brand here",
        headline: "Five quiet seconds, all yours.",
        body: "This spot shows up between breaks, when people are calm and paying attention. Get in touch to put your brand here.",
        cta: "Advertise on cigtime",
      },
      es: {
        eyebrow: "Tu marca aquí",
        headline: "Cinco segundos tranquilos, solo para ti.",
        body: "Este espacio aparece entre pausas, cuando la gente está en calma y prestando atención. Escríbenos para poner tu marca aquí.",
        cta: "Anúnciate en cigtime",
      },
    },
  },
  {
    id: "house_coffee",
    url: "https://buymeacoffee.com/bpark0718z",
    copy: {
      en: {
        eyebrow: "Keep cigtime running",
        headline: "This break is on us. The next one is on you?",
        body: "cigtime has no feed and sells no data. A coffee keeps the rooms open.",
        cta: "Buy me a coffee",
      },
      es: {
        eyebrow: "Mantén cigtime en marcha",
        headline: "Esta pausa la invitamos nosotros. ¿La próxima tú?",
        body: "cigtime no tiene feed ni vende datos. Un café mantiene las salas abiertas.",
        cta: "Invítame un café",
      },
    },
  },
];

export function pickAd(ads: Ad[] = ADS, random: () => number = Math.random): Ad {
  return ads[Math.min(ads.length - 1, Math.floor(random() * ads.length))];
}

export type AdEventMetadata = { adId: string; placement: AdPlacement };

// The analytics endpoint only stores ad events that name a known ad and placement.
export function isAdEventMetadata(value: unknown): value is AdEventMetadata {
  if (!value || typeof value !== "object") return false;
  const { adId, placement } = value as Record<string, unknown>;
  return (
    ADS.some((ad) => ad.id === adId) &&
    (placement === "take_another" || placement === "leave_lighter") &&
    Object.keys(value).length === 2
  );
}
