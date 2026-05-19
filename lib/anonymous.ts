import type { AnonymousUser } from "./types";
import { createNickname } from "./nickname";
import { createClientId } from "./id";

const STORAGE_KEY = "cigtime.anonymousUser";

export function getOrCreateAnonymousUser(): AnonymousUser {
  if (typeof window === "undefined") {
    return { id: "anon_server", nickname: "Quiet Signal" };
  }

  try {
    const existing = window.localStorage.getItem(STORAGE_KEY);
    if (existing) {
      const parsed = JSON.parse(existing) as Partial<AnonymousUser>;
      if (parsed.id && parsed.nickname) {
        return { id: parsed.id, nickname: parsed.nickname };
      }
      window.localStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    return createAnonymousUser();
  }

  const anonymousUser = createAnonymousUser();
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(anonymousUser));
  } catch {
    return anonymousUser;
  }
  return anonymousUser;
}

function createAnonymousUser(): AnonymousUser {
  return {
    id: `anon_${createClientId()}`,
    nickname: createNickname(),
  };
}
