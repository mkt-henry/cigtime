export const ANALYTICS_EVENTS = [
  "landing_view",
  "rooms_view",
  "room_entered",
  "session_started",
  "first_message_sent",
  "message_sent",
  "reaction_sent",
  "reaction_received",
  "session_completed",
  "session_restarted",
  "share_clicked",
] as const;

export type AnalyticsEventName = (typeof ANALYTICS_EVENTS)[number];

export async function trackEvent(input: {
  anonymousUserId: string;
  eventName: AnalyticsEventName;
  roomSlug?: string;
  sessionId?: string | null;
}) {
  const gtag = (window as Window & { gtag?: (...args: unknown[]) => void }).gtag;
  gtag?.("event", input.eventName, { room_slug: input.roomSlug });

  try {
    await fetch("/api/analytics", {
      body: JSON.stringify(input),
      headers: { "Content-Type": "application/json" },
      keepalive: true,
      method: "POST",
    });
  } catch {
    // Analytics must never block the product flow.
  }
}
