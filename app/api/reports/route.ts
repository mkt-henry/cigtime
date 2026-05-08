import { NextResponse } from "next/server";
import { REPORT_REASONS } from "@/lib/constants";

export async function POST(request: Request) {
  const body = await request.json();

  if (!body.messageId || !body.reporterAnonymousUserId || !REPORT_REASONS.includes(body.reason)) {
    return NextResponse.json({ error: "Invalid report request." }, { status: 400 });
  }

  return NextResponse.json({
    id: crypto.randomUUID(),
    messageId: body.messageId,
    reporterAnonymousUserId: body.reporterAnonymousUserId,
    reason: body.reason,
    status: "pending",
    createdAt: new Date().toISOString(),
  });
}
