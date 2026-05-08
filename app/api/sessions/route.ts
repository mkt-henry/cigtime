import { NextResponse } from "next/server";
import { RITUAL_OBJECTS, ROOMS, SESSION_DURATION_SEC } from "@/lib/constants";

export async function POST(request: Request) {
  const body = await request.json();
  const room = ROOMS.find((item) => item.slug === body.roomSlug);
  const object = RITUAL_OBJECTS.find((item) => item.key === body.objectKey);

  if (!body.anonymousUserId || !body.nickname || !room || !object) {
    return NextResponse.json({ error: "Invalid session request." }, { status: 400 });
  }

  const durationSec = Number(body.durationSec ?? SESSION_DURATION_SEC);

  return NextResponse.json({
    id: crypto.randomUUID(),
    anonymousUserId: body.anonymousUserId,
    nickname: body.nickname,
    roomSlug: room.slug,
    objectKey: object.key,
    startedAt: new Date().toISOString(),
    endsAt: new Date(Date.now() + durationSec * 1000).toISOString(),
    durationSec,
    status: "active",
  });
}
