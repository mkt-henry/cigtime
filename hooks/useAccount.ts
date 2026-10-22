"use client";

import { useSyncExternalStore } from "react";
import { getAccountState, subscribeAccount, type AccountState } from "@/lib/account";

const SERVER_STATE: AccountState = { ready: false, session: null };

export function useAccount() {
  return useSyncExternalStore(subscribeAccount, getAccountState, () => SERVER_STATE);
}
