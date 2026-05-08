"use client";

import { useCallback, useEffect, useState } from "react";
import { getMutedUsers, muteUser } from "@/lib/storage";

export function useMutedUsers() {
  const [mutedUsers, setMutedUsers] = useState<string[]>([]);

  useEffect(() => {
    setMutedUsers(getMutedUsers());
  }, []);

  const mute = useCallback((anonymousUserId: string) => {
    muteUser(anonymousUserId);
    setMutedUsers(getMutedUsers());
  }, []);

  return { mutedUsers, mute };
}
