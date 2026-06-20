import { NextResponse } from "next/server";
import { ANALYTICS_EVENTS } from "@/lib/analytics";
import { recordAnalyticsEvent } from "@/lib/server/analytics";
import { createServiceSupabaseClient } from "@/lib/supabase/server";
import { isAnonymousUserId, isShortString, isUuid } from "@/lib/requestValidation";

export async function GET(request: Request) {
  const supabase = createServiceSupabaseClient();
  if (!supabase) {
    return NextResponse.json({ error: "DB not available." }, { status: 503 });
  }

  const url = new URL(request.url);
  const days = Math.max(1, Math.min(30, Number(url.searchParams.get("days") ?? 7) || 7));
  const { data, error } = await supabase.rpc("get_daily_active_users", { days_back: days });

  if (error) {
    return NextResponse.json({ error: "Failed to load DAU." }, { status: 500 });
  }

  return NextResponse.json({ days, dailyActiveUsers: data ?? [] });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (
    !body ||
    !isAnonymousUserId(body.anonymousUserId) ||
    !ANALYTICS_EVENTS.includes(body.eventName) ||
    (body.roomSlug != null && !isShortString(body.roomSlug, 64)) ||
    (body.sessionId != null && !isUuid(body.sessionId))
  ) {
    return NextResponse.json({ error: "Invalid analytics event." }, { status: 400 });
  }

  const supabase = createServiceSupabaseClient();
  if (!supabase) {
    return NextResponse.json({ error: "DB not available." }, { status: 503 });
  }

  await recordAnalyticsEvent(supabase, {
    anonymousUserId: body.anonymousUserId,
    eventName: body.eventName,
    roomSlug: body.roomSlug,
    sessionId: body.sessionId,
  });

  return new NextResponse(null, { status: 204 });
}
