"use client";

import { useEffect, useRef, useState } from "react";
import { useAccount } from "@/hooks/useAccount";
import { useLang } from "@/hooks/useLang";
import { signInWithGoogle, signOut } from "@/lib/account";
import { t } from "@/lib/i18n";

export function AccountMenu() {
  const copy = t(useLang());
  const { ready, session } = useAccount();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function close(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, [open]);

  const email = session?.user.email ?? "";

  async function handleSignIn() {
    setBusy(true);
    try {
      await signInWithGoogle();
    } catch {
      setBusy(false);
    }
  }

  async function handleSignOut() {
    setBusy(true);
    try {
      await signOut();
    } finally {
      setBusy(false);
      setOpen(false);
    }
  }

  return (
    <div className="relative" ref={rootRef}>
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label={session ? copy.accountSignedInAs(email) : undefined}
        disabled={!ready}
        onClick={() => setOpen((value) => !value)}
        className="flex h-10 items-center rounded-full px-3 transition hover:text-mist disabled:opacity-60"
      >
        {session ? (
          <span className="grid h-7 w-7 place-items-center rounded-full bg-sodium/20 text-xs font-semibold text-sodium">
            {(email[0] ?? "·").toUpperCase()}
          </span>
        ) : (
          copy.navSignIn
        )}
      </button>
      {open ? (
        <div
          role="dialog"
          className="absolute right-0 top-full z-30 mt-2 w-72 max-w-[calc(100vw-2.5rem)] rounded-2xl border border-white/10 bg-slate p-5 text-left shadow-soft"
        >
          {session ? (
            <>
              <p className="text-xs text-fog">{copy.accountSignedInLabel}</p>
              <p className="mt-1 truncate text-sm text-mist">{email}</p>
              <p className="mt-3 text-xs leading-relaxed text-fog">{copy.accountStillAnonymous}</p>
              <button
                type="button"
                disabled={busy}
                onClick={handleSignOut}
                className="mt-4 h-10 w-full rounded-full border border-white/20 text-sm font-semibold text-mist transition hover:border-white/45 disabled:opacity-50"
              >
                {copy.accountSignOut}
              </button>
            </>
          ) : (
            <>
              <p className="text-sm leading-relaxed text-mist">{copy.accountPitch}</p>
              <button
                type="button"
                disabled={busy}
                onClick={handleSignIn}
                className="mt-4 flex h-10 w-full items-center justify-center gap-2 rounded-full bg-mist text-sm font-semibold text-asphalt transition hover:bg-white disabled:opacity-50"
              >
                <GoogleMark />
                {copy.accountContinueGoogle}
              </button>
            </>
          )}
        </div>
      ) : null}
    </div>
  );
}

function GoogleMark() {
  return (
    <svg aria-hidden="true" width="16" height="16" viewBox="0 0 48 48">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
  );
}
