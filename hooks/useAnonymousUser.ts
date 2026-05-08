"use client";

import { useEffect, useState } from "react";
import { getOrCreateAnonymousUser } from "@/lib/anonymous";
import type { AnonymousUser } from "@/lib/types";

export function useAnonymousUser() {
  const [user, setUser] = useState<AnonymousUser | null>(null);

  useEffect(() => {
    try {
      setUser(getOrCreateAnonymousUser());
    } catch {
      setUser({ id: `anon_${Date.now().toString(36)}`, nickname: "Quiet Signal" });
    }
  }, []);

  return user;
}
