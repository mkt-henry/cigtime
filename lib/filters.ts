// Explicit .ts extension so `node --test lib/filters.test.ts` can resolve it.
import { t, type Lang } from "./i18n.ts";

const URL_PATTERN = /https?:\/\/|www\./i;
const EMAIL_PATTERN = /[\w.+-]+@[\w-]+\.[\w.-]+/i;
const PHONE_PATTERN = /(?:\+?\d[\s.-]?){8,}/;

export function validateMessage(body: string, lang: Lang = "en") {
  const copy = t(lang);
  const trimmed = body.trim();

  if (trimmed.length < 1) {
    return copy.errorEmpty;
  }

  if (trimmed.length > 140) {
    return copy.errorTooLong;
  }

  if (URL_PATTERN.test(trimmed)) {
    return copy.errorLink;
  }

  if (EMAIL_PATTERN.test(trimmed) || PHONE_PATTERN.test(trimmed)) {
    return copy.errorContact;
  }

  return null;
}

export function scrubMessage(body: string) {
  return body.replace(/\s+/g, " ").trim();
}
