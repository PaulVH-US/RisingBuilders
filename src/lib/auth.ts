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

// Whether the current user is a platform admin. Reads the `admins` table, which
// only ever returns the caller's own row under RLS (admins_select_own).
export async function isAdmin(): Promise<boolean> {
  const user = await getUser();
  if (!user) return false;

  const supabase = await createClient();
  const { data } = await supabase
    .from("admins")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();
  return Boolean(data);
}

// Guard for admin-only pages. Requires a signed-in, onboarded builder who is
// also an admin; otherwise redirects to the feed. Returns the admin's profile.
export async function requireAdmin(): Promise<Profile> {
  const profile = await requireProfile();
  if (!(await isAdmin())) redirect("/projects");
  return profile;
}

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

// "Active this week" signal (PRD 6.6) derived from last_active_at.
export function isActiveThisWeek(lastActiveAt: string): boolean {
  return Date.now() - new Date(lastActiveAt).getTime() < WEEK_MS;
}
