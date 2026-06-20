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
] as const;

export type AnalyticsEventName = (typeof ANALYTICS_EVENTS)[number];

export async function trackEvent(input: {
  anonymousUserId: string;
  eventName: AnalyticsEventName;
  roomSlug?: string;
  sessionId?: string | null;
}) {
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
