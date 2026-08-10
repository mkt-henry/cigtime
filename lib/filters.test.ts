import assert from "node:assert/strict";
import { test } from "node:test";
import { scrubMessage, validateMessage } from "./filters.ts";

test("accepts a plain one-liner", () => {
  assert.equal(validateMessage("I should have said no."), null);
});

test("rejects empty, over-long, link, and contact messages", () => {
  assert.ok(validateMessage("   "));
  assert.ok(validateMessage("x".repeat(141)));
  assert.ok(validateMessage("check https://example.com"));
  assert.ok(validateMessage("visit www.example.com"));
  assert.ok(validateMessage("mail me at a@b.co"));
  assert.ok(validateMessage("call 010 1234 5678"));
});

test("returns errors in the requested language", () => {
  assert.equal(validateMessage("", "es"), "Escribe al menos un carácter.");
});

test("collapses whitespace", () => {
  assert.equal(scrubMessage("  too   many   spaces  "), "too many spaces");
});
