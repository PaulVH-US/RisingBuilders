import { NextResponse } from "next/server";
import { createClient } from "~/lib/supabase/server";

// Handles the OAuth redirect from Supabase: exchanges the auth code for a
// session, then routes onboarded users to the feed and new ones to setup.
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=oauth`);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    return NextResponse.redirect(
      `${origin}/login?error=${encodeURIComponent(error.message)}`,
    );
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let destination = "/onboarding";
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", user.id)
      .maybeSingle();
    destination = profile ? "/projects" : "/onboarding";
  }

  return NextResponse.redirect(`${origin}${destination}`);
}
