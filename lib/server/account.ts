import type { SupabaseClient } from "@supabase/supabase-js";

const MAX_LINKED_IDS = 50;

// Resolves the signed-in Supabase Auth user from an `Authorization: Bearer <access token>`
// header. Returns null for anonymous requests or invalid/expired tokens.
export async function getRequestUser(supabase: SupabaseClient, request: Request) {
  const header = request.headers.get("authorization") ?? "";
  const token = header.toLowerCase().startsWith("bearer ") ? header.slice(7).trim() : "";
  if (!token) return null;

  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) return null;
  return data.user;
}

export async function getLinkedAnonymousIds(supabase: SupabaseClient, userId: string) {
  const { data } = await supabase
    .from("account_links")
    .select("anonymous_user_id")
    .eq("user_id", userId)
    .order("linked_at", { ascending: false })
    .limit(MAX_LINKED_IDS);
  return (data ?? []).map((row) => row.anonymous_user_id as string);
}
