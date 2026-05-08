import { NextResponse } from "next/server";
import { REPORT_REASONS } from "@/lib/constants";
import { createServiceSupabaseClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const body = await request.json();

  if (!body.messageId || !body.reporterAnonymousUserId || !REPORT_REASONS.includes(body.reason)) {
    return NextResponse.json({ error: "Invalid report request." }, { status: 400 });
  }

  const supabase = createServiceSupabaseClient();
  if (!supabase) {
    return NextResponse.json({ error: "DB not available." }, { status: 500 });
  }

  const { data: report, error } = await supabase
    .from("reports")
    .insert({
      message_id: body.messageId,
      reporter_anonymous_user_id: body.reporterAnonymousUserId,
      reason: body.reason,
    })
    .select()
    .single();

  if (error || !report) {
    return NextResponse.json({ error: "Failed to create report." }, { status: 500 });
  }

  return NextResponse.json({
    id: report.id,
    messageId: report.message_id,
    reporterAnonymousUserId: report.reporter_anonymous_user_id,
    reason: report.reason,
    status: report.status,
    createdAt: report.created_at,
  });
}
