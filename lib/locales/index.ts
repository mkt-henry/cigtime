import { de } from "./de.ts";
import { fr } from "./fr.ts";
import { ja } from "./ja.ts";
import { ko } from "./ko.ts";
import { pt } from "./pt.ts";
import { tr } from "./tr.ts";
import type { ExtraLang, Locale } from "./types.ts";
import { zh } from "./zh.ts";

export const LOCALES: Record<ExtraLang, Locale> = { ko, ja, zh, pt, de, fr, tr };
