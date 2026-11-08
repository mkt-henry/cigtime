import assert from "node:assert/strict";
import { test } from "node:test";
import { ROOMS, roomText } from "./constants.ts";
import { LANGS, pickLang, t } from "./i18n.ts";
import { legalCopy } from "./legal.ts";
import { getAmbientMessages } from "./randomMessages.ts";

test("browser languages map to a supported language or English", () => {
  assert.equal(pickLang("ko-KR"), "ko");
  assert.equal(pickLang("pt-BR"), "pt");
  assert.equal(pickLang("zh-CN"), "zh");
  assert.equal(pickLang("es-419"), "es");
  assert.equal(pickLang("de"), "de");
  assert.equal(pickLang("hi-IN"), "en");
  assert.equal(pickLang(null), "en");
});

test("every language has room text, ambient thoughts and legal pages", () => {
  for (const lang of LANGS) {
    assert.ok(t(lang).heroTitle, `${lang} copy`);
    for (const room of ROOMS) {
      const text = roomText(room, lang);
      assert.ok(text.description && text.placeholder && text.about, `${lang} ${room.slug}`);
    }
    assert.ok(getAmbientMessages(lang).length >= 40, `${lang} ambient`);
    for (const page of ["privacy", "terms", "guidelines"] as const) {
      assert.ok(legalCopy(lang, page).sections.length > 0, `${lang} ${page}`);
    }
  }
});
