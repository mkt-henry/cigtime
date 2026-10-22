"use client";

import { useEffect, useState } from "react";
import { getOrCreateAnonymousUser, IDENTITY_EVENT } from "@/lib/anonymous";
import type { AnonymousUser } from "@/lib/types";

export function useAnonymousUser() {
  const [user, setUser] = useState<AnonymousUser | null>(null);

  useEffect(() => {
    function read() {
      try {
        setUser(getOrCreateAnonymousUser());
      } catch {
        setUser({ id: `anon_${Date.now().toString(36)}`, nickname: "Quiet Signal" });
      }
    }

    read();
    window.addEventListener(IDENTITY_EVENT, read);
    return () => window.removeEventListener(IDENTITY_EVENT, read);
  }, []);

  return user;
}
