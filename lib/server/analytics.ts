import type { SupabaseClient } from "@supabase/supabase-js";
import type { AnalyticsEventName } from "@/lib/analytics";

export async function recordAnalyticsEvent(
  supabase: SupabaseClient,
  input: {
    anonymousUserId: string;
    eventName: AnalyticsEventName;
    roomSlug?: string | null;
    sessionId?: string | null;
  },
) {
  await supabase.from("analytics_events").insert({
    anonymous_user_id: input.anonymousUserId,
    event_name: input.eventName,
    room_slug: input.roomSlug ?? null,
    session_id: input.sessionId ?? null,
  });
}
