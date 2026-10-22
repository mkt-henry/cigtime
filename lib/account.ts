"use client";

import type { Session } from "@supabase/supabase-js";
import { getOrCreateAnonymousUser, replaceAnonymousUser } from "./anonymous";
import { getAuthClient } from "./supabase/auth";

// Sign-in is optional. Rooms keep using the browser's anonymous identity; signing in
// only attaches that identity (and its history) to a Supabase Auth account.

export type AccountState = {
  ready: boolean;
  session: Session | null;
};

const LINK_KEY = "cigtime.accountLink";
let state: AccountState = { ready: false, session: null };
const listeners = new Set<() => void>();
let started = false;

function setState(next: AccountState) {
  state = next;
  listeners.forEach((listener) => listener());
}

export function getAccountState() {
  return state;
}

export function subscribeAccount(listener: () => void) {
  listeners.add(listener);
  start();
  return () => {
    listeners.delete(listener);
  };
}

function start() {
  if (started || typeof window === "undefined") return;
  started = true;

  const client = getAuthClient();
  if (!client) {
    setState({ ready: true, session: null });
    return;
  }

  client.auth.onAuthStateChange((event, session) => {
    setState({ ready: true, session });
    if (event === "SIGNED_IN") clearAuthParams();
    // Supabase warns against awaiting other work inside this callback.
    if (session) setTimeout(() => void linkBrowser(session), 0);
  });
}

function clearAuthParams() {
  const url = new URL(window.location.href);
  if (!url.searchParams.has("code")) return;
  url.searchParams.delete("code");
  window.history.replaceState(window.history.state, "", url.toString());
}

let linking: Promise<void> | null = null;

function linkBrowser(session: Session) {
  const anonymousUser = getOrCreateAnonymousUser();
  const key = `${session.user.id}|${anonymousUser.id}`;
  if (readLinkKey() === key) return Promise.resolve();
  if (linking) return linking;

  linking = (async () => {
    try {
      const response = await fetch("/api/account/link", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.access_token}` },
        body: JSON.stringify({ anonymousUserId: anonymousUser.id }),
      });
      if (!response.ok) return;
      const data = (await response.json()) as { anonymousUserId: string; switched: boolean };
      if (data.switched) replaceAnonymousUser(data.anonymousUserId);
      writeLinkKey(`${session.user.id}|${data.anonymousUserId}`);
    } catch {
      // Linking retries on the next page load.
    } finally {
      linking = null;
    }
  })();
  return linking;
}

export async function signInWithGoogle() {
  const client = getAuthClient();
  if (!client) return;
  const redirectTo = window.location.href.split("#")[0];
  await client.auth.signInWithOAuth({ provider: "google", options: { redirectTo } });
}

// Signing out also gives this browser a fresh anonymous identity, so anything done
// afterwards is no longer attached to the account.
export async function signOut() {
  const client = getAuthClient();
  if (!client) return;
  await client.auth.signOut({ scope: "local" });
  writeLinkKey(null);
  replaceAnonymousUser();
}

function readLinkKey() {
  try {
    return window.localStorage.getItem(LINK_KEY);
  } catch {
    return null;
  }
}

function writeLinkKey(value: string | null) {
  try {
    if (value) window.localStorage.setItem(LINK_KEY, value);
    else window.localStorage.removeItem(LINK_KEY);
  } catch {
    // Storage blocked: linking just runs again next time.
  }
}
