const MUTED_KEY = "cigtime.mutedUsers";
const ROOM_BACKGROUND_KEY = "cigtime.roomBackgrounds";
const DURATION_KEY = "cigtime.sessionDurationSec";

export function getSessionDuration() {
  return Number(window.localStorage.getItem(DURATION_KEY)) || null;
}

export function saveSessionDuration(durationSec: number) {
  window.localStorage.setItem(DURATION_KEY, String(durationSec));
}

export function getMutedUsers() {
  const raw = window.localStorage.getItem(MUTED_KEY);
  return raw ? (JSON.parse(raw) as string[]) : [];
}

export function muteUser(anonymousUserId: string) {
  const muted = new Set(getMutedUsers());
  muted.add(anonymousUserId);
  window.localStorage.setItem(MUTED_KEY, JSON.stringify([...muted]));
}

export function getRoomBackground(roomSlug: string) {
  return readRoomBackgrounds()[roomSlug] ?? null;
}

export function saveRoomBackground(roomSlug: string, imageDataUrl: string) {
  const backgrounds = readRoomBackgrounds();
  backgrounds[roomSlug] = imageDataUrl;
  window.localStorage.setItem(ROOM_BACKGROUND_KEY, JSON.stringify(backgrounds));
}

export function clearRoomBackground(roomSlug: string) {
  const backgrounds = readRoomBackgrounds();
  delete backgrounds[roomSlug];
  window.localStorage.setItem(ROOM_BACKGROUND_KEY, JSON.stringify(backgrounds));
}

function readRoomBackgrounds(): Record<string, string> {
  const raw = window.localStorage.getItem(ROOM_BACKGROUND_KEY);
  return raw ? (JSON.parse(raw) as Record<string, string>) : {};
}
