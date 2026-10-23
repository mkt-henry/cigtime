import assert from "node:assert/strict";
import { test } from "node:test";
import {
  AMBIENT_GAP_MS,
  FADE_OUT_MS,
  FIRST_AMBIENT_DELAY_MS,
  advanceBubbles,
  fadeOut,
  firstAmbientAt,
  nextAmbientAt,
  pickAmbientBody,
} from "./bubbles.ts";

test("bubbles fade at hideAt and are dropped after the fade", () => {
  const items = [{ id: "a", phase: "visible" as const, hideAt: 1_000 }];

  assert.equal(advanceBubbles(items, 999), items);

  const fading = advanceBubbles(items, 1_000);
  assert.equal(fading[0].phase, "disappearing");
  assert.equal(advanceBubbles(fading, 1_000 + FADE_OUT_MS - 1), fading);

  assert.deepEqual(advanceBubbles(fading, 1_000 + FADE_OUT_MS), []);
});

test("fadeOut starts the fade now without delaying an earlier one", () => {
  const item = { phase: "visible" as const, hideAt: 5_000 };
  assert.deepEqual(fadeOut(item, 2_000), { phase: "disappearing", hideAt: 2_000 });

  const fading = { phase: "disappearing" as const, hideAt: 1_000 };
  assert.equal(fadeOut(fading, 2_000), fading);
});

test("pickAmbientBody never repeats the previous line", () => {
  const pool = ["one", "two", "three"];
  for (const roll of [0, 0.4, 0.99]) {
    assert.notEqual(pickAmbientBody(pool, "two", () => roll), "two");
  }
  assert.equal(pickAmbientBody(["only"], "only", () => 0.5), "only");
});

test("sample thoughts come at random times within the set range", () => {
  assert.equal(firstAmbientAt(10_000, () => 0), 10_000 + FIRST_AMBIENT_DELAY_MS[0]);
  assert.ok(firstAmbientAt(10_000, () => 0.999) < 10_000 + FIRST_AMBIENT_DELAY_MS[1]);

  assert.equal(nextAmbientAt(10_000, () => 0), 10_000 + FADE_OUT_MS + AMBIENT_GAP_MS[0]);
  assert.ok(nextAmbientAt(10_000, () => 0.999) < 10_000 + FADE_OUT_MS + AMBIENT_GAP_MS[1]);
});
