"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { useAnonymousUser } from "@/hooks/useAnonymousUser";
import { trackEvent } from "@/lib/analytics";

export function AnalyticsTracker() {
  const pathname = usePathname();
  const anonymousUser = useAnonymousUser();
  const lastPath = useRef<string | null>(null);

  useEffect(() => {
    if (!anonymousUser || lastPath.current === pathname) return;
    lastPath.current = pathname;

    if (pathname === "/") {
      void trackEvent({ anonymousUserId: anonymousUser.id, eventName: "landing_view" });
    } else if (pathname === "/rooms") {
      void trackEvent({ anonymousUserId: anonymousUser.id, eventName: "rooms_view" });
    }
  }, [anonymousUser, pathname]);

  return null;
}
