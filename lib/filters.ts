const URL_PATTERN = /https?:\/\/|www\./i;
const EMAIL_PATTERN = /[\w.+-]+@[\w-]+\.[\w.-]+/i;
const PHONE_PATTERN = /(?:\+?\d[\s.-]?){8,}/;

export function validateMessage(body: string) {
  const trimmed = body.trim();

  if (trimmed.length < 1) {
    return "Write at least one character.";
  }

  if (trimmed.length > 140) {
    return "Keep it under 140 characters.";
  }

  if (URL_PATTERN.test(trimmed)) {
    return "Links are blocked in the MVP.";
  }

  if (EMAIL_PATTERN.test(trimmed) || PHONE_PATTERN.test(trimmed)) {
    return "Personal contact info is blocked.";
  }

  return null;
}

export function scrubMessage(body: string) {
  return body.replace(/\s+/g, " ").trim();
}
