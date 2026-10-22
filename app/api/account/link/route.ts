import { NextResponse } from "next/server";
import { createClientId } from "@/lib/id";
import { isAnonymousUserId } from "@/lib/requestValidation";
import { getLinkedAnonymousIds, getRequestUser } from "@/lib/server/account";
import { createServiceSupabaseClient } from "@/lib/supabase/server";

const NO_STORE = { "Cache-Control": "private, no-store" };

// Attaches this browser's anonymous identity to the signed-in account. If the identity
// already belongs to a different account (shared browser), the browser gets a fresh
// identity for this account instead of taking over the other person's history.
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body || !isAnonymousUserId(body.anonymousUserId)) {
    return NextResponse.json({ error: "Invalid anonymous user." }, { status: 400 });
  }

  const supabase = createServiceSupabaseClient();
  if (!supabase) {
    return NextResponse.json({ error: "DB not available." }, { status: 503 });
  }

  const user = await getRequestUser(supabase, request);
  if (!user) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }

  let anonymousUserId: string = body.anonymousUserId;
  const { error: insertError } = await supabase
    .from("account_links")
    .upsert({ anonymous_user_id: anonymousUserId, user_id: user.id }, { onConflict: "anonymous_user_id", ignoreDuplicates: true });
  if (insertError) {
    return NextResponse.json({ error: "Could not link this browser." }, { status: 500 });
  }

  const { data: link } = await supabase
    .from("account_links")
    .select("user_id")
    .eq("anonymous_user_id", anonymousUserId)
    .single();

  let switched = false;
  if (link && link.user_id !== user.id) {
    anonymousUserId = `anon_${createClientId()}`;
    const { error } = await supabase.from("account_links").insert({ anonymous_user_id: anonymousUserId, user_id: user.id });
    if (error) {
      return NextResponse.json({ error: "Could not link this browser." }, { status: 500 });
    }
    switched = true;
  }

  const linked = await getLinkedAnonymousIds(supabase, user.id);
  return NextResponse.json({ anonymousUserId, switched, linkedCount: linked.length }, { headers: NO_STORE });
}
