import { NextResponse } from "next/server";
import { REACTIONS } from "@/lib/constants";

export async function POST(request: Request) {
  const body = await request.json();

  if (!body.messageId || !body.anonymousUserId || !REACTIONS.includes(body.reactionType)) {
    return NextResponse.json({ error: "Invalid reaction request." }, { status: 400 });
  }

  return NextResponse.json({
    messageId: body.messageId,
    anonymousUserId: body.anonymousUserId,
    reactionType: body.reactionType,
    updatedAt: new Date().toISOString(),
  });
}
