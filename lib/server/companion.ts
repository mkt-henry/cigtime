import Anthropic from "@anthropic-ai/sdk";
import type { SupabaseClient } from "@supabase/supabase-js";
import {
  COMPANION_CONTEXT_MS,
  COMPANION_CONTEXT_SIZE,
  COMPANION_ID_PREFIX,
  COMPANION_ROOM_WINDOW_MS,
  buildCompanionTurns,
  cleanCompanionReply,
  companionPersona,
  companionSystemPrompt,
  companionTypingDelayMs,
  shouldCompanionReply,
} from "@/lib/companion";
import type { Lang } from "@/lib/i18n";

const COMPANION_MODEL = "claude-sonnet-5-5";
// Hard ceiling on companion replies per 24 hours across every room.
const DAILY_LIMIT = Math.max(0, Number(process.env.COMPANION_DAILY_LIMIT ?? 300) || 0);
// After the API refuses the key (credits used up, key revoked), stay quiet for a while.
const PAUSE_AFTER_REJECTION_MS = 60 * 60_000;

let pausedUntil = 0;
let client: Anthropic | null = null;

function getClient() {
  if (!process.env.ANTHROPIC_API_KEY) return null;
  client ??= new Anthropic({ maxRetries: 0, timeout: 15_000 });
  return client;
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Called after a real visitor's message is saved. Posts a short reply in the
// visitor's language when the room is nearly empty; any failure just means no reply.
export async function maybePostCompanionReply(
  supabase: SupabaseClient,
  input: { roomId: string; roomName: string; roomSlug: string; lang: Lang },
) {
  const anthropic = getClient();
  if (!anthropic || DAILY_LIMIT === 0 || Date.now() < pausedUntil) return;

  const startedAt = Date.now();
  const now = new Date(startedAt);
  const companionLike = `${COMPANION_ID_PREFIX}%`;

  const [people, recent, today, context] = await Promise.all([
    supabase
      .from("sessions")
      .select("anonymous_user_id")
      .eq("room_id", input.roomId)
      .eq("status", "active")
      .gt("ends_at", now.toISOString())
      .limit(20),
    supabase
      .from("messages")
      .select("id", { count: "exact", head: true })
      .eq("room_id", input.roomId)
      .like("anonymous_user_id", companionLike)
      .gte("created_at", new Date(startedAt - COMPANION_ROOM_WINDOW_MS).toISOString()),
    supabase
      .from("messages")
      .select("id", { count: "exact", head: true })
      .like("anonymous_user_id", companionLike)
      .gte("created_at", new Date(startedAt - 24 * 60 * 60_000).toISOString()),
    supabase
      .from("messages")
      .select("anonymous_user_id, nickname, body")
      .eq("room_id", input.roomId)
      .eq("is_deleted", false)
      .eq("is_reported_hidden", false)
      .gte("created_at", new Date(startedAt - COMPANION_CONTEXT_MS).toISOString())
      .order("created_at", { ascending: false })
      .limit(COMPANION_CONTEXT_SIZE),
  ]);

  if (people.error || recent.error || today.error || context.error) return;
  const peopleInRoom = new Set((people.data ?? []).map((row) => row.anonymous_user_id)).size;
  if (!shouldCompanionReply({ peopleInRoom, recentCompanionReplies: recent.count ?? 0 })) return;
  if ((today.count ?? 0) >= DAILY_LIMIT) return;

  const persona = companionPersona(input.roomSlug, startedAt);
  const lines = (context.data ?? []).reverse().map((row) => ({
    anonymousUserId: row.anonymous_user_id,
    nickname: row.nickname,
    body: row.body,
  }));
  const messages = buildCompanionTurns(lines, persona.id);
  if (!messages.length) return;

  let text = "";
  try {
    const response = await anthropic.messages.create({
      model: COMPANION_MODEL,
      max_tokens: 1000,
      output_config: { effort: "low" },
      system: companionSystemPrompt(input.lang, input.roomName),
      messages,
    });
    if (response.stop_reason !== "end_turn") return;
    for (const block of response.content) {
      if (block.type === "text") text += block.text;
    }
  } catch (error) {
    if (
      error instanceof Anthropic.BadRequestError ||
      error instanceof Anthropic.AuthenticationError ||
      error instanceof Anthropic.PermissionDeniedError
    ) {
      pausedUntil = Date.now() + PAUSE_AFTER_REJECTION_MS;
    }
    return;
  }

  const reply = cleanCompanionReply(text);
  if (!reply) return;

  const wait = companionTypingDelayMs(reply) - (Date.now() - startedAt);
  if (wait > 0) await sleep(wait);

  await supabase.from("messages").insert({
    room_id: input.roomId,
    session_id: null,
    anonymous_user_id: persona.id,
    nickname: persona.nickname,
    body: reply,
  });
}
