import { NextResponse } from "next/server";
import { createServiceSupabaseClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const startedAt = Date.now();
  if (!process.env.CRON_SECRET || request.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`) {
    console.warn(JSON.stringify({ level: "warn", message: "unauthorized cron request", route: "/api/cron/purge-messages" }));
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const supabase = createServiceSupabaseClient();
  if (!supabase) {
    return NextResponse.json({ error: "DB not available." }, { status: 503 });
  }

  const retentionHours = Math.max(1, Number(process.env.MESSAGE_RETENTION_HOURS ?? 24) || 24);
  const { data: deletedCount, error } = await supabase.rpc("purge_expired_messages", {
    retention_hours: retentionHours,
  });

  if (error) {
    console.error(JSON.stringify({
      level: "error",
      message: "message purge failed",
      route: "/api/cron/purge-messages",
      durationMs: Date.now() - startedAt,
      error: error.message,
    }));
    return NextResponse.json({ error: "Purge failed." }, { status: 500 });
  }

  console.log(JSON.stringify({
    level: "info",
    message: "message purge completed",
    route: "/api/cron/purge-messages",
    durationMs: Date.now() - startedAt,
    deletedCount,
  }));
  return NextResponse.json({ ok: true, deletedCount });
}
