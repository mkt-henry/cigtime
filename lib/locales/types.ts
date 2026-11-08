import type { Copy } from "../i18n.ts";
import type { LegalPageCopy, LegalPageKey } from "../legal.ts";

export type RoomSlug = "rooftop" | "let-it-out" | "unsent-replies" | "tiny-rants" | "silent";

export type RoomText = { description: string; placeholder: string; about: string };

export type AdText = { eyebrow: string; headline: string; body: string; cta: string };

export type ShareText = { button: string; done: string; caption: string; tagline: string };

// Everything a language beyond English and Spanish needs. English and Spanish keep
// their copy next to the code that uses it (i18n.ts, constants.ts, legal.ts, ads.ts).
export type Locale = {
  copy: Copy;
  rooms: Record<RoomSlug, RoomText>;
  // Standalone one-line thoughts that float in a quiet room.
  ambient: readonly string[];
  legal: Record<LegalPageKey, LegalPageCopy>;
  ads: Record<"house_advertise" | "house_coffee", AdText>;
  share: ShareText;
};

export type ExtraLang = "ko" | "ja" | "zh" | "pt" | "de" | "fr" | "tr";
