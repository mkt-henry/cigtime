import { NextResponse } from "next/server";
import { REPORT_REASONS } from "@/lib/constants";
import { isAnonymousUserId, isUuid } from "@/lib/requestValidation";
import { createServiceSupabaseClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  if (!body || !isUuid(body.messageId) || !isAnonymousUserId(body.reporterAnonymousUserId) || !REPORT_REASONS.includes(body.reason)) {
    return NextResponse.json({ error: "Invalid report request." }, { status: 400 });
  }

  const supabase = createServiceSupabaseClient();
  if (!supabase) {
    return NextResponse.json({ error: "DB not available." }, { status: 500 });
  }

  const { data: message } = await supabase
    .from("messages")
    .select("id, anonymous_user_id")
    .eq("id", body.messageId)
    .eq("is_deleted", false)
    .single();

  if (!message) {
    return NextResponse.json({ error: "Message not found." }, { status: 404 });
  }

  if (message.anonymous_user_id === body.reporterAnonymousUserId) {
    return NextResponse.json({ error: "You cannot report your own message." }, { status: 400 });
  }

  const { count: duplicateCount } = await supabase
    .from("reports")
    .select("id", { count: "exact", head: true })
    .eq("message_id", body.messageId)
    .eq("reporter_anonymous_user_id", body.reporterAnonymousUserId);

  if ((duplicateCount ?? 0) > 0) {
    return NextResponse.json({ error: "You already reported this message." }, { status: 409 });
  }

  const { data: report, error } = await supabase
    .from("reports")
    .insert({
      message_id: body.messageId,
      reporter_anonymous_user_id: body.reporterAnonymousUserId,
      reported_anonymous_user_id: message.anonymous_user_id,
      reason: body.reason,
    })
    .select()
    .single();

  if (error || !report) {
    return NextResponse.json({ error: "Failed to create report." }, { status: 500 });
  }

  const hideThreshold = Math.max(1, Number(process.env.REPORT_HIDE_THRESHOLD ?? 3) || 3);
  const { count: reportCount } = await supabase
    .from("reports")
    .select("id", { count: "exact", head: true })
    .eq("message_id", body.messageId);

  if ((reportCount ?? 0) >= hideThreshold) {
    await supabase.from("messages").update({ is_reported_hidden: true }).eq("id", body.messageId);
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
