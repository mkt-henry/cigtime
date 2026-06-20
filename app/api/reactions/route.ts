import { NextResponse } from "next/server";
import { REACTIONS } from "@/lib/constants";
import { createServiceSupabaseClient } from "@/lib/supabase/server";
import { recordAnalyticsEvent } from "@/lib/server/analytics";
import { isAnonymousUserId, isUuid } from "@/lib/requestValidation";

export async function GET(request: Request) {
  const anonymousUserId = new URL(request.url).searchParams.get("anonymousUserId");
  if (!isAnonymousUserId(anonymousUserId)) {
    return NextResponse.json({ error: "Invalid anonymous user." }, { status: 400 });
  }

  const supabase = createServiceSupabaseClient();
  if (!supabase) {
    return NextResponse.json({ error: "DB not available." }, { status: 503 });
  }

  const { data, error } = await supabase
    .from("messages")
    .select("id, body, created_at, rooms(slug,name), reactions(reaction_type,created_at)")
    .eq("anonymous_user_id", anonymousUserId)
    .eq("is_deleted", false)
    .eq("is_reported_hidden", false)
    .order("created_at", { ascending: false })
    .limit(20);

  if (error) {
    return NextResponse.json({ error: "Failed to load received reactions." }, { status: 500 });
  }

  const messages = (data ?? [])
    .map((message) => ({
      id: message.id,
      body: message.body,
      createdAt: message.created_at,
      room: message.rooms,
      reactions: message.reactions ?? [],
    }))
    .filter((message) => message.reactions.length > 0);

  return NextResponse.json({ messages });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  if (!body || !isUuid(body.messageId) || !isAnonymousUserId(body.anonymousUserId) || !REACTIONS.includes(body.reactionType)) {
    return NextResponse.json({ error: "Invalid reaction request." }, { status: 400 });
  }

  const supabase = createServiceSupabaseClient();
  if (!supabase) {
    return NextResponse.json({ error: "DB not available." }, { status: 500 });
  }

  const { data: message } = await supabase
    .from("messages")
    .select("id, anonymous_user_id, room_id, rooms(slug)")
    .eq("id", body.messageId)
    .eq("is_deleted", false)
    .eq("is_reported_hidden", false)
    .single();

  if (!message) {
    return NextResponse.json({ error: "Message not found." }, { status: 404 });
  }

  if (message.anonymous_user_id === body.anonymousUserId) {
    return NextResponse.json({ error: "You cannot react to your own message." }, { status: 400 });
  }

  const { data: reaction, error } = await supabase
    .from("reactions")
    .upsert(
      {
        message_id: body.messageId,
        anonymous_user_id: body.anonymousUserId,
        reaction_type: body.reactionType,
        created_at: new Date().toISOString(),
      },
      { onConflict: "message_id,anonymous_user_id" }
    )
    .select()
    .single();

  if (error || !reaction) {
    return NextResponse.json({ error: "Failed to save reaction." }, { status: 500 });
  }

  const roomRelation = message.rooms as unknown as { slug?: string } | null;
  await Promise.all([
    recordAnalyticsEvent(supabase, {
      anonymousUserId: body.anonymousUserId,
      eventName: "reaction_sent",
      roomSlug: roomRelation?.slug,
    }),
    recordAnalyticsEvent(supabase, {
      anonymousUserId: message.anonymous_user_id,
      eventName: "reaction_received",
      roomSlug: roomRelation?.slug,
    }),
  ]);

  return NextResponse.json({
    messageId: reaction.message_id,
    anonymousUserId: reaction.anonymous_user_id,
    reactionType: reaction.reaction_type,
    updatedAt: reaction.created_at,
  });
}
