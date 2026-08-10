"use client";

import { useEffect, useState } from "react";
import { pickLang, type Lang } from "@/lib/i18n";

// Starts at "en" so server and first client render match, then follows the browser.
export function useLang(): Lang {
  const [lang, setLang] = useState<Lang>("en");

  useEffect(() => {
    setLang(pickLang(navigator.language));
  }, []);

  return lang;
}
