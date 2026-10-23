import assert from "node:assert/strict";
import { test } from "node:test";
import { ADS, isAdEventMetadata, pickAd } from "./ads.ts";

test("every ad has copy in both languages", () => {
  for (const ad of ADS) {
    for (const lang of ["en", "es"] as const) {
      const copy = ad.copy[lang];
      assert.ok(copy.eyebrow && copy.headline && copy.body && copy.cta, `${ad.id} ${lang}`);
    }
  }
});

test("pickAd spreads breaks over every ad and never runs past the list", () => {
  assert.equal(pickAd(ADS, () => 0).id, ADS[0].id);
  assert.equal(pickAd(ADS, () => 0.999999).id, ADS[ADS.length - 1].id);
  assert.equal(pickAd(ADS, () => 1).id, ADS[ADS.length - 1].id);
});

test("ad event metadata must name a known ad and placement", () => {
  assert.ok(isAdEventMetadata({ adId: ADS[0].id, placement: "leave_lighter" }));
  assert.ok(isAdEventMetadata({ adId: ADS[0].id, placement: "take_another" }));
  assert.equal(isAdEventMetadata({ adId: "unknown", placement: "leave_lighter" }), false);
  assert.equal(isAdEventMetadata({ adId: ADS[0].id, placement: "home" }), false);
  assert.equal(isAdEventMetadata({ adId: ADS[0].id, placement: "leave_lighter", extra: "x" }), false);
  assert.equal(isAdEventMetadata(null), false);
});
