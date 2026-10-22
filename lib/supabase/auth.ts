import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null | undefined;

// One browser client owns the sign-in session. It uses its own storage key so it
// never collides with the realtime clients the rooms create.
export function getAuthClient() {
  if (client !== undefined) return client;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  client =
    url && anonKey && typeof window !== "undefined"
      ? createClient(url, anonKey, {
          auth: { flowType: "pkce", persistSession: true, detectSessionInUrl: true, storageKey: "cigtime.auth" },
        })
      : null;
  return client;
}
