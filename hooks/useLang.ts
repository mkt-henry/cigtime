"use client";

import { useEffect, useState } from "react";
import { isLang, pickLang, type Lang } from "@/lib/i18n";

const STORAGE_KEY = "cigtime_lang";
const CHANGE_EVENT = "cigtime:lang";

function currentLang(): Lang {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (isLang(saved)) return saved;
  } catch {
    // Storage can be blocked; fall back to the browser language.
  }
  return pickLang(navigator.language);
}

// Remembers the language picked in the footer and updates every component using useLang.
export function setLang(lang: Lang) {
  try {
    window.localStorage.setItem(STORAGE_KEY, lang);
  } catch {
    // Still switch for this page view even if it cannot be remembered.
  }
  window.dispatchEvent(new CustomEvent<Lang>(CHANGE_EVENT, { detail: lang }));
}

// Starts at "en" so server and first client render match, then follows the saved choice or the browser.
export function useLang(): Lang {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const apply = (next: Lang) => {
      setLangState(next);
      document.documentElement.lang = next;
    };
    apply(currentLang());
    const onChange = (event: Event) => apply((event as CustomEvent<Lang>).detail);
    window.addEventListener(CHANGE_EVENT, onChange);
    return () => window.removeEventListener(CHANGE_EVENT, onChange);
  }, []);

  return lang;
}
