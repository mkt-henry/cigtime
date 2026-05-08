import { NextResponse } from "next/server";
import { scrubMessage, validateMessage } from "@/lib/filters";
import { createServiceSupabaseClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const body = await request.json();

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
