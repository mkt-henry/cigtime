import { NextResponse } from "next/server";
import { createServiceSupabaseClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const startedAt = Date.now();
  const requestId = request.headers.get("x-vercel-id");
  const supabase = createServiceSupabaseClient();

  if (!supabase) {
    log("error", "health check missing database configuration", requestId, startedAt);
    return NextResponse.json({ ok: false, database: "unconfigured" }, { status: 503 });
  }

  const { error } = await supabase.from("rooms").select("id", { head: true, count: "exact" }).limit(1);
  if (error) {
    log("error", "health check database failure", requestId, startedAt, error.message);
    return NextResponse.json({ ok: false, database: "unavailable" }, { status: 503 });
  }

  log("info", "health check passed", requestId, startedAt);
  return NextResponse.json({ ok: true, database: "healthy" });
}

function log(
  level: "info" | "error",
  message: string,
  requestId: string | null,
  startedAt: number,
  error?: string,
) {
  const entry = JSON.stringify({
    level,
    message,
    requestId,
    durationMs: Date.now() - startedAt,
    error,
  });
  if (level === "error") console.error(entry);
  else console.log(entry);
}
