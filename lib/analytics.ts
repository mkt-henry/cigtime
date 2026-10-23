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
  "ad_viewed",
  "ad_clicked",
] as const;

import type { AdEventMetadata } from "./ads";

export type AnalyticsEventName = (typeof ANALYTICS_EVENTS)[number];

export async function trackEvent(input: {
  anonymousUserId: string;
  eventName: AnalyticsEventName;
  roomSlug?: string;
  sessionId?: string | null;
  metadata?: AdEventMetadata;
}) {
  const gtag = (window as Window & { gtag?: (...args: unknown[]) => void }).gtag;
  gtag?.("event", input.eventName, {
    room_slug: input.roomSlug,
    ad_id: input.metadata?.adId,
    ad_placement: input.metadata?.placement,
  });

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
