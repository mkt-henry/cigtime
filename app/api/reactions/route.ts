import { NextResponse } from "next/server";
import { REACTIONS } from "@/lib/constants";
import { createServiceSupabaseClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const body = await request.json();

  if (!body.messageId || !body.anonymousUserId || !REACTIONS.includes(body.reactionType)) {
    return NextResponse.json({ error: "Invalid reaction request." }, { status: 400 });
  }

  const supabase = createServiceSupabaseClient();
  if (!supabase) {
    return NextResponse.json({ error: "DB not available." }, { status: 500 });
  }

  const { data: reaction, error } = await supabase
    .from("reactions")
    .upsert(
      {
        message_id: body.messageId,
        anonymous_user_id: body.anonymousUserId,
        reaction_type: body.reactionType,
      },
      { onConflict: "message_id,anonymous_user_id" }
    )
    .select()
    .single();

  if (error || !reaction) {
    return NextResponse.json({ error: "Failed to save reaction." }, { status: 500 });
  }

  return NextResponse.json({
    messageId: reaction.message_id,
    anonymousUserId: reaction.anonymous_user_id,
    reactionType: reaction.reaction_type,
    updatedAt: reaction.created_at,
  });
}
