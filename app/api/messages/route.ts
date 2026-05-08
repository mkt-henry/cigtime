import { NextResponse } from "next/server";
import { ROOMS } from "@/lib/constants";
import { scrubMessage, validateMessage } from "@/lib/filters";

export async function POST(request: Request) {
  const body = await request.json();
  const room = ROOMS.find((item) => item.slug === body.roomSlug);

  if (!room || room.isSilent) {
    return NextResponse.json({ error: "Messages are not allowed in this room." }, { status: 400 });
  }

  const validationError = validateMessage(String(body.body ?? ""));
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  return NextResponse.json({
    id: crypto.randomUUID(),
    roomSlug: room.slug,
    sessionId: body.sessionId,
    anonymousUserId: body.anonymousUserId,
    nickname: body.nickname,
    body: scrubMessage(body.body),
    createdAt: new Date().toISOString(),
  });
}
