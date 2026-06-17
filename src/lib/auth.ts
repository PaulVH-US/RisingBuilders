import { redirect } from "next/navigation";
import { createClient } from "~/lib/supabase/server";
import type { Profile } from "~/lib/types";

// Returns the authenticated auth user, or null if signed out.
export async function getUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

// Returns the current user's profile, or null if signed out / not onboarded.
export async function getProfile(): Promise<Profile | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();
  return data;
}

// Guard for pages that need a signed-in, onboarded builder. Redirects to the
// right place when either is missing and otherwise returns the profile.
export async function requireProfile(): Promise<Profile> {
  const user = await getUser();
  if (!user) redirect("/login");

  const profile = await getProfile();
  if (!profile) redirect("/onboarding");
  return profile;
}

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

// "Active this week" signal (PRD 6.6) derived from last_active_at.
export function isActiveThisWeek(lastActiveAt: string): boolean {
  return Date.now() - new Date(lastActiveAt).getTime() < WEEK_MS;
}
