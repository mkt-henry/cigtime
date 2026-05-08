import { NextResponse } from "next/server";
import { SESSION_DURATION_SEC } from "@/lib/constants";
import { createServiceSupabaseClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const body = await request.json();

  if (!body.anonymousUserId || !body.nickname || !body.roomSlug || !body.objectKey) {
    return NextResponse.json({ error: "Invalid session request." }, { status: 400 });
  }

  const supabase = createServiceSupabaseClient();
  if (!supabase) {
    return NextResponse.json({ error: "DB not available." }, { status: 500 });
  }

  const [{ data: room }, { data: object }] = await Promise.all([
    supabase.from("rooms").select("id, slug, is_silent").eq("slug", body.roomSlug).single(),
    supabase.from("ritual_objects").select("id, key").eq("key", body.objectKey).single(),
  ]);

  if (!room || !object) {
    return NextResponse.json({ error: "Invalid session request." }, { status: 400 });
  }

  const durationSec = Number(body.durationSec ?? SESSION_DURATION_SEC);
  const endsAt = new Date(Date.now() + durationSec * 1000).toISOString();

  const { data: session, error } = await supabase
    .from("sessions")
    .insert({
      anonymous_user_id: body.anonymousUserId,
      nickname: body.nickname,
      room_id: room.id,
      object_id: object.id,
      ends_at: endsAt,
      duration_sec: durationSec,
      status: "active",
    })
    .select()
    .single();

  if (error || !session) {
    return NextResponse.json({ error: "Failed to create session." }, { status: 500 });
  }

  return NextResponse.json({
    id: session.id,
    anonymousUserId: session.anonymous_user_id,
    nickname: session.nickname,
    roomSlug: body.roomSlug,
    objectKey: body.objectKey,
    startedAt: session.started_at,
    endsAt: session.ends_at,
    durationSec: session.duration_sec,
    status: session.status,
  });
}
