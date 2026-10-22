import type { AnonymousUser } from "./types";
import { createNickname } from "./nickname";
import { createClientId } from "./id";

const STORAGE_KEY = "cigtime.anonymousUser";
// Fired on window whenever this browser switches to a different anonymous identity,
// so mounted components re-read it instead of keeping the old one.
export const IDENTITY_EVENT = "cigtime:identity";

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

// Gives this browser a new anonymous identity (used after sign-out, or when the
// browser's identity already belongs to another account). Pass an id to adopt it.
export function replaceAnonymousUser(id?: string): AnonymousUser {
  const anonymousUser = id ? { id, nickname: createNickname() } : createAnonymousUser();
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(anonymousUser));
  } catch {
    // Storage blocked: the identity still applies for this page view.
  }
  window.dispatchEvent(new Event(IDENTITY_EVENT));
  return anonymousUser;
}

function createAnonymousUser(): AnonymousUser {
  return {
    id: `anon_${createClientId()}`,
    nickname: createNickname(),
  };
}
