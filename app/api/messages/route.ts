import { NextResponse } from "next/server";
import { scrubMessage, validateMessage } from "@/lib/filters";
import { recordAnalyticsEvent } from "@/lib/server/analytics";
import { createServiceSupabaseClient } from "@/lib/supabase/server";
import { isAnonymousUserId, isShortString, isUuid } from "@/lib/requestValidation";

const MESSAGE_RETENTION_HOURS = Math.max(1, Number(process.env.MESSAGE_RETENTION_HOURS ?? 24) || 24);

export async function GET(request: Request) {
  const roomSlug = new URL(request.url).searchParams.get("roomSlug");
  if (!roomSlug) {
    return NextResponse.json({ error: "A room is required." }, { status: 400 });
  }

  const supabase = createServiceSupabaseClient();
  if (!supabase) {
    return NextResponse.json({ error: "DB not available." }, { status: 503 });
  }

  const { data: room } = await supabase.from("rooms").select("id").eq("slug", roomSlug).single();
  if (!room) {
    return NextResponse.json({ error: "Room not found." }, { status: 404 });
  }

  const cutoff = new Date(Date.now() - MESSAGE_RETENTION_HOURS * 60 * 60 * 1000).toISOString();
  const { data, error } = await supabase
    .from("messages")
    .select("id, session_id, anonymous_user_id, nickname, body, created_at, reactions(anonymous_user_id,reaction_type)")
    .eq("room_id", room.id)
    .eq("is_deleted", false)
    .eq("is_reported_hidden", false)
    .gte("created_at", cutoff)
    .order("created_at", { ascending: false })
    .limit(30);

  if (error) {
    return NextResponse.json({ error: "Failed to load messages." }, { status: 500 });
  }

  const messages = (data ?? []).reverse().map((message) => ({
    id: message.id,
    roomSlug,
    sessionId: message.session_id,
    anonymousUserId: message.anonymous_user_id,
    nickname: message.nickname,
    body: message.body,
    createdAt: message.created_at,
    reactions: message.reactions ?? [],
  }));

  return NextResponse.json({ messages, roomId: room.id });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  if (
    !body ||
    !isUuid(body.sessionId) ||
    !isAnonymousUserId(body.anonymousUserId) ||
    !isShortString(body.nickname, 40) ||
    !isShortString(body.roomSlug, 64)
  ) {
    return NextResponse.json({ error: "Invalid message request." }, { status: 400 });
  }

  const validationError = validateMessage(String(body.body ?? ""));
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  const supabase = createServiceSupabaseClient();
  if (!supabase) {
    return NextResponse.json({ error: "DB not available." }, { status: 500 });
  }

  const { data: room } = await supabase
    .from("rooms")
    .select("id, is_silent")
    .eq("slug", body.roomSlug)
    .single();

  if (!room || room.is_silent) {
    return NextResponse.json({ error: "Messages are not allowed in this room." }, { status: 400 });
  }

  const { data: session } = await supabase
    .from("sessions")
    .select("id, room_id, anonymous_user_id, status, ends_at")
    .eq("id", body.sessionId)
    .eq("anonymous_user_id", body.anonymousUserId)
    .single();

  const graceCutoff = Date.now() - 60_000;
  if (
    !session ||
    session.room_id !== room.id ||
    session.status !== "active" ||
    !session.ends_at ||
    new Date(session.ends_at).getTime() < graceCutoff
  ) {
    return NextResponse.json({ error: "Your session is no longer active." }, { status: 409 });
  }

  const cooldownCutoff = new Date(Date.now() - 10_000).toISOString();
  const { count: recentMessageCount } = await supabase
    .from("messages")
    .select("id", { count: "exact", head: true })
    .eq("anonymous_user_id", body.anonymousUserId)
    .gte("created_at", cooldownCutoff);

  if ((recentMessageCount ?? 0) > 0) {
    return NextResponse.json({ error: "Wait 10 seconds before sending again." }, { status: 429 });
  }

  const { count: previousMessageCount } = await supabase
    .from("messages")
    .select("id", { count: "exact", head: true })
    .eq("anonymous_user_id", body.anonymousUserId);

  const { data: message, error } = await supabase
    .from("messages")
    .insert({
      room_id: room.id,
      session_id: body.sessionId,
      anonymous_user_id: body.anonymousUserId,
      nickname: body.nickname,
      body: scrubMessage(body.body),
    })
    .select()
    .single();

  if (error || !message) {
    return NextResponse.json({ error: "Failed to create message." }, { status: 500 });
  }

  await recordAnalyticsEvent(supabase, {
    anonymousUserId: body.anonymousUserId,
    eventName: (previousMessageCount ?? 0) === 0 ? "first_message_sent" : "message_sent",
    roomSlug: body.roomSlug,
    sessionId: body.sessionId,
  });

  return NextResponse.json({
    id: message.id,
    roomSlug: body.roomSlug,
    sessionId: message.session_id,
    anonymousUserId: message.anonymous_user_id,
    nickname: message.nickname,
    body: message.body,
    createdAt: message.created_at,
  });
}
