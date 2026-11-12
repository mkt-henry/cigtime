import assert from "node:assert/strict";
import test from "node:test";
import {
  COMPANION_ROOM_LIMIT,
  buildCompanionTurns,
  cleanCompanionReply,
  companionPersona,
  companionSystemPrompt,
  companionTypingDelayMs,
  isCompanionId,
  shouldCompanionReply,
} from "./companion.ts";
import { isAnonymousUserId } from "./requestValidation.ts";

test("replies only while one or two people are in the room", () => {
  assert.equal(shouldCompanionReply({ peopleInRoom: 0, recentCompanionReplies: 0 }), false);
  assert.equal(shouldCompanionReply({ peopleInRoom: 1, recentCompanionReplies: 0 }), true);
  assert.equal(shouldCompanionReply({ peopleInRoom: 2, recentCompanionReplies: 0 }), true);
  assert.equal(shouldCompanionReply({ peopleInRoom: 3, recentCompanionReplies: 0 }), false);
  assert.equal(shouldCompanionReply({ peopleInRoom: 1, recentCompanionReplies: COMPANION_ROOM_LIMIT }), false);
});

test("persona stays the same within a half hour and cannot be posted by a browser", () => {
  const base = Date.UTC(2026, 10, 12, 10, 0, 0);
  const a = companionPersona("break-room", base);
  const b = companionPersona("break-room", base + 10 * 60_000);
  assert.deepEqual(a, b);
  assert.ok(isCompanionId(a.id));
  assert.equal(isAnonymousUserId(a.id), false);
  assert.match(a.nickname, /^[A-Z][a-z]+ [A-Z][a-z]+$/);
});

test("room history becomes alternating turns ending on a visitor", () => {
  const turns = buildCompanionTurns(
    [
      { anonymousUserId: "ai_x", nickname: "Soft Toast", body: "hey" },
      { anonymousUserId: "anon_1", nickname: "Cold Pizza", body: "long day" },
      { anonymousUserId: "anon_2", nickname: "Sad Ghost", body: "same" },
      { anonymousUserId: "ai_x", nickname: "Soft Toast", body: "ugh, mondays" },
      { anonymousUserId: "anon_1", nickname: "Cold Pizza", body: "회의가 너무 길었어" },
    ],
    "ai_x",
  );
  assert.deepEqual(turns, [
    { role: "user", content: "Cold Pizza: long day\nSad Ghost: same" },
    { role: "assistant", content: "ugh, mondays" },
    { role: "user", content: "Cold Pizza: 회의가 너무 길었어" },
  ]);
  assert.deepEqual(
    buildCompanionTurns([{ anonymousUserId: "ai_x", nickname: "Soft Toast", body: "hey" }], "ai_x"),
    [],
  );
});

test("reply is trimmed to one room-safe line", () => {
  assert.equal(cleanCompanionReply('"ㅋㅋ 고생했네"\n'), "ㅋㅋ 고생했네");
  assert.equal(cleanCompanionReply("Soft Toast: same here"), "same here");
  assert.equal(cleanCompanionReply("Honestly: same"), "Honestly same");
  assert.equal(cleanCompanionReply("다섯 개면, 일은 언제 해요? 진짜..."), "다섯 개면 일은 언제 해요 진짜");
  assert.equal(cleanCompanionReply("Ugh. Same, honestly!"), "Ugh Same honestly");
  assert.equal(cleanCompanionReply("3.5시간 회의, 1,000번째"), "3.5시간 회의 1,000번째");
  assert.equal(cleanCompanionReply("see https://example.com"), null);
  assert.equal(cleanCompanionReply("x".repeat(200)), null);
  assert.equal(cleanCompanionReply("   "), null);
});

test("system prompt names the fallback language", () => {
  assert.match(companionSystemPrompt("ko", "Break Room"), /한국어/);
  assert.match(companionSystemPrompt("ko", "Break Room"), /Break Room/);
});

test("typing delay looks human and stays short", () => {
  assert.equal(companionTypingDelayMs("hi", () => 0), 2_620);
  assert.equal(companionTypingDelayMs("x".repeat(140), () => 0.99), 9_000);
});
